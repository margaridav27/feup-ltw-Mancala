
function hidePanel(selector) {
    document.querySelector(selector).className = selector.substring(1) + " hide-panel";
}

function showPanel(selector) {
    document.querySelector(selector).className = selector.substring(1);
}

function startPreview() {
    hidePanel(".default-panel");
    showPanel(".board-panel");

    let board = document.querySelector(".board-panel");

    // TODO: collect board configurations and construct board accordingly
    board.innerHTML = "<div class='warehouse'></div>";

    for (let i = 0; i < 4; i++) 
        board.innerHTML += `<div class='row-1' id='col-${i}'></div>`

    for (let i = 0; i < 4; i++) 
        board.innerHTML += `<div class='row-2' id='col-${i}'></div>`

    board.innerHTML += "<div class=class='warehouse'></div>";
}

function stopPreview() {
    hidePanel(".board-panel");
    showPanel(".default-panel");

    let board = document.querySelector(".board-panel");

    board.innerHTML = "";
}

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

function disableConfigs(id) {
    document.getElementById(id).style.pointerEvents = "none";
}

function enableConfigs(id) {
     document.getElementById(id).style.pointerEvents = "auto";
}

function gameHandler() {
    const play = document.getElementById("play-btn");

    if (play.innerHTML == "PLAY") {
        play.innerHTML = "QUIT";
        disableConfigs('board-card');
        const game = new Game();
    }

    else {
        play.innerHTML = "PLAY";
        enableConfigs('board-card');
    }
    
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




