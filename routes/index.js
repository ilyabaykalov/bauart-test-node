let router = require('express').Router();

router.get('/', function (req, res) {
    res.render('index', {title: 'Journal server'})
});

router.get('/test', function (req, res) {
    res.send('<h1>simple text</h1>')
});

// let account = require('../query/account');

// router.get('/api/', account.createAccount());

module.exports = router;
