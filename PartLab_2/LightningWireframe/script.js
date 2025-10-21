const svg = document.getElementById('wireSvg');
const canvas = document.getElementById('lightningCanvas');
const ctx = canvas.getContext('2d');

const container = document.querySelector('.wireframe-container');
canvas.width = 400;
canvas.height = 400;

const nodes = [];
const connections = [];
const nodeCount = 30;
const centerX = 200;
const centerY = 200;

class Node {
    constructor(x, y, index) {
        this.x = x;
        this.y = y;
        this.index = index;
        this.radius = 4;
        this.charged = false;
        this.chargeLevel = 0;
        this.element = this.createElement();
    }

    createElement() {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', this.x);
        circle.setAttribute('cy', this.y);
        circle.setAttribute('r', this.radius);
        circle.setAttribute('fill', '#00ffff');
        circle.setAttribute('filter', 'url(#glow)');
        circle.style.opacity = '0.3';
        svg.appendChild(circle);
        return circle;
    }

    charge() {
        this.charged = true;
        this.chargeLevel = 1;
        this.element.style.opacity = '1';
        this.element.setAttribute('fill', '#ffffff');
    }

    discharge() {
        this.chargeLevel -= 0.02;
        if (this.chargeLevel <= 0) {
            this.charged = false;
            this.chargeLevel = 0;
            this.element.style.opacity = '0.3';
            this.element.setAttribute('fill', '#00ffff');
        } else {
            this.element.style.opacity = this.chargeLevel;
        }
    }
}

class Connection {
    constructor(node1, node2) {
        this.node1 = node1;
        this.node2 = node2;
        this.element = this.createElement();
        this.active = false;
    }

    createElement() {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', this.node1.x);
        line.setAttribute('y1', this.node1.y);
        line.setAttribute('x2', this.node2.x);
        line.setAttribute('y2', this.node2.y);
        line.setAttribute('stroke', '#00ffff');
        line.setAttribute('stroke-width', '1');
        line.style.opacity = '0.2';
        svg.insertBefore(line, svg.firstChild);
        return line;
    }

    activate() {
        this.active = true;
        this.element.setAttribute('stroke', '#ffffff');
        this.element.setAttribute('stroke-width', '2');
        this.element.style.opacity = '1';
        this.element.setAttribute('filter', 'url(#glow)');
    }

    deactivate() {
        this.active = false;
        this.element.setAttribute('stroke', '#00ffff');
        this.element.setAttribute('stroke-width', '1');
        this.element.style.opacity = '0.2';
        this.element.removeAttribute('filter');
    }
}

for (let i = 0; i < nodeCount; i++) {
    const angle = (i / nodeCount) * Math.PI * 2;
    const radius = 80 + Math.random() * 80;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    nodes.push(new Node(x, y, i));
}

nodes.forEach((node, i) => {
    const connectCount = Math.floor(Math.random() * 3) + 2;
    for (let j = 0; j < connectCount; j++) {
        const targetIndex = (i + Math.floor(Math.random() * 5) + 1) % nodeCount;
        const target = nodes[targetIndex];
        const exists = connections.some(c =>
            (c.node1 === node && c.node2 === target) ||
            (c.node1 === target && c.node2 === node)
        );
        if (!exists) {
            connections.push(new Connection(node, target));
        }
    }
});

class Lightning {
    constructor(x1, y1, x2, y2) {
        this.points = this.generateLightning(x1, y1, x2, y2);
        this.life = 1;
    }

    generateLightning(x1, y1, x2, y2) {
        const points = [[x1, y1]];
        const segments = 8;
        const dx = (x2 - x1) / segments;
        const dy = (y2 - y1) / segments;

        for (let i = 1; i < segments; i++) {
            const x = x1 + dx * i + (Math.random() - 0.5) * 20;
            const y = y1 + dy * i + (Math.random() - 0.5) * 20;
            points.push([x, y]);
        }
        points.push([x2, y2]);
        return points;
    }

    draw() {
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.life})`;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00ffff';
        ctx.beginPath();
        ctx.moveTo(this.points[0][0], this.points[0][1]);
        for (let i = 1; i < this.points.length; i++) {
            ctx.lineTo(this.points[i][0], this.points[i][1]);
        }
        ctx.stroke();

        ctx.strokeStyle = `rgba(0, 255, 255, ${this.life * 0.5})`;
        ctx.lineWidth = 4;
        ctx.stroke();

        this.life -= 0.05;
    }
}

const lightnings = [];

function chargeWave() {
    const startNode = nodes[Math.floor(Math.random() * nodes.length)];
    const visited = new Set();
    const queue = [[startNode, 0]];

    function processQueue() {
        if (queue.length === 0) return;

        const [currentNode, depth] = queue.shift();
        if (visited.has(currentNode)) return;
        visited.add(currentNode);

        currentNode.charge();

        const connectedConnections = connections.filter(c =>
            c.node1 === currentNode || c.node2 === currentNode
        );

        connectedConnections.forEach(conn => {
            conn.activate();
            const nextNode = conn.node1 === currentNode ? conn.node2 : conn.node1;

            if (!visited.has(nextNode) && depth < 8) {
                lightnings.push(new Lightning(
                    currentNode.x, currentNode.y,
                    nextNode.x, nextNode.y
                ));
                queue.push([nextNode, depth + 1]);
            }
        });

        setTimeout(processQueue, 100);
    }

    processQueue();
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    nodes.forEach(node => {
        if (node.charged) {
            node.discharge();
        }
    });

    connections.forEach(conn => {
        if (conn.active && (!conn.node1.charged && !conn.node2.charged)) {
            conn.deactivate();
        }
    });

    for (let i = lightnings.length - 1; i >= 0; i--) {
        lightnings[i].draw();
        if (lightnings[i].life <= 0) {
            lightnings.splice(i, 1);
        }
    }

    requestAnimationFrame(animate);
}

animate();

setInterval(chargeWave, 2500);
setTimeout(chargeWave, 500);