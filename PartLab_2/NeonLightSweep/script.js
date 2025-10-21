class NeonLightSweep {
    constructor() {
        this.cards = document.querySelectorAll('.neon-card');
        this.button = document.getElementById('triggerBtn');
        this.isActive = false;
        
        this.init();
        this.bindEvents();
    }
    
    init() {
        this.setCustomProperties();
        setTimeout(() => this.autoTrigger(), 2000);
    }
    
    setCustomProperties() {
        this.cards.forEach(card => {
            const color = card.dataset.color;
            const border = card.querySelector('.neon-border');
            
            switch(color) {
                case 'cyan':
                    card.style.setProperty('--neon-color', 'rgba(0, 255, 255, 0.8)');
                    card.style.setProperty('--glow-color', 'rgba(0, 255, 255, 0.3)');
                    break;
                case 'pink':
                    card.style.setProperty('--neon-color', 'rgba(255, 0, 255, 0.8)');
                    card.style.setProperty('--glow-color', 'rgba(255, 0, 255, 0.3)');
                    break;
                case 'green':
                    card.style.setProperty('--neon-color', 'rgba(0, 255, 0, 0.8)');
                    card.style.setProperty('--glow-color', 'rgba(0, 255, 0, 0.3)');
                    break;
            }
        });
    }
    
    activateIntenseSweep() {
        if (this.isActive) return;
        this.isActive = true;
        
        this.button.classList.add('active');
        
        this.cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('glow-pulse');
                const border = card.querySelector('.neon-border');
                border.style.animationDuration = '0.5s';
                border.style.animationIterationCount = '6';
                
                setTimeout(() => {
                    card.classList.remove('glow-pulse');
                    border.style.animationDuration = '4s';
                    border.style.animationIterationCount = 'infinite';
                }, 3000);
            }, index * 200);
        });
        
        setTimeout(() => {
            this.isActive = false;
            this.button.classList.remove('active');
        }, 4000);
    }
    
    autoTrigger() {
        this.activateIntenseSweep();
        setTimeout(() => this.autoTrigger(), 8000);
    }
    
    createSparkleEffect(element) {
        const rect = element.getBoundingClientRect();
        const sparkleCount = 12;
        
        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement('div');
            sparkle.style.position = 'absolute';
            sparkle.style.width = '4px';
            sparkle.style.height = '4px';
            sparkle.style.background = 'radial-gradient(circle, #fff, transparent)';
            sparkle.style.borderRadius = '50%';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '1000';
            
            const x = rect.left + Math.random() * rect.width;
            const y = rect.top + Math.random() * rect.height;
            
            sparkle.style.left = x + 'px';
            sparkle.style.top = y + 'px';
            
            sparkle.style.animation = 'sparkle 1.5s ease-out forwards';
            
            document.body.appendChild(sparkle);
            
            setTimeout(() => sparkle.remove(), 1500);
        }
    }
    
    bindEvents() {
        this.button.addEventListener('click', () => {
            this.activateIntenseSweep();
            this.createSparkleEffect(this.button);
        });
        
        this.button.addEventListener('touchstart', () => {
            this.activateIntenseSweep();
            this.createSparkleEffect(this.button);
        });
        
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (!this.isActive) {
                    card.classList.add('glow-pulse');
                    setTimeout(() => card.classList.remove('glow-pulse'), 1000);
                }
            });
            
            card.addEventListener('click', () => {
                this.createSparkleEffect(card);
            });
        });
    }
}

// Add sparkle animation
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkle {
        0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
        }
        50% {
            transform: scale(1) rotate(180deg);
            opacity: 0.8;
        }
        100% {
            transform: scale(0) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NeonLightSweep();
});