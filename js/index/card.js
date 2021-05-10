async function get8Card() {
    let html = '';
    let response = await fetch(pokeCardApiUrl + '?_limit=8');
    let data = await response.json();

    for (let item of data) {
        html += `
        <div class="col-md-3">
            <div class="poketcg__item">
                <div class="poketcg__img">
                    <img src="${item.images.large}" alt="tcg">
                </div>
                <div class="poketcg_title">
                    ${item.name}
                </div>
                <div class="poketcg__overlay">
                    <button class="btn pokedextcg__btn pokedextcg__view">
                        <i class="fas fa-eye"></i> Viewmore
                    </button>
                    <button class="btn pokedextcg__btn pokedextcg__bookmark">
                        <i class="fas fa-bookmark"></i> Bookmark
                    </button>
                </div>
            </div>
        </div>
        `;
    }
    let pokemonTcg = document.querySelector(
        '.block__pokedextcg .block__content .row'
    );
    pokemonTcg.innerHTML = html;
}

get8Card();
