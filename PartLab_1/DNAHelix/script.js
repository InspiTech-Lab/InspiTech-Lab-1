class DNAHelix {
    constructor() {
        this.helix = document.getElementById('dnaHelix');
        this.particles = document.getElementById('particles');
        this.controlBtn = document.getElementById('controlBtn');
        this.isPlaying = true;
        this.bases = ['A', 'T', 'G', 'C'];
        this.pairs = {'A': 'T', 'T': 'A', 'G': 'C', 'C': 'G'};
        
        this.init();
    }

    init() {
        this.createDNAStrands();
        this.createParticles();
        this.bindEvents();
    }

    createDNAStrands() {
        const totalBases = 40;
        const helixHeight = 400;
        const radius = 80;

        for (let i = 0; i < totalBases; i++) {
            const angle = (i * 360 / 10) * (Math.PI / 180);
            const y = (i * helixHeight / totalBases);
            const base = this.bases[Math.floor(Math.random() * this.bases.length)];
            const pair = this.pairs[base];

            // Create left strand
            const leftStrand = this.createStrand(base, {
                x: Math.cos(angle) * radius,
                y: y,
                z: Math.sin(angle) * radius,
                delay: i * 0.1
            });

            // Create right strand (opposite)
            const rightStrand = this.createStrand(pair, {
                x: Math.cos(angle + Math.PI) * radius,
                y: y,
                z: Math.sin(angle + Math.PI) * radius,
                delay: i * 0.1 + 0.05
            });

            // Create connection
            const connection = this.createConnection({
                x1: Math.cos(angle) * radius,
                y: y,
                z1: Math.sin(angle) * radius,
                x2: Math.cos(angle + Math.PI) * radius,
                z2: Math.sin(angle + Math.PI) * radius,
                delay: i * 0.1 + 0.025
            });

            this.helix.appendChild(leftStrand);
            this.helix.appendChild(rightStrand);
            this.helix.appendChild(connection);
        }
    }

    createStrand(base, position) {
        const strand = document.createElement('div');
        strand.className = `strand strand-${base.toLowerCase()}`;
        strand.style.transform = `translate3d(${position.x + 150}px, ${position.y}px, ${position.z}px)`;
        strand.style.animationDelay = `${position.delay}s`;
        return strand;
    }

    createConnection(position) {
        const connection = document.createElement('div');
        connection.className = 'connection';
        const distance = Math.sqrt(Math.pow(position.x2 - position.x1, 2) + Math.pow(position.z2 - position.z1, 2));
        const angle = Math.atan2(position.z2 - position.z1, position.x2 - position.x1) * 180 / Math.PI;
        
        connection.style.width = `${distance}px`;
        connection.style.transform = `translate3d(${position.x1 + 150}px, ${position.y}px, ${position.z1}px) rotateY(${angle}deg)`;
        connection.style.animationDelay = `${position.delay}s`;
        return connection;
    }

    createParticles() {
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 3 + 's';
            particle.style.animationDuration = (2 + Math.random() * 2) + 's';
            this.particles.appendChild(particle);
        }
    }

    bindEvents() {
        this.controlBtn.addEventListener('click', () => {
            if (this.isPlaying) {
                this.helix.style.animationPlayState = 'paused';
                this.controlBtn.textContent = 'Play';
            } else {
                this.helix.style.animationPlayState = 'running';
                this.controlBtn.textContent = 'Pause';
            }
            this.isPlaying = !this.isPlaying;
        });

        // Interactive hover effects
        this.helix.addEventListener('mouseenter', () => {
            if (this.isPlaying) {
                this.helix.style.animationDuration = '12s';
            }
        });

        this.helix.addEventListener('mouseleave', () => {
            if (this.isPlaying) {
                this.helix.style.animationDuration = '8s';
            }
        });
    }
}

// Initialize DNA Helix when page loads
document.addEventListener('DOMContentLoaded', () => {
    new DNAHelix();
});

// Add touch interaction for mobile
document.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.background = 'rgba(255, 255, 255, 0.6)';
    ripple.style.borderRadius = '50%';
    ripple.style.left = touch.clientX - 10 + 'px';
    ripple.style.top = touch.clientY - 10 + 'px';
    ripple.style.pointerEvents = 'none';
    ripple.style.animation = 'rippleEffect 0.6s ease-out';
    document.body.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
});

// Add ripple effect keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);