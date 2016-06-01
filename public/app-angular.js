
var angular = require('angular');

angular.module('fswd.todo', [])
  .controller('TodoController', function() {
    var vm = this;
    vm.todoList = ['Laundry', 'Groceries'];

    vm.addTodo = function(newTodo) {
      vm.todoList = vm.todoList.concat([newTodo]);
    };
  });

angular.bootstrap(document, ['fswd.todo']);
