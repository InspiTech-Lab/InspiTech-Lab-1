document.addEventListener('DOMContentLoaded', function() {
    const rippleButtons = document.querySelectorAll('.ripple-btn');
    const clickZone = document.getElementById('clickZone');
    const clickCountElement = document.getElementById('clickCount');
    const rippleCountElement = document.getElementById('rippleCount');
    
    let clickCount = 0;
    let rippleCount = 0;
    
    function updateStats() {
        clickCountElement.textContent = clickCount;
        rippleCountElement.textContent = rippleCount;
    }
    
    function createRipple(element, x, y, color = 'rgba(255, 255, 255, 0.6)') {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        
        const size = Math.max(rect.width, rect.height) * 2;
        const rippleX = x - rect.left - size / 2;
        const rippleY = y - rect.top - size / 2;
        
        ripple.className = 'ripple';
        ripple.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${rippleX}px;
            top: ${rippleY}px;
            background: ${color};
        `;
        
        element.appendChild(ripple);
        rippleCount++;
        updateStats();
        
        setTimeout(() => ripple.remove(), 800);
    }
    
    function createParticleBurst(x, y, color) {
        const colors = [color, '#ffd93d', '#ff6b6b', '#4ecdc4', '#45b7d1'];
        
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            const angle = (i / 8) * Math.PI * 2;
            const velocity = 100 + Math.random() * 50;
            const size = 4 + Math.random() * 4;
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                z-index: 1000;
                animation: particleAnimation 1s ease-out forwards;
                --angle: ${angle};
                --velocity: ${velocity}px;
            `;
            
            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 1000);
        }
    }
    
    // Add particle animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes particleAnimation {
            0% {
                transform: translate(0, 0) scale(1);
                opacity: 1;
            }
            100% {
                transform: translate(
                    calc(cos(var(--angle)) * var(--velocity)), 
                    calc(sin(var(--angle)) * var(--velocity))
                ) scale(0);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Button click handlers
    rippleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            clickCount++;
            
            const rippleType = button.getAttribute('data-ripple');
            let rippleColor = 'rgba(255, 255, 255, 0.6)';
            let burstColor = '#ffffff';
            
            switch(rippleType) {
                case 'primary':
                    rippleColor = 'rgba(139, 92, 246, 0.6)';
                    burstColor = '#8b5cf6';
                    break;
                case 'success':
                    rippleColor = 'rgba(34, 197, 94, 0.6)';
                    burstColor = '#22c55e';
                    break;
                case 'warning':
                    rippleColor = 'rgba(245, 158, 11, 0.6)';
                    burstColor = '#f59e0b';
                    break;
                case 'danger':
                    rippleColor = 'rgba(239, 68, 68, 0.6)';
                    burstColor = '#ef4444';
                    break;
            }
            
            createRipple(button, e.clientX, e.clientY, rippleColor);
            createParticleBurst(e.clientX, e.clientY, burstColor);
            updateStats();
        });
    });
    
    // Click zone handler
    clickZone.addEventListener('click', function(e) {
        clickCount++;
        
        const colors = ['rgba(255, 107, 107, 0.7)', 'rgba(255, 217, 61, 0.7)', 'rgba(78, 205, 196, 0.7)', 'rgba(69, 183, 209, 0.7)'];
        const burstColors = ['#ff6b6b', '#ffd93d', '#4ecdc4', '#45b7d1'];
        
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const randomBurstColor = burstColors[Math.floor(Math.random() * burstColors.length)];
        
        createRipple(clickZone, e.clientX, e.clientY, randomColor);
        createParticleBurst(e.clientX, e.clientY, randomBurstColor);
        updateStats();
    });
    
    // Touch events for mobile
    clickZone.addEventListener('touchstart', function(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const clickEvent = new MouseEvent('click', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        clickZone.dispatchEvent(clickEvent);
    });
    
    rippleButtons.forEach(button => {
        button.addEventListener('touchstart', function(e) {
            e.preventDefault();
            const touch = e.touches[0];
            const clickEvent = new MouseEvent('click', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            button.dispatchEvent(clickEvent);
        });
    });
    
    // Auto-demo for recording
    function autoDemo() {
        const demoActions = [
            () => {
                const btn = rippleButtons[0];
                const rect = btn.getBoundingClientRect();
                const clickEvent = new MouseEvent('click', {
                    clientX: rect.left + rect.width / 2,
                    clientY: rect.top + rect.height / 2
                });
                btn.dispatchEvent(clickEvent);
            },
            () => {
                const btn = rippleButtons[1];
                const rect = btn.getBoundingClientRect();
                const clickEvent = new MouseEvent('click', {
                    clientX: rect.left + rect.width / 2,
                    clientY: rect.top + rect.height / 2
                });
                btn.dispatchEvent(clickEvent);
            },
            () => {
                const rect = clickZone.getBoundingClientRect();
                const clickEvent = new MouseEvent('click', {
                    clientX: rect.left + rect.width * 0.3,
                    clientY: rect.top + rect.height * 0.4
                });
                clickZone.dispatchEvent(clickEvent);
            },
            () => {
                const rect = clickZone.getBoundingClientRect();
                const clickEvent = new MouseEvent('click', {
                    clientX: rect.left + rect.width * 0.7,
                    clientY: rect.top + rect.height * 0.6
                });
                clickZone.dispatchEvent(clickEvent);
            }
        ];
        
        let actionIndex = 0;
        
        function runNextAction() {
            if (actionIndex < demoActions.length) {
                demoActions[actionIndex]();
                actionIndex++;
                setTimeout(runNextAction, 1500);
            } else {
                // Reset and restart
                setTimeout(() => {
                    actionIndex = 0;
                    runNextAction();
                }, 3000);
            }
        }
        
        setTimeout(runNextAction, 2000);
    }
    
    // Start auto demo
    // autoDemo();
});