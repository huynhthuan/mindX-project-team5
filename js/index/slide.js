async function getPostSlider() {
    let response = await fetch(postApiUrl + '?_limit=4');
    let data = await response.json();
    let html = '';
    let sliderContainer = document.querySelector('.block__slider .slider__wrap');
    html = data
        .map((post) => {
            return `
            <div class="slider__item">
                <div class="slider__inner">
                    <img src="${uploadImgPost + post.img}" alt="slide">
                    <div class="slider__overlay">
                        <h2 class="slider__title">
                            <a href="${view}news/detail/?id=${post.id}">
                                 ${post.title}
                            </a>
                        </h2>
                        <p class="slider__desc">
                            ${post.desc}
                        </p>
                    </div>
                </div>
            </div>
            `;
        })
        .join('');

    sliderContainer.innerHTML = html;
}

getPostSlider().then(() => {
    $(document).ready(function () {
        $('.owl-carousel-slider').owlCarousel({
            items: 1,
            loop: true,
            dots: true,
            autoplay: true,
        });
    });
});
