let config = require('../config/config');

let db = config.db;

module.exports = {
	getAllChapters: getAllChapters,
	getAllData: getAllData,
	addChapter: addChapter
};

function getAllChapters(req, res) {
	return db.any(
		'SELECT * FROM chapters')
		.then(chapters => {
			res.status(res.statusCode)
				.json([...chapters]);
		})
		.catch(error => {
			res.status(res.statusCode)
				.json({
					status: 'error',
					error
				});
		});
}

function getAllData(req, res) {
	return db.any(
		`SELECT 
				ch.id, ch.name AS chapter_name, ch.color_id,
				c.id AS color_id, c.hex, c.name AS color_name,
				l.id AS lesson_id, l.chapter_id, l.title, l.homework, l.completed, l.lesson_mark, l.homework_mark
				FROM chapters ch
				LEFT JOIN colors c ON c.id = ch.color_id
				LEFT JOIN lessons l ON ch.id = l.chapter_id
				ORDER BY ch.id`)
		.then(rawData => {
			return rawData.map(data => {
				return {
					id: data.id,
					name: data.chapter_name,
					colorId: data.color_id,
					lesson: data.lesson_id ? {
						id: data.lesson_id,
						chapterId: data.chapter_id,
						title: data.title,
						homework: data.homework,
						completed: data.completed,
						lessonMark: data.lesson_mark,
						homeworkMark: data.homework_mark
					} : null,
					color: {
						id: data.color_id,
						hex: data.hex,
						name: data.color_name,
					}
				};
			});
		}).then(rawData => {
			return rawData.map((data) => {
				return {
					id: data.id,
					name: data.name,
					colorId: data.colorId,
					lessons: data.lesson ? [data.lesson] : null,
					color: data.color
				};
			});
		}).then(objData => {
			return objData.reduce((chapters, currentObject, index) => {
				if (index === 0) {
					chapters.push(currentObject);
				} else if (currentObject.id === chapters[chapters.length - 1].id) {
					chapters[chapters.length - 1].lessons.push(...currentObject.lessons);
				} else {
					chapters.push(currentObject);
				}
				return chapters;
			}, []);
		}).then(data => {
			res.status(res.statusCode)
				.json(data);
		}).catch(error => {
			res.status(res.statusCode)
				.json({
					status: 'error',
					error
				});
		});
}

function addChapter(req, res) {
	db.none('INSERT INTO chapters(name, color_id) VALUES(${name}, ${colorId})', {
		name: req.body.name,
		colorId: req.body.colorId
	}).then(() => {
		res.status(res.statusCode)
			.json({
				status: 'success',
				chapter: {
					name: req.body.name,
					colorId: req.body.colorId
				}
			});
	}).catch(error => {
		res.status(res.statusCode)
			.json({
				status: 'error',
				error
			});
	});
	// return db.(
	// 	'INSERT INTO chapters ' +
	// 	'(name, color_id) VALUES ' +
	// 	'($1, $2)',
	// 	[req.body.name, req.body.colorId])
	// 	.catch(error => {
	// 		res.status(res.statusCode)
	// 			.json({
	// 				status: 'error',
	// 				error
	// 			});
	// 	});
}
