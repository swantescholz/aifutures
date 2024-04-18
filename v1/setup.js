let gNodeIndex = 0;
class Node {
    constructor(line) {
        const parts = line.trim().split(';');
        this.index = gNodeIndex++;
        this.id = parts[1];
        this.type = parts[0];
        this.x = parseFloat(parts[2]) * XSCALE;
        this.y = parseFloat(parts[3]);
        this.text = parts[4].replace('|', '\n');
        this.p = 1.0; // total probability flow going into this node.
    }
}

function initNodes() {
    let nodes = NODES_STR.split('\n').map(line => new Node(line));
    let minX = Number.POSITIVE_INFINITY, minY = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY, maxY = Number.NEGATIVE_INFINITY;
    nodes.map(node => {
        minX = Math.min(minX, node.x);
        minY = Math.min(minY, node.y);
        maxX = Math.max(maxX, node.x);
        maxY = Math.max(maxY, node.y);
    });
    nodes.map(node => {
        node.x = (node.x - minX) / (maxX-minX) * (CANVAS_WIDTH - 2*CANVAS_PADDINGW) + CANVAS_PADDINGW;
        node.y = (node.y - minY) / (maxY-minY) * (CANVAS_HEIGHT - 2*CANVAS_PADDINGH) + CANVAS_PADDINGH;
    })
    return nodes;
}
const nodes = initNodes();
let id2index = new Map();
nodes.map((node, index) => {
    id2index.set(node.id, index);
});
const normalNodesIndices = nodes.filter(n => n.type === NORMAL).map(n => n.index);

class Edge {
    constructor(line) {
        const parts = line.trim().split(';');
        this.yn = parts[0];
        this.source = id2index.get(parts[1]);
        this.target = id2index.get(parts[2]);
        mycheck(this.source, `Unknown node: ${parts[1]}`);
        mycheck(this.target, `Unknown node: ${parts[2]}`);
        this.p = 0.0; // total probability flow going through the edge.
    }
}
let probabilityRootNodeIndex = nodes.findIndex(n => n.type === START);

let edges = EDGES_STR.split('\n').map(line => new Edge(line));
const Q = normalNodesIndices.length;
const N = nodes.length;
const E = edges.length;

let adj = new Map();
edges.map((edge, eIndex) => {
    if (!adj.has(edge.target)) {
        adj.set(edge.target, []);
    }
    adj.get(edge.target).push(eIndex);
});