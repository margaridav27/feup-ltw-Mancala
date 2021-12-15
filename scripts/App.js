function hidePanel(selector) {
    console.log(document.querySelector(selector).className);
    document.querySelector(selector).className = selector.substring(1) + " hide-panel";
}

function showPanel(selector) {
    document.querySelector(selector).className = selector.substring(1);
}

function startBoardPreview() {
    hidePanel(".default-panel");
    showPanel(".board-panel");

    let board = document.querySelector(".board-panel");

    // warehouses
    let wh1 = document.createElement("div");
    wh1.className = "wh";
    wh1.id = "wh-1";
    let wh2 = document.createElement("div");
    wh2.className = "wh";
    wh2.id = "wh-2";

    // rows
    let r1 = document.createElement("div");
    r1.className = "row"; //starts with player 1 as current player
    r1.id = "row-1";
    let r2 = document.createElement("div");
    r2.className = "row";
    r2.id = "row-2";

    board.appendChild(wh1);
    board.appendChild(r1);
    board.appendChild(r2);
    board.appendChild(wh2);

    const holes = document.getElementById("holes").value;
    const seeds = document.getElementById("seeds").value;

    for (let i = 0; i < holes; i++) {
        let col = document.createElement("div");
        col.className = "col";
        col.id = `col-${i} curr-player`;
        col.innerText = `${seeds}`; 
        r1.appendChild(col);
    }
        
    for (let i = holes - 1; i >= 0; i--) {
        let col = document.createElement("div");
        col.className = "col";
        col.id = `col-${i+4}`;
        col.innerText = `${seeds}`; 
        r2.appendChild(col);
    }
}

function stopBoardPreview() {
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
    if (document.querySelector(selector).value == "COMPUTER") 
        document.querySelector(selector).value = "";
    
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

function changeState(board) {
    if (board == ".board-panel") showPanel(board);
    else hidePanel(".board-panel");
    if (board == ".instructions-panel") showPanel(board);
    else hidePanel(".instructions-panel");
    if (board == ".record-panel") showPanel(board);
    else hidePanel(".record-panel");
    if (board == ".default-panel") showPanel(board);
    else hidePanel(".default-panel");
}

function gameState(state) {
    switch(state) {
        case 'play':
            changeState(".default-panel");
            const playBtn = document.getElementById("play-btn");
            let configs = document.getElementById("configurations");
            gameHandler(playBtn, configs);
            break;
        case 'instructions':
            resetScore();
            backToPlay();
            changeState(".instructions-panel");
            break;
        case 'records':
            resetScore();
            backToPlay();
            changeState(".record-panel");
            hidePanel(".scores-record")
            break;
        default:
            break;
    }
}

function gameHandler(button, configs) {
    let game;
    if (button.innerHTML == "PLAY") {
        // fetch players configurations
        const player1 = document.getElementById("name-1").value;
        const player2 = document.getElementById("name-2").value;

        // check player vs computer
        if (player1 == "COMPUTER") {
            const radioBtn = document.querySelector("input[name=\"level-1\"]:checked");
            if (radioBtn.id.match(/level-1/)) level = radioBtn.value;            
        } else if (player2 == "COMPUTER") {
            const radioBtn = document.querySelector("input[name=\"level-2\"]:checked");
            if (radioBtn.id.match(/level-2/)) level = radioBtn.value;
        }

        // check if user filled in all the necessary data
        if (player1.length === 0 || player2.length === 0) {
            const info = document.getElementById("info");
            info.innerHTML = "Please provide a name for the players.";
            return; 
        }

        // fetch board configurations
        const holes = document.getElementById("holes").value;
        const seeds = document.getElementById("seeds").value;
        
        let players = [player1, player2];
        let board = new Board(seeds, holes);

        changeState(".board-panel");
        board.renderBoard();

        configs.classList.add("disable");
        info.innerHTML = "Let the game begin!";
        button.innerHTML = "QUIT";
        disable(configs);

        game = new Game(board, players, 0);
        
        
        if (!game.setValidMoves()) {
            console.log("FINISHED!");
        }
        
    } else {
        resetScore();
        button.innerHTML = "PLAY";
        enable(configs);
        configs.classList.remove("disable");
    } 
}

function resetScore() {
    const scoreP1 = document.getElementById("score-1");
    scoreP1.innerHTML = 0;
    const scoreP2 = document.getElementById("score-2");
    scoreP2.innerHTML = 0;
}

function backToPlay() {
    const playBtn = document.getElementById("play-btn");
    let configs = document.getElementById("configurations");
    playBtn.innerHTML = "PLAY";
    enable(configs);
    configs.classList.remove("disable");
}
