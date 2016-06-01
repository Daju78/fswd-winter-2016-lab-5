'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    app = express();

app.set('view engine', 'jade');
app.set('views', './views');
app.use(express.static('public'));

// to extract form data from POST bodies
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencodedapp.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(request, response) {
  response.render('index');
});

app.get('/hi/:name', function(request, response) {
  var str = 'Hello, ' + request.params.name + ' ' + request.query.lastName + '!';

  if (request.query.inseam) {
    var inseam = request.query.inseam;

    if (inseam < 26) {
      str += ' How is the weather down there?';
    } else if (inseam > 34) {
      str += ' Wow, you are tall!';
    } else {
      str += ' And I understand your inseam is ' + inseam + ' inches';
    }
  }

  response.end(str);
});

var Task = require('../models').Task;

app.get('/todo', function(req, res) {
  Task.findAll().then(function(tasks) {
    res.render('tasks', { tasks: tasks });
  })
});

app.get('/todo/:task_id', function(req, res) {
  Task.findById(req.params.task_id).then(function(task) {
    res.render('task', { task: task });
  });
});

app.post('/todo/new', function(request, response) {
  Task.create({ title: request.body.todo }).then(function(newTask) {
    response.redirect('/todo/' + newTask.id);
  });
});

// allow other modules to use the server
module.exports = app;
