/**
 * Code based off George's admin.js file
 */

function getUsers(){
    $.ajax({
        url: "http://localhost:3000/user/listUsers",
        type:"GET",
        dataType:"json"
    }).done(function(data){
        console.log(data);
        var $paragraph = $("<p/>",{
            text:"Scroll through the list of active users and follow them!"
        });
        $("#usersList").html($paragraph);
        //loop through all the users, then create an element for all of them.
        var userArray = [];
        for(var i =0 ; i < data.length; i++){
            if ((data[i].isadmin === 0) && (data[i].isadmin === 0)) {
                var user = new User(data[i].name, data[i].email);
                userArray.push(user);
            }
        }
        //append each one to a list and append to the main body.
        $list = $("<ul/>");
        for (var i = 0; i < userArray.length; i++){
            $item = $("<li/>",{
                html:userArray[i].name + "<button type=\"button\" id=\""+userArray[i].email+"\" onclick='addUser(\""+userArray[i].email+"\")'>Follow User"
            });
            $list.append($item);
        }
        $("#usersList").append($list);
    });
}

$(document).ready(function(){
    getUsers();
    
});

function getEmailFromCurrentURL() {
    var parser = document.createElement('a');
    parser.href = window.location.href;
    return parser.pathname.split('/')[2];
}

function addUser(email){

    // Step 1: get the email of the person whom we want to follow
    var leaderEmail = getEmailFromCurrentURL();

    $.ajax({
        url:"http://localhost:3000/addFollower/" + leaderEmail,
        type:"POST",
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
        console.log("Status: " + textStatus); 
        console.log("Error: " + errorThrown); 
    }    

    }).done(function(){
        getUsers();  
    });
};
