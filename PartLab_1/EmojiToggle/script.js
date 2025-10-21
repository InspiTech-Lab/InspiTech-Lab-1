class EmojiToggleManager {
    constructor() {
        this.toggles = document.querySelectorAll('.emoji-toggle');
        this.labels = document.querySelectorAll('.toggle-label');
        
        this.init();
        this.startDemo();
    }
    
    init() {
        this.toggles.forEach((toggle, index) => {
            toggle.addEventListener('change', (e) => this.handleToggleChange(e, index));
            
            // Add touch support
            const label = toggle.nextElementSibling;
            label.addEventListener('touchstart', (e) => this.handleTouchStart(e, toggle));
            label.addEventListener('click', (e) => this.createClickEffect(e, label));
        });
    }
    
    handleToggleChange(event, index) {
        const toggle = event.target;
        const label = toggle.nextElementSibling;
        const thumb = label.querySelector('.toggle-thumb');
        const emoji = thumb.querySelector('.emoji');
        
        // Get the emoji states from data attributes
        const offEmoji = label.dataset.off;
        const onEmoji = label.dataset.on;
        
        if (toggle.checked) {
            this.animateToggleOn(thumb, emoji, onEmoji, label, index);
        } else {
            this.animateToggleOff(thumb, emoji, offEmoji, label, index);
        }
        
        this.createToggleEffect(label, toggle.checked);
        this.createEmojiPop(thumb, toggle.checked ? onEmoji : offEmoji);
    }
    
    animateToggleOn(thumb, emoji, onEmoji, label, index) {
        // Animate emoji change
        emoji.style.transform = 'scale(0) rotate(180deg)';
        
        setTimeout(() => {
            emoji.textContent = onEmoji;
            emoji.style.transform = 'scale(1.2) rotate(0deg)';
            
            setTimeout(() => {
                emoji.style.transform = 'scale(1) rotate(0deg)';
            }, 200);
        }, 200);
        
        // Special animations for different toggles
        this.addSpecialAnimation(thumb, label, index, true);
    }
    
    animateToggleOff(thumb, emoji, offEmoji, label, index) {
        // Animate emoji change
        emoji.style.transform = 'scale(0) rotate(-180deg)';
        
        setTimeout(() => {
            emoji.textContent = offEmoji;
            emoji.style.transform = 'scale(1.2) rotate(0deg)';
            
            setTimeout(() => {
                emoji.style.transform = 'scale(1) rotate(0deg)';
            }, 200);
        }, 200);
        
        // Special animations for different toggles
        this.addSpecialAnimation(thumb, label, index, false);
    }
    
    addSpecialAnimation(thumb, label, index, isOn) {
        const animations = [
            () => this.wiggleAnimation(thumb),
            () => this.glowAnimation(label),
            () => this.pulseAnimation(thumb),
            () => this.bounceAnimation(thumb),
            () => this.rotateAnimation(thumb),
            () => this.scaleAnimation(thumb),
            () => this.shakeAnimation(thumb),
            () => this.flashAnimation(label)
        ];
        
        if (animations[index]) {
            setTimeout(() => animations[index](), 100);
        }
    }
    
    wiggleAnimation(element) {
        element.style.animation = 'none';
        setTimeout(() => {
            element.style.animation = 'wiggle 0.5s ease-in-out';
        }, 10);
    }
    
    glowAnimation(element) {
        element.style.filter = 'brightness(1.3) saturate(1.5)';
        setTimeout(() => {
            element.style.filter = 'brightness(1) saturate(1)';
        }, 500);
    }
    
    pulseAnimation(element) {
        element.style.animation = 'none';
        setTimeout(() => {
            element.style.animation = 'pulse 0.6s ease-in-out';
        }, 10);
    }
    
    bounceAnimation(element) {
        element.style.transform = 'scale(0.8)';
        setTimeout(() => {
            element.style.transform = 'scale(1.1)';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 150);
        }, 100);
    }
    
    rotateAnimation(element) {
        element.style.transform = 'rotate(360deg) scale(1.1)';
        setTimeout(() => {
            element.style.transform = 'rotate(0deg) scale(1)';
        }, 400);
    }
    
    scaleAnimation(element) {
        element.style.transform = 'scale(1.3)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 300);
    }
    
    shakeAnimation(element) {
        const keyframes = [
            { transform: 'translateX(0)' },
            { transform: 'translateX(-5px)' },
            { transform: 'translateX(5px)' },
            { transform: 'translateX(-3px)' },
            { transform: 'translateX(3px)' },
            { transform: 'translateX(0)' }
        ];
        
        element.animate(keyframes, {
            duration: 400,
            easing: 'ease-in-out'
        });
    }
    
    flashAnimation(element) {
        element.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
        setTimeout(() => {
            element.style.backgroundColor = '';
        }, 200);
    }
    
    createClickEffect(event, label) {
        const rect = label.getBoundingClientRect();
        const x = event.clientX || rect.left + rect.width / 2;
        const y = event.clientY || rect.top + rect.height / 2;
        
        const ripple = document.createElement('div');
        ripple.style.position = 'fixed';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.background = 'rgba(255, 255, 255, 0.6)';
        ripple.style.borderRadius = '50%';
        ripple.style.transform = 'translate(-50%, -50%) scale(0)';
        ripple.style.pointerEvents = 'none';
        ripple.style.zIndex = '1000';
        
        document.body.appendChild(ripple);
        
        ripple.animate([
            { transform: 'translate(-50%, -50%) scale(0)', opacity: 0.8 },
            { transform: 'translate(-50%, -50%) scale(4)', opacity: 0 }
        ], {
            duration: 600,
            easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        });
        
        setTimeout(() => ripple.remove(), 600);
    }
    
    createToggleEffect(label, isOn) {
        // Screen subtle flash
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100vw';
        flash.style.height = '100vh';
        flash.style.background = isOn ? 
            'radial-gradient(circle, rgba(255, 107, 107, 0.1) 0%, transparent 70%)' :
            'radial-gradient(circle, rgba(118, 75, 162, 0.1) 0%, transparent 70%)';
        flash.style.pointerEvents = 'none';
        flash.style.zIndex = '998';
        
        document.body.appendChild(flash);
        
        flash.animate([
            { opacity: 0 },
            { opacity: 1 },
            { opacity: 0 }
        ], {
            duration: 400,
            easing: 'ease-in-out'
        });
        
        setTimeout(() => flash.remove(), 400);
    }
    
    createEmojiPop(thumb, emoji) {
        const pop = document.createElement('div');
        pop.textContent = emoji;
        pop.style.position = 'absolute';
        pop.style.top = '-20px';
        pop.style.left = '50%';
        pop.style.transform = 'translateX(-50%) scale(0)';
        pop.style.fontSize = '24px';
        pop.style.pointerEvents = 'none';
        pop.style.zIndex = '1001';
        
        thumb.appendChild(pop);
        
        pop.animate([
            { transform: 'translateX(-50%) scale(0) translateY(0)', opacity: 0 },
            { transform: 'translateX(-50%) scale(1.5) translateY(-10px)', opacity: 1 },
            { transform: 'translateX(-50%) scale(0.8) translateY(-20px)', opacity: 0 }
        ], {
            duration: 800,
            easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        });
        
        setTimeout(() => pop.remove(), 800);
    }
    
    handleTouchStart(event, toggle) {
        // Add haptic-like feedback for touch
        const label = event.currentTarget;
        label.style.transform = 'scale(0.98)';
        setTimeout(() => {
            label.style.transform = 'scale(1)';
        }, 100);
    }
    
    startDemo() {
        // Auto demo for social media
        const demoSequence = [
            { index: 0, delay: 1000 },
            { index: 1, delay: 1800 },
            { index: 2, delay: 2600 },
            { index: 3, delay: 3400 },
            { index: 4, delay: 4200 },
            { index: 5, delay: 5000 },
            { index: 6, delay: 5800 },
            { index: 7, delay: 6600 }
        ];
        
        // First wave - turn on
        demoSequence.forEach(({ index, delay }) => {
            setTimeout(() => {
                if (!this.toggles[index].checked) {
                    this.toggles[index].click();
                }
            }, delay);
        });
        
        // Second wave - turn off
        setTimeout(() => {
            demoSequence.forEach(({ index, delay }) => {
                setTimeout(() => {
                    if (this.toggles[index].checked) {
                        this.toggles[index].click();
                    }
                }, delay / 2);
            });
        }, 8000);
        
        // Random toggles for variety
        setTimeout(() => {
            const randomToggles = [1, 3, 5, 7, 0, 2, 4, 6];
            randomToggles.forEach((index, i) => {
                setTimeout(() => {
                    this.toggles[index].click();
                }, i * 400);
            });
        }, 12000);
        
        // Loop the demo
        setInterval(() => {
            // Reset all
            this.toggles.forEach(toggle => {
                if (toggle.checked) toggle.click();
            });
            
            setTimeout(() => {
                demoSequence.forEach(({ index, delay }) => {
                    setTimeout(() => {
                        if (!this.toggles[index].checked) {
                            this.toggles[index].click();
                        }
                    }, delay);
                });
                
                setTimeout(() => {
                    demoSequence.forEach(({ index, delay }) => {
                        setTimeout(() => {
                            if (this.toggles[index].checked) {
                                this.toggles[index].click();
                            }
                        }, delay / 2);
                    });
                }, 8000);
            }, 1000);
        }, 18000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EmojiToggleManager();
});