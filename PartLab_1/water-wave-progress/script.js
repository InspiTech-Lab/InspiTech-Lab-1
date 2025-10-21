// Water Wave Progress Bar Controller
class WaterWaveProgress {
    constructor() {
        this.progress = 0;
        this.isRunning = false;
        this.animationSpeed = 150; // milliseconds (15s / 100 steps = 150ms)
        this.init();
    }

    init() {
        this.setupControls();
        this.setupProgressRing();
        this.setupWaveInteraction();
        this.setupDynamicBubbles();
    }

    setupControls() {
        const startBtn = document.getElementById('startBtn');
        const resetBtn = document.getElementById('resetBtn');

        startBtn.addEventListener('click', () => {
            if (!this.isRunning) {
                this.startProgress();
                startBtn.textContent = 'Pause';
            } else {
                this.pauseProgress();
                startBtn.textContent = 'Resume';
            }
        });

        resetBtn.addEventListener('click', () => {
            this.resetProgress();
            startBtn.textContent = 'Start';
        });
    }

    setupProgressRing() {
        // Add SVG gradient for ring
        const svg = document.querySelector('.ring-svg');
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        
        gradient.setAttribute('id', 'progressGradient');
        gradient.innerHTML = `
            <stop offset="0%" style="stop-color:#40e0d0;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#48bbff;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#8a2be2;stop-opacity:1" />
        `;
        
        defs.appendChild(gradient);
        svg.insertBefore(defs, svg.firstChild);
    }

    startProgress() {
        this.isRunning = true;
        
        // Start wave animations when progress begins
        const waves = document.querySelectorAll('.wave');
        waves.forEach((wave, index) => {
            wave.style.animation = `waveRise 15s ease-in-out forwards, waveMotion 3s ease-in-out infinite`;
            wave.style.animationDelay = `${index * 0.5}s, ${index * 0.5}s`;
        });
        
        this.progressInterval = setInterval(() => {
            if (this.progress < 100) {
                this.progress += 1;
                this.updateProgress();
            } else {
                this.completeProgress();
            }
        }, this.animationSpeed);
    }

    pauseProgress() {
        this.isRunning = false;
        clearInterval(this.progressInterval);
    }

    resetProgress() {
        this.isRunning = false;
        clearInterval(this.progressInterval);
        this.progress = 0;
        this.updateProgress();
        
        const status = document.querySelector('.status');
        status.textContent = 'Ready';
        
        // Reset wave animations
        const waves = document.querySelectorAll('.wave');
        waves.forEach(wave => {
            wave.style.animation = 'none';
            wave.style.bottom = '-200%';
        });
    }

    updateProgress() {
        const percentage = document.querySelector('.percentage');
        const status = document.querySelector('.status');
        const ringProgress = document.querySelector('.ring-progress');
        const waves = document.querySelectorAll('.wave');
        
        percentage.textContent = `${this.progress}%`;
        
        // Update status text
        if (this.progress < 25) {
            status.textContent = 'Initializing';
        } else if (this.progress < 50) {
            status.textContent = 'Processing';
        } else if (this.progress < 75) {
            status.textContent = 'Uploading';
        } else if (this.progress < 100) {
            status.textContent = 'Finalizing';
        }
        
        // Update ring progress
        const circumference = 2 * Math.PI * 50;
        const offset = circumference - (this.progress / 100) * circumference;
        ringProgress.style.strokeDashoffset = offset;
        
        // Update wave height
        waves.forEach((wave, index) => {
            // Waves rise from -200% to -50% (150% total range)
            const waveHeight = (this.progress / 100) * 150;
            wave.style.bottom = `${-200 + waveHeight}%`;
        });
    }

    completeProgress() {
        this.isRunning = false;
        clearInterval(this.progressInterval);
        
        const status = document.querySelector('.status');
        status.textContent = 'Complete!';
        
        // Add completion effect
        this.createSplashEffect();
        
        // Auto reset after 2 seconds
        setTimeout(() => {
            this.resetProgress();
        }, 2000);
    }

    setupWaveInteraction() {
        const waveProgress = document.querySelector('.wave-progress');
        
        waveProgress.addEventListener('click', () => {
            this.createRippleEffect(event);
        });
    }

    createRippleEffect(event) {
        const rect = event.target.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.4);
            pointer-events: none;
            animation: ripple 1s ease-out forwards;
        `;
        
        event.target.appendChild(ripple);
        setTimeout(() => ripple.remove(), 1000);
    }

    createSplashEffect() {
        const waveProgress = document.querySelector('.wave-progress');
        
        for (let i = 0; i < 12; i++) {
            const splash = document.createElement('div');
            splash.style.cssText = `
                position: absolute;
                width: 6px;
                height: 6px;
                background: #40e0d0;
                border-radius: 50%;
                pointer-events: none;
                animation: splashEffect 1.5s ease-out forwards;
                animation-delay: ${i * 0.1}s;
                left: 50%;
                top: 50%;
                transform: rotate(${i * 30}deg) translateY(-60px);
            `;
            
            waveProgress.appendChild(splash);
            setTimeout(() => splash.remove(), 1600);
        }
    }

    setupDynamicBubbles() {
        const bubblesContainer = document.querySelector('.bubbles');
        
        setInterval(() => {
            if (this.isRunning) {
                const bubble = document.createElement('div');
                bubble.className = 'bubble dynamic';
                bubble.style.left = Math.random() * 100 + '%';
                bubble.style.width = bubble.style.height = (4 + Math.random() * 8) + 'px';
                bubble.style.animationDuration = (4 + Math.random() * 4) + 's';
                
                bubblesContainer.appendChild(bubble);
                
                setTimeout(() => bubble.remove(), 8000);
            }
        }, 800);
    }
}

// Add dynamic CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        from {
            width: 0;
            height: 0;
            opacity: 1;
        }
        to {
            width: 100px;
            height: 100px;
            margin: -50px 0 0 -50px;
            opacity: 0;
        }
    }
    
    @keyframes splashEffect {
        from {
            opacity: 1;
            transform: rotate(var(--angle)) translateY(-60px) scale(1);
        }
        to {
            opacity: 0;
            transform: rotate(var(--angle)) translateY(-120px) scale(0);
        }
    }
    
    @keyframes bubbleFloat {
        from {
            transform: translateY(100vh) scale(0);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        to {
            transform: translateY(-100px) scale(1);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WaterWaveProgress();
});