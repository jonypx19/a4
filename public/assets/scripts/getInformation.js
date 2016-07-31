/**
 * Created by George on 2016-07-26.
 * Used in /userprofile to load reviews, ...
 */
$(document).ready(function(){
    $.ajax({
        url: "/getFollowing",
        type:"GET",
        dataType:"json"
    }).done(function(data) {
        //Gets all the people that the current person is following.
        console.log(data);
        $userlist=$("<ul/>");
        if(data.length == 0){
            //If none exist, then place a placeholder.
            $user=$("<li/>",{
                text:"You aren't following anyone right now."
            });
            $userlist.append($user);
        }
        else{
            //If there are followers, craft a link and place them into the page.
            for (var i = 0; i < data.length; i++){
                var user=data[i].username;
                var email=data[i].email;

                $user=$("<li/>",{
                    html:"<a href=\"/user/"+data[i].email+"\">"+data[i].username+"</a>"
                });
                $userlist.append($user);
            }
        }
        //If #following exists, append them. Otherwise, do nothing.
        if($("#following").length!==0){
            $("#following").append($userlist);
        }
    });
    $.ajax({
        url: "/getComments",
        type:"GET",
        dataType:"json"
    }).done(function(data) {
        //Gets all the comments and appends them to the main file.
        console.log(data);
        var averageRating;
        $comments = $("<ul/>");
        if(data.length == 0){
            //If none, put a placeholder.
            averageRating = 0;
            $bullet=$("<li/>");
            $comment=$("<p/>",{
                html:"No comments right now."
            });
            $bullet.append($comment);
            $comments.append($bullet);
            $("#comments").append($comments);

            //If no ratings
            $("#rating").text("No ratings right now");
        }
        else{
            //If there exists, then show them as a list.
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
            $("#rating").append(" "+averageRating.toFixed(2));
        }
    });

    $.ajax({
        url:"/getBio",
        type:"GET",
        dataType:"text"
    }).done(function(data){
        $bio = $("<p/>");
        if (data.length == 0){
            //If no bio, put a placeholder
            $bio.html("<strong>No bio yet...</strong>")
        }
        else{
            $bio.html("<strong>"+ data+"</strong>");
        }
        $("#biography").append($bio);
    });

});