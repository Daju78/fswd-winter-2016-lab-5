'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    redis = require('connect-redis'),
    app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(require('morgan')('dev'));
}

app.set('view engine', 'jade');
app.set('views', './views');
app.use(express.static('public'));
app.use(cookieParser());

// to extract form data from POST bodies
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var RedisStore = redis(session);
app.use(session({
  secret: 'Shhhhh!',
  resave: false,
  saveUninitialized: false,
  store: new RedisStore()
}));

var Task = require('../models').Task;
var User = require('../models').User;

app.use(function(request, response, next) {
  request.session.lastRequest = new Date();
  if (request.session.user_id) {
    User.findById(request.session.user_id).then(function(user) {
      if (user) {
        request.user = user;
      }
      next();
    });
  } else {
    next();
  }
});

app.use(function(request, response, next) {
  response.locals.username = request.user ? request.user.username : 'world';
  next();
});

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

app.get('/todo', function(req, res) {
  Task.findAll().then(function(todos) {
    res.format({
      'text/html': function() {
        if (!todos) {
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

app.param('todo_id', function(req, res, next, id) {
  Task.findById(id).then(function(todo) {
    if (todo) {
      req.todo = todo;
    }
    next();
  });
});

app.get('/todo/:todo_id', function(req, res) {
  res.format({
    'text/html': function() {
      res.render('todo', { todo: req.todo });
    },
    'application/json': function() {
      res.json(req.todo);
    }
  });
});

app.post('/todo/:todo_id/complete', function(req, res) {
  req.todo.markCompleted().then(function() {
    res.redirect('/todo/' + req.todo.id);
  });
});

app.post('/todo/new', function(request, response) {
  Task.create({ title: request.body.todo }).then(function(todo) {
    response.format({
      'text/html': function() {
        response.render('newTodo', { todo: todo });
      },
      'application/json': function() {
        response.redirect('/todo');
      }
    })
  });
});

app.get('/users/register', function(request, response) {
  response.render('register');
});

app.post('/users/new', function(request, response) {
  User.create({ username: request.body.username, password: request.body.password })
    .then(function(user) {
      request.session.user_id = user.id;
      request.session.save(function() {
        response.redirect('/');
      });
    })
});

if (process.env.NODE_ENV === 'development') {
  require('express-debug')(app);
}

// allow other modules to use the server
module.exports = app;
