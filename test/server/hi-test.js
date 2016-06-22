'use strict';

// load the common test setup code
require('../setup-test');

// code to test
var app = require('../../lib/app');

// libraries
var request = require('supertest-as-promised');

describe('hi', function() {
  var myRequest;
  beforeEach(function() {
    myRequest = request(app).get('/hi/David');
  })
  it('should respond with the name passed in', function() {
    return myRequest
      .expect(200, 'Hello, David undefined!');
  });

  it('should add the last name', function() {
    return myRequest
      .query({ lastName: 'Raynes'})
      .expect(200, 'Hello, David Raynes!');
  });

  describe('inseam text', function() {
    var inseamTests = [
      { inseam: 30, text: 'And I understand your inseam is 30 inches' },
      { inseam: 25, text: 'How is the weather down there?' },
      { inseam: 35, text: 'Wow, you are tall!' }
    ];
    inseamTests.forEach(function(i) {
      it('should display ' + i.text + ' if inseam is ' + i.inseam, function() {
        return myRequest
          .query({ inseam: i.inseam })
          .expect(200, 'Hello, David undefined! ' + i.text);
      });
    })
  });
});
