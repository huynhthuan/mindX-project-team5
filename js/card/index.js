async function getAllCard() {
    let html = '';
    let response = await fetch(pokeCardApiUrl + '?_limit=8');
    let data = await response.json();

    for (item of data) {
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
    let archiveCard = document.querySelector(
        '.archivePoke .archiveCard__list .row'
    );
    archiveCard.innerHTML = html;
}
getAllCard();

let page = 1;
let btn = document.querySelector(
    '.archivePoke .text-center .archivePoke__more'
);

btn.addEventListener('click', async function () {
    let htmlNew = '';
    page++;
    let response = await fetch(pokeCardApiUrl + '?_page=' + page + '&_limit=8');
    let data = await response.json();
    if (data.length > 0) {
        for (item of data) {
            htmlNew += `
            <div class="col-md-3">
                <div class="poketcg__item">
                    <div class="poketcg__img">
                        <img src="${item.images.large}" alt="tcg">
                    </div>
                    <div class="poketcg_title">
                        ${item.name}
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
        btn.style.display = 'none';
    }
    let archiveCard = document.querySelector(
        '.archivePoke .archiveCard__list .row'
    );
    archiveCard.innerHTML += htmlNew;
});
