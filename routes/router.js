var express = require('express');
var fs = require('fs');
var upload = require('../upload');
var router = express.Router();
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

router.get('/userlogin', function(req, res) {
    res.render('userlogin.html',{
        errors:''
    });

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
    var usersArray =[];
    var user1 = user("George", "1234", "user");
    var user2 = user("Bob", "4321", "admin");
    var user3 = user("Billy", "asdf", "user");
    console.log(user1);
    usersArray.push(user1);
    usersArray.push(user2);
    usersArray.push(user3);
    res.end(JSON.stringify(usersArray));
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
            res.redirect('vehicles.html');
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
    //TODO: Two factor login
    //TODO: Session for logged in users
    //TODO: Database query for user creation
    //TODO: Bio page.
    // res.send("Hi, you're an admin.")
    res.render('./public/adminlogin',{
        errors:''
    });
});

router.post('/login',function(req,res){
    res.render('./public/profile.html',{
        errors:''
    });
});

// export the routings, to be used in server.js
exports.router = router;