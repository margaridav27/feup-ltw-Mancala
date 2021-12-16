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
            hidePanel(".board-panel");
            showPanel(".instructions-panel");
            appState = 'INSTRUCTIONS';
            break;
        case 'RECORDS':
            hidePanel(".records-panel");
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
            hidePanel(".board-panel");
            showPanel(".instructions-panel");
            appState = 'RECORDS';
            break;
        case 'INSTRUCTIONS':
            hidePanel(".board-panel");
            showPanel(".instructions-panel");
            appState = 'RECORDS';
        default:
            break;
    }
}
