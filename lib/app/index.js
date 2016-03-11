'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    redis = require('connect-redis'),
    app = express();

/* istanbul ignore next */
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

app.use(require('./routes'));

/* istanbul ignore next */
if (process.env.NODE_ENV === 'development') {
  require('express-debug')(app);
}

// allow other modules to use the server
module.exports = app;
