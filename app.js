const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const index = require('./routes/index');
const indexRouter = index.router;
const cookieParser = require('cookie-parser');

const app = express();

const cors = require('cors');
app.use(cors());

app.io = index.io;

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);

const createError = require('http-errors');
app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;
