const
	port = process.env.PORT || 3001,
	express = require('express'),
	cors = require('cors'),
	app = express(),
	dataPaths = {
		students: 'students',
		teachers: 'teachers',
		teachersMaterials: 'teachersMaterials'
	},
	{ getData, setData } = require('./getScripts'),
	studentsRoute = require('./scripts/students'),
	teachersRoute = require('./scripts/teachers'),
	teachersMaterialsRoute = require('./scripts/teachersMaterials'),
	fs = require('fs');

app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./data/uploads/'));
app.use('/students', studentsRoute);
app.use('/teachers', teachersRoute);
app.use('/teachersMaterials', teachersMaterialsRoute);

app.get('/text/:id', async (req, res) => {
	const
		itemId = +req.params.id,
		data = getData(dataPaths.teachersMaterials),
		dataIndex = data.findIndex(data => data.teacherID === +req.query.teacherID),
		material = data[dataIndex]?.materials.find(material => material.id === itemId);
	let text = '';

	if (material?.textID)
		text = fs.readFileSync(`./data/texts/${material.textID}.txt`, { encoding: 'utf8' });
	else {
		res.send(500)
		return;
	}

	if (text) res.json(JSON.parse(text))
	else res.status(404)
})
app.post('/text/:id', (req, res) => {
	const
		itemId = +req.params.id,
		data = getData(dataPaths.teachersMaterials),
		dataIndex = data.findIndex(data => data.teacherID === +req.query.teacherID),
		material = data[dataIndex].materials.find(material => material.id === itemId);

	if (material.textID && req.body.text)
		fs.writeFile(`./data/texts/${material.textID}.txt`, JSON.stringify(req.body), error => {
			if (error) res.status(500)

			res.status(200).json({ id: itemId })
		});
	else {
		res.status(500)
		return;
	}
})

app.post('/user/change', (req, res) => {
	const
		userID = +req.query.id,
		userType = req.query.type,
		whatChange = req.body;

	if (userID && userType) {
		const
			users = getData(userType),
			user = users.find(user => user.id === userID);

		if (!user) return res.status(404).json('user not found');

		Object.keys(whatChange).forEach(key => user[key] = whatChange[key]);

		if (setData(userType, users))
			return res.status(200).json({ id: userID, type: userType });
	}

	res.status(500).json(false);
})
app.post('/logIn', (req, res) => {
	const
		teachers = getData(dataPaths.teachers),
		teacher = teachers.find(teacher => teacher.name === req.body.name);
	let person = undefined;

	if (!!teacher) {
		person = {
			...teacher,
			type: dataPaths.teachers
		}
	} else {
		const student = getData(dataPaths.students).find(student => student.name === req.body.name);

		person = student ? {
			...student,
			type: dataPaths.students
		} : undefined;
	}

	if (!!person) {
		const { id, password, type } = person;

		if (password === req.body.password)
			return res.json({ id, type });

		res.status(403).json(false);
	}
	else res.status(404).json(false);
})
app.post('/signUp', (req, res) => {
	const bodyKeys = Object.keys(req.body);
	if (!(bodyKeys.includes('name') && bodyKeys.includes('password') && bodyKeys.includes('confirmPassword'))) {
		return res.status(400).json(false);
	}
	if (req.body.password !== req.body.confirmPassword) return res.status(412).json(false);
	const user = { name: req.body.name, password: req.body.password, id: Date.now() }

	if (req.body.type === 'teacher') {
		const
			teachers = getData(dataPaths.teachers),
			teacher = teachers.find(teacher => teacher.name === req.body.name)

		if (teacher) return res.status(302)
		if (setData(dataPaths.teachers, teachers.push(user))) return res.status(201).json({ id: user.id, type: dataPaths.teachers });
		return res.status(500).json("not added")
	}

	const
		students = getData(dataPaths.students),
		student = students.find(student => student.name === req.body.name)

	if (student) {
		if(student.password !== req.body.password) return res.status(302).json(false);
		return res.status(200).json({ id: student.id, type: dataPaths.students });
	}
	if (setData(dataPaths.students, [...students, user])) return res.status(201).json({ id: user.id, type: dataPaths.students });
	res.status(500).json(false);
})

app.listen(port, e => console.log(`Запущено!!!`));