let router = require('express').Router();

router.get('/', function (req, res) {
	res.render('index', { title: 'Journal server' });
});

router.get('/test', function (req, res) {
	res.send('<h1>simple text</h1>');
});

let chapter = require('../query/chapter'),
	colors = require('../query/colors');

router.get('/chapters/get', chapter.getAllChapters);
router.get('/chapters', chapter.getAllData);
router.post('/chapters', chapter.addChapter);

router.get('/colors', colors.getColors);

module.exports = router;
