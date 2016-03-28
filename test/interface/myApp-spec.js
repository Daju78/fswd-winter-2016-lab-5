describe('myApp', function() {
  beforeEach(function() {
    require('myApp');
  });
  it('should be defined', function() {
    angular.module('myApp').should.be.defined;
  });
})
