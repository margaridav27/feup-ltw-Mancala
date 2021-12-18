function hidePanel(selector) {
    let panel = document.querySelector(selector);
    panel.className = '';

    let classes = selector.split('.');
    for (const c of classes) panel.className += c + ' ';

    panel.className += "hide-panel";
    panel.className = panel.className.trim();
}

function showPanel(selector) {
    let panel = document.querySelector(selector);
    panel.className = '';

    let classes = selector.split('.');
    for (const c of classes) panel.className += c + ' '; 
        
    panel.className = panel.className.trim();
}

function disable(element) {
    element.style.pointerEvents = "none";
}

function enable(element) {
    element.style.pointerEvents = "auto";
}