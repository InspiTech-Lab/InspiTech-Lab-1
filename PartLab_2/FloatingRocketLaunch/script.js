class RocketLauncher {
    constructor() {
        this.rocket = document.getElementById('rocket');
        this.launchBtn = document.getElementById('launchBtn');
        this.particlesContainer = document.getElementById('particles');
        this.isLaunching = false;

        this.init();
    }

    init() {
        this.launchBtn.addEventListener('click', () => this.startRocketSequence(3)); 
        this.rocket.addEventListener('click', () => this.startRocketSequence(3));

        // Auto-launch cycle
        setInterval(() => {
            if (!this.isLaunching) {
                this.startRocketSequence(3);
            }
        }, 8000);

        // Ambient particles
        this.createAmbientParticles();
    }

    // 🚀 Sequential launch: n rockets ek ke baad ek
    startRocketSequence(count) {
        if (this.isLaunching) return;
        this.isLaunching = true;

        let current = 0;
        const interval = setInterval(() => {
            this.launchRocket();

            current++;
            if (current >= count) {
                clearInterval(interval);
                this.isLaunching = false;
            }
        }, 1000); // har 1 sec ke gap par launch
    }

    launchRocket() {
        this.rocket.classList.add('launching');
        this.createLaunchParticles();

        // Rocket animation reset
        setTimeout(() => {
            this.rocket.classList.remove('launching');
        }, 800);
    }

    createLaunchParticles() {
        const rocketRect = this.rocket.getBoundingClientRect();
        const particleCount = 10;

        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                this.createParticle(
                    rocketRect.left + rocketRect.width / 2,
                    rocketRect.bottom + 20
                );
            }, i * 50);
        }
    }

    createAmbientParticles() {
        setInterval(() => {
            this.createParticle(
                Math.random() * window.innerWidth,
                Math.random() * window.innerHeight
            );
        }, 200);
    }

    createParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.background = this.getRandomColor();

        this.particlesContainer.appendChild(particle);

        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 500);
    }

    getRandomColor() {
        const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}

// Touch particles for mobile
document.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    const particles = document.getElementById('particles');

    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = touch.clientX + (Math.random() - 0.5) * 20 + 'px';
            particle.style.top = touch.clientY + (Math.random() - 0.5) * 20 + 'px';
            particle.style.background = '#fff';
            particles.appendChild(particle);

            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 500);
        }, i * 50);
    }
});

// Init
document.addEventListener('DOMContentLoaded', () => {
    new RocketLauncher();
});
