document.addEventListener('DOMContentLoaded', function() {
    const gridItems = document.querySelectorAll('.grid-item');
    const magneticCursor = document.querySelector('.magnetic-cursor');
    const container = document.querySelector('.container');
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    // Track mouse movement
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth cursor animation
    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.1;
        cursorY += dy * 0.1;
        
        magneticCursor.style.left = cursorX - 10 + 'px';
        magneticCursor.style.top = cursorY - 10 + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Grid item interactions
    gridItems.forEach((item, index) => {
        item.addEventListener('mouseenter', function() {
            this.classList.add('magnetic');
            magneticCursor.style.transform = 'scale(2)';
            
            // Magnetic effect on nearby items
            gridItems.forEach((otherItem, otherIndex) => {
                if (Math.abs(index - otherIndex) <= 1 || Math.abs(index - otherIndex) === 3) {
                    if (otherItem !== this) {
                        otherItem.style.transform = `scale(0.95) translate(${(Math.random() - 0.5) * 10}px, ${(Math.random() - 0.5) * 10}px)`;
                    }
                }
            });
        });
        
        item.addEventListener('mouseleave', function() {
            this.classList.remove('magnetic');
            magneticCursor.style.transform = 'scale(1)';
            
            // Reset other items
            gridItems.forEach(otherItem => {
                if (otherItem !== this && !otherItem.classList.contains('active')) {
                    otherItem.style.transform = '';
                }
            });
        });
        
        item.addEventListener('click', function() {
            this.classList.toggle('active');
            this.classList.add('rippling');
            
            // Create particle burst effect
            createParticleBurst(this);
            
            setTimeout(() => {
                this.classList.remove('rippling');
            }, 600);
        });
    });
    
    function createParticleBurst(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.background = '#ffffff';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1001';
            
            document.body.appendChild(particle);
            
            const angle = (i / 8) * Math.PI * 2;
            const distance = 60;
            const targetX = centerX + Math.cos(angle) * distance;
            const targetY = centerY + Math.sin(angle) * distance;
            
            particle.animate([
                { 
                    transform: 'translate(-50%, -50%) scale(0)', 
                    opacity: 1 
                },
                { 
                    transform: `translate(${targetX - centerX}px, ${targetY - centerY}px) scale(1)`, 
                    opacity: 0 
                }
            ], {
                duration: 800,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).addEventListener('finish', () => {
                document.body.removeChild(particle);
            });
        }
    }
    
    // Auto-demo animation
    let demoIndex = 0;
    setInterval(() => {
        const currentItem = gridItems[demoIndex];
        currentItem.click();
        demoIndex = (demoIndex + 1) % gridItems.length;
    }, 2000);
});