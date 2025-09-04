class ShareButton {
    constructor() {
        this.shareBtn = document.getElementById('shareBtn');
        this.shareOptions = document.getElementById('shareOptions');
        this.rippleEffect = document.getElementById('rippleEffect');
        this.isOpen = false;
        
        this.init();
        this.startAutoDemo();
    }
    
    init() {
        this.shareBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleShare();
        });
        
        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.share-wrapper')) {
                this.closeShare();
            }
        });
        
        // Handle share option clicks
        this.shareOptions.querySelectorAll('.share-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleShare(option.dataset.platform);
            });
        });
    }
    
    toggleShare() {
        if (this.isOpen) {
            this.closeShare();
        } else {
            this.openShare();
        }
    }
    
    openShare() {
        this.isOpen = true;
        this.createCircleExpand();
        this.shareBtn.classList.add('active');
        
        setTimeout(() => {
            this.shareOptions.classList.add('active');
        }, 200);
        
        // Stagger the icon animations
        const options = this.shareOptions.querySelectorAll('.share-option');
        options.forEach((option, index) => {
            option.style.animationDelay = `${index * 0.05 + 0.1}s`;
        });
    }
    
    createCircleExpand() {
        const circle = document.createElement('div');
        circle.className = 'circle-expand';
        document.querySelector('.share-wrapper').appendChild(circle);
        
        setTimeout(() => {
            circle.remove();
        }, 800);
    }
    
    closeShare() {
        this.isOpen = false;
        this.shareBtn.classList.remove('active');
        this.shareOptions.classList.remove('active');
    }
    
    createRipple() {
        this.rippleEffect.classList.remove('ripple-active');
        setTimeout(() => {
            this.rippleEffect.classList.add('ripple-active');
        }, 10);
        
        setTimeout(() => {
            this.rippleEffect.classList.remove('ripple-active');
        }, 1000);
    }
    
    handleShare(platform) {
        const option = document.querySelector(`[data-platform="${platform}"]`);
        option.classList.add('clicked');
        
        // Create 3D rotation effect
        this.create3DRotation(option);
        
        // Platform-specific actions (demo)
        switch(platform) {
            case 'copy':
                this.showCopyFeedback();
                break;
            default:
                this.showShareFeedback(platform);
        }
        
        setTimeout(() => {
            option.classList.remove('clicked');
            this.closeShare();
        }, 300);
    }
    
    create3DRotation(element) {
        // Reset any existing animation
        element.style.animation = 'none';
        
        setTimeout(() => {
            element.style.animation = 'clickRotate3D 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards';
        }, 10);
    }
    
    showCopyFeedback() {
        const feedback = document.createElement('div');
        feedback.textContent = 'Link Copied!';
        feedback.style.cssText = `
            position: absolute;
            top: -50px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
            z-index: 1000;
            animation: feedbackSlide 2s ease-out forwards;
        `;
        
        document.querySelector('.share-wrapper').appendChild(feedback);
        
        setTimeout(() => {
            feedback.remove();
        }, 2000);
    }
    
    showShareFeedback(platform) {
        const feedback = document.createElement('div');
        feedback.textContent = `Shared to ${platform.charAt(0).toUpperCase() + platform.slice(1)}!`;
        feedback.style.cssText = `
            position: absolute;
            top: -50px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 128, 0, 0.9);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
            z-index: 1000;
            animation: feedbackSlide 2s ease-out forwards;
            white-space: nowrap;
        `;
        
        document.querySelector('.share-wrapper').appendChild(feedback);
        
        setTimeout(() => {
            feedback.remove();
        }, 2000);
    }
    
    startAutoDemo() {
        let demoStep = 0;
        
        const runDemo = () => {
            if (demoStep % 2 === 0) {
                this.openShare();
                setTimeout(() => {
                    const platforms = ['twitter', 'facebook', 'instagram', 'copy'];
                    const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)];
                    this.handleShare(randomPlatform);
                }, 2000);
            }
            demoStep++;
        };
        
        // Initial demo
        setTimeout(runDemo, 2000);
        
        // Repeat demo every 8 seconds
        setInterval(runDemo, 8000);
    }
}

// Add feedback animation style
const style = document.createElement('style');
style.textContent = `
    @keyframes feedbackSlide {
        0% {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px);
        }
        20% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        80% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        100% {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px);
        }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ShareButton();
});