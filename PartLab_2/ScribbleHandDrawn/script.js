class ScribbleAnimation {
    constructor() {
        this.init();
        this.createBackgroundParticles();
        this.startAutoAnimation();
    }

    init() {
        this.drawBtn = document.getElementById('drawBtn');
        this.drawingCanvas = document.getElementById('drawingCanvas');
        this.particles = document.getElementById('particles');
        
        this.drawBtn.addEventListener('click', () => this.triggerDrawEffect());
        this.setupTouchInteractions();
    }

    setupTouchInteractions() {
        // Touch interactions for mobile
        this.drawingCanvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.createTouchParticles(e.touches[0]);
        });
        
        this.drawingCanvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.createTouchParticles(e.touches[0]);
        });
    }

    triggerDrawEffect() {
        // Restart scribble animations
        const paths = document.querySelectorAll('.scribble-path');
        paths.forEach(path => {
            path.style.animation = 'none';
            path.offsetHeight; // Trigger reflow
            path.style.animation = null;
        });
        
        // Create burst particles
        this.createBurstParticles();
        
        // Button feedback
        this.drawBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.drawBtn.style.transform = '';
        }, 150);
    }

    createTouchParticles(touch) {
        const rect = this.drawingCanvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        for (let i = 0; i < 3; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.setProperty('--random-x', `${(Math.random() - 0.5) * 100}px`);
            particle.style.setProperty('--random-y', `${(Math.random() - 0.5) * 100}px`);
            particle.style.background = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFD93D'][Math.floor(Math.random() * 4)];
            
            this.drawingCanvas.appendChild(particle);
            
            setTimeout(() => particle.remove(), 3000);
        }
    }

    createBurstParticles() {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.position = 'fixed';
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.width = '6px';
            particle.style.height = '6px';
            particle.style.zIndex = '1000';
            
            const angle = (i / 12) * Math.PI * 2;
            const distance = 150;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            particle.style.setProperty('--random-x', `${x}px`);
            particle.style.setProperty('--random-y', `${y}px`);
            particle.style.background = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFD93D'][Math.floor(Math.random() * 4)];
            
            this.particles.appendChild(particle);
            
            setTimeout(() => particle.remove(), 3000);
        }
    }

    createBackgroundParticles() {
        setInterval(() => {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = '2px';
            particle.style.height = '2px';
            particle.style.background = 'rgba(255, 255, 255, 0.5)';
            particle.style.borderRadius = '50%';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = '100%';
            particle.style.pointerEvents = 'none';
            particle.style.animation = 'particleRise 8s linear forwards';
            
            this.particles.appendChild(particle);
            
            setTimeout(() => particle.remove(), 8000);
        }, 500);
    }

    startAutoAnimation() {
        // Auto-restart animation every 16 seconds
        setInterval(() => {
            this.triggerDrawEffect();
        }, 16000);
    }
}

// Add particle rise animation
const style = document.createElement('style');
style.textContent = `
    @keyframes particleRise {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ScribbleAnimation();
});