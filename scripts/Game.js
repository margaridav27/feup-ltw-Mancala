var gameState = undefined;
var mancala = undefined;

function setupPlayers() {
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
        return undefined; 
    }

    return [player1, player2];
}

function setupBoard() {
    // fetch board configurations
    const holes = document.getElementById("holes").value;
    const seeds = document.getElementById("seeds").value;
    
    return new Board(seeds, holes);
}

function setupBoardMoveHandlers(board) {
    const nrHoles = board.getNrHoles();
    for (let i = 0; i < nrHoles * 2; i++) 
        document.getElementById(`col-${i}`).onclick = () => { moveHandler(i); };
}

function moveHandler(move) {
    switch (gameState) {
        case 'PLAYING':
            let succeeded = mancala.performMove(move);
            if (!succeeded) gameState = 'DEFAULT';
            break;
        default:
            break;
    }
}

function startGame() {
    let players = setupPlayers();
    if (!players) return false;

    let board = setupBoard();
    board.renderBoard();
    setupBoardMoveHandlers(board);

    let infoPanel = document.getElementsByClassName("info-panel");
    let playButton = document.getElementById("game-btn");
    let configurations = document.getElementById("configurations");

    infoPanel.innerHTML = "Let the game begin!";
    playButton.innerHTML = "QUIT";
    configurations.classList.add("disable");
    disable(configurations);
    
    mancala = new Mancala(board, players);
    gameState = 'PLAYING'
    return true;
}

function quitGame() {
    // reset scores
    const scoreP1 = document.getElementById("score-1");
    scoreP1.innerHTML = 0;
    const scoreP2 = document.getElementById("score-2");
    scoreP2.innerHTML = 0;

    let infoPanel = document.getElementsByClassName("info-panel");
    let playButton = document.getElementById("game-btn");
    let configurations = document.getElementById("configurations");

    infoPanel.innerHTML = "Mancala Game";
    playButton.innerHTML = "PLAY";
    configurations.classList.remove("disable");
    disable(configurations);

    mancala = undefined;
    gameState = undefined;
}

