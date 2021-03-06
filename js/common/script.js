//=============================================
// Lấy lại dữ liệu người dùng mỗi khi tải trang sau đăng nhập
if (isLogin()) {
    getUserById(getUserDataLogged().id).then((data) => {
        setUserDataLogged(data);
    });
    console.log('Save user successfully');
}

// Tạo fixed menu
// let sticky = new Waypoint.Sticky({
//     element: $('.navigation')[0],
// });

//=============================================

// Hiển thị dữ liệu người dùng khi đã đăng nhập
setDataMenu();

// Thay đổi màu theo setting người dùng
changeColorTemplate();

// Thêm bookmark
async function addBookmark(btn, type, remove = false, isDetail = false) {
    if (!getUserDataLogged()) {
        showNotice('notice', 'Bạn cần <b><a href="' + view + 'auth/login/">đăng nhập</a></b> để sử dụng chức năng này');
        return;
    }

    let data;
    let dataBookMark = getUserDataLogged().bookmark;

    if (type === 'pokemon') {
        let id = Number(btn.dataset.id);

        if (!dataBookMark.pokedex.includes(id)) {
            dataBookMark.pokedex.push(id);
            if (!isDetail) {
                btn.innerHTML = '<i class="fas fa-times"></i> Remove Bookmark';
            } else {
                btn.innerHTML = '<i class="fas fa-times"></i>';
            }
            showNotice('success', 'Add bookmark successfully!');
        } else {
            dataBookMark.pokedex.splice(dataBookMark.pokedex.indexOf(id), 1);
            if (!isDetail) {
                btn.innerHTML = '<i class="fas fa-bookmark"></i> Bookmark';
            } else {
                btn.innerHTML = '<i class="fas fa-bookmark"></i>';
            }
            showNotice('notice', 'Remove bookmark successfully!');
        }

        data = {
            bookmark: {
                pokedex: dataBookMark.pokedex,
                cards: dataBookMark.cards,
            },
        };
    } else {
        let id = btn.dataset.id;

        if (!dataBookMark.cards.includes(id)) {
            dataBookMark.cards.push(id);
            btn.innerHTML = '<i class="fas fa-times"></i> Remove Bookmark';
            showNotice('success', 'Add bookmark successfully!');
        } else {
            dataBookMark.cards.splice(dataBookMark.cards.indexOf(id), 1);
            btn.innerHTML = '<i class="fas fa-bookmark"></i> Bookmark';
            showNotice('notice', 'Remove bookmark successfully!');
        }

        data = {
            bookmark: {
                pokedex: dataBookMark.pokedex,
                cards: dataBookMark.cards,
            },
        };
    }

    let response = await updateUserDataById(getUserDataLogged().id, data);
    setUserDataLogged(response);

    if (remove) {
        location.reload();
    }
}

//=============================================
// Tạo chức năng chat

let main = document.querySelector('.main__wrap');
let btnChat = document.querySelector('.toggle__chat');
let chatBox = document.querySelector('.chatbox');
let chatboxList = document.querySelector('.chatbox__list');
let btnMinimizeChat = document.querySelectorAll('.btn__minimizechat');
let btnCloseChat = document.querySelectorAll('.btn__closechat');
let btnChatList = document.querySelectorAll('.chat__item a');
let chatChannelContainer = document.querySelector('.chatbox__inner .chat__group:first-child .chat__list');

