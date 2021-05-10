let containerPoke = document.querySelector('.bookmark__pokemon .row');
let containerPokeCard = document.querySelector('.bookmark__card .row');
// Lấy dữ liệu bookmark người dùng
let data = getUserDataLogged().bookmark;
let pagePokemon = 1;
let pagePokemonCard = 1;

// Lấy dữ liệu pokemon
async function renderPokeBookmark(
    ids,
    callback,
    sort = 'id',
    orderby = 'asc',
    page = '1',
    limit = '10'
) {
    let html = '';
    let pokemons;
    pokemons = await callback(ids, sort, orderby, page, limit);
    pokemons.forEach((pokemon) => {
        html += `<div class="col-md-3">
        <div class="pokedex__item">
            <img src="../../../img/pokedex-bg.png" alt="pokedex__bg"
                class="pokedex__bg">
            <div class="pokedex__content">
                <div class="pokedex__id">${pokemon.idText}</div>
                <div class="pokedex__info">
                    <div class="pokedex__media">
                        <div class="pokedex__ava">
                            <img src="${pokemon.img}" alt="pokedex_ava">
                        </div>
                        <div class="pokedex__stats">
                            <div class="stats">
                                <div class="stat__item">
                                    <img src="../../../img/stat_hp.png" alt="hp"
                                        class="stat__icon">
                                    <div class="stat__value">
                                        <div class="stat__percent" style="width: ${
                                            (pokemon.hp / 200) * 100
                                        }%"></div>
                                    </div>
                                </div>
                                <div class="stat__item">
                                    <img src="../../../img/stat_atk.png" alt="atk"
                                        class="stat__icon">
                                    <div class="stat__value">
                                        <div class="stat__percent" style="width: ${
                                            (pokemon.atk / 200) * 100
                                        }%"></div>
                                    </div>
                                </div>
                                <div class="stat__item">
                                    <img src="../../../img/stat_def.png" alt="def"
                                        class="stat__icon">
                                    <div class="stat__value">
                                        <div class="stat__percent" style="width: ${
                                            (pokemon.def / 200) * 100
                                        }%"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="pokedex__meta">
                        <div class="pokedex__header">
                            <h3 class="pokedex__name">
                               ${capitalizeTheFirstLetterOfEachWord(
                                   pokemon.name
                               )}
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
                                        return capitalizeTheFirstLetterOfEachWord(
                                            abiliti
                                        );
                                    })
                                    .join(' / ')}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="pokedex__bg2"></div>
                </div>
                <div class="pokedex__overlay">
                    <a href="../../../views/pokemon/detail/?pokemonId=${
                        pokemon.id
                    }"
                        class="btn pokedex__btn pokedex__view">
                        <i class="fas fa-eye"></i> Viewmore
                    </a>
                    <button class="btn pokedex__btn pokedex__compare"
                        data-bs-toggle="modal" data-bs-target="#compareModal" data-id="${
                            pokemon.id
                        }">
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
} else {
    containerPoke.innerHTML = `
        <div class="col-12">
            <div class="alert alert-warning text-center" role="alert">
                No bookmark pokemon found.
            </div>
        </div>
    `;
}

// Load thêm pokemon
let btnLoadPokemon = document.querySelector('.bookmarkPokemon__more');
btnLoadPokemon.onclick = () => {
    pagePokemon++;
    console.log(page, Number(data.pokedex.length) / 10);
    if (pagePokemon <= Number(data.pokedex.length) / 10) {
        if (pagePokemon === Number(data.pokedex.length) / 10) {
            btnLoadPokemon.classList.add('d-none');
        }
        renderPokeBookmark(
            data.pokedex,
            getPokemonsById,
            undefined,
            undefined,
            pagePokemon,
            undefined
        );
    }
};

// Lấy dữ liệu pokemon card
async function renderPokeCardBookmark(
    ids,
    callback,
    sort = 'id',
    orderby = 'asc',
    page = '1',
    limit = '10'
) {
    let html = '';
    let pokemonCards;
    pokemonCards = await callback(ids, sort, orderby, page, limit);
    pokemonCards.forEach((pokemonCard) => {
        html += `<div class="col-md-3">
        <div class="poketcg__item">
            <div class="poketcg__img">
                <img src="${pokemonCard.images.small}" alt="tcg">
            </div>
            <div class="poketcg_title">
                ${pokemonCard.name}
            </div>
            <div class="poketcg__overlay">
                <a href="../../../views/card/detail?card-Id=${pokemonCard.id}"
                    class="btn pokedextcg__btn pokedextcg__view">
                    <i class="fas fa-eye"></i> Viewmore
                </a>
            </div>
        </div>
    </div>`;
    });

    containerPokeCard.innerHTML += html;
}

if (data.cards.length > 0) {
    renderPokeCardBookmark(data.cards, getPokemonCardsById);
} else {
    containerPokeCard.innerHTML = `
        <div class="col-12">
            <div class="alert alert-warning text-center" role="alert">
                No bookmark card found.
            </div>
        </div>
    `;
}

// Load thêm pokemon card
let btnLoadPokemonCard = document.querySelector('.bookmarkCard__more');
btnLoadPokemonCard.onclick = () => {
    pagePokemonCard++;
    if (pagePokemonCard <= Number(data.cards.length) / 10) {
        if (pagePokemonCard === Number(data.cards.length) / 10) {
            btnLoadPokemon.classList.add('d-none');
        }
        renderPokeCardBookmark(
            data.cards,
            getPokemonCardsById,
            undefined,
            undefined,
            pagePokemonCard,
            undefined
        );
    }
};
