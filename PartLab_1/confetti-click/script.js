class ConfettiEffect {
    constructor() {
        this.btn = document.getElementById('confettiBtn');
        this.container = document.getElementById('confettiContainer');
        this.clickCount = document.getElementById('clickCount');
        this.count = 0;
        this.colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#a8e6cf', '#ff8b94'];
        this.shapes = ['circle', 'square', 'triangle'];
        
        this.init();
    }
    
    init() {
        this.btn.addEventListener('click', () => this.createConfetti());
        
        // Auto demo every 8 seconds
        setInterval(() => {
            this.createConfetti();
        }, 8000);
    }
    
    createConfetti() {
        this.count++;
        this.clickCount.textContent = this.count;
        
        // Button animation
        this.btn.classList.add('clicked');
        setTimeout(() => {
            this.btn.classList.remove('clicked');
        }, 300);
        
        // Create confetti burst
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                this.createConfettiPiece();
            }, i * 10);
        }
    }
    
    createConfettiPiece() {
        const piece = document.createElement('div');
        piece.className = `confetti-piece ${this.getRandomShape()}`;
        
        // Random position around button
        const btnRect = this.btn.getBoundingClientRect();
        const centerX = btnRect.left + btnRect.width / 2;
        const centerY = btnRect.top + btnRect.height / 2;
        
        // Random spread
        const spreadX = (Math.random() - 0.5) * window.innerWidth;
        const spreadY = Math.random() * -200 - 100;
        
        piece.style.left = (centerX + spreadX) + 'px';
        piece.style.top = (centerY + spreadY) + 'px';
        piece.style.backgroundColor = this.getRandomColor();
        
        // Random animation duration and delay
        const duration = 2 + Math.random() * 2;
        piece.style.animationDuration = duration + 's';
        piece.style.animationDelay = Math.random() * 0.5 + 's';
        
        // Random size
        const size = 8 + Math.random() * 12;
        piece.style.width = size + 'px';
        piece.style.height = size + 'px';
        
        this.container.appendChild(piece);
        
        // Remove after animation
        setTimeout(() => {
            if (piece.parentNode) {
                piece.parentNode.removeChild(piece);
            }
        }, (duration + 0.5) * 1000);
    }
    
    getRandomColor() {
        return this.colors[Math.floor(Math.random() * this.colors.length)];
    }
    
    getRandomShape() {
        return this.shapes[Math.floor(Math.random() * this.shapes.length)];
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ConfettiEffect();
});