var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.should();

describe('Index page', function() {
  it('should have a count of the number of tasks', function() {
    browser.get('http://localhost:8008/');
    element(by.css('#todo-count')).getText().should.eventually.equal('The number of todo items is: 0');
  });
});
