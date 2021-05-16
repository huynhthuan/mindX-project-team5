async function getCard(id) {
    let imgLogoValue = document.querySelector('#imgLogo');
    let imgCardValue = document.querySelector('#imgCard');
    let flavorTextValue = document.querySelector('#flavorText');

    let cardNameValue = document.querySelector('#cardName');
    let supertypeValue = document.querySelector('#supertype');
    let subtypeValue = document.querySelector('#subtype');
    let hpValue = document.querySelector('#hp');

    let lastUpdateValue = document.querySelector('#lastUpdate');
    let priceContainer = document.querySelector('.tabletcg__row--price');
    let buyCardBtn = document.querySelector('#buyCard');

    let abilitiesContainer = document.querySelector('.tabletcg__row--abilities');

    let attacksContainer = document.querySelector('#attacksContent');

    let rulesContainer = document.querySelector('#rulesContent');

    let artistValue = document.querySelector('#artist');
    let rarityValue = document.querySelector('#rarity');
    let setValue = document.querySelector('#set-name');
    let setIconValue = document.querySelector('#set-icon');

    let weakContainer = document.querySelector('.tabletcg__row--weak');
    let reatreatContainer = document.querySelector('.tabletcg__row--retreat');
    let resitanceContainer = document.querySelector('.tabletcg__row--resitance');

    let response = await fetch(pokeCardApiUrl + id);
    let data = await response.json();

    //imgCard, imgLogo, flavorText
    imgLogoValue.src = data.set.images.logo;
    imgCardValue.src = data.images.large;

    if (data.flavor) {
        flavorTextValue.innerHTML = data.flavorText;
    } else {
        flavorTextValue.style.display = 'none';
    }

    //nameCard & supertype & subtype
    cardNameValue.innerHTML = data.name;
    supertypeValue.innerHTML = data.supertype;
    subtypeValue.innerHTML = data.subtypes && data.subtypes.length > 0 ? data.subtypes.join(', ') : '';

    //hp
    hpValue.innerHTML = `HP ${data.hp}`;

    //lastUpdate
    lastUpdateValue.innerHTML = `Last Updated: ${data.set.updatedAt}`;

    //price & btn
    let prices = data.tcgplayer.prices;

    let htmlPrice = Object.keys(prices)
        .map((price) => {
            return `
        <div class="tabletcg__priceitem">
            <div class="priceitem__label">
                ${price} MARKET
            </div>
            <div class="priceitem__value priceitem__value--market" id="market">
                $${prices[price].market}
            </div>
        </div>
        <div class="tabletcg__priceitem">
            <div class="priceitem__label">
                ${price} LOW
            </div>
            <div class="priceitem__value priceitem__value--low" id="low">
                $${prices[price].low}
            </div>
        </div>
        <div class="tabletcg__priceitem">
            <div class="priceitem__label">
                ${price} MID
            </div>
            <div class="priceitem__value priceitem__value--mid" id="mid">
                $${prices[price].mid}
            </div>
        </div>
        <div class="tabletcg__priceitem">
            <div class="priceitem__label">
                ${price} HIGH
            </div>
            <div class="priceitem__value priceitem__value--high" id="high">
                $${prices[price].high}
            </div>
        </div>
        `;
        })
        .join('');

    priceContainer.innerHTML = htmlPrice;
    buyCardBtn.href = data.tcgplayer.url;

    //abilities
    if (data.abilities && data.abilities.length > 0) {
        let htmlAbilities = data.abilities
            .map((abilitie) => {
                return `
            <div class="tcgabili__item">
                <img src="${domain}img/card-icon/${abilitie.type.toLowerCase()}.png" alt="abili">
                <span id="nameAbilities">${abilitie.name}</span>
            </div>
            <div class="tcgabili__value" id="textAbilities">
                ${abilitie.text}
            </div>
            `;
            })
            .join('');

        abilitiesContainer.querySelector('.tcginfo__content').innerHTML = htmlAbilities;
    } else {
        abilitiesContainer.style.display = 'none';
    }

    //attacks
    if (data.attacks && data.attacks.length > 0) {
        let htmlAtks = data.attacks
            .map((atk) => {
                return `
                <div class="tcgatk__item">
                    <span class="atk__list">
                        ${atk.cost
                            .map((cost) => {
                                return `
                            <img src="${domain}img/card-icon/${cost.toLowerCase()}.png" alt="atk">
                            `;
                            })
                            .join('')}
                    </span>
                    <span id="nameAttacks">${atk.name}</span>
                </div>
                <div class="tcgatk__value" id="textAttacks">
                    ${atk.text}
                </div>
           `;
            })
            .join('');

        attacksContainer.querySelector('.tcginfo__content').innerHTML = htmlAtks;
    } else {
        attacksContainer.style.display = 'none';
    }

    //rules
    if (data.rules && data.rules.length > 0) {
        let htmlRule = data.rules
            .map((rule) => {
                return `
            <div class="tcgrule__value">
                ${rule}
            </div>
            `;
            })
            .join('');

        rulesContainer.querySelector('.tcginfo__content').innerHTML = htmlRule;
    } else {
        rulesContainer.style.display = 'none';
    }

    //Weak
    if (data.weaknesses && data.weaknesses.length > 0) {
        let htmlWeak = data.weaknesses
            .map((weakness) => {
                return `
            <div class="weakItem">
                <img src="${domain}img/card-icon/${weakness.type.toLowerCase()}.png" alt="meta">
                <span class="weak__value">${weakness.value}</span>
            </div>
            `;
            })
            .join('');
        weakContainer.querySelector('.meta__content').innerHTML = htmlWeak;
    } else {
        weakContainer.querySelector('.meta__content').innerHTML = '<div class="weakItem">N/A</div>';
    }

    //Retreatcost
    if (data.retreatCost && data.retreatCost.length > 0) {
        let htmlRetreat = data.retreatCost
            .map((retreat) => {
                return `
                <img src="${domain}img/card-icon/${retreat.toLowerCase()}.png" alt="meta">
            `;
            })
            .join('');
        reatreatContainer.querySelector('.meta__content').innerHTML = htmlRetreat;
    } else {
        reatreatContainer.querySelector('.meta__content').innerHTML = '<span>N/A</span>';
    }

    //Resitance
    if (data.resistances && data.resistances.length > 0) {
        let htmlResistance = data.resistances
            .map((resistance) => {
                return `
                <div class="weakItem">
                    <img src="${domain}img/card-icon/${resistance.type.toLowerCase()}.png" alt="meta">
                    <span class="weak__value">${resistance.value}</span>
                </div>
            `;
            })
            .join('');
        resitanceContainer.querySelector('.meta__content').innerHTML = htmlResistance;
    } else {
        resitanceContainer.querySelector('.meta__content').innerHTML = '<span>N/A</span>';
    }

    //artist, rarity, set
    artistValue.innerHTML = data.artist;
    rarityValue.innerHTML = data.rarity;
    setValue.innerHTML = data.set.name;
    setIconValue.src = data.set.images.symbol;
}

getCard(getAllUrlParams().id);

async function getPokeSlide() {
    let container = document.querySelector('.random__list');

    let data = await getPokemonCardsById(getRandomCardId());

    let html = data
        .map((card) => {
            return `
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
            }</button>
            </div>
        </div>
        `;
        })
        .join('');

    container.innerHTML = html;
}

getPokeSlide().then(() => {
    $('.owl-carousel-poke').owlCarousel({
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
