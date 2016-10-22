var models = require('../models');
var CountryIds = require('../country-references');

var setPassportRoutes = function(router){

	// will pass in get parameters
	router.get('/api/v1/passports/form', function(req, res) {

		const public_key = req.query["public_key"];
		const country    = req.query["country"];
		const env        = req.query["env"];

		if (env !== "test") {
			return res.json({
				status: 401,
				message: "This currently only works with test mode"
			})
		}

		models.Lender.find({
			where: { public_key }
		})
		.then((lender) => {

			if (lender) {
				// return form with valid content
				// assume there is a countries table we can validate this exists for and get appropriate form content for
				var CountryId = CountryIds[country];
				// return custom fields for country
				return res.json({
					form: [
						{
							label: "What's your name?",
							input: "name",
							type: "text"
						},
						{
							label: "What's your email?",
							input: "email",
							type: "text"
						},
						{
							label: "What's your passport number?",
							input: "passport_number",
							type: "text"
						}
					],
					data: {
						public_key: public_key,
						CountryId: CountryId
					}
				});

			} else {
				// could not find lender
				return res.json({
					status: 401,
					message: "Could not find you. Are you sure you passed a valid key?"
				})
			}
		});

	});

	router.post('/api/v1/donations', function(req, res) {

		const cid = req.body.cid;
		const amount = req.body.amount;
		const org = req.body.org;
		const date = new Date();
		const cycle = 2016

		models.Contribution.create({
			date: date,
			cid: cid,
			cycle: cycle,
			amount: amount,
			org: org
		})
		.then(function(contribution){
			return res.json(contribution);
		})

	});

	// only 5000 for trial purposes (7500 total)
	router.get('/api/v1/candidates', function(req, res) {
		models.Candidate.findAll({
			limit: 5000
		})
		.then((candidates) => {
			return res.json(candidates);
		})
	});
}

module.exports = setPassportRoutes;

