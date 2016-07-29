/**
 * Created by George on 2016-07-23.
 */
function onSignIn(googleUser){
    //On successful google login, there's a googleUser passed to the system.
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId());
    console.log('Name: ' + profile.getName());
    console.log('Email: ' + profile.getEmail());
    var profileData= new Object();
    profileData.name = profile.getName();
    profileData.email=profile.getEmail();
    profileData.isGoogleSignIn=true;
    var JSONObject = JSON.stringify(profileData);
    //Post this profile data to confirmUser.
    $.ajax({
            url: "http://localhost:3000/confirmuser",
            type: "POST",
            contentType: "application/json",
            dataType:"text",
            data: JSONObject
        //When done, go to to the userprofile.
    }).done(function(data){
        location.replace("http://localhost:3000/userprofile");
    });


}

function onLoad(){
    gapi.load('auth2', function(){
        gapi.auth2.init();
    });
}

function logOut(){
    //Logout function
    session = JSON.parse(auth2);
    //var auth2 = gapi.auth2.getAuthInstance();
    session.signOut().then(function(){
        console.log("User signed out.");
    });
}

function signOut(){
    //Signout function
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function(){
        console.log("User signed out.");
    });
}