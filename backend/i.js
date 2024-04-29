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

const defaultUserData = {
	name: 'noName',
	avatar: null,
	communities: [],
	friends: [],
	patterns: []
};


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

		if (newItem) {
			data.push(newItem);

			if (setData(dataPath, data)) return res.json(newItem.id);
		}

		res.status(500).json(false);
	});

	app.delete(`/${dataPath}/:id`, (req, res) => {
		const itemId = +req.params.id;
		let data = getData(dataPath);

		if (data.findIndex(item => item.id === itemId) < 0) return res.json(false)
		data = data.filter(item => item.id != itemId)

		setData(dataPath, data);
		res.json(true);
	})
});


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