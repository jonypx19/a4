$(document).ready(main);

function getContracts() {
	$.ajax({
		method: 'Get',
		url: "/contracts/listContracts",
		data: {user: "bob"},
		dataType: "json",
		success: function(json) {
			if (json.owner.length == 0) {
				$('<h3>', {
					text: 'No Contracts Created'
				}).appendTo('section#personal_contracts');
			} else {
				var article = $('<article>', {
					class: 'contract'
				}).appendTo('section#personal_contracts');

				createContractsList(json.owner, article, null);
			}

			if (json.washer.length == 0) {
				$('<h3>', {
					text: 'No Contracts Selected'
				}).appendTo('section#client_contracts');
			} else {
				var article = $('<article>', {
					class: 'contract'
				}).appendTo('section#client_contracts');

				var button = $('<button>', {class: "confirm",text:"Confirm Completion"});

				createContractsList(json.washer, article, button);
			}
 
		}
	});
}

function cancelContract(id) {
	var input = {
		id: id
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
function createContractsList(contracts, article, button) {
	for (var i = 0; i < contracts.length; i++) {

		$('<img>', {
			src: contracts[i].image
		}).appendTo(article);

		var car = $('<p>', {
			class: 'car_info'
		}).appendTo(article);

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

		article.data('id', contracts[i].id);

		if (button != null) {
			var complete_button = button.appendTo(article);
		}

		var cancel_button = $('<button>', {class: "cancel", text:"Cancel"}).appendTo(article);


	}
}

function main() {
	getContracts();

	$('button#search_contracts').on('click', function() {
		window.location.href = '/contracts/search';
	});

	$(document).on('click', '.cancel', function() {
		console.log("hello");
		cancelContract($(this).parent().data('id'));
		$(this).parent().remove();
	});
}