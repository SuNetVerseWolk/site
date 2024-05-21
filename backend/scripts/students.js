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
router.delete('/:id', (req, res) => {
	const people = getStudents();
	console.log("student", 'delete')

	res.sendStatus(setStudents(people.filter(person => person.id != +req.params.id)) ? 200 : 500);
})

module.exports = router;