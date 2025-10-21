class BouncyCheckboxManager {
    constructor() {
        this.checkboxes = document.querySelectorAll('.bouncy-checkbox');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        this.totalTasks = this.checkboxes.length;
        
        this.init();
        this.startDemo();
    }
    
    init() {
        this.checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', this.handleCheckboxChange.bind(this));
            // Add click animation
            checkbox.nextElementSibling.addEventListener('click', this.createClickEffect.bind(this));
        });
        
        this.updateProgress();
    }
    
    handleCheckboxChange(event) {
        const checkbox = event.target;
        const label = checkbox.nextElementSibling;
        const visual = label.querySelector('.checkbox-visual');
        const ripple = label.querySelector('.ripple');
        
        if (checkbox.checked) {
            this.animateCheck(visual, ripple, label);
            this.createConfetti(label);
        } else {
            this.animateUncheck(visual, label);
        }
        
        this.updateProgress();
        this.createSoundEffect(checkbox.checked);
    }
    
    animateCheck(visual, ripple, label) {
        // Trigger ripple effect
        ripple.style.width = '0';
        ripple.style.height = '0';
        ripple.style.opacity = '0.6';
        
        setTimeout(() => {
            ripple.style.width = '60px';
            ripple.style.height = '60px';
            ripple.style.opacity = '0';
        }, 50);
        
        // Add bounce to entire label
        label.style.transform = 'scale(0.95)';
        setTimeout(() => {
            label.style.transform = 'scale(1.02)';
            setTimeout(() => {
                label.style.transform = 'scale(1)';
            }, 150);
        }, 100);
    }
    
    animateUncheck(visual, label) {
        visual.style.transform = 'scale(0.9)';
        setTimeout(() => {
            visual.style.transform = 'scale(1)';
        }, 150);
    }
    
    createClickEffect(event) {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX || (event.touches && event.touches[0].clientX) || rect.left + rect.width / 2;
        const y = event.clientY || (event.touches && event.touches[0].clientY) || rect.top + rect.height / 2;
        
        const clickEffect = document.createElement('div');
        clickEffect.style.position = 'fixed';
        clickEffect.style.left = x + 'px';
        clickEffect.style.top = y + 'px';
        clickEffect.style.width = '20px';
        clickEffect.style.height = '20px';
        clickEffect.style.background = 'rgba(78, 205, 196, 0.6)';
        clickEffect.style.borderRadius = '50%';
        clickEffect.style.transform = 'translate(-50%, -50%) scale(0)';
        clickEffect.style.pointerEvents = 'none';
        clickEffect.style.zIndex = '1000';
        
        document.body.appendChild(clickEffect);
        
        clickEffect.animate([
            { transform: 'translate(-50%, -50%) scale(0)', opacity: 0.8 },
            { transform: 'translate(-50%, -50%) scale(3)', opacity: 0 }
        ], {
            duration: 600,
            easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        });
        
        setTimeout(() => clickEffect.remove(), 600);
    }
    
    createConfetti(label) {
        const rect = label.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 12; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = centerX + 'px';
            confetti.style.top = centerY + 'px';
            confetti.style.width = '6px';
            confetti.style.height = '6px';
            confetti.style.background = `hsl(${Math.random() * 360}, 80%, 60%)`;
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '1000';
            
            const angle = (i / 12) * Math.PI * 2;
            const distance = 40 + Math.random() * 30;
            const duration = 800 + Math.random() * 400;
            
            confetti.animate([
                { 
                    transform: 'translate(-50%, -50%) scale(0) rotate(0deg)',
                    opacity: 1 
                },
                { 
                    transform: `translate(${Math.cos(angle) * distance - 50}%, ${Math.sin(angle) * distance - 50}%) scale(1) rotate(360deg)`,
                    opacity: 0 
                }
            ], {
                duration: duration,
                easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            });
            
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), duration);
        }
    }
    
    createSoundEffect(isChecked) {
        // Visual feedback for sound
        document.body.style.filter = isChecked ? 'brightness(1.05)' : 'brightness(0.95)';
        setTimeout(() => {
            document.body.style.filter = 'brightness(1)';
        }, 100);
    }
    
    updateProgress() {
        const checkedCount = document.querySelectorAll('.bouncy-checkbox:checked').length;
        const percentage = (checkedCount / this.totalTasks) * 100;
        
        this.progressFill.style.width = percentage + '%';
        this.progressText.textContent = `${checkedCount}/${this.totalTasks} Complete`;
        
        // Progress celebration
        if (checkedCount === this.totalTasks) {
            this.celebrateCompletion();
        }
    }
    
    celebrateCompletion() {
        // Create celebration effect
        const celebration = document.createElement('div');
        celebration.textContent = '🎉 All Done! 🎉';
        celebration.style.position = 'fixed';
        celebration.style.top = '20%';
        celebration.style.left = '50%';
        celebration.style.transform = 'translate(-50%, -50%) scale(0)';
        celebration.style.fontSize = '2rem';
        celebration.style.fontWeight = 'bold';
        celebration.style.color = '#ff6b6b';
        celebration.style.textShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
        celebration.style.pointerEvents = 'none';
        celebration.style.zIndex = '1001';
        
        document.body.appendChild(celebration);
        
        celebration.animate([
            { transform: 'translate(-50%, -50%) scale(0)', opacity: 0 },
            { transform: 'translate(-50%, -50%) scale(1.2)', opacity: 1 },
            { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
            { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
            { transform: 'translate(-50%, -50%) scale(0)', opacity: 0 }
        ], {
            duration: 3000,
            easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        });
        
        setTimeout(() => celebration.remove(), 3000);
        
        // Screen flash effect
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100vw';
        flash.style.height = '100vh';
        flash.style.background = 'rgba(255, 255, 255, 0.3)';
        flash.style.pointerEvents = 'none';
        flash.style.zIndex = '999';
        
        document.body.appendChild(flash);
        
        flash.animate([
            { opacity: 0 },
            { opacity: 1 },
            { opacity: 0 }
        ], {
            duration: 500,
            easing: 'ease-in-out'
        });
        
        setTimeout(() => flash.remove(), 500);
    }
    
    startDemo() {
        // Auto demo for social media
        const demoSequence = [
            { index: 0, delay: 1000 },
            { index: 2, delay: 2500 },
            { index: 1, delay: 4000 },
            { index: 4, delay: 5500 },
            { index: 3, delay: 7000 },
            { index: 5, delay: 8500 }
        ];
        
        demoSequence.forEach(({ index, delay }) => {
            setTimeout(() => {
                if (!this.checkboxes[index].checked) {
                    this.checkboxes[index].click();
                }
            }, delay);
        });
        
        // Reset and loop
        setTimeout(() => {
            this.checkboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    checkbox.click();
                }
            });
        }, 12000);
        
        // Loop the demo
        setInterval(() => {
            setTimeout(() => {
                demoSequence.forEach(({ index, delay }) => {
                    setTimeout(() => {
                        if (!this.checkboxes[index].checked) {
                            this.checkboxes[index].click();
                        }
                    }, delay);
                });
            }, 1000);
            
            setTimeout(() => {
                this.checkboxes.forEach(checkbox => {
                    if (checkbox.checked) {
                        checkbox.click();
                    }
                });
            }, 12000);
        }, 15000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BouncyCheckboxManager();
});