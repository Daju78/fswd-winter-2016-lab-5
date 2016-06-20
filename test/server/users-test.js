'use strict';

// load the common test setup code
require('../setup-test');

// code to test
var app = require('../../lib/app');

// libraries
var request = require('supertest-as-promised').agent,
  agent;

describe('users', function() {
  beforeEach(function() {
    agent = request(app);
  })
  describe('registration', function() {
    it('should log the new user in', function() {
      return agent
        .post('/users/new')
        .type('form')
        .send({ username: 'myNewUsername', password: 'myFancyPassword' })
        .expect(302)
        .expect('Location', '/')
        .then(function() {
          return agent
            .get('/')
            // Look for a logout link for now
            .expect(200, /Logout/);
          });
        });
      });
    });
