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
