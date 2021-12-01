
/* 
- add event listeners 
- define correspondent event handlers
- create necessary object instances 
- etc
*/

function hideLevels(id) {
    document.querySelector("#player-card-" + id).className = "card player-card levels-hide"
}

function showLevels(id) {
    document.querySelector("#player-card-" + id).className = "card player-card"
}

function enablePlaceholder(selector) {
    document.querySelector(selector).placeholder = "";
    document.querySelector(selector).disabled = false;
}

function enableConfigs() {
    //let selector = ".configurations";
    document.getElementById("board-conf").addEventListener('submit', e => {
        e.preventDefault();
    });
    //let div = document.querySelector(selector);
    //document.getElementById("board-conf").style.pointerEvents = "none";
    //document.getElementById("board-conf").disabled = true;
    //document.getElementById("board-conf").style['pointer-events'] = "none";
    //div.style.pointerEvents = "none";
    // console.log(document.getElementById("board-conf").style.pointerEvents);
     document.getElementById("board-conf").style.pointerEvents = "none";
    // console.log(document.getElementById("board-conf").style.pointerEvents);

}
function disablePlaceholder(selector) {
    document.querySelector(selector).placeholder = "COMPUTER";
    document.querySelector(selector).disabled = true;
}

function computerCheckHandler(id) {
    let otherId = (id === '1') ? '2' : '1';

    if (document.querySelector("#computer-" + id).checked) {
        showLevels(id);

        document.querySelector("#computer-" + otherId).checked = false;
        hideLevels(otherId);

        disablePlaceholder("#name-" + id);
        enablePlaceholder("#name-" + otherId);
    } else {
        hideLevels(id);
        
        enablePlaceholder("#name-" + id);
        enablePlaceholder("#name-" + otherId);
    }
}




