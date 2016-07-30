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

function addUser(email){

    // $.ajax({
    //     url:"http://localhost:3000/delete/" + email,
    //     type:"DELETE",
    //     error: function(XMLHttpRequest, textStatus, errorThrown) { 
    //     console.log("Status: " + textStatus); 
    //     console.log("Error: " + errorThrown); 
    // }    

    // }).done(function(){
    //     getUsers();  
    // });
    database.insertFollower(req.body, function (err){
        if (err) {
            res.render('/', {
                'errors': {
                'error_email': 'You are already following this user'
            }

            });
        }else {
            res.redirect('/');
        }
    });
};