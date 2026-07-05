if(localStorage.getItem("darkMode")==="true"){

document.body.classList.add("dark");

}

const params = new URLSearchParams(window.location.search);
const animeId = params.get("id");

const API = "https://api.jikan.moe/v4";
const loader = document.getElementById("loader");

let anime = null;
let characters = [];
let recommendations = [];
let episodes = [];
let pictures = [];
let themes = null;

/* ---------- Helpers ---------- */

const $ = (id) => document.getElementById(id);

function formatNumber(num) {
    if (!num) return "--";
    return num.toLocaleString();
}

function showLoading() {
    const loader = $("loadingScreen");
    if (loader) loader.style.display = "flex";
}

function hideLoading() {
    const loader = $("loadingScreen");
    if (loader) loader.style.display = "none";
}

function showError(message) {
    const container = document.querySelector(".container");

    if (container) {
        container.innerHTML = `
            <div class="errorBox">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <h2>Something went wrong</h2>
                <p>${message}</p>

                <button onclick="location.reload()">
                    Try Again
                </button>
            </div>
        `;
    }
}

/* ---------- Fetch ---------- */

async function fetchJSON(url) {

    const res = await fetch(url);

    if (!res.ok) {
        throw new Error("Unable to load anime.");
    }

    return await res.json();
}

/* ---------- Main ---------- */

async function loadAnime() {
    
if (loader) {

    loader.style.display = "flex";

}

    if (!animeId) {
        window.location.href = "index.html";
        return;
    }

    showLoading();

    try {

        const [
            animeRes,
            characterRes,
            recommendationRes,
            episodeRes,
            pictureRes,
            themeRes
        ] = await Promise.all([

            fetchJSON(`${API}/anime/${animeId}/full`),

            fetchJSON(`${API}/anime/${animeId}/characters`),

            fetchJSON(`${API}/anime/${animeId}/recommendations`),

            fetchJSON(`${API}/anime/${animeId}/episodes`),

            fetchJSON(`${API}/anime/${animeId}/pictures`),

            fetchJSON(`${API}/anime/${animeId}/themes`)

        ]);

        anime = animeRes.data;
        characters = characterRes.data;
        recommendations = recommendationRes.data;
        episodes = episodeRes.data;
        pictures = pictureRes.data;
        themes = themeRes.data;
        
        saveRecentlyViewed(anime);
        saveContinueWatching(anime);
        
                /* ---------- Background ---------- */

        document.querySelector(".background").style.backgroundImage =
            `url(${anime.images.jpg.large_image_url})`;

        /* ---------- Poster ---------- */

        $("poster").src =
            anime.images.jpg.large_image_url;

        /* ---------- Basic Info ---------- */

        $("title").textContent =
            anime.title;

        if ($("japaneseTitle"))
            $("japaneseTitle").textContent =
                anime.title_japanese || "-";

        if ($("englishTitle"))
            $("englishTitle").textContent =
                anime.title_english || anime.title;


        /* ---------- Meta ---------- */

        $("score").innerHTML =
            `<i class="fa-solid fa-star"></i> ${anime.score || "N/A"}`;

        $("episodes").innerHTML =
            `<i class="fa-solid fa-tv"></i> ${anime.episodes || "?"} Episodes`;

        $("status").innerHTML =
            `<i class="fa-solid fa-circle-check"></i> ${anime.status}`;

        $("year").innerHTML =
            `<i class="fa-solid fa-calendar"></i> ${anime.year || "Unknown"}`;

        /* ---------- Extra Stats ---------- */

        if ($("rating"))
            $("rating").textContent =
                anime.rating || "--";

        if ($("season"))
            $("season").textContent =
                anime.season
                    ? anime.season.charAt(0).toUpperCase() +
                      anime.season.slice(1)
                    : "--";

        $("rank").textContent =
            "#" + (anime.rank || "--");

        $("popularity").textContent =
            "#" + (anime.popularity || "--");

        $("members").textContent =
            formatNumber(anime.members);

        $("duration").textContent =
            anime.duration || "--";

        /* ---------- Studios ---------- */

        if ($("studios")) {

            $("studios").innerHTML =
                anime.studios.length
                    ? anime.studios
                        .map(s =>
                            `<span class="studioChip">${s.name}</span>`
                        )
                        .join("")
                    : "--";

        }

        /* ---------- Genres ---------- */

        $("genres").innerHTML =
            anime.genres
                .map(g =>
                    `<div class="genre">${g.name}</div>`
                )
                .join("");

        /* ---------- Synopsis ---------- */

        $("synopsis").textContent =
            anime.synopsis ||
            "No synopsis available.";
            
                    /* ---------- Characters ---------- */

        if ($("characterList")) {

            $("characterList").innerHTML =
                characters
                    .slice(0, 12)
                    .map(c => `
                        <div class="characterCard">
                            <img
                                src="${c.character.images.jpg.image_url}"
                                alt="${c.character.name}"
                            >

                            <h3>${c.character.name}</h3>

                            <p>${c.role}</p>
                        </div>
                    `)
                    .join("");

        }

        /* ---------- Recommendations ---------- */

        if ($("recommendList")) {

            $("recommendList").innerHTML =
                recommendations
                    .slice(0, 10)
                    .map(r => `
                        <div class="recommendCard"
                            onclick="location.href='anime.html?id=${r.entry.mal_id}'">

                            <img
                                src="${r.entry.images.jpg.large_image_url}"
                                alt="${r.entry.title}"
                            >

                            <h3>${r.entry.title}</h3>

                        </div>
                    `)
                    .join("");

        }

        /* ---------- Opening / Ending Themes ---------- */

        if ($("openingThemes")) {

            $("openingThemes").innerHTML =
                themes?.openings?.length
                    ? themes.openings
                        .map(song => `
                            <div class="themeItem">${song}</div>
                        `)
                        .join("")
                    : "<p>No opening themes available.</p>";

        }

        if ($("endingThemes")) {

            $("endingThemes").innerHTML =
                themes?.endings?.length
                    ? themes.endings
                        .map(song => `
                            <div class="themeItem">${song}</div>
                        `)
                        .join("")
                    : "<p>No ending themes available.</p>";

        }

        /* ---------- Episode List ---------- */

        if ($("episodeList")) {

            $("episodeList").innerHTML =
                episodes.length
                    ? episodes
                        .slice(0, 25)
                        .map(ep => `
                            <div class="episodeCard">
                                <h3>Episode ${ep.mal_id}</h3>

                                <p>${ep.title || "Untitled Episode"}</p>

                                <span>${ep.aired || ""}</span>
                            </div>
                        `)
                        .join("")
                    : "<p>No episode information available.</p>";

        }

        /* ---------- Gallery ---------- */

        if ($("gallery")) {

            $("gallery").innerHTML =
                pictures
                    .slice(0, 12)
                    .map(img => `
                        <img
                            src="${img.jpg.large_image_url}"
                            class="galleryImage"
                        >
                    `)
                    .join("");
                    
 document.getElementById("watchTrailer").onclick = () => {

    if (!currentAnime.trailer?.embed_url) {
        showToast("Trailer unavailable.","error");
        return;
    }

    const modal = document.getElementById("trailerModal");
    const frame = document.getElementById("trailerFrame");

    frame.src = currentAnime.trailer.embed_url + "?autoplay=1";
    modal.style.display = "flex";

};


const modal = document.getElementById("trailerModal");
const frame = document.getElementById("trailerFrame");

function closeTrailer(){

    modal.style.display = "none";
    frame.src = "";

}

document.getElementById("closeTrailer").onclick = closeTrailer;

modal.onclick = (e) => {

    if (e.target === modal) {

        closeTrailer();

    }

};

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {

        closeTrailer();

    }

});

        }

