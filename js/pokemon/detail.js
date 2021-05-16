let idpoke = getAllUrlParams().id;

let html = '';
let htmlForm = '';
let htmlSlide = '';
let slidePoke = document.querySelector('.random__list .owl-stage-outer .owl-carousel');

let htmlDetail = document.querySelector('.single__pokeinfo .row');
/////////////// pokemon Nav
let modalCompare = new bootstrap.Modal(document.querySelector('#compareModal'), {
    keyboard: false,
});

function showCompareTableDetail() {
    modalCompare.show();
}

//Get name pokemon by id
async function renderName(idpoke) {
    let response = await fetch(pokeApiUrl + `?id=${idpoke}`);
    let data = await response.json();
    let pokemon = data[0];

    if (!pokemon.img) {
        pokemon.img = defaultUrlImgPoke;
    }
    return [pokemon.name, pokemon.img, pokemon.id];
}

async function pushdata() {
    let response = await fetch(pokeApiUrl + `?id=${idpoke}`);
    let data = await response.json();
    let pokemon = data[0];

    ////////// form pokemon
    for (index in pokemon.form) {
        let nameForm = await renderName(pokemon.form[index]);

        if (index == 3) {
            break;
        }

        let imgForm = nameForm[1];

        htmlForm += `<div class="form__item">
                    <a href="${view}pokemon/detail/?id=${nameForm[2]}" class="form__bg">
                    <div class="form__img">
                    <img src=${imgForm} alt="" />
                    </div>
                    </a>
                    <div class="form__name">${nameForm[0]}</div>
                    </div>`;
    }

    ////////////pokemon detail
    let imgDetail = await renderName(pokemon.id);

    html = `<div class="col-md-6 col-lg-3 order-2 order-lg-1">
                <div class="single__table single__table--stats">
                <div class="table__title">STATS</div>
                <div class="table__content">
                    <div class="poke__quote">
                    ${pokemon.quote}
                    </div>

                    <div class="poke__stats">
                    <div class="stat__item">
                        <div class="stat__label">HP</div>
                        <div class="stat__value">
                        
                        <div class="stat__percent" style= "width: ${(pokemon.hp * 100) / 255}%"></div>
                        <div class="stat__number"> ${pokemon.hp}</div>
                    </div>
                    </div>
                    <div class="stat__item">
                        <div class="stat__label">Attack</div>
                        <div class="stat__value">
                        <div class="stat__percent" style= "width: ${(pokemon.attack * 100) / 190}%"></div>
                        <div class="stat__number">${pokemon.attack}</div>
                        </div>
                    </div>
                    <div class="stat__item">
                        <div class="stat__label">Defense</div>
                        <div class="stat__value">
                        
                        <div class="stat__percent" style= "width: ${(pokemon.defense * 100) / 250}%"></div>
                        <div class="stat__number">${pokemon.defense}</div>
                        </div>
                    </div>
                    <div class="stat__item">
                        <div class="stat__label">Special Attack</div>
                        <div class="stat__value">
                        <div class="stat__percent" style= "width: ${(pokemon['special-attack'] * 100) / 194}%"></div>
                        <div class="stat__number">${pokemon['special-attack']}</div>
                        </div>
                    </div>
                    <div class="stat__item">
                        <div class="stat__label">Special Defense</div>
                        <div class="stat__value">
                        <div class="stat__percent" style= "width: ${(pokemon['special-defense'] * 100) / 250}%"></div>
                        <div class="stat__number">${pokemon['special-defense']}</div>
                        </div>
                    </div>
                    <div class="stat__item">
                        <div class="stat__label">Speed</div>
                        <div class="stat__value">
                        <div class="stat__percent" style= "width: ${(pokemon.speed * 100) / 200}%"></div>
                        <div class="stat__number">${pokemon.speed}</div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            <div
                class="order-1 order-lg-2 col-md-10 mx-auto col-lg-6 d-flex align-items-center justify-content-center"
            >
                <div class="poke__ava">
                <div class="poke__border">
                    <div class="poke__img" id="scene">
                    <img
                        src=${imgDetail[1]}
                        alt="pkm"
                        data-depth="0.9"
                    />
                    </div>
                </div>
                <div class="poke__mainname" style= "text-transform: capitalize">${pokemon.name}  ${pokemon.idText}</div>
                <div class="poke__bganimation">
                    <img
                    src="../../../img/pokemon_bg_animation.png"
                    alt="bg-animation"
                    />
                </div>
                </div>
            </div>
            <div class="col-md-6 col-lg-3 order-3">
                <div class="single__table single__table--form">
                <div class="table__title">FORM</div>
                <div class="table__content">
                    <div class="poke__mainform">
                        ${htmlForm}
                    </div>
                </div>
                </div>
            </div>`;

    htmlDetail.innerHTML = html;

    //////Evolutions

    let htmlEvolutions = '';
    let evolutions = document.querySelector('.poke__infomain .row');

    /////// tạo HTML type
    let htmltypes = ``;
    let typesPika = pokemon.types;

    for (let i in typesPika) {
        htmltypes += `<div class= "type__item type--${typesPika[i]}" style= "text-transform: capitalize"
       >${typesPika[i]}</div>`;
    }

    /////// tạo HTML Weaknesses
    let htmlWeaknesses = ``;
    let weaknessesPika = pokemon.weaknesses;
    let weaknessesAll = [];
    for (let i in weaknessesPika) {
        weaknessesAll = [...weaknessesAll, ...weaknessesPika[i].weakness];
    }
    arrNew = weaknessesAll.sort();
    for (let i in arrNew) {
        if (arrNew[i] == arrNew[i + 1]) {
            arrNew.splice(arrNew[i + 1], 1);
        }
    }
    for (value of weaknessesAll) {
        htmlWeaknesses += `<span class= "weaknesses__item type--${value}" style= "text-transform: capitalize"
        >${value}</span
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
    //////////evution__path
    let evutionPath = document.querySelector('.evution__path');

    htmlEvutionPath = '';

    for (let i = 0; i < pokemon.evolutions.length; i++) {
        let evolutionsPath = await renderName(pokemon.evolutions[i]);
        htmlEvutionPath += `
                            <div class="evution__item">
                            <a href="${view}pokemon/detail/?id=${evolutionsPath[2]}">
                                <div class="evution__ava">
                                <img src=${evolutionsPath[1]} alt="epkm" />
                                </div>
                                <div class="evution__name"  style= "text-transform: capitalize">${evolutionsPath[0]}</div>
                            </a>
                            </div>
                            `;

        if (pokemon.evolutions[i + 1]) {
            htmlEvutionPath += `
                                <div class="evution__line">
                                <img
                                src="../../../img/arrow_down.png"
                                alt="eline"
                                />
                            </div>
                                `;
        }
    }

    ///////////// Male
    let pokemonMale = '';

    if (pokemon[`male_percentage`] > 50) {
        pokemonMale = 'Male';
    } else if (pokemon[`male_percentage`] == 50) {
        pokemonMale = 'Male/ Female';
    } else {
        pokemonMale = 'Female';
    }

    ////////////eggGroups
    let htmleggGroups = ``;
    let arreggGroups = [];
    let eggGroupsPika = pokemon.eggGroups;
    for (let i in eggGroupsPika) {
        arreggGroups = [...arreggGroups, eggGroupsPika[i]];
    }
    htmleggGroups = arreggGroups.join('/ ');

    htmlEvolutions = `
        <div class="col-md-6">
        <div class="poke__evution">
        <div class="infomain__title">Evolutions</div>
        <div class="infomain__content">
            <div class="evution__path">
            ${htmlEvutionPath}
            </div>
        </div>
        </div>
        </div>
        <div class="col-md-6">
        <div class="row">
        <div class="col-12">
            <div class="information__type">
            <div class="infomain__title">Type</div>
            <div class="type__list">
            ${htmltypes}
            </div>
            </div>
        </div>
        <div class="col-12">
            <div class="information__weak">
            <div class="infomain__title">Weaknesses</div>
            <div class="weaknesses__list">
                ${htmlWeaknesses}
            </div>
            </div>
        </div>
        <div class="col-12">
        <div class="information__abilities">
            <div class="infomain__title">
                Abilities
            </div>
            <div class="abilities__list">
                ${htmlAbilities}
            </div>
            </div>
        </div>
        <div class="col-12">
        <div class="infomain__listbox">
            <div class="infomain__box">
            <div class="infomain__title">Color</div>
            <div class="infomain__value"  style= "text-transform: capitalize">${pokemon.color}</div>
            </div>
            <div class="infomain__box">
            <div class="infomain__title">Weight</div>
            <div class="infomain__value">${pokemon.weight}</div>
            </div>
            <div class="infomain__box">
            <div class="infomain__title">Height</div>
            <div class="infomain__value">${pokemon.height}</div>
            </div>
            <div class="infomain__box">
            <div class="infomain__title">Gender</div>
            <div class="infomain__value"  style= "text-transform: capitalize">${pokemonMale}</div>
            </div>
            <div class="infomain__box">
            <div class="infomain__title">Egg Group</div>
            <div class="infomain__value"  style= "text-transform: capitalize">${htmleggGroups}</div>
            </div>
            <div class="infomain__box">
            <div class="infomain__title">
                Base Experience
            </div>
            <div class="infomain__value">${pokemon.base_experience}</div>
            </div>
        </div>
        </div>
        </div>
        </div>`;
    evolutions.innerHTML = htmlEvolutions;

    let btnQuick = document.querySelector('.quickaction__wrap');

    let title = document.querySelector('title');
    title.innerHTML = capitalizeTheFirstLetterOfEachWord(pokemon.name) + ' - Pokedex';

    btnQuick.innerHTML = `<button onclick="addBookmark(this,'pokemon', false, true)" data-id="${pokemon.id}" title="Add bookmark" class="btn quickaction__btn quickaction__btn--bookmark"
                  id="addBookmark">
                  ${
                      isLogin()
                          ? getUserDataLogged().bookmark.pokedex.includes(Number(pokemon.id))
                              ? '<i class="fas fa-times"></i>'
                              : '<i class="fas fa-bookmark"></i>'
                          : '<i class="fas fa-bookmark"></i>'
                  }
              </button>
              <button title="Add compare" onclick="getId(this);showCompareTableDetail()" data-id="${pokemon.id}" class="btn quickaction__btn quickaction__btn--compare" id="addCompareDetail">
                  <i class="fas fa-table"></i>
              </button>`;
}

pushdata().then((data) => {
    let scene = document.querySelector('#scene');
    let parallaxInstance = new Parallax(scene);
});

async function pushdataDetail() {
    let response = await fetch(pokeApiUrl);
    let data = await response.json();
    let slidePoke = document.querySelector('.random__list');

    /// Tạo 8 số ramdom
    let arrRamdom = [];
    while (arrRamdom.length < 8) {
        let ramdom = Math.floor(Math.random() * 1118) + 1;
        if (arrRamdom.indexOf(ramdom) === -1) arrRamdom.push(ramdom);
    }

    for (value of arrRamdom) {
        /////// tạo HTML type
        let htmltypes = ``;
        let typesPika = data[value].types;
        for (let i in typesPika) {
            htmltypes += `<span class= "pokedex__type type--${typesPika[i]}" style= "text-transform: capitalize"
      >${typesPika[i]}</span
    >`;
        }

        ////// tạo HTML Ablilities
        let htmlAbilities = ``;
        let arrAbilities = [];
        let abilitiesPika = data[value].abilities;
        for (let i in abilitiesPika) {
            arrAbilities = [...arrAbilities, abilitiesPika[i]];
        }

        htmlAbilities = arrAbilities.join('/ ');

        ////// thay ảnh NULL
        let imgPoke = data[value].img;

        if (imgPoke === null) {
            imgPoke = defaultUrlImgPoke;
        }

        /////////pokemon slide
        htmlSlide += `
          <div class="pokedex__item">
            <img
              src="${homeUrl}img/pokedex-bg.png"
              alt="pokedex__bg"
              class="pokedex__bg"
            />
            <div class="pokedex__content">
              <div class="pokedex__id">${data[value].idText}</div> 
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
                              src="${homeUrl}img/stat_hp.png"
                              alt="hp"
                              class="stat__icon"
                            />
                          <span>${data[value].hp}</span>
                        </div>
                        <div class="stat__value">
                          <div class="stat__percent" style= "width: ${(data[value].hp * 100) / 255}%"></div>
                        </div>
                      </div>
                      <div class="stat__item">
                      <div class="stat__label">
                        <img
                          src="${homeUrl}img/stat_atk.png"
                          alt="atk"
                          class="stat__icon"
                        />
                        <span>${data[value].attack}</span>
                        </div>
                        <div class="stat__value">
                          <div class="stat__percent" style= "width: ${(data[value].attack * 100) / 190}%"></div>
                        </div>
                      </div>
                      <div class="stat__item">
                      <div class="stat__label">
                        <img
                          src="${homeUrl}img/stat_def.png"
                          alt="def"
                          class="stat__icon"
                        />
                        <span>${data[value].defense}</span>
                        </div>
                        <div class="stat__value">
                          <div class="stat__percent" style= "width: ${(data[value].defense * 100) / 250}%"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="pokedex__meta">
                  <div class="pokedex__header">
                    <h3 class="pokedex__name">${data[value].name}</h3>
                    <h3 class="pokedex__ids">${data[value].idText}</h3>
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
                <a href="${view}pokemon/detail/?id=${data[value].id}" class="btn pokedex__btn pokedex__view">
                  <i class="fas fa-eye"></i> Viewmore
                </a>
                <button onclick="addBookmark(this,'pokemon')" data-id="${data[value].id}" class="btn pokedex__btn pokedex__bookmark ${isLogin() ? '' : 'd-none'}">${
            isLogin() ? (getUserDataLogged().bookmark.pokedex.includes(Number(data[value].id)) ? '<i class="fas fa-times"></i> Remove Bookmark' : '<i class="fas fa-bookmark"></i>  Bookmark') : ''
        }
                </button>
                <button onclick="getId(this)" data-id="${data[value].id}"
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
  `;
    }

    slidePoke.innerHTML = htmlSlide;
}

pushdataDetail().then(() => {
    $('.owl-carousel-poke').owlCarousel({
        items: 4,
        loop: true,
        dots: false,
        nav: true,
        autoplay: false,
        margin: 24,
        responsive: {
            0: {
                items: 1,
            },
            1024: {
                items: 4,
            },
        },
    });
});

async function pushdataFirt() {
    let response = await fetch(pokeApiUrl);
    let data = await response.json();
    let arrId = data.map((value) => {
        return value.id;
    });
    idpoke = +idpoke;

    let idIndex = arrId.indexOf(idpoke);
    let pokeLeftName = idIndex == 0 ? data[1117].name : data[idIndex - 1].name;

    let pokeRightName = idIndex == 1117 ? data[0].name : data[idIndex + 1].name;
    let pokeLeftImg = idIndex == 0 ? data[1117].img : data[idIndex - 1].img;
    let pokeRightImg = idIndex == 1117 ? data[0].img : data[idIndex + 1].img;
    let idLeft = idIndex == 0 ? data[1117].id : data[idIndex - 1].id;
    let idRight = idIndex == 1117 ? data[0].id : data[idIndex + 1].id;
    let pokeNav = document.querySelector('.single__pokenav');
    let htmlPokeNav = '';

    htmlPokeNav = `
  <a href="${view}pokemon/detail/?id=${idLeft}" class="pokenav__btn pokenav__prev">
              <div class="pokenav__icon">
                <i class="fas fa-angle-left"></i>
              </div>
              <div class="pokenav__ava">
                <img src=${pokeLeftImg ? pokeLeftImg : domain + 'img/pokedex-bg.png'} alt="img" />
              </div>
              <div class="pokenav__name" style = "text-transform: capitalize">${pokeLeftName}</div>
            </a>
            <a href="${view}pokemon/detail/?id=${idRight}" class="pokenav__btn pokenav__next">
              <div class="pokenav__icon">
                <i class="fas fa-angle-right"></i>
              </div>
              <div class="pokenav__ava">
                <img src=${pokeRightImg ? pokeRightImg : domain + 'img/pokedex-bg.png'} alt="img" />
              </div>
              <div class="pokenav__name" style = "text-transform: capitalize">${pokeRightName}</div>
            </a>
  `;
    pokeNav.innerHTML = htmlPokeNav;
}

pushdataFirt();
