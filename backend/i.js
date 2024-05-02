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
{ getData } = require('./getScripts'),
studentsRoute = require('./scripts/students'),
teachersRoute = require('./scripts/teachers'),
teachersMaterialsRoute = require('./scripts/teachersMaterials');

app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./data/uploads/'));
app.use('/students', studentsRoute);
app.use('/teachers', teachersRoute);
app.use('/teachersMaterials', teachersMaterialsRoute);

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

app.listen(port, e => console.log(`DB keeps on ${port}`));