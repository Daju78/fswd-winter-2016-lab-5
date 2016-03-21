var ConnectRoles = require('connect-roles');

var roles = new ConnectRoles({
  failureHandler: function (req, res, action) {
    // optional function to customise code that runs when
    // user fails authorisation
    var accept = req.headers.accept || '';
    res.status(403);
    if (~accept.indexOf('html')) {
      res.render('access-denied', {action: action});
    } else {
      res.send('Access Denied - You don\'t have permission to: ' + action);
    }
  }
});

roles.use('can alter task', function(request) {
  return request.isAuthenticated() &&
    request.user && request.todo  &&
    request.user.id == request.todo.user_id;
});

module.exports = roles;
