const
express = require('express'),
getData = require('./getData'),
setData = require('./setData'),
router = express.Router();

const getStudents = e => getData('students');
const setStudents = data => setData('students', data);

router.get('/', (req, res) => {
	const data = getStudents();
	
	res.json(data)
})
router.get('/:id', (req, res) => {
	const
	people = getStudents(),
	person = people.find(p => p.id === +req.params.id),
	{name} = person;

	if (person) return res.json({name})

	res.status(404).json(false);
})
// router.post('/:id', (req, res) => {
// 	const
// 		studentID = +req.params.id,
// 		whatChange = req.body;

// 	if (studentID) {
// 		const
// 			students = getStudents(),
// 			student = students.find(student => student.id === studentID);

// 		if (!student) return res.status(404).json('student not found');

// 		Object.keys(whatChange).forEach(key => {
// 			if (key !== 'password' || (key === 'password' && !!whatChange[key]))
// 				student[key] = whatChange[key]
// 		});

// 		if (setStudents(students))
// 			return res.status(200).json({ id: studentID });
// 	}

// 	res.status(500).json(false);
// })
router.delete('/:id', (req, res) => {
	const people = getStudents();

	res.sendStatus(setStudents(people.filter(person => person.id != +req.params.id)) ? 200 : 500);
})

module.exports = router;