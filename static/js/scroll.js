// credit to Mohammad Adil for this scrollin effect

$(document).ready(function() {

    $('.fadein').each( function(i){

        var object_location = $(this).position().top;
        var bottom_of_window = $(window).scrollTop() + $(window).height();

        /* If the object is completely visible in the window, fade it it */
        if( bottom_of_window > object_location ){

            $(this).animate({'opacity':'1'},1500);

        }

    });
    /* Every time the window is scrolled ... */
    $(window).scroll( function(){

        /* Check the location of each desired element */
        $('.fadein').each( function(i){

            var bottom_of_object = $(this).position().top + $(this).outerHeight();
            var bottom_of_window = $(window).scrollTop() + $(window).height();

            /* If the object is completely visible in the window, fade it it */
            if( bottom_of_window > bottom_of_object ){

                $(this).animate({'opacity':'1'},750);

            }

        });

    });

});
