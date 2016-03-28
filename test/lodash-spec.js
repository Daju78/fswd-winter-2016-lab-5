var _ = require('lodash');

function add(n, m) {
  return n + m;
}

function square(n) {
  return n * n;
}

function squareAdd(a, b) {
  return square(add(a, b));
}

var lodashSquareAdd = _.spread(_.flow(add, square));

require('chai').should();

describe('square-add', function() {
  _.each([ [[ 1, 1 ], 4 ],
          [[ 2, 2 ], 16]
        ], _.spread(function(values, result) {
           it('should return ' + result + ' for ' + values.join(', '), function() {
             squareAdd(values[0], values[1]).should.equal(result);
             lodashSquareAdd(values).should.equal(result);
           })
         }));
});
