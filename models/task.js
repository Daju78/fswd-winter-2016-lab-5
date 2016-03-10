"use strict";

module.exports = function(sequelize, DataTypes) {
  var Task = sequelize.define("Task", {
    title: DataTypes.STRING,
    completedAt: DataTypes.DATE
  }, {
    classMethods: {
      associate: function() {
      }
    },
    instanceMethods: {
      isCompleted: function() {
        return !!this.completedAt;
      },
      markCompleted: function() {
        return this.update({ completedAt: sequelize.fn('NOW') });
      }
    }
  });

  return Task;
};
