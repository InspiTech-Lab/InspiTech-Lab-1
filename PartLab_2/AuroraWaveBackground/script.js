class AuroraAnimation {
    constructor() {
        this.auroraContainer = document.querySelector('.aurora-container');
        this.auroraLayers = document.querySelectorAll('.aurora-layer');
        this.stars = document.querySelectorAll('.star');
        this.title = document.querySelector('.main-title');
        
        this.init();
    }

    init() {
        this.setupInteraction();
        this.startColorCycle();
        this.addMouseInteraction();
        
        // Auto-restart animation cycle
        setInterval(() => {
            this.triggerIntensityWave();
        }, 15000);
    }

    setupInteraction() {
        // Add click interaction for mobile
        this.auroraContainer.addEventListener('click', () => {
            this.triggerIntensityWave();
        });
        
        // Touch interaction for mobile
        this.auroraContainer.addEventListener('touchstart', () => {
            this.triggerIntensityWave();
        });
    }

    addMouseInteraction() {
        if (window.innerWidth > 768) {
            this.auroraContainer.addEventListener('mousemove', (e) => {
                const mouseX = e.clientX / window.innerWidth;
                const mouseY = e.clientY / window.innerHeight;
                
                this.auroraLayers.forEach((layer, index) => {
                    const intensity = 1 + (mouseY * 0.5);
                    const skew = (mouseX - 0.5) * 20;
                    
                    layer.style.transform = `
                        translateY(${mouseY * 20}px) 
                        scaleY(${intensity}) 
                        skewX(${skew}deg)
                    `;
                });
            });
        }
    }

    triggerIntensityWave() {
        this.auroraLayers.forEach((layer, index) => {
            layer.style.animation = 'none';
            layer.offsetHeight; // Trigger reflow
            layer.style.animation = `auroraWave ${12 + index * 3}s ease-in-out infinite`;
        });
        
        // Add temporary intensity boost
        this.auroraContainer.classList.add('intensity-boost');
        setTimeout(() => {
            this.auroraContainer.classList.remove('intensity-boost');
        }, 3000);
    }

    startColorCycle() {
        const colors = [
            ['#00ff88', '#00d4aa', '#0099cc'],
            ['#ff0080', '#8000ff', '#0080ff'],
            ['#00ffff', '#ff6b6b', '#ffd700'],
            ['#ffd700', '#ff8c00', '#ff1493'],
            ['#9d4edd', '#c77dff', '#e0aaff']
        ];
        
        let colorIndex = 0;
        
        setInterval(() => {
            const currentColors = colors[colorIndex % colors.length];
            
            this.auroraLayers.forEach((layer, index) => {
                const gradient = `linear-gradient(${45 + index * 90}deg, 
                    transparent 0%, 
                    ${currentColors[index % currentColors.length]} ${25 + index * 10}%, 
                    ${currentColors[(index + 1) % currentColors.length]} ${50 + index * 10}%, 
                    transparent 100%)`;
                
                layer.style.background = gradient;
            });
            
            colorIndex++;
        }, 8000);
    }
}

// Add CSS for intensity boost
const style = document.createElement('style');
style.textContent = `
    .intensity-boost .aurora-layer {
        opacity: 1 !important;
        animation-duration: 2s !important;
    }
    
    .intensity-boost .aurora-layer-1 {
        opacity: 1 !important;
    }
    
    .intensity-boost .aurora-layer-2 {
        opacity: 0.9 !important;
    }
    
    .intensity-boost .aurora-layer-3 {
        opacity: 0.7 !important;
    }
    
    .intensity-boost .aurora-layer-4 {
        opacity: 0.6 !important;
    }
    
    .intensity-boost .main-title {
        animation-duration: 1s !important;
    }
    
    .intensity-boost .star {
        animation-duration: 0.5s !important;
    }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AuroraAnimation();
});

// Handle resize
window.addEventListener('resize', () => {
    // Refresh animation on resize
    const aurora = new AuroraAnimation();
});