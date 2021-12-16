function hidePanel(selector) {
    console.log(document.querySelector(selector).className);
    document.querySelector(selector).className = selector.substring(1) + " hide-panel";
}

function showPanel(selector) {
    document.querySelector(selector).className = selector.substring(1);
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


function disable(element) {
    element.style.pointerEvents = "none";
}

function enable(element) {
    element.style.pointerEvents = "auto";
}