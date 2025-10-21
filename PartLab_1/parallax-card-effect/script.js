document.addEventListener('DOMContentLoaded', function() {
    const card = document.querySelector('.parallax-card');
    const cardContainer = document.querySelector('.card-container');
    
    cardContainer.addEventListener('mousemove', function(e) {
        const rect = cardContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.setProperty('--rotateX', `${rotateX}deg`);
        card.style.setProperty('--rotateY', `${rotateY}deg`);
        
        card.style.transform = `
            perspective(1000px) 
            rotateY(${rotateY}deg) 
            rotateX(${rotateX}deg) 
            translateZ(50px)
        `;
        
        // Parallax effect for floating elements
        const dots = card.querySelectorAll('.floating-dot');
        dots.forEach((dot, index) => {
            const speed = (index + 1) * 0.5;
            const moveX = (x - centerX) * speed * 0.02;
            const moveY = (y - centerY) * speed * 0.02;
            dot.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });
    
    cardContainer.addEventListener('mouseleave', function() {
        card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0px)';
        
        const dots = card.querySelectorAll('.floating-dot');
        dots.forEach(dot => {
            dot.style.transform = 'translate(0px, 0px)';
        });
    });
    
    // Add click effect
    card.addEventListener('click', function() {
        this.style.animation = 'cardClick 0.8s ease-out';
        setTimeout(() => {
            this.style.animation = '';
        }, 800);
    });
});

// Add CSS keyframes for click animation
const style = document.createElement('style');
style.textContent = `
    @keyframes cardClick {
        0% { transform: perspective(1000px) scale(1); }
        50% { transform: perspective(1000px) scale(0.95) rotateY(10deg); }
        100% { transform: perspective(1000px) scale(1); }
    }
`;
document.head.appendChild(style);