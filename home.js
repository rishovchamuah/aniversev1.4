if(localStorage.getItem("darkMode")==="true"){

document.body.classList.add("dark");

}
const loader =
document.getElementById("loader");
const trending = document.getElementById("trending");
const topAnime = document.getElementById("topAnime");
const randomAnime = document.getElementById("randomAnime");
const recentAnime = document.getElementById("recentAnime");
const continueWatching =
document.getElementById("continueWatching")
const watchlistCount =
document.getElementById("watchlistCount");

let heroAnime = null;

const searchBtn = document.getElementById("searchBtn");
const searchBox = document.getElementById("searchBox");

/* ---------- CARD ---------- */

function createCard(anime){

    const score = anime.score || "N/A";
    const episodes = anime.episodes || "?";
    const year = anime.year || "----";

    return `

<div class="card" onclick="openAnime(${anime.mal_id})">

<img
src="${anime.images.jpg.large_image_url}"
onload="this.classList.add('loaded')">

<div class="cardGradient"></div>

<div class="ratingBadge">

<i class="fa-solid fa-star"></i>

${score}

</div>

<div class="favoriteBtn ${
(JSON.parse(localStorage.getItem("favorites")) || [])
.includes(anime.mal_id)
? "active"
: ""
}"
onclick="toggleFavorite(event,this)">

<i class="fa-regular fa-heart"></i>

</div>

<div class="cardOverlay">

<div class="playButton">

<i class="fa-solid fa-play"></i>

</div>

</div>

<div class="cardContent">

<div class="cardTitle">

${anime.title}

</div>

<div class="cardInfo">

<span>

<i class="fa-solid fa-tv"></i>

${episodes}

</span>

<span>

<i class="fa-solid fa-calendar"></i>

${year}

</span>

</div>

</div>

</div>

`;

}
/* ---------- HERO ---------- */

async function loadHero(){

    const res = await fetch("https://api.jikan.moe/v4/random/anime");

    const json = await res.json();

    const anime = json.data;
    
    heroAnime = anime;

    heroTitle.textContent = anime.title;

    heroSynopsis.textContent =
    anime.synopsis
    ? anime.synopsis.substring(0,230)+"..."
    : "No synopsis available.";

    heroScore.innerHTML =
    `<i class="fa-solid fa-star"></i> ${anime.score || "N/A"}`;

    heroEpisodes.innerHTML =
    `<i class="fa-solid fa-tv"></i> ${anime.episodes || "?"} Episodes`;

    heroStatus.innerHTML =
    `<i class="fa-solid fa-circle-check"></i> ${anime.status}`;

    const bg =
    anime.images.jpg.large_image_url;

    document.querySelector(".background").style.backgroundImage =
`
linear-gradient(rgba(0,0,0,.65),rgba(0,0,0,.85)),
url(${bg})
`;

}

/* ---------- TRENDING ---------- */

async function loadTrending(){
    
    showSkeleton(trending);

    const res =
    await fetch("https://api.jikan.moe/v4/top/anime?filter=airing");

    const json = await res.json();

    trending.innerHTML =
    json.data
    .slice(0,12)
    .map(createCard)
    .join("");

}

/* ---------- TOP ---------- */

async function loadTop(){

showSkeleton(trending);

    const res =
    await fetch("https://api.jikan.moe/v4/top/anime");

    const json = await res.json();

    topAnime.innerHTML =
    json.data
    .slice(0,12)
    .map(createCard)
    .join("");

}

async function loadSeason(){
    
    showSkeleton(trending);

    const res =
    await fetch("https://api.jikan.moe/v4/seasons/now");

    const json =
    await res.json();

    seasonAnime.innerHTML =
    json.data
    .slice(0,12)
    .map(createCard)
    .join("");

}

/* ---------- RANDOM ---------- */

async function loadRandom(){
    
    showSkeleton(trending);

    const res =
    await fetch("https://api.jikan.moe/v4/random/anime");

    const json = await res.json();

    randomAnime.innerHTML =
    createCard(json.data);

}

/* ---------- SEARCH ---------- */

const searchResults =
document.getElementById("searchResults");

async function searchAnime(){

const query = searchBox.value.trim();

if(query.length<2){

searchResults.style.display="none";

return;

}

const res = await fetch(

`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=8`

);

const json = await res.json();

searchResults.innerHTML = json.data.map(anime=>`

<div class="searchItem">

<img src="${anime.images.jpg.image_url}">

<div>

<h4>${anime.title}</h4>

<p>

<i class="fa-solid fa-star"></i>

${anime.score || "N/A"}

</p>

</div>

</div>

`).join("");

searchResults.style.display="block";

}

