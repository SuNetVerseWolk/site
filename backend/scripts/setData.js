const
	fs = require('fs'),
	path = require('path')

const setData = (filePath, data) => {
	data = JSON.stringify(data);

	if (!data) return false

	fs.writeFileSync(
		path.join(__dirname, '../data', filePath + '.json'),
		data,
		{encoding: 'utf8'}
	);
	return true
}

module.exports = setData