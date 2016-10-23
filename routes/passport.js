var models = require('../models');
var CountryIds = require('../country-references');

var setPassportRoutes = function(router){

	// will pass in get parameters
	router.get('/api/v1/passports/form', function(req, res) {

		const public_key = req.query["public_key"];
		const country    = req.query["country"];
		const origin     = req.query["origin"];

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
						CountryId: CountryId,
						origin: origin
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

	router.post('/api/v1/passports/form', function(req, res) {

		const data       = req.body;
		const ipAddress  = req.connection.remoteAddress;
		const public_key = data.public_key;

		models.Lender.find({
			where: { public_key }
		})
		.then((lender) => {

			if (lender) {

				const LenderId = lender.id;
				const name = data.name;
				const email = data.email;
				const passport_number = data.passport_number;
				const CountryId = data.CountryId;
				
				// store request
				models.Request.create({
					LenderId: lender.id,
					ipAddress: ipAddress,
					CountryId: CountryId,
					name: name,
					email: email,
					passport: passport_number
				})
				.then((request) => {

					// compile the data!
					setTimeout(() => {
						// 2 second process of compiling data to generate passport . . .
						const score = 760;
						const status = 200;
						const public_token = "test_public_token";
						const RequestId = request.id;
						const message = "Congratulations, you now have a Nova Credit Passport!";
						// store response. lender will get this
						// on server side with the public token
						// RequestId, LenderId, status, message, public_token, creditScore
						// creditScore represents the private meta data we have generated that is only accessible for lender server-side. Lender would make a request on server w/ public_token + client + secret in exchange for the data stored here (such as creditScore)
						models.Response.create({
							RequestId: RequestId,
							LenderId: LenderId,
							status: status,
							message: message,
							public_token: public_token,
							creditScore: score
						})
						.then((response) => {
							const publicResponse = {
								public_token: public_token,
								message: message,
								status: status
							}
							return res.json(publicResponse);
						})

					}, 2000);

				})


			} else {
				// could not find lender
				return res.json({
					status: 401,
					message: "Could not find you. Are you sure you passed a valid key?"
				})
			}
		});

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

