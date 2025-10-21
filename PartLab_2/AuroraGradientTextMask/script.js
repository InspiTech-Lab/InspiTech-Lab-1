document.addEventListener('DOMContentLoaded', function() {
    const auroraTexts = document.querySelectorAll('.aurora-text');
    const sparkles = document.querySelectorAll('.sparkle');
    
    // Enhanced text animation on scroll/interaction
    function animateTexts() {
        auroraTexts.forEach((text, index) => {
            text.addEventListener('mouseenter', function() {
                this.style.animation = 'auroraShift 2s ease-in-out infinite';
                this.style.transform = 'scale(1.05) rotate(1deg)';
                this.style.filter = 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.5))';
            });
            
            text.addEventListener('mouseleave', function() {
                this.style.animation = 'auroraShift 8s ease-in-out infinite';
                this.style.transform = 'scale(1) rotate(0deg)';
                this.style.filter = 'none';
            });
            
            // Staggered animation entrance
            text.style.animationDelay = `${index * 0.5}s`;
        });
    }
    
    // Dynamic sparkle generation
    function createDynamicSparkles() {
        const container = document.querySelector('.sparkle-container');
        
        setInterval(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.animationDuration = (Math.random() * 3 + 2) + 's';
            
            container.appendChild(sparkle);
            
            setTimeout(() => {
                if (container.contains(sparkle)) {
                    container.removeChild(sparkle);
                }
            }, 5000);
        }, 800);
    }
    
    // Aurora wave effect
    function createAuroraWave() {
        const wave = document.createElement('div');
        wave.style.position = 'fixed';
        wave.style.top = '0';
        wave.style.left = '-100%';
        wave.style.width = '200%';
        wave.style.height = '100%';
        wave.style.background = 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)';
        wave.style.pointerEvents = 'none';
        wave.style.zIndex = '5';
        wave.style.animation = 'wavePass 6s ease-in-out';
        
        document.body.appendChild(wave);
        
        setTimeout(() => {
            document.body.removeChild(wave);
        }, 6000);
    }
    
    // Add wave pass animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes wavePass {
            0% { transform: translateX(-50%); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateX(50%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Touch interactions for mobile
    function addTouchInteractions() {
        auroraTexts.forEach(text => {
            text.addEventListener('touchstart', function(e) {
                e.preventDefault();
                this.style.transform = 'scale(1.1)';
                this.style.filter = 'drop-shadow(0 0 30px rgba(255, 255, 255, 0.8))';
                
                // Create ripple effect
                const ripple = document.createElement('div');
                ripple.style.position = 'absolute';
                ripple.style.borderRadius = '50%';
                ripple.style.background = 'rgba(255, 255, 255, 0.3)';
                ripple.style.width = '10px';
                ripple.style.height = '10px';
                ripple.style.left = '50%';
                ripple.style.top = '50%';
                ripple.style.transform = 'translate(-50%, -50%)';
                ripple.style.animation = 'rippleExpand 1s ease-out forwards';
                ripple.style.pointerEvents = 'none';
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    if (this.contains(ripple)) {
                        this.removeChild(ripple);
                    }
                }, 1000);
            });
            
            text.addEventListener('touchend', function() {
                this.style.transform = 'scale(1)';
                this.style.filter = 'none';
            });
        });
    }
    
    // Add ripple expand animation
    style.textContent += `
        @keyframes rippleExpand {
            0% {
                width: 10px;
                height: 10px;
                opacity: 1;
            }
            100% {
                width: 200px;
                height: 200px;
                opacity: 0;
            }
        }
    `;
    
    // Initialize all effects
    animateTexts();
    createDynamicSparkles();
    addTouchInteractions();
    
    // Periodic aurora wave
    setInterval(createAuroraWave, 8000);
    
    // Auto-cycle text effects for demo
    let textIndex = 0;
    setInterval(() => {
        const currentText = auroraTexts[textIndex];
        currentText.dispatchEvent(new Event('mouseenter'));
        
        setTimeout(() => {
            currentText.dispatchEvent(new Event('mouseleave'));
        }, 1500);
        
        textIndex = (textIndex + 1) % auroraTexts.length;
    }, 3000);
});