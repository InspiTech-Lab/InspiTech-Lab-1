document.addEventListener('DOMContentLoaded', function() {
    const morphStage = document.querySelector('.morph-stage');
    const triggerBtn = document.querySelector('.trigger-btn');
    const inkBlob = document.querySelector('.ink-blob');
    const fireElement = document.querySelector('.fire-element');
    
    let isTransformed = false;
    let animationTimeout;
    
    // Auto-cycle animation every 6 seconds
    function startAutoCycle() {
        setInterval(() => {
            if (!morphStage.classList.contains('morphing')) {
                triggerTransformation();
            }
        }, 6000);
    }
    
    // Transform function
    function triggerTransformation() {
        if (animationTimeout) return;
        
        if (!isTransformed) {
            // Ink to Fire
            morphStage.classList.add('morphing');
            triggerBtn.classList.add('morphing');
            triggerBtn.textContent = 'Burning...';
            
            // Add dramatic scaling effect to ink before disappearing
            setTimeout(() => {
                inkBlob.style.transform = 'translate(-50%, -50%) scale(0.1) rotate(720deg)';
                inkBlob.style.filter = 'brightness(2) blur(10px)';
            }, 200);
            
            // Show fire with burst effect
            setTimeout(() => {
                fireElement.style.transform = 'translate(-50%, -50%) scale(1.3)';
                fireElement.style.filter = 'brightness(1.5) saturate(1.3)';
            }, 800);
            
            animationTimeout = setTimeout(() => {
                isTransformed = true;
                triggerBtn.textContent = 'Extinguish';
                triggerBtn.classList.remove('morphing');
                animationTimeout = null;
            }, 2000);
            
        } else {
            // Fire to Ink
            morphStage.classList.remove('morphing');
            triggerBtn.classList.add('morphing');
            triggerBtn.textContent = 'Cooling...';
            
            // Fade fire with shrinking effect
            fireElement.style.transform = 'translate(-50%, -50%) scale(0.1)';
            fireElement.style.filter = 'brightness(0.3) blur(5px)';
            
            // Restore ink with emergence effect
            setTimeout(() => {
                inkBlob.style.transform = 'translate(-50%, -50%) scale(1.2) rotate(0deg)';
                inkBlob.style.filter = 'brightness(1) blur(0px)';
            }, 500);
            
            setTimeout(() => {
                inkBlob.style.transform = 'translate(-50%, -50%) scale(1) rotate(0deg)';
                fireElement.style.transform = 'translate(-50%, -50%) scale(1)';
                fireElement.style.filter = 'brightness(1) saturate(1)';
            }, 1000);
            
            animationTimeout = setTimeout(() => {
                isTransformed = false;
                triggerBtn.textContent = 'Transform';
                triggerBtn.classList.remove('morphing');
                animationTimeout = null;
            }, 2000);
        }
    }
    
    // Button click handler
    triggerBtn.addEventListener('click', triggerTransformation);
    
    // Enhanced particle effects on hover
    morphStage.addEventListener('mouseenter', function() {
        if (!morphStage.classList.contains('morphing')) {
            if (isTransformed) {
                // Enhance fire on hover
                fireElement.style.filter = 'brightness(1.3) saturate(1.2) contrast(1.1)';
                fireElement.querySelectorAll('.flame').forEach((flame, index) => {
                    flame.style.animationDuration = '1s';
                });
            } else {
                // Enhance ink on hover
                inkBlob.style.filter = 'brightness(1.2) contrast(1.3)';
                inkBlob.style.transform = 'translate(-50%, -50%) scale(1.1)';
            }
        }
    });
    
    morphStage.addEventListener('mouseleave', function() {
        if (!morphStage.classList.contains('morphing')) {
            if (isTransformed) {
                fireElement.style.filter = 'brightness(1) saturate(1) contrast(1)';
                fireElement.querySelectorAll('.flame').forEach(flame => {
                    flame.style.animationDuration = '1.5s';
                });
            } else {
                inkBlob.style.filter = 'brightness(1) contrast(1)';
                inkBlob.style.transform = 'translate(-50%, -50%) scale(1)';
            }
        }
    });
    
    // Start the auto-cycle after initial load
    setTimeout(startAutoCycle, 2000);
    
    // Initial auto-transformation
    setTimeout(() => {
        triggerTransformation();
    }, 3000);
});