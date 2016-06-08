'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notIn: [['password']],
        notEmpty: true
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Task);
      }
    },
    validate: {

    }
  });
  return User;
};
