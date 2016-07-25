-- note: user password MUST be bcrypted and salted

CREATE TABLE  users (
	id INTEGER PRIMARY KEY AUTO_INCREMENT,
	name TEXT NOT NULL,
	email TEXT NOT NULL,
	password TEXT NOT NULL,
	month TEXT NOT NULL,
	day INTEGER NOT NULL,
	year INTEGER NOT NULL
);


-- make is the brand (ie Toyota)
-- model is the car model name (Corolla)

-- owner is the userid of the owner
-- image is the URL
CREATE TABLE vehicles (
	id INTEGER PRIMARY KEY AUTO_INCREMENT,
	make VARCHAR(45) NOT NULL,
	model VARCHAR(45) NOT NULL,
	year INTEGER NOT NULL,
	license_plate VARCHAR(45) NOT NULL,
	ownerid INTEGER NOT NULL,
	image VARCHAR(100),
	
	FOREIGN KEY(ownerid) REFERENCES users(id)
);

CREATE TABLE contract (
	id INTEGER PRIMARY KEY AUTO_INCREMENT,
	latitude VARCHAR(100) NOT NULL,
	longitude VARCHAR(100) NOT NULL,
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
	country VARCHAR(45) NOT NULL,
	address VARCHAR(45) NOT NULL,
	province VARCHAR(45) NOT NULL,
	city VARCHAR(45) NOT NULL,
	postal_code VARCHAR(45) NOT NULL,
	status VARCHAR(45) NOT NULL,
	
	FOREIGN KEY(washerid) REFERENCES users(id),
	FOREIGN KEY(vehicleid) REFERENCES vehicles(id)
	
);

-- subject: the person being written about
-- author: the person writing the review
CREATE TABLE review (
	id INTEGER PRIMARY KEY AUTO_INCREMENT,
	subjectid INTEGER NOT NULL,
	authorid INTEGER NOT NULL,
	contractid INTEGER NOT NULL,
	content TEXT,
	rating INTEGER,
	
	FOREIGN KEY(subjectid) REFERENCES users(id),
	FOREIGN KEY(authorid) REFERENCES users(id)
);

INSERT INTO users (id, name, email, password)
	VALUES (1, 'super admin', 'info@cardetailexchange.ca', '$2a$10$ym4IYLE0OKUMJQCPhC.njenpg4XfmKtnXlrz23nQ/1IJPSrSQckoa');

-- password: 'thank you'
INSERT INTO users (id, name, email, password)
	VALUES (12, 'Terry Yan', 'ty@ty.ty', '$2a$10$ym4IYLE0OKUMJQCPhC.njenpg4XfmKtnXlrz23nQ/1IJPSrSQckoa');
	
	-- password: mysterion
INSERT INTO users (id, name, email, password)
	VALUES (11, 'Mysterion', 'whois@myserion.com', '$2a$10$kA6DAeHoxNYMyYR5Svs3Ae8RPyKmBzbiEC8J0zGrfbB9qGb9lYOHq');

-- owned by user 11
INSERT INTO vehicles (id, make, model, year, license_plate, ownerid, image)
	VALUES (1, 'Mystery Machine', 'N/A', '1969', 'AAAA 111', '11', 'images/placeholder_car.jpg');
	
