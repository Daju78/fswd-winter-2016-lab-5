describe('myApp.todo.todoController', function() {
  beforeEach(module('myApp.todo.todoController'));

  it('should instanciate', inject(function($rootScope, $controller) {
    $controller('todoController', {
      $scope: $rootScope.$new()
    }).should.be.defined;
  }));
});
