/**
 * Created by George on 2016-07-23.
 */
function onSignIn(googleUser){
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId());
    console.log('Name: ' + profile.getName());
    console.log('Email: ' + profile.getEmail());
}

function signOut(){
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function(){
        console.log("User signed out.");
    });
}