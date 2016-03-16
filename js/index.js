var angular = require('./lib/angular');

var myApp = angular.module('myApp', []);

myApp.directive('todoList', function() {
    return {
      restrict: 'E',
      scope: {},
      controller: 'todoController',
      controllerAs: 'vm',
      templateUrl: '/templates/todoList.html'
    };
})

myApp.controller('todoController', function($scope, $interval, todoService) {
  var vm = this;

  $scope.$watch(function() { return vm.todoList; }, function(list) {
    vm.todoLength = list ? list.length : 0;
  });

  vm.addTodo = function addTodo(newVal) {
    todoService.addTodo(newVal).then(function(response) {
      vm.todoList = response.data;
    });
  };

  $interval(function() {
    todoService.getTodoList().then(function(response) {
      vm.todoList = response.data;
    });
  }, 5000)
});

myApp.service('todoService', function($http) {
  var todoList = ['Laundry'];

  function getTodoList() {
    return $http.get('/todo');
  }

  function addTodo(newItem) {
    return $http.post('/todo/new', { todo: newItem });
  }

  return {
    getTodoList: getTodoList,
    addTodo: addTodo
  };
});

myApp.directive('uniqueUsername', function($q, $http) {
  return {
    require: 'ngModel',
    link: function(scope, elem, attrs, ctrl) {
      ctrl.$asyncValidators.uniqueUsername = function(modelValue) {
        return $q(function(resolve, reject) {
          $http.get('/users/available?username=' + modelValue)
            .then(function(response) {
              if (response.data.available) {
                resolve();
              } else {
                reject();
              }
            });
        });
      }
    }
  }
});
