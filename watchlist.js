if(localStorage.getItem("darkMode")==="true"){

document.body.classList.add("dark");

}

const grid = document.getElementById("watchlistGrid");
const empty = document.getElementById("emptyState");
const count = document.getElementById("animeCount");
const clearBtn = document.getElementById("clearWatchlist");
const sortWatchlist =
document.getElementById("sortWatchlist");
const searchWatchlist =
document.getElementById("searchWatchlist");
const watchlistCount =
document.getElementById("watchlistCount");

let watchlist =
JSON.parse(localStorage.getItem("watchlist")) || [];

renderWatchlist();

function renderWatchlist(){

    grid.innerHTML = "";

    count.textContent =
    `${watchlist.length} Anime Saved`;
    
    if (watchlistCount) {

    watchlistCount.textContent =
    `${watchlist.length} Anime`;

}

    if(watchlist.length===0){

        empty.style.display="flex";
        grid.style.display="none";

        return;

    }

    empty.style.display="none";
    grid.style.display="grid";

    watchlist.forEach(anime=>{

        grid.innerHTML += `

<div class="watchCard">

<img src="${anime.image}">

<div class="watchInfo">

<h3>${anime.title}</h3>

<p>

<i class="fa-solid fa-star"></i>

${anime.score}

</p>

</div>

<div class="watchActions">

<button
onclick="openAnime(${anime.id})">

<i class="fa-solid fa-eye"></i>

</button>

<button
onclick="removeAnime(${anime.id})">

<i class="fa-solid fa-trash"></i>

</button>

</div>

</div>

`;

    });

}

function removeAnime(id){

    if(!confirm("Remove this anime from your watchlist?")){

        return;

    }

    watchlist =
    watchlist.filter(a=>a.id!==id);

    save();
    
    showToast("Anime removed from Watchlist");

}

function save(){

    localStorage.setItem(

        "watchlist",

        JSON.stringify(watchlist)

    );

    renderWatchlist();

}

clearBtn.onclick=()=>{

    if(confirm("Clear your watchlist?")){

        watchlist=[];

        save();
        
        showToast("Watchlist cleared");

    }

}

sortWatchlist.onchange = () => {

    if(sortWatchlist.value === "title"){

        watchlist.sort((a,b)=>
            a.title.localeCompare(b.title)
        );

    }

    else if(sortWatchlist.value === "score"){

        watchlist.sort((a,b)=>
            (b.score||0)-(a.score||0)
        );

    }

    renderWatchlist();

};

searchWatchlist.oninput = () => {

    const query =
    searchWatchlist.value
    .toLowerCase();

    const cards =
    document.querySelectorAll(".watchCard");

    cards.forEach(card => {

        const title =
        card.querySelector("h3")
        .textContent
        .toLowerCase();

        card.style.display =
        title.includes(query)
        ? ""
        : "none";

    });

};

const toast =
document.getElementById("toast");

function showToast(message){

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },2000);

}

function openAnime(id){

    location.href=
    `anime.html?id=${id}`;

}