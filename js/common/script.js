//=============================================
// Tạo fixed menu
let sticky = new Waypoint.Sticky({
    element: $('.navigation')[0],
});

//=============================================

// Hiển thị dữ liệu người dùng khi đã đăng nhập
setDataMenu();

// Thay đổi màu theo setting người dùng
changeColorTemplate();

//=============================================
// Tạo chức năng chat

let main = document.querySelector('.main__wrap');
let btnChat = document.querySelector('.toggle__chat');
let chatBox = document.querySelector('.chatbox');
let chatboxList = document.querySelector('.chatbox__list');
let btnMinimizeChat = document.querySelectorAll('.btn__minimizechat');
let btnCloseChat = document.querySelectorAll('.btn__closechat');
let btnChatList = document.querySelectorAll('.chat__item a');
let chatChannelContainer = document.querySelector(
    '.chatbox__inner .chat__group:first-child .chat__list'
);

// Redirect nếu người dùng chưa đăng nhập để chat
btnChat.onclick = () => {
    let user = localStorage.getItem('userLoggeData');
    if (!user) {
        redirectTo(
            homeUrl +
                'views/auth/login/?toast=true&type=notice&msg=Login to chat with everybody!!!'
        );
    } else {
        main.classList.toggle('active');
        chatBox.classList.toggle('active');
        chatboxList.classList.toggle('active');
    }
};

// Lấy danh sách kênh chat
async function renderChannelChatList() {
    let channels = await getChannelsChat();
    let html = '';
    html += channels
        .map((channel) => {
            // Đếm số người trong kênh chat
            let chatIds = removeDuplicateInArray(
                channel.chats.map((chat) => {
                    return chat.userId;
                })
            );

            // Render html
            return `<li class="chat__item">
                <a href="javascript:void(0)" onclick="createChatFrame(this)" data-name="${
                    channel.name
                }">
                    <div class="chat__ava">
                        <img src="${
                            uploadFolderUserUrl + channel.ava
                        }" alt="chat">
                    </div>
                    <div class="chat__meta">
                        <div class="chat__name">${channel.name}</div>
                        <div class="chat__status"><span class="text-success">${
                            chatIds.length
                        } people joined</span></div>
                    </div>
                </a>
            </li>`;
        })
        .join('');

    if (!!chatChannelContainer) {
        chatChannelContainer.innerHTML += html;
    }
}

//Render danh sách chat
renderChannelChatList();

// Thêm hộp chat khi ấn và danh sách chat sidebar
async function createChatFrame(item) {
    let chatName = item.dataset.name;
    let currentChatBox = document.querySelector(
        '#' + chatName.toLowerCase().replaceAll(' ', '-')
    );

    // Kiểm tra chatbox, nếu đã tồn tại thì thu nhỏ
    if (currentChatBox) {
        currentChatBox.classList.toggle('minimize');
    } else {
        // Kiểm tra nếu chatlist có hơn 4 chatbox thì xóa chatbox đầu tiên
        if (chatboxList.childElementCount === 3) {
            chatboxList.removeChild(
                chatboxList.childNodes[chatboxList.childElementCount - 1]
            );
        }
        let html = `
        <div class="chating" id="${chatName
            .toLowerCase()
            .replaceAll(' ', '-')}">
            <div class="chatting__info">
                <div class="info__userName"><span class="text-success chat__status--icon"><i class="fas fa-circle"></i></span>${chatName}</div>
                <div class="info__action">
                    <button class="btn btn__minimizechat" onclick="minimizeChat(this)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <button class="btn btn__closechat" onclick="closeChat(this)">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>

            <ul class="chating__list">
                <li class="chatting__item w-100">Loading messenger....</li> 
            </ul>

            <div class="chating__send">
                <div class="form-group d-flex">
                    <input type="text" name="message" class="form-control me-1" placeholder="Aa" onkeypress="sendMsgToChannelEnter(this, event)">
                    <button class="btn btn-success btn-sendmsg-channel" data-iduser="${
                        getUserDataLogged().id
                    }" data-idchannel="${chatName
            .toLowerCase()
            .replaceAll(' ', '-')}" data-username="${
            getUserDataLogged().username
        }"  data-useravatar="${
            getUserDataLogged().avatar
        }" onclick="sendMsgToChannel(this)"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div></div>
    `;

        chatboxList.insertAdjacentHTML('afterbegin', html);
        setTimeout(() => {
            let self = document.querySelector(
                '#' +
                    chatName.toLowerCase().replaceAll(' ', '-') +
                    ' .chating__list'
            );
            self.scrollTop = self.scrollHeight;
        }, 1500);
    }
}

