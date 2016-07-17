var express = require('express');
var router = express.Router();

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