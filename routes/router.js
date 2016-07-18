var express = require('express');
var mysql = require('mysql');
var upload = require('../upload');
var router = express.Router();
var user = require('../public/assets/scripts/users.js');
var fs = require('fs'); //For phase 1 implentation of users only.

//set connection to mysql database
var con = mysql.createConnection({
    host: 'localhost',
    user: 'Ross',
    password: 'Detail&Wash',
    database: 'Detail_Wash'
});

con.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});

// All of the routes
// Get the index page:
router.get('/', function(req, res) {
    res.render('index.html');
});

router.get('/signup', function(req, res) {
    res.render('signup.html');
});

router.get('/about', function(req,res){
    res.render('aboutus.html');
});

router.get('/test', function(req,res){
    res.end("Hello there");
});

router.get('/vehicles', function(req, res){
	res.render('vehicles.html');
});

router.get('/contracts', function(req, res) {
    res.render('contracts.html')
});

router.get('/users/listUsers',function(req,res){
    console.log(typeof user);

    //For cross domain
    //response.writeHead(200, {"Content-Type":"text/plain", "Access-Control-Allow-Origin":"*"});
    res.writeHead(200, {"Content-Type":"text/plain"});
    fs.readFile(__dirname + "/users.json", 'utf8', function(err,data){
        console.log(data);
        res.end(data);
    });
    // var usersArray =[];
    // var user1 = user("George", "1234", "user");
    // var user2 = user("Bob", "4321", "admin");
    // var user3 = user("Billy", "asdf", "user");
    // console.log(user1);
    // usersArray.push(user1);
    // usersArray.push(user2);
    // usersArray.push(user3);
    // res.end(JSON.stringify(usersArray));
});

router.post('/vehicles/registerVehicle', function(req, res) {

    upload.uploadImage(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        console.log(req.body);
        console.log(req.file);
        
    });

    res.write("File is uploaded");
    res.end();
});

router.get('/vehicles/listVehicles', function(req, res) {

	// sample json data of cars. going to replace this with a database access
	// method 
	var json = [{
        manufacturer: 'Porsche',
        model: '911',
        year: '2004',
        license: 'ABCD 555',
        img: 'placeholder_car.jpg'
    },{
        manufacturer: 'Nissan',
        model: 'GT-R',
        year: '2014',
        license: 'ABCD 554',
        img: 'placeholder_car.jpg'
    },{
        manufacturer: 'BMW',
        model: 'M3',
        year: '2004',
        license: 'ABCD 553',
        img: 'placeholder_car.jpg'
    },{
        manufacturer: 'Audi',
        model: 'S5',
        year: '2013',
        license: 'ABCD 552',
        img: 'placeholder_car.jpg'
    }];

    var result = JSON.stringify(json)
    res.write(result);
    res.end();
});

router.get('/adminlogin', function(req, res){
    //TODO: Password authenication
    //TODO: Two factor login (Use google/facebook)
    //TODO: Session for logged in users (Use cookies)
    //TODO: Database query for user creation
    //TODO: Bio page.
    // res.send("Hi, you're an admin.")
    res.render('../public/adminlogin',{
        errors:''
    });
});

router.get('/userlogin', function(req, res) {
    res.render('../public/userlogin.html',{
        errors:''
    });

});

router.post('/confirmuser',function(req,res){
    var username = req.body.user;
    var password = req.body.password;
    response = {
        username:req.body.user,
        password: req.body.password
    };

    fs.readFile(__dirname + "/users.json", 'utf8', function(err,data){
        var object = JSON.parse(data);
        console.log(object);
        for(var i =0;i < 3; i++){
            if (object[i].username === username && object[i].password === password){
                if (object[i].privilege === "user") {
                    res.render("profile", {
                        name: username
                    });
                    return;
                }
                else{
                    res.render("userlogin",{
                        errors: "<p class=\"incorrect\">You are an admin. Please use the admin login."
                    });
                    return;
                }
            }
        }
        res.render("userlogin", {
            errors:"<p class = \"incorrect\">Incorrect username/password.</p>"
        });
    });
});


router.post('/confirmadmin',function(req,res){
    var username = req.body.user;
    var password = req.body.password;
    response = {
        username:req.body.user,
        password: req.body.password
    };

    fs.readFile(__dirname + "/users.json", 'utf8', function(err,data){
        var object = JSON.parse(data);
        console.log(object);
        for(var i =0;i < 3; i++){
            if (object[i].username === username && object[i].password === password){
                if (object[i].privilege === "admin") {
                    res.render("profile", {
                        name: username
                    });
                    return;
                }
                else{
                    res.render("adminlogin",{
                        errors: "<p class=\"incorrect\">You are a user. Please use the user login."
                    });
                    return;
                }
            }
        }
        //looped through everything didn't find matching password/username
        res.render("adminlogin", {
            errors:"<p class = \"incorrect\">Incorrect username/password.</p>"
        });
    });
});
// export the routings, to be used in server.js
exports.router = router;