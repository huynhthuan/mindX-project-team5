//Setting select 2
$(document).ready(function () {
    $('.abilitySelect').select2({
        width: 'style',
    });
});

let dropDownFillter = new bootstrap.Dropdown(document.querySelector('.archivePoke__fillter .dropdown-toggle'));

//Close dropdown when click button search
let fillterContent = document.querySelector('.dropdownPokemonFillter__content');

//Stop close dropdown fillter
fillterContent.onclick = (e) => {
    e.stopPropagation();
};

//Handle click close dropdown fillter
let closeBtn = document.querySelector('.dropdownPokemonFillter__close');
closeBtn.onclick = () => {
    dropDownFillter.hide();
};

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
    $(document).ready(function () {
        $('.abilitySelect').val('All').trigger('change');
    });
};

//Render data pokemon
async function render(url, containerEl, type = null) {
    let response = await fetch(url);
    let totalResult = response.headers.get('X-Total-Count');
    let data = await response.json();
    let html = '';
    result.innerHTML = `
        <div class="result__title">
        ${totalResult} result for "<span>${getAllUrlParams().name}</span>"
        </div>`;

    let loadMore = document.getElementsByClassName('archivePoke__pagination text-center')[0];

    ///////limit page
    if (totalResult - 1 < page * 8) {
        loadMore.innerHTML = ``;
    } else {
        loadMore.innerHTML = `<button class="btn archivePoke__more" onclick=clickLoadMore()>
                                Load more Pokemon
                              </button>`;
    }

    data.map((pokemon) => {
        /////// tạo HTML type
        let htmltypes = ``;
        let typesPika = pokemon.types;
        for (let i in typesPika) {
            htmltypes += `<span class= "pokedex__type type--${typesPika[i]}" style= "text-transform: capitalize"
            >${typesPika[i]}</span
          >`;
        }

        ////// tạo HTML Ablilities
        let htmlAbilities = ``;
        let arrAbilities = [];
        let abilitiesPika = pokemon.abilities;
        for (let i in abilitiesPika) {
            arrAbilities = [...arrAbilities, abilitiesPika[i]];
        }
        htmlAbilities = arrAbilities.join('/ ');

        ////// thay ảnh NULL
        let imgPoke = pokemon.img;
        if (imgPoke === null) {
            imgPoke = defaultUrlImgPoke;
        }
        ////////// xu ly loadMore

        html += `
        <div class="col-md-6 col-lg-3">
        <div class="pokedex__item">
          <img
            src="${domain}img/pokedex-bg.png"
            alt="pokedex__bg"
            class="pokedex__bg"
          />
          <div class="pokedex__content">
            <div class="pokedex__id">${pokemon.idText}</div> 
            <div class="pokedex__info">
              <div class="pokedex__media">
                <div class="pokedex__ava">
                  <img src= ${imgPoke} alt="pokedex_ava" />
                </div>
                <div class="pokedex__stats">
                  <div class="stats">
                    <div class="stat__item">
                      <div class="stat__label">
                            <img
                            src="${domain}img/stat_hp.png"
                            alt="hp"
                            class="stat__icon"
                          />
                        <span>${pokemon.hp}</span>
                      </div>
                      <div class="stat__value">
                        <div class="stat__percent" style= "width: ${(pokemon.hp * 100) / 255}%"></div>
                      </div>
                    </div>
                    <div class="stat__item">
                    <div class="stat__label">
                      <img
                        src="${domain}img/stat_atk.png"
                        alt="atk"
                        class="stat__icon"
                      />
                      <span>${pokemon.attack}</span>
                      </div>
                      <div class="stat__value">
                        <div class="stat__percent" style= "width: ${(pokemon.attack * 100) / 190}%"></div>
                      </div>
                    </div>
                    <div class="stat__item">
                    <div class="stat__label">
                      <img
                        src="${domain}img/stat_def.png"
                        alt="def"
                        class="stat__icon"
                      />
                      <span>${pokemon.defense}</span>
                      </div>
                      <div class="stat__value">
                        <div class="stat__percent" style= "width: ${(pokemon.defense * 100) / 250}%"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="pokedex__meta">
                <div class="pokedex__header">
                  <h3 class="pokedex__name">${pokemon.name}</h3>
                  <h3 class="pokedex__ids">${pokemon.idText}</h3>
                </div>
                <div class="pokedex__body">
                  <div class="pokedex__text">
                    <div class="pokedex__label">Type</div>
                    <div class="pokedex__value">
                      ${htmltypes}
                    </div>
                  </div>
                  <div class="pokedex__text">
                    <div class="pokedex__label">Abilities</div>
                    <div class="pokedex__value">
                    ${htmlAbilities}
                  </div>
                  </div>
                </div>
              </div>

              <div class="pokedex__bg2" ></div>
            </div>
            <div class="pokedex__overlay">
              <a href="${view}pokemon/detail/?id=${pokemon.id}" class="btn pokedex__btn pokedex__view">
                <i class="fas fa-eye"></i> Viewmore
              </a>
              <button onclick="addBookmark(this,'pokemon')" data-id="${pokemon.id}" class="btn pokedex__btn pokedex__bookmark ${isLogin() ? '' : 'd-none'}">${
            isLogin() ? (getUserDataLogged().bookmark.pokedex.includes(Number(pokemon.id)) ? '<i class="fas fa-times"></i> Remove Bookmark' : '<i class="fas fa-bookmark"></i>  Bookmark') : ''
        }</button>
              <button onclick="getId(this)" data-id="${pokemon.id}"
                class="btn pokedex__btn pokedex__compare"
                data-bs-toggle="modal"
                data-bs-target="#compareModal"
              >
                <i class="fas fa-table"></i> Add compare
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
     `;
    });

    let container = document.querySelector(containerEl);

    if (type === 'search') {
        container.innerHTML += html;
    } else {
        container.innerHTML = html;
    }
}

