// Create particles
function createParticles() {
    const particlesContainer = document.querySelector('.particles');
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 6) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Add SVG filter for gooey effect
function addGooeyFilter() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.position = 'absolute';
    svg.style.width = '0';
    svg.style.height = '0';
    
    svg.innerHTML = `
        <defs>
            <filter id="gooey">
                <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="gooey" />
                <feComposite in="SourceGraphic" in2="gooey" operator="atop"/>
            </filter>
        </defs>
    `;
    
    document.body.appendChild(svg);
}

// Add hover effects
function addInteractivity() {
    const loaderSections = document.querySelectorAll('.loader-section');
    
    loaderSections.forEach(section => {
        section.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) translateY(-5px)';
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        section.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) translateY(0)';
        });
        
        section.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1.05) translateY(-5px)';
            }, 100);
        });
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    addGooeyFilter();
    addInteractivity();
});

// Restart animations periodically for reels
setInterval(() => {
    const loaders = document.querySelectorAll('.loader');
    loaders.forEach(loader => {
        loader.style.animation = 'none';
        loader.offsetHeight; // Trigger reflow
        loader.style.animation = null;
    });
}, 20000);