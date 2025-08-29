document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('scratchCanvas');
    const ctx = canvas.getContext('2d');
    const instructionOverlay = document.querySelector('.instruction-overlay');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    let isScratching = false;
    let scratchedPixels = 0;
    const totalPixels = 400 * 600; // Canvas size
    
    // Set canvas size
    canvas.width = 400;
    canvas.height = 600;
    
    // Initialize scratch surface
    function initScratchSurface() {
        ctx.fillStyle = '#667eea';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add scratch pattern overlay
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#764ba2');
        gradient.addColorStop(1, '#667eea');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add texture dots
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        for (let i = 0; i < 100; i++) {
            ctx.beginPath();
            ctx.arc(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                Math.random() * 3 + 1,
                0, 2 * Math.PI
            );
            ctx.fill();
        }
    }
    
    initScratchSurface();
    
    // Scratch functionality
    function scratch(x, y) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 25, 0, 2 * Math.PI);
        ctx.fill();
        scratchedPixels += Math.PI * 25 * 25; // Approximate pixels scratched
        updateProgress();
    }
    
    function updateProgress() {
        const percentage = Math.min((scratchedPixels / totalPixels) * 100 * 3, 100);
        progressFill.style.width = percentage + '%';
        progressText.textContent = Math.round(percentage) + '% revealed';
        
        if (percentage > 70) {
            instructionOverlay.style.opacity = '0';
            setTimeout(() => {
                instructionOverlay.style.display = 'none';
            }, 500);
        }
    }
    
    // Mouse events
    canvas.addEventListener('mousedown', function(e) {
        isScratching = true;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        scratch(x, y);
    });
    
    canvas.addEventListener('mousemove', function(e) {
        if (!isScratching) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        scratch(x, y);
    });
    
    canvas.addEventListener('mouseup', function() {
        isScratching = false;
    });
    
    // Touch events for mobile
    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        isScratching = true;
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        scratch(x, y);
    });
    
    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
        if (!isScratching) return;
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        scratch(x, y);
    });
    
    canvas.addEventListener('touchend', function(e) {
        e.preventDefault();
        isScratching = false;
    });
    
    // Auto-demo after 3 seconds
    setTimeout(() => {
        if (scratchedPixels === 0) {
            autoScratch();
        }
    }, 3000);
    
    function autoScratch() {
        let progress = 0;
        const interval = setInterval(() => {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            scratch(x, y);
            progress += 0.05;
            
            if (progress > 1) {
                clearInterval(interval);
            }
        }, 50);
    }
});