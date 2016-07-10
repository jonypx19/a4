var express = require('express');
var app = express();
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');

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
    res.send("Hello there, how's it going?");
    
});

app.post('/signup', function(req, res) {

});

app.get('/userlogin', function(req, res) {
    res.render('userlogin',{
        errors:''
    });

});

app.get('/vehicles', function(req, res){
	res.render('vehicles.html');
})

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

var server = app.listen(3000, function()
{
  var port = server.address().port;
  console.log('Running on 127.0.0.1:%s', port);
});

app.get('/adminlogin', function(req, res){
    //TODO: Password authenication
    //TODO: Two factor login
    // res.send("Hi, you're an admin.")
    res.render('adminlogin',{
        errors:''
    });
});

app.post('/login',function(req,res){
    res.send("Request noted.");
});

var server = app.listen(8080,function(){
    var port = server.address().port;
    console.log("Running on 127.0.0.1:%s", port);
})