var appState = 'DEFAULT';

function logoClickHandler() {
    let recordsButton = document.getElementById("records-btn");

    switch (appState) {
        case 'INSTRUCTIONS':
            hidePanel(".instructions-panel");
        case 'GAME-RECORDS':
            hidePanel(".records-panel.game-records");
            recordsButton.innerText = "RECORDS";
            break;
        case 'SCORE-RECORDS':
            hidePanel(".records-panel.score-records");
            recordsButton.innerText = "RECORDS";
            break;
        case 'SETTINGS':
            hidePanel(".settings-panel");
            break;
        case 'PLAYING':
            return;
        default:
            break;
    }

    showPanel(".default-panel");
    appState = 'DEFAULT';
}

function gameClickHandler() {
    const prevAppState = appState;

    switch (appState) {
        case 'PLAYING':
            quitGame();
            appState = 'DEFAULT'
            break;
        case 'DEFAULT':
            hidePanel(".default-panel");
            break;
        case 'INSTRUCTIONS':
            hidePanel(".instructions-panel");
            break;
        case 'GAME-RECORDS':
            hidePanel(".records-panel.game-records");
            break;
        case 'SCORE-RECORDS':
            hidePanel(".records-panel.score-records");
            break;
        case 'SETTINGS':
            hidePanel(".settings-panel");
            break;
        default:
            break;
    }

    if (prevAppState !== 'PLAYING') {
        showPanel(".info-panel");
        showPanel(".board-panel");

        let menuButtons = document.querySelectorAll(".menu-btn");
        menuButtons.forEach(button => { disable(button); });
        enable(menuButtons[0]);

        startGame();
        appState = 'PLAYING';
    }
}

function instructionsClickHandler() {
    let recordsButton = document.getElementById("records-btn");

    switch (appState) {
        case 'DEFAULT':
            hidePanel(".default-panel");
            break;
        case 'GAME-RECORDS':
            hidePanel(".records-panel.game-records");
            recordsButton.innerText = "RECORDS";
            break;
        case 'SCORE-RECORDS':
            hidePanel(".records-panel.score-records");
            recordsButton.innerText = "RECORDS";
            break;
        case 'SETTINGS':
            hidePanel(".settings-panel");
            break;
        case 'PLAYING':
            return;
        default:
            break;
    }

    showPanel(".instructions-panel");
    appState = 'INSTRUCTIONS';
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
        case 'GAME-RECORDS':
            hidePanel(".records-panel.game-records");
            showPanel(".records-panel.score-records");
            appState = 'SCORE-RECORDS';
            break;
        case 'SCORE-RECORDS':
            hidePanel(".records-panel.score-records");
            showPanel(".records-panel.game-records");
            appState = 'GAME-RECORDS';
            break;
        case 'SETTINGS':
            hidePanel(".settings-panel");
            showPanel(".records-panel.game-records");
            appState = 'GAME-RECORDS';
            break;
        case 'PLAYING':
            return;
        default:
            break;
    }

    let recordsButton = document.getElementById("records-btn");
    if (recordsButton.innerText === "SCORE RECORDS") recordsButton.innerText = "GAME RECORDS";
    else recordsButton.innerText = "SCORE RECORDS";
}

function settingsClickHandler() {
    let recordsButton = document.getElementById("records-btn");

    switch (appState) {
        case 'DEFAULT':
            hidePanel(".default-panel");
            break;
        case 'INSTRUCTIONS':
            hidePanel(".instructions-panel");
            recordsButton.innerText = "RECORDS";
            break;
        case 'GAME-RECORDS':
            hidePanel(".records-panel.game-records");
            recordsButton.innerText = "RECORDS";
            break;
        case 'SCORE-RECORDS':
            hidePanel(".records-panel.score-records");
            break;
        case 'PLAYING':
            return;
        default:
            break;
    }

    showPanel(".settings-panel");
    appState = 'SETTINGS';
}


