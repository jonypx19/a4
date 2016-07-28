var express = require('express');
var passport = require('passport');
var mysql = require('mysql');
var upload = require('../upload');
var router = express.Router();
var user = require('../public/assets/scripts/users.js');
var fs = require('fs'); //For phase 1 implentation of users only.
var model = require('../model.js');
var node_geocoder = require('node-geocoder');
var signupValidation = require('../helper/signupValidation.js');
var bcrypt = require('bcryptjs');

// set connection to mysql database
var con = mysql.createConnection({
    host: 'localhost',
    user: 'Ross',
    password: 'Detail&Wash',
    database: 'Detail_Wash'
});

// create Database connection
var database = new model.Database('localhost', 'root', '', 'Detail_Wash');

// login credentials for Heroku ClearDB
// var con = mysql.createConnection({
//     host: 'us-cdbr-iron-east-04.cleardb.net',
//     user: 'bf7055f108f91a',
//     password: '8a5f2a1f',
//     database: 'heroku_fb3dc2d4bdd13bf'
// });
// var database = new model.Database('us-cdbr-iron-east-04.cleardb.net', 'bf7055f108f91a', '8a5f2a1f', 'heroku_fb3dc2d4bdd13bf');

database.connect();





var geocoder = node_geocoder({
    provider: 'google',
    httpAdapter: 'https', 
    formatter: null
});

// All of the routes
// Get the index page:
router.get('/', function(req, res) {
    if (req.session && req.session.email){
        if(req.session.privilege == "user")
            res.redirect("/user/" + req.session.email);
        else{
            res.redirect("/adminprofile");
        }
    }
    else {
        res.render('index.html');
    }
});

router.get('/signup', function(req, res) {
    if (req.session && req.session.email){
        if(req.session.privilege == "user")
            res.redirect("/user/" + req.session.email);
        else{
            res.redirect("/adminprofile");
        }
    }
    else {
        res.render('signup.html', {
            errors: ''
        });
    }
});

router.get('/about', function(req,res){
    res.render('aboutus.html');
});

router.get('/vehicles', function(req, res){
	res.render('vehicles.html');
});

router.get('/contracts', function(req, res) {
    res.render('contracts.html');
});

router.get('/contracts/search', function(req, res) {
    res.render('contract_search.html')
});

router.post('/search/searchContracts', function(req, res) {
    geocoder.geocode("" + req.body.address + req.body.city + req.body.province + req.body.country, function(err, res_geo) {
        database.findClientContracts(res_geo[0].latitude, res_geo[0].longitude, function (err, result) {
            res.end(JSON.stringify(result));
            return;
        });
    });
});

