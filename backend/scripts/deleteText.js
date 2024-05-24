const
	fs = require('fs'),
	path = require('path')

const deleteText = (filePath) => {
    let isOk = true;
	filePath = path.join(__dirname, '../data/texts/', filePath + '.txt');

    console.log(filePath)
	fs.unlink(filePath, err => isOk = err ? false : isOk);

    return isOk;
}

module.exports = deleteText