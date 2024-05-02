const
express = require('express'),
getData = require('./getData'),
setData = require('./setData'),
router = express.Router();

const getTeachersMaterials = e => getData('teachersMaterials');
const setTeachersMaterials = data => setData('teachersMaterials', data);

router.get('/', (req, res) => {
	const data = getTeachersMaterials();
	
	res.json(data)
})

router.get('/:id', (req, res) => {
	let data = getTeachersMaterials();

	data = data.find(material => material.id === req.body.id);

	res.json(data);
});

router.post('/', (req, res) => {
    const
    newItem = req.body,
    data = getTeachersMaterials();

    if (newItem) {
        data.push(newItem);

        if (setTeachersMaterials(data)) {
            res.status(200).json(newItem.id);

            return true;
        }
    }

    res.status(500).json(false);
});

router.post('/:id', (req, res) => {
	const
	teachersMaterials = getTeachersMaterials(),
	teachersMaterialIndex = teachersMaterials.findIndex(teachersMaterial => teachersMaterial.id === +req.params.id);

	if (teachersMaterialIndex < 0) return res.status(404).json(false);
	teachersMaterials[teachersMaterialIndex] = req.body;
	
	if (setTeachersMaterials(teachersMaterials)) {
        res.status(200).json(true);
    } else res.status(500).json(false);
})

router.delete('/:id', (req, res) => {
	const itemId = +req.params.id;
	let data = getTeachersMaterials();

	if (data.findIndex(item => item.id === itemId) < 0) return res.status(403).json(false)
	data = data.filter(item => item.id != itemId)

	if (setTeachersMaterials(data)) {
		res.status(200).json(true);
	} else {
		res.status(500)
	}
})

module.exports = router;