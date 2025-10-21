document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card');
    const floatingDrops = document.querySelectorAll('.drop');
    
    // Enhanced ink spread effect
    cards.forEach(card => {
        const inkEffect = card.querySelector('.ink-effect');
        const cardColor = card.getAttribute('data-color');
        
        card.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Position ink effect at mouse position
            inkEffect.style.left = x + 'px';
            inkEffect.style.top = y + 'px';
            inkEffect.style.transform = 'translate(-50%, -50%)';
            
            // Add ink spreading class for additional effects
            this.classList.add('ink-spreading');
            
            // Create additional droplets
            createInkDroplets(this, x, y, cardColor);
        });
        
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Follow mouse with slight delay
            inkEffect.style.left = x + 'px';
            inkEffect.style.top = y + 'px';
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('ink-spreading');
            // Reset ink effect position
            inkEffect.style.left = '50%';
            inkEffect.style.top = '50%';
            inkEffect.style.transform = 'translate(-50%, -50%)';
        });
        
        // Touch support for mobile
        card.addEventListener('touchstart', function(e) {
            e.preventDefault();
            const rect = this.getBoundingClientRect();
            const touch = e.touches[0];
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            
            inkEffect.style.left = x + 'px';
            inkEffect.style.top = y + 'px';
            
            this.classList.add('ink-spreading');
            createInkDroplets(this, x, y, cardColor);
            
            // Auto-trigger hover effect
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
        });
        
        card.addEventListener('touchend', function() {
            this.classList.remove('ink-spreading');
            this.style.transform = '';
            this.style.boxShadow = '';
            
            inkEffect.style.left = '50%';
            inkEffect.style.top = '50%';
        });
    });
    
    function createInkDroplets(card, x, y, color) {
        const numDroplets = 6;
        
        for (let i = 0; i < numDroplets; i++) {
            const droplet = document.createElement('div');
            droplet.className = 'ink-droplet';
            droplet.style.position = 'absolute';
            droplet.style.left = x + 'px';
            droplet.style.top = y + 'px';
            droplet.style.width = '8px';
            droplet.style.height = '8px';
            droplet.style.background = color;
            droplet.style.borderRadius = '50%';
            droplet.style.pointerEvents = 'none';
            droplet.style.zIndex = '3';
            droplet.style.opacity = '0.6';
            
            card.appendChild(droplet);
            
            // Animate droplets spreading out
            const angle = (i / numDroplets) * Math.PI * 2;
            const distance = 40 + Math.random() * 30;
            const targetX = x + Math.cos(angle) * distance;
            const targetY = y + Math.sin(angle) * distance;
            
            droplet.animate([
                {
                    transform: 'translate(-50%, -50%) scale(0)',
                    opacity: 0.6
                },
                {
                    transform: `translate(${targetX - x}px, ${targetY - y}px) scale(1)`,
                    opacity: 0
                }
            ], {
                duration: 800 + Math.random() * 400,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).addEventListener('finish', () => {
                if (card.contains(droplet)) {
                    card.removeChild(droplet);
                }
            });
        }
    }
    
    // Enhanced floating drops animation
    function animateFloatingDrops() {
        floatingDrops.forEach(drop => {
            drop.addEventListener('mouseenter', function() {
                this.style.transform += ' scale(2)';
                this.style.opacity = '0.8';
            });
            
            drop.addEventListener('mouseleave', function() {
                this.style.transform = this.style.transform.replace(' scale(2)', '');
                this.style.opacity = '0.6';
            });
        });
    }
    
    // Create ambient ink particles
    function createAmbientParticles() {
        const container = document.querySelector('.container');
        
        setInterval(() => {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.width = Math.random() * 4 + 2 + 'px';
            particle.style.height = particle.style.width;
            particle.style.background = 'rgba(255, 255, 255, 0.3)';
            particle.style.borderRadius = '50%';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = '100%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1';
            
            document.body.appendChild(particle);
            
            particle.animate([
                {
                    transform: 'translateY(0) rotate(0deg)',
                    opacity: 0.3
                },
                {
                    transform: `translateY(-${window.innerHeight + 100}px) rotate(360deg)`,
                    opacity: 0
                }
            ], {
                duration: 3000 + Math.random() * 2000,
                easing: 'linear'
            }).addEventListener('finish', () => {
                document.body.removeChild(particle);
            });
        }, 2000);
    }
    
    // Auto-demo for recording
    let demoIndex = 0;
    function runDemo() {
        const currentCard = cards[demoIndex];
        
        // Simulate hover
        currentCard.dispatchEvent(new Event('mouseenter'));
        
        setTimeout(() => {
            currentCard.dispatchEvent(new Event('mouseleave'));
        }, 1500);
        
        demoIndex = (demoIndex + 1) % cards.length;
    }
    
    // Initialize all effects
    animateFloatingDrops();
    createAmbientParticles();
    
    // Run demo every 2.5 seconds
    setInterval(runDemo, 2500);
});