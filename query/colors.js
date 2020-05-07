let config = require('../config/config');

let db = config.db;

module.exports = {
	getColors: getColors
};

function getColors(req, res) {
	return db.any(
		'SELECT * FROM colors')
		.then(colors => {
			res.status(res.statusCode)
				.json([...colors]);
		})
		.catch(error => {
			res.status(res.statusCode)
				.json({
					status: 'error',
					error
				});
		});
}
