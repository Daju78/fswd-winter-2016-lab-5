var angular = require('lib/angular');

var myApp = angular.module('myApp.todo.todoListDirective', [
]);

myApp.directive('todoList', function() {
    return {
      restrict: 'E',
      scope: {},
      controller: 'todoController',
      controllerAs: 'vm',
      templateUrl: '/partials/todoList'
    };
})

module.exports = myApp;
