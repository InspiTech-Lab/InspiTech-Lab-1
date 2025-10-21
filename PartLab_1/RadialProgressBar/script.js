document.addEventListener('DOMContentLoaded', function() {
    const progressCircles = document.querySelectorAll('.progress-circle');
    
    function animateProgress() {
        progressCircles.forEach(circle => {
            const progress = parseInt(circle.dataset.progress);
            const progressFill = circle.querySelector('.progress-fill');
            const progressText = circle.querySelector('.progress-text');
            const innerProgress = circle.querySelector('.progress-inner');
            
            // Animate main progress
            setTimeout(() => {
                const degree = (progress / 100) * 360;
                progressFill.style.background = `conic-gradient(from -90deg, ${getProgressColor(circle)} ${degree}deg, transparent ${degree}deg)`;
                
                // Animate text counting
                animateCounter(progressText, 0, progress, 2000);
                
                // Animate inner progress for multi-layer
                if (innerProgress) {
                    const innerProgressValue = parseInt(innerProgress.dataset.progress || 30);
                    const innerDegree = (innerProgressValue / 100) * 360;
                    setTimeout(() => {
                        innerProgress.style.background = `conic-gradient(from -90deg, #e74c3c ${innerDegree}deg, transparent ${innerDegree}deg)`;
                    }, 500);
                }
            }, Math.random() * 1000);
        });
    }
    
    function getProgressColor(circle) {
        if (circle.classList.contains('gradient')) {
            return '#4ecdc4';
        } else if (circle.classList.contains('neon')) {
            return '#00ff88';
        } else if (circle.classList.contains('multi')) {
            return '#3498db';
        } else if (circle.classList.contains('pulse')) {
            return '#9b59b6';
        } else if (circle.classList.contains('glow')) {
            return '#3498db';
        }
        return '#3498db';
    }
    
    function animateCounter(element, start, end, duration) {
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            const currentValue = Math.floor(progress * (end - start) + start);
            element.textContent = currentValue + '%';
            
            if (progress < 1) {
                requestAnimationFrame(animation);
            }
        }
        
        requestAnimationFrame(animation);
    }
    
    // Add click interaction
    progressCircles.forEach(circle => {
        circle.addEventListener('click', function() {
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
            
            // Trigger sparkle effect
            createSparkles(this);
        });
    });
    
    function createSparkles(element) {
        for (let i = 0; i < 6; i++) {
            const sparkle = document.createElement('div');
            sparkle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: white;
                border-radius: 50%;
                pointer-events: none;
                animation: sparkleAnimation 1s ease-out forwards;
            `;
            
            const rect = element.getBoundingClientRect();
            sparkle.style.left = rect.left + rect.width/2 + 'px';
            sparkle.style.top = rect.top + rect.height/2 + 'px';
            
            document.body.appendChild(sparkle);
            
            const angle = (i / 6) * Math.PI * 2;
            const distance = 50 + Math.random() * 30;
            sparkle.style.setProperty('--end-x', Math.cos(angle) * distance + 'px');
            sparkle.style.setProperty('--end-y', Math.sin(angle) * distance + 'px');
            
            setTimeout(() => sparkle.remove(), 1000);
        }
    }
    
    // Add sparkle animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes sparkleAnimation {
            to {
                transform: translate(var(--end-x), var(--end-y));
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Reset function
    window.resetProgress = function() {
        progressCircles.forEach(circle => {
            const progressFill = circle.querySelector('.progress-fill');
            const progressText = circle.querySelector('.progress-text');
            const innerProgress = circle.querySelector('.progress-inner');
            
            progressFill.style.background = 'conic-gradient(from -90deg, transparent 0deg, transparent 0deg)';
            progressText.textContent = '0%';
            
            if (innerProgress) {
                innerProgress.style.background = 'conic-gradient(from -90deg, transparent 0deg, transparent 0deg)';
            }
        });
        
        setTimeout(animateProgress, 500);
    };
    
    // Start animation
    animateProgress();
    
    // Auto-restart every 15 seconds
    setInterval(() => {
        resetProgress();
    }, 15000);
});