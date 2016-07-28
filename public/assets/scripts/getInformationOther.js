/**
 * Created by George on 2016-07-28.
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
                html:"They have no comments right now."
            });
            $bullet.append($comment);
            $comments.append($bullet);
            $("#comments").append($comments);

            //If no ratings
            $("#rating").text("They don't have any ratings right now");
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
            $("#rating").append(" "+averageRating.toFixed(2));
        }
    });
});