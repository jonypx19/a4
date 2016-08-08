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


// // set connection to mysql database
// var con = mysql.createConnection({
//     host: 'localhost',
//     user: 'Ross',
//     password: 'Detail&Wash',
//     database: 'Detail_Wash'
//  });
//
//  // create Database connection
//  var database = new model.Database('localhost', 'root', '', 'Detail_Wash');



// login credentials for Heroku ClearDB
var db_config = {
    host: 'us-cdbr-iron-east-04.cleardb.net',
    user: 'bf7055f108f91a',
    password: '8a5f2a1f',
    database: 'heroku_fb3dc2d4bdd13bf'
};

var con = mysql.createConnection(db_config);
var database = new model.Database('us-cdbr-iron-east-04.cleardb.net', 'bf7055f108f91a', '8a5f2a1f', 'heroku_fb3dc2d4bdd13bf');

database.connect();

setInterval(function () {
    database.checkIn();
}, 5000);


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
            res.redirect("/userprofile");
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
            res.redirect("/userprofile");
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

router.get('/vehicles', function(req, res){
    if (req.session.userid) {
        res.render('vehicles.html');
    } else {
        res.redirect('/');
    }
	
});

router.get('/contracts', function(req, res) {
    if (req.session.userid) {
        res.render('contracts.html');
    } else {
        res.redirect('/');
    }
});

router.get('/contracts/search', function(req, res) {
    if (req.session.userid) {
        res.render('contract_search.html');
    } else {
        res.redirect('/');
    }
});

router.post('/search/searchContracts', function(req, res) {
    geocoder.geocode("" + req.body.address + req.body.city + req.body.province + req.body.country, function(err, res_geo) {
        console.log(res_geo);
        if (err || res_geo.length == 0) {
            res.end(JSON.stringify({error: "Enter a valid address"}));
        } else {
            database.findClientContracts(res_geo[0].latitude, res_geo[0].longitude, req.session.userid, function (err, result) {
                res.end(JSON.stringify(result));
                return;
            });
        }
    });
});

// Returns a list of all users that have user priviledge that are in the system.
router.get('/user/listUsers',function(req,res){
    database.getAllUsers(function(err, result) {
        res.json(result);
    });
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

router.post('/contracts/deleteContract', function(req, res) {
    database.deleteContractChat(req.body.id, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            database.deleteContract(req.body.id);
        }
    })
    
});


router.post('/contracts/cancelContract', function(req, res) {
    database.changeContractStatus(req.body.id, 'delete', 'available', function(err) {
        if (err) {
            console.log("Couldn't cancel contract");
            console.log(err);
        }else {
            database.deleteContractChat(req.body.chatid, function(err, result) {
                if (err) {
                    conosole.log(err);
                }
            })
        }
    });
});

router.post('/contracts/confirmContract', function(req, res) {
    database.changeContractStatus(req.body.id, null, 'complete', function(err){
        if (err) {
            console.log("Couldn't confirm contract completion");
            console.log(err);
        }
    });
});

router.post('/contracts/registerContract', function(req, res, next) {
    var userid=req.session.userid;

    req.body.address = req.sanitize(req.body.address);
    req.body.city = req.sanitize(req.body.city);
    req.body.province = req.sanitize(req.body.province);
    req.body.country = req.sanitize(req.body.country);
    req.body.postal_code = req.sanitize(req.body.postal_code);

    geocoder.geocode("" + req.body.address + req.body.city + req.body.province + req.body.country + req.body.postal_code, function(err, res_geo) {
        if (err ||  res_geo.length == 0) {
            res.redirect('/vehicles');
            return;
        }
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

            res.redirect('/contracts');

        });
        
        
    });
    
    
});

router.get('/contracts/getChat', function(req, res) {
    var chatid = req.query.id;

    database.getContractChat(chatid, function (err, result) {
        if (err) {
            res.end(JSON.stringify({error:"Couldnt retrieve Chat"}));
        } else {
            for (var i = 0; i < result.length; i++) {
                if (result[i].userid == req.session.userid) {
                    result[i].owner = true;
                } else {
                    result[i].owner = false;
                }
            }

            res.end(JSON.stringify(result));
        }
    });
    
});

router.post('/contracts/sendChat', function(req, res) {
    var chatid = req.body.id;

    database.insertChatReply(chatid, req.sanitize(req.body.message), req.session.userid, function (err) {
        if (err) {
            res.end(JSON.stringify({ error: "message was not sent retry"}))
        } else {
            res.end(JSON.stringify({}));
        }

    }); 
    
});

