const hero = {
    current: 0,
    list: []
};

async function loadHeroSlider() {

    const res = await fetch(
        "https://api.jikan.moe/v4/top/anime"
    );

    const json = await res.json();

    hero.list = json.data.slice(0, 6);

    updateHero();

    setInterval(() => {

        hero.current++;

        if (hero.current >= hero.list.length) {

            hero.current = 0;

        }

        updateHero();

    }, 8000);

}

function updateHero() {

    const anime = hero.list[hero.current];

    heroTitle.textContent = anime.title;

    heroSynopsis.textContent =
        anime.synopsis
        ? anime.synopsis.substring(0, 220) + "..."
        : "No synopsis available.";

    heroScore.innerHTML =
        `<i class="fa-solid fa-star"></i> ${anime.score}`;

    heroEpisodes.innerHTML =
        `<i class="fa-solid fa-tv"></i> ${anime.episodes || "?"} Episodes`;

    heroStatus.innerHTML =
        `<i class="fa-solid fa-circle-check"></i> ${anime.status}`;

    document.querySelector(".background").style.backgroundImage = `
linear-gradient(rgba(0,0,0,.65),rgba(0,0,0,.85)),
url(${anime.images.jpg.large_image_url})
`;

}