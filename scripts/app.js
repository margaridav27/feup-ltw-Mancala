var appState = 'DEFAULT';

function gameClickHandler() {
    switch (appState) {
        case 'PLAYING':
            appState = 'DEFAULT'
            quitGame();
            break;
        default:
            if (startGame()) {
                console.log("about to start a game")

                appState = 'PLAYING';
                hidePanel(".default-panel");
                showPanel(".board-panel");
            }
            break;
    }
}

function instructionsClickHandler() {
    switch (appState) {
        case 'DEFAULT':
            hidePanel(".default-panel");
            showPanel(".instructions-panel");
            appState = 'INSTRUCTIONS';
            break;
        case 'GAME-RECORDS':
            hidePanel(".records-panel.game-records");
            showPanel(".instructions-panel");
            appState = 'INSTRUCTIONS';
            break;
        case 'SCORE-RECORDS':
            hidePanel(".records-panel.score-records");
            showPanel(".instructions-panel");
            appState = 'INSTRUCTIONS';
            break;
        default:
            break;
    }
}

function recordsClickHandler() {
    switch (appState) {
        case 'DEFAULT':
            hidePanel(".default-panel");
            showPanel(".records-panel.game-records");
            appState = 'GAME-RECORDS';
            break;
        case 'INSTRUCTIONS':
            hidePanel(".instructions-panel");
            showPanel(".records-panel.game-records");
            appState = 'GAME-RECORDS';
        default:
            break;
    }
}

function recordClickHandler() {
    switch (appState) {
        case 'GAME-RECORDS':
            hidePanel(".records-panel.game-records");
            showPanel(".records-panel.score-records");
            appState = 'SCORE-RECORDS';
            break;
        case 'SCORE-RECORDS':
            hidePanel(".records-panel.score-records");
            showPanel(".records-panel.game-records");
            appState = 'GAME-RECORDS';
        default:
            break;
    }
}
