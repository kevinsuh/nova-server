// this script seeds our sqlite db from the CSV's
var models = require('./models');

// `force: true` will drop tables before starting up again
// so each time you run this, data will get reset
models.sequelize.sync({ force: true }).then(function() {

	/*
			Create example data
	 */
	const lender = {
		name: "Lender, Inc.",
		client: "test_client",
		secret: "test_secret",
		public_key: "test_public_key"
	};

	models.Lender.create({
		name: lender.name,
		client: lender.client,
		secret: lender.secret,
		public_key: lender.public_key
	});
	console.log(`Database created and seeded!`);

});