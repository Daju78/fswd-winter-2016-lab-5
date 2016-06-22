var angular = require('angular');

require('../../../public/app-angular');

describe('fswd.todo', function() {
  it('should exist', function() {
    angular.module('fswd.todo').should.be.ok;
  })
});
