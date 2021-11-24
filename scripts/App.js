
/* 
- add event listeners 
- define correspondent event handlers
- create necessary object instances 
- etc
*/

function hideLevels(id) {
    let selector = ".card .player-configurations .level-" + id;
    let div = document.querySelector(selector);
    div.style.display = "none"
}

function showLevels(id) {
    let selector = ".card .player-configurations .level-" + id;
    let element = document.querySelector(selector);
    element.style.display = "flex"
}

function computerCheckHandler(id) {
    let selector = "#computer-" + id;
    let element = document.querySelector(selector);

    if (element.checked) showLevels(id);
    else hideLevels(id); 
}

