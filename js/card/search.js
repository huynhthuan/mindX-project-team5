let keySearch = getAllUrlParams()['name'];

async function renderDataSearch() {
    let content = '';
    let response = await fetch(pokeCardApiUrl + '?name_like=' + keySearch + '&_limit=8');
    let data = await response.json();
    let count = document.querySelector('.result__title');
    let totalResult = response.headers.get('X-Total-Count');

    count.innerHTML = `${totalResult} result for <span>"${getAllUrlParams().name}"</span>`;

    for (card of data) {
        content += `
        <div class="col-md-6 col-lg-3">
            <div class="poketcg__item">
                <div class="poketcg__img">
                    <img src="${card.images.small}" alt="tcg">
                </div>
                <div class="poketcg_title">
                    ${card.name}
                </div>
                <div class="poketcg__overlay">
                    <a href="${view}card/detail/?id=${card.id}" class="btn pokedextcg__btn pokedextcg__view">
                        <i class="fas fa-eye"></i> Viewmore
                    </a>
                    <button onclick="addBookmark(this,'pokemon')" data-id="${card.id}" class="btn pokedex__btn pokedex__bookmark ${isLogin() ? '' : 'd-none'}">${
            isLogin() ? (getUserDataLogged().bookmark.pokedex.includes(Number(card.id)) ? '<i class="fas fa-times"></i> Remove Bookmark' : '<i class="fas fa-bookmark"></i>  Bookmark') : ''
        }
                    </button>
                </div>
            </div>
        </div>
        `;
    }
    let showCard = document.querySelector('.archivePoke .archiveCard__list .row');
    showCard.innerHTML = content;
}
renderDataSearch();

let page = 1;
let button = document.querySelector('.archivePoke .text-center .archivePoke__more');
let sort = document.querySelector('#sortPoke');

button.addEventListener('click', async function () {
    let contact = '';
    page++;
    let response = await fetch(pokeCardApiUrl + '?name_like=' + keySearch + '&_page=' + page + '&_limit=8' + sort.value);
    let data = await response.json();

    if (data.length > 0) {
        for (cards of data) {
            contact += `
            <div class="col-md-6 col-lg-3">
                <div class="poketcg__item">
                    <div class="poketcg__img">
                        <img src="${cards.images.small}" alt="tcg">
                    </div>
                    <div class="poketcg_title">
                        ${cards.name}
                    </div>
                    <div class="poketcg__overlay">
                        <a href="${view}card/detail/?id=${cards.id}" class="btn pokedextcg__btn pokedextcg__view">
                            <i class="fas fa-eye"></i> Viewmore
                        </a>
                        <button onclick="addBookmark(this,'pokemon')" data-id="${cards.id}" class="btn pokedex__btn pokedex__bookmark ${isLogin() ? '' : 'd-none'}">${
                isLogin() ? (getUserDataLogged().bookmark.pokedex.includes(Number(cards.id)) ? '<i class="fas fa-times"></i> Remove Bookmark' : '<i class="fas fa-bookmark"></i>  Bookmark') : ''
            }
                        </button>
                    </div>
                </div>
            </div>
            `;
        }
    } else {
        button.style.display = 'none';
    }
    let nextCard = document.querySelector('.archivePoke .archiveCard__list .row');
    nextCard.innerHTML += contact;
});

sort.addEventListener('change', async function () {
    let html = '';
    let response = await fetch(pokeCardApiUrl + '?name_like=' + keySearch + '&_limit=8' + sort.value);
    let data = await response.json();

    for (item of data) {
        html += `
        <div class="col-md-6 col-lg-3">
            <div class="poketcg__item">
                <div class="poketcg__img">
                    <img src="${item.images.large}" alt="tcg">
                </div>
                <div class="poketcg_title">
                    ${item.name}
                </div>
                <div class="poketcg__overlay">
                    <a href="${view}card/detail/?id=${item.id}" class="btn pokedextcg__btn pokedextcg__view">
                        <i class="fas fa-eye"></i> Viewmore
                    </a>
                    <button onclick="addBookmark(this,'pokemon')" data-id="${item.id}" class="btn pokedex__btn pokedex__bookmark ${isLogin() ? '' : 'd-none'}">${
            isLogin() ? (getUserDataLogged().bookmark.pokedex.includes(Number(item.id)) ? '<i class="fas fa-times"></i> Remove Bookmark' : '<i class="fas fa-bookmark"></i>  Bookmark') : ''
        }
                                </button>
                </div>
            </div>
        </div>
        `;
    }

    let archiveCard = document.querySelector('.archivePoke .archiveCard__list .row');
    archiveCard.innerHTML = html;
});