/* ---------- EVENTS ---------- */

searchBox.addEventListener("input",searchAnime);

searchBtn.onclick=()=>{

searchResults.style.display="none";

searchAnime();

};

searchBox.addEventListener("keydown",e=>{

if(e.key==="Enter"){

searchAnime();

}

});

function loadRecentAnime(){
    
    showSkeleton(trending);

    const recent =
    JSON.parse(localStorage.getItem("recentAnime")) || [];

    if(!recent.length){

recentAnime.innerHTML = `

<div class="card">

<div class="cardContent">

<div class="cardTitle">

No Recently Viewed Anime

</div>

<div class="cardInfo">

Start watching anime and they'll appear here.

</div>

</div>

</div>

`;

        return;

    }

    recentAnime.innerHTML =
    recent.map(anime => `

        <div class="card" onclick="openAnime(${anime.id})">

            <img src="${anime.image}">

            <div class="cardGradient"></div>

            <div class="ratingBadge">

                <i class="fa-solid fa-star"></i>

                ${anime.score || "N/A"}

            </div>

            <div class="cardContent">

                <div class="cardTitle">

                    ${anime.title}

                </div>

            </div>

        </div>

    `).join("");

}

function loadContinueWatching(){
    
    showSkeleton(trending);

    const list =
    JSON.parse(
    localStorage.getItem("continueWatching")
    ) || [];

    if(!list.length){

        continueWatching.innerHTML = `
        <div class="card">
            <div class="cardContent">
                <div class="cardTitle">
                    Nothing to continue
                </div>
                <div class="cardInfo">
                    Open an anime and it'll appear here.
                </div>
            </div>
        </div>
        `;

        return;

    }

    continueWatching.innerHTML =
    list.map(anime => `

    <div class="card"
    onclick="openAnime(${anime.id})">

        <img src="${anime.image}">

        <div class="cardGradient"></div>

        <div class="ratingBadge">

            <i class="fa-solid fa-star"></i>

            ${anime.score || "N/A"}

        </div>

        <div class="cardContent">

            <div class="cardTitle">

                ${anime.title}

            </div>

        </div>

    </div>

    `).join("");

}

const genreButtons =
document.querySelectorAll(".genreBtn");

genreButtons.forEach(btn => {

    btn.onclick = async () => {

        genreButtons.forEach(b =>
            b.classList.remove("active")
        );

        btn.classList.add("active");

        const genre = btn.dataset.id;

        const res = await fetch(
            `https://api.jikan.moe/v4/anime?genres=${genre}&limit=12`
        );

        const json = await res.json();

        trending.innerHTML =
        json.data.map(createCard).join("");

        window.scrollTo({

            top: document.getElementById("trending").offsetTop - 120,

            behavior:"smooth"

        });

    };

});

function showSkeleton(container){

container.innerHTML="";

for(let i=0;i<8;i++){

container.innerHTML+=
`<div class="skeleton"></div>`;

}

}

/* ---------- LOAD ---------- */



loadHeroSlider();

loadTrending();

loadTop();

loadRandom();

loadSeason();

loadRecentAnime();

loadContinueWatching();

updateWatchlistCount();

window.addEventListener("load",()=>{

setTimeout(()=>{

loader.style.opacity="0";

setTimeout(()=>{

loader.style.display="none";

},600);

},1200);

});

document.querySelector(".infoBtn").onclick = () => {

    if(heroAnime){

        openAnime(heroAnime.mal_id);

    }

};

document.querySelector(".watchBtn").onclick = () => {

    if(!heroAnime?.trailer?.url){

        showToast("Trailer unavailable.","error");

        return;

    }

    window.open(heroAnime.trailer.url,"_blank");

};

function toggleFavorite(e, btn){

    e.stopPropagation();

    const card = btn.closest(".card");

    const id = Number(
        card.getAttribute("onclick").match(/\d+/)[0]
    );

    let favorites =
    JSON.parse(localStorage.getItem("favorites")) || [];

    const index =
    favorites.indexOf(id);

    if(index !== -1){

        favorites.splice(index,1);

        btn.classList.remove("active");

    }else{

        favorites.push(id);

        btn.classList.add("active");

    }

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

    btn.classList.remove("pop");

    void btn.offsetWidth;

    btn.classList.add("pop");

}

function updateWatchlistCount(){

    const watchlist =
    JSON.parse(localStorage.getItem("watchlist")) || [];

    if(watchlistCount){

        watchlistCount.textContent =
        watchlist.length;

    }

}

function openAnime(id){

window.location.href =
`anime.html?id=${id}`;

}