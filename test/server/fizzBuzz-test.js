require('chai').should;
var _ = require('lodash');

function fizzBuzzFor(i) {
  if (i % 15 === 0) {
    return 'FizzBuzz';
  } else if (i % 5 === 0) {
    return 'Buzz';
  } else if (i % 3 === 0) {
    return 'Fizz';
  } else {
    return i;
  }
}

function fizzBuzz(number) {
  var results = [];
  for(var i = 1; i <= number; i++) {
    results.push(fizzBuzzFor(i));
  }

  return results;
  // return _.times(number, _.flow(_.partial(_.add, 1), fizzBuzzFor));
}

describe('fizzBuzzFor', function() {
  it('should be Fizz for 3', function() {
    fizzBuzzFor(3).should.eql('Fizz');
  });
});

describe('fizzBuzz', function() {
  _.forEach([
    [0, []],
    [1, [1]],
    [2, [1,2]],
    [3, [1,2,'Fizz']],
    [5, [1,2,'Fizz', 4, 'Buzz']],
    [16, [1,2,'Fizz', 4, 'Buzz', 'Fizz', 7, 8, 'Fizz', 'Buzz', 11, 'Fizz', 13, 14, 'FizzBuzz', 16]]
  ], function(test) {
      it('should return ' + JSON.stringify(test[1]) + ' for ' + test[0], function() {
        fizzBuzz(test[0]).should.eql(test[1]);
      })
  }
);
});
