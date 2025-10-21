class AnimatedWaveFooter {
    constructor() {
        this.waveContainer = document.getElementById('waveContainer');
        this.floatingParticles = document.getElementById('floatingParticles');
        this.newsletterForm = document.getElementById('newsletterForm');
        this.waves = [];
        
        this.init();
    }

    init() {
        this.createWaves();
        this.createFloatingParticles();
        this.bindEvents();
        this.addScrollEffects();
        this.addInteractiveEffects();
    }

    createWaves() {
        const waveCount = 4;
        const colors = [
            'linear-gradient(135deg, #ff6b6b, #ee5a52)',
            'linear-gradient(135deg, #4ecdc4, #44a08d)',
            'linear-gradient(135deg, #45b7d1, #96c93d)',
            'linear-gradient(135deg, #f093fb, #f5576c)'
        ];

        for (let i = 0; i < waveCount; i++) {
            const wave = document.createElement('div');
            wave.className = 'wave';
            wave.style.background = colors[i];
            wave.style.animationDelay = `${-i * 2}s`;
            wave.style.zIndex = waveCount - i;
            
            this.waveContainer.appendChild(wave);
            this.waves.push(wave);
        }
    }

    createFloatingParticles() {
        const createParticle = () => {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            
            const size = 4 + Math.random() * 8;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.bottom = '0px';
            particle.style.animationDuration = `${6 + Math.random() * 4}s`;
            particle.style.animationDelay = `${Math.random() * 2}s`;
            
            this.floatingParticles.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.remove();
                }
            }, 10000);
        };

        // Create initial particles
        for (let i = 0; i < 8; i++) {
            setTimeout(createParticle, i * 500);
        }

        // Continue creating particles
        setInterval(createParticle, 1500);
    }

    bindEvents() {
        // Newsletter form submission
        this.newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleNewsletterSubmission();
        });

        // Social link interactions
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach((link, index) => {
            link.style.setProperty('--delay', index);
            
            link.addEventListener('mouseenter', () => {
                this.createRippleEffect(link);
            });
        });

        // Footer link animations
        const footerLinks = document.querySelectorAll('.footer-link');
        footerLinks.forEach((link, index) => {
            link.style.setProperty('--delay', index);
        });
    }

    handleNewsletterSubmission() {
        const emailInput = this.newsletterForm.querySelector('.email-input');
        const subscribeBtn = this.newsletterForm.querySelector('.subscribe-btn');
        
        if (emailInput.value && this.isValidEmail(emailInput.value)) {
            // Animate success
            subscribeBtn.textContent = 'Subscribed!';
            subscribeBtn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
            
            // Create success particles
            this.createSuccessParticles();
            
            setTimeout(() => {
                subscribeBtn.textContent = 'Subscribe';
                subscribeBtn.style.background = 'linear-gradient(135deg, #ff6b6b, #4ecdc4)';
                emailInput.value = '';
            }, 3000);
        } else {
            // Shake animation for invalid email
            emailInput.style.animation = 'shake 0.5s ease-in-out';
            emailInput.style.borderColor = '#e74c3c';
            
            setTimeout(() => {
                emailInput.style.animation = '';
                emailInput.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }, 500);
        }
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    createRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.width = '100px';
        ripple.style.height = '100px';
        ripple.style.background = 'rgba(255, 255, 255, 0.3)';
        ripple.style.borderRadius = '50%';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.pointerEvents = 'none';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.marginLeft = '-50px';
        ripple.style.marginTop = '-50px';
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    createSuccessParticles() {
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = '6px';
            particle.style.height = '6px';
            particle.style.background = '#2ecc71';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.left = '50%';
            particle.style.top = '50%';
            
            const angle = (i / 10) * Math.PI * 2;
            const velocity = 50 + Math.random() * 50;
            const x = Math.cos(angle) * velocity;
            const y = Math.sin(angle) * velocity;
            
            particle.style.animation = `successParticle 1s ease-out forwards`;
            particle.style.setProperty('--x', `${x}px`);
            particle.style.setProperty('--y', `${y}px`);
            
            this.newsletterForm.appendChild(particle);
            
            setTimeout(() => particle.remove(), 1000);
        }
    }

    addScrollEffects() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, observerOptions);

        // Observe footer sections
        document.querySelectorAll('.footer-section').forEach(section => {
            observer.observe(section);
        });
    }

    addInteractiveEffects() {
        // Wave interaction on mouse move
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            this.waves.forEach((wave, index) => {
                const intensity = (index + 1) * 0.1;
                const offsetX = (mouseX - 0.5) * 50 * intensity;
                const offsetY = (mouseY - 0.5) * 20 * intensity;
                
                wave.style.transform = `translateX(${offsetX}px) translateY(${offsetY}px)`;
            });
        });

        // Touch interaction for mobile
        document.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            const mouseX = touch.clientX / window.innerWidth;
            const mouseY = touch.clientY / window.innerHeight;
            
            this.waves.forEach((wave, index) => {
                const intensity = (index + 1) * 0.05; // Reduced for mobile
                const offsetX = (mouseX - 0.5) * 25 * intensity;
                const offsetY = (mouseY - 0.5) * 10 * intensity;
                
                wave.style.transform = `translateX(${offsetX}px) translateY(${offsetY}px)`;
            });
        });

        // Reset on mouse/touch leave
        document.addEventListener('mouseleave', () => {
            this.resetWavePositions();
        });

        document.addEventListener('touchend', () => {
            this.resetWavePositions();
        });
    }

    resetWavePositions() {
        this.waves.forEach(wave => {
            wave.style.transform = '';
        });
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new AnimatedWaveFooter();
});

// Add dynamic CSS animations
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    @keyframes successParticle {
        to {
            transform: translate(var(--x), var(--y));
            opacity: 0;
        }
    }
`;
document.head.appendChild(dynamicStyles);