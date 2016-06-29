module.exports = function(TodoService, $interval, $scope) {
  var vm = this;

  function pollTodos() {
    TodoService.getTodos()
      .then(function(todos) {
        vm.todoList = todos;
      });
  }

  pollTodos();
  var poller = $interval(pollTodos, 5000);

  $scope.$on('$destroy', function() {
    $interval.cancel(poller);
  });

  this.onAdd = function(task) {
    vm.todoList = vm.todoList.concat([ task ]);
  };

};
