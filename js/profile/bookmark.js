// Chuyển tới tab bookmark
let triggerTabList = [].slice.call(document.querySelectorAll('#nav-tab button'));

triggerTabList.forEach(function (triggerEl) {
    let tabTrigger = new bootstrap.Tab(triggerEl);
    if (getAllUrlParams().tab === triggerEl.id) {
        tabTrigger.show();
    }
});

let containerPoke = document.querySelector('.bookmark__pokemon .row');
let containerPokeCard = document.querySelector('.bookmark__card .row');
// Lấy dữ liệu bookmark người dùng
let data = getUserDataLogged().bookmark;
let pagePokemon = 1;
let pagePokemonCard = 1;

let btnLoadPokemon = document.querySelector('.bookmarkPokemon__more');
let btnLoadPokemonCard = document.querySelector('.bookmarkCard__more');

// Lấy dữ liệu pokemon
async function renderPokeBookmark(ids, callback, sort = 'id', orderby = 'asc', page = '1', limit = '8') {
    let html = '';
    let pokemons;
    pokemons = await callback(ids, sort, orderby, page, limit);
    pokemons.forEach((pokemon) => {
        html += `<div class="col-md-6 col-lg-3">
        <div class="pokedex__item">
            <img src="${homeUrl}img/pokedex-bg.png" alt="pokedex__bg"
                class="pokedex__bg">
            <div class="pokedex__content">
                <div class="pokedex__id">${pokemon.idText}</div>
                <div class="pokedex__info">
                    <div class="pokedex__media">
                        <div class="pokedex__ava">
                            <img src="${pokemon.img ? pokemon.img : defaultUrlImgPoke}" alt="pokedex_ava">
                        </div>
                        <div class="pokedex__stats">
                            <div class="stats">
                                <div class="stat__item">
                                     <div class="stat__label">
                                    <img src="${domain}img/stat_hp.png" alt="hp"
                                        class="stat__icon">
                                        <span>${pokemon.hp}</span>
                                        </div>
                                    <div class="stat__value">
                                        <div class="stat__percent" style="width: ${(pokemon.hp / 255) * 100}%"></div>
                                    </div>
                                </div>
                                <div class="stat__item">
                                <div class="stat__label">
                                    <img src="${domain}img/stat_atk.png" alt="atk"
                                        class="stat__icon">
                                        <span>${pokemon.attack}</span>
                                        </div>
                                    <div class="stat__value">
                                        <div class="stat__percent" style="width: ${(pokemon.attack / 195) * 100}%"></div>
                                    </div>
                                </div>
                                <div class="stat__item">
                                    <div class="stat__label">
                                    <img src="${domain}img/stat_def.png" alt="def"
                                        class="stat__icon">
                                        <span>${pokemon.defense}</span>
                                        </div>
                                    <div class="stat__value">
                                        <div class="stat__percent" style="width: ${(pokemon.defense / 250) * 100}%"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="pokedex__meta">
                        <div class="pokedex__header">
                            <h3 class="pokedex__name">
                               ${capitalizeTheFirstLetterOfEachWord(pokemon.name)}
                            </h3>
                            <h3 class="pokedex__ids">
                                ${pokemon.idText}
                            </h3>
                        </div>
                        <div class="pokedex__body">
                            <div class="pokedex__text">
                                <div class="pokedex__label">
                                    Type
                                </div>
                                <div class="pokedex__value">
                                ${pokemon.types
                                    .map((type) => {
                                        return `<span
                                    class="pokedex__type type--${type}">
                                    ${capitalizeTheFirstLetterOfEachWord(type)}
                                    </span>`;
                                    })
                                    .join('')}
                                </div>
                            </div>
                            <div class="pokedex__text">
                                <div class="pokedex__label">
                                    Abilities
                                </div>
                                <div class="pokedex__value">
                                ${pokemon.abilities
                                    .map((abiliti) => {
                                        return capitalizeTheFirstLetterOfEachWord(abiliti);
                                    })
                                    .join(' / ')}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="pokedex__bg2"></div>
                </div>
                <div class="pokedex__overlay">
                    <a href="${view}pokemon/detail/?id=${pokemon.id}"
                        class="btn pokedex__btn pokedex__view">
                        <i class="fas fa-eye"></i> Viewmore
                    </a>
                    <button onclick="addBookmark(this,'pokemon', true)" data-id="${pokemon.id}" class="btn pokedex__btn pokedex__bookmark">
                        ${getUserDataLogged().bookmark.pokedex.includes(Number(pokemon.id)) ? '<i class="fas fa-times"></i> Remove Bookmark' : '<i class="fas fa-bookmark"></i> Bookmark'}
                    </button>
                    <button class="btn pokedex__btn pokedex__compare"
                        data-bs-toggle="modal" data-bs-target="#compareModal" data-id="${pokemon.id}">
                        <i class="fas fa-table"></i> Add compare
                    </button>
                </div>
            </div>
        </div>
    </div>`;
    });

    containerPoke.innerHTML += html;
}

