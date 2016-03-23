var angular = require('../../lib/angular');

var myApp = angular.module('myApp.todo.todoService', [
]);

myApp.service('todoService', function($http) {

  function getTodo(todo_id) {
    return $http.get('/todo/' + todo_id);
  }

  function getTodoList() {
    return $http.get('/todo');
  }

  function addTodo(newItem) {
    return $http.post('/todo/new', { todo: newItem });
  }

  return {
    getTodo: getTodo,
    getTodoList: getTodoList,
    addTodo: addTodo
  };
});


module.exports = myApp;
