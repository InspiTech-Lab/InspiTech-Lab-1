class MazeCursorTrail {
    constructor() {
        this.canvas = document.getElementById('mazeCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resetBtn = document.getElementById('resetBtn');
        this.autoSolveBtn = document.getElementById('autoSolveBtn');
        
        this.maze = [];
        this.path = [];
        this.isAutoSolving = false;
        this.trailPoints = [];
        
        this.init();
    }

    init() {
        this.setupCanvas();
        this.generateMaze();
        this.bindEvents();
        this.animate();
        
        // Auto-solve demo every 10 seconds
        setInterval(() => {
            if (!this.isAutoSolving) {
                this.autoSolve();
            }
        }, 10000);
    }

    setupCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        this.cellSize = Math.floor(Math.min(this.canvas.width, this.canvas.height) / 20);
        this.cols = Math.floor(this.canvas.width / this.cellSize);
        this.rows = Math.floor(this.canvas.height / this.cellSize);
    }

    generateMaze() {
        this.maze = [];
        for (let row = 0; row < this.rows; row++) {
            this.maze[row] = [];
            for (let col = 0; col < this.cols; col++) {
                // Create a simple maze pattern
                const isWall = (row % 3 === 0 && col % 3 === 0) ||
                              (row === 0 || row === this.rows - 1) ||
                              (col === 0 || col === this.cols - 1) ||
                              (Math.random() < 0.15);
                this.maze[row][col] = isWall ? 1 : 0;
            }
        }
        
        // Ensure start and end are open
        this.maze[1][1] = 0; // Start
        this.maze[this.rows - 2][this.cols - 2] = 0; // End
        this.path = [];
    }

    bindEvents() {
        this.canvas.addEventListener('mousemove', (e) => this.handleMove(e));
        this.canvas.addEventListener('touchmove', (e) => this.handleMove(e));
        
        this.resetBtn.addEventListener('click', () => this.reset());
        this.autoSolveBtn.addEventListener('click', () => this.autoSolve());
        
        // Custom cursor trail for desktop
        if (window.innerWidth > 768) {
            document.addEventListener('mousemove', (e) => this.createCursorTrail(e));
        }
    }

    handleMove(e) {
        e.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        
        const col = Math.floor(x / this.cellSize);
        const row = Math.floor(y / this.cellSize);
        
        if (this.isValidCell(row, col)) {
            this.addToPath(row, col);
        }
    }

    createCursorTrail(e) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = e.clientX - 4 + 'px';
        trail.style.top = e.clientY - 4 + 'px';
        document.body.appendChild(trail);
        
        setTimeout(() => {
            trail.remove();
        }, 1000);
    }

    isValidCell(row, col) {
        return row >= 0 && row < this.rows && 
               col >= 0 && col < this.cols && 
               this.maze[row][col] === 0;
    }

    addToPath(row, col) {
        const point = { row, col, timestamp: Date.now() };
        this.path.push(point);
        
        // Limit path length
        if (this.path.length > 100) {
            this.path.shift();
        }
    }

    autoSolve() {
        if (this.isAutoSolving) return;
        
        this.isAutoSolving = true;
        this.path = [];
        
        // Simple pathfinding from start to end
        const start = { row: 1, col: 1 };
        const end = { row: this.rows - 2, col: this.cols - 2 };
        const solution = this.findPath(start, end);
        
        if (solution) {
            this.animateSolution(solution);
        }
    }

    findPath(start, end) {
        const queue = [start];
        const visited = new Set();
        const parent = new Map();
        
        visited.add(`${start.row},${start.col}`);
        
        while (queue.length > 0) {
            const current = queue.shift();
            
            if (current.row === end.row && current.col === end.col) {
                return this.reconstructPath(parent, start, end);
            }
            
            const neighbors = [
                { row: current.row - 1, col: current.col },
                { row: current.row + 1, col: current.col },
                { row: current.row, col: current.col - 1 },
                { row: current.row, col: current.col + 1 }
            ];
            
            for (const neighbor of neighbors) {
                const key = `${neighbor.row},${neighbor.col}`;
                if (!visited.has(key) && this.isValidCell(neighbor.row, neighbor.col)) {
                    visited.add(key);
                    parent.set(key, current);
                    queue.push(neighbor);
                }
            }
        }
        
        return null;
    }

    reconstructPath(parent, start, end) {
        const path = [];
        let current = end;
        
        while (current) {
            path.unshift(current);
            const key = `${current.row},${current.col}`;
            current = parent.get(key);
        }
        
        return path;
    }

    animateSolution(solution) {
        let index = 0;
        const interval = setInterval(() => {
            if (index < solution.length) {
                this.addToPath(solution[index].row, solution[index].col);
                index++;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    this.isAutoSolving = false;
                }, 2000);
            }
        }, 50);
    }

    reset() {
        this.generateMaze();
        this.isAutoSolving = false;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw maze
        this.ctx.fillStyle = '#2d3748';
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.maze[row][col] === 1) {
                    this.ctx.fillRect(
                        col * this.cellSize,
                        row * this.cellSize,
                        this.cellSize,
                        this.cellSize
                    );
                }
            }
        }
        
        // Draw start and end
        this.ctx.fillStyle = '#48bb78';
        this.ctx.fillRect(this.cellSize, this.cellSize, this.cellSize, this.cellSize);
        
        this.ctx.fillStyle = '#f56565';
        this.ctx.fillRect(
            (this.cols - 2) * this.cellSize,
            (this.rows - 2) * this.cellSize,
            this.cellSize,
            this.cellSize
        );
        
        // Draw path with trail effect
        const now = Date.now();
        this.path.forEach((point, index) => {
            const age = now - point.timestamp;
            const opacity = Math.max(0, 1 - age / 2000);
            const size = Math.max(2, this.cellSize * 0.6 * opacity);
            
            const gradient = this.ctx.createRadialGradient(
                point.col * this.cellSize + this.cellSize / 2,
                point.row * this.cellSize + this.cellSize / 2,
                0,
                point.col * this.cellSize + this.cellSize / 2,
                point.row * this.cellSize + this.cellSize / 2,
                size / 2
            );
            
            gradient.addColorStop(0, `rgba(100, 255, 218, ${opacity})`);
            gradient.addColorStop(1, `rgba(0, 188, 212, ${opacity * 0.5})`);
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(
                point.col * this.cellSize + this.cellSize / 2,
                point.row * this.cellSize + this.cellSize / 2,
                size / 2,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
        });
        
        // Clean up old path points
        this.path = this.path.filter(point => now - point.timestamp < 2000);
    }

    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MazeCursorTrail();
});

// Handle resize
window.addEventListener('resize', () => {
    const maze = new MazeCursorTrail();
});