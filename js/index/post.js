async function getPostAndVideo() {
    let containerNewsWeek = document.querySelector('.block__news .block__content .row');
    let responsePost = await fetch(postApiUrl + '?_limit=4');
    let responseVideo = await fetch(videoApiUrl + '?_limit=2');

    let dataPost = await responsePost.json();
    let dataVideo = await responseVideo.json();
    let dataAll = [];

    for (post of dataPost) {
        if (dataPost.indexOf(post) === 1) {
            dataAll.push(`
            <div class="col-md-6 col-lg-3">
                <div class="news__item">
                    <div class="news__img">
                        <img src="${uploadImgPost + post.img}" alt="news">
                    </div>
                    <div class="news__meta">
                        <h2 class="news__title">
                            <a href="${view}news/detail/?id=${post.id}">
                                ${post.title}
                            </a>
                        </h2>
                        <div class="news__info">
                            <div class="news__count">
                                <div class="news__views">
                                    <i class="fas fa-eye"></i> ${post.views}
                                </div>
                                <div class="news__comment">
                                    <i class="fas fa-comments"></i> ${post.comments.length}
                                </div>
                            </div>
                            <div class="news__action">
                                <a href="${view}new/detail/?id=${post.id}" class="news__link">
                                    Read more
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `);

            for (video of dataVideo) {
                dataAll.push(`
                <div class="col-md-6">
                    <div class="video__item">
                        <div class="video__img">
                            <img src="${uploadImgPost + video.img}" alt="tv">
                        </div>
                        <div class="video__meta">
                            <h2 class="video__title">
                                <a href="${view}video/detail/?id=${video.id}">${video.title}</a>
                            </h2>
                            <div class="video__desc">
                                ${video.desc}
                            </div>
                        </div>
                         ${video.type ? '<div class="video__tag"><i class="fas fa-circle"></i> Live</div>' : ''}
                    </div>
                </div>
                `);
            }
        } else {
            dataAll.push(`
            <div class="col-md-6 col-lg-3">
                <div class="news__item">
                    <div class="news__img">
                        <img src="${uploadImgPost + post.img}" alt="news">
                    </div>
                    <div class="news__meta">
                        <h2 class="news__title">
                            <a href="${view}news/detail/?id=${post.id}">
                                ${post.title}
                            </a>
                        </h2>
                        <div class="news__info">
                            <div class="news__count">
                                <div class="news__views">
                                    <i class="fas fa-eye"></i> ${post.views}
                                </div>
                                <div class="news__comment">
                                    <i class="fas fa-comments"></i> ${post.comments.length}
                                </div>
                            </div>
                            <div class="news__action">
                                <a href="${view}news/detail/?id=${post.id}" class="news__link">
                                    Read more
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `);
        }
    }

    containerNewsWeek.innerHTML = dataAll.join('');
}

getPostAndVideo();
