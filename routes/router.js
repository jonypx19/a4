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
        if (err) {

        } else {
            database.findClientContracts(res_geo[0].latitude, res_geo[0].longitude, req.session.userid, function (err, result) {
                res.end(JSON.stringify(result));
                return;
            });
        }
    });
});

router.get('/user/listUsers',function(req,res){

    //For cross domain
    //response.writeHead(200, {"Content-Type":"text/plain", "Access-Control-Allow-Origin":"*"});

    //TODO: Return an array of all users that have privilege=users.
    //place everything u need to do in the database callback function
    database.getAllUsers(function(err, result) {
        res.json(result);
    });
    
    // fs.readFile(__dirname + "/users.json", 'utf8', function(err,data){
    //     console.log(data);
    //     res.end(data);
    // });
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

router.get("/getComments",function(req,res){
    if (req.session && req.session.email){

        if(req.session.viewedEmail){
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

            /*
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
                

            });*/
        }
        else {

            database.getUserReviews(req.session.userid, function(err, result) {
                if (err) {
                    console.log(err);
                    res.send(JSON.stringify({error: "Could not get User Reviews from db"}));
                } else {
                    res.send(JSON.stringify(result));
                }
            });

            /*fs.readFile(__dirname + "/users.json", 'utf8', function (err, data) {
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
                
            });*/
        }
        //Placeholder right now will be a JSON file with this stuff. You can check it out for an idea of the JSON object to return
    }
    else{
        //If there isn't a user logged in, redirect to login page
        res.redirect("/userlogin");
    }
});

router.get("/getFollowing",function(req,res){
    if (req.session && req.session.email && req.session.userid){
        //TODO: Get all the followers of the user based on email, doing it instead based on id.
        //TODO: Return as an array of objects (should have data full name and email). Check out users.json for reference.

        database.getFollowers(req.session.userid, function(err, result) {
            if (err) {
                res.send(JSON.stringify({error: "Could not return Followers"}))
            } else {
                res.send(JSON.stringify(result))
            }
        });

        /*
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
        });*/

        //Placeholder right now will be a JSON file with this stuff. You can check it out for an idea of the JSON object to return
    }
    else{
        //If there isn't a user logged in, redirect to login page.
        res.redirect("/userlogin");
    }
});

router.get('/user/:email', function(req,res){
    //If there does not exist a currently logged in user, redirect to login page. If there's an admin, do the same.
    //TODO: Search the db based on the email. Find that user. Get their name, comments. Return it as an object here. Check out the users.json for reference.
    req.session.viewedEmail=req.session.viewedEmail;
    if(req.session && req.session.email){
        if (req.session.privilege == "admin"){
            res.redirect("/adminprofile");
        }
        else{

            //TODO: GET THE USER FROM THE DB THAT HAS EMAIL req.session.viewedEmail. PUT IT AS AN OBJECT.
            console.log(req.params.email);
            req.session.viewedEmail=req.params.email.toLowerCase();
            res.render("viewprofile", {
                name:req.session.viewedEmail
            });
            return;
        }
    }
    else{
        res.redirect("/userlogin");
        return;
    }
});

router.post("/submitComment", function(req,res){
    if (req.session && req.session.email){
        var rater = req.session.email;
        var comment = req.body.content;
        var rating = req.body.rating;
        var washer = req.body.currentEmail;
        res.send("Rater is " + rater + ". Comment is " + comment + ". Rating is " + rating + ". Washer is " + washer);
        // database.insertReview(washer, rater, comment, rating, function(){
        //     res.send("Finished");
        // });
    }
    else{
        res.redirect("/userlogin");
        return;
    }
})

// TODO (Fullchee): 
router.post('/submitComment/:email', function(req,res){

    if (req.session && req.session.email) {
        var rater = req.session.username; // current user
        var comment = req.body.comment;
        var rating = req.body.rating; //The rating given.
        var washer = req.params.email;
        //Do the posting here.
        database.insertReview(washer, rater, comment, rating, function(){
            res.redirect('/user/' + washer);
        });

    }
    // need to login to make a review
    else {
        res.redirect("/userlogin");
        return;
    }

    // refresh the page which should now have the new comment
    // go back to that user's profile

});

router.get('/adminlogin', function(req, res){
    if (req.session && req.session.email){
        if(req.session.privilege == "user")
            res.redirect("/userprofile");
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

router.post('/confirmuser',function(req,res){
    //res.writeHead(200, {"Content-Type":"text/plain", "Access-Control-Allow-Origin":"*"});
    var username;
    var password;
    if (req.body.isGoogleSignIn){
        console.log('--------------------------------------------');
        req.session.email = req.body.email;
        req.session.privilege = "user";
        req.session.name = req.body.name;
        database.checkUser(username, 0, function(err, result) {
            // username doesn't exist: put it in
            if (!result) {
                // TODO (Fullchee), figure out how google sign in works
                //TODO: Google sign in gives email to req.session.email. Full name is in req.body.name. The priviledge should be user.
                // database.insertUser();
            }
            res.send("Finished"); //Finished the call.
            // res.render("userlogin",{
            //     errors: "<p class=\"incorrect\">Incorrect email and/or password</p>"
            // });
            // return;

        });
        //
        // //TODO: as a new one with privilege = user.(since this is verified as a google account).
        // res.redirect("/userprofile");
        return;
    }  // end of google signin
    req.body.user = req.body.user.toLowerCase();
    var username = req.sanitize(req.body.user);  // prevent XSS
    var password = req.sanitize(req.body.password);


    //: Return a user based on username(which is email right now). Needs to return an object with email and full name and (maybe) password.
    // fs.readFile(__dirname + "/users.json", 'utf8', function(err,data){
    //     var object = JSON.parse(data);
    //     console.log(object);
    //     for(var i =0;i < data.length; i++){
    //         if (object[i].email === username && object[i].password === password){
    //             if (object[i].privilege === "user") {
    //                 req.session.email = username;

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
    var username = req.sanitize(req.body.user);  // prevent XSS
    var password = req.sanitize(req.body.password);
    response = {
        username:req.body.user,
        password: req.body.password
    };

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

                if (result.isadmin) {  // user
                    req.session.privilege = 'admin';
                    res.redirect("/adminprofile");
                    return;
                }
                else {
                    // do nothing, users shouldn't login here
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



    // fs.readFile(__dirname + "/users.json", 'utf8', function(err,data){
    //     var object = JSON.parse(data);
    //     console.log(object);
    //     for(var i =0;i < data.length; i++){
    //         if (object[i].email === username && object[i].password === password){
    //             if (object[i].privilege === "admin") {
    //                 req.session.email = username;
    //                 req.session.privilege = "admin";
    //                 delete req.session.password; //deleting password if saved.
    //                 res.redirect("/adminprofile");
    //                 return;
    //             }
    //             else{
    //                 res.render("adminlogin",{
    //                     errors: "<p class=\"incorrect\">You are a user. Please use the user login."
    //                 });
    //                 return;
    //             }
    //         }
    //     }
    //     //looped through everything didn't find matching password/username
    //     res.render("adminlogin", {
    //         errors:"<p class = \"incorrect\">Incorrect username/password.</p>"
    //     });
    // });
});

router.get("/userprofile", function(req, res){
    if (req.session && req.session.email) {
        //If we return to the main profile, we delete the session property for viewedEmail.
        if(req.session.viewedEmail){
            delete req.session.viewedEmail;
        }
        res.render("profile", {
            name: "USER: " + req.session.name
        });
    }
    else{
        res.redirect("/userlogin");
    }
});

router.post("/updateBio",function(req,res){
    if (req.session && req.session.email){
        var bio = req.body.bio;
        var email = req.session.email;

        database.updateBio(bio, email, function(err) {
            if (err) {
                console.log("could not update bio")
            }
        });
    }
});

router.get("/getBio",function(req,res){
    if (req.session && req.session.email){
        if (req.session.viewedEmail){     
            database.getBio(req.session.viewedEmail, function(err, result) {
                res.send(req.session.viewedEmail);
                return;
            });
            
        } else {
            database.getBio(req.session.email, function(err, result) {
                res.send(req.session.email);
                return;
            });
        }

        
    }
});

router.post('/rateuser', function(req, res) {
    if (req.session && req.session.email) {

        req.body.rating = req.sanitize(req.body.rating);
        req.body.content = req.sanitize(req.body.content);

        //TODO: ADD RATING AND THE CONTENT OF THE COMMENT TO THE DATABASE.


        //TODO: (GEORGE) ONCE UPDATED, RELOAD THE PAGE.
        res.redirect("/userprofile");
    }
    else {
        console.log('User attempted to rate a user without a login');
    }

    return;
});

router.post('/addFollower', function(req, res) {
    if (req.session && req.session.email) {
        database.addFollower(req.body.email, req.session.userid, function (err){
            if (err) {
                res.end(JSON.stringify({error: "You already follow this user"}));
            }else {
                res.end(JSON.stringify({error: "Successfully followed " + req.sanitize(req.body.email)}));
            }
        });

    }
});

router.get("/adminprofile", function(req,res){
    if (req.session && req.session.email) {
        res.render("adminprofile", {
            name: "ADMIN: " + req.session.name
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

router.delete("/delete/:email",function(req,res){

    if (req.session && req.session.email && req.session.privilege=="admin"){

        var emailToDelete = req.url.split('/')[2];

        // Delete the user with email req.params.email
        database.deleteUser(emailToDelete);


        // --------------- Way that reads JSON        
        // fs.readFile(__dirname + "/users.json", 'utf8', function(err,data) {
        //     var object = JSON.parse(data);
        //     console.log(object);
        //     var userToDelete = object.find(checkUsername, req.params.email);
        //     delete object[object.indexOf(userToDelete)];

        //     //res.end(JSON.stringify(object));
        //     res.end(JSON.stringify(object));
        //     //res.redirect("localhost:3000/user/listUsers");
        // });

        res.render("adminprofile", {
            name: "ADMIN: " + req.session.email
        });

    }

    // not authorized to delete the account
    else {
        res.redirect('/');
    }
});

function checkUsername(user){
    return user.email == this;
}

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
