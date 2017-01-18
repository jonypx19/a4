var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("about_link");

var signup = document.getElementById("signup_button");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
    document.getElementById("main_caption").style.visibility = "hidden";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
    document.getElementById("main_caption").style.visibility = "visible";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}