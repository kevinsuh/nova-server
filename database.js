// this script creates and seeds our sqlite db
var models = require('./models');

// `force: true` will drop tables before creating them again.
// So each time you run this, data will reset
models.sequelize.sync({ force: true }).then(function() {

	// example lender with test credentials
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