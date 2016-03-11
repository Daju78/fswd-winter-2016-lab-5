'use strict';

var express = require('express'),
  app = express.Router();

var User = require('../../../models').User;

app.post('/new', function(request, response) {
  User.create({ username: request.body.username, password: request.body.password })
    .then(function(user) {
      request.session.user_id = user.id;
      request.session.save(function() {
        response.redirect('/');
      });
    })
});

module.exports = app;