if (data.pokedex.length > 0) {
    renderPokeBookmark(data.pokedex, getPokemonsById);

    if (pagePokemon === Math.ceil(Number(data.pokedex.length) / 8)) {
        btnLoadPokemon.classList.add('d-none');
    }
} else {
    btnLoadPokemon.classList.add('d-none');
    containerPoke.innerHTML = `
        <div class="col-12">
            <div class="alert alert-warning text-center" role="alert">
                No bookmark pokemon found.
            </div>
        </div>
    `;
}

// Load thêm pokemon
btnLoadPokemon.onclick = () => {
    pagePokemon++;

    if (pagePokemon <= Math.ceil(Number(data.pokedex.length) / 8)) {
        if (pagePokemon === Math.ceil(Number(data.pokedex.length) / 8)) {
            btnLoadPokemon.classList.add('d-none');
        }

        renderPokeBookmark(data.pokedex, getPokemonsById, undefined, undefined, pagePokemon, undefined);
    }
};

// Lấy dữ liệu pokemon card
async function renderPokeCardBookmark(ids, callback, sort = 'id', orderby = 'asc', page = '1', limit = '8') {
    let html = '';
    let pokemonCards;
    pokemonCards = await callback(ids, sort, orderby, page, limit);
    pokemonCards.forEach((pokemonCard) => {
        html += `<div class="col-md-6 col-lg-3">
        <div class="poketcg__item">
            <div class="poketcg__img">
                <img src="${pokemonCard.images.small}" alt="tcg">
            </div>
            <div class="poketcg_title">
                ${pokemonCard.name}
            </div>
            <div class="poketcg__overlay">
                <a href="${view}card/detail?id=${pokemonCard.id}"
                    class="btn pokedextcg__btn pokedextcg__view">
                    <i class="fas fa-eye"></i> Viewmore
                </a>
                <button data-id="${pokemonCard.id}" onclick="addBookmark(this, 'card', true)" class="btn pokedextcg__btn pokedextcg__bookmark">
                    ${getUserDataLogged().bookmark.cards.includes(pokemonCard.id) ? '<i class="fas fa-times"></i> Remove Bookmark' : '<i class="fas fa-bookmark"></i> Bookmark'}
                </button>
            </div>
        </div>
    </div>`;
    });

    containerPokeCard.innerHTML += html;
}

if (data.cards.length > 0) {
    renderPokeCardBookmark(data.cards, getPokemonCardsById);

    if (pagePokemonCard === Math.ceil(Number(data.cards.length) / 8)) {
        btnLoadPokemonCard.classList.add('d-none');
    }
} else {
    btnLoadPokemonCard.classList.add('d-none');
    containerPokeCard.innerHTML = `
        <div class="col-12">
            <div class="alert alert-warning text-center" role="alert">
                No bookmark card found.
            </div>
        </div>
    `;
}

// Load thêm pokemon card
btnLoadPokemonCard.onclick = () => {
    pagePokemonCard++;

    if (pagePokemonCard <= Math.ceil(Number(data.cards.length) / 8)) {
        if (pagePokemonCard === Math.ceil(Number(data.cards.length) / 8)) {
            btnLoadPokemonCard.classList.add('d-none');
        }
        renderPokeCardBookmark(data.cards, getPokemonCardsById, undefined, undefined, pagePokemonCard, undefined);
    }
};
