var angular = require('angular');
require('angular-mocks');

require('../../../public/app-angular');

describe('fswd.todo.TodoService', function() {

  angular.mock.module.sharedInjector();

  before(angular.mock.module('fswd.todo'));
  it('should have a default list of tasks', inject(function(TodoService) {
    TodoService.todoList.should.eql(['Laundry', 'Groceries']);
  }));

  describe('addTodo', function() {
    it('should add a todo to the list', inject(function($httpBackend, TodoService) {
      $httpBackend.expectPOST('/todo/new', { todo: 'abc123' })
        .respond(200, { id: 3, title: 'abc123'});

      TodoService.addTodo('abc123');
      $httpBackend.flush();

      TodoService.todoList.should.eql(['Laundry', 'Groceries', { id: 3, title: 'abc123' }]);
    }));
  });
});
