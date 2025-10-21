class ElasticToggleEffect {
    constructor() {
        this.toggle = document.getElementById('elasticToggle');
        this.moodEmoji = document.querySelector('.mood-emoji');
        this.moodText = document.querySelector('.mood-text');
        this.thumb = document.querySelector('.elastic-thumb');
        this.hearts = document.querySelectorAll('.heart');
        
        this.isAnimating = false;
        this.moods = {
            off: { emoji: '😴', text: 'Sleepy' },
            on: { emoji: '😊', text: 'Happy' }
        };
        
        this.init();
        this.startAutoDemo();
    }
    
    init() {
        this.toggle.addEventListener('change', (e) => {
            this.handleToggle(e.target.checked);
        });
        
        // Add bounce effect on click
        this.toggle.addEventListener('click', () => {
            this.createBounceEffect();
        });
        
        // Touch feedback
        this.toggle.addEventListener('touchstart', () => {
            if (navigator.vibrate) {
                navigator.vibrate(15);
            }
        });
    }
    
    handleToggle(isOn) {
        if (this.isAnimating) return;
        this.isAnimating = true;
        
        // Update mood
        const mood = this.moods[isOn ? 'on' : 'off'];
        this.moodEmoji.textContent = mood.emoji;
        this.moodText.textContent = mood.text;
        
        if (isOn) {
            this.activateHappyEffects();
        } else {
            this.deactivateEffects();
        }
        
        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(isOn ? [30, 30, 30] : [20]);
        }
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 800);
    }
    
    activateHappyEffects() {
        // Trigger heart animations
        this.hearts.forEach((heart, index) => {
            setTimeout(() => {
                heart.style.animation = 'heartBurst 1s ease-out';
                setTimeout(() => {
                    heart.style.animation = 'heartFloat 4s ease-in-out infinite';
                }, 1000);
            }, index * 200);
        });
        
        // Create confetti burst
        this.createConfettiBurst();
        
        // Add thumb celebration
        this.celebrateThumb();
    }
    
    deactivateEffects() {
        // Fade hearts
        this.hearts.forEach(heart => {
            heart.style.opacity = '0';
            setTimeout(() => {
                heart.style.opacity = '';
            }, 500);
        });
    }
    
    createBounceEffect() {
        const bounceWave = document.createElement('div');
        bounceWave.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255, 107, 157, 0.6);
            border-radius: 50%;
            pointer-events: none;
            animation: bounceWave 0.8s ease-out;
        `;
        
        this.thumb.appendChild(bounceWave);
        
        setTimeout(() => {
            bounceWave.remove();
        }, 800);
    }
    
    createConfettiBurst() {
        const colors = ['#ff6b9d', '#c44569', '#f8b500', '#ff9ff3'];
        
        for (let i = 0; i < 12; i++) {
            const confetti = document.createElement('div');
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            confetti.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: 8px;
                height: 8px;
                background: ${color};
                border-radius: 50%;
                pointer-events: none;
                z-index: 10;
                animation: confettiBurst 1.2s ease-out;
                animation-delay: ${i * 0.1}s;
            `;
            
            this.thumb.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 1200);
        }
    }
    
    celebrateThumb() {
        this.thumb.style.animation = 'thumbCelebrate 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        
        setTimeout(() => {
            this.thumb.style.animation = '';
        }, 800);
    }
    
    startAutoDemo() {
        // Auto toggle every 6 seconds
        setInterval(() => {
            if (!this.isAnimating) {
                this.toggle.checked = !this.toggle.checked;
                this.handleToggle(this.toggle.checked);
            }
        }, 6000);
        
        // Initial demo
        setTimeout(() => {
            this.toggle.checked = true;
            this.handleToggle(true);
        }, 1000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ElasticToggleEffect();
});

// Add dynamic CSS animations
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    @keyframes bounceWave {
        0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(3);
            opacity: 0;
        }
    }
    
    @keyframes confettiBurst {
        0% {
            transform: translate(-50%, -50%) scale(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(1) rotate(720deg) translateY(-50px);
            opacity: 0;
        }
    }
    
    @keyframes thumbCelebrate {
        0%, 100% { transform: translateX(70px) scale(1.1); }
        25% { transform: translateX(70px) scale(1.3) rotate(-10deg); }
        75% { transform: translateX(70px) scale(1.3) rotate(10deg); }
    }
    
    @keyframes heartBurst {
        0% {
            opacity: 0;
            transform: translateY(0px) scale(0);
        }
        50% {
            opacity: 1;
            transform: translateY(-30px) scale(1.5);
        }
        100% {
            opacity: 0.6;
            transform: translateY(-60px) scale(1);
        }
    }
`;
document.head.appendChild(dynamicStyles);