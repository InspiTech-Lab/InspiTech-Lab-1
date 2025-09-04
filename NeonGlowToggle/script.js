class NeonToggleEffect {
    constructor() {
        this.toggle = document.getElementById('neonToggle');
        this.powerFill = document.querySelector('.power-fill');
        this.sparks = document.querySelectorAll('.spark');
        this.lightning = document.querySelectorAll('.lightning');
        
        this.isAnimating = false;
        
        this.init();
        // this.startAutoDemo();
    }
    
    init() {
        this.toggle.addEventListener('change', (e) => {
            this.handleToggle(e.target.checked);
        });
        
        // Add click ripple effect
        document.addEventListener('click', (e) => {
            this.createRipple(e.clientX, e.clientY);
        });
        
        // Touch feedback
        this.toggle.addEventListener('touchstart', () => {
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
        });
    }
    
    handleToggle(isOn) {
        if (this.isAnimating) return;
        this.isAnimating = true;
        
        if (isOn) {
            this.activateEffects();
        } else {
            this.deactivateEffects();
        }
        
        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(isOn ? [50, 50, 50] : [30]);
        }
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 600);
    }
    
    activateEffects() {
        // Trigger lightning
        this.lightning.forEach((bolt, index) => {
            setTimeout(() => {
                bolt.style.animation = 'lightning 0.3s ease-in-out';
                setTimeout(() => {
                    bolt.style.animation = 'lightning 3s ease-in-out infinite';
                }, 300);
            }, index * 100);
        });
        
        // Create energy burst
        this.createEnergyBurst();
        
        // Screen flash effect
        this.createScreenFlash();
    }
    
    deactivateEffects() {
        // Fade out effects
        this.lightning.forEach(bolt => {
            bolt.style.opacity = '0';
            setTimeout(() => {
                bolt.style.opacity = '';
            }, 500);
        });
    }
    
    createEnergyBurst() {
        const burst = document.createElement('div');
        burst.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 10px;
            height: 10px;
            background: radial-gradient(circle, #00ffff, transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10;
            animation: energyBurst 0.8s ease-out;
        `;
        
        document.querySelector('.toggle-wrapper').appendChild(burst);
        
        setTimeout(() => {
            burst.remove();
        }, 800);
    }
    
    createScreenFlash() {
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0, 255, 255, 0.1);
            pointer-events: none;
            z-index: 100;
            animation: screenFlash 0.3s ease-out;
        `;
        
        document.body.appendChild(flash);
        
        setTimeout(() => {
            flash.remove();
        }, 300);
    }
    
    createRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: fixed;
            left: ${x - 25}px;
            top: ${y - 25}px;
            width: 50px;
            height: 50px;
            background: radial-gradient(circle, rgba(0, 255, 255, 0.3), transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            animation: rippleEffect 0.6s ease-out;
        `;
        
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    startAutoDemo() {
        // Auto toggle every 8 seconds
        setInterval(() => {
            if (!this.isAnimating) {
                this.toggle.checked = !this.toggle.checked;
                this.handleToggle(this.toggle.checked);
            }
        }, 8000);
        
        // Initial demo
        setTimeout(() => {
            this.toggle.checked = true;
            this.handleToggle(true);
        }, 1500);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NeonToggleEffect();
});

// Add dynamic CSS animations
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    @keyframes energyBurst {
        0% {
            width: 10px;
            height: 10px;
            opacity: 1;
        }
        100% {
            width: 200px;
            height: 200px;
            opacity: 0;
        }
    }
    
    @keyframes screenFlash {
        0% { opacity: 0; }
        50% { opacity: 1; }
        100% { opacity: 0; }
    }
    
    @keyframes rippleEffect {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(dynamicStyles);