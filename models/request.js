'use strict';
module.exports = function(sequelize, DataTypes) {
  var Request = sequelize.define('Request', {
    LenderId: DataTypes.INTEGER,
    ipAddress: DataTypes.STRING,
    CountryId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    passport: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Request.belongsTo(models.Lender);
        Request.hasOne(models.Response);
      }
    }
  });
  return Request;
};