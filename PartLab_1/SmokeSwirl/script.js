class SmokeEffect {
    constructor() {
        this.container = document.querySelector('.smoke-container');
        this.smokeParticles = document.querySelectorAll('.smoke-particle');
        this.emberContainer = document.querySelector('.ember-container');
        this.windArrow = document.querySelector('.wind-arrow');
        
        this.mouseX = 0;
        this.mouseY = 0;
        this.windStrength = 0;
        this.windDirection = 0;
        
        this.init();
        this.createEmbers();
        this.startWindAnimation();
    }
    
    init() {
        // Mouse tracking
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.updateWindEffect(e);
            this.createCursorTrail(e);
        });
        
        // Touch tracking for mobile
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                this.mouseX = touch.clientX;
                this.mouseY = touch.clientY;
                this.updateWindEffect(touch);
            }
        });
        
        // Apply initial CSS variables
        this.smokeParticles.forEach((particle, index) => {
            particle.style.setProperty('--start-x', `${-50 + (index * 10)}%`);
        });
    }
    
    updateWindEffect(e) {
        const rect = document.querySelector('.smoke-chamber').getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate wind strength and direction based on cursor position
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        this.windStrength = Math.min(distance / 200, 1);
        this.windDirection = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        
        // Update wind indicator
        this.windArrow.style.transform = `rotate(${this.windDirection}deg)`;
        this.windArrow.style.opacity = 0.3 + this.windStrength * 0.7;
        
        // Apply wind effect to smoke particles
        this.smokeParticles.forEach((particle, index) => {
            const windX = Math.cos(this.windDirection * Math.PI / 180) * this.windStrength * 50;
            const windY = Math.sin(this.windDirection * Math.PI / 180) * this.windStrength * 30;
            
            particle.style.setProperty('--wind-x', `${windX}px`);
            particle.style.setProperty('--wind-y', `${windY}px`);
            particle.style.animationPlayState = this.windStrength > 0.1 ? 'running' : 'running';
        });
    }
    
    createCursorTrail(e) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = e.clientX - 10 + 'px';
        trail.style.top = e.clientY - 10 + 'px';
        
        document.body.appendChild(trail);
        
        // Animate trail
        let opacity = 0.5;
        let scale = 1;
        
        const fadeOut = () => {
            opacity -= 0.02;
            scale += 0.02;
            
            trail.style.opacity = opacity;
            trail.style.transform = `scale(${scale})`;
            
            if (opacity > 0) {
                requestAnimationFrame(fadeOut);
            } else {
                trail.remove();
            }
        };
        
        requestAnimationFrame(fadeOut);
    }
    
    createEmbers() {
        const createEmber = () => {
            const ember = document.createElement('div');
            ember.className = 'ember';
            
            const startX = 180 + Math.random() * 40;
            const startY = window.innerHeight - 100;
            
            ember.style.left = startX + 'px';
            ember.style.top = startY + 'px';
            
            this.emberContainer.appendChild(ember);
            
            // Remove ember after animation
            setTimeout(() => {
                ember.remove();
            }, 6000);
        };
        
        // Create embers periodically
        setInterval(createEmber, 800);
        
        // Initial embers
        setTimeout(() => {
            for (let i = 0; i < 3; i++) {
                setTimeout(createEmber, i * 300);
            }
        }, 1000);
    }
    
    startWindAnimation() {
        // Automatic wind simulation
        setInterval(() => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            // Create simulated wind movement
            const angle = (Date.now() * 0.001) % (Math.PI * 2);
            const radius = 100 + Math.sin(Date.now() * 0.002) * 50;
            
            const fakeEvent = {
                clientX: centerX + Math.cos(angle) * radius,
                clientY: centerY + Math.sin(angle) * radius
            };
            
            this.updateWindEffect(fakeEvent);
        }, 100);
    }
}

// Advanced smoke physics
class SmokePhysics {
    constructor() {
        this.particles = [];
        this.canvas = this.createCanvas();
        this.ctx = this.canvas.getContext('2d');
        this.init();
    }
    
    createCanvas() {
        const canvas = document.createElement('canvas');
        canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        
        document.querySelector('.smoke-chamber').appendChild(canvas);
        return canvas;
    }
    
    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }
    
    resize() {
        const rect = document.querySelector('.smoke-chamber').getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Create new particles
        if (Math.random() < 0.3) {
            this.particles.push({
                x: this.canvas.width / 2 + (Math.random() - 0.5) * 20,
                y: this.canvas.height - 80,
                vx: (Math.random() - 0.5) * 2,
                vy: -Math.random() * 3 - 1,
                size: Math.random() * 10 + 5,
                opacity: Math.random() * 0.5 + 0.3,
                life: Math.random() * 100 + 50
            });
        }
        
        // Update and draw particles
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy -= 0.02; // Gravity
            particle.vx *= 0.98; // Air resistance
            particle.size *= 1.01; // Expansion
            particle.opacity *= 0.995; // Fade
            particle.life--;
            
            // Draw particle
            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = '#aaaaaa';
            this.ctx.filter = `blur(${particle.size * 0.1}px)`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
            
            return particle.life > 0 && particle.opacity > 0.01;
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    new SmokeEffect();
    new SmokePhysics();
});

// Add dynamic CSS for wind-affected smoke
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    .smoke-particle {
        --wind-x: 0px;
        --wind-y: 0px;
    }
    
    @keyframes smokeRise {
        0% {
            opacity: 0;
            transform: translateX(var(--start-x)) translateY(0) scale(0.5) rotate(0deg);
            filter: blur(0px);
        }
        10% {
            opacity: 0.8;
            transform: translateX(calc(var(--start-x) + var(--wind-x) * 0.1)) translateY(calc(-50px + var(--wind-y) * 0.1)) scale(0.7) rotate(10deg);
            filter: blur(1px);
        }
        50% {
            opacity: 0.6;
            transform: translateX(calc(var(--start-x) + 30px + var(--wind-x) * 0.5)) translateY(calc(-250px + var(--wind-y) * 0.3)) scale(1.2) rotate(180deg);
            filter: blur(3px);
        }
        80% {
            opacity: 0.3;
            transform: translateX(calc(var(--start-x) + 60px + var(--wind-x))) translateY(calc(-400px + var(--wind-y) * 0.5)) scale(1.8) rotate(270deg);
            filter: blur(5px);
        }
        100% {
            opacity: 0;
            transform: translateX(calc(var(--start-x) + 100px + var(--wind-x) * 1.2)) translateY(calc(-500px + var(--wind-y) * 0.8)) scale(2.5) rotate(360deg);
            filter: blur(8px);
        }
    }
`;
document.head.appendChild(dynamicStyles);