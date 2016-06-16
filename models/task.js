"use strict";

module.exports = function(sequelize, DataTypes) {
  var Task = sequelize.define("Task", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    completedAt: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        Task.belongsTo(models.User);
      }
    },
    instanceMethods: {
      markCompleted: function() {
        this.completedAt = new Date();
        return this.save();
      }
    }
  });

  return Task;
};
