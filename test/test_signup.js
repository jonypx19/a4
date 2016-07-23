var assert = require('chai').assert;

var signup = require('../helper/signupValidation');

// describe is a quick grouping description
// it is a logical instance of a test

describe('signupValidation', function() {
	describe('isValidDate', function(){
		it('should return false when the date is invalid', function() {
			assert.equal(signup.isValidDate('February', 29, 2010), false);
			assert.equal(signup.isValidDate('Epic', 29, 2010), false);
		});

		it('should return true for a valid date', function (){
			assert.equal(signup.isValidDate('January', 11, 1999), true);
		});
	});
});
