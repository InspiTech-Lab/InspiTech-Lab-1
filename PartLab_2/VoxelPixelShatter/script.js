class VoxelShatterEffect {
    constructor() {
        this.grid = document.getElementById('voxelGrid');
        this.particlesContainer = document.getElementById('particlesContainer');
        this.voxels = [];
        this.isShattered = false;
        
        this.init();
        this.bindEvents();
    }
    
    init() {
        this.createVoxels();
        setTimeout(() => this.autoShatter(), 3000);
    }
    
    createVoxels() {
        const voxelCount = window.innerWidth < 768 ? 36 : 64;
        
        for (let i = 0; i < voxelCount; i++) {
            const voxel = document.createElement('div');
            voxel.className = 'voxel';
            voxel.style.animationDelay = `${i * 0.1}s`;
            this.grid.appendChild(voxel);
            this.voxels.push(voxel);
        }
    }
    
    shatter() {
        if (this.isShattered) return;
        this.isShattered = true;
        
        this.voxels.forEach((voxel, index) => {
            setTimeout(() => {
                voxel.classList.add('shatter');
                this.createParticles(voxel, index);
            }, index * 50);
        });
        
        setTimeout(() => this.reset(), 4000);
    }
    
    createParticles(voxel, index) {
        const rect = voxel.getBoundingClientRect();
        const particleCount = 8;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = 50 + Math.random() * 100;
            const startX = rect.left + rect.width / 2;
            const startY = rect.top + rect.height / 2;
            
            particle.style.left = startX + 'px';
            particle.style.top = startY + 'px';
            
            const endX = startX + Math.cos(angle) * velocity;
            const endY = startY + Math.sin(angle) * velocity;
            
            particle.style.setProperty('--endX', endX + 'px');
            particle.style.setProperty('--endY', endY + 'px');
            
            particle.style.animation = `
                explode 2s ease-out forwards,
                particleMove 2s ease-out forwards
            `;
            
            this.particlesContainer.appendChild(particle);
            
            setTimeout(() => particle.remove(), 2000);
        }
    }
    
    autoShatter() {
        if (!this.isShattered) {
            this.shatter();
        }
    }
    
    reset() {
        this.grid.innerHTML = '';
        this.voxels = [];
        this.isShattered = false;
        this.createVoxels();
        setTimeout(() => this.autoShatter(), 2000);
    }
    
    bindEvents() {
        this.grid.addEventListener('click', () => this.shatter());
        this.grid.addEventListener('touchstart', () => this.shatter());
    }
}

// Add particle movement animation dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes particleMove {
        0% {
            transform: translate(0, 0);
        }
        100% {
            transform: translate(var(--endX, 0), var(--endY, 0));
        }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VoxelShatterEffect();
});