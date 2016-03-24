describe('myApp.todo.todoController', function() {
  beforeEach(module('myApp.todo.todoController'));

  it('should instanciate', inject(function($rootScope, $controller) {
    $controller('todoController', {
      $scope: $rootScope.$new()
    }).should.be.defined;
  }));

  it('should be able to add a todo', inject(function($rootScope, $controller, todoService, $httpBackend, $q) {

    var todoController = $controller('todoController', {
      $scope: $rootScope.$new(),
      todoService: {
        addTodo: function(val) {
          return $q.resolve({ data: [ { id: 42, title: val }]});
        }
      }
    });
    todoController.addTodo('abc123');
    $rootScope.$digest();

    todoController.todoList.should.deep.equal([ { id: 42, title: 'abc123' }]);
  }));

});
