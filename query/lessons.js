let config = require('../config/config');

let db = config.db;

module.exports = {
	addLesson: addLesson,
	updateLesson: updateLesson,
	addLink: addLink,
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
		'UPDATE lessons ' +
		'SET title=${title}, ' +
		'homework=${homework}, ' +
		'completed=${completed}, ' +
		'lesson_mark=${lessonMark}, ' +
		'homework_mark=${homeworkMark} ' +
		'WHERE id = ${id}', {
			id: id,
			title: req.body.title,
			homework: req.body.homework,
			completed: req.body.completed,
			lessonMark: req.body.lessonMark,
			homeworkMark: req.body.homework ? req.body.homeworkMark : null
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

function addLink(req, res) {
	let id = req.params.id;

	db.result(
		'UPDATE lessons ' +
		'SET git_link=${gitLink} ' +
		'WHERE id = ${id}', {
			id: id,
			gitLink: req.body.gitLink
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
