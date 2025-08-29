document.addEventListener('DOMContentLoaded', function() {
    const checkboxes = document.querySelectorAll('.bouncy-checkbox');
    const completionBadge = document.querySelector('.badge-text');
    let completedCount = 0;
    
    checkboxes.forEach((checkbox, index) => {
        checkbox.addEventListener('change', function() {
            const label = this.nextElementSibling;
            const particleSystem = label.parentElement.querySelector('.particle-system');
            
            if (this.checked) {
                completedCount++;
                createParticleExplosion(particleSystem);
                
                // Add completion effect
                setTimeout(() => {
                    label.style.animation = 'completionPulse 0.6s ease-out';
                }, 100);
                
            } else {
                completedCount--;
            }
            
            updateBadge();
        });
        
     
    });
    
    function createParticleExplosion(container) {
        container.style.opacity = '1';
        
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const angle = (i / 12) * Math.PI * 2;
            const velocity = 60 + Math.random() * 40;
            const x = Math.cos(angle) * velocity;
            const y = Math.sin(angle) * velocity;
            
            particle.style.left = '50%';
            particle.style.top = '50%';
            particle.style.setProperty('--x', x + 'px');
            particle.style.setProperty('--y', y + 'px');
            
            container.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 1000);
        }
        
        setTimeout(() => {
            container.style.opacity = '0';
        }, 1000);
    }
    
    function updateBadge() {
        completionBadge.textContent = `${completedCount}/4 Complete`;
        
        if (completedCount === 4) {
            const badge = completionBadge.parentElement;
            badge.style.background = 'linear-gradient(135deg, #4ecdc4, #44a08d)';
            badge.style.animation = 'badgeSuccess 1s ease-out';
            completionBadge.textContent = 'All Done! 🎉';
        }
    }
});

// Add additional CSS animations
const style = document.createElement('style');
style.textContent = `
    .particle {
        animation: particleFly 1s ease-out forwards;
    }
    
    @keyframes particleFly {
        to {
            transform: translate(var(--x), var(--y)) scale(0);
            opacity: 0;
        }
    }
    
    @keyframes completionPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); filter: brightness(1.2); }
        100% { transform: scale(1); }
    }
    
    @keyframes badgeSuccess {
        0% { transform: scale(1); }
        50% { transform: scale(1.15) rotate(5deg); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);