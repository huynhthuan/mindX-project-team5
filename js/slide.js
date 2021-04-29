$(document).ready(function () {
    $('.owl-carousel-slider').owlCarousel({
        items: 1,
        loop: true,
        dots: true,
        autoplay: true,
    });

    $('.owl-carousel-banner').owlCarousel({
        items: 1,
        loop: true,
        dots: false,
        nav: true,
        autoplay: true,
    });

    $('.owl-carousel-poke').owlCarousel({
        items: 4,
        loop: true,
        dots: false,
        nav: true,
        autoplay: false,
        margin: 24,
    });
});
