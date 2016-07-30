$(document).ready(main);

function getContracts() {
	$.ajax({
		method: 'Get',
		url: "/contracts/listContracts",
		dataType: "json",
		success: function(json) {
			if (json.owner.length == 0) {
				$('<h3>', {
					text: 'No Contracts Created'
				}).appendTo('section#personal_contracts');
			} else {

				createContractsList(json.owner, 'section#personal_contracts', false, false);
			}

			if (json.washer.length == 0) {
				$('<h3>', {
					text: 'No Contracts Selected'
				}).appendTo('section#client_contracts');
			} else {

				createContractsList(json.washer, 'section#client_contracts', true, true);
			}

			if (json.comp.length == 0) {
				$('<h3>', {
					text: 'No Completed Contracts'
				}).appendTo('section#complete_contracts');
				
			} else {

				createCompleteList(json.comp, 'section#complete_contracts', false);

			}
 
		}
	});
}

function createChatForm(article, contract) {
	var chat_block = $("<form>", {class: "chat hidden"}).appendTo(article);
	chat_block.data('id', contract.id);

	$("<div>", {class: "messages"}).appendTo(chat_block);

	$("<button>", {class: "send_button button signup", text: "Send"}).appendTo(chat_block);

	$("<textarea>", {class: "send", name: "message", rows: 3, cols: 30, maxlength: 250, placeholder: "Send Message", required: "required"}).appendTo(chat_block);

}

function sendChat(id, message) {
	var input = {
		id: id,
		message: message
	};
	console.log(input);
	$.ajax({
		type: "post",
		url: "/contracts/sendChat",
		"Content-Type": 'application/json',
		dataType: 'json',
		data: input,
		success: function () {

		}
	});
}

function getChat(id, box) {
	box.empty();
	$.ajax({
		type: "get",
		url: "/contracts/getChat",
		dataType: 'json',
		data: {"id": id},
		success: function (json) {
	
			for (var i = 0; i < json.length; i++) {
				
				if (json[i].owner) {
					$('<p>', {class:"message owner", html:json[i].message}).appendTo(box);
				} else {
					$('<p>', {class:"message", html:json[i].message}).appendTo(box);
				}
			}

			box.animate({
				scrollTop: box.get(0).scrollHeight
			}, 1000);
		}
	});
}

function updateChat(id, box) {
	$.ajax({
		type: "get",
		url: "/contracts/getChat",
		dataType: 'json',
		data: {"id": id},
		success: function (json) {
			if (box.children().length < json.length) {
				
				for (var i = box.children().length; i < json.length; i++) {
					if (json[i].owner) {
						$('<p>', {class:"message owner", html:json[i].message}).appendTo(box);
					} else {
						$('<p>', {class:"message", html:json[i].message}).appendTo(box);
					}
				}

				box.animate({
					scrollTop: box.get(0).scrollHeight
				}, 1000);
			}

			
		}
	});
}

function confirmContract(id) {
	var input = {
		id: id
	}
	$.ajax({
		type: "post",
		url: "/contracts/confirmContract",
		"Content-Type": 'application/json',
		dataType: 'json',
		data: input,
		success: function () {

		}
	});
}

function deleteContract(id) {
	var input = {
		id: id,
	};
	$.ajax({
		type: "post",
		url: "/contracts/deleteContract",
		"Content-Type": 'application/json',
		dataType: 'json',
		data: input,
		success: function () {

		}
	});
}

function cancelContract(id, chatid) {
	var input = {
		id: id,
		chatid: chatid
	};
	$.ajax({
		type: "post",
		url: "/contracts/cancelContract",
		"Content-Type": 'application/json',
		dataType: 'json',
		data: input,
		success: function () {

		}
	});
}

