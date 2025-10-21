// Create floating background shapes
function createFloatingShapes() {
    const backgroundAnimation = document.querySelector('.background-animation');
    
    for (let i = 0; i < 15; i++) {
        const shape = document.createElement('div');
        shape.className = 'floating-shape';
        
        const size = Math.random() * 60 + 20;
        shape.style.width = size + 'px';
        shape.style.height = size + 'px';
        shape.style.left = Math.random() * 100 + '%';
        shape.style.animationDelay = Math.random() * 20 + 's';
        shape.style.animationDuration = (Math.random() * 10 + 15) + 's';
        
        backgroundAnimation.appendChild(shape);
    }
}

// Add click effects to chat bubbles
function addClickEffects() {
    const chatBubbles = document.querySelectorAll('.chat-bubble');
    
    chatBubbles.forEach(bubble => {
        bubble.addEventListener('click', function() {
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.width = '100px';
            ripple.style.height = '100px';
            ripple.style.background = 'rgba(255, 255, 255, 0.3)';
            ripple.style.borderRadius = '50%';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'rippleEffect 0.6s ease-out';
            ripple.style.pointerEvents = 'none';
            ripple.style.left = '50%';
            ripple.style.top = '50%';
            ripple.style.marginLeft = '-50px';
            ripple.style.marginTop = '-50px';
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple effect keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rippleEffect {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Add hover sound effect simulation (visual feedback)
function addHoverEffects() {
    const typingIndicators = document.querySelectorAll('.typing-indicator');
    
    typingIndicators.forEach(indicator => {
        const parentBubble = indicator.closest('.chat-bubble');
        
        parentBubble.addEventListener('mouseenter', function() {
            // Speed up animation on hover
            const elements = indicator.children;
            Array.from(elements).forEach(element => {
                const currentAnimation = window.getComputedStyle(element).animation;
                element.style.animationDuration = '0.8s';
            });
        });
        
        parentBubble.addEventListener('mouseleave', function() {
            // Reset animation speed
            const elements = indicator.children;
            Array.from(elements).forEach(element => {
                element.style.animationDuration = '';
            });
        });
    });
}

// Restart animations for reels loop
function restartAnimations() {
    const typingIndicators = document.querySelectorAll('.typing-indicator');
    
    typingIndicators.forEach(indicator => {
        const children = indicator.children;
        Array.from(children).forEach(child => {
            child.style.animation = 'none';
            child.offsetHeight; // Trigger reflow
            child.style.animation = null;
        });
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    createFloatingShapes();
    addClickEffects();
    addHoverEffects();
    
    // Restart animations every 18 seconds for perfect reels loop
    setInterval(restartAnimations, 18000);
});

// Add touch effects for mobile
document.addEventListener('touchstart', function(e) {
    if (e.target.closest('.chat-bubble')) {
        e.target.closest('.chat-bubble').style.transform = 'scale(0.98)';
    }
});

document.addEventListener('touchend', function(e) {
    if (e.target.closest('.chat-bubble')) {
        e.target.closest('.chat-bubble').style.transform = '';
    }
});