// Enhanced hexagon loader with interactive effects
class HexagonLoader {
    constructor() {
        this.init();
    }

    init() {
        this.setupClickInteraction();
        this.setupProgressAnimation();
        this.setupParticleEffects();
    }

    setupClickInteraction() {
        const hexagon = document.querySelector('.hexagon');
        const progressText = document.querySelector('.progress-text');
        
        hexagon.addEventListener('click', () => {
            hexagon.style.animationPlayState = 
                hexagon.style.animationPlayState === 'paused' ? 'running' : 'paused';
            
            progressText.textContent = 
                hexagon.style.animationPlayState === 'paused' ? 'Paused' : 'Loading...';
        });
    }

    setupProgressAnimation() {
        const progressText = document.querySelector('.progress-text');
        const messages = ['Loading...', 'Processing...', 'Almost Ready...', 'Complete!'];
        let messageIndex = 0;

        setInterval(() => {
            progressText.textContent = messages[messageIndex];
            messageIndex = (messageIndex + 1) % messages.length;
        }, 3000);
    }

    setupParticleEffects() {
        const particlesContainer = document.querySelector('.particles');
        
        // Create additional particles dynamically
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (4 + Math.random() * 4) + 's';
            particlesContainer.appendChild(particle);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HexagonLoader();
});

// Add touch support for mobile
document.addEventListener('touchstart', (e) => {
    const hexagon = document.querySelector('.hexagon');
    if (e.target.closest('.hexagon')) {
        hexagon.style.transform = 'scale(0.95)';
    }
});

document.addEventListener('touchend', (e) => {
    const hexagon = document.querySelector('.hexagon');
    if (e.target.closest('.hexagon')) {
        hexagon.style.transform = 'scale(1)';
    }
});