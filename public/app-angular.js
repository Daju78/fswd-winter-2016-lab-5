
var angular = require('angular');

angular.module('fswd.todo', [])
  .service('TodoService', function($http) {
    var service = this;
    service.todoList = ['Laundry', 'Groceries'];
    service.addTodo = function(newTodo) {
      return $http.post('/todo/new', { todo: newTodo })
        .then(function(response) {
          service.todoList = service.todoList.concat([response.data]);
        });
    };

    service.getTodos = function() {
      return $http.get('/todo')
        .then(function(response) {
            service.todoList = response.data;
            return service.todoList;
        });
    };
  })
  .controller('TodoController', function(TodoService, $interval) {
    var vm = this;
    vm.addTodo = function(newTodo) {
      TodoService.addTodo(newTodo);
      vm.newTodo = '';
    };

    TodoService.getTodos()
      .then(function(todos) {
        vm.todoList = todos;
      })
    $interval(function() {
      TodoService.getTodos()
        .then(function(todos) {
          vm.todoList = todos;
        });
    }, 5000);

  });

angular.bootstrap(document, ['fswd.todo']);
