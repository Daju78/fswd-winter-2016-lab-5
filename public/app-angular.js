
var angular = require('angular');

angular.module('fswd.todo', ['fswd.todo.registration'])
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

  });

angular.module('fswd.todo.registration', [])
  .directive('uniqueUsername', function($http) {
    return {
      restrict: 'A',
      require: '^ngModel',
      link: function(scope, element, attrs, ctrl) {
        ctrl.$asyncValidators.uniqueUsername = function(modelValue) {
          // /users/isAvailable { isAvailable: true/false }
          return $http.post('/users/isAvailable', { username: modelValue })
            .then(function(response) {
              return response.data.isAvailable;
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
          return confirmPasswordController.$viewValue + passwordController.$viewValue;
        }, function() {
          passwordController.$$parseAndValidate();
          confirmPasswordController.$$parseAndValidate();
        });

        passwordController.$validators.passwordMatch = function(modelValue) {
          return (!modelValue && !confirmPasswordController.$modelValue) || (modelValue === confirmPasswordController.$modelValue);
        };

        confirmPasswordController.$validators.passwordMatch = function(modelValue) {
          return (!modelValue && !passwordController.$viewValue) || (modelValue === passwordController.$viewValue);
        };
      }
    };
  })
  .controller('RegistrationFormController', function() {
    var vm = this;
  });

angular.bootstrap(document, ['fswd.todo']);
