var express = require('express');
var app = express();
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var user = require('./public/assets/scripts/users.js');

// may have to be installed locally
var morgan = require('morgan');

var router = require('./routes/router.js');

// Set views path, template engine and default layout
app.use(express.static(__dirname + '/public/assets'));  // location of static/client files
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

app.use(router.router);

app.use(morgan("short"));  // simple logger to the server console for debugging

var server = app.listen(3000, function(){
    var port = server.address().port;
    console.log("Running on 127.0.0.1:%s", port);
});
