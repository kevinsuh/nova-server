var models = require('../models');
var CountryIds = require('../country-references');

var setPassportRoutes = function(router){

	// initialize form given initial `data` from `script` tag:
	// > `public_key` needed for lender security
	// > `country` needed to generate country-specific form
	// > `origin` to know who sent request
	router.get('/api/v1/passports/form', function(req, res) {

		const public_key = req.query["public_key"];
		const country    = req.query["country"];
		const origin     = req.query["origin"];

		// we use `public_key` to identify Lender
		models.Lender.find({
			where: { public_key }
		})
		.then((lender) => {

			// we return country-specific content form fields
			// - assume there is a countries reference-table so we can get country-specific form content
			if (lender) {
				var CountryId = CountryIds[country];
				// test custom fields for country
				return res.status(200).json({
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
				return res.status(401).json({
					message: "Could not find you. Are you sure you passed a valid key?"
				})
			}
		});

	});

	// form submit to get nova credit passport
	router.post('/api/v1/passports/form', function(req, res) {

		const data = req.body;
		const ipAddress  = req.connection.remoteAddress;
		const public_key = data.public_key;

		models.Lender.find({
			where: { public_key }
		})
		.then((lender) => {

			if (lender) {

				// form values
				const LenderId = lender.id;
				const name = data.name;
				const email = data.email;
				const passport_number = data.passport_number;
				const CountryId = data.CountryId;
				
				// store request meta data
				// > `ipAddress` to know where req came from
				// > `LenderId` to know for which lender source
				models.Request.create({
					LenderId: lender.id,
					ipAddress: ipAddress,
					CountryId: CountryId,
					name: name,
					email: email,
					passport: passport_number
				})
				.then((request) => {

					// fake 500ms data compilation
					setTimeout(() => {
						const score = 760;
						const status = 200;
						const public_token = "test_public_token";
						const RequestId = request.id;
						const message = "Congratulations, you now have a Nova Credit Passport!";
						// generate public_token to hold private data, and send over a public message
						// > - `creditScore` represents private data we have generated
						// > - only retrievable through lender's server
						// > - we send over `public_token` to lender
						// > - lender would make another request to our server w/ `public_token` + `client` + `secret` in exchange for this data
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
								message: message
							}
							return res.status(status).json(publicResponse);
						})

					}, 500);

				})


			} else {
				return res.status(401).json({
					message: "Could not find you. Are you sure you passed a valid key?"
				})
			}
		});

	});

}

module.exports = setPassportRoutes;

