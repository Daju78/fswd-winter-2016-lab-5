'use strict';

var express = require('express'),
  app = express.Router();

var Task = require('../../../models').Task;

app.param('todo_id', function(req, res, next, id) {
  Task.findById(id).then(function(todo) {
    if (todo) {
      req.todo = todo;
      next();
    } else {
      res.status(404).send('Task not found');
    }
  });
});

app.get('/', function(req, res) {
  Task.findAll().then(function(todos) {
    res.format({
      'text/html': function() {
        if (todos.length === 0) {
          res.end('No todos');
        } else {
          res.end('All known todos: ' +
            todos.map(function(t) { return t.title; }));
        }
      },
      'application/json': function() {
          res.json(todos);
      }
    });
  });
});

app.get('/:todo_id', function(req, res) {
  res.format({
    'text/html': function() {
      res.render('todo', { todo: req.todo });
    },
    'application/json': function() {
      res.json(req.todo);
    }
  });
});

app.post('/:todo_id/complete', function(req, res) {
  req.todo.markCompleted().then(function() {
    res.redirect([req.baseUrl, req.todo.id].join('/'));
  });
});

app.post('/new', function(request, response) {
  Task.create({ title: request.body.todo }).then(function(todo) {
    response.format({
      'text/html': function() {
        response.render('newTodo', { todo: todo });
      },
      'application/json': function() {
        response.redirect(request.baseUrl);
      }
    })
  });
});

module.exports = app;
