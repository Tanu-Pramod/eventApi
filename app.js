var createError = require('http-errors');
var express = require('express');
var cors = require('cors')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
const multer = require('multer');

var indexRouter = require('./routes/index');
var guestIndexRouter = require('./routes/guestIndex');
var usersRoute = require('./routes/users');

var app = express();
app.use(cors());



app.use(session({
  secret: '2C44-4D44-WppQ38S',
  resave: true,
  saveUninitialized: true
}));

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/CRM');

const moment = require('moment')
app.locals.moment = moment;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('./public/'));
app.use('/', indexRouter);
app.use('/guestIndex', guestIndexRouter);
app.use('/user', usersRoute);





// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
