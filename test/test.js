require('../src/hash-router.js');
require('chai');

describe('Hash-Router', function () {
	it('Global Definition', function () {
		chai.assert.ok(Router !== null, "The [Router] object is defined globally!");
	});
	
	it('Init', function () {
		window.Router.init(function (route) {
			console.info("Route changed to: " + route);
		}, function (tokens) {
			console.info("Route faild with tokens: " + tokens);
		});
	});
})

