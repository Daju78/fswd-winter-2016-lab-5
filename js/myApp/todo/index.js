var angular = require('lib/angular');

var myApp = angular.module('myApp.todo', [
  require('./todoListDirective').name,
  require('./todoController').name,
  require('./todoService').name
]);

module.exports = myApp;
