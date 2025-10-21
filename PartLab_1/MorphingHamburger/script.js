// Cursor trail effect
function initCursorTrail() {
    const cursorTrail = document.querySelector('.cursor-trail');
    
    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            cursorTrail.style.left = e.clientX - 10 + 'px';
            cursorTrail.style.top = e.clientY - 10 + 'px';
        });
    }
}

// Hamburger menu functionality
function initHamburgerMenus() {
    const hamburgerBtns = document.querySelectorAll('.hamburger-btn');
    
    hamburgerBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const menuContainer = this.closest('.menu-container');
            const isActive = menuContainer.classList.contains('active');
            
            // Close all other active menus
            document.querySelectorAll('.menu-container.active').forEach(container => {
                if (container !== menuContainer) {
                    container.classList.remove('active');
                }
            });
            
            // Toggle current menu
            menuContainer.classList.toggle('active');
            
            // Create particle burst effect
            if (!isActive) {
                createParticleBurst(this);
            }
        });
    });
    
    // Close menu when clicking on overlay
    document.querySelectorAll('.menu-overlay').forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                this.closest('.menu-container').classList.remove('active');
            }
        });
    });
    
    // Close menu with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.menu-container.active').forEach(container => {
                container.classList.remove('active');
            });
        }
    });
}

// Create particle burst effect
function createParticleBurst(button) {
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle-burst';
        
        const angle = (i / 8) * 2 * Math.PI;
        const distance = 50 + Math.random() * 30;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;
        
        particle.style.cssText = `
            left: ${centerX}px;
            top: ${centerY}px;
            --dx: ${dx}px;
            --dy: ${dy}px;
        `;
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 800);
    }
}

// Add hover sound effect simulation (visual feedback)
function addHoverEffects() {
    const menuContainers = document.querySelectorAll('.menu-container');
    
    menuContainers.forEach(container => {
        container.addEventListener('mouseenter', function() {
            this.style.filter = 'brightness(1.1)';
        });
        
        container.addEventListener('mouseleave', function() {
            this.style.filter = 'brightness(1)';
        });
    });
}

// Auto-demo functionality for reels
function startAutoDemo() {
    const menuContainers = document.querySelectorAll('.menu-container');
    let currentIndex = 0;
    
    function demoNextMenu() {
        // Close current active menu
        document.querySelectorAll('.menu-container.active').forEach(container => {
            container.classList.remove('active');
        });
        
        // Open next menu
        setTimeout(() => {
            menuContainers[currentIndex].classList.add('active');
            createParticleBurst(menuContainers[currentIndex].querySelector('.hamburger-btn'));
            
            // Close after 2 seconds
            setTimeout(() => {
                menuContainers[currentIndex].classList.remove('active');
                currentIndex = (currentIndex + 1) % menuContainers.length;
            }, 2000);
        }, 500);
    }
    
    // Start demo after 3 seconds, repeat every 4 seconds
    setTimeout(() => {
        demoNextMenu();
        setInterval(demoNextMenu, 4000);
    }, 3000);
}

// Touch effects for mobile
function initTouchEffects() {
    const menuContainers = document.querySelectorAll('.menu-container');
    
    menuContainers.forEach(container => {
        container.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        container.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
        });
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    initCursorTrail();
    initHamburgerMenus();
    addHoverEffects();
    initTouchEffects();
    
    // Start auto demo for reels (uncomment for auto-play)
    // startAutoDemo();
});

// Menu item click animations
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('menu-item')) {
        e.preventDefault();
        
        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            left: 50%;
            top: 50%;
            width: 100px;
            height: 100px;
            background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: menuRipple 0.6s ease-out;
            pointer-events: none;
        `;
        
        e.target.style.position = 'relative';
        e.target.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
});

// Add menu ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes menuRipple {
        to {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);