router.get('/user/listUsers',function(req,res){
    console.log(typeof user);

    //For cross domain
    //response.writeHead(200, {"Content-Type":"text/plain", "Access-Control-Allow-Origin":"*"});

    //TODO: Return an array of all users that have privilege=users.
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

router.post('/search/takeContract', function(req, res) {
    database.checkContractStatus(req.body.id, 'taken', function(err, result) {
         var obj = {};
        
        if (result) {
            obj.message = "Contract has already been taken";
            res.end(JSON.stringify(obj));
        } else {
            database.changeContractStatus(req.body.id, req.session.userid,'taken', function(err) {

            });
            obj.message = "Contract has been Successfully taken";
            res.end(JSON.stringify(obj));
        }

        
    });
});

router.post('/contracts/registerContract', function(req, res) {
    var userid=req.session.userid;


    geocoder.geocode("" + req.body.address + req.body.city + req.body.province + req.body.country + req.body.postal_code, function(err, res_geo) {

        database.checkDuplicateContract(req.body.vehicleid, function(err, result) {
            req.body.latitude = res_geo[0].latitude;
            req.body.longitude = res_geo[0].longitude;

            var opt_list = ['vacuum', 'mats', 'protect', 'console', 'button_clean', 'wash', 'tires', 'wax'];
            //check detail options

            // error handleing
            if (req.body.vehicleid == '') {
                console.log("vehicle not selected");
                res.redirect('/vehicles');
                return;
            }
            
            // if vehicle is already on a contract that is not complete
            if (result) {
                console.log('vehicle still on ongoing contract');
                res.redirect('/vehicles');
                return;
            }

            for (var i = 0; i < opt_list.length; i++) {
                if (req.body[opt_list[i]] == undefined) {
                    req.body[opt_list[i]] = false;
                } else {
                    req.body[opt_list[i]] = true;
                }
            }
            
            database.insertContract(req.body);

            res.redirect('/vehicles');

        });
        
        
    });
    
    
});

router.get('/contracts/listContracts', function(req, res) {
    var userid=req.session.userid;
    console.log(req.session.email);

    database.getUserContracts(userid, function(err, data) {
        var owner = [];
        var washer = [];

        if (data != null) {

            for (var i=0; i < data.length; i++) {

                if (data[i].ownerid == userid) {
                    owner.push(data[i]);
                } else if (data[i].washerid == userid) {
                    washer.push(data[i]);
                }
            }
        }

        var json = {};
        json.owner = owner;
        json.washer = washer;

        var result = JSON.stringify(json);
        res.end(result);
    });
});

router.post('/vehicles/registerVehicle', function(req, res) {

    // used to upload image of the client's vehicle
    upload.uploadImage(req,res,function(err) {
        if(err) {
            res.end("Error uploading file.");
            return;
        }


        // inserts form data for vehicle into database
        database.insertVehicle(req.session.userid, req.body, req.file.path.slice(req.file.path.indexOf('/images')));
            
        res.redirect('/vehicles');
        
    });

});

router.get('/vehicles/listVehicles', function(req, res) {

    // bob is a  placeholder, until i can retrieve session data 
	database.getUserVehicles(req.session.userid, function(err, data) {

        // turns the binary image data into base64 encoded data and sends it to the page

        var json = data;
        var result = JSON.stringify(json);
        res.end(result);
    });
    
});

router.get("/getComments",function(req,res){
    if (req.session && req.session.email){

        if(req.session.viewedEmail){
            //Return based on email
            //TODO: Get all the comments (should have rating, from, and content) on the user based on req.session.viewedEmail.
            //TODO: Return as an array of objects
            fs.readFile(__dirname + "/users.json", 'utf8', function (err, data) {
                var mainData = JSON.parse(data);
                console.log(mainData);
                var commentArray = [];
                for (var i = 0; i < mainData.length; i++) {
                    if (mainData[i].email == req.session.viewedEmail) {
                        for (var j = 0; j < mainData[i].comments.length; j++) {
                            var commentObject = new Object();
                            commentObject.from = mainData[i].comments[j].from;
                            commentObject.content = mainData[i].comments[j].content;
                            commentObject.rating = mainData[i].comments[j].rating;
                            //console.log(mainData[i].comments[j].from);
                            //console.log(mainData[i].comments[j].content);
                            //console.log(mainData[i].comments[j].rating);
                            commentArray.push(commentObject);
                        }
                        break;
                    }

                }
                delete req.session.viewedEmail;
                res.send(JSON.stringify(commentArray));
            });
        }
        else {
            //TODO: Get all the comments (should have rating, from, and content) on the user based on current user.
            //TODO: Return as an array of objects
            fs.readFile(__dirname + "/users.json", 'utf8', function (err, data) {
                var mainData = JSON.parse(data);
                console.log(mainData);
                var commentArray = [];
                for (var i = 0; i < mainData.length; i++) {
                    if (mainData[i].email == req.session.email) {
                        for (var j = 0; j < mainData[i].comments.length; j++) {
                            var commentObject = new Object();
                            commentObject.from = mainData[i].comments[j].from;
                            commentObject.content = mainData[i].comments[j].content;
                            commentObject.rating = mainData[i].comments[j].rating;
                            //console.log(mainData[i].comments[j].from);
                            //console.log(mainData[i].comments[j].content);
                            //console.log(mainData[i].comments[j].rating);
                            commentArray.push(commentObject);
                        }
                        break;
                    }

                }
                res.send(JSON.stringify(commentArray));
            });
        }
        //Placeholder right now will be a JSON file with this stuff. You can check it out for an idea of the JSON object to return
    }
    else{
        //If there isn't a user logged in, redirect to login page
        res.redirect("/userlogin");
    }
});

router.get("/getFollowing",function(req,res){
    if (req.session && req.session.email){
        //TODO: Get all the followers of the user based on email.
        //TODO: Return as an array of objects (should have data full name and email). Check out users.json for reference.
        fs.readFile(__dirname + "/users.json", 'utf8', function(err,data){
            var mainData = JSON.parse(data);
            console.log(mainData);
            var followerArray = [];
            for(var i =0;i < mainData.length; i++){
                if (mainData[i].email == req.session.email){
                    for (var j = 0; j < mainData[i].following.length; j++){
                        var followerObject = new Object();
                        followerObject.username = mainData[i].following[j].username;
                        followerObject.email = mainData[i].following[j].email;
                        //console.log(mainData[i].comments[j].username);
                        //console.log(mainData[i].comments[j].email);
                        followerArray.push(followerObject);
                    }
                    break;
                }

            }
            res.send(JSON.stringify(followerArray));
        });

        //Placeholder right now will be a JSON file with this stuff. You can check it out for an idea of the JSON object to return
    }
    else{
        //If there isn't a user logged in, redirect to login page.
        res.redirect("/userlogin");
    }
});

router.get('/user/:email', function(req,res){
    //If there does not exist a currently logged in user, redirect to login page. If there's an admin, do the same.
    //TODO: Search the db based on the email. Find that user. Get their name, comments, and ratings. Return it as an object here. Check out the users.json for reference.
    if(req.session && req.session.email){
        if (req.session.privilege == "admin"){
            res.redirect("/adminprofile");
        }
        else{

            // TODO: (Fullchee) get the average rating from db
            console.log(req.params.email);
            req.session.viewedEmail=req.params.email;
            res.render("viewprofile", {
                name:req.params.email
            });
            return;
        }
    }
    else{
        res.redirect("/userlogin");
        return;
    }
});

// TODO (Fullchee): 
router.post('/submitComment/:email', function(req,res){
    if (req.session && req.session.username) {
        var rater = req.session.username; // current user
        var comment = req.body.comment;
        var rating = req.body.rating; //The rating given.
        var washer = req.params.email;

        //Do the posting here.
        database.insertReview(washer, rater, comment, rating);

    }

    // need to login to make a review
    else {
        res.redirect("/userlogin");
        return;
    }

    // refresh the page which should now have the new comment
    // go back to that user's profile
    res.render('/user/' + washer);

});

router.get('/adminlogin', function(req, res){
    //TODO: Password authenication
    //TODO: Database query for user creation
    // res.send("Hi, you're an admin.")
    if (req.session && req.session.email){
        if(req.session.privilege == "user")
            res.redirect("/user/" + req.session.email);
        else{
            res.redirect("/adminprofile");
        }
    }
    else {
        res.render('../public/adminlogin', {
            errors: ''
        });
    }
});

router.get('/userlogin', function(req, res) {
    if (req.session && req.session.email){
        if(req.session.privilege == "user")
            res.redirect("/user/" + req.session.email);
        else{
            res.redirect("/adminprofile");
        }
    }
    else {
        res.render('../public/userlogin.html', {
            errors: ''
        });
    }
});

router.post('/confirmuser',function(req,res){
    //res.writeHead(200, {"Content-Type":"text/plain", "Access-Control-Allow-Origin":"*"});
    var username;
    var password;
    if (req.body.isGoogleSignIn){
        username = req.body.name;
        req.session.email = username;
        req.session.privilege = "user";
        
        database.checkUser(username, function(err, result) {
            // username doesn't exist: put it in
            if (!result) {
                // TODO (Fullchee), figure out how google sign in works
                // database.insertUser();
            }
            res.render("userlogin",{
                errors: "<p class=\"incorrect\">Incorrect email and/or password</p>"
            });
            return;

        });

        //TODO: as a new one with privilege = user.(since this is verified as a google account).
        res.redirect("/user/" + req.session.email);
        return;
    }  // end of google signin
    var username = req.sanitize(req.body.user);  // prevent XSS
    var password = req.sanitize(req.body.password);

    //TODO: Return a user based on username(which is email right now). Needs to return an object with email and full name and (maybe) password.
    // fs.readFile(__dirname + "/users.json", 'utf8', function(err,data){
    //     var object = JSON.parse(data);
    //     console.log(object);
    //     for(var i =0;i < data.length; i++){
    //         if (object[i].email === username && object[i].password === password){
    //             if (object[i].privilege === "user") {
    //                 req.session.email = username;

    // Step 1: fetch the password from that user in the db
    database.checkUser(username, function(err, result) {
        if (result) {

            // step 2: compare the hash with given password
            if (bcrypt.compareSync(password, result.password)) {
                req.session.userid = result.id;
                req.session.username = username;
                req.session.email = username;
                //TODO: FETCH THE FULL NAME FOR USERNAME.
                delete req.session.password; //deleting password if saved

                if (! result.isadmin) {  // user
                    req.session.privilege = "user";
                    res.redirect("/userprofile");
                    return;
                }
                else {
                    // do nothing, admins shouldn't login here
                    req.session.privilege = 'admin';
                    res.redirect('/adminprofile');
                    return;
                }
            }
    }

    res.render("userlogin",{
        errors: "<p class=\"incorrect\">Incorrect email and/or password</p>"
    });
    return;
    });


    // OLD WAY, READ A JSON FILE
    // fs.readFile(__dirname + "/users.json", 'utf8', function(err,data){
    //     var object = JSON.parse(data);
    //     console.log(object);
    //     for(var i =0;i < 3; i++){
    //         if (object[i].username === username && object[i].password === password){
    //             if (object[i].privilege === "user") {
    //                 req.session.username = username;
    //                 req.session.privilege = "user";
    //                 delete req.session.password; //deleting password if saved.
    //                 res.redirect("/userprofile");
    //                 return;
    //             }
    //             else{
    //                 res.render("userlogin",{
    //                     errors: "<p class=\"incorrect\">You are an admin. Please use the admin login."
    //                 });
    //                 return;
    //             }
    //         }
    //     }
    //     res.render("userlogin", {
    //         errors:"<p class = \"incorrect\">Incorrect username/password.</p>"
    //     });
    // });
});

router.post('/confirmadmin',function(req,res){
    var username = req.body.user;
    var password = req.body.password;
    response = {
        username:req.body.user,
        password: req.body.password
    };

    //TODO: Return a user. Needs to return an object that has attributes email and username and (maybe) password.
    fs.readFile(__dirname + "/users.json", 'utf8', function(err,data){
        var object = JSON.parse(data);
        console.log(object);
        for(var i =0;i < data.length; i++){
            if (object[i].username === username && object[i].password === password){
                if (object[i].privilege === "admin") {
                    req.session.email = username;
                    req.session.privilege = "admin";
                    delete req.session.password; //deleting password if saved.
                    res.redirect("/adminprofile");
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

router.get("/userprofile", function(req, res){
    if (req.session && req.session.email) {
        if(req.session.viewedEmail){
            delete req.session.viewedEmail;
        }
        res.render("profile", {
            name: "USER: " + req.session.email
        });
    }
    else{
        res.redirect("/userlogin");
    }
});

router.post('/rateuser', function(req, res) {
    if (req.session && req.session.username) {

        req.body.rating = req.sanitize(req.body.rating);

        // add the rating to the database


        
    }
    else {
        console.log('User attempted to rate a user without a login');
    }

    return;
});

router.get("/adminprofile", function(req,res){
    if (req.session && req.session.email) {
        res.render("adminprofile", {
            name: "ADMIN: " + req.session.email
        });
    }
    else{
        res.redirect("/adminlogin");
    }
});

router.get("/logout", function(req,res){
    req.session.reset();
    res.redirect("/");
});

router.post('/confirmSignup', function (req, res) {

    // validation
    req.assert('name', 'A name is required').notEmpty();
    req.assert('email', 'An email address is required').notEmpty();
    req.assert('email', 'Please enter a valid email.').isEmail();

    req.assert('password', 'A password is required').notEmpty();
    req.assert('password', 'A password is required').isPassword();

    req.assert('repeat_password', 'Your password must be repeated').notEmpty();
    
    req.assert('password', 'Password is invalid').isLength({min: 6}).equals(req.body.repeat_password);

    var isValidDate = signupValidation.isValidDate(req.body.month, req.body.day, req.body.year);

    // sanitation
    req.body.name = req.sanitize(req.body.name);
    req.body.email = req.sanitize(req.body.email);
    req.body.password = req.sanitize(req.body.password);
    req.body.repeat_password = req.sanitize(req.body.repeat_password);
    req.body.month = req.sanitize(req.body.month);
    req.body.day = req.sanitize(req.body.day);
    req.body.year = req.sanitize(req.body.year);

    // check for errors and map them if they exist
    var errors = req.validationErrors();
    var mappedErrors = req.validationErrors(true);


    for (var i = 0; i < errors.length; i++) {
        console.log(errors[i]);
    }

    // send validation errors back
    if (errors) {
        var errorMsgs = { "errors": {} };

        if ( mappedErrors.email ) {
            errorMsgs.errors.error_email = 'The email you entered is invalid.';
        }

        if ( ! isValidDate ) {
            errorMsgs.errors.error_date = 'The date you entered is invalid.';
        }

        req.session.errors = errors;
        res.render('signup', errorMsgs);
    }

    // hash and salt password before storing
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            if (err) {
                res.writeHead(404);
                res.end(JSON.stringify(err));
                return;
            }

            req.body.password = hash;

            // save the request info into the db
            database.insertUser(req.body, function (err){
                if (err) {
                    res.render('signup', {
                        'errors': {
                            'error_email': 'There is already an account with this email.'
                        }

                    });
                }
                else {
                    res.redirect('/userlogin');
                }
            });
            
        });
    });
});
// export the routings, to be used in server.js
exports.router = router;