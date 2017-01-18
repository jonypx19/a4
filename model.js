var mysql = require('mysql');
var bcrypt = require('bcryptjs');

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

Database.prototype.checkIn = function() {
	this.con.query('SELECT 1');
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

// used for /confirmuser and /confirmadmin
Database.prototype.checkUser = function(email, isadmin, callback) {
	// fullchee
	this.con.query('SELECT id, password, isadmin, name\
		FROM users\
		WHERE ? = email and isadmin = ?',[email, isadmin], function(err, result) {

			if (err) {
				console.log('Failed to checkUser()');
			}

			if (result) {
				callback(err, result[0]);  // at most 1 result, email is unique
			}
			else {
				callback(err, null);  // at most 1 result, email is unique
			}
		});
};

Database.prototype.checkUser_2 = function(email, callback) {
	this.con.query("SELECT name, email FROM users WHERE email=? LIMIT 1", [email], function(err, result) {
		if (err) {
			callback(err, null);
		} else {
			callback(null, result);
		}
	});
}


// used after a user signs up
Database.prototype.insertUser = function(user, callback) {

	if (! user.password) {
		user.password = null;
	}

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

Database.prototype.deleteUser = function(email) {
	this.con.query('DELETE FROM users\
		WHERE email = ?;', [email], 
		function(err, result) {
			if (err) {
				console.log(err);
				console.log("model.js: Could not deleteUser()");
			}

			console.log('model.js: Deleted user with email: ' + email);
		});
};

Database.prototype.getAllUsers = function(callback) {
	this.con.query("SELECT * FROM users WHERE isadmin=0", function(err, result) {
		if (err) {
			console.log("model.js: could not getAllUsers()");
			callback(err, null);
		} else {
			callback(null, result);
		}
	});
};

Database.prototype.getBio = function(email, callback) {
	this.con.query("SELECT bio FROM users WHERE email=?", [email], function(err, result) {
		if (err) {
			console.log('could not get bio from db');
			callback(err, null);

		} else {
			callback(null, result);
		}
	});	
}

Database.prototype.updateBio = function(bio, email, callback) {
	this.con.query("UPDATE users SET bio=? WHERE email=?", [bio, email], function(err) {
		if (err) {
			console.log("could not update bio in db");
			callback(err);
		} else {
			callback(null);
		}
	});
}

Database.prototype.getFollowers = function(id, callback) {
	this.con.query("SELECT users.name AS username, users.email AS email \
		FROM (users JOIN followers ON users.id=followers.followee_id) WHERE followers.follower_id=?", 
		[id],
		function (err, result) {
			if (err) {
				console.log("can't get followers from db");
				callback(err, null);
			} else {
				callback(null, result);
			}
		});
};

Database.prototype.addFollower = function(leaderEmail, follower_id, callback) {
	var con = this.con;
	con.query('SELECT id FROM users WHERE email=?', [leaderEmail], function(err, res) {
		var leader_id = res[0].id;

		con.query('SELECT id FROM followers WHERE follower_id=? and followee_id=?', [follower_id, leader_id], function(err, r) {

			if (r.length > 0) {
				console.log('already a follower');
				callback(true);
				return;
			}

			

			con.query('INSERT INTO followers (follower_id, followee_id) VALUES (?, ?)',
				[follower_id, leader_id],
				function (err, result) {
					if (err) {
						console.log('Could not follow user');

						console.log('model.js: ' + err.code);

						if (err.code === 'ER_DUP_ENTRY') {
							callback(err);
						}
					}
					else {
						callback(null);
					}
				});
		});
	});
};

//------------------------ Vehicles Queries

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

Database.prototype.deleteContractChat = function(chatid, callback) {

	this.con.query("DELETE FROM chat_reply WHERE chat_id=?",
		[chatid],
		function (err, result) {
			if (err) {
				console.log("couldn't delete chat messages");
				callback(err, null);
			} else {
				callback(null, true);
			}
		});

}

Database.prototype.deleteContract = function(contractid) {
	this.con.query("DELETE FROM contract WHERE id=?", [contractid], function(err) {
		if (err) {
			console.log("could not delete contract");
		}
	});
}

Database.prototype.changeContractStatus = function(contractid, washer, status, callback) {

	if (washer) {
		if (washer === 'delete') {
			washer = null;
		}
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

Database.prototype.findClientContracts = function(lat, lon, userid, callback) {
	this.con.query("SELECT * FROM (vehicles JOIN contract ON contract.vehicleid=vehicles.id) WHERE status='available' and ownerid<>?",[userid], function (err, result) {
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

Database.prototype.getContractChat = function(chatid, callback) {
	this.con.query("SELECT * FROM chat_reply WHERE chat_id=? ORDER BY date ASC", 
		[chatid],
		function (err, result) {
			if (err) {
				console.log(err);
				callback(err, null);
				return;
			}

			callback(null, result);
		});
}

Database.prototype.insertChatReply = function(chatid, message, userid, callback) {
	this.con.query("INSERT INTO chat_reply (chat_id, message, userid) VALUES (?, ?, ?)",
		[chatid, message, userid],
		function (err, result) {
			if (err) {
				console.log(err);
				callback(err, null);
				return;
			}

			callback(null, true);
		});
}

Database.prototype.getUserContracts = function(username, callback) {
	this.con.query("SELECT contract.id as id, washerid, status, vehicleid, ownerid, price, full_vacuuming, floor_mats, vinyl_and_plastic, \
		centre_console, button_cleaning, hand_wash, clean_tires, hand_wax, image, make, model, license_plate, vehicles.year, owner.name as owner_name, owner.email as owner_email, \
		washer.name as washer_name, washer.email as washer_email, city, address, postal_code \
		FROM ((contract JOIN vehicles JOIN users owner ON contract.vehicleid=vehicles.id and owner.id=ownerid) LEFT OUTER JOIN users washer ON washer.id=washerid)\
		WHERE (ownerid=? or washerid=?) and status<>'complete'", 
		[username, username], 
		function(err, result) {
			if (err) {
				console.log(err);
				callback(err, null);
			}

			callback(null, result);

	});
}

Database.prototype.getCompletedUserContracts = function(username, callback) {
	this.con.query("SELECT contract.id as id, washerid, status, vehicleid, ownerid, price, full_vacuuming, floor_mats, vinyl_and_plastic, \
		centre_console, button_cleaning, hand_wash, clean_tires, hand_wax, image, make, model, license_plate, vehicles.year, owner.name as owner_name, owner.email as owner_email, \
		washer.name as washer_name, washer.email as washer_email, city, address, postal_code \
		FROM ((contract JOIN vehicles JOIN users owner ON contract.vehicleid=vehicles.id and owner.id=ownerid) LEFT OUTER JOIN users washer ON washer.id=washerid)\
		WHERE (ownerid=? or washerid=?) and status='complete'", 
		[username, username], 
		function(err, result) {
			if (err) {
				console.log(err.Error);
				callback(err, null);
			}

			callback(null, result);

	});
}

Database.prototype.getUserReviews = function(email, callback) {
	var con = this.con;

	con.query("SELECT id as l_id FROM users WHERE email=?", [email], function (err, res) {
		if (err || !res[0]) {
			callback(err, null);
			return;
		}

		var sub_id = res[0].l_id;
		con.query("SELECT users.name AS 'from', review.content AS content, review.rating AS rating \
		FROM (review JOIN users ON users.id=review.authorid) WHERE review.subjectid=?",
		[sub_id],
		function (err, result) {
			if (err) {
				console.log("Unable to select Reviews from db");
				callback(err, null);
			} else {
				callback(null, result);
			}
		});
	});
	
}


// TODO: SQL syntax error (Fullchee)

Database.prototype.postReview = function(washer_email, rater_email, content, rating, callback) {
	var con = this.con;
	con.query("SELECT washer.id as washerid, rater.id as raterid \
		FROM (users washer JOIN users rater) WHERE washer.email=? and rater.email=?", [washer_email, rater_email], function(err, res) {
			console.log(res);
			if (err) {
				callback(err);
				return;
			}
			
			var washer_id = res[0].washerid;
			var rater_id = res[0].raterid;

			con.query("INSERT INTO review (subjectid, authorid, content, rating) VALUES (?, ?, ?, ?)",
				[washer_id, rater_id, content, rating], 
				function(err) {
					if (err) {
						callback(err);
					} else {
						callback(null);
					}
			});
		});
	
}

exports.Database = Database;