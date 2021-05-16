let id = getAllUrlParams().id;

let containerPost = document.querySelector('.news__list .row');

const getDataDetail = async () => {
    const response = await fetch(postApiUrl + '?id=' + id);
    const dataPost = (await response.json())[0];
    let title = document.querySelector('.post__content .post__title');
    title.innerHTML = dataPost.title;
    let author = document.querySelector('.author__name strong');
    author.innerHTML = dataPost.author;
    let postDate = document.querySelector('.post__date');
    postDate.innerHTML = dataPost.date;
    let view = document.querySelector('.meta__right .news__views .views__value');
    view.innerHTML = dataPost.views;
    let comment = document.querySelector('.meta__right .news__comment .comment__value');
    comment.innerHTML = dataPost.comments.length;

    let breadcrumb = document.querySelector('.breadcrumb');
    breadcrumb.innerHTML = `<i class="fas fa-home"></i> Home / News / ${dataPost.title}`;

    let titlePage = document.querySelector('title');
    titlePage.innerHTML = dataPost.title;

    let authorImg = document.querySelector('.author__img img');
    authorImg.src = uploadFolderUserUrl + dataPost.authorava;
    //Tăng view post
    let viewIncrese = ++dataPost.views;
    fetch(postApiUrl + id, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            views: viewIncrese,
        }),
    });
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

const getRelatedArticles = async () => {
    let containerPost = document.querySelector('.post__related .news__list .row');
    const response = await fetch(postApiUrl + '?_limit=6');
    const dataPost = await response.json();
    let totalHtml = '';
    for (item of dataPost) {
        let itemHtml = `<div class="col-md-6 col-lg-4">
        <div class="news__item">
            <a href="${view}news/detail/?id=${item.id}">
                <div class="news__img">
                    <img src="${uploadImgPost + item.img}" alt="news">
                </div>
                <div class="news__meta">
                    <a href="${view}news/detail/?id=${item.id}"
                        class="news__link--detail">
                        ${item.title}
                    </a>
                    <div class="news__info">
                        <div class="news__groups">
                            <div class="news__author">${item.author}</div>
                            <div class="news__date">${item.date}</div>
                        </div>
                        <div class="news__count">
                            <div class="news__views"><i class="fas fa-eye"></i>
                                <span class="views__value">${item.views}</span>
                            </div>
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

const getImg = async () => {
    let containerPost = document.querySelector('.post__entry .post__feature');
    const response = await fetch(postApiUrl + '?id=' + id);
    const dataPost = (await response.json())[0];
    let img = document.querySelector('.post__entry .post__feature img');
    img.src = uploadImgPost + dataPost.img;
    let content = document.querySelector('.post__text');
    content.innerHTML = dataPost.content;
};
getDataDetail();
getDataMostView();
getRelatedArticles();
getImg();

//Comment Post
async function getPostComment(id) {
    let response = await fetch(postApiUrl + '?id=' + id);
    let data = await response.json();
    let dataPost = data[0];
    let commentList = dataPost.comments;
    let commentCount = document.querySelector('.comments_count');
    let html = '';
    let commentForm = document.querySelector('.video__comment');
    let userAvaComment = document.querySelector('.user__ava').querySelector('img');

    if (!isLogin()) {
        commentForm.classList.add('d-none');
    } else {
        userAvaComment.src = uploadFolderUserUrl + getUserDataLogged().avatar;
    }

    // Count comments
    commentCount.innerHTML = commentList.length;
    // Comment list container
    let commentContainer = document.querySelector('.comments');
    if (commentList.length > 0) {
        commentList
            .map((comment) => {
                html += `
            <li class="comment__item">
                <div class="comment__ava">
                    <img src="${uploadFolderUserUrl + comment.img}" alt="ava">
                </div>
                <div class="comment__content">
                    <div class="comment__name">
                        ${comment.name}
                    </div>
                    <div class="comment__value">
                        ${comment.content}
                    </div>
                </div>
            </li>
            `;
            })
            .join('');
        commentContainer.innerHTML = html;
    } else {
        if (isLogin()) {
            commentContainer.innerHTML = `<p class="alert alert-warning">No comment. Write a first comment</p>`;
        } else {
            commentContainer.innerHTML = `<p class="alert alert-warning">No comment. <a href="${view}/auth/login" class="fw-bold">Login</a> to comment</p>`;
        }
    }
}

getPostComment(id);

//Post comment
let btnSendComment = document.querySelector('.btn__comment');

btnSendComment.onclick = async function sendComment() {
    {
        let response = await fetch(postApiUrl + '?id=' + id);
        let data = await response.json();

        let dataPost = data[0];
        let commentList = dataPost.comments;
        let commentBox = document.querySelector('.comment__text').querySelector('textarea');
        let newCommentValue = commentBox.value;

        commentList.unshift({
            img: getUserDataLogged().avatar,
            name: getUserDataLogged().username,
            content: newCommentValue,
        });

        // Update comment in API

        let responsePatchComment = await fetch(postApiUrl + id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                comments: commentList,
            }),
        });
        commentBox.value = '';
        getPostComment(id);
    }
};
