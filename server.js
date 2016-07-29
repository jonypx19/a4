var express = require('express');
var session = require('client-sessions');
var app = express();
var path = require('path');
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var expressSanitizer = require('express-sanitizer')
var compression = require('compression');  // gzip middleware
var morgan = require('morgan');
var router = require('./routes/router.js');
var user = require('./public/assets/scripts/users.js');
var signupValidation = require('./helper/signupValidation.js');

app.use(morgan('tiny'));  // simple logger to the server console for debugging

// Set views path, template engine and default layout
app.use(express.static(path.join(__dirname + '/public/assets')));  // location of static/client files
app.engine('.html', require('ejs').__express);
app.set('views', path.join(__dirname + '/public'));
app.set('view engine', 'html');

app.set('port', (process.env.PORT || 3000));  // set the port number

// The request body is received on GET or POST.
// A middleware that just simplifies things a bit.
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(expressValidator({
    customValidators: {
    // Hint: You can re-use the regular expressions you used client-side!
    // But be sure to use forward slashes for the start and end of the expression ...
    isEmail: function(value) {
        if (value.search(/.+@.+\../) !== -1) {
            return true;
        }
        else {
            return false;
        }
    },
    isDay: function(value) {
            if (typeof value === 'number' && value > 0 && value < 31) {
                return true;
            }
            return false;
    },

    isMonth: signupValidation.isMonth,

    isYear: signupValidation.isYear,

    isPassword: function(value) {
    	// could enforce more password requirements
		if (value.length >= 6) {
			return true;
		}
		return false;
    }
}})); // This line must be immediately after express.bodyParser()

app.use(expressSanitizer());  // no options used


app.use(session({
    cookieName: 'session',
    secret: 'passwordstring',
    duration: 30 * 60 * 1000,
    activeDuration: 3 * 60 * 1000,
    httpOnly: true,
    ephmeral: true
}));

app.use(router.router);  // get all the GET and POST routing
app.use(compression());  // put gzip in place

var server = app.listen(app.get('port'), function(){
    var port = server.address().port;
    console.log("Running on port ", app.get('port'));
});
