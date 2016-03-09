'use strict';

// load the common test setup code
require('../setup-test');

// code to test
var app = require('../../lib/app');

// libraries
var request = require('supertest');

describe('todo', function() {
  describe('with no existing todos', function() {
    describe('API calls', function() {
      it('should return an empty list', function(done) {
        request(app)
            .get('/todo')
            .set('Accept', 'application/json')
            .expect(200, [], done);
      });

      it('should return a redirect to the overall after adding', function(done) {
        request(app)
          .post('/todo/new')
          .set('Accept', 'application/json')
          .field('title', 'My new todo')
          .expect(302)
          .expect('Location', '/todo')
          .end(done);
      });
    });

    describe('form users', function() {
      it('should return an empty list', function(done) {
        request(app)
            .get('/todo')
            .set('Accept', 'text/html')
            .expect(200, 'All known todos: ', done);
      });

      it('should return some information about the new todo', function(done) {
        request(app)
          .post('/todo/new')
          .type('form')
          .field('title', 'My new todo')
          .expect(200, /Hello world!/, done);
      });

    });
  });

  describe('with a single todo', function() {
    var createdTask;
    beforeEach(function(done) {
      var Task = require('../../models').Task;
      Task.create({ title: 'Fancy new todo'}).then(function(task) {
        createdTask = task;
        done();
      });
    });

    describe('API calls', function() {
      it('should return a list with the one todo', function(done) {
        request(app)
            .get('/todo')
            .set('Accept', 'application/json')
            .expect(200, [
              {
                id: createdTask.id, title: 'Fancy new todo', completedAt: null,
                createdAt: createdTask.createdAt.toISOString(),
                updatedAt: createdTask.updatedAt.toISOString()
              }
            ], done);
      });
    });
  })
});
