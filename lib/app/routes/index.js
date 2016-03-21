'use strict';

var express = require('express'),
  app = express.Router();

var User = require('../../../models').User;

app.use(function(request, response, next) {
  request.isAuthenticated = function isAuthenticated() {
    return !!request.user;
  }
  if (request.session.user_id) {
    User.findById(request.session.user_id).then(function(user) {

      /* istanbul ignore else */
      if (user) {
        request.user = user;
      }

      next();
    });
  } else {
    next();
  }
});

app.use(require('../roles').middleware());

app.use(function(request, response, next) {
  response.locals.username = request.user ? request.user.username : 'world';
  next();
});

app.get("/", function(request, response) {
  response.render('index');
});

app.get('/partials/:template', function(req, res) {
  res.render(['partials', req.params.template].join('/'));
});

app.use('/hi', require('./hi'));
app.use('/todo', require('./todo'));
app.use('/users', require('./user'));

app.get('/register', function(request, response) {
  response.render('register');
});

module.exports = app;
