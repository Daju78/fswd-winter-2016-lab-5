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

  describe('getTodoList', function() {
    it('should have a getTodoList method', inject(function(todoService) {
      todoService.getTodoList.should.be.defined;
    }));

    it('should call the /todo/someId API', inject(function($httpBackend, todoService) {
      $httpBackend.expectGET('/todo').respond([]);
      todoService.getTodoList();
      $httpBackend.flush();
    }));
  });

  describe('addTodo', function() {
    it('should have a addTodo method', inject(function(todoService) {
      todoService.addTodo.should.be.defined;
    }));

    it('should POST to /todo/new API', inject(function($httpBackend, todoService) {
      $httpBackend.expectPOST('/todo/new', { todo: 'Something'})
        .respond({ id: 15, title: 'Something' });
      todoService.addTodo('Something');
      $httpBackend.flush();
    }));
  });

  afterEach(inject(function($httpBackend) {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  }));
});
