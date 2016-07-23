$( document ).ready(function() {
    // add the days and the years of the birthday

    var selectDay = $( '#day' );

    var emptyOption = '<option value="%VALUE%">%VALUE%</option>';

    for (var day = 1; day <= 31; day++) {
        selectDay.append(emptyOption.replace(/%VALUE%/g, day));
    }

    var selectYear = $( '#year' );
    for (var year = 2016; year >= 1905; year--) {
        selectYear.append(emptyOption.replace(/%VALUE%/g, year));
    }
});

// --------------------- for signup.html--------------------

// make the user correctly repeat the password
$( '#repeat_password' ).on('input', function() {
    var pass = $( '#password' ).val();
    var repass = $( this ).val();

    if (pass !== repass) {
        $( this ).css('box-shadow', '0 0 3pt 2pt red');
    }

    if (pass === repass) {
        $( this ).css('box-shadow', 'none');
    }
});