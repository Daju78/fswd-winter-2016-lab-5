'use strict';

var express = require('express'),
  app = express.Router();

var User = require('../../../models').User;

app.post('/new', function(request, response) {
  if (request.body.password !== request.body.password_confirm) {
    response.end('Passwords must match');
  } else {
    User.findOne({ where: { username: request.body.username }})
      .then(function(existingUser) {
        if (existingUser) {
          response.end('User already exists');
        } else {
          User.create({ username: request.body.username, password: request.body.password })
            .then(function(user) {
              request.session.user_id = user.id;
              request.session.save(function() {
                response.redirect('/');
              });
            })
          }
        });
  }
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/login', function(req, res) {
  User.findOne({ where: { username: req.body.username } })
    .then(function(user) {
      if (!user) {
        res.end('User not found');
      } else if (user.password === req.body.password) {
        req.session.user_id = user.id;
        req.session.save(function() {
          res.redirect('/');
        });
      } else {
        res.end('Password incorrect');
      }
    });
});

app.get('/available', function(req, res) {
  User.findOne({ where: { username: req.query.username }})
    .then(function(user) {
      res.json({ available: !user });
    });
});

app.get('/', function(req, res) {
  res.send('users list here');
});

module.exports = app;
