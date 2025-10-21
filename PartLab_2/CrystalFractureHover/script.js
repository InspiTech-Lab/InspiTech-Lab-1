class CrystalFracture {
    constructor() {
        this.init();
        this.setupAutoAnimation();
        this.createParticleSystem();
    }

    init() {
        this.crystalCards = document.querySelectorAll('.crystal-card');
        this.setupEventListeners();
        this.setupTouchSupport();
    }

    setupEventListeners() {
        this.crystalCards.forEach(card => {
            // Mouse events
            card.addEventListener('mouseenter', () => this.fractureCrystal(card));
            card.addEventListener('mouseleave', () => this.healCrystal(card));
            
            // Click for additional effect
            card.addEventListener('click', () => this.shatterEffect(card));
        });
    }

    setupTouchSupport() {
        this.crystalCards.forEach(card => {
            let touchTimeout;
            
            card.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.fractureCrystal(card);
                card.classList.add('fractured');
                
                // Auto-heal after touch
                clearTimeout(touchTimeout);
                touchTimeout = setTimeout(() => {
                    this.healCrystal(card);
                    card.classList.remove('fractured');
                }, 1500);
            });
            
            card.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.shatterEffect(card);
            });
        });
    }

    fractureCrystal(card) {
        const fractureLines = card.querySelectorAll('.fracture-line');
        
        fractureLines.forEach((line, index) => {
            setTimeout(() => {
                line.style.width = '120px';
                line.style.boxShadow = '0 0 20px #fff, 0 0 40px #64b3f4';
                
                // Add crack sound effect (visual feedback)
                this.createCrackParticles(card);
            }, index * 100);
        });
        
        // Crystal surface effect
        const surface = card.querySelector('.crystal-surface');
        surface.style.transform = 'scale(1.05) rotateY(10deg)';
        surface.style.filter = 'brightness(1.3) contrast(1.2)';
    }

    healCrystal(card) {
        const fractureLines = card.querySelectorAll('.fracture-line');
        
        fractureLines.forEach((line, index) => {
            setTimeout(() => {
                line.style.width = '0';
                line.style.boxShadow = '0 0 10px #fff';
            }, index * 50);
        });
        
        // Reset crystal surface
        const surface = card.querySelector('.crystal-surface');
        surface.style.transform = '';
        surface.style.filter = '';
    }

    shatterEffect(card) {
        // Intense fracture animation
        const fractureOverlay = card.querySelector('.fracture-overlay');
        fractureOverlay.style.animation = 'shatterPulse 0.6s ease-out';
        
        // Create explosion particles
        this.createShatterParticles(card);
        
        // Reset animation
        setTimeout(() => {
            fractureOverlay.style.animation = '';
        }, 600);
    }

    createCrackParticles(card) {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                left: ${centerX}px;
                top: ${centerY}px;
                width: 4px;
                height: 4px;
                background: #64b3f4;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                animation: crackParticle 1s ease-out forwards;
            `;
            
            const angle = (i / 6) * Math.PI * 2;
            const distance = 40 + Math.random() * 20;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            particle.style.setProperty('--end-x', `${x}px`);
            particle.style.setProperty('--end-y', `${y}px`);
            
            document.body.appendChild(particle);
            
            setTimeout(() => particle.remove(), 1000);
        }
    }

    createShatterParticles(card) {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                left: ${centerX}px;
                top: ${centerY}px;
                width: 6px;
                height: 6px;
                background: linear-gradient(45deg, #64b3f4, #c2e59c);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                animation: shatterParticle 1.5s ease-out forwards;
                box-shadow: 0 0 10px #64b3f4;
            `;
            
            const angle = (i / 12) * Math.PI * 2;
            const distance = 60 + Math.random() * 40;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            particle.style.setProperty('--end-x', `${x}px`);
            particle.style.setProperty('--end-y', `${y}px`);
            
            document.body.appendChild(particle);
            
            setTimeout(() => particle.remove(), 1500);
        }
    }

    setupAutoAnimation() {
        // Auto-fracture crystals in sequence every 8 seconds
        let currentIndex = 0;
        
        setInterval(() => {
            const card = this.crystalCards[currentIndex];
            this.fractureCrystal(card);
            
            setTimeout(() => {
                this.healCrystal(card);
            }, 2000);
            
            currentIndex = (currentIndex + 1) % this.crystalCards.length;
        }, 8000);
    }

    createParticleSystem() {
        // Background ambient particles
        setInterval(() => {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                left: ${Math.random() * 100}%;
                top: 100%;
                width: 2px;
                height: 2px;
                background: rgba(100, 179, 244, 0.5);
                border-radius: 50%;
                pointer-events: none;
                z-index: 0;
                animation: ambientRise 10s linear forwards;
            `;
            
            document.body.appendChild(particle);
            
            setTimeout(() => particle.remove(), 10000);
        }, 800);
    }
}

// Add dynamic animations
const style = document.createElement('style');
style.textContent = `
    @keyframes crackParticle {
        0% {
            transform: translate(0, 0) scale(0);
            opacity: 1;
        }
        100% {
            transform: translate(var(--end-x), var(--end-y)) scale(1);
            opacity: 0;
        }
    }
    
    @keyframes shatterParticle {
        0% {
            transform: translate(0, 0) scale(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translate(var(--end-x), var(--end-y)) scale(0.5) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes shatterPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); filter: brightness(2); }
    }
    
    @keyframes ambientRise {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
        }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CrystalFracture();
});