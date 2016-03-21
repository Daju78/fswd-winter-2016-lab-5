var angular = require('../../lib/angular');

var myApp = angular.module('myApp.todo.todoService', [
]);

myApp.service('todoService', function($http) {

  function getTodoList() {
    return $http.get('/todo');
  }

  function addTodo(newItem) {
    return $http.post('/todo/new', { todo: newItem });
  }

  return {
    getTodoList: getTodoList,
    addTodo: addTodo
  };
});


module.exports = myApp;
