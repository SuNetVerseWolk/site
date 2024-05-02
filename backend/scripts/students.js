const
express = require('express'),
getData = require('./getData'),
router = express.Router();

const getStudents = e => getData('students');

router.get('/', (req, res) => {
	const data = getStudents();
	
	res.json(data)
})
router.get('/:id', (req, res) => {
	const
	people = getStudents(),
	person = people.find(p => p.id === +req.params.id),
	{name} = person;

	console.log('students')
	if (person) return res.json({name})

	res.status(404).json(false);
})

module.exports = router;