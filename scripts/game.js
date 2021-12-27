var gameState = undefined;
var mancala = undefined;

function setupPlayers() {
    // fetch players configurations
    let player1 = document.getElementById("name-1").value;
    let player2 = document.getElementById("name-2").value;
    let level;

    // check player vs bot
    if (player1 == "BOT") {
        const radioBtn = document.querySelector("input[name=\"level-1\"]:checked");
        if (radioBtn.id.match(/level-1/)) level = parseInt(radioBtn.value);            
    } else if (player2 == "BOT") {
        const radioBtn = document.querySelector("input[name=\"level-2\"]:checked");
        if (radioBtn.id.match(/level-2/)) level = parseInt(radioBtn.value);
    }

    if (player1.length === 0) player1 = "Player 1";
    else if (player2.length === 1) player1 = "Player 2";

    return [[player1, player2], level];
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
            console.log(mancala.getCurrentPlayer());
            if (mancala.getPlayers()[mancala.getCurrentPlayer()] == "BOT") 
                mancala.performBot();
            if (!succeeded) {
                endGame();
                gameState = 'DEFAULT';
            }
            break;
        default:
            break;
    }
}

function startGame() {
    let players = setupPlayers()[0];

    let level = setupPlayers()[1];

    let board = setupBoard();
    board.renderBoard();
    setupBoardMoveHandlers(board);

    let infoPanel = document.getElementsByClassName("info-panel");
    infoPanel.innerHTML = "Let the game begin!";

    let playButton = document.getElementById("game-btn");
    playButton.innerHTML = "QUIT";
    
    mancala = new Mancala(board, players, level);
    gameState = 'PLAYING'
}

function quitGame() {
    // reset scores
    const scoreP1 = document.getElementById("score-1");
    scoreP1.innerHTML = 0;
    const scoreP2 = document.getElementById("score-2");
    scoreP2.innerHTML = 0;

    let playButton = document.getElementById("game-btn");
    playButton.innerHTML = "PLAY";

    hidePanel(".info-panel");
    hidePanel(".board-panel");
    showPanel(".default-panel");

    let menuButtons = document.querySelectorAll(".menu-btn");
    menuButtons.forEach(button => { enable(button); });

    mancala = undefined;
    gameState = undefined;
}

function endGame() {
    // reset scores
    const scoreP1 = document.getElementById("score-1");
    scoreP1.innerHTML = 0;
    const scoreP2 = document.getElementById("score-2");
    scoreP2.innerHTML = 0;

    let playButton = document.getElementById("game-btn");
    playButton.innerHTML = "PLAY";

    hidePanel(".info-panel");
    hidePanel(".board-panel");
    showPanel(".default-panel");

    let menuButtons = document.querySelectorAll(".menu-btn");
    menuButtons.forEach(button => { enable(button); });

    mancala = undefined;
    gameState = undefined;
}

