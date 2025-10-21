class AdvancedOrigamiGallery {
    constructor() {
        this.cards = document.querySelectorAll('.origami-card');
        this.controlBtns = document.querySelectorAll('.control-btn');
        this.speedSlider = document.getElementById('speedSlider');
        this.particleSystem = document.getElementById('particleSystem');
        
        this.currentMode = 'auto';
        this.animationSpeed = 1;
        this.isAnimating = false;
        this.autoInterval = null;
        this.chainReactionIndex = 0;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startAutoMode();
        this.initParticleSystem();
        this.setupTouchGestures();
    }

    setupEventListeners() {
        // Control buttons
        this.controlBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchMode(e.target.dataset.mode);
            });
        });

        // Speed slider
        this.speedSlider.addEventListener('input', (e) => {
            this.animationSpeed = parseFloat(e.target.value);
            this.updateAnimationSpeed();
        });

        // Card interactions
        this.cards.forEach((card, index) => {
            card.addEventListener('click', () => this.handleCardClick(card, index));
            card.addEventListener('mouseenter', () => this.handleCardHover(card, index));
            card.addEventListener('mouseleave', () => this.handleCardLeave(card, index));
        });

        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    switchMode(mode) {
        this.currentMode = mode;
        
        // Update active button
        this.controlBtns.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
        
        // Clear existing intervals
        if (this.autoInterval) {
            clearInterval(this.autoInterval);
            this.autoInterval = null;
        }
        
        // Reset all cards
        this.resetAllCards();
        
        // Start new mode
        switch(mode) {
            case 'auto':
                this.startAutoMode();
                break;
            case 'manual':
                this.startManualMode();
                break;
            case 'chain':
                this.startChainReactionMode();
                break;
        }
    }

    startAutoMode() {
        let currentIndex = 0;
        
        this.autoInterval = setInterval(() => {
            this.resetAllCards();
            
            setTimeout(() => {
                this.unfoldCard(this.cards[currentIndex], currentIndex);
                this.createParticleExplosion(this.cards[currentIndex]);
                currentIndex = (currentIndex + 1) % this.cards.length;
            }, 500);
            
        }, 4000 / this.animationSpeed);
    }

    startManualMode() {
        // Manual mode - cards respond to user interaction only
        this.showInteractionHints();
    }

    startChainReactionMode() {
        this.chainReactionIndex = 0;
        this.triggerChainReaction();
    }

    triggerChainReaction() {
        if (this.chainReactionIndex >= this.cards.length) {
            setTimeout(() => {
                this.resetAllCards();
                setTimeout(() => {
                    this.chainReactionIndex = 0;
                    this.triggerChainReaction();
                }, 1000);
            }, 2000);
            return;
        }

        const card = this.cards[this.chainReactionIndex];
        this.unfoldCard(card, this.chainReactionIndex);
        this.createParticleExplosion(card);
        
        this.chainReactionIndex++;
        
        setTimeout(() => {
            this.triggerChainReaction();
        }, 800 / this.animationSpeed);
    }

    handleCardClick(card, index) {
        if (this.currentMode === 'manual') {
            this.toggleCard(card, index);
            this.createParticleExplosion(card);
            this.triggerHapticFeedback();
        }
    }

    handleCardHover(card, index) {
        if (this.currentMode === 'manual') {
            this.previewUnfold(card);
        }
    }

    handleCardLeave(card, index) {
        if (this.currentMode === 'manual' && !card.classList.contains('unfolded')) {
            this.resetPreview(card);
        }
    }

    handleKeyboard(e) {
        switch(e.key) {
            case '1':
                this.switchMode('auto');
                break;
            case '2':
                this.switchMode('manual');
                break;
            case '3':
                this.switchMode('chain');
                break;
            case ' ':
                e.preventDefault();
                if (this.currentMode === 'manual') {
                    this.unfoldRandomCard();
                }
                break;
            case 'r':
                this.resetAllCards();
                break;
        }
    }

    unfoldCard(card, index) {
        card.classList.add('unfolded');
        
        // Add specific animation delays for different card styles
        const folds = card.querySelectorAll('.fold');
        folds.forEach((fold, foldIndex) => {
            fold.style.transitionDelay = `${foldIndex * 0.1}s`;
        });

        // Trigger sound visualization
        this.triggerSoundVisualization();
    }

    foldCard(card) {
        card.classList.remove('unfolded');
        
        const folds = card.querySelectorAll('.fold');
        folds.forEach((fold, foldIndex) => {
            fold.style.transitionDelay = `${(folds.length - foldIndex) * 0.1}s`;
        });
    }

    toggleCard(card, index) {
        if (card.classList.contains('unfolded')) {
            this.foldCard(card);
        } else {
            this.unfoldCard(card, index);
        }
    }

    previewUnfold(card) {
        card.style.transform = 'translateY(-5px) rotateX(2deg) rotateY(2deg) scale(1.02)';
    }

    resetPreview(card) {
        card.style.transform = '';
    }

    resetAllCards() {
        this.cards.forEach(card => {
            this.foldCard(card);
            card.style.transform = '';
            
            const folds = card.querySelectorAll('.fold');
            folds.forEach(fold => {
                fold.style.transitionDelay = '';
            });
        });
    }

    unfoldRandomCard() {
        const randomIndex = Math.floor(Math.random() * this.cards.length);
        const card = this.cards[randomIndex];
        
        if (!card.classList.contains('unfolded')) {
            this.unfoldCard(card, randomIndex);
            this.createParticleExplosion(card);
        }
    }

    updateAnimationSpeed() {
        document.documentElement.style.setProperty('--animation-speed', this.animationSpeed);
        
        // Update CSS animation durations
        this.cards.forEach(card => {
            const folds = card.querySelectorAll('.fold');
            folds.forEach(fold => {
                fold.style.transitionDuration = `${0.8 / this.animationSpeed}s`;
            });
        });

        // Restart current mode with new speed
        if (this.currentMode === 'auto') {
            this.switchMode('auto');
        } else if (this.currentMode === 'chain') {
            this.switchMode('chain');
        }
    }

    createParticleExplosion(card) {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const angle = (Math.PI * 2 * i) / 15;
            const velocity = 50 + Math.random() * 50;
            const x = centerX + Math.cos(angle) * 20;
            const y = centerY + Math.sin(angle) * 20;
            
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.setProperty('--vx', Math.cos(angle) * velocity + 'px');
            particle.style.setProperty('--vy', Math.sin(angle) * velocity + 'px');
            
            this.particleSystem.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 3000);
        }
    }

    initParticleSystem() {
        // Create ambient particles
        setInterval(() => {
            if (this.particleSystem.children.length < 20) {
                this.createAmbientParticle();
            }
        }, 2000);
    }

    createAmbientParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = window.innerHeight + 'px';
        particle.style.opacity = '0.3';
        
        this.particleSystem.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 3000);
    }

    triggerSoundVisualization() {
        const bars = document.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            bar.style.animationDuration = `${0.5 + Math.random() * 0.5}s`;
            bar.style.transform = `scaleY(${1 + Math.random()})`;
            
            setTimeout(() => {
                bar.style.transform = 'scaleY(1)';
            }, 1000);
        });
    }

    setupTouchGestures() {
        let startX, startY, startTime;
        
        this.cards.forEach((card, index) => {
            card.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                startTime = Date.now();
            });
            
            card.addEventListener('touchend', (e) => {
                const endX = e.changedTouches[0].clientX;
                const endY = e.changedTouches[0].clientY;
                const endTime = Date.now();
                
                const deltaX = endX - startX;
                const deltaY = endY - startY;
                const deltaTime = endTime - startTime;
                
                // Swipe detection
                if (Math.abs(deltaX) > 50 && deltaTime < 300) {
                    if (deltaX > 0) {
                        this.handleSwipeRight(card, index);
                    } else {
                        this.handleSwipeLeft(card, index);
                    }
                } else if (Math.abs(deltaY) > 50 && deltaTime < 300) {
                    if (deltaY > 0) {
                        this.handleSwipeDown(card, index);
                    } else {
                        this.handleSwipeUp(card, index);
                    }
                } else if (deltaTime < 200) {
                    // Quick tap
                    this.handleCardClick(card, index);
                }
            });
        });
    }

    handleSwipeRight(card, index) {
        this.unfoldCard(card, index);
        this.createParticleExplosion(card);
    }

    handleSwipeLeft(card, index) {
        this.foldCard(card);
    }

    handleSwipeUp(card, index) {
        // Trigger special animation
        card.style.animation = 'cardFlip 1s ease-in-out';
        setTimeout(() => {
            card.style.animation = '';
        }, 1000);
    }

    handleSwipeDown(card, index) {
        // Reset card
        this.foldCard(card);
        card.style.transform = '';
    }

    showInteractionHints() {
        const hints = document.querySelector('.interaction-panel');
        hints.style.animation = 'pulse 2s ease-in-out 3';
    }

    triggerHapticFeedback() {
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    }
}

