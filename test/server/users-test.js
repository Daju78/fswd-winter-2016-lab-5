'use strict';

// load the common test setup code
require('../setup-test');

// code to test
var app = require('../../lib/app');

// libraries
var request = require('supertest-as-promised').agent,
  agent;

var User = require('../../models').User;

describe('users', function() {
  beforeEach(function() {
    agent = request(app);
  })

  describe('registration', function() {
    it('should have a registration page', function() {
      return agent
        .get('/register')
        .expect(200)
    });

    it('should log the new user in', function() {
      return agent
        .post('/users/new')
        .type('form')
        .send({
          username: 'myNewUsername',
          password: 'myFancyPassword',
          password_confirm: 'myFancyPassword'
        })
        .expect(302)
        .expect('Location', '/')
        .then(function() {
          return agent
            .get('/')
            .expect(200, /Hello myNewUsername!/);
          });
    });

    it('should not allow registration if passwords do not match', function() {
      return agent
        .post('/users/new')
        .type('form')
        .send({
          username: 'myNewUsername',
          password: 'myFancyPassword',
          password_confirm: 'myOtherFancyPassword'
        })
        .expect(200, /Passwords must match/);
    });

    describe('when a user already exists', function() {
      // var existingUser;
      beforeEach(function(done) {
        User.create({ username: 'PreExistingUser', password: 'TheirPassword' })
          .then(function(/* user */) {
            // existingUser = user;
            done();
          });
      });

      it('should not allow registration of an existing username', function() {
        return agent
          .post('/users/new')
          .type('form')
          .send({
            username: 'PreExistingUser',
            password: 'password',
            password_confirm: 'password'
          })
          .expect(200, /User already exists/);
      })
    });
  });

  describe('login', function() {
    it('should not login when there are no users', function() {
      return agent
        .post('/users/login')
        .type('form')
        .send({
          username: 'someUsername',
          password: 'somePassword'
        })
        .expect(200, /User not found/);
    });

    describe('when there are users', function() {
      beforeEach(function(done) {
        User.create({ username: 'PreExistingUser', password: 'TheirPassword' })
        .then(function() {
          done();
        });
      });

      it('should login the user', function() {
        return agent
          .post('/users/login')
          .type('form')
          .send({
            username: 'PreExistingUser',
            password: 'TheirPassword'
          })
          .expect(302)
          .expect('Location', '/')
          .then(function() {
            return agent
              .get('/')
              .expect(200, 'Hello PreExistingUser!');
          });
      });

      it('should warn the user about incorrect passwords', function() {
        return agent
          .post('/users/login')
          .type('form')
          .send({
            username: 'PreExistingUser',
            password: 'myOtherFancyPassword'
          })
          .expect(200, /Password incorrect/);
      })
    })
  });
});
