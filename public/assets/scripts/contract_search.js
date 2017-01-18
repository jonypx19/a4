$(document).ready(main);

function searchContracts() {
	var input = {
			country: $('#country').val(),
			province: $('#province').val(),
			city: $('#city').val(),
			address: $('#address').val()
		};
	$.ajax({
		type: 'post',
		url: '/search/searchContracts',
		"Content-Type": 'application/json',
		dataType: 'json',
		data: input,

		success: function(json) {
			var contracts = json;

			$("article#results").empty();
			$('<h2>', {text:"Search Results"}).appendTo('article#results');
			
			if (contracts.error) {

				$('<h2>', {text:"No available Contracts"}).appendTo('article#results');
			}

			for (var i = 0; i < contracts.length; i++) {

				var article = $('<div>', {class:'contract'}).appendTo('article#results');

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

				$('<span>', {
					text: 'Price: $' + contracts[i].price + '.00'
				}).appendTo(detail);

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

				$('<span>', {
					text: 'Distance: ' + contracts[i].distance
				}).appendTo(local);

				var b = $('<button>', {class: 'add_contract', text:'Take Contract'}).appendTo(article);
				b.data('id', contracts[i].id);

				b.on('click', function() {
					takeContract($(this).data('id'));
					$(this).parent().remove();
				});
			}
			
		}
	});
}

function takeContract(contractid) {
	var input = {
			id: contractid
		};
	$.ajax({
		type: 'post',
		url: '/search/takeContract',
		"Content-Type": 'application/json',
		dataType: 'json',
		data: input,

		success: function(json) {
			console.log(json);
			$('#message').text(json.message);
		}
	});
}

function main() {
	$('#submit_local').on('click', function() {
		searchContracts();
		$('html, body').animate({
			scrollTop: $('#results').offset().top - 50
		}, 1000);
	});
}