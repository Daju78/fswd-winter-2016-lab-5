var angular = require('angular');
require('angular-mocks');

require('../../../public/app-angular');

describe('fswd.todo.TodoService', function() {
  var testTodo = 'abc123';

  angular.mock.module.sharedInjector();

  before(angular.mock.module('fswd.todo'));

  it('should have a default list of tasks', inject(function(TodoService) {
    TodoService.todoList.should.eql(['Laundry', 'Groceries']);
  }));

  describe('addTodo', function() {
    it('should add a todo to the list', inject(function($httpBackend, TodoService) {
      $httpBackend.expectPOST('/todo/new', { todo: testTodo })
        .respond(200, { id: 3, title: testTodo});

      TodoService.addTodo(testTodo);
      $httpBackend.flush();

      TodoService.todoList.should.eql(['Laundry', 'Groceries', { id: 3, title: testTodo }]);
    }));
  });

  describe('getTodo', function() {
    it('should get a given todo', function(done) {
      inject(function($httpBackend, TodoService) {
        $httpBackend.expectGET('/todo/1').respond(200, { id: 1, title: 'My task'});

        TodoService.getTodo(1)
          .then(function(todo) {
            todo.should.eql({ id: 1, title: 'My task'});
            done();
          });
        $httpBackend.flush();
      });
    });
  });
});
