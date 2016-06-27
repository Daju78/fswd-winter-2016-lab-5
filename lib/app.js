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
app.use(cookieParser());
app.use(express.static('public'));

var RedisStore = redis(session);
app.use(session({
  secret: 'Shhhhh!',
  resave: false,
  saveUninitialized: false,
  store: new RedisStore()
}));

// to extract form data from POST bodies
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencodedapp.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  if (req.session.user_id) {
    User.findById(req.session.user_id)
      .then(function(user) {
        req.user = user;
        res.locals.user = user;
        next();
      })
  } else {
    next();
  }
});

app.get("/", function(request, response) {
  response.render('index');
});

app.use('/hi', require("./routes/hi"));

var Task = require('../models').Task;

app.get('/todo', function(req, res) {
  var tasksPromise;
  if (req.user) {
    tasksPromise = req.user.getTasks();
  } else {
    tasksPromise = Task.findAll();
  }
  tasksPromise.then(function(tasks) {
    res.format({
      html: function() {
        res.render('tasks', { tasks: tasks });
      },
      json: function() {
        res.json(tasks);
      }
    })
  })
});

app.param('task_id', function(req, res, next, id) {
  Task.findById(id).then(function(task) {
    if (task) {
      req.task = task;
      next();
    } else {
      res.sendStatus(404);
    }
  })
});

app.get('/todo/:task_id', function(req, res) {
  res.format({
    html: function() {
      res.render('task', { task: req.task });
    },
    json: function() {
      res.json(req.task);
    }
  });
});

app.post('/todo/new', function(request, response) {
  var taskPromise;
  if (request.user) {
    taskPromise = request.user.createTask({ title: request.body.todo });
  } else {
    taskPromise = Task.create({ title: request.body.todo });
  }
  taskPromise.then(function(newTask) {
    response.format({
        html: function() {
          response.redirect('/todo/' + newTask.id);
        },
        json: function() {
          response.json(newTask);
        }
    });
  });
});

app.post('/todo/:task_id/complete', function(req, res) {
  Task.findById(req.params.task_id)
    .then(function(task) {
        task.markCompleted().then(function(t) {
          res.format({
            html: function() {
              res.redirect('/todo/' + task.id);
            },
            json: function() {
              res.json(t);
            }
          })
        });
      });
    });

app.get('/register', function(req, res) {
  res.render('register');
});

var User = require('../models').User;
app.post('/users/new', function(req, res) {
  User.create({ username: req.body.username, password: req.body.password })
    .then(function(user) {
      // conditions to check for:
      // - is the username taken?
      // - do the passwords match?
      // - is the password there?
      // - is the user already logged in? (req.user)
      // req.session.username = req.body.username;
      // res.end('Thanks for registering, ' + req.body.username + '!');
      // after created user
      req.session.user_id = user.id;
      req.session.save(function() {
        res.redirect('/');
      });
    }).catch(function(errors) {
      res.json(errors)
    });
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/login', function(req, res) {
  User.findOne({ where: { username: req.body.username }})
    .then(function(user) {
      if (user) {
        if (req.body.password === user.password) {
          req.session.user_id = user.id;
          res.redirect('/');
        } else {
          res.end('Password does not match');
        }
      } else {
        res.end('User not found');
      }
    });
});

app.get('/logout', function(req, res) {
  req.session.destroy(function() {
    res.redirect('/');
  });
});

app.get('/users/whoami', function(req, res) {
  res.render('whoami', { username: req.session.username });
});

app.post('/users/isAvailable', function(req, res) {
  // username -> req.body.username
  res.json({ isAvailable: false });
});

app.get('/partials/:partial', function(req, res) {
  res.render('partials/' + req.params.partial);
});

// FIXME: Use a better tool to run the server
if (process.env.NODE_ENV === 'development') {
  require('express-debug')(app);
}

// allow other modules to use the server
module.exports = app;
