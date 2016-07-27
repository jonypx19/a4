var capitalize = function(word) {
	var lowerCaseWord = word.toLowerCase();
	return word.charAt(0).toUpperCase() + lowerCaseWord.slice(1);
};

var isMonth = function(month) {
	var validMonths = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	if (validMonths.indexOf(capitalize(month)) === -1) {
		return false;
	}
	return true;
};

var isYear = function(year) {
	if (typeof year === 'number' && year > 1905 && year <= 2016) {
		return true;
	}
	return false;
}

var isValidDate = function(month, day, year) {
	if (! isMonth(month)) {
		return false;
	}

	if (day > 31 || day < 1) {
		return false;
	}

	if (year < 1905 || year > 2016) {
		return false;
	}

	if (month === 'February' && day > 28) {
		if (year % 4 === 0 && day === 29) {  // imperfect
			return true;
		}
		return false;
	}

	if (['April', 'June', 'September', 'November'].indexOf(month) !== -1 
		&& day > 30) {
		return false;
	}

	return true;
};

exports.capitalize = capitalize;
exports.isMonth = isMonth;
exports.isYear = isYear;
exports.isValidDate = isValidDate;