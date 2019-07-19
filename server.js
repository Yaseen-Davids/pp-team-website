var createError = require('http-errors');
var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');
require('dotenv').config()

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// User model
var User = require('./models/user');
var Notes = require('./models/notes');
// Calender Model
// var Calender = require('./models/calender');


// Fetch database
var config = require('./config/database');
// Connect to database
mongoose.connect(config.database, { useNewUrlParser: true });

let db = mongoose.connection;

// check connection to db
db.once('open', function(){
    console.log("Successfully Connected to Database");
});

// Check for db errors
db.on('error', function(err){
    console.log(err);
});

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
