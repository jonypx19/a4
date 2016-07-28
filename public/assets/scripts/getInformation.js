/**
 * Created by George on 2016-07-26.
 */
$(document).ready(function(){
    $.ajax({
        url: "http://localhost:3000/getComments",
        type:"GET",
        dataType:"json"
    }).done(function(data) {
        console.log(data);
        var averageRating;
        $comments = $("<ul/>");
        if(data.length == 0){
            averageRating = 0;
            $bullet=$("<li/>");
            $comment=$("<p/>",{
                html:"You have no comments right now."
            });
            $bullet.append($comment);
            $comments.append($bullet);

            //If no ratings
            $("#rating").text("You don't have a ratings right now");
        }
        else{
            averageRating = 0;
            for (var i = 0; i < data.length; i++){
                var fromText="From " + data[i].from;
                averageRating += data[i].rating;
                var content = data[i].content;

                $bullet = $("<li/>");
                $comment=$("<p/>",{
                    html:"<strong>"+fromText+"</strong>" + "<br>" + content
                });
                $bullet.append($comment);
                $comments.append($bullet);
            }
            $("#comments").append($comments);
            averageRating = averageRating/data.length;
            $("#rating").append(" "+averageRating);
        }
    });
    $.ajax({
        url: "http://localhost:3000/getFollowing",
        type:"GET",
        dataType:"json"
    }).done(function(data) {
        console.log(data);
        $userlist=$("<ul/>");
        if(data.length == 0){
            $user=$("<li/>",{
                text:"You aren't following anyone right now."
            });
            $userlist.append($user);
        }
        else{
            for (var i = 0; i < data.length; i++){
                var user=data[i].username;
                var email=data[i].email;

                $user=$("<li/>",{
                    html:"<a href=\"http://localhost:3000/user/"+data[i].email+"\">"+data[i].username+"</a>"
                });
                $userlist.append($user);
            }
        }
        $("#following").append($userlist);

    });
});