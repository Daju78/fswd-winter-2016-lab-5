
var angular = require('angular');

angular.module('fswd.todo', [])
  .service('TodoService', function($http) {
    var service = this;
    service.todoList = ['Laundry', 'Groceries'];
    service.addTodo = function(newTodo) {
      return $http.post()
    };

    service.getTodos = function() {
      return $http.get('/todo')
        .then(function(response) {
            service.todoList = response.data;
            return service.todoList;
        });
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

    TodoService.getTodos();

  });

angular.bootstrap(document, ['fswd.todo']);
