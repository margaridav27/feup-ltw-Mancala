
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

function showConfigs() {
    //if (document.querySelector())
}

