var angular = require('lib/angular');

var myApp = angular.module('myApp.todo.todoController', [
  require('./todoService').name
]);

myApp.controller('todoController', function($scope, $interval, todoService) {
  var vm = this;

  $scope.$watch(function() { return vm.todoList; }, function(list) {
    vm.todoLength = list ? list.length : 0;
  });

  vm.addTodo = function addTodo(newVal) {
    todoService.addTodo(newVal).then(function(response) {
      vm.todoList = response.data;
    });
  };

  vm.pollTodoList = function pollTodoList() {
    todoService.getTodoList().then(function(response) {
      vm.todoList = response.data;
    });
  };

  $interval(vm.pollTodoList, 5000);
  vm.pollTodoList();
});


module.exports = myApp;
