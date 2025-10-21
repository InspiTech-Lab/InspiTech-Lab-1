document.addEventListener('DOMContentLoaded', function() {
    const magneticText = document.getElementById('magneticText');
    const letters = document.querySelectorAll('.letter');
    const particlesContainer = document.querySelector('.particles');
    let mouseX = 0;
    let mouseY = 0;

    // Create floating particles
    function createParticles() {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 4 + 's';
            particle.style.animationDuration = (3 + Math.random() * 4) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    // Magnetic repulsion effect
    function applyMagneticEffect(e) {
        mouseX = e.clientX || (e.touches && e.touches[0].clientX);
        mouseY = e.clientY || (e.touches && e.touches[0].clientY);

        letters.forEach((letter, index) => {
            const rect = letter.getBoundingClientRect();
            const letterCenterX = rect.left + rect.width / 2;
            const letterCenterY = rect.top + rect.height / 2;
            
            const distance = Math.sqrt(
                Math.pow(mouseX - letterCenterX, 2) + 
                Math.pow(mouseY - letterCenterY, 2)
            );
            
            const maxDistance = 150;
            const repelStrength = Math.max(0, (maxDistance - distance) / maxDistance);
            
            if (repelStrength > 0.1) {
                const angleX = (mouseX - letterCenterX) / distance;
                const angleY = (mouseY - letterCenterY) / distance;
                
                const repelX = -angleX * repelStrength * 100;
                const repelY = -angleY * repelStrength * 50;
                const rotation = repelStrength * 180;
                const scale = 1 - repelStrength * 0.3;
                
                letter.style.transform = `
                    translateX(${repelX}px) 
                    translateY(${repelY}px) 
                    rotateY(${rotation}deg) 
                    scale(${scale})
                `;
                letter.style.textShadow = `0 0 ${30 + repelStrength * 20}px rgba(255,255,255,${0.5 + repelStrength * 0.5})`;
                
                // Add repelled class for additional effects
                letter.classList.add('repelled');
            } else {
                letter.style.transform = 'translateX(0) translateY(0) rotateY(0deg) scale(1)';
                letter.style.textShadow = '0 0 20px rgba(255,255,255,0.5)';
                letter.classList.remove('repelled');
            }
        });
    }

    // Reset letters position
    function resetLetters() {
        letters.forEach(letter => {
            letter.style.transform = 'translateX(0) translateY(0) rotateY(0deg) scale(1)';
            letter.style.textShadow = '0 0 20px rgba(255,255,255,0.5)';
            letter.classList.remove('repelled');
        });
    }

    // Event listeners
    magneticText.addEventListener('mousemove', applyMagneticEffect);
    magneticText.addEventListener('touchmove', applyMagneticEffect);
    magneticText.addEventListener('mouseleave', resetLetters);
    magneticText.addEventListener('touchend', resetLetters);

    // Individual letter click/tap effects
    letters.forEach(letter => {
        letter.addEventListener('click', function() {
            this.style.animation = 'repelAnimation 0.8s ease-out';
            setTimeout(() => {
                this.style.animation = '';
            }, 800);
        });
    });

    // Initialize particles
    createParticles();

    // Auto-demonstration for reels (cycles through letters)
    let autoDemo = setInterval(() => {
        letters.forEach((letter, index) => {
            setTimeout(() => {
                letter.classList.add('repelled');
                letter.style.transform = `
                    translateX(${Math.sin(index) * 50}px) 
                    translateY(${Math.cos(index) * 30}px) 
                    rotateY(${index * 60}deg) 
                    scale(0.8)
                `;
                
                setTimeout(() => {
                    letter.classList.remove('repelled');
                    letter.style.transform = 'translateX(0) translateY(0) rotateY(0deg) scale(1)';
                }, 600);
            }, index * 100);
        });
    }, 3000);

    // Clear auto demo on user interaction
    ['mousemove', 'touchstart', 'click'].forEach(event => {
        document.addEventListener(event, () => {
            clearInterval(autoDemo);
            autoDemo = null;
        }, { once: true });
    });
});