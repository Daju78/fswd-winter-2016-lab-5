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

var myComplexArray = [
  { id: 15, value: [1, 2, 3] }, // -> 15 + 6                = 21
  { id: 9, value: [9, 8, 7] },  // -> 9 + (9*8*7) = 9 + 504 = 513
  { id: 10, value: [17] }       // -> 10 + 17               = 27 ==> 561
];

function getProduct(a, b) { return a * b; }

function processItem(item) {
  return item.id + _.reduce(item.value, getProduct, 1);
}

// return id + (product of values in value array (e.g., (1 * 2 * 3) + 15)
function complexArrayMath(arr) {
  return _.reduce(arr, function(acc, item) {
    return _.add(acc, processItem(item));
  }, 0);
}

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

describe('complexArrayMath', function() {
  it('should return 552 for the math', function() {
    complexArrayMath(myComplexArray).should.equal(561);
  });
});
