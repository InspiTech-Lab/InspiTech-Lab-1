class CursorTrailEffect {
    constructor() {
        this.trailContainer = document.querySelector('.cursor-trail-container');
        this.particleContainer = document.querySelector('.particle-container');
        this.modeButtons = document.querySelectorAll('.mode-btn');
        this.targetZone = document.querySelector('.target-zone');
        this.particleCountEl = document.getElementById('particleCount');
        this.trailLengthEl = document.getElementById('trailLength');
        
        this.currentMode = 'sparkle';
        this.mouseX = 0;
        this.mouseY = 0;
        this.trail = [];
        this.maxTrailLength = 20;
        this.particleCount = 0;
        this.isInTarget = false;
        
        this.init();
        this.startAutoDemo();
    }
    
    init() {
        // Mode switching
        this.modeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchMode(btn.dataset.mode);
                this.updateActiveButton(btn);
            });
        });
        
        // Mouse tracking
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.updateTrail();
            this.createParticle();
        });
        
        // Touch tracking for mobile
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                this.mouseX = touch.clientX;
                this.mouseY = touch.clientY;
                this.updateTrail();
                this.createParticle();
            }
        });
        
        // Target zone interactions
        this.targetZone.addEventListener('mouseenter', () => {
            this.isInTarget = true;
            this.createTargetBurst();
        });
        
        this.targetZone.addEventListener('mouseleave', () => {
            this.isInTarget = false;
        });
        
        this.targetZone.addEventListener('click', () => {
            this.createMegaBurst();
        });
        
        // Start trail animation
        this.animateTrail();
    }
    
    switchMode(mode) {
        this.currentMode = mode;
        
        // Clear existing trail
        this.trailContainer.innerHTML = '';
        this.trail = [];
        
        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(20);
        }
    }
    
    updateActiveButton(activeBtn) {
        this.modeButtons.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }
    
    updateTrail() {
        this.trail.push({ x: this.mouseX, y: this.mouseY, time: Date.now() });
        
        // Remove old trail points
        const now = Date.now();
        this.trail = this.trail.filter(point => now - point.time < 1000);
        
        // Update stats
        this.trailLengthEl.textContent = this.trail.length;
    }
    
    createParticle() {
        if (Math.random() > 0.7) return; // Control particle density
        
        const particle = document.createElement('div');
        particle.className = `trail-dot trail-${this.currentMode}`;
        
        // Add random offset for natural look
        const offsetX = (Math.random() - 0.5) * 20;
        const offsetY = (Math.random() - 0.5) * 20;
        
        particle.style.left = (this.mouseX + offsetX) + 'px';
        particle.style.top = (this.mouseY + offsetY) + 'px';
        
        // Enhanced effects in target zone
        if (this.isInTarget) {
            particle.style.transform = 'scale(1.5)';
            particle.style.filter = 'brightness(1.5)';
        }
        
        this.trailContainer.appendChild(particle);
        this.particleCount++;
        this.particleCountEl.textContent = this.particleCount;
        
        // Animate particle
        this.animateParticle(particle);
        
        // Remove after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
                this.particleCount--;
                this.particleCountEl.textContent = this.particleCount;
            }
        }, 2000);
    }
    
    animateParticle(particle) {
        let opacity = 1;
        let scale = 1;
        let rotation = 0;
        
        const animate = () => {
            opacity -= 0.02;
            scale += 0.02;
            rotation += 5;
            
            particle.style.opacity = opacity;
            particle.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
            
            if (opacity > 0 && particle.parentNode) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    createTargetBurst() {
        const colors = {
            sparkle: ['#4ecdc4', '#45b7d1', '#96ceb4'],
            fire: ['#ff6b6b', '#ff4757', '#ffa502'],
            rainbow: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'],
            galaxy: ['#9b59b6', '#3742fa', '#2f3542']
        };
        
        const modeColors = colors[this.currentMode];
        
        for (let i = 0; i < 15; i++) {
            const burst = document.createElement('div');
            const color = modeColors[Math.floor(Math.random() * modeColors.length)];
            
            burst.style.cssText = `
                position: absolute;
                width: 6px;
                height: 6px;
                background: ${color};
                border-radius: 50%;
                left: ${this.mouseX}px;
                top: ${this.mouseY}px;
                pointer-events: none;
                z-index: 200;
                box-shadow: 0 0 10px ${color};
                animation: burstParticle 1s ease-out;
                animation-delay: ${i * 0.05}s;
            `;
            
            this.particleContainer.appendChild(burst);
            
            setTimeout(() => {
                burst.remove();
            }, 1000);
        }
    }
    
    createMegaBurst() {
        // Screen shake
        document.body.style.animation = 'screenShake 0.3s ease-out';
        
        // Massive particle explosion
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                this.createParticle();
            }, i * 20);
        }
        
        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100, 50, 100]);
        }
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 300);
    }
    
    animateTrail() {
        // Continuous trail animation
        requestAnimationFrame(() => this.animateTrail());
    }
    
    startAutoDemo() {
        // Auto switch modes every 5 seconds
        let modeIndex = 0;
        const modes = ['sparkle', 'fire', 'rainbow', 'galaxy'];
        
        setInterval(() => {
            modeIndex = (modeIndex + 1) % modes.length;
            const mode = modes[modeIndex];
            this.switchMode(mode);
            
            // Update button
            this.modeButtons.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.mode === mode);
            });
        }, 5000);
        
        // Simulate mouse movement for demo
        let angle = 0;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        const simulateMovement = () => {
            angle += 0.02;
            const radius = 100 + Math.sin(angle * 2) * 50;
            
            this.mouseX = centerX + Math.cos(angle) * radius;
            this.mouseY = centerY + Math.sin(angle) * radius;
            
            this.updateTrail();
            
            if (Math.random() > 0.8) {
                this.createParticle();
            }
            
            requestAnimationFrame(simulateMovement);
        };
        
        // Start simulation after 1 second
        setTimeout(simulateMovement, 1000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CursorTrailEffect();
});

// Add dynamic CSS animations
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    @keyframes burstParticle {
        0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: scale(2) rotate(360deg) translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px);
            opacity: 0;
        }
    }
    
    @keyframes screenShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(dynamicStyles);