const username =
document.getElementById("username");

const editBtn =
document.getElementById("editUsername");

const info =
document.getElementById("usernameInfo");

const watchlistCount =
document.getElementById("watchlistCount");

const favoritesCount =
document.getElementById("favoritesCount");

const recentCount =
document.getElementById("recentCount");

/* ---------- Stats ---------- */

watchlistCount.textContent =
(JSON.parse(localStorage.getItem("watchlist")) || []).length;

favoritesCount.textContent =
(JSON.parse(localStorage.getItem("favorites")) || []).length;

recentCount.textContent =
(JSON.parse(localStorage.getItem("recentAnime")) || []).length;

/* ---------- Username ---------- */

loadUsername();

function loadUsername(){

    let name =
    localStorage.getItem("username");

    if(!name){

        create();

        return;

    }

    username.textContent = name;

}

const USERNAME_REGEX =
/^[A-Za-z0-9_]{3,20}$/;

const CHANGE_DAYS = 14;

editBtn.onclick = ()=>{

    const last =
    Number(
        localStorage.getItem(
            "usernameLastChanged"
        ) || 0
    );

    const now = Date.now();

    const diff =
    now - last;

    const limit =
    CHANGE_DAYS * 24 * 60 * 60 * 1000;

    if(last && diff < limit){

        const days =
        Math.ceil(
        (limit-diff)/
        (24*60*60*1000)
        );

        showToast(
        `You can change your username again in ${days} day(s).`,"error"
        );

        return;

    }

    createUsername(true);

};

function createUsername(edit=false){

    const value = prompt(

        edit
        ? "Enter your new username:"
        : "Create your username:"

    );

    if(value===null) return;

    const name = value.trim();

    if(!USERNAME_REGEX.test(name)){

        showToast(
        "Username must be 3-20 characters and contain only letters, numbers and underscores.","error"
        );

        createUsername(edit);

        return;

    }

    localStorage.setItem(
        "username",
        name
    );

    localStorage.setItem(
        "usernameLastChanged",
        Date.now()
    );

    username.textContent = name;

}