// Function thu nhỏ chat cho chatbox tạo mới
let minimizeChat = (btn) => {
    let parent = btn.parentNode.parentNode.parentNode;
    parent.classList.toggle('minimize');
};

// Function đóng chat cho chatbox tạo mới
let closeChat = (btn) => {
    let parent = btn.parentNode.parentNode.parentNode;
    parent.remove();
};

// Set số lượng chat của từng channel vào localStorage
fetch(chatChannelApiUrl)
    .then((data) => {
        return data.json();
    })
    .then((data) => {
        data.map((channel) => {
            localStorage.setItem('#' + channel.id, channel.chats.length);
        });
    });

// Hiển thị chat mới theo thời gian
let timeLoop = setInterval(() => {
    let chattings = Array.prototype.slice.call(
        document.querySelectorAll('.chating')
    );
    // Tạo url query
    if (chattings.length > 0) {
        let querys = chattings
            .map((chat) => {
                return chat.id;
            })
            .join('&id=');
        // Lấy nội dung chat từng channels
        fetch(chatChannelApiUrl + '?id=' + querys)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                // Render nội dung chat cho từng chat frame
                data.forEach((chat) => {
                    let frameID = '#' + chat.id;
                    let chatFrame = document.querySelector(
                        '#' + chat.id + ' .chating__list'
                    );
                    // Kiểm tra xem chat channel có tin nhắn chưa
                    if (chat.chats.length > 0) {
                        Promise.all(
                            chat.chats.map(async (chatItem) => {
                                return `<li class="chatting__item chatting__item--${
                                    chatItem.userName ===
                                    getUserDataLogged().username
                                        ? 'send'
                                        : 'receive'
                                }" title="${chatItem.userName}">
                                            <div class="chating__img">
                                                <img src="${
                                                    uploadFolderUserUrl +
                                                    chatItem.userAva
                                                }" alt="ava">
                                            </div>
                                            <div class="chating__content">
                                                <span class="chating__content--name">${
                                                    chatItem.userName
                                                }</span>
                                                <div class="chating__content--main">${
                                                    chatItem.msg
                                                }</div>
                                            </div>
                                        </li>
                                        `;
                            })
                        ).then((data) => {
                            if (
                                chat.chats.length >
                                Number(localStorage.getItem(frameID))
                            ) {
                                chatFrame.innerHTML = data.join('');
                                chatFrame.scrollTop = chatFrame.scrollHeight;
                                localStorage.setItem(
                                    frameID,
                                    chat.chats.length
                                );
                            } else {
                                chatFrame.innerHTML = data.join('');
                            }
                        });
                    } else {
                        chatFrame.innerHTML =
                            '<li class="chatting__item w-100 alert alert-warning">No messenger! Send a message to everyone. :)</li>';
                    }
                });
            });
    }
}, 1000);

// Gửi tin nhắn đến kênh chat
async function sendMsgToChannel(btn) {
    // Lấy dữ liệu tin nhắn
    let userName = btn.dataset.username;
    let userAvatar = btn.dataset.useravatar;
    let userId = btn.dataset.iduser;
    let userMsg = btn.previousElementSibling.value;
    let channelId = btn.dataset.idchannel;
    let responseChannel = await fetch(chatChannelApiUrl + channelId);
    let dataChannel = await responseChannel.json();
    let chatsChannel = dataChannel.chats;

    chatsChannel.push({
        userId: userId,
        userAva: userAvatar,
        userName: userName,
        msg: userMsg,
    });

    // Cập nhật tin nhắn cho channel
    let responseSendChat = await fetch(chatChannelApiUrl + channelId, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chats: chatsChannel,
        }),
    });

    if (responseSendChat.ok) {
        btn.previousElementSibling.value = '';
    } else {
        showNotice('error', 'Send messenger failed. Try again!');
    }
}

//Gửi tin nhắn đến kênh chat khi enter
function sendMsgToChannelEnter(btn, event) {
    if (event.keyCode === 13) {
        sendMsgToChannel(btn.nextElementSibling);
    }
}

//=============================================

// Hiển thị thông báo
if (getAllUrlParams().toast === 'true') {
    showNotice(
        getAllUrlParams().type,
        getAllUrlParams().msg.replaceAll('%20', ' ')
    );
}

//===============================================
// Chuyển đến trang search ứng với select ở ô tìm kiếm
let searchForm = document.querySelector('.form-search');
searchForm.onsubmit = (event) => {
    event.preventDefault();
    let typeSearch = searchForm.querySelector('#search_type').value;
    let keySearch = searchForm.querySelector('.navigation__search').value;

    if (typeSearch === 'pkm') {
        window.location.href =
            domain + 'views/pokemon/search/?name=' + keySearch;
    } else {
        window.location.href = domain + 'views/card/search/?name=' + keySearch;
    }
};
