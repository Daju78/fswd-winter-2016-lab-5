describe('myApp.todo.todoService', function() {
  beforeEach(module('myApp.todo.todoService'));

  it('should exist', function() {
    angular.module('myApp.todo.todoService').should.be.defined;
  });

  describe('getTodo', function() {
    it('should have a getTodo method', inject(function(todoService) {
      todoService.getTodo.should.be.defined;
    }));

    it('should call the /todo/someId API', inject(function($httpBackend, todoService) {
      $httpBackend.expectGET('/todo/15').respond({ id: 15 });
      todoService.getTodo(15);
      $httpBackend.flush();
    }));
  });

  afterEach(inject(function($httpBackend) {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  }));
});