// helper function for listing contracts on html page
function createCompleteList(contracts, section, button) {
	for (var i = 0; i < contracts.length; i++) {

		var article = $('<article>', {
			class: 'contract'
		}).appendTo(section);

		$('<img>', {
			src: contracts[i].image
		}).appendTo(article);

		var car = $('<p>', {
			class: 'car_info'
		}).appendTo(article);

		$('<span>', {
			text: 'Price: $' + contracts[i].price + '.00'
		}).appendTo(car);

		$('<span>', {
			id: "status",
			text: 'Status: ' + contracts[i].status
		}).appendTo(car);

		if (contracts[i].washer_email && contracts[i].washer_name) {

			$('<span>', {
				text: 'Detailer: ' + contracts[i].washer_name
			}).appendTo(car);

			$('<span>', {
				text: 'Detailer email: ' + contracts[i].washer_email
			}).appendTo(car);
		}

		if (contracts[i].owner_email && contracts[i].owner_name) {

			$('<span>', {
				text: 'Owner: ' + contracts[i].owner_name
			}).appendTo(car);

			$('<span>', {
				text: 'Owner email: ' + contracts[i].owner_email
			}).appendTo(car);
		}

		$('<span>', {
			text: 'Manufacturer: ' + contracts[i].make
		}).appendTo(car);

		$('<span>', {
			text: 'Model: ' + contracts[i].model
		}).appendTo(car);

		$('<span>', {
			text: 'Year: ' + contracts[i].year
		}).appendTo(car);

		$('<span>', {
			text: 'License Plate #: ' + contracts[i].license_plate
		}).appendTo(car);

		var detail = $('<div>', {
			class: 'detail_info'
		}).appendTo(article);

		$('<h4>', {text: 'Exterior'}).appendTo(detail);

		var list = $('<ul>').appendTo(detail);

		if (contracts[i].hand_wash) {
			$('<li>', {text: 'Hand Wash'}).appendTo(list);
		}

		if (contracts[i].clean_tires) {
			$('<li>', {text: 'Clean Tires'}).appendTo(list);
		}

		if (contracts[i].hand_wax) {
			$('<li>', {text: 'Hand Wax'}).appendTo(list);
		}

		$('<h4>', {text: 'Interior'}).appendTo(detail);

		list = $('<ul>').appendTo(detail);

		if (contracts[i].full_vacuuming) {
			$('<li>', {text: 'Full Interior Vacuuming'}).appendTo(list);
		}

		if (contracts[i].floor_mats) {
			$('<li>', {text: 'Floor Mats'}).appendTo(list);
		}

		if (contracts[i].centre_console) {
			$('<li>', {text: 'Centre Console Cleaning'}).appendTo(list);
		}

		if (contracts[i].button_cleaning) {
			$('<li>', {text: 'Button Cleaning'}).appendTo(list);
		}

		if (contracts[i].vinyl_and_plastic) {
			$('<li>', {text: 'Vinyl and Plastic Restoration'}).appendTo(list);
		}

		var local = $('<p>', {
			class: 'car_local'
		}).appendTo(article);

		$('<span>', {
			text: 'City: ' + contracts[i].city
		}).appendTo(local);

		$('<span>', {
			text: 'Address: ' + contracts[i].address
		}).appendTo(local);

		$('<span>', {
			text: 'Postal/Zip Code: ' + contracts[i].postal_code
		}).appendTo(local);

		article.data('id', contracts[i].id);

		if (button) {
			$('<button>', {class: "confirm button signup",text:"Confirm Completion"}).appendTo(article);
		}

		if (contracts[i].status != 'complete') {
			$('<button>', {class: "cancel button signup", text:"Drop"}).appendTo(article);
			$('<button>', {class: "delete button signup", text:"Cancel"}).appendTo(article);
		}

	}
}

// helper function for listing contracts on html page
function createContractsList(contracts, section, button, washer) {
	for (var i = 0; i < contracts.length; i++) {

		var article = $('<article>', {
			class: 'contract'
		}).appendTo(section);

		$('<img>', {
			src: contracts[i].image
		}).appendTo(article);

		var car = $('<p>', {
			class: 'car_info'
		}).appendTo(article);

		$('<span>', {
			text: 'Price: $' + contracts[i].price + '.00'
		}).appendTo(car);

		$('<span>', {
			id: "status",
			text: 'Status: ' + contracts[i].status
		}).appendTo(car);

		if (!washer && contracts[i].washer_email && contracts[i].washer_name) {

			$('<span>', {
				text: 'Detailer: ' + contracts[i].washer_name
			}).appendTo(car);

			$('<span>', {
				text: 'Detailer email: ' + contracts[i].washer_email
			}).appendTo(car);
		}

		if (washer && contracts[i].owner_email && contracts[i].owner_name) {

			$('<span>', {
				text: 'Owner: ' + contracts[i].owner_name
			}).appendTo(car);

			$('<span>', {
				text: 'Owner email: ' + contracts[i].owner_email
			}).appendTo(car);
		}

		$('<span>', {
			text: 'Manufacturer: ' + contracts[i].make
		}).appendTo(car);

		$('<span>', {
			text: 'Model: ' + contracts[i].model
		}).appendTo(car);

		$('<span>', {
			text: 'Year: ' + contracts[i].year
		}).appendTo(car);

		$('<span>', {
			text: 'License Plate #: ' + contracts[i].license_plate
		}).appendTo(car);

		var detail = $('<div>', {
			class: 'detail_info'
		}).appendTo(article);

		$('<h4>', {text: 'Exterior'}).appendTo(detail);

		var list = $('<ul>').appendTo(detail);

		if (contracts[i].hand_wash) {
			$('<li>', {text: 'Hand Wash'}).appendTo(list);
		}

		if (contracts[i].clean_tires) {
			$('<li>', {text: 'Clean Tires'}).appendTo(list);
		}

		if (contracts[i].hand_wax) {
			$('<li>', {text: 'Hand Wax'}).appendTo(list);
		}

		$('<h4>', {text: 'Interior'}).appendTo(detail);

		list = $('<ul>').appendTo(detail);

		if (contracts[i].full_vacuuming) {
			$('<li>', {text: 'Full Interior Vacuuming'}).appendTo(list);
		}

		if (contracts[i].floor_mats) {
			$('<li>', {text: 'Floor Mats'}).appendTo(list);
		}

		if (contracts[i].centre_console) {
			$('<li>', {text: 'Centre Console Cleaning'}).appendTo(list);
		}

		if (contracts[i].button_cleaning) {
			$('<li>', {text: 'Button Cleaning'}).appendTo(list);
		}

		if (contracts[i].vinyl_and_plastic) {
			$('<li>', {text: 'Vinyl and Plastic Restoration'}).appendTo(list);
		}

		var local = $('<p>', {
			class: 'car_local'
		}).appendTo(article);

		$('<span>', {
			text: 'City: ' + contracts[i].city
		}).appendTo(local);

		$('<span>', {
			text: 'Address: ' + contracts[i].address
		}).appendTo(local);

		$('<span>', {
			text: 'Postal/Zip Code: ' + contracts[i].postal_code
		}).appendTo(local);

		article.data('id', contracts[i].id);

		if (button) {
			$('<button>', {class: "confirm button signup",text:"Confirm Completion"}).appendTo(article);
		}

		if (washer && contracts[i].status != 'complete') {
			$('<button>', {class: "cancel button signup", text:"Drop"}).appendTo(article);
		} else if (!washer && contracts[i].status != 'complete') {
			$('<button>', {class: "delete button signup", text:"Cancel"}).appendTo(article);
		}

		

		

		if (contracts[i].status == 'taken') {

			$('<button>', {class: "chat_button button signup", text: "Chat"}).appendTo(article);
			createChatForm(article, contracts[i]);

		}

		

		


	}
}

