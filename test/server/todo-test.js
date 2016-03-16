'use strict';

// load the common test setup code
require('../setup-test');

// code to test
var app = require('../../lib/app');

// libraries
var request = require('supertest-as-promised').agent,
  agent;

var User = require('../../models').User;
var Task = require('../../models').Task;

describe('todo', function() {
  beforeEach(function() {
    agent = request(app);
  });

  describe('for a logged in user', function() {
    beforeEach(function() {
      return User.create({ username: 'myFancyUsername', password: 'myPassword' })
        .then(function() {
          return agent
            .post('/users/login')
            .send({ username: 'myFancyUsername', password: 'myPassword' });
        })
    });

    it('should allow the creation of a todo', function() {
      return agent
        .post('/todo/new')
        .set('Accept', 'application/json')
        .send({ title: 'User laundry' })
        .expect(302)
        .expect('Location', '/todo');
    })
  })

  describe('with no existing todos', function() {
    describe('API calls', function() {
      it('should return an empty list', function() {
        return agent
            .get('/todo')
            .set('Accept', 'application/json')
            .expect(200, []);
      });

      it('should return a redirect to the overall after adding', function() {
        return request(app)
          .post('/todo/new')
          .set('Accept', 'application/json')
          .send({ title: 'My new todo' })
          .expect(401);
          // .expect(302)
          // .expect('Location', '/todo');
      });

      it('should return a 404 for bad ids', function() {
        return Task.max('id')
          .then(function(id) {
            return request(app)
              .get('/todo/' + ((id || 0) + 1))
              .expect(404);
          });
      })
    });

    describe('form users', function() {
      it('should return an empty list', function() {
        return request(app)
            .get('/todo')
            .set('Accept', 'text/html')
            .expect(200, 'No todos');
      });

      it('should return some information about the new todo', function() {
        return request(app)
          .post('/todo/new')
          .type('form')
          .send({ title: 'My new todo' })
          //.expect(200, /Hello world!/);
          .expect(401);
      });

    });
  });

  describe('with a single todo', function() {
    var createdTask;
    beforeEach(function() {
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
                user_id: null,
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
            user_id: null,
            createdAt: createdTask.createdAt.toISOString(),
            updatedAt: createdTask.updatedAt.toISOString()
          });
      });
    });

    describe('browsers', function() {
      it('should display all the todos', function() {
        return request(app)
          .get('/todo')
          .expect(200, 'All known todos: Fancy new todo');
      });

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
