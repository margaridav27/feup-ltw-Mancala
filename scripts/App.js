
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
    if (document.querySelector("#computer-" + id).checked) {
        showLevels(id);

        let otherId = (id === '1') ? '2' : '1';
        document.querySelector("#computer-" + otherId).checked = false;
        console.log(document.querySelector("#computer-" + otherId));
        hideLevels(otherId);
        
    } else hideLevels(id); 
}

