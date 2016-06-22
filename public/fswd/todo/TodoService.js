
module.exports = function($http) {
  var service = this;
  service.todoList = ['Laundry', 'Groceries'];
  service.addTodo = function(newTodo) {
    return $http.post('/todo/new', { todo: newTodo })
      .then(function(response) {
        service.todoList = service.todoList.concat([response.data]);
        return response.data;
      });
  };

  service.getTodos = function() {
    return $http.get('/todo')
      .then(function(response) {
          service.todoList = response.data;
          return service.todoList;
      });
  };

  service.getTodo = function(id) {
    return $http.get('/todo/' + id)
      .then(function(response) {
        return response.data;
      });
  };
};
