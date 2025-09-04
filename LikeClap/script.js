class InteractionButtons {
    constructor() {
        this.likeBtn = document.getElementById('likeBtn');
        this.clapBtn = document.getElementById('clapBtn');
        this.likeCount = document.getElementById('likeCount');
        this.clapCount = document.getElementById('clapCount');
        this.likeParticles = document.getElementById('likeParticles');
        this.clapParticles = document.getElementById('clapParticles');
        
        this.likes = 0;
        this.claps = 0;
        
        this.init();
        // this.startAutoDemo();
    }
    
    init() {
        this.likeBtn.addEventListener('click', () => this.handleLike());
        this.clapBtn.addEventListener('click', () => this.handleClap());
    }
    
    handleLike() {
        this.likes++;
        this.likeCount.textContent = this.likes;
        
        this.likeBtn.classList.add('liked');
        setTimeout(() => {
            this.likeBtn.classList.remove('liked');
        }, 600);
        
        this.createHeartBurst();
        this.createRingBurst(this.likeBtn);
    }
    
    handleClap() {
        this.claps++;
        this.clapCount.textContent = this.claps;
        
        this.clapBtn.classList.add('clapped');
        setTimeout(() => {
            this.clapBtn.classList.remove('clapped');
        }, 400);
        
        this.createClapBurst();
        this.createRingBurst(this.clapBtn);
    }
    
    createHeartBurst() {
        const heartEmojis = ['💖', '💕', '💗', '❤️', '💘'];
        
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle heart-particle';
            particle.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
            
            const angle = (i / 8) * Math.PI * 2;
            const distance = 80 + Math.random() * 40;
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance;
            
            particle.style.cssText = `
                --dx: ${dx}px;
                --dy: ${dy}px;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
            `;
            
            this.likeParticles.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 1500);
        }
    }
    
    createClapBurst() {
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle clap-particle';
            
            const angle = (i / 12) * Math.PI * 2;
            const distance = 60 + Math.random() * 50;
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance;
            
            particle.style.cssText = `
                --dx: ${dx}px;
                --dy: ${dy}px;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
            `;
            
            this.clapParticles.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 1200);
        }
    }
    
    createRingBurst(button) {
        const ring = document.createElement('div');
        ring.className = 'burst-ring';
        button.appendChild(ring);
        
        setTimeout(() => {
            ring.remove();
        }, 800);
    }
    
    startAutoDemo() {
        let demoStep = 0;
        
        const runDemo = () => {
            if (demoStep % 2 === 0) {
                this.handleLike();
            } else {
                this.handleClap();
            }
            demoStep++;
        };
        
        // Initial demo
        setTimeout(runDemo, 1000);
        
        // Repeat demo every 4 seconds
        setInterval(runDemo, 4000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new InteractionButtons();
});