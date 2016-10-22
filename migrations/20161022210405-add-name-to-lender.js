'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'Lenders',
      'name',
      {
        type: Sequelize.STRING
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Lenders', 'name');
  }
};
