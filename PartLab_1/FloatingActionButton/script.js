document.addEventListener('DOMContentLoaded', function() {
    const fabMain = document.getElementById('fabMain');
    const fabMenu = document.getElementById('fabMenu');
    const particles = document.getElementById('particles');
    let isOpen = false;
    
    // Create floating particles
    function createParticles() {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 3 + 's';
            particle.style.animationDuration = (2 + Math.random() * 2) + 's';
            particles.appendChild(particle);
        }
    }
    
    // FAB click handler
    fabMain.addEventListener('click', function() {
        isOpen = !isOpen;
        
        if (isOpen) {
            fabMain.classList.add('active');
            fabMenu.classList.add('active');
            fabMain.classList.add('clicked');
            
            // Create enhanced burst effect
            createBurstEffect();
            
            // Add staggered glow to menu items
            setTimeout(() => addMenuGlow(), 300);
        } else {
            fabMain.classList.remove('active');
            fabMenu.classList.remove('active');
            removeMenuGlow();
        }
        
        // Remove clicked class after animation
        setTimeout(() => {
            fabMain.classList.remove('clicked');
        }, 800);
    });
    
    // Add menu glow effect
    function addMenuGlow() {
        const fabItems = document.querySelectorAll('.fab-item');
        fabItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('menu-glow');
            }, index * 100);
        });
    }
    
    function removeMenuGlow() {
        const fabItems = document.querySelectorAll('.fab-item');
        fabItems.forEach(item => {
            item.classList.remove('menu-glow');
        });
    }
    
    // FAB item click handlers
    const fabItems = document.querySelectorAll('.fab-item');
    fabItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            const action = this.getAttribute('data-action');
            const tooltip = this.getAttribute('data-tooltip');
            
            // Create enhanced mini burst effect
            createMiniBurst(this);
            
            // Show action feedback
            showActionFeedback(tooltip);
            
            // Close menu after action
            setTimeout(() => {
                isOpen = false;
                fabMain.classList.remove('active');
                fabMenu.classList.remove('active');
                removeMenuGlow();
            }, 400);
        });
    });
    
    // Show action feedback
    function showActionFeedback(action) {
        const feedback = document.createElement('div');
        feedback.className = 'action-feedback';
        feedback.textContent = action;
        feedback.style.cssText = `
            position: fixed;
            top: 130px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(74, 85, 104, 0.9));
            color: white;
            padding: 12px 24px;
            border-radius: 30px;
            font-size: 14px;
            font-weight: 500;
            z-index: 1000;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            animation: feedbackSlide 2s ease-out forwards;
        `;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.remove();
        }, 2000);
    }
    
    // Create burst effect
    function createBurstEffect() {
        const burstContainer = document.createElement('div');
        burstContainer.style.position = 'absolute';
        burstContainer.style.top = '50%';
        burstContainer.style.left = '50%';
        burstContainer.style.transform = 'translate(-50%, -50%)';
        burstContainer.style.pointerEvents = 'none';
        burstContainer.style.zIndex = '5';
        
        for (let i = 0; i < 16; i++) {
            const burst = document.createElement('div');
            burst.style.position = 'absolute';
            burst.style.width = '6px';
            burst.style.height = '6px';
            burst.style.background = `hsl(${Math.random() * 60 + 240}, 90%, 70%)`;
            burst.style.borderRadius = '50%';
            burst.style.boxShadow = `0 0 10px ${burst.style.background}`;
            burst.style.animation = `burst ${1.0 + Math.random() * 0.5}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;
            burst.style.transform = `rotate(${i * (360/16)}deg) translateX(${70 + Math.random() * 20}px)`;
            burstContainer.appendChild(burst);
        }
        
        fabMain.appendChild(burstContainer);
        
        setTimeout(() => {
            burstContainer.remove();
        }, 1500);
    }
    
    // Create mini burst for items
    function createMiniBurst(element) {
        const rect = element.getBoundingClientRect();
        const burstContainer = document.createElement('div');
        burstContainer.style.position = 'fixed';
        burstContainer.style.top = rect.top + rect.height/2 + 'px';
        burstContainer.style.left = rect.left + rect.width/2 + 'px';
        burstContainer.style.pointerEvents = 'none';
        burstContainer.style.zIndex = '1000';
        
        for (let i = 0; i < 8; i++) {
            const burst = document.createElement('div');
            burst.style.position = 'absolute';
            burst.style.width = '3px';
            burst.style.height = '3px';
            burst.style.background = '#667eea';
            burst.style.borderRadius = '50%';
            burst.style.boxShadow = '0 0 8px #667eea';
            burst.style.animation = `miniBurst 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;
            burst.style.transform = `rotate(${i * 45}deg) translateX(${25 + Math.random() * 15}px)`;
            burstContainer.appendChild(burst);
        }
        
        document.body.appendChild(burstContainer);
        
        setTimeout(() => {
            burstContainer.remove();
        }, 800);
    }
    
    // Auto demo cycle
    function autoDemo() {
        setTimeout(() => {
            fabMain.click();
            
            setTimeout(() => {
                const randomItem = fabItems[Math.floor(Math.random() * fabItems.length)];
                randomItem.click();
            }, 2500);
            
            setTimeout(autoDemo, 7000);
        }, 3000);
    }
    
    // Initialize
    createParticles();
    // autoDemo();
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes burst {
            0% {
                opacity: 1;
                transform: scale(1);
            }
            50% {
                opacity: 0.8;
                transform: scale(1.2) translateX(60px);
            }
            100% {
                opacity: 0;
                transform: scale(0) translateX(100px);
            }
        }
        
        @keyframes miniBurst {
            0% {
                opacity: 1;
                transform: scale(1);
            }
            50% {
                opacity: 0.8;
                transform: scale(1.5) translateX(30px);
            }
            100% {
                opacity: 0;
                transform: scale(0) translateX(50px);
            }
        }
        
        .menu-glow {
            animation: menuItemGlow 1s ease-in-out infinite alternate;
        }
        
        @keyframes menuItemGlow {
            0% {
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15), 
                            0 0 0 0 rgba(102, 126, 234, 0);
            }
            100% {
                box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25), 
                            0 0 0 4px rgba(102, 126, 234, 0.3);
            }
        }
        
        @keyframes feedbackSlide {
            0% {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
            }
            10%, 90% {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
            100% {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
            }
        }
    `;
    document.head.appendChild(style);
});