var getUser = function(url) {
	var parser = document.createElement('a');
	parser.href = url;

	var path = parser.pathname;

	return path.split('/')[2];
}

$( '#submit' ).click(function() {
	event.preventDefault();

	$.ajax({
		url: '/rateuser',
		type: 'post',
		data: {
			// rater determined in router.js as req.session.user
			rating: this.value,
			ratee: getUser(window.location.href);
		},
		success: function ( data ) {
			alert('Thank you for rating!');
		},

		fail: function (xhr, status, errorThrown) {
			alert('Error thrown');
		}
	});

});