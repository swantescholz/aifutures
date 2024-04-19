

// ================================ HEADER 
document.write(`
<div id="mainContent">
    <h1>Map of AI Doom (<a href="http://bit.ly/map-of-ai-doom">bit.ly/map-of-ai-doom</a>)</h1>
    
    TODO:
    <br>Legend/glossary. 
    <br>Explain sliders use conditional probabilities.
    <br>Define catastrophic risks.
    <br>add authors, and link to source code. mention unlicense, so people know they may modify etc.
`);

// ================================ SHARING / EXPORT
document.write(`
<div id="shareRow">
<h2>Share this page:</h2>
    <button onclick="copyUrlToClipboard()" class="shareButton">Copy URL to Clipboard</button>
    <button onclick="shareOnFacebook()" class="shareButton">Share on Facebook</button>
    <button onclick="shareOnTwitter()" class="shareButton">Share on X (Twitter)</button>
</div>
`);
// ================================ ROW 1

document.write(`<div id="layoutRow1">`);
document.write(`<div id="canvas-container" style="width: ${CANVAS_WIDTH}px; height: ${CANVAS_HEIGHT}px">`);
document.write(`<canvas></canvas>`);
nodes.map(node => {
    document.write(`
    <div id="${idNodeBoxDiv+node.index}" class="nodeBox bg${node.type}" style="top: ${node.y}px; left: ${node.x}px;" onclick="handleNodeClick(${node.index})"></div>
    <div id="${idNodeTextDiv+node.index}" class="nodeText" style="top: ${node.y}px; left: ${node.x}px;" onclick="handleNodeClick(${node.index})">${node.text.replace(/\n/g, '<br>')}</div>
    `);
});
edges.map((edge, index) => {
    document.write(`<div id="${idEdgeLabel+index}" class="edge-label"></div>`);
});
document.write(`</div>`); // /canvas-container
document.write(`<div id=slider-container-outer>`); // slider
    // Settings=================================
    document.write(`
<div class="slider-container-inner"> 
    <p style="padding-left: 5px">Make more likely paths bolder?</p>
    <input type="checkbox" id="boldPathsCheckbox" onclick="updateEverything()" checked>
</div>
<div class="slider-container-inner"> 
    <p style="padding-left: 5px">Make less likely paths transparent?</p>
    <input type="checkbox" id="transparentPathsCheckbox" onclick="updateEverything()" checked>
</div>
<hr>
<button onclick="setSlidersFromString('')">Reset all to 50%</button>
<button onclick="setSlidersFromString('4i80i1i90i55i10i30i10i97i60i70i3i75i70i50i80i90i75i25i5i80i6i92i2')">Author's estimates</button>
<hr>
`);

for (let i = 0; i < Q; i++) {
    document.write(`
<p style="padding-left: 5px">${nodes[normalNodesIndices[i]].text.trim()}</p>
<div class="slider-container-inner"> 
    <input type="range" id="${idSliderInput+i}" min="0" max="100" value="${SLIDER_DEFAULT_VALUE}"> 
    <input type="number" id="${idSliderNumberBox+i}" min="0" max="100" value="${SLIDER_DEFAULT_VALUE}"> 
</div>
`);
}
document.write('</div>'); // /slider
document.write(`</div>`); // /layoutRow1
// ================================ ROW 2
document.write(`<div id="layoutRow2">`);
for (let i = 0; i < TABLE_NODE_TYPES.length; i++) {
    document.write(`<table class="bg${TABLE_NODE_TYPES[i]}"><tr><th>${TABLE_HEADERS[i]}</th><th class="ralign">[%]</th></tr>`);
        if (TABLE_NODE_TYPES_WITH_TOTAL.includes(TABLE_NODE_TYPES[i])) {
            document.write(`<tr><td><b>Total</b></td><td class="tablePercent"><b><p id="${idTableTotalForTypeP}${TABLE_NODE_TYPES[i]}">0.0</p></b></td></tr>`);
        } 
    nodes.filter(n => n.type === TABLE_NODE_TYPES[i]).map(node => {
        document.write(`<tr><td>${node.text}</td><td class="tablePercent"><p id="${idTableNodeCellP+node.index}">0.0</p></td></tr>`);
    });
    document.write(`</table>`);
}
document.write(`</div>`); // /layoutRow2
document.write(`</div>`); // /mainContent
// ================================ FUNCTIONS / LOGIC
const canvas = document.querySelector('canvas');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
const ctx = canvas.getContext('2d');

