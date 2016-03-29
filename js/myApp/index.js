var angular = require('../lib/angular');

var myApp = angular.module('myApp', [
  require('./todo').name,
  require('../lib/angular-route').name
]);

myApp.config(function($routeProvider) {
  $routeProvider.when('/register', {
    templateUrl: '/partials/register',
    resolve: {
      isLoggedIn: function($http, $q, $location) {
        return $http.get('/users/isLoggedIn')
          .then(function(response) {
              return $location.path('/todo');
          })
          .catch(function(response) {
              return $q.resolve('User is not logged in');
          });
      }
    }
  });
  $routeProvider.when('/login', {
    templateUrl: '/partials/login',
    controller: function($http, $location) {
      var vm = this;
      vm.doLogin = function() {
        $http.post('/users/login', { username: vm.username, password: vm.password })
          .then(function(response) {
            $location.path('/todo');
          })
          .catch(function(response) {
            console.log("ERROR!");
            console.log(response);
          });
      };
    },
    controllerAs: 'vm'
  });
  $routeProvider.when('/todo', {
    template: '<todo-list></todo-list>'
  });
  $routeProvider.when('/todo/:todo_id', {
    controller: function(todoService, $routeParams) {
      var vm = this;
      todoService.getTodo($routeParams.todo_id)
        .then(function(todo) {
          vm.todo = todo.data;
        });
    },
    controllerAs: 'vm',
    templateUrl: '/partials/todo'
  });
  $routeProvider.otherwise('/login');
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

module.exports = myApp;
