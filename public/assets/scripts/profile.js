var getUser = function() {
	var currentEmail = $('meta[name=viewedProfile]').attr("content");
	return currentEmail;
};
$(document).ready(function(){
	$( '#submit' ).click(function() {
		event.preventDefault();
		var selectedValue = $('input[name=rating]:checked').val();
		var text = $("#commentText").val();
		var currentEmail = getUser();
		console.log(currentEmail);
		console.log(selectedValue);
		console.log(text);

		var send = new Object();
		send.currentEmail = currentEmail;
		send.rating = selectedValue;
		send.content = text;

		$.ajax({
			url:'http://localhost:3000/submitComment',
			type:"POST",
			contentType: "application/json",
			dataType:"text",
			data:send,


		}).done(function(data){
			location.replace("http://localhost:3000/user/" + currentEmail);
		});

		// $.ajax({
		// 	url: '/rateuser',
		// 	type: 'post',
		// 	data: {
		// 		// rater determined in router.js as req.session.user
		// 		rating: this.value,
		// 		ratee: getUser(window.location.href)
		// 	},
		// 	success: function ( data ) {
		// 		alert('Thank you for rating!');
		// 	},
		//
		// 	fail: function (xhr, status, errorThrown) {
		// 		alert('Error thrown');
		// 	}
		// });

	});
});
