module.exports = function(TodoService, $interval, $scope) {
  var vm = this;
  vm.addTodo = function(newTodo) {
    TodoService.addTodo(newTodo);
    vm.newTodo = '';
  };

  TodoService.getTodos()
    .then(function(todos) {
      vm.todoList = todos;
    })
  var poller = $interval(function() {
    TodoService.getTodos()
      .then(function(todos) {
        vm.todoList = todos;
      });
  }, 5000);

  $scope.$on('$destroy', function() {
    $interval.cancel(poller);
  });

};
