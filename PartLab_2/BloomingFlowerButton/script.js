document.addEventListener('DOMContentLoaded', function() {
    const flowerBtn = document.getElementById('flowerBtn');
    let isBlocked = false;

    flowerBtn.addEventListener('click', function() {
        if (isBlocked) return;
        
        isBlocked = true;
        this.classList.add('bloomed');
        
        // Add bounce effect
        this.style.animation = 'bounceBloom 0.6s ease-out';
        
        // Reset after animation
        setTimeout(() => {
            this.classList.remove('bloomed');
            this.style.animation = '';
            isBlocked = false;
        }, 4000);
    });

    // Add CSS for bounce animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes bounceBloom {
            0%, 20%, 60%, 100% { transform: scale(1); }
            40% { transform: scale(1.1); }
            80% { transform: scale(1.05); }
        }
        
        .flower-button.bloomed {
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { box-shadow: 0 8px 25px rgba(0,0,0,0.2); }
            50% { box-shadow: 0 12px 40px rgba(255, 107, 107, 0.4); }
        }
    `;
    document.head.appendChild(style);

    // Auto-bloom every 8 seconds for demo
    setInterval(() => {
        if (!isBlocked) {
            flowerBtn.click();
        }
    }, 8000);
});