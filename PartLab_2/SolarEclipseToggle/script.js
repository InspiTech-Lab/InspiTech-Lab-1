class SolarEclipseToggle {
    constructor() {
        this.toggle = document.getElementById('eclipseToggle');
        this.statusText = document.getElementById('statusText');
        this.starsField = document.getElementById('starsField');
        this.sun = document.getElementById('sun');
        this.moon = document.getElementById('moon');
        this.corona = document.getElementById('corona');
        
        this.isEclipse = false;
        this.autoToggleTimer = null;
        
        this.init();
        this.bindEvents();
    }
    
    init() {
        this.createStars();
        this.startAutoToggle();
    }
    
    createStars() {
        const starCount = 150;
        
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const delay = Math.random() * 3;
            const duration = 2 + Math.random() * 2;
            
            star.style.left = `${x}%`;
            star.style.top = `${y}%`;
            star.style.animationDelay = `${delay}s`;
            star.style.animationDuration = `${duration}s`;
            
            this.starsField.appendChild(star);
        }
    }
    
    toggleEclipse() {
        this.isEclipse = !this.isEclipse;
        this.toggle.checked = this.isEclipse;
        
        if (this.isEclipse) {
            this.activateEclipse();
        } else {
            this.deactivateEclipse();
        }
        
        this.resetAutoToggle();
    }
    
    activateEclipse() {
        document.body.classList.add('eclipse-active');
        this.statusText.textContent = 'Solar Eclipse Active';
        
        // Create eclipse sound effect (visual representation)
        this.createEclipseRipple();
        
        // Animate sun dimming
        this.sun.style.animation = 'sunDim 3s ease-in-out forwards';
        
        setTimeout(() => {
            this.createCoronaFlares();
        }, 1500);
    }
    
    deactivateEclipse() {
        document.body.classList.remove('eclipse-active');
        this.statusText.textContent = 'Daylight Mode';
        
        // Restore sun animation
        this.sun.style.animation = 'sunPulse 4s ease-in-out infinite';
    }
    
    createEclipseRipple() {
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.top = '50%';
        ripple.style.left = '50%';
        ripple.style.width = '0';
        ripple.style.height = '0';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'radial-gradient(circle, rgba(255,255,255,0.1), transparent)';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.pointerEvents = 'none';
        ripple.style.zIndex = '15';
        ripple.style.animation = 'eclipseRipple 3s ease-out forwards';
        
        this.sun.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 3000);
    }
    
    createCoronaFlares() {
        const flareCount = 8;
        
        for (let i = 0; i < flareCount; i++) {
            const flare = document.createElement('div');
            flare.style.position = 'absolute';
            flare.style.width = '2px';
            flare.style.height = '40px';
            flare.style.background = 'linear-gradient(to top, transparent, rgba(255,255,255,0.8), transparent)';
            flare.style.top = '50%';
            flare.style.left = '50%';
            flare.style.transformOrigin = 'bottom';
            flare.style.transform = `translate(-50%, -100%) rotate(${i * 45}deg)`;
            flare.style.animation = `flareGlow 2s ease-in-out infinite alternate`;
            flare.style.animationDelay = `${i * 0.2}s`;
            
            this.corona.appendChild(flare);
            
            setTimeout(() => flare.remove(), 6000);
        }
    }
    
    startAutoToggle() {
        this.autoToggleTimer = setTimeout(() => {
            this.toggleEclipse();
        }, 3000);
    }
    
    resetAutoToggle() {
        clearTimeout(this.autoToggleTimer);
        this.autoToggleTimer = setTimeout(() => {
            this.toggleEclipse();
        }, 6000);
    }
    
    bindEvents() {
        this.toggle.addEventListener('change', () => {
            this.isEclipse = this.toggle.checked;
            
            if (this.isEclipse) {
                this.activateEclipse();
            } else {
                this.deactivateEclipse();
            }
            
            this.resetAutoToggle();
        });
        
        // Touch support for mobile
        this.toggle.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.toggleEclipse();
        });
    }
}

// Add dynamic CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes sunDim {
        0% {
            box-shadow: 0 0 50px rgba(255, 215, 0, 0.8);
            transform: scale(1);
        }
        100% {
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
            transform: scale(0.95);
        }
    }
    
    @keyframes eclipseRipple {
        0% {
            width: 0;
            height: 0;
            opacity: 1;
        }
        100% {
            width: 400px;
            height: 400px;
            opacity: 0;
        }
    }
    
    @keyframes flareGlow {
        0% {
            opacity: 0.3;
            transform: translate(-50%, -100%) rotate(var(--rotation, 0deg)) scaleY(0.8);
        }
        100% {
            opacity: 1;
            transform: translate(-50%, -100%) rotate(var(--rotation, 0deg)) scaleY(1.2);
        }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SolarEclipseToggle();
});