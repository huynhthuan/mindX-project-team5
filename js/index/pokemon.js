/// Tạo 8 số ramdom
let arrRamdom = [];
while (arrRamdom.length < 8) {
    let ramdom = Math.floor(Math.random() * 1000) + 1;
    if (arrRamdom.indexOf(ramdom) === -1) arrRamdom.push(ramdom);
}

/////////
let idPoke = document.querySelector('.block__pokedex .block__content .row');

let html = '';

async function pushdata() {
    let response = await fetch(pokeApiUrl);
    let data = await response.json();

    let maxHP = data.map((poke) => {
        return poke.hp;
    });

    /////// maxHp,maxAttack,maxDefense
    let arrHp = [];
    let arrAttack = [];
    let arrDefense = [];

    for (let i in data) {
        let hp = data[i].hp;
        let attack = data[i].attack;
        let defense = data[i].defense;
        arrHp = [...arrHp, hp];
        arrAttack = [...arrAttack, attack];
        arrDefense = [...arrDefense, defense];
    }

    let maxHp = Math.max(...arrHp);
    let maxAttack = Math.max(...arrAttack);
    let maxDefense = Math.max(...arrDefense);

    ////////////max height
    let height = data.map((value) => {
        return value.height;
    });
    maxHeight = Math.max(...height);
    let weight = data.map((value) => {
        return value.weight;
    });
    maxWeight = Math.max(...weight);

    ///////////// max special-attack special-defense speed  form
    let specialAttack = data.map((value) => {
        return value['special-attack'];
    });

    maxAttackS = Math.max(...specialAttack);
    let specialDefense = data.map((value) => {
        return value['special-defense'];
    });

    maxDefenseS = Math.max(...specialDefense);
    let speed = data.map((value) => {
        return value.speed;
    });

    maxSpeed = Math.max(...speed);
    let form = data.map((value) => {
        return value.form.length;
    });

    maxForm = Math.max(...form);

    /////////

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
        html += `
                <div class="col-md-6 col-lg-3">
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
                                  <div class="stat__percent" style= "width: ${(data[value].hp * 100) / maxHp}%"></div>
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
                                  <div class="stat__percent" style= "width: ${(data[value].attack * 100) / maxAttack}%"></div>
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
                                  <div class="stat__percent" style= "width: ${(data[value].defense * 100) / maxDefense}%"></div>
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
              </div>
          `;
    }

    idPoke.innerHTML = html;

    return {
        maxHp: maxHp,
        maxAttack: maxAttack,
        maxDefense: maxDefense,
    };
}

pushdata();
