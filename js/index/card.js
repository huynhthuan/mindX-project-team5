async function get8Card() {
    let html = '';
    let response = await fetch(pokeCardApiUrl + '?_limit=8');
    let data = await response.json();

    for (let item of data) {
        html += `
        <div class="col-md-6 col-lg-3">
            <div class="poketcg__item">
                <div class="poketcg__img">
                    <img src="${item.images.small}" alt="tcg">
                </div>
                <div class="poketcg_title">
                    ${item.name}
                </div>
                <div class="poketcg__overlay">
                    <a href="${view}card/detail/?id=${item.id}" class="btn pokedextcg__btn pokedextcg__view">
                        <i class="fas fa-eye"></i> Viewmore
                    </a>
                    <button data-id="${item.id}" onclick="addBookmark(this, 'card')" class="btn pokedextcg__btn pokedextcg__bookmark ${isLogin() ? '' : 'd-none'}">
                        ${isLogin() ? (getUserDataLogged().bookmark.cards.includes(item.id) ? '<i class="fas fa-times"></i> Remove Bookmark' : '<i class="fas fa-bookmark"></i> Bookmark') : ''}
                    </button>
                </div>
            </div>
        </div>
        `;
    }
    let pokemonTcg = document.querySelector('.block__pokedextcg .block__content .row');
    pokemonTcg.innerHTML = html;
}

get8Card();
