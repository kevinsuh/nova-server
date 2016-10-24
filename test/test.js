"use strict";

var models = require('../models');
var supertest = require("supertest");
var should = require("should");
var CountryIds = require('../country-references');

// nova sources:
// > - dev: `http://localhost:8080`
// > - prod: `https://kevins-nova-server.herokuapp.com`
const novaServer = "http://localhost:8080";
var server = supertest.agent(novaServer);

// confirm home page containing react app loads
describe("root url exists", function() {

	it("should return home page", function(done) {
		server
		.get("/")
		.expect("Content-type",/html/)
		.expect(function(res){
			res.status.should.equal(200);
		})
		.expect(200, done);
	});

});

// this is API call to initialize passport form
describe("api to get passport form", function() {

	// nova sources:
	// > - dev: `http://localhost:3000`
	// > - prod: `https://kevins-lender-server.herokuapp.com`
	const lenderServer = "http://localhost:3000";
	const country = "south-korea";
	const CountryId = CountryIds[country];
	const public_key = "test_public_key";

	it("should reject unauthorized attempt", function(done) {
		// making req without `public_key`
		server
		.get('/api/v1/passports/form')
		.expect("Content-type",/json/)
		.expect(401, done);
	});

	it("should generate country-specific form", function(done) {

		// passport request with `public_key`, `country`, and `origin` queries
		server
		.get('/api/v1/passports/form')
		.query({ public_key: public_key })
		.query({ country: country })
		.query({ origin: lenderServer })
		.expect("Content-type",/json/)
		.expect(function(res){
			const response = JSON.parse(res.text);
			// Form fields:
			// > 1. name
			// > 2. email
			// > 3. passport number
			response.form.length.should.equal(3);
			// data returned:
			// > 1. public_key
			// > 2. CountryId
			// > 3. origin
			response.data.public_key.should.equal(public_key);
			response.data.CountryId.should.equal(CountryId);
			response.data.origin.should.equal(lenderServer);
		})
		.expect(200, done);

	});

});

// this is API call to submit country-specific
// form for nova credit passport
describe("api to submit passport form", function() {

	const public_key = "test_public_key";
	const public_token = "test_public_token";
	const successMessage = "Congratulations, you now have a Nova Credit Passport!";
	const formSubmit = {
		name: "Kevin Suh",
		email: "kevin@email.com",
		passport_number: "214125215",
		CountryId: 7,
		public_key: public_key
	};

	it("should reject unauthorized attempt", function(done) {
		// making req without `public_key`
		server
		.post('/api/v1/passports/form')
		.expect("Content-type",/json/)
		.expect(401, done);
	});

	it("should generate passport public_token", function(done) {

		server
		.post('/api/v1/passports/form')
		.send(formSubmit)
		.expect("Content-type",/json/)
		.expect(function(res){
			// Submitting this will return `public_token` to data
			// and a public `message`
			const response = JSON.parse(res.text);
			response.public_token.should.equal(response.public_token);
			response.message.should.equal(response.message)
		})
		.expect(200, done);

	});

});

