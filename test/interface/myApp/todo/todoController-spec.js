describe('myApp.todo.todoController', function() {
  beforeEach(module('myApp.todo.todoController'));

  it('should instanciate', inject(function($rootScope, $controller) {
    $controller('todoController', {
      $scope: $rootScope.$new()
    }).should.be.defined;
  }));

  it('should be able to add a todo', inject(function($rootScope, $controller, todoService) {
    sinon.spy(todoService, 'addTodo');

    var todoController = $controller('todoController', { $scope: $rootScope.$new() });
    todoController.addTodo('abc123');
    todoService.addTodo.should.have.been.calledWith('abc123');
  }));

});