let html = '';
let htmlSearch = document.querySelector('.archivePoke__list .row');
let result = document.querySelector('.archivePoke__action .result__title');

render(pokeApiUrl + `?name_like=${getAllUrlParams().name}&_limit=8`, '.archivePoke__list .row');

////////loadMore

let loadMore = document.getElementsByClassName('archivePoke__pagination text-center')[0];

loadMore.innerHTML = `<button class="btn archivePoke__more" onclick= "clickLoadMore()">
Load more Pokemon
</button>`;

let page = 1;
let sort = document.querySelector('#sortPoke');

function clickLoadMore() {
    let type = document.querySelector('.fillter__typeItem.active');

    if (type) {
        type = type.dataset.value;
    } else {
        type = '';
    }

    let ability = document.querySelector('.abilitySelect').value;

    if (ability === 'All') {
        ability = '';
    }

    ////////// height
    let height = document.querySelector('.fillter__height .active');

    if (height) {
        height = height.dataset.value;
    } else {
        height = '';
    }

    //////////weight
    let weight = document.querySelector('.fillter__weight .active');

    if (weight) {
        weight = weight.dataset.value;
    } else {
        weight = '';
    }

    page++;

    render(
        pokeApiUrl + `?name_like=${getAllUrlParams().name}&types_like=${type ? type : ''}&abilities_like=${ability.toLowerCase()}${height}${weight}&_page=${page}&_limit=8${sort.value}`,
        '.archivePoke__list .row',
        'search'
    );
}

let search = document.querySelector('.dropdownPokemonFillter__action');

let inputSearch = document.querySelector('.navigation__search');

inputSearch.value = getAllUrlParams().name;

let btnSearch = document.querySelector('.btnPokeFillterSearch');

btnSearch.onclick = () => {
    let type = document.querySelector('.fillter__typeItem.active');
    page = 1;

    if (type) {
        type = type.dataset.value;
    } else {
        type = '';
    }

    let ability = document.querySelector('.abilitySelect').value.toLowerCase().replaceAll(' ', '-');

    if (ability === 'all') {
        ability = '';
    }

    ////////// height
    let height = document.querySelector('.fillter__height .active');

    if (height) {
        height = height.dataset.value;
    } else {
        height = '';
    }

    //////////weight
    let weight = document.querySelector('.fillter__weight .active');

    if (weight) {
        weight = weight.dataset.value;
    } else {
        weight = '';
    }

    render(pokeApiUrl + `?name_like=${getAllUrlParams().name}&types_like=${type ? type : ''}&abilities_like=${ability.toLowerCase()}${height}${weight}&_limit=8`, '.archivePoke__list .row');

    dropDownFillter.hide();
};

sort.onchange = () => {
    let type = document.querySelector('.fillter__typeItem.active');
    page = 1;

    if (type) {
        type = type.dataset.value;
    } else {
        type = '';
    }

    let ability = document.querySelector('.abilitySelect').value;

    if (ability === 'All') {
        ability = '';
    }

    ////////// height
    let height = document.querySelector('.fillter__height .active');

    if (height) {
        height = height.dataset.value;
    } else {
        height = '';
    }

    //////////weight
    let weight = document.querySelector('.fillter__weight .active');

    if (weight) {
        weight = weight.dataset.value;
    } else {
        weight = '';
    }

    render(
        pokeApiUrl + `?name_like=${getAllUrlParams().name}&types_like=${type ? type : ''}&abilities_like=${ability.toLowerCase()}${height}${weight}&_limit=8${sort.value}`,
        '.archivePoke__list .row'
    );
};
