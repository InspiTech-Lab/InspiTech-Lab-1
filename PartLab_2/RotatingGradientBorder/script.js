class GradientBorderManager {
    constructor() {
        this.cards = document.querySelectorAll('.gradient-card');
        this.speedBtn = document.getElementById('speedBtn');
        this.reverseBtn = document.getElementById('reverseBtn');
        this.colorBtn = document.getElementById('colorBtn');
        this.buttons = document.querySelectorAll('.gradient-button');
        
        this.currentSpeed = 'normal';
        this.isReversed = false;
        this.colorSchemes = [
            '#ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3',
            '#ff9a9e, #fecfef, #fecfef, #ff9a9e, #a8edea, #fed6e3',
            '#d299c2, #fef9d7, #dee5fd, #b2f2bb, #ffb3ba, #bae1ff',
            '#ff7979, #fdcb6e, #6c5ce7, #fd79a8, #00b894, #0984e3',
            '#e17055, #fdcb6e, #00b894, #0984e3, #6c5ce7, #fd79a8'
        ];
        this.currentColorIndex = 0;
        
        this.init();
    }
    
    init() {
        // Button event listeners
        this.speedBtn.addEventListener('click', () => this.changeSpeed());
        this.reverseBtn.addEventListener('click', () => this.reverseDirection());
        this.colorBtn.addEventListener('click', () => this.changeColors());
        
        // Card hover effects
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', (e) => this.enhanceCard(e.target));
            card.addEventListener('mouseleave', (e) => this.normalizeCard(e.target));
            card.addEventListener('click', (e) => this.pulseCard(e.target));
        });
        
        // Touch events for mobile
        this.cards.forEach(card => {
            card.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.enhanceCard(e.target);
                this.pulseCard(e.target);
            });
            
            card.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.normalizeCard(e.target);
            });
        });
        
        // Auto cycle effects
        this.autoCycleEffects();
        
        // Particle effects on interaction
        this.addParticleEffects();
    }
    
    changeSpeed() {
        const speeds = ['normal', 'fast', 'slow'];
        const currentIndex = speeds.indexOf(this.currentSpeed);
        this.currentSpeed = speeds[(currentIndex + 1) % speeds.length];
        
        this.cards.forEach(card => {
            card.classList.remove('speed-slow', 'speed-fast');
            if (this.currentSpeed !== 'normal') {
                card.classList.add(`speed-${this.currentSpeed}`);
            }
        });
        
        this.speedBtn.textContent = `Speed: ${this.currentSpeed.toUpperCase()}`;
        this.animateButton(this.speedBtn);
    }
    
    reverseDirection() {
        this.isReversed = !this.isReversed;
        
        this.cards.forEach(card => {
            if (this.isReversed) {
                card.classList.add('reverse-animation');
            } else {
                card.classList.remove('reverse-animation');
            }
        });
        
        this.reverseBtn.textContent = this.isReversed ? 'Normal Direction' : 'Reverse Direction';
        this.animateButton(this.reverseBtn);
    }
    
    changeColors() {
        this.currentColorIndex = (this.currentColorIndex + 1) % this.colorSchemes.length;
        const newColors = this.colorSchemes[this.currentColorIndex];
        
        this.cards.forEach((card, index) => {
            const delay = index * 100;
            setTimeout(() => {
                card.style.background = `linear-gradient(45deg, ${newColors})`;
                card.style.backgroundSize = '300% 300%';
                
                // Update pseudo-element
                const style = document.createElement('style');
                style.textContent = `
                    .gradient-card::before {
                        background: linear-gradient(45deg, ${newColors});
                        background-size: 300% 300%;
                    }
                `;
                document.head.appendChild(style);
            }, delay);
        });
        
        this.colorBtn.textContent = `Colors: Scheme ${this.currentColorIndex + 1}`;
        this.animateButton(this.colorBtn);
    }
    
    enhanceCard(card) {
        card.style.transform = 'scale(1.08)';
        card.style.zIndex = '10';
        card.style.boxShadow = '0 10px 40px rgba(255, 255, 255, 0.3)';
        
        // Speed up animation on hover
        const currentDuration = card.style.animationDuration || '4s';
        card.style.animationDuration = '1s';
    }
    
    normalizeCard(card) {
        card.style.transform = 'scale(1)';
        card.style.zIndex = '1';
        card.style.boxShadow = 'none';
        
        // Reset animation speed
        setTimeout(() => {
            card.style.animationDuration = '4s';
        }, 300);
    }
    
    pulseCard(card) {
        card.style.animation = 'none';
        card.offsetHeight; // Trigger reflow
        card.style.animation = 'cardPulse 0.6s ease-in-out, gradientRotate 4s ease-in-out infinite';
    }
    
    animateButton(button) {
        button.style.transform = 'scale(1.1)';
        button.style.boxShadow = '0 5px 25px rgba(255, 107, 107, 0.6)';
        
        setTimeout(() => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 5px 20px rgba(255, 107, 107, 0.4)';
        }, 200);
    }
    
    autoCycleEffects() {
        setInterval(() => {
            // Randomly change colors
            if (Math.random() > 0.7) {
                this.changeColors();
            }
        }, 10000);
        
        setInterval(() => {
            // Randomly change speed
            if (Math.random() > 0.8) {
                this.changeSpeed();
            }
        }, 15000);
    }
    
    addParticleEffects() {
        this.cards.forEach(card => {
            card.addEventListener('click', (e) => {
                this.createClickParticles(e);
            });
        });
    }
    
    createClickParticles(event) {
        const rect = event.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.width = '6px';
            particle.style.height = '6px';
            particle.style.background = this.getRandomGradientColor();
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1000';
            
            const angle = (Math.PI * 2 * i) / 12;
            const distance = 60 + Math.random() * 40;
            const endX = centerX + Math.cos(angle) * distance;
            const endY = centerY + Math.sin(angle) * distance;
            
            particle.style.animation = `particleExplode 0.8s ease-out forwards`;
            particle.style.setProperty('--endX', endX + 'px');
            particle.style.setProperty('--endY', endY + 'px');
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 800);
        }
    }
    
    getRandomGradientColor() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}

// Add CSS animations for effects
const style = document.createElement('style');
style.textContent = `
    @keyframes cardPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.15); }
        100% { transform: scale(1); }
    }
    
    @keyframes particleExplode {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(calc(var(--endX) - 50vw), calc(var(--endY) - 50vh)) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the gradient border manager
document.addEventListener('DOMContentLoaded', () => {
    new GradientBorderManager();
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    const manager = new GradientBorderManager();
    
    switch(e.key.toLowerCase()) {
        case 's':
            manager.changeSpeed();
            break;
        case 'r':
            manager.reverseDirection();
            break;
        case 'c':
            manager.changeColors();
            break;
    }
});