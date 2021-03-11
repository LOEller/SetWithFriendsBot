const shapes = ["#oval", "#squiggle", "#diamond"];
const colors = ["#800080", "#008002", "#ff0101"];

function set(a, b, c) {
    for (var i = 0; i < 4; i++) {
        const same = a[i] == b[i] && b[i] == c[i];
        const different = a[i] != b[i] && b[i] != c[i] && a[i] != c[i];
        if (!(same || different)) {
            return false;
        } 
    }
    return true;
}

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}

function click(targetNode) {
    triggerMouseEvent (targetNode, "mouseover");
    triggerMouseEvent (targetNode, "mousedown");
    triggerMouseEvent (targetNode, "mouseup");
    triggerMouseEvent (targetNode, "click");
}

function gameOver() {
    const ind = document.getElementsByTagName("h5")[0].parentElement.parentElement.getAttribute("style");
    return ind == "opacity: 1; visibility: visible;";
}

function move() {
    const list = document.getElementsByTagName("div");

    var cardObjects = [];
    for (var i = 0; i < list.length ; i++) {
        var card = list[i];
        if (card.getAttribute("style") == null) {
            continue;
        } else if (!card.getAttribute("style").includes("visible")) {
            continue;
        }

        cardObjects.push(card.children[0]); 
    }

    var cardCodes = [];
    for (var i = 0; i < cardObjects.length ; i++) {
        var card = cardObjects[i];

        // get the number
        const svg = card.getElementsByTagName("svg");
        const number = svg.length - 1; 

        // get the shape
        const use = svg[0].getElementsByTagName("use");
        const shape = shapes.indexOf(use[0].getAttribute("href"));

        // get the color
        const borderElem = use[1];
        const color = colors.indexOf(borderElem.getAttribute("stroke"));

        // get the fill
        const fillElem = use[0];
        var fill = null;
        if (fillElem.getAttribute("fill") == "transparent") {
            fill = 0;
        } else if (fillElem.getAttribute("fill") == colors[color]) {
            if (fillElem.getAttribute("mask") == "url(#mask-stripe)") {
                fill = 1;
            } else {
                fill = 2;
            }
        }
        
        cardCodes.push(String(number) + String(shape) + String(color) + String(fill));
    }

    for (var i = 0; i < cardCodes.length - 2; i++) {
        for (var j = i+1; j < cardCodes.length - 1; j++) {
            for (var k = j+1; k < cardCodes.length; k++) {
                if (set(cardCodes[i], cardCodes[j], cardCodes[k])) {
                    click(cardObjects[i]);
                    click(cardObjects[j]);
                    click(cardObjects[k]);
                    return;  
                }
            }
        }
    } 
}

function loop() {
    if (gameOver()) { return; }
    move();
    const timeout = 2 + Math.random() + Math.random() + Math.random() + Math.random();
    setTimeout(loop, timeout*1000);
}

loop();