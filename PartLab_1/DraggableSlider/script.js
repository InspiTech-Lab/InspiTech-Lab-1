class SpringSlider {
    constructor() {
        this.thumb = document.getElementById('sliderThumb');
        this.track = this.thumb.parentElement;
        this.valueText = document.getElementById('valueText');
        this.particles = document.getElementById('particles');
        
        this.value = 50;
        this.isDragging = false;
        this.dragStartX = 0;
        this.thumbStartX = 0;
        
        this.init();
        this.createParticles();
        this.startDemo();
    }
    
    init() {
        this.updatePosition();
        this.bindEvents();
    }
    
    bindEvents() {
        // Touch events for mobile
        this.thumb.addEventListener('touchstart', this.onDragStart.bind(this), { passive: false });
        document.addEventListener('touchmove', this.onDrag.bind(this), { passive: false });
        document.addEventListener('touchend', this.onDragEnd.bind(this));
        
        // Mouse events for desktop
        this.thumb.addEventListener('mousedown', this.onDragStart.bind(this));
        document.addEventListener('mousemove', this.onDrag.bind(this));
        document.addEventListener('mouseup', this.onDragEnd.bind(this));
        
        // Track click
        this.track.addEventListener('click', this.onTrackClick.bind(this));
    }
    
    onDragStart(e) {
        e.preventDefault();
        this.isDragging = true;
        
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        this.dragStartX = clientX;
        this.thumbStartX = this.value;
        
        this.thumb.style.transition = 'none';
        this.track.style.setProperty('--fill-width', `${this.value}%`);
        
        this.createBurst(clientX, e.type.includes('touch') ? e.touches[0].clientY : e.clientY);
    }
    
    onDrag(e) {
        if (!this.isDragging) return;
        e.preventDefault();
        
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const trackRect = this.track.getBoundingClientRect();
        const deltaX = clientX - this.dragStartX;
        const deltaPercent = (deltaX / trackRect.width) * 100;
        
        this.value = Math.max(0, Math.min(100, this.thumbStartX + deltaPercent));
        this.updatePosition();
        
        // Create trailing particles
        if (Math.random() > 0.7) {
            this.createTrailParticle(clientX, e.type.includes('touch') ? e.touches[0].clientY : e.clientY);
        }
    }
    
    onDragEnd() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.thumb.style.transition = 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        
        // Spring effect
        this.thumb.style.transform = 'scale(1.1)';
        setTimeout(() => {
            this.thumb.style.transform = 'scale(1)';
        }, 200);
        
        this.createBurst();
    }
    
    onTrackClick(e) {
        if (this.isDragging) return;
        
        const trackRect = this.track.getBoundingClientRect();
        const clickX = e.clientX - trackRect.left;
        const newValue = (clickX / trackRect.width) * 100;
        
        this.animateToValue(Math.max(0, Math.min(100, newValue)));
        this.createBurst(e.clientX, e.clientY);
    }
    
    animateToValue(targetValue) {
        const startValue = this.value;
        const startTime = performance.now();
        const duration = 800;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Spring easing
            const easeProgress = 1 - Math.pow(1 - progress, 3) * Math.cos(progress * Math.PI * 2);
            
            this.value = startValue + (targetValue - startValue) * easeProgress;
            this.updatePosition();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
        this.createBurst();
    }
    
    updatePosition() {
        const thumbPosition = `calc(${this.value}% - 30px)`;
        this.thumb.style.setProperty('--thumb-position', thumbPosition);
        this.track.style.setProperty('--fill-width', `${this.value}%`);
        this.thumb.querySelector('.thumb-value').textContent = Math.round(this.value);
        this.valueText.textContent = Math.round(this.value);
    }
    
    createParticles() {
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.top = Math.random() * 100 + 'vh';
            particle.style.animationDelay = Math.random() * 3 + 's';
            particle.style.animationDuration = (2 + Math.random() * 2) + 's';
            this.particles.appendChild(particle);
        }
    }
    
    createBurst(x, y) {
        const burstContainer = document.createElement('div');
        burstContainer.style.position = 'fixed';
        burstContainer.style.left = (x || window.innerWidth / 2) + 'px';
        burstContainer.style.top = (y || window.innerHeight / 2) + 'px';
        burstContainer.style.pointerEvents = 'none';
        burstContainer.style.zIndex = '1000';
        
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = '6px';
            particle.style.height = '6px';
            particle.style.background = `hsl(${Math.random() * 60 + 320}, 80%, 70%)`;
            particle.style.borderRadius = '50%';
            particle.style.transform = 'translate(-50%, -50%)';
            
            const angle = (i / 8) * Math.PI * 2;
            const distance = 30 + Math.random() * 20;
            const duration = 0.6 + Math.random() * 0.4;
            
            particle.animate([
                { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
                { transform: `translate(${Math.cos(angle) * distance - 50}%, ${Math.sin(angle) * distance - 50}%) scale(1)`, opacity: 0 }
            ], {
                duration: duration * 1000,
                easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            });
            
            burstContainer.appendChild(particle);
        }
        
        document.body.appendChild(burstContainer);
        setTimeout(() => burstContainer.remove(), 1000);
    }
    
    createTrailParticle(x, y) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = 'rgba(255, 255, 255, 0.8)';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '999';
        particle.style.transform = 'translate(-50%, -50%)';
        
        particle.animate([
            { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
            { opacity: 0, transform: 'translate(-50%, -50%) scale(0)' }
        ], {
            duration: 800,
            easing: 'ease-out'
        });
        
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 800);
    }
    
    startDemo() {
        // Auto demo for social media
        setTimeout(() => this.animateToValue(25), 1000);
        setTimeout(() => this.animateToValue(80), 3000);
        setTimeout(() => this.animateToValue(10), 5000);
        setTimeout(() => this.animateToValue(95), 7000);
        setTimeout(() => this.animateToValue(50), 9000);
        
        // Loop the demo
        setInterval(() => {
            setTimeout(() => this.animateToValue(25), 1000);
            setTimeout(() => this.animateToValue(80), 3000);
            setTimeout(() => this.animateToValue(10), 5000);
            setTimeout(() => this.animateToValue(95), 7000);
            setTimeout(() => this.animateToValue(50), 9000);
        }, 12000);
    }
}

function animateToValue(value) {
    window.slider.animateToValue(value);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.slider = new SpringSlider();
});