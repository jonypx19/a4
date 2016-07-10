$(document).ready(main);

/*Updates page with a list of user's personal vehicles*/
function getVehicles() {
	$.ajax({
		method: "Get",
		url: "/vehicles/listVehicles",
		data: {user: "bob"},
		dataType: "json",
		success: function(json) {
			var user_cars = json;
			console.log(user_cars);
			for (var i = 0; i < user_cars.length; i++) {
				var car_article = $('<article>').appendTo('section#list_vehicles');

				$('<img>', {
					class: 'vehicle_info',
					src: '/images/' + user_cars[i].img
				}).appendTo(car_article);

				$('<span>', {
					class: 'vehicle_info',
					text: user_cars[i].manufacturer
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
					text: user_cars[i].license
				}).appendTo(car_article);

				var button = $('<button>', {
					class: 'create_contract',
					text: 'Create Contract'
				}).appendTo(car_article);

				button.data('contract', user_cars[i]);

				button.on('click', function() {
					createContractForm($(this).data('contract'));
				});
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

	console.log(car_values);

	var contract_article = $('section#contract_form article');

	


	contract_article.data('contract_car', car_values);

	$('<span>', {
		class: 'contract_info',
		text: car_values.manufacturer
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
		text: car_values.license
	}).appendTo(selected_info);

}

/*Attaches controller functionality to necessary buttons and Forms*/
function main() {
	getVehicles();


}