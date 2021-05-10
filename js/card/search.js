let keySearch = getAllUrlParams()['name'];

async function renderDataSearch() {
    let content = '';
    let response = await fetch(
        pokeCardApiUrl + '?name_like=' + keySearch + '&_limit=8'
    );
    let data = await response.json();
    for (card of data) {
        content += `
        <div class="col-md-3">
            <div class="poketcg__item">
                <div class="poketcg__img">
                    <img src="${card.images.large}" alt="tcg">
                </div>
                <div class="poketcg_title">
                    ${card.name}
                </div>
                <div class="poketcg__overlay">
                    <a href="../../views/card/detail/" class="btn pokedextcg__btn pokedextcg__view">
                        <i class="fas fa-eye"></i> Viewmore
                    </a>
                    <button class="btn pokedextcg__btn pokedextcg__bookmark">
                        <i class="fas fa-bookmark"></i> Bookmark
                    </button>
                </div>
            </div>
        </div>
        `;
    }
    let showCard = document.querySelector(
        '.archivePoke .archiveCard__list .row'
    );
    showCard.innerHTML = content;
}
renderDataSearch();

let page = 1;
let button = document.querySelector(
    '.archivePoke .text-center .archivePoke__more'
);
button.addEventListener('click', async function () {
    let contact = '';
    page++;
    let response = await fetch(
        pokeCardApiUrl +
            '?name_like=' +
            keySearch +
            '&_page=' +
            page +
            '&_limit=8'
    );
    let data = await response.json();
    console.log(data);
    if (data.length > 0) {
        for (cards of data) {
            contact += `
            <div class="col-md-3">
                <div class="poketcg__item">
                    <div class="poketcg__img">
                        <img src="${cards.images.large}" alt="tcg">
                    </div>
                    <div class="poketcg_title">
                        ${cards.name}
                    </div>
                    <div class="poketcg__overlay">
                        <a href="../../views/card/detail/" class="btn pokedextcg__btn pokedextcg__view">
                            <i class="fas fa-eye"></i> Viewmore
                        </a>
                        <button class="btn pokedextcg__btn pokedextcg__bookmark">
                            <i class="fas fa-bookmark"></i> Bookmark
                        </button>
                    </div>
                </div>
            </div>
            `;
        }
    } else {
        button.style.display = 'none';
    }
    let nextCard = document.querySelector(
        '.archivePoke .archiveCard__list .row'
    );
    nextCard.innerHTML += contact;
});
