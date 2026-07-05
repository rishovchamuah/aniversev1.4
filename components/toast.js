const toastContainer = document.createElement("div");

toastContainer.className = "toastContainer";

document.body.appendChild(toastContainer);

function showToast(message,type="info"){

   const toastContainer = document.createElement("div");

toastContainer.className = "toastContainer";

document.body.appendChild(toastContainer);

function showToast(message,type="info"){

    const toast =
    document.createElement("div");

    toast.className =
    `toast ${type}`;

    let icon = "";

    if(type==="success"){

        icon =
        `<i class="fa-solid fa-circle-check"></i>`;

    }else if(type==="error"){

        icon =
        `<i class="fa-solid fa-circle-xmark"></i>`;

    }else{

        icon =
        `<i class="fa-solid fa-circle-info"></i>`;

    }

    toast.innerHTML = `

<div class="toastContent">

${icon}

<span>${message}</span>

</div>

`;

    toastContainer.appendChild(toast);

    setTimeout(()=>{

        toast.style.animation =
        "toastOut .35s forwards";

        setTimeout(()=>{

            toast.remove();

        },350);

    },3000);

}

}