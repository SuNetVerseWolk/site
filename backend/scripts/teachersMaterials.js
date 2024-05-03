const { error } = require('console');

const
    express = require('express'),
    getData = require('./getData'),
    setData = require('./setData'),
    router = express.Router(),
    fs = require('fs');

const getTeachersMaterials = e => getData('teachersMaterials');
const setTeachersMaterials = data => setData('teachersMaterials', data);

router.get('/', (req, res) => {
    const data = getTeachersMaterials();

    res.json(data.find(teachersMaterial => teachersMaterial.teacherID === +req.query.teacherID)?.materials || []);
})

router.post('/', (req, res) => {
    const defaultData = {
        text: ''
    }
    const
        newItem = req.body,
        data = getTeachersMaterials(),
        findDataIndex = e => data.findIndex(data => data.teacherID === +req.query.teacherID),
        dataIndex = findDataIndex();

    if (newItem) {
        const item = { ...newItem, textID: Date.now() }

        if (dataIndex < 0)
            data.push({ teacherID: +req.query.teacherID, materials: [item] })
        else
            data[dataIndex].materials.push(item);

        if (setTeachersMaterials(data)) {
            fs.writeFile(`./data/texts/${item.textID}.txt`, JSON.stringify(defaultData), { encoding: 'utf8' }, error => {
                if (error) {
                    console.log(error)
                    res.status(500).json(newItem);
                    return;
                }

                res.status(200).json(item.id);
            })

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

    fs.unlink(`./data/texts/${data[dataIndex].materials[teachersMaterialIndex].textID}.txt`, error => {
        if (error) {
            console.log(error)
            res.status(500).json(false);
            return;
        }

        data[dataIndex].materials = data[dataIndex].materials.filter(item => item.id != itemId)

        if (setTeachersMaterials(data)) {
            res.status(200).json(true);
        } else {
            res.status(500).json(false);
        }
    })
})

module.exports = router;