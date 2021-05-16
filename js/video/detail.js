let id = getAllUrlParams().id;

async function getDataVideo() {
    let response = await fetch(videoApiUrl + '?id=' + id);
    let data = (await response.json())[0];
    let title = document.querySelector('.video__title');
    title.innerHTML = data.title;
    let date = document.querySelector('.videos__meta .video__date');
    date.innerHTML = data.date;
    let view = document.querySelector('.videos__meta .video__view');
    view.innerHTML = data.views;
    let videoPlayer = document.querySelector('#player');
    let urlVideo = data.url;
    videoPlayer.dataset.plyrEmbedId = urlVideo;
    let breadcrumb = document.querySelector('.breadcrumb');
    breadcrumb.innerHTML = `<i class="fas fa-home"></i> Home / Video / ${data.title}`;
    //Tăng view video
    let viewIncrese = ++data.views;
    fetch(videoApiUrl + id, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            views: viewIncrese,
        }),
    });
}

getDataVideo().then(() => {
    const player = new Plyr('#player');
});

async function getVideoRelated() {
    let response = await fetch(videoApiUrl + '/?_limit=14&id_ne=' + id);
    let data = await response.json();

    let videoContainer = document.querySelector('.video__related');
    let html = '';

    html = data
        .map((video) => {
            return `
                <div class="related__item">
                    ${video.type === 'live' ? '<div class="tag__live">Live</div>' : ''}
                    <div class="related__img">
                        <a href="${view}video/detail/?id=${video.id}">
                            <img src="${uploadImgPost + video.img}" alt="video">
                        </a>
                    </div>
                    <div class="related__meta">
                        <a href="${view}video/detail/?id=${video.id}" class="related__link">
                             ${video.title}
                        </a>
                        <div class="related__author"><i class="fas fa-user"></i> ${video.author}</div>
                        <div class="related__view"><i class="fas fa-eye"></i> <span
                                class="related__viewCount">${video.views}</span> views</div>
                    </div>
                </div>
        `;
        })
        .join('');

    videoContainer.innerHTML = html;
}

getVideoRelated();

//Comment Post
async function getPostComment(id) {
    let response = await fetch(videoApiUrl + '?id=' + id);
    let data = await response.json();
    let dataPost = data[0];
    let commentList = dataPost.comments;
    let commentCount = document.querySelector('.comments_count');
    let html = '';
    let commentForm = document.querySelector('.video__comment');
    let userAvaComment = document.querySelector('.user__ava').querySelector('img');
    let commentContainer = document.querySelector('.comments');
    // Count comments
    commentCount.innerHTML = commentList.length;

    // Comment list container
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

    if (!isLogin()) {
        commentForm.classList.add('d-none');
    } else {
        userAvaComment.src = uploadFolderUserUrl + getUserDataLogged().avatar;
    }
}

getPostComment(id);

//Post comment
let btnSendComment = document.querySelector('.btn__comment');

btnSendComment.onclick = async function sendComment() {
    {
        let response = await fetch(videoApiUrl + '?id=' + id);
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

        let responsePatchComment = await fetch(videoApiUrl + id, {
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
