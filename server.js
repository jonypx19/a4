var express = require('express');
var app = express();
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var user = require('./public/assets/scripts/users.js');

console.log(typeof user);

// Set views path, template engine and default layout
app.use(express.static(__dirname + '/public/assets'));  // built in middleware function
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/public');
app.set('view engine', 'html');

// The request body is received on GET or POST.
// A middleware that just simplifies things a bit.
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(expressValidator({
    customValidators: {
    	
    }
})); // This line must be immediately after express.bodyParser()!    	


// Get the index page:
app.get('/', function(req, res) {
    res.render('index.html');
});

app.get('/signup', function(req, res) {
    res.render('signup.html');
});

app.get('/userlogin', function(req, res) {
    res.render('userlogin.html',{
        errors:''
    });

});

app.get('/about', function(req,res){
    res.render('aboutus.html');
});

app.get('/test', function(req,res){
    res.end("Hello there");
});

app.get('/vehicles', function(req, res){
	res.render('vehicles.html');
});

app.get('/contracts', function(req, res) {
    res.render('contracts.html')
});

app.get('/users/listUsers',function(req,res){
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

app.get('/vehicles/listVehicles', function(req, res) {

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

app.get('/adminlogin', function(req, res){
    //TODO: Password authenication
    //TODO: Two factor login
    // res.send("Hi, you're an admin.")
    res.render('./public/adminlogin',{
        errors:''
    });
});

app.post('/login',function(req,res){
    res.render('./public/profile.html',{
        errors:''
    });
});

var server = app.listen(3000,function(){
    var port = server.address().port;
    console.log("Running on 127.0.0.1:%s", port);
})