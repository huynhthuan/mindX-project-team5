//Setting select 2
$(document).ready(function () {
    $('.abilitySelect').select2({
        width: 'style',
    });

    //Close dropdown when click button search
    let fillterBtn = $('#dropdownPokemonFillter');
    let fillterContent = $('.dropdownPokemonFillter__content');

    //Stop close dropdown fillter
    fillterContent.click((e) => {
        e.stopPropagation();
    });

    //Handle click close dropdown fillter
    let closeBtn = $('.dropdownPokemonFillter__close');
    closeBtn.click(() => {
        fillterBtn.dropdown('toggle');
    });
});

//Handle when click fillter
function setActiveBtnFillter(el) {
    let btns = document.querySelectorAll(el);
    for (let btn of btns) {
        btn.onclick = () => {
            if (!btn.classList.contains('active')) {
                for (let btn of btns) {
                    btn.classList.remove('active');
                }
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        };
    }
}

function removeActiveBtnFillter(el) {
    let btns = document.querySelectorAll(el);
    for (let btn of btns) {
        btn.classList.remove('active');
    }
}

setActiveBtnFillter('.fillter__typeItem');
setActiveBtnFillter('.btnFillterHeight');
setActiveBtnFillter('.btnFillterWeight');

// Handle click reset btn

let resetBtn = document.querySelector('.btnPokeFillterReset');
resetBtn.onclick = () => {
    removeActiveBtnFillter('.fillter__typeItem');
    removeActiveBtnFillter('.btnFillterHeight');
    removeActiveBtnFillter('.btnFillterWeight');
};
