'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('Tasks', 'title', {
      type: Sequelize.STRING,
      allowNull: false
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('Tasks', 'title', {
      type: Sequelize.STRING,
      allowNull: true
    });
  }
};
