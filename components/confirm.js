const confirmOverlay = document.createElement("div");

confirmOverlay.className = "confirmOverlay";

confirmOverlay.innerHTML = `

<div class="confirmBox">

<h2 id="confirmTitle">

Confirm

</h2>

<p id="confirmMessage">

Are you sure?

</p>

<div class="confirmButtons">

<button
class="confirmCancel">

Cancel

</button>

<button
class="confirmOk">

Confirm

</button>

</div>

</div>

`;

document.body.appendChild(confirmOverlay);

function showConfirm(title,message,callback){

    document.getElementById(
    "confirmTitle"
    ).textContent = title;

    document.getElementById(
    "confirmMessage"
    ).textContent = message;

    confirmOverlay.style.display =
    "flex";

    confirmOverlay
    .querySelector(".confirmCancel")
    .onclick = ()=>{

        confirmOverlay.style.display =
        "none";

    };

    confirmOverlay
    .querySelector(".confirmOk")
    .onclick = ()=>{

        confirmOverlay.style.display =
        "none";

        callback();

    };

}