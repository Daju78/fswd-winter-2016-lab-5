
var angular = require('angular');

angular.module('fswd.todo', [])
  .service('TodoService', function() {
    var service = this;
    service.todoList = ['Laundry', 'Groceries'];
    service.addTodo = function(newTodo) {
      service.todoList = service.todoList.concat([newTodo]);
    };
  })
  .controller('TodoController', function(TodoService, $scope) {
    var vm = this;
    vm.addTodo = function(newTodo) {
      TodoService.addTodo(newTodo);
    };

    $scope.$watch(function() {
      return TodoService.todoList;
    }, function(newValue, oldValue) {
      vm.todoList = newValue;
    });

  });

angular.bootstrap(document, ['fswd.todo']);
