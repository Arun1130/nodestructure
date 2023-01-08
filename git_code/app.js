var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose')
const common = require('./helpers/common')
var config = require('./config/devel')



var indexRouter = require('./routes/index');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);


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

app.listen(config.port,function(err,data){
  if(!err){
    console.log("8000 running")
  }
  else{
    console.log(err)
  }
})

mongoose.connect(config.db, error => {
  if (error) {s
    console.error('not connected')
    throw error
  }
  else{
    console.log("Db connected time is -->",Date());
  }
})

console.log("--------",common.encrypt("arun@gmail.com"));

console.log("--------",common.decrypt("0rZQ1RRlzCrz9qdmelRCHg== "));


module.exports = app;
