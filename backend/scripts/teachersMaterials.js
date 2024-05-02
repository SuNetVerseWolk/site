const
express = require('express'),
getData = require('./getData'),
setData = require('./setData'),
router = express.Router();

const getTeachersMaterials = e => getData('teachersMaterials');
const setTeachersMaterials = data => setData('teachersMaterials', data);

router.get('/', (req, res) => {
	const data = getTeachersMaterials();
	
	res.json(data.find(teachersMaterial => teachersMaterial.teacherID === +req.query.teacherID)?.materials || []);
})

// router.get('/:id', (req, res) => {
// 	let data = getTeachersMaterials();

// 	data = data.find(material => material.id === req.body.id);

// 	res.json(data);
// });

router.post('/', (req, res) => {
    const
    newItem = req.body,
    data = getTeachersMaterials(),
    findDataIndex = e => data.findIndex(data => data.teacherID === +req.query.teacherID),
    dataIndex = findDataIndex();

    if (newItem) {
        if (dataIndex < 0)
            data.push({teacherID: +req.query.teacherID, materials: [newItem]})
        else
            data[dataIndex].materials.push(newItem);

        if (setTeachersMaterials(data)) {
            res.status(200).json(newItem.id);

            return true;
        }
    }

    res.status(500).json(newItem);
});

router.post('/:id', (req, res) => {
	const
    itemId = +req.params.id,
	data = getTeachersMaterials(),
    dataIndex = data.findIndex(data => data.teacherID === +req.query.teacherID),
	teachersMaterialIndex = data[dataIndex].materials.findIndex(material => material.id === itemId);

	if (teachersMaterialIndex < 0) return res.status(403).json(false);
	data[dataIndex].materials[teachersMaterialIndex] = req.body;
	
	if (setTeachersMaterials(data)) {
        res.status(200).json(true);
    } else res.status(500).json(req.body);
})

router.delete('/:id', (req, res) => {
	const
    itemId = +req.params.id,
    data = getTeachersMaterials(),
    dataIndex = data.findIndex(data => data.teacherID === +req.query.teacherID),
    teachersMaterialIndex = data[dataIndex].materials.findIndex(material => material.id === itemId);

	if (teachersMaterialIndex < 0) return res.status(403).json(false)
	data[dataIndex].materials = data[dataIndex].materials.filter(item => item.id != itemId)

	if (setTeachersMaterials(data)) {
		res.status(200).json(true);
	} else {
		res.status(500).json(false);
	}
})

module.exports = router;