/* ---------- Watchlist ---------- */

if ($("watchlistBtn")) {

    const key = "animeFavorites";

    let favorites =
        JSON.parse(localStorage.getItem(key) || "[]");

    updateWatchlistButton();

    $("watchlistBtn").onclick = () => {

        if (favorites.includes(anime.mal_id)) {

            favorites = favorites.filter(
                id => id !== anime.mal_id
            );

        } else {

            favorites.push(anime.mal_id);

        }

        localStorage.setItem(
            key,
            JSON.stringify(favorites)
        );

        updateWatchlistButton();

    };

    function updateWatchlistButton() {

        $("watchlistBtn").innerHTML =
            favorites.includes(anime.mal_id)
                ? `<i class="fa-solid fa-bookmark"></i> In Watchlist`
                : `<i class="fa-regular fa-bookmark"></i> Add to Watchlist`;

    }

}

        /* ---------- Share ---------- */

        if ($("shareBtn")) {

            $("shareBtn").onclick = async () => {

                const url = window.location.href;

                if (navigator.share) {

                    try {

                        await navigator.share({
                            title: anime.title,
                            text: anime.title,
                            url
                        });

                    } (e) {}

                } else {

                    navigator.clipboard.writeText(url);
                    showToast("Link copied to clipboard.","success");

                }

            };

        }

    } catch (error) {

        console.error(error);

        showError(
            "Failed to load anime. Please try again later."
        );

    } finally {

        hideLoading();

    }

}

const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {

    if (window.scrollY > 400) {

        backToTop.style.display = "block";

    } else {

        backToTop.style.display = "none";

    }

});

backToTop.onclick = () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

};

function saveRecentlyViewed(anime){

let recent =
JSON.parse(
localStorage.getItem("recentAnime")
) || [];

recent =
recent.filter(
a => a.id !== anime.mal_id
);

recent.unshift({

id: anime.mal_id,

title: anime.title,

image: anime.images.jpg.large_image_url,

score: anime.score

});

recent = recent.slice(0,20);

localStorage.setItem(
"recentAnime",
JSON.stringify(recent)
);

}

function saveContinueWatching(anime){

let list =
JSON.parse(
localStorage.getItem("continueWatching")
) || [];

list =
list.filter(
a => a.id !== anime.mal_id
);

list.unshift({

id: anime.mal_id,

title: anime.title,

image: anime.images.jpg.large_image_url,

score: anime.score,

lastViewed: Date.now()

});

list = list.slice(0,20);

localStorage.setItem(

"continueWatching",

JSON.stringify(list)

);

}

loadAnime();