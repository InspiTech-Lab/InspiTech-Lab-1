document.addEventListener('DOMContentLoaded', function() {
    const card = document.querySelector('.card');
    const refractionOverlay = document.querySelector('.refraction-overlay');
    
    // Enhanced hover effects with mouse tracking
    card.addEventListener('mousemove', function(e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 8;
        const rotateY = (centerX - x) / 8;
        
        card.style.transform = `
            scale(1.05) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg)
            perspective(1000px)
        `;
        
        // Update refraction effect based on mouse position
        const gradientX = (x / rect.width) * 100;
        const gradientY = (y / rect.height) * 100;
        
        refractionOverlay.style.background = `
            radial-gradient(circle at ${gradientX}% ${gradientY}%, rgba(255, 255, 255, 0.4) 0%, transparent 40%),
            radial-gradient(circle at ${100-gradientX}% ${100-gradientY}%, rgba(135, 206, 235, 0.5) 0%, transparent 50%),
            linear-gradient(${gradientX}deg, transparent 40%, rgba(255, 255, 255, 0.2) 50%, transparent 60%)
        `;
    });
    
    card.addEventListener('mouseleave', function() {
        card.style.transform = 'scale(1) rotateX(0deg) rotateY(0deg)';
        refractionOverlay.style.background = `
            radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.3) 0%, transparent 40%),
            radial-gradient(circle at 70% 80%, rgba(135, 206, 235, 0.4) 0%, transparent 50%),
            linear-gradient(45deg, transparent 40%, rgba(255, 255, 255, 0.1) 50%, transparent 60%)
        `;
    });
    
    // Create dynamic ripple on click
    card.addEventListener('click', function(e) {
        const ripple = document.createElement('div');
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ripple.style.position = 'absolute';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.width = '10px';
        ripple.style.height = '10px';
        ripple.style.background = 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%)';
        ripple.style.borderRadius = '50%';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.pointerEvents = 'none';
        ripple.style.animation = 'clickRipple 0.8s ease-out forwards';
        
        card.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 800);
    });
    
    // Add dynamic CSS for click ripple
    const style = document.createElement('style');
    style.textContent = `
        @keyframes clickRipple {
            0% {
                width: 10px;
                height: 10px;
                opacity: 0.8;
            }
            100% {
                width: 200px;
                height: 200px;
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});