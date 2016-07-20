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
	
	this.con.query("INSERT INTO Vehicles (username, manufacturer, model, year, license, image) \
		VALUES (?, ?, ?, ?, ?, ?)", 
		[username, vehicle.manu, vehicle.model, vehicle.year, vehicle.plate, image_data], 
		function (err, result) {
			if (err) {
				console.log("An Error occured during inserting vehicle");
			}
		});
};

Database.prototype.getUserVehicles = function(username, callback) {
	this.query = this.con.query("SELECT * FROM Vehicles WHERE username=?", [username], function(err, result) {
		if (err) {
			console.log("Could not find Vehicles Table");
			callback(err, null);
		}

		callback(null, result);

	});
}

exports.Database = Database;