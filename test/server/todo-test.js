'use strict';

// load the common test setup code
require('../setup-test');

// code to test
var app = require('../../lib/app');

// libraries
var request = require('supertest-as-promised');

describe('todo', function() {
  describe('with no existing todos', function() {
    describe('API calls', function() {
      it('should return an empty list', function() {
        return request(app)
            .get('/todo')
            .set('Accept', 'application/json')
            .expect(200, []);
      });

      it('should return a redirect to the overall after adding', function() {
        return request(app)
          .post('/todo/new')
          .set('Accept', 'application/json')
          .send({ title: 'My new todo' })
          .expect(302)
          .expect('Location', '/todo');
      });
    });

    describe('form users', function() {
      it('should return an empty list', function() {
        return request(app)
            .get('/todo')
            .set('Accept', 'text/html')
            .expect(200, 'All known todos: ');
      });

      it('should return some information about the new todo', function() {
        return request(app)
          .post('/todo/new')
          .type('form')
          .send({ title: 'My new todo' })
          .expect(200, /Hello world!/);
      });

    });
  });

  describe('with a single todo', function() {
    var createdTask;
    beforeEach(function() {
      var Task = require('../../models').Task;
      return Task.create({ title: 'Fancy new todo'}).then(function(task) {
        createdTask = task;
      });
    });

    describe('API calls', function() {
      it('should return a list with the one todo', function() {
        return request(app)
            .get('/todo')
            .set('Accept', 'application/json')
            .expect(200, [
              {
                id: createdTask.id, title: 'Fancy new todo', completedAt: null,
                createdAt: createdTask.createdAt.toISOString(),
                updatedAt: createdTask.updatedAt.toISOString()
              }
            ]);
      });

      it('should return the information for the single todo', function() {
        return request(app)
          .get('/todo/' + createdTask.id)
          .set('Accept', 'application/json')
          .expect(200, {
            id: createdTask.id, title: 'Fancy new todo', completedAt: null,
            createdAt: createdTask.createdAt.toISOString(),
            updatedAt: createdTask.updatedAt.toISOString()
          });
      });
    });

    describe('browsers', function() {
      it('should display the todo', function() {
        return request(app)
          .get('/todo/' + createdTask.id)
          .expect(200, /Fancy new todo/);
      });

      it('should complete the todo', function() {
        createdTask.isCompleted().should.be.false;
        return request(app)
          .post('/todo/' + createdTask.id + '/complete')
          .send()
          .expect(302)
          .expect('Location', '/todo/' + createdTask.id)
          .then(function() {
            return createdTask.reload();
          })
          .then(function(task) {
            return task.isCompleted().should.be.true;
          });
      });
    });
  });
});