// Add additional CSS animations via JavaScript
const additionalStyles = `
    @keyframes cardFlip {
        0% { transform: rotateY(0deg); }
        50% { transform: rotateY(180deg) scale(1.1); }
        100% { transform: rotateY(360deg); }
    }
    
    .particle {
        animation: particleExplosion 3s ease-out forwards;
    }
    
    @keyframes particleExplosion {
        0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(var(--vx, 0), var(--vy, 0)) scale(0);
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AdvancedOrigamiGallery();
});

// Add performance monitoring
class PerformanceMonitor {
    constructor() {
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fps = 0;
        this.monitor();
    }
    
    monitor() {
        const currentTime = performance.now();
        this.frameCount++;
        
        if (currentTime - this.lastTime >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
            this.frameCount = 0;
            this.lastTime = currentTime;
            
            // Optimize based on FPS
            if (this.fps < 30) {
                this.optimizePerformance();
            }
        }
        
        requestAnimationFrame(() => this.monitor());
    }
    
    optimizePerformance() {
        // Reduce particle count
        const particles = document.querySelectorAll('.particle');
        if (particles.length > 10) {
            for (let i = 10; i < particles.length; i++) {
                particles[i].remove();
            }
        }
        
        // Reduce animation complexity
        document.documentElement.style.setProperty('--reduced-motion', '1');
    }
}

new PerformanceMonitor();