document.addEventListener('DOMContentLoaded', function() {
    const socialButtons = document.querySelectorAll('.social-btn');
    const tooltip = document.getElementById('tooltip');
    const tooltipText = tooltip.querySelector('.tooltip-text');
    
    let currentButton = null;
    
    function showTooltip(button, text) {
        const rect = button.getBoundingClientRect();
        const containerRect = document.querySelector('.container').getBoundingClientRect();
        
        tooltipText.textContent = text;
        
        // Position tooltip above the button
        const tooltipX = rect.left + rect.width / 2 - containerRect.left;
        const tooltipY = rect.top - containerRect.top - 60;
        
        tooltip.style.left = tooltipX + 'px';
        tooltip.style.top = tooltipY + 'px';
        tooltip.style.transform = 'translateX(-50%)';
        
        // Add show class with slight delay for animation
        setTimeout(() => {
            tooltip.classList.add('show');
        }, 50);
        
        currentButton = button;
    }
    
    function hideTooltip() {
        tooltip.classList.remove('show');
        currentButton = null;
    }
    
    // Add event listeners for each social button
    socialButtons.forEach(button => {
        const tooltipText = button.getAttribute('data-tooltip');
        
        // Mouse events for desktop
        button.addEventListener('mouseenter', () => {
            showTooltip(button, tooltipText);
        });
        
        button.addEventListener('mouseleave', () => {
            hideTooltip();
        });
        
        // Touch events for mobile
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (currentButton === button) {
                hideTooltip();
            } else {
                showTooltip(button, tooltipText);
            }
        });
        
        // Click animation
        button.addEventListener('click', () => {
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
            
            // Create ripple effect
            createRipple(button);
        });
    });
    
    // Hide tooltip when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.social-btn')) {
            hideTooltip();
        }
    });
    
    // Create ripple effect
    function createRipple(button) {
        const ripple = document.createElement('div');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) scale(0);
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            pointer-events: none;
            animation: rippleAnimation 0.6s ease-out;
        `;
        
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
    
    // Add ripple animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rippleAnimation {
            to {
                transform: translate(-50%, -50%) scale(2);
                opacity: 0;
            }
        }
        
        .social-btn {
            position: relative;
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);
    
    // Auto-demo for recording
    function autoDemoTooltips() {
        let index = 0;
        const buttons = Array.from(socialButtons);
        
        function showNextTooltip() {
            if (index < buttons.length) {
                const button = buttons[index];
                const text = button.getAttribute('data-tooltip');
                showTooltip(button, text);
                
                setTimeout(() => {
                    hideTooltip();
                    index++;
                    setTimeout(showNextTooltip, 500);
                }, 2000);
            } else {
                // Restart demo
                setTimeout(() => {
                    index = 0;
                    showNextTooltip();
                }, 3000);
            }
        }
        
        setTimeout(showNextTooltip, 1000);
    }
    
    // Start auto demo
    // autoDemoTooltips();
});