'use strict';
module.exports = function(sequelize, DataTypes) {
  var Lender = sequelize.define('Lender', {
    name: DataTypes.STRING,
    client: DataTypes.STRING,
    secret: DataTypes.STRING,
    public_key: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Lender.hasMany(models.Request);
        Lender.hasMany(models.Response);
      }
    }
  });
  return Lender;
};