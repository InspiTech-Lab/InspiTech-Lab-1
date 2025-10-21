document.addEventListener('DOMContentLoaded', function() {
    let isPaused = false;
    
    // Add click interactions
    const waveContainers = document.querySelectorAll('.wave-container');
    
    waveContainers.forEach((container, index) => {
        container.addEventListener('click', function() {
            // Create ripple effect
            createRipple(this, event);
            
            // Add bounce effect
            this.style.animation = 'bounceClick 0.3s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 300);
        });
        
        // Add random delay to wave animations for variety
        const waves = container.querySelectorAll('.wave');
        waves.forEach((wave, waveIndex) => {
            wave.style.animationDelay = `${-(waveIndex * 2 + Math.random() * 2)}s`;
        });
    });
    
    function createRipple(element, event) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: rippleEffect 0.6s ease-out;
            pointer-events: none;
            z-index: 10;
        `;
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // Add dynamic particle generation for particle wave
    function createDynamicParticles() {
        const particleContainer = document.querySelector('.wave-container.particle .particles');
        if (!particleContainer) return;
        
        setInterval(() => {
            if (isPaused) return;
            
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 3px;
                height: 3px;
                background: rgba(255, 255, 255, 0.8);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                bottom: 0;
                animation: particleRise 3s ease-out forwards;
                pointer-events: none;
            `;
            
            particleContainer.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 3000);
        }, 300);
    }
    
    // Control animation function
    window.toggleAnimations = function() {
        const container = document.querySelector('.container');
        isPaused = !isPaused;
        
        if (isPaused) {
            container.classList.add('paused');
        } else {
            container.classList.remove('paused');
        }
        
        const btn = document.querySelector('.control-btn');
        btn.textContent = isPaused ? 'Resume' : 'Pause';
    };
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rippleEffect {
            to {
                transform: scale(1);
                opacity: 0;
            }
        }
        
        @keyframes bounceClick {
            0% { transform: scale(1); }
            50% { transform: scale(0.95); }
            100% { transform: scale(1); }
        }
        
        @keyframes particleRise {
            0% {
                transform: translateY(0) scale(0);
                opacity: 0;
            }
            10% {
                opacity: 1;
                transform: translateY(-20px) scale(1);
            }
            90% {
                opacity: 1;
                transform: translateY(-100px) scale(1);
            }
            100% {
                transform: translateY(-120px) scale(0);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Start dynamic particles
    createDynamicParticles();
    
    // Auto-cycle animations every 20 seconds
    setInterval(() => {
        if (!isPaused) {
            waveContainers.forEach((container, index) => {
                setTimeout(() => {
                    container.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        container.style.transform = 'scale(1)';
                    }, 200);
                }, index * 100);
            });
        }
    }, 20000);
    
    // Add mouse movement effect
    document.addEventListener('mousemove', function(e) {
        if (isPaused) return;
        
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        waveContainers.forEach((container, index) => {
            const speedX = (mouseX - 0.5) * 10;
            const speedY = (mouseY - 0.5) * 10;
            
            container.style.transform = `translate(${speedX}px, ${speedY}px) scale(1)`;
        });
    });
    
    // Reset transform on mouse leave
    document.addEventListener('mouseleave', function() {
        waveContainers.forEach(container => {
            container.style.transform = 'translate(0, 0) scale(1)';
        });
    });
});