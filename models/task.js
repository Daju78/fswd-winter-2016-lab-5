"use strict";

module.exports = function(sequelize, DataTypes) {
  var Task = sequelize.define("Task", {
    title: DataTypes.STRING,
  }, {
    classMethods: {
      associate: function() {
      }
    }
  });

  return Task;
};