// Redirect nếu người dùng chưa đăng nhập để chat
btnChat.onclick = () => {
    let user = localStorage.getItem('userLoggeData');
    if (!user) {
        redirectTo(homeUrl + 'views/auth/login/');
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
                <a href="javascript:void(0)" onclick="createChatFrame(this)" data-name="${channel.name}">
                    <div class="chat__ava">
                        <img src="${uploadFolderUserUrl + channel.ava}" alt="chat">
                    </div>
                    <div class="chat__meta">
                        <div class="chat__name">${channel.name}</div>
                        <div class="chat__status"><span class="text-success">${chatIds.length} people joined</span></div>
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
    let currentChatBox = document.querySelector('#' + chatName.toLowerCase().replaceAll(' ', '-'));

    // Kiểm tra chatbox, nếu đã tồn tại thì thu nhỏ
    if (currentChatBox) {
        currentChatBox.classList.toggle('minimize');
    } else {
        // Kiểm tra nếu chatlist có hơn 4 chatbox thì xóa chatbox cuối
        if (screen.width > 768) {
            if (chatboxList.childElementCount > 3) {
                console.log(chatboxList.childNodes);
                chatboxList.removeChild(chatboxList.childNodes[0]);
            }
        } else {
            if (chatboxList.childElementCount > 0) {
                chatboxList.removeChild(chatboxList.childNodes[0]);
            }
        }

        let html = `<div class="chating" id="${chatName.toLowerCase().replaceAll(' ', '-')}">
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
                    <button class="btn btn-success btn-sendmsg-channel" data-iduser="${getUserDataLogged().id}" data-idchannel="${chatName.toLowerCase().replaceAll(' ', '-')}" data-username="${
            getUserDataLogged().username
        }"  data-useravatar="${getUserDataLogged().avatar}" onclick="sendMsgToChannel(this)"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div></div>`;

        chatboxList.innerHTML += html;
        setTimeout(() => {
            let self = document.querySelector('#' + chatName.toLowerCase().replaceAll(' ', '-') + ' .chating__list');
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
    let chattings = Array.prototype.slice.call(document.querySelectorAll('.chating'));
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
                    let chatFrame = document.querySelector('#' + chat.id + ' .chating__list');
                    // Kiểm tra xem chat channel có tin nhắn chưa
                    if (chat.chats.length > 0) {
                        Promise.all(
                            chat.chats.map(async (chatItem) => {
                                return `<li class="chatting__item chatting__item--${chatItem.userName === getUserDataLogged().username ? 'send' : 'receive'}" title="${chatItem.userName}">
                                            <div class="chating__img">
                                                <img src="${uploadFolderUserUrl + chatItem.userAva}" alt="ava">
                                            </div>
                                            <div class="chating__content">
                                                <span class="chating__content--name">${chatItem.userName}</span>
                                                <div class="chating__content--main">${chatItem.msg}</div>
                                            </div>
                                        </li>
                                        `;
                            })
                        ).then((data) => {
                            if (chat.chats.length > Number(localStorage.getItem(frameID))) {
                                chatFrame.innerHTML = data.join('');
                                chatFrame.scrollTop = chatFrame.scrollHeight;
                                localStorage.setItem(frameID, chat.chats.length);
                            } else {
                                chatFrame.innerHTML = data.join('');
                            }
                        });
                    } else {
                        chatFrame.innerHTML = '<li class="chatting__item w-100 alert alert-warning">No messenger! Send a message to everyone. :)</li>';
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
    showNotice(getAllUrlParams().type, getAllUrlParams().msg.replaceAll('%20', ' '));
}

//===============================================
// Chuyển đến trang search ứng với select ở ô tìm kiếm
let searchForm = document.querySelector('.form-search');

searchForm.onsubmit = (event) => {
    event.preventDefault();
    let keySearch = searchForm.querySelector('.navigation__search').value;
    let typeSearch = searchForm.querySelector('#search_type').value;

    if (typeSearch === 'pkm') {
        window.location.href = domain + 'views/pokemon/search/?name=' + keySearch;
    } else {
        window.location.href = domain + 'views/card/search/?name=' + keySearch;
    }
};

// Set từ khóa tìm kiếm cho ô input
if (getAllUrlParams().name) {
    let inputSearch = searchForm.querySelector('.navigation__search');
    inputSearch.value = getAllUrlParams().name;
}

//=============================================
// So sánh
function getId(btn) {
    idPokemon = btn.dataset.id;
    idSave1 = localStorage.getItem('compare1');
    idSave2 = localStorage.getItem('compare2');

    if (!idSave1) {
        localStorage.setItem('compare1', idPokemon);
    } else if (!idSave2) {
        localStorage.setItem('compare2', idPokemon);
    } else {
        showNotice('notice', 'You can only compare 2 pokemon!!!');
    }
    pokeCompare(idPokemon);

    idSave1 = localStorage.getItem('compare1');
    idSave2 = localStorage.getItem('compare2');
    htmlCompare = localStorage.getItem('htmlCompare');
}

//////////// remove
function clickRemove(value) {
    value = value.toString();
    idSave1 = localStorage.getItem('compare1');
    idSave2 = localStorage.getItem('compare2');
    idSave1 = value == idSave1 ? '' : idSave1;
    idSave2 = value == idSave2 ? '' : idSave2;
    localStorage.setItem('compare1', idSave1);
    localStorage.setItem('compare2', idSave2);

    pokeCompare(idPokemon);
}

/////// html pokeCompare
async function pokeCompare(idPokemon) {
    let compare = document.querySelector('.compare .row');
    idSave1 = localStorage.getItem('compare1');
    idSave2 = localStorage.getItem('compare2');
    let htmlCompare = '';

    if (!idSave1 && !idSave2) {
        arrPoke = [];
    } else if (!idSave2) {
        arrPoke = [idSave1];
    } else if (!idSave1) {
        arrPoke = [idSave2];
    } else {
        arrPoke = [idSave1, idSave2];
    }

    for (value of arrPoke) {
        idPokemon = value;
        let response = await fetch(pokeApiUrl + idPokemon);
        let data = await response.json();

        htmlCompare += `
  <div class="col-md-6">
    <div class="compare__item">
      <button class="btn btn-danger w-100 mb-4" onclick=clickRemove(${idPokemon})>Remove</button>
      <div class="compare__name" style= "text-transform: capitalize">${data.name}</div>
      <div class="compare__image">
        <img src=${data.img ? data.img : defaultUrlImgPoke} alt="pokemon" />
      </div>
      <div class="compare__content">
        <div class="compare__label">Stats</div>
        <div class="compare__stats">
          <div class="compare__stats">
            <div class="stats">
              <div class="stat__item">
                <img
                  src="${domain}img/stat_hp.png"
                  alt="hp"
                  class="stat__icon"
                />
                <div class="stat__value">
                  <div class="stat__percent" style= "width: ${(data.hp * 100) / 255}%"></div>
                </div>
              </div>
              <div class="stat__item">
                <img
                  src="${domain}img/stat_atk.png"
                  alt="atk"
                  class="stat__icon"
                />
                <div class="stat__value">
                  <div class="stat__percent" style= "width: ${(data.attack * 100) / 190}%"></div>
                </div>
              </div>
              <div class="stat__item">
                <img
                  src="${domain}img/stat_def.png"
                  alt="def"
                  class="stat__icon"
                />
                <div class="stat__value">
                  <div class="stat__percent" style= "width: ${(data.defense * 100) / 250}%"></div>
                </div>
              </div>
              <div class="stat__item">
                <img
                  src="${domain}img/stat_atk_special.png"
                  alt="hp"
                  class="stat__icon"
                />
                <div class="stat__value">
                  <div class="stat__percent" style= "width: ${(data[`special-attack`] * 100) / 194}%"></div>
                </div>
              </div>
              <div class="stat__item">
                <img
                  src="${domain}img/stat_def_special.png"
                  alt="atk"
                  class="stat__icon"
                />
                <div class="stat__value">
                  <div class="stat__percent" style="width: ${(data[`special-defense`] * 100) / 250}%"></div>
                </div>
              </div>
              <div class="stat__item">
                <img
                  src="${domain}img/stat_spd.png"
                  alt="def"
                  class="stat__icon"
                />
                <div class="stat__value">
                  <div class="stat__percent" style= "width: ${(data.speed * 100) / 200}%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="compare__button text-center">
          <a
            href="${view}pokemon/detail/?id=${idPokemon}"
            class="btn btnCompare__more"
            >View detail</a
          >
        </div>
      </div>
    </div>
  </div>
  `;
    }

    if (arrPoke.length > 0) {
        compare.innerHTML = htmlCompare;
    } else {
        compare.innerHTML = '<div class="col-12 text-center"><p class="alert alert-warning fw-bold">No pokemon compare !</p></div>';
    }
}
