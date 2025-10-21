document.addEventListener('DOMContentLoaded', function() {
    const tiltCard = document.querySelector('.tilt-card');
    
    function handleMouseMove(e) {
        const rect = tiltCard.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - centerX) / (rect.width / 2);
        const deltaY = (e.clientY - centerY) / (rect.height / 2);
        
        const tiltX = deltaY * 15;
        const tiltY = deltaX * -15;
        
        tiltCard.style.transform = `
            translateY(-8px) 
            rotateX(${tiltX}deg) 
            rotateY(${tiltY}deg) 
            scale(1.02)
        `;
    }
    
    function handleMouseLeave() {
        tiltCard.style.transform = 'translateY(0) rotateX(0) rotateY(0) scale(1)';
    }
    
    // Desktop interactions
    tiltCard.addEventListener('mousemove', handleMouseMove);
    tiltCard.addEventListener('mouseleave', handleMouseLeave);
    
    // Mobile touch interactions
    tiltCard.addEventListener('touchstart', function(e) {
        e.preventDefault();
        tiltCard.style.transform = 'translateY(-4px) scale(1.05)';
    });
    
    tiltCard.addEventListener('touchend', function(e) {
        e.preventDefault();
        tiltCard.style.transform = 'translateY(0) scale(1)';
    });
    
    // Add random sparkle effects
    function createSparkle() {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: white;
            border-radius: 50%;
            pointer-events: none;
            opacity: 0;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: sparkleAnimation 2s ease-out forwards;
        `;
        
        tiltCard.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 2000);
    }
    
    // Add sparkle animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes sparkleAnimation {
            0% { opacity: 0; transform: scale(0); }
            50% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(0); }
        }
    `;
    document.head.appendChild(style);
    
    // Create sparkles on hover
    tiltCard.addEventListener('mouseenter', function() {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => createSparkle(), i * 200);
        }
    });
});