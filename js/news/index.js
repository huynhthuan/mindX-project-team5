let count = 1;
let btnLoadMore = document.querySelector('.btn-load-more');

const getDataPost = async () => {
    let containerPost = document.querySelector('.news__list .row');
    const response = await fetch(postApiUrl + '?_limit=8');
    const dataPost = await response.json();
    let totalHtml = '';

    for (item of dataPost) {
        let itemHtml = `<div class="col-md-6">
        <div class="news__item">
            <a href="./detail/?id=${item.id}">
                <div class="news__img">
                    <img src="${uploadImgPost + item.img}" alt="news">
                </div>
                <div class="news__meta">
                    <a href="./detail/?id=${item.id}" class="news__link--detail">
                        ${item.title}
                    </a>
                    <div class="news__info">
                        <div class="news__groups">
                            <div class="news__author">${item.author}</div>
                            <div class="news__date">${item.date}</div>
                        </div>
                        <div class="news__count">
                            <div class="news__views"><i class="fas fa-eye"></i> <span
                                    class="views__value">${item.views}</span></div>
                            <div class="news__comment">
                                <i class="fas fa-comments"></i> <span
                                    class="comment__value">${item.comments.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    </div>`;
        totalHtml += itemHtml;
    }
    containerPost.innerHTML = totalHtml;
};

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

const loadMore = async () => {
    count += 1;
    let containerPost = document.querySelector('.news__list .row');
    const response = await fetch(postApiUrl + '?_limit=4&_page=' + count);
    const dataPost = await response.json();
    let totalHtml = '';
    for (item of dataPost) {
        let itemHtml = `<div class="col-md-6">
        <div class="news__item">
            <a href="${view}news/detail/?id=${item.id}">
                <div class="news__img">
                    <img src="${item.img}" alt="news">
                </div>
                <div class="news__meta">
                    <a href="${view}news/detail/?id=${item.id}" class="news__link--detail">
                        ${item.title}
                    </a>
                    <div class="news__info">
                        <div class="news__groups">
                            <div class="news__author">${item.author}</div>
                            <div class="news__date">${item.date}</div>
                        </div>
                        <div class="news__count">
                            <div class="news__views"><i class="fas fa-eye"></i> <span
                                    class="views__value">${item.views}</span></div>
                            <div class="news__comment">
                                <i class="fas fa-comments"></i> <span
                                    class="comment__value">${item.comments.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    </div>`;
        totalHtml += itemHtml;
    }
    containerPost.innerHTML += totalHtml;
    if (dataPost.length === 0) {
        btnLoadMore.remove();
    }
};

getDataPost();
getDataMostView();
