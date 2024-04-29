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
{ setData, getData } = require('./getScripts');

app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./data/uploads/'));

Object.keys(dataPaths).forEach(dataPath => {
	app.get(`/${dataPath}`, (req, res) => {
		const
		data = getData(dataPath);
		
		res.json(data)
	});

	app.post(`/${dataPath}`, (req, res) => {
		const
		newItem = req.body,
		data = getData(dataPath);

		console.log(newItem)
		if (newItem) {
			data.push(newItem);

			if (setData(dataPath, data)) {
				console.log(111)
				res.status(200).json(newItem.id);

				return true;
			}
		}

		console.log(data)
		res.status(500).json(false);
	});
});

app.delete(`/${dataPaths.teachersMaterials}/:id`, (req, res) => {
	console.log('startDeliting')
	const itemId = +req.params.id;
	let data = getData(dataPaths.teachersMaterials);

	console.log(itemId)
	if (data.findIndex(item => item.id === itemId) < 0) return res.status(403).json(false)
	data = data.filter(item => item.id != itemId)

	console.log(data)
	if (setData(dataPaths.teachersMaterials, data)) {
		console.log('yea')
		res.status(200).json(true);
	} else {
		console.log('no')
		res.status(500)
	}
})


app.get('/teachersMaterials/:id', (req, res) => {
	let data = getData(dataPaths.teachersMaterials);

	data = data.find(material => material.id === req.body.id);

	res.json(data);
});

app.get('/teacher/:id', (req, res) => {
	const
	people = getData(dataPaths.teachers),
	person = people.find(p => p.id === +req.params.id),
	{name} = person;

	if (person) return res.json({name})

	res.status(404).json(false);
})
app.get('/student/:id', (req, res) => {
	const
	people = getData(dataPaths.students),
	person = people.find(p => p.id === +req.params.id),
	{name} = person;

	if (person) return res.json({name})

	res.status(404).json(false);
})


app.post('/teachersMaterials/:id', (req, res) => {
	const
	teachersMaterials = getData(dataPaths.teachersMaterials),
	teachersMaterialIndex = teachersMaterials.findIndex(teachersMaterial => teachersMaterial.id === +req.params.id);

	if (teachersMaterialIndex < 0) return res.status(404).json(false);
	teachersMaterials[teachersMaterialIndex] = req.body;
	
	setData(dataPaths.teachersMaterials, teachersMaterials);
	res.json(true);
})

app.post('/logIn', (req, res) => {
	const
	teachers = getData(dataPaths.teachers),
	students = getData(dataPaths.students),
	teacher = teachers.find(teacher => teacher.name === req.body.name)
	person = teacher ? { ...teacher, type: 'teacher' } : { ...students.find(student => student.name === req.body.name), type: 'student' };

    if (person) {
        const { id, password, type } = person;

		console.log(person);

        if (password === req.body.password)
            return res.json({ id, type });

        res.status(403).json(false);
    }
    else res.status(404).json(false);
})

app.listen(port, e => console.log(`DB keeps on ${port}`));