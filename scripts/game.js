var gameState = undefined;
var mancala = undefined;

function setupPlayers() {
    // fetch players configurations
    let player1 = document.getElementById("name-1").value;
    let player2 = document.getElementById("name-2").value;

    // check player vs computer
    if (player1 == "COMPUTER") {
        const radioBtn = document.querySelector("input[name=\"level-1\"]:checked");
        if (radioBtn.id.match(/level-1/)) level = radioBtn.value;            
    } else if (player2 == "COMPUTER") {
        const radioBtn = document.querySelector("input[name=\"level-2\"]:checked");
        if (radioBtn.id.match(/level-2/)) level = radioBtn.value;
    }

    if (player1.length === 0) player1 = "Player 1";
    else if (player2.length === 1) player1 = "Player 2";

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
    let players = setupPlayers();

    let board = setupBoard();
    board.renderBoard();
    setupBoardMoveHandlers(board);

    let infoPanel = document.getElementsByClassName("info-panel");
    infoPanel.innerHTML = "Let the game begin!";

    let playButton = document.getElementById("game-btn");
    playButton.innerHTML = "QUIT";
    
    mancala = new Mancala(board, players);
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

