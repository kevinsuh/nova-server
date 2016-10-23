var router = require('express').Router();
var path = require('path');

// Rest API
require(path.join(__dirname, './', 'passport'))(router);

// Nova's react app in Lender's iframe
router.get('/', function(req, res, next) {
	res.sendFile(path.join(__dirname, '../', 'client', 'index.html'));
});

module.exports = function(app) {
	app.use('/', router);
};