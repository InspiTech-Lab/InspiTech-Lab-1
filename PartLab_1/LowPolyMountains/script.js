class FloatingMountains {
    constructor() {
        this.container = document.getElementById('mountainsContainer');
        this.cloudsContainer = document.getElementById('clouds');
        this.starsContainer = document.getElementById('stars');
        this.floatingContainer = document.getElementById('floatingElements');
        this.modeBtn = document.getElementById('modeBtn');
        this.isNightMode = false;
        
        this.init();
    }

    init() {
        this.createMountains();
        this.createClouds();
        this.createStars();
        this.createFloatingParticles();
        this.bindEvents();
    }

    createMountains() {
        const mountains = [
            { size: 'large', count: 3, baseSize: 200 },
            { size: 'medium', count: 5, baseSize: 120 },
            { size: 'small', count: 8, baseSize: 80 }
        ];

        mountains.forEach(mountainType => {
            for (let i = 0; i < mountainType.count; i++) {
                const mountain = this.createMountain(mountainType.size, mountainType.baseSize);
                this.container.appendChild(mountain);
            }
        });
    }

    createMountain(size, baseSize) {
        const mountain = document.createElement('div');
        mountain.className = `mountain ${size}`;
        
        const variation = 0.7 + Math.random() * 0.6; // 0.7 to 1.3
        const finalSize = baseSize * variation;
        
        // Position mountains in 3D space
        const x = (Math.random() - 0.5) * 2000;
        const y = window.innerHeight * (0.4 + Math.random() * 0.4);
        const z = (Math.random() - 0.5) * 800;
        
        mountain.style.left = `${window.innerWidth / 2 + x}px`;
        mountain.style.top = `${y}px`;
        mountain.style.transform = `translateZ(${z}px)`;

        // Create faces for 3D effect
        const faces = ['front', 'left', 'right'];
        faces.forEach(face => {
            const mountainFace = document.createElement('div');
            mountainFace.className = `mountain-face ${face}`;
            mountainFace.style.width = `${finalSize}px`;
            mountainFace.style.height = `${finalSize}px`;
            mountain.appendChild(mountainFace);
        });

        // Add random animation delay
        mountain.style.animationDelay = `${Math.random() * 5}s`;

        return mountain;
    }

    createClouds() {
        for (let i = 0; i < 6; i++) {
            const cloud = document.createElement('div');
            cloud.className = 'cloud';
            
            const size = 40 + Math.random() * 60;
            cloud.style.width = `${size}px`;
            cloud.style.height = `${size * 0.6}px`;
            cloud.style.top = `${20 + Math.random() * 40}%`;
            cloud.style.left = `${-100 + Math.random() * 200}px`;
            cloud.style.animationDelay = `${Math.random() * 15}s`;
            cloud.style.animationDuration = `${15 + Math.random() * 10}s`;
            
            this.cloudsContainer.appendChild(cloud);
        }
    }

    createStars() {
        for (let i = 0; i < 100; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            const size = 2 + Math.random() * 4;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 3}s`;
            star.style.animationDuration = `${2 + Math.random() * 2}s`;
            
            this.starsContainer.appendChild(star);
        }
    }

    createFloatingParticles() {
        const createParticle = () => {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            
            const size = 3 + Math.random() * 8;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDuration = `${4 + Math.random() * 4}s`;
            
            this.floatingContainer.appendChild(particle);
            
            // Remove particle after animation
            setTimeout(() => {
                particle.remove();
            }, 8000);
        };

        // Create initial particles
        for (let i = 0; i < 5; i++) {
            setTimeout(createParticle, i * 1000);
        }

        // Continue creating particles
        setInterval(createParticle, 2000);
    }

    bindEvents() {
        this.modeBtn.addEventListener('click', () => {
            this.toggleNightMode();
        });

        // Add mouse movement effect
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            
            this.container.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
        });

        // Touch interaction for mobile
        let touchStartX = 0;
        let touchStartY = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });

        document.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touchX = e.touches[0].clientX;
            const touchY = e.touches[0].clientY;
            
            const deltaX = (touchX - touchStartX) / window.innerWidth * 30;
            const deltaY = (touchY - touchStartY) / window.innerHeight * 30;
            
            this.container.style.transform = `rotateY(${deltaX}deg) rotateX(${-deltaY}deg)`;
        });

        // Reset on touch end
        document.addEventListener('touchend', () => {
            this.container.style.transform = '';
        });

        // Window resize handler
        window.addEventListener('resize', () => {
            this.repositionElements();
        });
    }

    toggleNightMode() {
        this.isNightMode = !this.isNightMode;
        document.body.classList.toggle('night-mode');
        this.modeBtn.textContent = this.isNightMode ? 'Day Mode' : 'Night Mode';
    }

    repositionElements() {
        // Reposition mountains on window resize
        const mountains = this.container.querySelectorAll('.mountain');
        mountains.forEach(mountain => {
            const currentLeft = parseFloat(mountain.style.left);
            const newLeft = window.innerWidth / 2 + (currentLeft - window.innerWidth / 2);
            mountain.style.left = `${newLeft}px`;
        });
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new FloatingMountains();
});

// Add performance optimization
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        // Additional optimizations can be added here
    });
}