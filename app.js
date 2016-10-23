var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var routes = require('./routes');
var favicon = require('serve-favicon');

var app = express();

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// workaround because heroku doesn't work with __dirname
// http://stackoverflow.com/questions/27343331/deploy-nodejs-on-heroku-fails-serving-static-files
process.env.PWD = process.cwd();
app.use(express.static(path.join(process.env.PWD, './client')));
app.use(favicon(path.join(process.env.PWD, 'client', 'favicon.ico')));

// set routes
require('./routes')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler.
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    console.log(err.stack);

    res.status(err.status || 500);
    res.status('error in development', {
      message: err.stack,
      error: err
    });
  });
}

// production error handler.
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json('error in production', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
