const darkMode =
document.getElementById("darkMode");

const animations =
document.getElementById("animations");

const cardSize =
document.getElementById("cardSize");

/* ---------- Load ---------- */

darkMode.checked =
localStorage.getItem("darkMode") === "true";

animations.checked =
localStorage.getItem("animations") !== "false";

cardSize.value =
localStorage.getItem("cardSize") || "normal";

/* ---------- Save ---------- */

darkMode.onchange = () => {

    localStorage.setItem(

        "darkMode",

        darkMode.checked

    );

    location.reload();

};

animations.onchange = () => {

    localStorage.setItem(

        "animations",

        animations.checked

    );

};

cardSize.onchange = () => {

    localStorage.setItem(

        "cardSize",

        cardSize.value

    );

};