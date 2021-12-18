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

function enablePlaceholder(selector) {
    if (document.querySelector(selector).value == "BOT") 
        document.querySelector(selector).value = "";
    
    document.querySelector(selector).disabled = false;
}

function disablePlaceholder(selector) {
    document.querySelector(selector).value = "BOT";
    document.querySelector(selector).disabled = true;
}

function hideLevels(id) {
    document.querySelector("#player-card-" + id).className = "card player-card levels-hide"
}

function showLevels(id) {
    document.querySelector("#player-card-" + id).className = "card player-card"
}

function botCheckHandler(id) {
    let otherId = (id === '1') ? '2' : '1';

    if (document.querySelector("#bot-" + id).checked) {
        showLevels(id);

        document.querySelector("#bot-" + otherId).checked = false;
        hideLevels(otherId);

        disablePlaceholder("#name-" + id);
        enablePlaceholder("#name-" + otherId);
    } else {
        hideLevels(id);
        
        enablePlaceholder("#name-" + id);
        enablePlaceholder("#name-" + otherId);
    }
}
