require('../src/hash-router.js');
var assert = require('assert');

describe('Hash-Router', function () {
	it('Global Definition', function () {
		assert.ok(Router !== null, "The [Router] object is defined globally!");
	});
	
	it('Init', function () {
		Router.init(function (route) {
			console.info("Route changed to: " + route);
		}, function (tokens) {
			console.info("Route faild with tokens: " + tokens);
		});
	});
})

