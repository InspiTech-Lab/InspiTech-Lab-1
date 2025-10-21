class DragToUnlock {
    constructor() {
        this.slider = document.querySelector('.slider-track');
        this.thumb = document.querySelector('.slider-thumb');
        this.fill = document.querySelector('.slider-fill');
        this.text = document.querySelector('.slider-text');
        this.lockScreen = document.querySelector('.lock-screen');
        this.successScreen = document.querySelector('.unlock-success');
        
        this.isDragging = false;
        this.startX = 0;
        this.currentX = 0;
        this.maxDistance = 0;
        this.threshold = 0.8; // 80% to unlock
        
        this.init();
        this.startDemo();
    }
    
    init() {
        this.maxDistance = this.slider.offsetWidth - this.thumb.offsetWidth - 8;
        
        // Mouse events
        this.thumb.addEventListener('mousedown', this.handleStart.bind(this));
        document.addEventListener('mousemove', this.handleMove.bind(this));
        document.addEventListener('mouseup', this.handleEnd.bind(this));
        
        // Touch events
        this.thumb.addEventListener('touchstart', this.handleStart.bind(this));
        document.addEventListener('touchmove', this.handleMove.bind(this));
        document.addEventListener('touchend', this.handleEnd.bind(this));
        
        // Prevent context menu
        this.thumb.addEventListener('contextmenu', e => e.preventDefault());
    }
    
    handleStart(e) {
        e.preventDefault();
        this.isDragging = true;
        
        const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
        const rect = this.slider.getBoundingClientRect();
        this.startX = clientX - rect.left - this.thumb.offsetWidth / 2;
        
        this.thumb.style.transition = 'none';
        this.fill.style.transition = 'none';
        
        // Add haptic feedback for mobile
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
    }
    
    handleMove(e) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        const rect = this.slider.getBoundingClientRect();
        const newX = clientX - rect.left - this.thumb.offsetWidth / 2;
        
        this.currentX = Math.max(0, Math.min(newX - this.startX + 4, this.maxDistance));
        
        this.updateSlider();
        
        // Dynamic text opacity
        const progress = this.currentX / this.maxDistance;
        this.text.style.opacity = 1 - progress;
    }
    
    handleEnd() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        const progress = this.currentX / this.maxDistance;
        
        this.thumb.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        this.fill.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        
        if (progress >= this.threshold) {
            this.unlock();
        } else {
            this.reset();
        }
    }
    
    updateSlider() {
        this.thumb.style.transform = `translateX(${this.currentX}px)`;
        this.fill.style.width = `${this.currentX + 26}px`;
    }
    
    unlock() {
        // Complete the slide
        this.currentX = this.maxDistance;
        this.updateSlider();
        this.text.style.opacity = '0';
        
        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate([50, 50, 50]);
        }
        
        // Show success
        setTimeout(() => {
            this.successScreen.classList.add('show');
        }, 300);
        
        // Reset after demo
        setTimeout(() => {
            this.reset();
            this.successScreen.classList.remove('show');
        }, 2000);
    }
    
    reset() {
        this.currentX = 0;
        this.updateSlider();
        this.text.style.opacity = '1';
        
        // Add bounce effect
        setTimeout(() => {
            this.thumb.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        }, 100);
    }
    
    startDemo() {
        // Auto demo every 8 seconds
        setInterval(() => {
            if (!this.isDragging && !this.successScreen.classList.contains('show')) {
                this.simulateSwipe();
            }
        }, 8000);
        
        // Initial demo after 1 second
        setTimeout(() => {
            this.simulateSwipe();
        }, 1000);
    }
    
    simulateSwipe() {
        let progress = 0;
        const duration = 1500;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            progress = Math.min(elapsed / duration, 1);
            
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            this.currentX = eased * this.maxDistance * 0.95; // Go to 95%
            
            this.updateSlider();
            this.text.style.opacity = 1 - eased;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Snap back
                setTimeout(() => {
                    this.reset();
                }, 500);
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DragToUnlock();
});

// Add particle animation
document.addEventListener('DOMContentLoaded', () => {
    const particlesContainer = document.querySelector('.particles');
    
    // Create floating particles
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: rgba(255,255,255,${Math.random() * 0.5 + 0.2});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            animation: float ${Math.random() * 4 + 6}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        particlesContainer.appendChild(particle);
    }
});

// CSS for floating particles
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
    }
`;
document.head.appendChild(style);