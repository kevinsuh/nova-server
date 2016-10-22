var router = require('express').Router();
var path = require('path');

// Main react app for Lender
router.get('/', function(req, res, next) {
	res.sendFile(path.join(__dirname, '../', 'client', 'index.html'));
});

module.exports = function(app) {
	// set other routes
	app.use('/', router);
};