function main() {
	getContracts();

	/*link to search page for contracts*/

	$('button#search_contracts').on('click', function() {
		window.location.href = '/contracts/search';
	});

	/*Drop button action*/

	$(document).on('click', '.cancel', function() {
		
		cancelContract($(this).parent().data('id'), $(this).parent().children(".chat").data('id'));
		$('<h3>', {class:"alert_bad", text:"You Have Succefully Dropped a Contract"}).insertAfter($(this).parent());
		$(this).parent().remove();
	});

	/*Cancel button action*/

	$(document).on('click', '.delete', function() {
		
		deleteContract($(this).parent().data('id'));
		$('<h3>', {class:"alert_bad", text:"You Have Canceled a Contract"}).insertAfter($(this).parent());
		$(this).parent().remove();
	});

	/*confirm button action*/

	$(document).on('click', '.confirm', function(e) {
		confirmContract($(this).parent().data('id'));
		$('<h3>', {class:"alert_good", text:"You Have Succefully Confirmed Completion of a Contract"}).insertAfter($(this).parent());
		$(this).parent().remove();
	});

	/*Completed Contracts button*/
	$(document).on('click', '#completed', function(e) {
		$('#complete_contracts').toggleClass('hidden');
		$("html body").animate({
			scrollTop: $(this).parent().children("#complete_contracts").offset().top - 50
		}, 1000);
		
	});

	/*Chat send button action*/

	$(document).on('click', '.send_button', function(e) {

		e.preventDefault();

		if ($(this).parent().children(".send").is(":invalid")) {
			$('span.send_error').remove();
    		$('<span>', {class:"send_error", text: "Message Cannot Be Blank"}).insertAfter($(this).parent().children(".send"));
		} else {
		
			sendChat($(this).parent().data('id'), $(this).parent().children(".send").val());

			updateChat($(this).parent().data('id'), $(this).parent().children(".messages"));

			$(this).parent().children(".send").val('');

		}
		
	});

	/*Chat button - used to open chat window for specific contract*/

	$(document).on('click', '.chat_button', function() {

		$(this).parent().children(".chat").toggleClass('hidden');

		var b = $(this).parent().children(".chat").children(".messages");
		
		getChat($(this).parent().children(".chat").data('id'), b);

		setInterval(updateChat, 5000, $(this).parent().children(".chat").data('id'), b);

		
		if ($(this).parent().css('height') == '450px') {
			$(this).parent().css({
				height: "700px"
			})
			$("html body").animate({
				scrollTop: $(this).parent().children(".chat").offset().top - 50
			}, 1000);
		} else {
			$(this).parent().css({
				height: "450px"
			})
			$("html body").animate({
				scrollTop: $(this).parent().children(".chat").offset().top - 50
			}, 1000);
		}
		
	});
}