const
express = require('express'),
getData = require('./getData'),
setData = require('./setData'),
deleteText = require('./deleteText'),
router = express.Router(),
fs = require('fs');

const getTeachers = e => getData('teachers');
const setTeachers = data => setData('teachers', data);

router.get('/', (req, res) => {
	const data = getTeachers();
	
	res.json(data)
})
router.get('/:id', (req, res) => {
	const
	people = getTeachers(),
	person = people.find(p => p.id === +req.params.id),
	{name} = person;

	if (person) return res.json({name})

	res.status(404).json(false);
})
router.delete('/:id', (req, res) => {
	const people = getTeachers();
	let teachersMaterials = getData('teachersMaterials');
	const deletingMaterial = teachersMaterials.find(material => material.teacherID === +req.params.id);

	deletingMaterial.materials.forEach(material => deleteText(material.textID));

	teachersMaterials = teachersMaterials.filter(material => material.teacherID != +req.params.id);
	setData('teachersMaterials', teachersMaterials);

	res.status(setTeachers(people.filter(person => person.id != +req.params.id)) ? 200 : 500).json({type: 'teachers'});
})

module.exports = router;