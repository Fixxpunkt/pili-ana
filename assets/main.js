(function ($) {

    "use strict";
    
    $('.screens-slide').owlCarousel({
        loop: true,
        margin: 0,
        responsiveClass: true,
        nav: false,
        autoplay: true,
        autoplayTimeout: 4000,
        smartSpeed: 1000,
        responsive: {
            0: {
                items: 1,
            },
            600: {
                items: 2
            }
        }
    });

})(jQuery);
