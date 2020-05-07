let config = require('../config/config');

let db = config.db;

module.exports = {
	addLesson: addLesson,
	deleteLesson: deleteLesson
};

function addLesson(req, res) {
	db.one(
		'INSERT INTO public.lessons(chapter_id, title, completed)VALUES (${chapterId}, ${title}, ${completed}) RETURNING id, title, completed', {
			chapterId: req.body.chapterId,
			title: req.body.title,
			completed: false
		}
	).then(lesson => {
		res.status(res.statusCode)
			.json(lesson);
	}).catch(error => {
		res.status(res.statusCode)
			.json({
				status: 'error',
				error
			});
	});
}

function updateLesson(req, res) {
	let id = req.params.id;

	db.result(
		'UPDATE chapters SET name=${name} WHERE id = ${id}', {
			id: id,
			name: req.body.name
		}
	).then(result => {
		if (result.rowCount === 1)
			res.status(res.statusCode).json();
		else throw 'Не одна строка не была изменена';
	}).catch(error => {
		res.status(400)
			.json({ error });
	});
}

function deleteLesson(req, res) {
	let id = req.params.id;

	db.result(
		'DELETE FROM lessons WHERE id = $1', id
	).then(result => {
		if (result.rowCount === 1)
			res.status(res.statusCode).json();
		else throw 'Не одна строка не была изменена';
	}).catch(error => {
		res.status(400)
			.json({ error });
	});
}
