var mysql = require('mysql');

var Database = function (host_name, username, pass, database_name) {
	// set connection settings for database
	this.con = mysql.createConnection({
    	host: host_name,
    	user: username,
    	password: pass,
    	database: database_name
	});

}


function deg2rad(deg) {
  return deg * (Math.PI/180)
}

Database.prototype.connect = function() {
	//establish connection to mysql database

	this.con.connect(function(err){
  		if(err){
    		console.log('Error connecting to Db');
    		return;
  		}
  		console.log('Connection established');
	});
};

Database.prototype.insertVehicle = function(username, vehicle, image_data) {
	
	this.con.query("INSERT INTO vehicles (ownerid, make, model, year, license_plate, image) \
		VALUES (?, ?, ?, ?, ?, ?)", 
		[username, vehicle.manu, vehicle.model, vehicle.year, vehicle.plate, image_data], 
		function (err, result) {
			if (err) {
				console.log(err);

			}
		});
};

Database.prototype.getUserVehicles = function(username, callback) {
	this.con.query("SELECT * FROM vehicles WHERE ownerid=?", [username], function(err, result) {
		if (err) {
			console.log("Could not find Vehicles Table");
			callback(err, null);
		}

		callback(null, result);

	});
}

Database.prototype.changeContractStatus = function(contractid, washer, status, callback) {
	this.con.query("UPDATE contract SET status=?, washerid=? WHERE id=?",
		[status, washer, contractid],
		function(err, result) {
			if (err) {
				console.log("couldn't update contract");
				callback(err);
			} else {
				callback(null);
			}
		});
}

Database.prototype.checkContractStatus = function(contractid, status, callback) {
	this.con.query("SELECT id, vehicleid, status FROM contract WHERE vehicleid=? and status=?",
		[contractid, status],
		function(err, result) {
			if (err) {
				console.log("Couldn't select contracts");
				callback(err, null);
			} else if (result.length > 0) {
				callback(null, true);
			} else {
				callback(null, false);
			}
		});
}

Database.prototype.checkDuplicateContract = function(vehicleid, callback) {
	this.con.query("SELECT id, vehicleid, status FROM contract WHERE vehicleid=? and (status='available' or status='taken')",
		[vehicleid],
		function(err, result) {
			if (err) {
				console.log("Couldn't select contracts");
				callback(err, null);
			} else if (result.length > 0) {
				callback(null, true);
			} else {
				callback(null, false);
			}
		});
}

Database.prototype.insertContract = function(contract) {
	this.con.query("INSERT INTO contract (vehicleid, price, full_vacuuming, floor_mats, vinyl_and_plastic, \
		centre_console, button_cleaning, hand_wash, clean_tires, hand_wax, country, province, city, address, postal_code, latitude, longitude, status) \
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
		[contract.vehicleid, contract.price, contract.vacuum, contract.mats, contract.protect, contract.console, contract.button_clean, contract.wash, contract.tires, contract.wax, contract.country, contract.province, contract.city, contract.address, contract.postal_code, contract.latitude, contract.longitude, "available"],
		function (err, result) {
			if (err) {
				console.log("Could not insert new Contract");
				console.log(err);
			}
		});
}

Database.prototype.findClientContracts = function(lat, lon, callback) {
	this.con.query("SELECT * FROM (vehicles JOIN contract ON contract.vehicleid=vehicles.id) WHERE status='available'", function (err, result) {
		if (err) {
			console.log("could not select Contracts");
			callback(err, null);
			return;
		}

		// filters results based on local distance
		var new_res = result.filter(function(value) {
			var lon2 = value.longitude;
			var lat2 = value.latitude;

			var R = 6371; // Radius of the earth in km
			var dLat = deg2rad(lat2-lat);  // deg2rad below
			var dLon = deg2rad(lon2-lon); 
			var a = 
			Math.sin(dLat/2) * Math.sin(dLat/2) +
			Math.cos(deg2rad(lat)) * Math.cos(deg2rad(lat2)) * 
			Math.sin(dLon/2) * Math.sin(dLon/2); 
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
			var d = R * c; // Distance in km

		    value.distance = Number(Math.round(d+'e2')+'e-2');

		    return d <= 5;
		});

		callback(null, new_res);
	});
}

Database.prototype.getUserContracts = function(username, callback) {
	this.con.query("SELECT contract.id, washerid, vehicleid, price, full_vacuuming, floor_mats, vinyl_and_plastic, \
		centre_console, button_cleaning, hand_wash, clean_tires, hand_wax, image, make, model, license_plate, year \
		FROM (contract JOIN vehicles ON contract.vehicleid=vehicles.id) \
		WHERE ownerid=? or washerid=?", 
		[username, username], 
		function(err, result) {
			if (err) {
				console.log(err.Error);
				callback(err, null);
			}

			callback(null, result);

	});
}

exports.Database = Database;