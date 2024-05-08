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

	console.log('textID', material?.textID)
	if (material?.textID)
		text = fs.readFileSync(`./data/texts/${material.textID}.txt`, {encoding: 'utf8'});
	else {
		res.send(500)
		return;
	}

	console.log(text)
	if (text) res.json(JSON.parse(text))
	else res.status(404)
})
app.post('/text/:id', (req, res) => {
	const
	itemId = +req.params.id,
	data = getData(dataPaths.teachersMaterials),
	dataIndex = data.findIndex(data => data.teacherID === +req.query.teacherID),
	material = data[dataIndex].materials.find(material => material.id === itemId);

	console.log(req.body)
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

app.post('/logIn', (req, res) => {
	const
	teachers = getData(dataPaths.teachers),
	students = getData(dataPaths.students),
	teacher = teachers.find(teacher => teacher.name === req.body.name),
	person = teacher ? {
		...teacher,
		type: dataPaths.teachers
	} : {
		...students.find(student => student.name === req.body.name),
		type: dataPaths.students
	};

    if (person) {
        const { id, password, type } = person;

        if (password === req.body.password)
            return res.json({ id, type });

        res.status(403).json(false);
    }
    else res.status(404).json(false);
})
app.post('/signUp', (req, res) => {
	if (req.body.type === 'teacher') {
		const
		teachers = getData(dataPaths.teachers),
		teacher = teachers.find(teacher => teacher.name === req.body.name)

		if (teacher) return res.status(302)
		if (setData(dataPaths.teachers, teachers.push(req.body))) return res.status(201)
		return res.status(500)
	}

	console.log('here')
	const
	students = getData(dataPaths.students),
	student = students.find(student => student.name === req.body.name)

    if (student) return res.status(302)
	if (req.body.password !== req.body.confirmPassword) return res.status(412)
	if (setData(dataPaths.students, students.push(req.body))) return res.status(201)
	return res.status(500)
})

app.listen(port, e => console.log(`DB keeps on ${port}`));