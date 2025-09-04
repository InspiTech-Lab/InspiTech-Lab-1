document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn');
    
    // Add click effects to all buttons
    buttons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            // Create click burst effect
            createClickBurst(e, this);
            
            // Add click animation class
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 300);
        });
        
        // Add hover sound effect simulation
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Create click burst effect
    function createClickBurst(e, button) {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.width = '6px';
            particle.style.height = '6px';
            particle.style.background = 'rgba(255, 255, 255, 0.8)';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1000';
            
            const angle = (i / 8) * Math.PI * 2;
            const velocity = 30 + Math.random() * 20;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            particle.style.animation = `burstParticle 0.8s ease-out forwards`;
            particle.style.setProperty('--vx', vx + 'px');
            particle.style.setProperty('--vy', vy + 'px');
            
            button.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 800);
        }
    }
    
    // Auto-cycle demo
    function autoDemo() {
        let currentIndex = 0;
        
        function cycleButtons() {
            const button = buttons[currentIndex];
            
            // Simulate click
            button.classList.add('demo-active');
            
            setTimeout(() => {
                button.classList.remove('demo-active');
                currentIndex = (currentIndex + 1) % buttons.length;
                
                setTimeout(cycleButtons, 800);
            }, 1200);
        }
        
        setTimeout(cycleButtons, 1000);
    }
    
    // Initialize auto demo
    autoDemo();
    
    // Add dynamic styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes burstParticle {
            0% {
                transform: translate(0, 0) scale(1);
                opacity: 1;
            }
            100% {
                transform: translate(var(--vx), var(--vy)) scale(0);
                opacity: 0;
            }
        }
        
        .btn.clicked {
            transform: scale(0.95) !important;
        }
        
        .btn.demo-active {
            animation: demoHighlight 1.2s ease-in-out;
        }
        
        @keyframes demoHighlight {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-8px) scale(1.05); }
        }
    `;
    document.head.appendChild(style);
});