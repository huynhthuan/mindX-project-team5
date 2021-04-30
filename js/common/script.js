let sticky = new Waypoint.Sticky({
    element: $('.navigation')[0],
});

let main = document.querySelector('main');
let btnChat = document.querySelector('.toggle__chat');
let chatBox = document.querySelector('.chatbox');
let chatboxList = document.querySelector('.chatbox__list');
let btnMinimizeChat = document.querySelectorAll('.btn__minimizechat');
let btnCloseChat = document.querySelectorAll('.btn__closechat');
let btnChatList = document.querySelectorAll('.chat__item a');

btnChat.onclick = () => {
    main.classList.toggle('active');
    chatBox.classList.toggle('active');
    chatboxList.classList.toggle('active');
};

btnMinimizeChat.forEach((item) => {
    item.onclick = () => {
        let parent = item.parentNode.parentNode.parentNode;
        parent.classList.toggle('minimize');
    };
});

btnCloseChat.forEach((item) => {
    item.onclick = () => {
        let parent = item.parentNode.parentNode.parentNode;
        parent.remove();
    };
});

btnChatList.forEach((item) => {
    item.onclick = () => {
        let chatName = item.dataset.name;
        chatboxList.innerHTML += `
        <div class="chating">
            <div class="chatting__info">
                <div class="info__userName">Admin</div>
                <div class="info__action">
                    <button class="btn btn__minimizechat">
                        <i class="fas fa-minus"></i>
                    </button>
                    <button class="btn btn__closechat">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>

            <ul class="chating__list">
                <li class="chatting__item chatting__item--receive">
                    <div class="chating__img">
                        <img src="./img/ava.png" alt="ava">
                    </div>
                    <div class="chating__content">
                        123123123123123123123123 Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo
                        voluptatem maiores excepturi saepe ratione repellendus eveniet unde sapiente est, iure
                        corrupti. Voluptatum vero, praesentium repudiandae porro ducimus maiores delectus
                        obcaecati?
                    </div>
                </li>
                <li class="chatting__item chatting__item--send">
                    <div class="chating__img">
                        <img src="./img/ava.png" alt="ava">
                    </div>
                    <div class="chating__content">
                        123123123123123123123123 Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo
                        voluptatem maiores excepturi saepe ratione repellendus eveniet unde sapiente est, iure
                        corrupti. Voluptatum vero, praesentium repudiandae porro ducimus maiores delectus
                        obcaecati?
                    </div>
                </li>
                <li class="chatting__item chatting__item--send">
                    <div class="chating__img">
                        <img src="./img/ava.png" alt="ava">
                    </div>
                    <div class="chating__content">
                        123123123123123123123123 Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo
                        voluptatem maiores excepturi saepe ratione repellendus eveniet unde sapiente est, iure
                        corrupti. Voluptatum vero, praesentium repudiandae porro ducimus maiores delectus
                        obcaecati?
                    </div>
                </li>
            </ul>

            <div class="chating__send">
                <form action="">
                    <div class="form-group d-flex">
                        <input type="text" name="message" class="form-control me-1" placeholder="Aa">
                        <button class="btn btn-success"><i class="fas fa-paper-plane"></i></button>
                    </div>
                </form>
            </div>
        </div>
        `;
    };
});
