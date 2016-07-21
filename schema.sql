-- note: user password MUST be bcrypted and salted

CREATE TABLE  user (
	id INTEGER PRIMARY KEY,
	name TEXT NOT NULL,
	email TEXT NOT NULL,
	password TEXT NOT NULL
);


-- make is the brand (ie Toyota)
-- model is the car model name (Corolla)

-- owner is the userid of the owner
-- image is the URL
CREATE TABLE vehicle (
	id INTEGER PRIMARY KEY,
	make TEXT NOT NULL,
	model TEXT NOT NULL,
	year INTEGER NOT NULL,
	license_plate TEXT NOT NULL,
	ownerid INTEGER NOT NULL,
	image TEXT,
	
	FOREIGN KEY(ownerid) REFERENCES user(id)
);

CREATE TABLE contract (
	id INTEGER PRIMARY KEY,
	latitude TEXT,
	longitude TEXT,
	washerid INTEGER NOT NULL,
	vehicleid INTEGER NOT NULL,
	price INTEGER NOT NULL,
	full_vacuuming BOOLEAN NOT NULL,
	floor_mats BOOLEAN NOT NULL,
	vinyl_and_plastic BOOLEAN NOT NULL,
	centre_console BOOLEAN NOT NULL,
	button_cleaning BOOLEAN NOT NULL,
	hand_wash BOOLEAN NOT NULL,
	clean_tires BOOLEAN NOT NULL,
	hand_wax BOOLEAN NOT NULL,
	
	FOREIGN KEY(washerid) REFERENCES user(id),
	FOREIGN KEY(vehicleid) REFERENCES vehicle(id)
	
);

-- subject: the person being written about
-- author: the person writing the review
CREATE TABLE review (
	id INTEGER PRIMARY KEY,
	subjectid INTEGER NOT NULL,
	authorid INTEGER NOT NULL,
	content TEXT,
	rating INTEGER,
	
	FOREIGN KEY(subjectid) REFERENCES user(id),
	FOREIGN KEY(authorid) REFERENCES user(id),
);