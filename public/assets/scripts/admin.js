/**
 * Created by George on 2016-07-24.
 */
function getUsers(){
    $.ajax({
        url: "http://localhost:3000/user/listUsers",
        type:"GET",
        dataType:"json"
    }).done(function(data){
        console.log(data);
        var $paragraph = $("<p/>",{
            text:"These are the users currently in the system:"
        });
        $("#payload").html($paragraph);
        //loop through all the users, then create an element for all of them.
        var userArray = [];
        for(var i =0 ; i < data.length; i++){
            if (data[i].isadmin === 0) {
                var user = new User(data[i].name, data[i].email);
                userArray.push(user);
            }
        }
        //append each one to a list and append to the main body.
        $list = $("<ul/ class=\"list-group\">");
        for (var i = 0; i < userArray.length; i++){
            $item = $("<li/>",{
                html:userArray[i].name + "<p> >" + "<button class=\"btn btn-danger\" type=\"button\" id=\""+userArray[i].email+"\" onclick='deleteUser(\""+userArray[i].email+"\")'>DELETE USER"
            });
            $list.append($item);
        }
        $("#payload").append($list);
    });
}

$(document).ready(function(){
    // $.ajax({
    //     url: "http://localhost:3000/user/listUsers",
    //     type:"GET",
    //     dataType:"json"
    // }).done(function(data){
    //     console.log(data);
    //     var $paragraph = $("<p/>",{
    //         text:"These are the users currently in the system:"
    //     });
    //     $("#payload").html($paragraph);
    //     //loop through all the users, then create an element for all of them.
    //     var userArray = [];
    //     for(var i =0 ; i < data.length; i++){
    //         if (data[i].privilege == "user") {
    //             var user = new User(data[i].username, data[i].email);
    //             userArray.push(user);
    //         }
    //     }
    //     //append each one to a list and append to the main body.
    //     $list = $("<ul/>");
    //     for (var i = 0; i < userArray.length; i++){
    //         $item = $("<li/>",{
    //             html:userArray[i].name + "<button type=\"button\" id=\""+userArray[i].email+"\" onclick='deleteUser(\""+userArray[i].email+"\")'>DELETE USER"
    //         });
    //         $list.append($item);
    //     }
    //     $("#payload").append($list);
    // });
    getUsers();
    
});

function deleteUser(email){
    alert(email);

    $.ajax({
        url:"http://localhost:3000/delete/" + email,
        type:"DELETE",
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
        console.log("Status: " + textStatus); 
        console.log("Error: " + errorThrown); 
    }    

    //}).done(function(data){
        // console.log(data);
        // var $paragraph = $("<p/>",{
        //     text:"These are the users currently in the system:"
        // });
        // $("#payload").html($paragraph);
        // var userArray = [];
        // for(var i =0 ; i < data.length; i++){
        //     if (data[i] && data[i].privilege == "user") {
        //         var user = new User(data[i].username, data[i].email);
        //         userArray.push(user);
        //     }
        // }
        // //append each one to a list and append to the main body.
        // $list = $("<ul/>");
        // for (var i = 0; i < userArray.length; i++){
        //     $item = $("<li/>",{
        //         html:userArray[i].name + "<button type=\"button\" id=\""+userArray[i].email+"\" onclick='deleteUser(\""+userArray[i].email+"\")'>DELETE USER"
        //     });
        //     $list.append($item);
        // }
        // $("#payload").append($list);
    }).done(function(){
        getUsers();  // update user list after deletion
    });
};
