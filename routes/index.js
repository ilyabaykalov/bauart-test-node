let router = require('express').Router();

router.get('/', function (req, res) {
	res.render('index', { title: 'Journal server' });
});

router.get('/test', function (req, res) {
	res.send('<h1>simple text</h1>');
});

let chapter = require('../query/chapter'),
	colors = require('../query/colors'),
	lessons = require('../query/lessons');

router.get('/chapters/only', chapter.getAllChapters);
router.get('/chapters', chapter.getAllData);
router.post('/chapters', chapter.addChapter);
router.patch('/chapters/:id', chapter.updateChapter);
router.delete('/chapters/:id', chapter.deleteChapter);

router.get('/colors', colors.getColors);

router.post('/lessons', lessons.addLesson);
router.delete('/lessons/:id', lessons.deleteLesson);

module.exports = router;
