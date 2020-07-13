let router = require('express').Router();

router.get('/', function(req, res) {
	res.render('index', { title: 'Bauart test server' });
});

let data = require('../query/data');

router.post('/apod', data.addAPOD);
router.post('/earth', data.addEarth);
router.post('/mars', data.addMars);

module.exports = router;
