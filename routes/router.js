var express = require('express');
var passport = require('passport');
var mysql = require('mysql');
var fs = require('fs');
var upload = require('../upload');
var router = express.Router();
var user = require('../public/assets/scripts/users.js');
var fs = require('fs'); //For phase 1 implentation of users only.
var model = require('../model.js');
var temp;

// create Database connection
var database = new model.Database('localhost', 'Ross', 'Detail&Wash', 'Detail_Wash');
database.connect()

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

    // used to upload image of the client's vehicle
    upload.uploadImage(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        
        fs.readFile(req.file.path, "binary", function(err, data) {
            if(err) {
                throw err;
            }

            // inserts form data for vehicle into database
            database.insertVehicle('bob', req.body, data);
            res.write("Vehicle Successfully Registered");
            
            res.end();
        });
        
    });

});

router.get('/vehicles/listVehicles', function(req, res) {

    // bob is a  placeholder, until i can retrieve session data 
	database.getUserVehicles('bob', function(err, data) {

        for (var i = 0; i < data.length; i++) {
            var encode64 = new Buffer(data[i].image.toString(), 'binary').toString('base64');
            data[i].image = "data:image/jpg;base64," + encode64;
        }

        var json = data;
        var result = JSON.stringify(json)
        res.write(result);
        res.end();
    });
    
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

router.post('/confirmSignup', function (req, res) {

    req.assert('name', 'A name is required').notEmpty();
    req.assert('email', 'An email address is required').notEmpty();
    req.assert('email', 'Please enter a valid email.').isEmail();

    req.assert('password', 'A password is required').notEmpty();
    req.assert('repeat_password', 'Your password must be repeated').notEmpty();
    
    req.assert('password', 'Password is invalid').isLength({min: 6}).equals(req.body.repeat_password);

    // TODO: add birthday validation

    // TODO: if errors, display errors with ejs on the signup page

    // TODO: save the info into the db

    // TODO: render the home page as a logged in person

});
// export the routings, to be used in server.js
exports.router = router;