'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('Users', 'username', {
      type: Sequelize.STRING,
      unique: true
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('Users', 'username', {
      type: Sequelize.STRING
    });
  }
};
