class MagneticButton {
    constructor() {
        this.button = document.getElementById('magneticBtn');
        this.cursorTrail = document.getElementById('cursorTrail');
        this.particles = [];
        this.isAttracting = false;
        this.isHovering = false;
        this.rafId = null;
        this.particleRafId = null;
        
        this.init();
        this.createParticles();
        this.animateParticles();
    }
    
    init() {
        if (window.innerWidth > 768) {
            this.setupDesktopEvents();
            this.setupCursorTrail();
        } else {
            this.setupMobileEvents();
        }
    }
    
    createParticles() {
        const particleCount = window.innerWidth > 768 ? 25 : 15;
        
        for (let i = 0; i <= 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random position around the screen
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.animationDelay = `${Math.random() * 3}s`;
            particle.style.animation = `particleFloat ${3 + Math.random() * 2}s ease-in-out infinite`;
            
            document.body.appendChild(particle);
            
            this.particles.push({
                element: particle,
                originalX: x,
                originalY: y,
                currentX: x,
                currentY: y
            });
        }
    }
    
    animateParticles() {
        const animate = () => {
            if (this.isAttracting) {
                this.attractParticles();
            } else if (!this.isHovering) {
                this.spreadParticles();
            }
            
            this.particleRafId = requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    attractParticles() {
        const buttonRect = this.button.getBoundingClientRect();
        const buttonCenterX = buttonRect.left + buttonRect.width / 2;
        const buttonCenterY = buttonRect.top + buttonRect.height / 2;
        
        this.particles.forEach(particle => {
            const dx = buttonCenterX - particle.currentX;
            const dy = buttonCenterY - particle.currentY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 50) {
                particle.currentX += dx * 0.08;
                particle.currentY += dy * 0.08;
                
                particle.element.style.left = `${particle.currentX}px`;
                particle.element.style.top = `${particle.currentY}px`;
                particle.element.classList.add('attracted');
            }
        });
    }
    
    spreadParticles() {
        this.particles.forEach(particle => {
            const dx = particle.originalX - particle.currentX;
            const dy = particle.originalY - particle.currentY;
            
            particle.currentX += dx * 0.05;
            particle.currentY += dy * 0.05;
            
            particle.element.style.left = `${particle.currentX}px`;
            particle.element.style.top = `${particle.currentY}px`;
            particle.element.classList.remove('attracted');
            particle.element.classList.add('spreading');
            
            setTimeout(() => {
                particle.element.classList.remove('spreading');
            }, 1200);
        });
    }
    
    setupDesktopEvents() {
        this.button.addEventListener('mouseenter', (e) => {
            this.isHovering = true;
            this.isAttracting = true;
            this.startMagneticEffect(e);
        });
        
        this.button.addEventListener('mouseleave', () => {
            this.isHovering = false;
            this.isAttracting = false;
            this.resetButton();
        });
        
        this.button.addEventListener('mousemove', (e) => {
            if (this.isHovering) {
                this.updateMagneticEffect(e);
            }
        });
        
        this.button.addEventListener('click', () => {
            this.isAttracting = !this.isAttracting;
            this.createMagneticPulse();
        });
    }
    
    createMagneticPulse() {
        const pulse = document.createElement('div');
        pulse.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100px;
            height: 100px;
            border: 3px solid rgba(100, 200, 255, 0.8);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            pointer-events: none;
            z-index: 1000;
            animation: magneticPulse 1s ease-out forwards;
        `;
        
        this.button.appendChild(pulse);
        
        setTimeout(() => {
            pulse.remove();
        }, 1000);
    }
    
    setupMobileEvents() {
        this.button.addEventListener('touchstart', () => {
            this.button.style.transform = 'scale(0.95)';
            this.isAttracting = true;
        });
        
        this.button.addEventListener('touchend', () => {
            this.button.style.transform = 'scale(1)';
            this.isAttracting = false;
            this.createTouchBurst();
        });
    }
    
    setupCursorTrail() {
        document.addEventListener('mousemove', (e) => {
            if (this.rafId) {
                cancelAnimationFrame(this.rafId);
            }
            
            this.rafId = requestAnimationFrame(() => {
                this.cursorTrail.style.left = `${e.clientX - 10}px`;
                this.cursorTrail.style.top = `${e.clientY - 10}px`;
            });
        });
    }
    
    startMagneticEffect(e) {
        const rect = this.button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        this.updateMagneticEffect(e);
    }
    
    updateMagneticEffect(e) {
        const rect = this.button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - centerX) * 0.3;
        const deltaY = (e.clientY - centerY) * 0.3;
        
        this.button.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.05)`;
    }
    
    resetButton() {
        this.button.style.transform = 'translate(0, 0) scale(1)';
    }
    
    createTouchBurst() {
        const burst = document.createElement('div');
        burst.className = 'touch-burst';
        burst.style.cssText = `
            position: absolute;
            width: 100px;
            height: 100px;
            border: 2px solid rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            pointer-events: none;
            animation: touchBurst 0.6s ease-out forwards;
        `;
        
        this.button.appendChild(burst);
        
        setTimeout(() => {
            burst.remove();
        }, 600);
    }
}

// Add touch burst animation
const style = document.createElement('style');
style.textContent = `
    @keyframes touchBurst {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
        }
    }
    
    @keyframes magneticPulse {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
        }
        50% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0.6;
        }
        100% {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MagneticButton();
});

// Auto-demo for reels
setInterval(() => {
    if (window.innerWidth > 768) {
        const button = document.getElementById('magneticBtn');
        button.classList.add('magnetic-active');
        
        // Trigger magnetic attraction for demo
        const magneticBtn = new MagneticButton();
        magneticBtn.isAttracting = true;
        
        setTimeout(() => {
            button.classList.remove('magnetic-active');
            magneticBtn.isAttracting = false;
        }, 600);
    }
}
)