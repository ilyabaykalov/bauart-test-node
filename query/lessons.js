let config = require('../config/config');

let db = config.db;

module.exports = {
	addLesson: addLesson
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
