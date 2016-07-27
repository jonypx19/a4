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

// User Queries

Database.prototype.checkUser = function(email, password, callback) {
	this.con.query("SELECT id FROM users WHERE email=? and password=?",
		[email, password],
		function (err, result) {
			if (err) {
				console.log(err);
				callback(err, null, null);
			} 

			if (result.length == 1) {
				callback(null, true, result[0].id);
			} else {
				callback(null, false, null);
			}
		});
};

// used after a user signs up
Database.prototype.insertUser = function(user, callback) {

	// id is auto incremented
	this.con.query('INSERT INTO users (name, email, password, month, day, year) VALUES (?, ?, ?, ?, ?, ?)',
		[user.name, user.email, user.password, user.month, user.day, user.year],
		function (err, result) {
			if (err) {
				console.log('Could not insert user');

				console.log('model.js: ' + err.code);

				if (err.code === 'ER_DUP_ENTRY') {
					callback(err);
				}
			}
			else {
				callback(null);
			}
		});
};
// Vehicles Queries

Database.prototype.insertVehicle = function(username, vehicle, image_data) {
	
	this.con.query("INSERT INTO vehicles (ownerid, make, model, year, license_plate, image) \
		VALUES (?, ?, ?, ?, ?, ?)", 
		[username, vehicle.manu, vehicle.model, vehicle.year, vehicle.plate, image_data], 
		function (err, result) {
			if (err) {
				console.log('Could not insert vehicle');
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

// Contract Queries

Database.prototype.changeContractStatus = function(contractid, washer, status, callback) {

	if (washer === 'delete') {
		this.con.query("UPDATE contract SET status=?, washerid=? WHERE id=?",
		[status, null, contractid],
		function(err, result) {
			if (err) {
				console.log("couldn't update contract");
				callback(err);
			} else {
				callback(null);
			}
		});
	} else {
		this.con.query("UPDATE contract SET status=? WHERE id=?",
		[status, contractid],
		function(err, result) {
			if (err) {
				console.log("couldn't update contract");
				callback(err);
			} else {
				callback(null);
			}
		});
	}
	
}

Database.prototype.checkContractStatus = function(contractid, status, callback) {
	this.con.query("SELECT id, vehicleid, status FROM contract WHERE id=? and status=?",
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
	this.con.query("SELECT contract.id, washerid, vehicleid, ownerid, price, full_vacuuming, floor_mats, vinyl_and_plastic, \
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