function handleNodeClick(index) {
    probabilityRootNodeIndex = index;
    updateEverything();
}
function updateEverything() {
    updateUrl();
    updateProbabilities();
    updateTables();
    updateNodeStyles();
    drawArrows();
}
function updateUrl() {
    let sliderValues = '';
    for (let i = 0; i < Q; i++) {
        sliderValues += document.getElementById(idSliderInput + i).value;
        if (i + 1 < Q) {
            sliderValues += 'i';
        }
    }
    let params = new URLSearchParams(window.location.search);
    params.set('p', sliderValues);
    window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
}
function updateProbabilities() {
    let sliderProbs = [];
    for (let i = 0; i < Q; i++) {
        sliderProbs.push(parseInt(document.getElementById(idSliderInput + i).value)/100.0);
    }
    nodes[probabilityRootNodeIndex].p = 1.0;
    let np = new Map([[probabilityRootNodeIndex, 1.0]]);
    let ep = new Map();
    function pNode(nIndex) {
        if (np.has(nIndex)) {
            return np.get(nIndex);
        }
        let p = (adj.get(nIndex)||[]).map(eIndex => pEdge(eIndex)).reduce((a, b) => a + b, 0.0);
        np[nIndex] = p;
        nodes[nIndex].p = p;
        return p;
    }
    function pEdge(eIndex) {
        if (ep.has(eIndex)) {
            return ep.get(eIndex);
        }
        let edge = edges[eIndex];
        let pParent = pNode(edge.source);
        let p = 1.0;
        if (edge.yn !== E100) {
            let pSlider = sliderProbs[normalNodesIndices.indexOf(edge.source)];
            mycheck(pSlider, `No slider value for node ${edge.source} from edge ${eIndex}`);
            p = edge.yn === YES ? pSlider : 1.0 - pSlider;
        }
        p *= pParent;
        ep.set(eIndex, p);
        edges[eIndex].p = p;
        return p;
    }
    for (let i = 0; i < N; i++) {
        pNode(i);
    }
    for (let i = 0; i < E; i++) {
        pEdge(i);
    }     
}
function updateTables() {
    for (let i = 0; i < N; i++) {
        let cell = document.getElementById(idTableNodeCellP + i);
        if (cell) {
            cell.innerText = toPercentString(nodes[i].p);
        }
    }
    for (let i = 0; i < TABLE_NODE_TYPES.length; i++) {
        if (!TABLE_NODE_TYPES_WITH_TOTAL.includes(TABLE_NODE_TYPES[i])) {
            continue;
        }
        let total = nodes.filter(n => n.type === TABLE_NODE_TYPES[i]).map(n => n.p).reduce((a, b) => a + b, 0.0);
        document.getElementById(idTableTotalForTypeP + TABLE_NODE_TYPES[i]).innerText = toPercentString(total);
    }
}
function updateNodeStyles() {
    for (let i = 0; i < N; i++) {
        let nodeBox = document.getElementById(idNodeBoxDiv+i);
        let nodeText = document.getElementById(idNodeTextDiv+i);
        nodeBox.style.width = (parseFloat(window.getComputedStyle(nodeText).width) + 16) + 'px';
        nodeBox.style.height =(parseFloat(window.getComputedStyle(nodeText).height) + 16) + 'px';
        nodeBox.style.opacity = toAlpha(nodes[i].p);
        nodeText.style.fontWeight = toFontWeight(nodes[i].p);
        nodeBox.style.borderWidth = toNodeBorderWidth(nodes[i].p) + 'px';
        if (i == probabilityRootNodeIndex) {
            nodeBox.style.borderColor = 'orange';
        } else {
            nodeBox.style.borderColor = 'black';
        }
    }
}
function drawArrows() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const canvasRect = document.getElementById(`canvas-container`).getBoundingClientRect()
    for (let i = 0; i < E; i++) {
        const edge = edges[i];
        const box1 = document.getElementById(idNodeBoxDiv+edge.source);
        const box2 = document.getElementById(idNodeBoxDiv+edge.target);
        const rect1 = box1.getBoundingClientRect();
        const rect2 = box2.getBoundingClientRect();
        let x1 = rect1.left - canvasRect.left + rect1.width / 2;
        let y1 = rect1.top - canvasRect.top + rect1.height / 2;
        let x2 = rect2.left - canvasRect.left + rect2.width / 2;
        let y2 = rect2.top - canvasRect.top + rect2.height / 2;
        let dx = parseFloat(x2) - x1;
        let dy = parseFloat(y2) - y1;
        // Make arrow endpoints align with mid-line or corner points of the boxes.
        if (dx > rect1.width / 2) {
            x1 += rect1.width / 2;
        } else if (dx < -rect1.width / 2) {
            x1 -= rect1.width / 2;
        }
        if (dy > rect1.height / 2) {
            y1 += rect1.height / 2;
        } else if (dy < -rect1.height / 2) {
            y1 -= rect1.height / 2;
        }
        if (dx > (rect1.width + rect2.width) / 2) {
            x2 -= rect2.width / 2;
        } else if (dx < -(rect1.width + rect2.width) / 2) {
            x2 += rect2.width / 2;
        }
        if (dy > (rect1.height + rect2.height) / 2) {
            y2 -= rect2.height / 2;
        } else if (dy < -(rect1.height + rect2.height) / 2) {
            y2 += rect2.height / 2;
        }
        x1 -= 1; // for some reasons these are needed to make the arrows look perfectly aligned.
        x2 -= 1;
        y1 -= 1;
        y2 -= 1;

        updateEdgeLabel(i, x1, y1, x2, y2);

        dx = parseFloat(x2) - x1; // calculate line offset for arrow head
        dy = parseFloat(y2) - y1;
        let dlen = Math.sqrt(dx*dx + dy*dy);
        dx = dx / dlen * toArrowHeadLen(edge.p) * 0.866;
        dy = dy / dlen * toArrowHeadLen(edge.p) * 0.866;
        
        // Draw the line
        ctx.beginPath();
        ctx.moveTo(x1 - canvas.offsetLeft, y1 - canvas.offsetTop);
        // Retract the line end a bit so that it doesn't overlap the arrow head.
        ctx.lineTo(x2 - canvas.offsetLeft - dx, y2 - canvas.offsetTop - dy);
        ctx.strokeStyle = `rgba(0, 0, 0, ${toAlpha(edge.p)}`;
        ctx.lineWidth = toArrowWidth(edge.p);
        ctx.stroke();

        // Draw the arrow head
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const headlen = toArrowHeadLen(edge.p);  // length of head in pixels
        ctx.beginPath();
        ctx.moveTo(x2 - canvas.offsetLeft, y2 - canvas.offsetTop);
        ctx.lineTo(x2 - canvas.offsetLeft - headlen * Math.cos(angle - Math.PI / 6), y2 - canvas.offsetTop - headlen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(x2 - canvas.offsetLeft - headlen * Math.cos(angle + Math.PI / 6), y2 - canvas.offsetTop - headlen * Math.sin(angle + Math.PI / 6));
        ctx.lineTo(x2 - canvas.offsetLeft, y2 - canvas.offsetTop);
        ctx.closePath();
        ctx.fillStyle = `rgba(0, 0, 0, ${toAlpha(edge.p)}`;
        ctx.fill();
    }
}
function setSlidersFromString(s) {
    let parts = s.split('i');
    for (let i = 0; i < Q; i++) {
        let slider = document.getElementById(idSliderInput + i);
        let textbox = document.getElementById(idSliderNumberBox + i);
        slider.value = parseInt(parts[i]) || SLIDER_DEFAULT_VALUE;
        textbox.value = slider.value;
    }
    updateEverything();
}
function updateEdgeLabel(i, x1, y1, x2, y2) {
    const edgeLabel = document.getElementById(idEdgeLabel+i);
    let dx = y2 - y1;
    let dy = x1 - x2;
    const norm = Math.sqrt(dx*dx + dy*dy);
    const offset = 12;
    const flipSign = dy > 0;
    dx = dx / norm * offset * (flipSign ? -1 : 1);
    dy = dy / norm * offset * (flipSign ? -1 : 1);
    const angle = Math.atan2(y2 - y1, x2 - x1) + (flipSign? Math.PI : 0);
    edgeLabel.style.transform = `translate(-50%, -50%) rotate(${angle}rad)`;
    edgeLabel.style.left = dx + (x1 + x2) / 2 + 'px';
    edgeLabel.style.top = dy + (y1 + y2) / 2 + 'px';
    edgeLabel.style.opacity = toAlpha(edges[i].p);
    edgeLabel.style.fontWeight = toFontWeight(edges[i].p);
    let label = edges[i].yn === E100 ? "" : (edges[i].yn+"=")
    if (edges[i].yn !== E100) { // mytodo
        const sourceSliderProb = parseInt(document.getElementById(idSliderInput + normalNodesIndices.indexOf(edges[i].source)).value);
        label += edges[i].yn === YES ? sourceSliderProb : (100-sourceSliderProb);            
    }
    edgeLabel.textContent = label;
}

window.onload = function () {
    let urlParam = new URLSearchParams(window.location.search).get('p') || '';
    setSlidersFromString(urlParam);
    // Slider listeners.
    for (let i = 0; i < Q; i++) {
        let slider = document.getElementById(idSliderInput + i);
        let textbox = document.getElementById(idSliderNumberBox + i);
        slider.addEventListener('input', function () {
            textbox.value = slider.value;
            updateEverything();
        });
        textbox.addEventListener('input', function () {
            if (textbox.value < 0) {
                textbox.value = 0;
            } else if (textbox.value > 100) {
                textbox.value = 100;
            }
            slider.value = textbox.value;
            updateEverything();
        });
    }
    updateEverything();
};
window.onresize = updateEverything;