class ShootingStarManager {
    constructor() {
        this.shootingStarsContainer = document.getElementById('shootingStars');
        this.interactiveArea = document.getElementById('interactiveArea');
        this.wishCountElement = document.getElementById('wishCount');
        this.wishCount = 0;
        
        this.init();
    }
    
    init() {
        // Auto-generate shooting stars
        this.autoGenerateStars();
        
        // Interactive star creation
        this.interactiveArea.addEventListener('click', (e) => this.createShootingStar(e));
        this.interactiveArea.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.createShootingStar(e.touches[0]);
        });
        
        // Keyboard interaction
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.createRandomShootingStar();
            }
        });
    }
    
    autoGenerateStars() {
        // Create shooting stars automatically
        setInterval(() => {
            this.createRandomShootingStar();
        }, 3000 + Math.random() * 2000);
        
        // Burst of stars every 10 seconds
        setInterval(() => {
            this.createStarBurst();
        }, 10000);
    }
    
    createShootingStar(event) {
        const star = document.createElement('div');
        star.className = 'shooting-star';
        
        // Position based on click/touch
        const x = event.clientX || Math.random() * window.innerWidth;
        const y = event.clientY || Math.random() * window.innerHeight * 0.6;
        
        star.style.left = x + 'px';
        star.style.top = y + 'px';
        star.style.background = this.getRandomStarColor();
        
        this.shootingStarsContainer.appendChild(star);
        
        // Trigger animation
        setTimeout(() => {
            star.classList.add('animate');
        }, 10);
        
        // Update wish counter
        this.wishCount++;
        this.wishCountElement.textContent = this.wishCount;
        this.animateWishCounter();
        
        // Remove star after animation
        setTimeout(() => {
            if (star.parentNode) {
                star.parentNode.removeChild(star);
            }
        }, 2000);
        
        // Create particle trail
        this.createParticleTrail(x, y);
    }
    
    createRandomShootingStar() {
        const fakeEvent = {
            clientX: Math.random() * window.innerWidth * 0.8,
            clientY: Math.random() * window.innerHeight * 0.5
        };
        this.createShootingStar(fakeEvent);
    }
    
    createStarBurst() {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 3;
        
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const angle = (Math.PI * 2 * i) / 5;
                const distance = 100;
                const x = centerX + Math.cos(angle) * distance;
                const y = centerY + Math.sin(angle) * distance;
                
                this.createShootingStar({ clientX: x, clientY: y });
            }, i * 200);
        }
    }
    
    createParticleTrail(x, y) {
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.style.position = 'absolute';
                particle.style.left = x + (Math.random() - 0.5) * 20 + 'px';
                particle.style.top = y + (Math.random() - 0.5) * 20 + 'px';
                particle.style.width = '2px';
                particle.style.height = '2px';
                particle.style.background = '#fff';
                particle.style.borderRadius = '50%';
                particle.style.pointerEvents = 'none';
                particle.style.animation = 'particleFade 1s ease-out forwards';
                
                this.shootingStarsContainer.appendChild(particle);
                
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 1000);
            }, i * 50);
        }
    }
    
    getRandomStarColor() {
        const colors = ['#ffffff', '#fffacd', '#87ceeb', '#dda0dd', '#98fb98'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    animateWishCounter() {
        this.wishCountElement.style.transform = 'scale(1.2)';
        this.wishCountElement.style.color = '#ffd700';
        
        setTimeout(() => {
            this.wishCountElement.style.transform = 'scale(1)';
            this.wishCountElement.style.color = '#fff';
        }, 200);
    }
}

// Add CSS animation for particles
const style = document.createElement('style');
style.textContent = `
    @keyframes particleFade {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(0) translateY(-30px);
        }
    }
`;
document.head.appendChild(style);

// Initialize the shooting star manager
document.addEventListener('DOMContentLoaded', () => {
    new ShootingStarManager();
    
    // Add some initial stars after a short delay
    setTimeout(() => {
        const manager = new ShootingStarManager();
        manager.createStarBurst();
    }, 1000);
});