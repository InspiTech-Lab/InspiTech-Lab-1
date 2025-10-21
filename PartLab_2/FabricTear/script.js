document.addEventListener('DOMContentLoaded', function() {
    const fabricPiece = document.getElementById('fabric-main');
    const tearLines = document.querySelectorAll('.tear-line');
    const fragments = document.querySelectorAll('.fabric-fragment');
    const hiddenContent = document.querySelector('.hidden-content');
    const interactionHint = document.querySelector('.interaction-hint');
    
    let hoverTimeout;
    let isAnimating = false;
    
    // Enhanced tear effect with sound-like visual feedback
    function createTearEffect(e) {
        if (isAnimating) return;
        isAnimating = true;
        
        const rect = fabricPiece.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        // Create dynamic tear from cursor position
        const dynamicTear = document.createElement('div');
        dynamicTear.className = 'tear-line';
        dynamicTear.style.cssText = `
            position: absolute;
            width: 60px;
            height: 2px;
            top: ${y}%;
            left: ${x}%;
            background: linear-gradient(45deg, transparent 0%, rgba(0, 0, 0, 0.9) 50%, transparent 100%);
            opacity: 1;
            z-index: 15;
            transform: rotate(${Math.random() * 60 - 30}deg);
            animation: dynamicTearGrow 0.8s ease-out forwards;
        `;
        
        fabricPiece.appendChild(dynamicTear);
        
        // Remove dynamic tear after animation
        setTimeout(() => {
            dynamicTear.remove();
            isAnimating = false;
        }, 800);
    }
    
    // Add dynamic CSS for dynamic tear animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes dynamicTearGrow {
            0% {
                width: 0;
                opacity: 1;
            }
            50% {
                width: 80px;
                opacity: 0.8;
            }
            100% {
                width: 60px;
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Mouse interaction handlers
    fabricPiece.addEventListener('mouseenter', function() {
        interactionHint.style.opacity = '0.3';
        
        // Stagger tear line appearances
        tearLines.forEach((tear, index) => {
            setTimeout(() => {
                tear.style.opacity = '1';
                tear.style.transform += ' scale(1.1)';
            }, index * 100);
        });
    });
    
    fabricPiece.addEventListener('mousemove', function(e) {
        if (Math.random() > 0.95) { // 5% chance on each mouse move
            createTearEffect(e);
        }
        
        // Parallax effect for fragments based on mouse position
        const rect = fabricPiece.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        
        fragments.forEach((fragment, index) => {
            const moveX = x * (10 + index * 5);
            const moveY = y * (10 + index * 5);
            fragment.style.transform += ` translate(${moveX}px, ${moveY}px)`;
        });
    });
    
    fabricPiece.addEventListener('mouseleave', function() {
        interactionHint.style.opacity = '0.7';
        
        // Reset all tears
        tearLines.forEach(tear => {
            tear.style.opacity = '0';
            tear.style.transform = tear.style.transform.replace(' scale(1.1)', '');
        });
        
        // Reset fragments
        fragments.forEach(fragment => {
            fragment.style.transform = fragment.style.transform.split(' translate')[0];
        });
    });
    
    // Click for dramatic tear effect
    fabricPiece.addEventListener('click', function(e) {
        // Create multiple tears at once
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                createTearEffect({
                    clientX: e.clientX + (Math.random() - 0.5) * 100,
                    clientY: e.clientY + (Math.random() - 0.5) * 100
                });
            }, i * 200);
        }
        
        // Temporary dramatic scaling
        fabricPiece.style.transform = 'scale(1.05)';
        setTimeout(() => {
            fabricPiece.style.transform = 'scale(1.02)';
        }, 300);
    });
    
    // Auto-demo every 8 seconds
    function autoDemoTear() {
        if (!document.querySelector('.fabric-piece:hover')) {
            const centerX = fabricPiece.offsetWidth / 2;
            const centerY = fabricPiece.offsetHeight / 2;
            const rect = fabricPiece.getBoundingClientRect();
            
            createTearEffect({
                clientX: rect.left + centerX,
                clientY: rect.top + centerY
            });
        }
    }
    
    // Start auto-demo
    setInterval(autoDemoTear, 8000);
    
    // Initial demo after page load
    setTimeout(autoDemoTear, 3000);
});