const
express = require('express'),
getData = require('./getData'),
router = express.Router();

const getTeachers = e => getData('teachers');

router.get('/', (req, res) => {
	const data = getTeachers();
	
	res.json(data)
})
router.get('/:id', (req, res) => {
	const
	people = getTeachers(),
	person = people.find(p => p.id === +req.params.id),
	{name} = person;

	console.log('teachers')
	if (person) return res.json({name})

	res.status(404).json(false);
})

module.exports = router;