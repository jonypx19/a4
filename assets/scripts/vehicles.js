$(document).ready(main);

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

				$('<img>', {
					class: 'vehicle_info',
					src: user_cars[i].image
				}).appendTo(car_article);
			}

		}
	})
}

/*Attaches controller functionality to necessary buttons and Forms*/
function main() {
	getVehicles();

}