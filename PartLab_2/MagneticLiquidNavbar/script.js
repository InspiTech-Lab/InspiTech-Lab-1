class MagneticLiquidNavbar {
    constructor() {
        this.init();
        this.setupMagneticEffect();
        this.createParticleSystem();
        this.startAutoDemo();
    }

    init() {
        this.navbar = document.getElementById('magneticNavbar');
        this.liquidBlob = document.getElementById('liquidBlob');
        this.magneticCursor = document.getElementById('magneticCursor');
        this.navItems = document.querySelectorAll('.nav-item');
        this.particles = document.getElementById('floatingParticles');
        
        this.currentActiveItem = null;
        this.isAnimating = false;
    }

    setupMagneticEffect() {
        this.navItems.forEach((item, index) => {
            // Mouse events
            item.addEventListener('mouseenter', (e) => this.activateMagneticField(e, index));
            item.addEventListener('mouseleave', () => this.deactivateMagneticField());
            item.addEventListener('mousemove', (e) => this.updateMagneticCursor(e));
            
            // Touch events for mobile
            item.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.activateMagneticField(e, index);
                this.addRippleEffect(e.target);
            });
            
            item.addEventListener('touchend', (e) => {
                e.preventDefault();
                setTimeout(() => this.deactivateMagneticField(), 300);
            });
        });

        // Navbar mouse leave
        this.navbar.addEventListener('mouseleave', () => this.deactivateMagneticField());
    }

    activateMagneticField(e, index) {
        if (this.isAnimating) return;
        
        this.currentActiveItem = index;
        const rect = e.target.getBoundingClientRect();
        const navbarRect = this.navbar.getBoundingClientRect();
        
        // Calculate position relative to navbar
        const x = rect.left - navbarRect.left + rect.width / 2;
        const y = rect.top - navbarRect.top + rect.height / 2;
        
        // Animate liquid blob to position
        this.liquidBlob.style.left = x + 'px';
        this.liquidBlob.style.top = y + 'px';
        this.liquidBlob.style.opacity = '1';
        this.liquidBlob.style.transform = 'translate(-50%, -50%) scale(1.2)';
        
        // Activate navbar
        this.navbar.classList.add('active');
        
        // Create magnetic particles
        this.createMagneticParticles(x, y);
        
        // Add magnetic distortion effect
        this.addMagneticDistortion(e.target);
    }

    deactivateMagneticField() {
        this.liquidBlob.style.opacity = '0';
        this.liquidBlob.style.transform = 'translate(-50%, -50%) scale(1)';
        this.magneticCursor.style.opacity = '0';
        
        setTimeout(() => {
            this.navbar.classList.remove('active');
        }, 300);
        
        this.currentActiveItem = null;
    }

    updateMagneticCursor(e) {
        const rect = this.navbar.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.magneticCursor.style.left = x + 'px';
        this.magneticCursor.style.top = y + 'px';
        this.magneticCursor.style.opacity = '0.6';
    }

    addRippleEffect(target) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            width: 100px;
            height: 100px;
            background: radial-gradient(circle, rgba(255, 107, 107, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: rippleExpand 0.6s ease-out forwards;
            pointer-events: none;
            z-index: 20;
        `;
        
        const rect = target.getBoundingClientRect();
        const navbarRect = this.navbar.getBoundingClientRect();
        
        ripple.style.left = (rect.left - navbarRect.left + rect.width / 2) + 'px';
        ripple.style.top = (rect.top - navbarRect.top + rect.height / 2) + 'px';
        
        this.navbar.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    addMagneticDistortion(target) {
        target.style.transform = 'scale(1.05) translateZ(10px)';
        target.style.zIndex = '15';
        
        // Reset after animation
        setTimeout(() => {
            target.style.transform = '';
            target.style.zIndex = '';
        }, 300);
    }

    createMagneticParticles(x, y) {
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 3px;
                height: 3px;
                background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
                border-radius: 50%;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                z-index: 25;
                animation: magneticParticle 1.2s ease-out forwards;
            `;
            
            const angle = (i / 8) * Math.PI * 2;
            const distance = 30 + Math.random() * 20;
            const endX = x + Math.cos(angle) * distance;
            const endY = y + Math.sin(angle) * distance;
            
            particle.style.setProperty('--end-x', `${endX - x}px`);
            particle.style.setProperty('--end-y', `${endY - y}px`);
            
            this.navbar.appendChild(particle);
            
            setTimeout(() => particle.remove(), 1200);
        }
    }

    createParticleSystem() {
        setInterval(() => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (10 + Math.random() * 10) + 's';
            particle.style.animationDelay = Math.random() * 2 + 's';
            
            // Random colors
            const colors = ['rgba(255, 107, 107, 0.6)', 'rgba(78, 205, 196, 0.6)', 'rgba(69, 183, 209, 0.6)'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            this.particles.appendChild(particle);
            
            setTimeout(() => particle.remove(), 15000);
        }, 1000);
    }

    startAutoDemo() {
        // Auto-demonstrate the effect every 12 seconds
        let currentIndex = 0;
        
        setInterval(() => {
            if (this.currentActiveItem !== null) return; // Don't interfere with user interaction
            
            const item = this.navItems[currentIndex];
            const rect = item.getBoundingClientRect();
            
            // Simulate hover
            this.activateMagneticField({ target: item, currentTarget: item }, currentIndex);
            
            setTimeout(() => {
                this.deactivateMagneticField();
            }, 2000);
            
            currentIndex = (currentIndex + 1) % this.navItems.length;
        }, 12000);
    }
}

// Add dynamic animations
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleExpand {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0.8;
        }
        100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
        }
    }
    
    @keyframes magneticParticle {
        0% {
            transform: translate(0, 0) scale(0);
            opacity: 1;
        }
        50% {
            transform: translate(calc(var(--end-x) * 0.7), calc(var(--end-y) * 0.7)) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(var(--end-x), var(--end-y)) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MagneticLiquidNavbar();
});