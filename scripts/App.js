
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
    let otherId = (id === '1') ? '2' : '1';

    if (document.querySelector("#computer-" + id).checked) {
        showLevels(id);

        document.querySelector("#computer-" + otherId).checked = false;
        hideLevels(otherId);

        document.querySelector("#name-" + id).placeholder = "COMPUTER";
        document.querySelector("#name-" + id).disabled = true;

        document.querySelector("#name-" + otherId).placeholder = "";
        document.querySelector("#name-" + otherId).disabled = false;
    } else {
        hideLevels(id); 

        document.querySelector("#name-" + id).placeholder = "";
        document.querySelector("#name-" + id).disabled = false;

        document.querySelector("#name-" + otherId).placeholder = "";
        document.querySelector("#name-" + otherId).disabled = false;
    }
}

