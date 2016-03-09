var db = require('../models');

beforeEach(function(done) {
  db.sequelize.sync({ force: true }).then(function() {
    return done();
  });
});
