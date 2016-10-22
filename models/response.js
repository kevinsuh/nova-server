'use strict';
module.exports = function(sequelize, DataTypes) {
  var Response = sequelize.define('Response', {
    RequestId: DataTypes.INTEGER,
    LenderId: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    message: DataTypes.STRING,
    public_token: DataTypes.STRING,
    creditScore: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Response.belongsTo(models.Request);
        Response.belongsTo(models.Lender);
      }
    }
  });
  return Response;
};