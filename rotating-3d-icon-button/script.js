document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.icon-button');
    const cursorTrail = document.querySelector('.cursor-trail');
    
    // Cursor trail effect
    document.addEventListener('mousemove', function(e) {
        cursorTrail.style.left = e.clientX - 10 + 'px';
        cursorTrail.style.top = e.clientY - 10 + 'px';
    });
    
    // Enhanced button interactions
    buttons.forEach((button, index) => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'rotateY(180deg) scale(1.1) translateZ(20px)';
            
            // Add ripple effect
            const ripple = document.createElement('div');
            ripple.className = 'ripple-effect';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 1000);
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'rotateY(0deg) scale(1) translateZ(0px)';
        });
        
        button.addEventListener('click', function(e) {
            // Create explosion effect
            createExplosion(e.clientX, e.clientY);
        });
        
        // Automatic rotation demo
        setTimeout(() => {
            button.style.transform = 'rotateY(360deg) scale(1.05)';
            setTimeout(() => {
                button.style.transform = 'rotateY(0deg) scale(1)';
            }, 1000);
        }, index * 1000 + 2000);
    });
    
    function createExplosion(x, y) {
        const explosion = document.createElement('div');
        explosion.className = 'explosion';
        explosion.style.left = x + 'px';
        explosion.style.top = y + 'px';
        document.body.appendChild(explosion);
        
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'explosion-particle';
            particle.style.setProperty('--angle', `${i * 45}deg`);
            explosion.appendChild(particle);
        }
        
        setTimeout(() => {
            explosion.remove();
        }, 1000);
    }
});

// Add explosion styles
const style = document.createElement('style');
style.textContent = `
    .ripple-effect {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 10px;
        height: 10px;
        background: rgba(78, 205, 196, 0.6);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: ripple 1s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            width: 300px;
            height: 300px;
            opacity: 0;
        }
    }
    
    .explosion {
        position: fixed;
        width: 0;
        height: 0;
        pointer-events: none;
        z-index: 100;
    }
    
    .explosion-particle {
        position: absolute;
        width: 6px;
        height: 6px;
        background: #4ecdc4;
        border-radius: 50%;
        animation: explode 0.8s ease-out forwards;
        transform: rotate(var(--angle));
    }
    
    @keyframes explode {
        to {
            transform: rotate(var(--angle)) translateY(-100px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);