router.get('/contracts/listContracts', function(req, res) {
    var userid=req.session.userid;
    console.log(req.session.email);


    database.getUserContracts(userid, function(err, data) {
        if (err) {
            console.log(err);
            return;
        }

        database.getCompletedUserContracts(userid, function(err, comp_data) {
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

            if (comp_data != null) {
                json.comp = comp_data;
            }
            
            json.owner = owner;
            json.washer = washer;

            var result = JSON.stringify(json);
            res.end(result);
        });
        
    });
});

router.post('/vehicles/registerVehicle', function(req, res) {

    // used to upload image of the client's vehicle
    upload.uploadImage(req,res,function(err) {
        if(err) {
            res.end("Error uploading file.");
            return;
        }

        // sanitize input

        req.body.manu = req.sanitize(req.body.manu);
        req.body.make = req.sanitize(req.body.make);
        req.body.plate = req.sanitize(req.body.plate);
        req.body.year = req.sanitize(req.body.year);


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

//Gets all the comments on the current user's profile
router.get("/getComments",function(req,res){
    if (req.session && req.session.email){
        //If there is a user logged in, then get everything.
        if(req.session.viewedEmail){
            //If we're viewing another person's profile, get their comments.
            database.getUserReviews(req.session.viewedEmail, function (err, result) {
                // result is an array of json objects in the form of:
                /* 
                {
                    from: 'Bob'
                    content: 'Great Job'
                    rating: 5
                }

                */
                if (err) {
                    res.send(JSON.stringify({error: "Could not Find Reviews"}));
                    return;
                } else {
                    delete req.session.viewedEmail;
                    res.send(JSON.stringify(result));
                }
                
            });
        }
        else {
            //If they're viewing their own profile, get their comments.
            database.getUserReviews(req.session.email, function(err, result) {
                if (err) {
                    console.log(err);
                    res.send(JSON.stringify({error: "Could not get User Reviews from db"}));
                } else {
                    res.send(JSON.stringify(result));
                }
            });
        }
    }
    else{
        //If there isn't a user logged in, redirect to login page
        res.redirect("/userlogin");
    }
});

//Gets all the followers of the current logged in user.
router.get("/getFollowing",function(req,res){
    if (req.session && req.session.email && req.session.userid){
        //If there is a user logged in, then continue.
        //TODO: Get all the followers of the user based on email, doing it instead based on id.
        //TODO: Return as an array of objects (should have data full name and email). Check out users.json for reference.
        database.getFollowers(req.session.userid, function(err, result) {
            if (err) {
                res.send(JSON.stringify({error: "Could not return Followers"}))
            } else {
                res.send(JSON.stringify(result))
            }
        });
    }
    else{
        //If there isn't a user logged in, redirect to login page.
        res.redirect("/userlogin");
    }
});

router.get('/user/:email', function(req,res){
    //If there does not exist a currently logged in user, redirect to login page. If there's an admin, do the same.
    //TODO: Search the db based on the email. Find that user. Get their name, comments. Return it as an object here. Check out the users.json for reference.
    if(req.session && req.session.email){
        if (req.session.privilege == "admin"){
            res.redirect("/adminprofile");
        }
        else{
            //TODO: GET THE USER FROM THE DB THAT HAS EMAIL req.session.viewedEmail. PUT IT AS AN OBJECT.
            console.log(req.params.email);
            req.session.viewedEmail=req.params.email.toLowerCase();
            database.checkUser_2(req.session.viewedEmail, function(err, result) {

                if (err) {
                    res.redirect('/userprofile');
                    return;
                }

                res.render("viewprofile", {
                    name:result[0].name,
                    email:result[0].email
                });
                return;
            });
            
        }
    }
    else{
        //If no user logged in go to the login page.
        res.redirect("/userlogin");
        return;
    }
});

router.post("/submitComment", function(req,res){
    //Submits a review to that person's profile.
    if (req.session && req.session.email){

        var rater = req.session.email;
        var comment = req.body.content;
        var rating = req.body.rating;
        var washer = req.body.currentEmail;

        console.log(washer + " " + rater);

        database.postReview(washer, rater, comment, rating, function(err){
            if (err) {
                console.log(err);
            }
            
            //res.send("Rater is " + rater + ". Comment is " + comment + ". Rating is " + rating + ". Washer is " + washer);
        });
    }
    else{
        res.redirect("/userlogin");
        return;
    }
});

router.get('/adminlogin', function(req, res){
    //Gets the login for admins.
    if (req.session && req.session.email){
        //If they're already logged on, then redirect to their profile
        if(req.session.privilege == "user")
            res.redirect("/userprofile");
        else{
            res.redirect("/adminprofile");
        }
    }
    else {
        //Otherwise, render the admin login.
        res.render('../public/adminlogin', {
            errors: ''
        });
    }
});

//Render the login for users.
router.get('/userlogin', function(req, res) {
    if (req.session && req.session.email){
        //If they're already logged on, then redirect to their profile
        if(req.session.privilege == "user")
            res.redirect("/userprofile");
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

//Confirms a signin.
router.post('/confirmuser',function(req,res){
    //res.writeHead(200, {"Content-Type":"text/plain", "Access-Control-Allow-Origin":"*"});
    //If there's a google sign in detected, then do the following.
    if (req.body.isGoogleSignIn){
        console.log('--------------------------------------------');
        req.session.email = req.body.email;
        req.session.privilege = "user";
        req.session.name = req.body.name;
        //Check if the user exists in the system. If it does, then go to their profile. Otherwise, we create a new profile.
        database.checkUser(req.body.email, 0, function(err, result) {
            // username doesn't exist: put it in
            if (!result) {
                var user = new Object();
                user.email = req.body.email.toLowerCase();
                user.name = req.body.name;
                user.password = "89489487132r31df4a48ref6s5dsa23cxz321a8gqhgghjukui846";
                user.month = "8";
                user.day = "1";
                user.year = "2016";
                // TODO (Fullchee), figure out how google sign in works
                //TODO: Google sign in gives email to req.session.email. Full name is in req.body.name. The priviledge should be user.
                // database.insertUser();
                database.insertUser(user,function(err){
                    if(err){
                        console.log("Error inserting in user");
                    }
                    console.log("Successful insertion");
                    database.checkUser(req.body.email, 0, function(err, result) {
                        if (err){
                            console.log("Error querying for inserted user after insertion");
                        }
                        if (result){
                            console.log("Succesful query");
                            req.session.userid = result.id;
                            res.send("Finished"); //Finished the call.
                        }
                    });
                });
            }//end of Google sign in.
            else{
                //User does exist, send it a finished signal.
                database.checkUser(req.body.email, 0, function(err, result) {
                    if (err){
                        console.log("Error querying for inserted user after insertion");
                    }
                    if (result){
                        console.log("Succesful query");
                        req.session.userid = result.id;
                        res.send("Finished"); //Finished the call.
                    }
                });
            }
        });
        return;
    }

    //Otherwise it's a regular login.
    req.body.user = req.body.user.toLowerCase();
    var username = req.sanitize(req.body.user);  // prevent XSS
    var password = req.sanitize(req.body.password);

    // Step 1: fetch the password from that user in the db
    database.checkUser(username, false, function(err, result) {
        // result is one object, emails are unique
        if (result) {

            // step 2: compare the hash with given password
            if (bcrypt.compareSync(password, result.password)) {
                req.session.userid = result.id;
                req.session.username = username;
                req.session.email = username;
                req.session.name = result.name;
                delete req.session.password; //deleting password if saved

                if (! result.isadmin) {  // user
                    req.session.privilege = "user";
                    res.redirect("/userprofile");
                    return;
                }
                else {
                    // do nothing, admins shouldn't login here
                    //If a person tries to login with an admin account in the regular place, render the user login.
                    //Reset the session since this is an incorrect login.
                    req.session.reset();
                    res.render("userlogin",{
                        errors: "<p class=\"incorrect\">You are an admin. Please use the admin login."
                    });
                    return;
                }
            }
        }


        res.render("userlogin",{
            errors: "<p class=\"incorrect\">Incorrect email and/or password</p>"
        });

    });
});

router.post('/confirmadmin',function(req,res){
    //Verifies an admin login.

    //TODO: Return a user. Needs to return an object that has attributes email and username and (maybe) password.
    req.body.user = req.body.user.toLowerCase();
    var username = req.sanitize(req.body.user);  // prevent XSS
    var password = req.sanitize(req.body.password);

    // Step 1: fetch the password from that user in the db
    database.checkUser(username, true, function(err, result) {
        // result is one object, emails are unique
        if (result) {

            // step 2: compare the hash with given password
            if (bcrypt.compareSync(password, result.password)) {
                req.session.userid = result.id;
                req.session.username = username;
                req.session.email = username;
                req.session.name = result.name;
                delete req.session.password; //deleting password if saved

                if (result.isadmin) {  // admin
                    req.session.privilege = 'admin';
                    res.redirect("/adminprofile");
                    return;
                }
                else {
                    // do nothing, users shouldn't login here
                    //Reset the session since this is an incorrect login.
                    req.session.reset();
                    res.render("adminlogin",{
                        errors: "<p class=\"incorrect\">You are a user. Please use the user login."
                    });
                }
            }
        }


        res.render("adminlogin",{
            errors: "<p class=\"incorrect\">Incorrect email and/or password</p>"
        });
        return;

    });
});

//Gets the current user profile.
router.get("/userprofile", function(req, res){
    if (req.session && req.session.email) {
        //If we return to the main profile, we delete the session property for viewedEmail.
        if(req.session.viewedEmail){
            delete req.session.viewedEmail;
        }
        //Render the current user's profile.
        res.render("profile", {
            name: req.session.name
        });
    }
    else{
        //If there's no one logged in redirect to userlogin.
        res.redirect("/userlogin");
    }
});


//Updates the biography of the current user.
router.post("/updateBio",function(req,res){
    //Modify the current user's biography.
    if (req.session && req.session.email){
        var bio = req.body.bio;
        var email = req.session.email;

        database.updateBio(bio, email, function(err) {
            if (err) {
                console.log("could not update bio")
                return;
            }

            res.redirect("/userlogin");
            return;
        });
    }
    else{
        //If there's no user logged in redirect to userlogin.
        res.redirect("/userlogin");
    }
});

router.get("/getBio",function(req,res){
    //Get the current user's biography.
    if (req.session && req.session.email){
        //If we're viewing someone else's profile, get their biography.
        if (req.session.viewedEmail){     
            database.getBio(req.session.viewedEmail, function(err, result) {
                if (result.length > 0){

                    res.send(result[0].bio);
                    return;
                }
                else{
                    res.send("No bio yet...");
                    return;
                }
            });
            
        } else {
            //Otherwise get the current user's profile.
            database.getBio(req.session.email, function(err, result) {
                if (result.length > 0){
                    res.send(result[0].bio);
                    return;
                }
                else{
                    res.send("No bio yet...");
                    return;
                }
            });
        }
    }
    else{
        //If there's no user logged in redirect to userlogin.
        res.redirect("/userlogin");
    }
});

router.post('/addFollower', function(req, res) {
    //Adds a follower to the database for the current user.
    if (req.session && req.session.email) {
        database.addFollower(req.body.email, req.session.userid, function (err){
            if (err) {
                res.end(JSON.stringify({error: "You already follow this user"}));
            }else {
                res.end(JSON.stringify({error: "Successfully followed " + req.sanitize(req.body.email)}));
            }
        });
    }
    else{
        //If there's no user logged in redirect to userlogin.
        res.redirect("/userlogin");
    }
});

router.get("/adminprofile", function(req,res){
    //Renders the admin profile if ther's a user logged in.
    if (req.session && req.session.email) {
        res.render("adminprofile", {
            name: "ADMIN: " + req.session.name
        });
    }
    else{
        //Redirect to admin login.
        res.redirect("/adminlogin");
    }
});

router.get("/logout", function(req,res){
    //Resets the session and redirects to the main page.
    req.session.reset();
    res.redirect("/");
});

router.delete("/delete/:email",function(req,res){
    //Makes sure you are an admin when you are trying to split it.
    if (req.session && req.session.email && req.session.privilege=="admin"){

        var emailToDelete = req.params.email.toLowerCase();

        // Delete the user with email req.params.email
        database.deleteUser(emailToDelete);

        res.render("adminprofile", {
            name: "ADMIN: " + req.session.email
        });

    }

    // not authorized to delete the account
    else {
        res.redirect('/');
    }
});

//Confirms the signup is proper.
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
    req.body.email = req.body.email.toLowerCase();
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
        return;
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

router.get("/admin", function(req,res){
    res.redirect("/adminlogin");
});

// export the routings, to be used in server.js
exports.router = router;
