
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
    if (document.querySelector(selector).value == "COMPUTER") {
        document.querySelector(selector).value = "";
    }
    document.querySelector(selector).disabled = false;
}

function disablePlaceholder(selector) {
    document.querySelector(selector).value = "COMPUTER";
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

function disable(element) {
    element.style.pointerEvents = "none";
}

function enable(element) {
    element.style.pointerEvents = "auto";
}

function gameHandler() {
    const play = document.getElementById("play-btn");
    let configs = document.getElementById("configurations");

    if (play.innerHTML == "PLAY") {
        play.innerHTML = "QUIT";
        disable(configs);
        configs.classList.add("disable");


        let holes = document.getElementById("holes").value;
        let seeds = document.getElementById("seeds").value;
        let player1 = document.getElementById("name-1").value;
        let player2 = document.getElementById("name-2").value;
        var checkRadio = document.querySelector('input[name="level"]:checked');
        var info = document.getElementById("info");

        if (player1 == "COMPUTER") {
            if(checkRadio.id.match(/level-1/)){
                level = checkRadio.value;
            }
        }
        else if (player2 == "COMPUTER") {
            if(checkRadio.id.match(/level-2/)){
                level = checkRadio.value;
            }
        }

        let players = [player1, player2];
        if (player1 == "" || player2 == "") {
            info.innerHTML = "You have to choose a name ESTA CONDIÇÃO NAO ESTA BEM AINDA";
        }

        let board = new Board(seeds, holes);

        const game = new Game(board, players, level);
    }

    else {
        play.innerHTML = "PLAY";
        enable(configs);
        configs.classList.remove("disable");
    }
    
}


