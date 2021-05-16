const getDataVideo = async () => {
    let containerPost = document.querySelector('.video__list');
    const response = await fetch(videoApiUrl + '?_limit=10');
    const dataPost = await response.json();
    let totalHtml = '';

    for (item of dataPost) {
        let itemHtml = `<div class="videos__item">
        <div class="row">
            <div class="col-md-6">
                <a href="${view}video/detail/?id=${item.id}">
                    <div class="videos__img">
                        <img src="${uploadImgPost + item.img}" alt="news">
                    </div>
                </a>
            </div>
            <div class="col-md-6">
                <div class="videos__meta">
                    <a href="${view}video/detail/?id=${item.id}" class="videos__link">
                        ${item.title}
                    </a>
                    <div class="video__info d-flex justify-content-between">
                        <div class="news__groups">
                            <div class="news__author">${item.author}</div>
                            <div class="news__date">${item.date}</div>
                        </div>
                        <div class="news__count d-flex">
                            <div class="news__views me-3"><i class="fas fa-eye"></i> <span
                                    class="views__value">${item.views}</span></div>
                            <div class="news__comment">
                                <i class="fas fa-comments"></i> <span
                                    class="comment__value">${item.comments.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
        totalHtml += itemHtml;
    }
    containerPost.innerHTML = totalHtml;
};

let count = 1;
let btnLoadMore = document.querySelector('.btn-load-more');

const loadMore = async () => {
    count += 1;
    let containerPost = document.querySelector('.video__list');
    const response = await fetch(videoApiUrl + '?_limit=4&_page=' + count);
    const dataPost = await response.json();
    let totalHtml = '';

    for (item of dataPost) {
        let itemHtml = `<div class="videos__item">
        <div class="row">
            <div class="col-md-6">
                <a href="${view}video/detail/?id=${item.id}">
                    <div class="videos__img">
                        <img src="${uploadImgPost + item.img}" alt="news">
                    </div>
                </a>
            </div>
            <div class="col-md-6">
                <div class="videos__meta">
                    <a href="${view}video/detail/?id=${item.id}" class="videos__link">
                        ${item.title}
                    </a>
                    <div class="video__info d-flex justify-content-between">
                        <div class="news__groups">
                            <div class="news__author">${item.author}</div>
                            <div class="news__date">${item.date}</div>
                        </div>
                        <div class="news__count d-flex">
                            <div class="news__views me-3"><i class="fas fa-eye"></i> <span
                                    class="views__value">${item.views}</span></div>
                            <div class="news__comment">
                                <i class="fas fa-comments"></i> <span
                                    class="comment__value">${item.comments.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
        totalHtml += itemHtml;
    }

    containerPost.innerHTML += totalHtml;
    if (dataPost.length === 0) {
        btnLoadMore.remove();
    }
};

getDataVideo();

const getDataMostView = async () => {
    let containerPost = document.querySelector('.widget__popular .widget__content');
    const response = await fetch(postApiUrl + '?_sort=views&_order=desc&_limit=10');
    const dataPost = await response.json();
    let totalHtml = '';
    for (item of dataPost) {
        let itemHtml = `<div class="news__short">
        <div class="short__img">
            <a href="${view}news/detail/?id=${item.id}">
                <img src="${uploadImgPost + item.img}" alt="img">
            </a>
        </div>
        <div class="short__meta">
            <a href="${view}news/detail/?id=${item.id}" class="short__title">
                ${item.title}
            </a>
            <div class="short__date">
                ${item.date}
            </div>
        </div>
    </div>`;
        totalHtml += itemHtml;
    }
    containerPost.innerHTML = totalHtml;
};

getDataMostView();
