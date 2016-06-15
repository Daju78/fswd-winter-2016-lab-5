
var angular = require('angular');

angular.module('fswd.todo', ['fswd.todo.registration', require('angular-route/index')])
  .service('TodoService', function($http) {
    var service = this;
    service.todoList = ['Laundry', 'Groceries'];
    service.addTodo = function(newTodo) {
      return $http.post('/todo/new', { todo: newTodo })
        .then(function(response) {
          service.todoList = service.todoList.concat([response.data]);
        });
    };

    service.getTodos = function() {
      return $http.get('/todo')
        .then(function(response) {
            service.todoList = response.data;
            return service.todoList;
        });
    };
  })
  .controller('TodoController', function(TodoService, $interval) {
    var vm = this;
    vm.addTodo = function(newTodo) {
      TodoService.addTodo(newTodo);
      vm.newTodo = '';
    };

    TodoService.getTodos()
      .then(function(todos) {
        vm.todoList = todos;
      })
    $interval(function() {
      TodoService.getTodos()
        .then(function(todos) {
          vm.todoList = todos;
        });
    }, 5000);

  })
  .config(function($routeProvider) {
    $routeProvider.when('/todos', {
      template: "<ul><li ng-repeat=\"todo in vm.todoList\" ng-class=\"{ 'text-success': todo.completedAt }\" ng-click=\"\">{{ todo.title }}</li></ul>",
      controller: 'TodoController',
      controllerAs: 'vm'
    });
    $routeProvider.otherwise('/todos');
  });

angular.module('fswd.todo.registration', [])
  .directive('uniqueUsername', function($http, $q) {
    return {
      restrict: 'A',
      require: '^ngModel',
      link: function(scope, element, attrs, ctrl) {
        ctrl.$asyncValidators.uniqueUsername = function(modelValue) {
          // /users/isAvailable { isAvailable: true/false }
          return $http.post('/users/isAvailable', { username: modelValue })
            .then(function(response) {
              if (!response.data.isAvailable) {
                return $q.reject('Not available');
              } else {
                return true;
              }
            });
        };
      }
    };
  })
  .directive('registrationPasswordMatch', function() {
    return {
      restrict: 'A',
      require: ['^ngModel', '^form'],
      link: function(scope, element, attrs, ctrl) {
        var passwordController = ctrl[0];
        var formController = ctrl[1];
        var confirmPasswordController = formController[attrs.registrationPasswordMatch];

        scope.$watch(function() {
          return confirmPasswordController.$viewValue;
        }, function() {
          passwordController.$$parseAndValidate();
        });

        scope.$watch(function() {
          return passwordController.$viewValue;
        }, function() {
          confirmPasswordController.$$parseAndValidate();
        })

        passwordController.$validators.passwordMatch = function(modelValue) {
          return (!modelValue && !confirmPasswordController.$viewValue) ||
            (modelValue === confirmPasswordController.$viewValue);
        };

        confirmPasswordController.$validators.passwordMatch = function(modelValue) {
          return (!modelValue && !passwordController.$viewValue) ||
            (modelValue === passwordController.$viewValue);
        };
      }
    };
  })
  .controller('RegistrationFormController', function() {
    var vm = this;
  });

angular.bootstrap(document, ['fswd.todo']);
