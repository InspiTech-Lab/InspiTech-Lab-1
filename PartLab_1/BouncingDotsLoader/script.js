document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.container');
    const dotsContainers = document.querySelectorAll('.dots-container');
    const speedButtons = document.querySelectorAll('.speed-btn');
    
    // Add click interactions
    dotsContainers.forEach((dotsContainer, index) => {
        dotsContainer.addEventListener('click', function() {
            // Create explosion effect
            createExplosion(this);
            
            // Add shake effect
            this.style.animation = 'shakeContainer 0.5s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 500);
        });
        
        // Add hover effect that changes dot colors
        dotsContainer.addEventListener('mouseenter', function() {
            if (!this.classList.contains('rainbow') && !this.classList.contains('matrix')) {
                const dots = this.querySelectorAll('.dot:not(.center)');
                dots.forEach((dot, dotIndex) => {
                    dot.style.background = getRandomColor();
                });
            }
        });
        
        dotsContainer.addEventListener('mouseleave', function() {
            if (!this.classList.contains('rainbow') && !this.classList.contains('matrix')) {
                const dots = this.querySelectorAll('.dot:not(.center)');
                dots.forEach(dot => {
                    if (this.classList.contains('pulse')) {
                        const colors = ['#e74c3c', '#f39c12', '#2ecc71', '#9b59b6'];
                        const dotIndex = Array.from(dots).indexOf(dot);
                        dot.style.background = colors[dotIndex] || '#3498db';
                    } else if (this.classList.contains('elastic')) {
                        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
                        const dotIndex = Array.from(dots).indexOf(dot);
                        dot.style.background = colors[dotIndex] || '#3498db';
                    } else {
                        dot.style.background = '#3498db';
                    }
                });
            }
        });
    });
    
    function createExplosion(element) {
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 6px;
                height: 6px;
                background: ${getRandomColor()};
                border-radius: 50%;
                pointer-events: none;
                z-index: 100;
            `;
            
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            
            document.body.appendChild(particle);
            
            const angle = (i / 12) * Math.PI * 2;
            const distance = 80 + Math.random() * 40;
            const endX = Math.cos(angle) * distance;
            const endY = Math.sin(angle) * distance;
            
            particle.animate([
                { 
                    transform: 'translate(0, 0) scale(1)', 
                    opacity: 1 
                },
                { 
                    transform: `translate(${endX}px, ${endY}px) scale(0)`, 
                    opacity: 0 
                }
            ], {
                duration: 800 + Math.random() * 400,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                fill: 'forwards'
            });
            
            setTimeout(() => particle.remove(), 1200);
        }
    }
    
    function getRandomColor() {
        const colors = [
            '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
            '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6',
            '#1abc9c', '#34495e', '#e67e22', '#8e44ad'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Speed control functions
    window.changeSpeed = function(speed) {
        // Remove all speed classes
        container.classList.remove('slow', 'normal', 'fast');
        
        // Add new speed class
        if (speed !== 'normal') {
            container.classList.add(speed);
        }
        
        // Update active button
        speedButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.textContent.toLowerCase() === speed) {
                btn.classList.add('active');
            }
        });
    };
    
    // Set initial active button
    speedButtons[1].classList.add('active'); // Normal speed
    
    // Add keyboard controls
    document.addEventListener('keydown', function(e) {
        switch(e.key) {
            case '1':
                changeSpeed('slow');
                break;
            case '2':
                changeSpeed('normal');
                break;
            case '3':
                changeSpeed('fast');
                break;
            case ' ':
                e.preventDefault();
                // Toggle all animations
                const isAnimationPaused = container.style.animationPlayState === 'paused';
                const playState = isAnimationPaused ? 'running' : 'paused';
                
                container.style.animationPlayState = playState;
                dotsContainers.forEach(dotsContainer => {
                    dotsContainer.style.animationPlayState = playState;
                    const dots = dotsContainer.querySelectorAll('.dot');
                    dots.forEach(dot => {
                        dot.style.animationPlayState = playState;
                    });
                });
                break;
        }
    });
    
    // Add CSS for shake animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shakeContainer {
            0%, 100% { transform: translateX(0); }
            10% { transform: translateX(-5px); }
            20% { transform: translateX(5px); }
            30% { transform: translateX(-5px); }
            40% { transform: translateX(5px); }
            50% { transform: translateX(-3px); }
            60% { transform: translateX(3px); }
            70% { transform: translateX(-2px); }
            80% { transform: translateX(2px); }
            90% { transform: translateX(-1px); }
        }
        
        /* Pulsing background effect */
        .dots-container::before {
            content: '';
            position: absolute;
            top: -5px;
            left: -5px;
            right: -5px;
            bottom: -5px;
            background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
            border-radius: 25px;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: -1;
        }
        
        .dots-container:hover::before {
            opacity: 1;
            animation: backgroundPulse 2s ease-in-out infinite;
        }
        
        @keyframes backgroundPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
        }
    `;
    document.head.appendChild(style);
    
    // Auto-demonstrate different effects every 25 seconds
    let demoIndex = 0;
    setInterval(() => {
        const currentContainer = dotsContainers[demoIndex];
        currentContainer.style.transform = 'scale(1.1)';
        currentContainer.style.boxShadow = '0 15px 40px rgba(255,255,255,0.3)';
        
        setTimeout(() => {
            currentContainer.style.transform = 'scale(1)';
            currentContainer.style.boxShadow = '';
        }, 1000);
        
        demoIndex = (demoIndex + 1) % dotsContainers.length;
    }, 25000);
    
    // Add touch support for mobile
    dotsContainers.forEach(container => {
        let touchStartTime = 0;
        
        container.addEventListener('touchstart', function(e) {
            touchStartTime = Date.now();
            this.style.transform = 'scale(0.95)';
        });
        
        container.addEventListener('touchend', function(e) {
            this.style.transform = 'scale(1)';
            
            const touchDuration = Date.now() - touchStartTime;
            if (touchDuration < 200) { // Short tap
                createExplosion(this);
            }
        });
    });
});