class EqualizerAnimation {
    constructor() {
        this.bars = document.querySelectorAll('.bar');
        this.playBtn = document.getElementById('playBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.soundWaves = document.querySelector('.sound-waves');
        this.vinyl = document.querySelector('.vinyl-record');
        
        this.isPlaying = false;
        this.animationId = null;
        this.frequencies = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000];
        
        this.init();
        this.startAutoDemo();
    }
    
    init() {
        this.playBtn.addEventListener('click', () => this.play());
        this.stopBtn.addEventListener('click', () => this.stop());
        
        // Initialize bar heights
        this.bars.forEach((bar, index) => {
            bar.style.height = '20px';
            bar.style.animationDelay = `${index * 0.1}s`;
        });
    }
    
    play() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.soundWaves.classList.add('active');
        this.vinyl.style.animationPlayState = 'running';
        
        // Add haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(30);
        }
        
        this.animateEqualizer();
    }
    
    stop() {
        this.isPlaying = false;
        this.soundWaves.classList.remove('active');
        this.vinyl.style.animationPlayState = 'paused';
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // Reset bars to minimum height
        this.bars.forEach(bar => {
            bar.style.height = '20px';
            bar.classList.remove('active');
        });
    }
    
    animateEqualizer() {
        if (!this.isPlaying) return;
        
        this.bars.forEach((bar, index) => {
            // Create realistic frequency response
            const frequency = this.frequencies[index];
            const bassBoost = frequency < 1000 ? 1.5 : 1;
            const midBoost = frequency >= 1000 && frequency <= 6000 ? 1.3 : 1;
            const trebleRoll = frequency > 12000 ? 0.7 : 1;
            
            // Generate height based on multiple sine waves for realistic movement
            const time = Date.now() * 0.001;
            const wave1 = Math.sin(time * 2 + index * 0.5) * 0.4;
            const wave2 = Math.sin(time * 3.7 + index * 0.3) * 0.3;
            const wave3 = Math.sin(time * 1.8 + index * 0.7) * 0.3;
            
            const combined = (wave1 + wave2 + wave3) * bassBoost * midBoost * trebleRoll;
            const height = Math.max(20, 20 + (combined + 1) * 50);
            
            bar.style.height = `${height}px`;
            
            // Add active class for glow effect
            if (height > 45) {
                bar.classList.add('active');
            } else {
                bar.classList.remove('active');
            }
            
            // Dynamic color based on intensity
            const intensity = (height - 20) / 80;
            if (intensity > 0.7) {
                bar.style.background = 'linear-gradient(180deg, #ff6b6b 0%, #feca57 50%, #48cae4 100%)';
                bar.style.boxShadow = `0 4px 15px rgba(255, 107, 107, ${0.3 + intensity * 0.4})`;
            } else if (intensity > 0.4) {
                bar.style.background = 'linear-gradient(180deg, #4ecdc4 0%, #45b7d1 50%, #96ceb4 100%)';
                bar.style.boxShadow = `0 4px 15px rgba(78, 205, 196, ${0.3 + intensity * 0.3})`;
            } else {
                bar.style.background = 'linear-gradient(180deg, #667eea 0%, #764ba2 50%, #84fab0 100%)';
                bar.style.boxShadow = `0 4px 15px rgba(102, 126, 234, ${0.2 + intensity * 0.2})`;
            }
        });
        
        this.animationId = requestAnimationFrame(() => this.animateEqualizer());
    }
    
    startAutoDemo() {
        // Auto play demo every 10 seconds
        setInterval(() => {
            if (!this.isPlaying) {
                this.play();
                setTimeout(() => {
                    this.stop();
                }, 6000);
            }
        }, 10000);
        
        // Initial demo
        setTimeout(() => {
            this.play();
            setTimeout(() => {
                this.stop();
            }, 6000);
        }, 1000);
    }
}

// Create floating particles
class ParticleSystem {
    constructor() {
        this.container = document.querySelector('.background-effects');
        this.particles = [];
        this.createParticles();
    }
    
    createParticles() {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1});
                border-radius: 50%;
                left: ${Math.random() * 100}vw;
                top: ${Math.random() * 100}vh;
                animation: particleDrift ${Math.random() * 10 + 10}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            this.container.appendChild(particle);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EqualizerAnimation();
    new ParticleSystem();
});

// Add particle animation styles
const particleStyles = document.createElement('style');
particleStyles.textContent = `
    @keyframes particleDrift {
        0% { 
            transform: translateY(100vh) translateX(0px) rotate(0deg); 
            opacity: 0; 
        }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { 
            transform: translateY(-100vh) translateX(50px) rotate(360deg); 
            opacity: 0; 
        }
    }
`;
document.head.appendChild(particleStyles);

// Add click effects
document.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        left: ${e.clientX - 25}px;
        top: ${e.clientY - 25}px;
        width: 50px;
        height: 50px;
        z-index: 1000;
    `;
    
    document.body.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
});

// Ripple animation
const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyles);