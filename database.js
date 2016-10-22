// this script seeds our sqlite db from the CSV's
var models = require('./models');

// `force: true` will drop tables before starting up again
// so each time you run this, data will get reset
models.sequelize.sync({ force: true }).then(function() {
	console.log(`Database created!`);
});