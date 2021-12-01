
/* 
- add event listeners 
- define correspondent event handlers
- create necessary object instances 
- etc
*/

function hideLevels(id) {
    let selector = ".card .player-configurations .level-{id}";
    let div = document.querySelector({selector});
    div.style.display = "none"
}

function showLevels(id) {
    let selector = ".card .player-configurations .level-{id}";
    let div = document.querySelector({selector});
    div.style.display = "block"
}

function computerClickHandler(id) {
    showLevels(id); 
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




