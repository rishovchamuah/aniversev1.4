const title =
document.getElementById("pageTitle");

const grid =
document.getElementById("animeGrid");

const loading =
document.getElementById("loading");

const params =
new URLSearchParams(location.search);

const type =
params.get("type") || "trending";

let page = 1;
let loadingNow = false;

loadAnime();

window.addEventListener(
"scroll",
()=>{

if(
window.innerHeight+
window.scrollY>=
document.body.offsetHeight-400
){

loadAnime();

}

}
);

async function loadAnime(){

if(loadingNow) return;

loadingNow = true;

loading.style.display="block";

let url="";

switch(type){

case "top":

title.textContent="Top Rated";

url=
`https://api.jikan.moe/v4/top/anime?page=${page}`;

break;

case "season":

title.textContent="New This Season";

url=
`https://api.jikan.moe/v4/seasons/now?page=${page}`;

break;

case "random":

title.textContent="Random Anime";

url=
`https://api.jikan.moe/v4/random/anime`;

break;

default:

title.textContent="Trending";

url=
`https://api.jikan.moe/v4/top/anime?filter=bypopularity&page=${page}`;

}

try{

const res =
await fetch(url);

const json =
await res.json();

const list =
type==="random"
? [json.data]
: json.data;

list.forEach(anime=>{

grid.innerHTML += `

<div class="card"
onclick="location.href='anime.html?id=${anime.mal_id}'">

<img
src="${anime.images.jpg.large_image_url}">

<h3>${anime.title}</h3>

<p>

<i class="fa-solid fa-star"></i>

${anime.score || "N/A"}

</p>

</div>

`;

});

page++;

}finally{

loading.style.display="none";

loadingNow = false

}

}