/**
 * Created by George on 2016-07-24.
 */
$(document).ready(function(){
    $.ajax({
        url: "http://127.0.0.1:3000/users/listUsers",
        type:"GET",
        dataType:"json"
    }).done(function(data){
        console.log(data);
        var $paragraph = $("<p/>",{
            text:"These are the users currently in the system:"
        });
        //loop through all the users, then create an element for all of them.
        var userArray = [];
        for(var i =0 ; i < data.length; i++){
            if (data[i].privilege == "user") {
                var user = new User(data[i].username, data[i].email);
                userArray.push(user);
            }
        }

        $list = $("<ul/>");
        for (var i = 0; i < userArray.length; i++){
            $item = $("<li/>",{
                html:userArray[i].name + "<button type=\"button\" id=\""+userArray[i].name+"\" onclick='deleteUser(\""+userArray[i].name+"\")'>DELETE USER"
            });
            $list.append($item);
        }
        $("#payload").append($list);
    });
});

function deleteUser(name){
    alert(name);
};