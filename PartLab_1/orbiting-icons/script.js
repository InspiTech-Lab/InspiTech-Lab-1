// Orbiting Icons Animation Controller
class OrbitingIcons {
    constructor() {
        this.isBoostMode = false;
        this.init();
    }

    init() {
        this.setupCenterHubInteraction();
        this.setupIconInteractions();
        this.setupRandomEffects();
    }

    setupCenterHubInteraction() {
        const centerHub = document.querySelector('.center-hub');
        const orbits = document.querySelectorAll('.orbit');
        const interactionText = document.querySelector('.interaction-text');

        centerHub.addEventListener('click', () => {
            this.toggleBoostMode(orbits, interactionText);
        });
    }

    toggleBoostMode(orbits, interactionText) {
        this.isBoostMode = !this.isBoostMode;
        
        orbits.forEach((orbit, index) => {
            if (this.isBoostMode) {
                orbit.style.animationDuration = `${2 + index}s`;
                orbit.style.filter = 'brightness(1.5) saturate(1.5)';
                interactionText.textContent = 'BOOST MODE ACTIVATED! 🚀';
            } else {
                orbit.style.animationDuration = `${6 + index * 2}s`;
                orbit.style.filter = 'brightness(1) saturate(1)';
                interactionText.textContent = 'Tap the center to boost!';
            }
        });

        // Add burst effect
        this.createBurstEffect();
    }

    setupIconInteractions() {
        const orbitIcons = document.querySelectorAll('.orbit-icon');
        
        orbitIcons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                this.createIconClickEffect(icon);
            });
        });
    }

    createIconClickEffect(icon) {
        icon.style.transform = 'scale(1.5)';
        icon.style.filter = 'brightness(2)';
        
        setTimeout(() => {
            icon.style.transform = '';
            icon.style.filter = '';
        }, 300);
        
        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            width: 60px;
            height: 60px;
            border: 2px solid rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            pointer-events: none;
            animation: rippleEffect 1s ease-out forwards;
        `;
        
        icon.appendChild(ripple);
        setTimeout(() => ripple.remove(), 1000);
    }

    createBurstEffect() {
        const centerHub = document.querySelector('.center-hub');
        
        for (let i = 0; i < 8; i++) {
            const burst = document.createElement('div');
            burst.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: white;
                border-radius: 50%;
                pointer-events: none;
                animation: burstEffect 1s ease-out forwards;
                animation-delay: ${i * 0.1}s;
                transform: rotate(${i * 45}deg) translateY(-40px);
            `;
            
            centerHub.appendChild(burst);
            setTimeout(() => burst.remove(), 1200);
        }
    }

    setupRandomEffects() {
        // Randomly highlight icons
        setInterval(() => {
            const icons = document.querySelectorAll('.orbit-icon');
            const randomIcon = icons[Math.floor(Math.random() * icons.length)];
            
            randomIcon.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.8)';
            randomIcon.style.transform = 'scale(1.1)';
            
            setTimeout(() => {
                randomIcon.style.boxShadow = '';
                randomIcon.style.transform = '';
            }, 800);
        }, 2000);
    }
}

// CSS animations added dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleEffect {
        from {
            transform: scale(0);
            opacity: 1;
        }
        to {
            transform: scale(3);
            opacity: 0;
        }
    }
    
    @keyframes burstEffect {
        from {
            opacity: 1;
            transform: rotate(var(--angle)) translateY(-40px) scale(1);
        }
        to {
            opacity: 0;
            transform: rotate(var(--angle)) translateY(-80px) scale(0);
        }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new OrbitingIcons();
});