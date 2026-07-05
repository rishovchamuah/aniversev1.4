if(localStorage.getItem("darkMode")==="true"){

document.body.classList.add("dark");

}

const grid = document.getElementById("favoriteGrid");
const empty = document.getElementById("emptyState");
const count = document.getElementById("favoriteCount");
const search = document.getElementById("searchFavorites");

let favorites =
JSON.parse(localStorage.getItem("favorites")) || [];

loadFavorites();

async function loadFavorites(){

    if(!favorites.length){

        empty.style.display="flex";
        grid.style.display="none";

        count.textContent="0 Anime";

        return;

    }

    empty.style.display="none";
    grid.style.display="grid";

    count.textContent =
    `${favorites.length} Anime`;

    grid.innerHTML="";

    for(const id of favorites){

        try{

            const res =
            await fetch(
            `https://api.jikan.moe/v4/anime/${id}`
            );

            const json =
            await res.json();

            const anime =
            json.data;

            grid.innerHTML += `

<div class="card"
onclick="openAnime(${anime.mal_id})">

<img src="${anime.images.jpg.large_image_url}">

<div class="favoriteRemove"
onclick="removeFavorite(event,${anime.mal_id})">

<i class="fa-solid fa-heart-crack"></i>

</div>

<h3>${anime.title}</h3>

<p>

<i class="fa-solid fa-star"></i>

${anime.score || "N/A"}

</p>

</div>

`;

        }catch(e){

            console.log(e);

        }

    }

}

search.oninput = ()=>{

    const q =
    search.value.toLowerCase();

    document
    .querySelectorAll(".card")
    .forEach(card=>{

        card.style.display =
        card.textContent
        .toLowerCase()
        .includes(q)
        ? ""
        : "none";

    });

};

function removeFavorite(e,id){

    e.stopPropagation();

    let favorites =
    JSON.parse(localStorage.getItem("favorites")) || [];

    favorites =
    favorites.filter(x => x !== id);

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

    loadFavorites();

}

function openAnime(id){

    location.href =
    `anime.html?id=${id}`;

}