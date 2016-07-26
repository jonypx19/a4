/**
 * Created by George on 2016-07-23.
 */
function onSignIn(googleUser){
    var profile = googleUser.getBasicProfile();
    //localStorage.setItem("currentuser",JSON.stringify(gapi.auth2.getAuthInstance()));
    console.log('ID: ' + profile.getId());
    console.log('Name: ' + profile.getName());
    console.log('Email: ' + profile.getEmail());
    var profileData= new Object();
    profileData.name = profile.getName();
    profileData.email=profile.getEmail();
    profileData.isGoogleSignIn=true;
    var JSONObject = JSON.stringify(profileData);
    $.ajax({
            url: "http://localhost:3000/confirmuser",
            type: "POST",
            contentType: "application/json",
            dataType:"json",
            data: JSONObject
    });
}

function onLoad(){
    gapi.load('auth2', function(){
        gapi.auth2.init();
    });
}

function logOut(){
    //var auth2 = localStorage.getItem("currentuser");
    session = JSON.parse(auth2);
    //var auth2 = gapi.auth2.getAuthInstance();
    session.signOut().then(function(){
        console.log("User signed out.");
    });
}

function signOut(){
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function(){
        console.log("User signed out.");
    });
}