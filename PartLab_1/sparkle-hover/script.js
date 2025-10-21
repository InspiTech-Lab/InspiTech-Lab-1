class SparkleEffect {
    constructor() {
        this.cards = document.querySelectorAll('.sparkle-card');
        this.floatingContainer = document.querySelector('.floating-sparkles');
        this.sparkleCount = 15;
        
        this.init();
    }
    
    init() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', () => this.createSparkles(card));
            card.addEventListener('mouseleave', () => this.clearSparkles(card));
            
            // Touch support for mobile
            card.addEventListener('touchstart', () => this.createSparkles(card));
            card.addEventListener('touchend', () => {
                setTimeout(() => this.clearSparkles(card), 1500);
            });
        });
        
        // Create floating ambient sparkles
        this.createFloatingSparkles();
        
        // Auto demo every 4 seconds
        setInterval(() => {
            this.autoDemo();
        }, 4000);
    }
    
    createSparkles(card) {
        const container = card.querySelector('.sparkle-container');
        const rect = card.getBoundingClientRect();
        
        for (let i = 0; i < this.sparkleCount; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.className = 'sparkle';
                
                // Random position within card
                const x = Math.random() * rect.width;
                const y = Math.random() * rect.height;
                
                sparkle.style.left = x + 'px';
                sparkle.style.top = y + 'px';
                
                // Random animation delay
                sparkle.style.animationDelay = Math.random() * 0.5 + 's';
                
                // Random size
                const size = 4 + Math.random() * 8;
                sparkle.style.width = size + 'px';
                sparkle.style.height = size + 'px';
                
                container.appendChild(sparkle);
                
                // Remove after animation
                setTimeout(() => {
                    if (sparkle.parentNode) {
                        sparkle.parentNode.removeChild(sparkle);
                    }
                }, 1500);
            }, i * 50);
        }
    }
    
    clearSparkles(card) {
        const container = card.querySelector('.sparkle-container');
        // Let existing sparkles finish their animation
        setTimeout(() => {
            container.innerHTML = '';
        }, 1000);
    }
    
    createFloatingSparkles() {
        const createFloater = () => {
            const sparkle = document.createElement('div');
            sparkle.className = 'floating-sparkle';
            
            // Random horizontal position
            sparkle.style.left = Math.random() * window.innerWidth + 'px';
            
            // Random animation duration
            const duration = 6 + Math.random() * 4;
            sparkle.style.animationDuration = duration + 's';
            
            // Random delay
            sparkle.style.animationDelay = Math.random() * 2 + 's';
            
            this.floatingContainer.appendChild(sparkle);
            
            // Remove after animation
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.parentNode.removeChild(sparkle);
                }
            }, (duration + 2) * 1000);
        };
        
        // Create initial sparkles
        for (let i = 0; i < 5; i++) {
            setTimeout(createFloater, i * 1000);
        }
        
        // Continuously create more
        setInterval(createFloater, 2000);
    }
    
    autoDemo() {
        const randomCard = this.cards[Math.floor(Math.random() * this.cards.length)];
        this.createSparkles(randomCard);
        setTimeout(() => this.clearSparkles(randomCard), 1500);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SparkleEffect();
});