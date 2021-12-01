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

    // warehouses
    let wh1 = document.createElement("div");
    wh1.className = "wh";
    wh1.id = "wh-1";
    let wh2 = document.createElement("div");
    wh2.className = "wh";
    wh2.id = "wh-2";

    // rows
    let r1 = document.createElement("div");
    r1.className = "row";
    r1.id = "row-1";
    let r2 = document.createElement("div");
    r2.className = "row";
    r2.id = "row-2";

    board.appendChild(wh1);
    board.appendChild(r1);
    board.appendChild(r2);
    board.appendChild(wh2);

    // columns (holes)
    for (let i = 0; i < 4; i++) {
        let col = document.createElement("div");
        col.className = "col";
        col.id = `col-${i}`;
        r1.appendChild(col);
    }
        
    for (let i = 0; i < 4; i++) {
        let col = document.createElement("div");
        col.className = "col";
        col.id = `col-${i+4}`;
        r2.appendChild(col);
    }
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

function gameHandler() {
    const playBtn = document.getElementById("play-btn");
    let configs = document.getElementById("configurations");

    if (playBtn.innerHTML == "PLAY") {
        configs.classList.add("disable");

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
            info.innerHTML = "You have to choose a name ESTA CONDIÇÃO NAO ESTA BEM AINDA";
            return; // TODO: fix executing disable configs even when entering this if
        }

        console.log("js é merdaaaaaaa como caralhos executa esta parte");

        // fetch board configurations
        const holes = document.getElementById("holes").value;
        const seeds = document.getElementById("seeds").value;
        
        let players = [player1, player2];
        //let board = new Board(seeds, holes);
        //let game = new Game(board, players, level);

        playBtn.innerHTML = "QUIT";
        disable(configs);
        
    } else {
        playBtn.innerHTML = "PLAY";
        enable(configs);
        configs.classList.remove("disable");
    } 
}
