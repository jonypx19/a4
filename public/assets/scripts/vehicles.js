$(document).ready(main);

function getVehicles() {
	$.ajax({
		method: "Get",
		url: "/vehicles/listVehicles",
		data: {user: "bob"},
		dataType: "json",
		success: function(json) {
			var user_cars = json;
			
			for (var i = 0; i < user_cars.length; i++) {
				var car_article = $('<article>').appendTo('section#list_vehicles');

				$('<img>', {
					class: 'vehicle_info',
					src: user_cars[i].image
				}).appendTo(car_article);

				$('<span>', {
					class: 'vehicle_info',
					text: user_cars[i].make
				}).appendTo(car_article);

				$('<span>', {
					class: 'vehicle_info',
					text: user_cars[i].model
				}).appendTo(car_article);

				$('<span>', {
					class: 'vehicle_info',
					text: user_cars[i].year
				}).appendTo(car_article);

				$('<span>', {
					class: 'vehicle_info',
					text: user_cars[i].license_plate
				}).appendTo(car_article);

				var button = $('<button>', {class: 'button signup create', text: 'Create Contract'}).appendTo(car_article);

				button.data('selected_car', user_cars[i]);

				button.on('click', function() {

					$('html, body').animate({
						scrollTop: $('#contract_form').offset().top -100
					}, 1000);
					var car_details = $(this).data('selected_car');
					$('input#vehicleid').val(car_details.id);
					createContractForm(car_details);

				})

			}

		}
	})
}

/*Updates page with a contract form */
function createContractForm(car_values) {
	if (typeof car_values == 'undefined') {
		car_values = {};
	}

	if ($('section#contract_form article div#car_select').length > 0) {
		$('section#contract_form article div#car_select').remove();
	}

	var selected_info = $('<div>', {id: 'car_select'}).insertAfter('section#contract_form article h2.selected');

	var contract_article = $('section#contract_form article');

	


	contract_article.data('contract_car', car_values);

	$('<img>', {
		class: 'vehicle_info',
		src: car_values.image
	}).appendTo(selected_info);

	$('<span>', {
		class: 'contract_info',
		text: car_values.make
	}).appendTo(selected_info);

	$('<span>', {
		class: 'contract_info',
		text: car_values.model
	}).appendTo(selected_info);

	$('<span>', {
		class: 'contract_info',
		text: car_values.year
	}).appendTo(selected_info);

	$('<span>', {
		class: 'contract_info',
		text: car_values.license_plate
	}).appendTo(selected_info);

	

}

function setPrices() {
	var total = 0;

	var prices = {
		wash: 25,
		tires: 20,
		wax: 25,
		vacuum: 20,
		mats: 10,
		protect: 20,
		console: 5,
		button_clean: 5
	};

	if ($('label#mats input').prop("checked")) {
		total += prices.mats;
		$('label#mats .price').css({color: 'green'});
	} else {
		$('label#mats .price').css({color: 'black'});
	}

	if ($('label#vacuum input').prop("checked")) {
		total += prices.vacuum;
		$('label#vacuum .price').css({color: 'green'});
	} else {
		$('label#vacuum .price').css({color: 'black'});
	}

	if ($('label#protect input').prop("checked")) {
		total += prices.protect;
		$('label#protect .price').css({color: 'green'});
	} else {
		$('label#protect .price').css({color: 'black'});
	}

	if ($('label#console input').prop("checked")) {
		total += prices.console;
		$('label#console .price').css({color: 'green'});
	} else {
		$('label#console .price').css({color: 'black'});
	}

	if ($('label#button_clean input').prop("checked")) {
		total += prices.button_clean;
		$('label#button_clean .price').css({color: 'green'});
	} else {
		$('label#button_clean .price').css({color: 'black'});
	}

	if ($('label#wash input').prop("checked")) {
		total += prices.wash;
		$('label#wash .price').css({color: 'green'});
	} else {
		$('label#wash .price').css({color: 'black'});
	}

	if ($('label#tires input').prop("checked")) {
		total += prices.tires;
		$('label#tires .price').css({color: 'green'});
	} else {
		$('label#tires .price').css({color: 'black'});
	}

	if ($('label#wax input').prop("checked")) {
		total += prices.wax;
		$('label#wax .price').css({color: 'green'});
	} else {
		$('label#wax .price').css({color: 'black'});
	}

	

	return total;
}

/*Attaches controller functionality to necessary buttons and Forms*/
function main() {
	
	getVehicles();
	$('fieldset.detail label').on('click', function() {
		var total = setPrices();
		$('span#total').text('$' + total + '.00');
		$('input#price').val(total);

	});

	$(document).on('click', '.create', function() {
		$('section#contract_form article').removeClass('hidden');
	});

}