document.addEventListener('DOMContentLoaded', function() {
    const candles = document.querySelectorAll('.candle');
    const flames = document.querySelectorAll('.flame');
    const progress = document.querySelector('.progress');
    
    let loadingComplete = false;
    let currentProgress = 0;

    // Enhanced flame flicker effect
    function enhanceFlameFlicker() {
        flames.forEach((flame, index) => {
            const flameCore = flame.querySelector('.flame-core');
            const flameGlow = flame.querySelector('.flame-glow');
            
            setInterval(() => {
                const randomScale = 0.8 + Math.random() * 0.4;
                const randomRotate = -5 + Math.random() * 10;
                const randomOpacity = 0.7 + Math.random() * 0.3;
                
                flameCore.style.transform = `scale(${randomScale}) rotate(${randomRotate}deg)`;
                flameGlow.style.opacity = randomOpacity;
                
                // Simulate wind effect occasionally
                if (Math.random() > 0.9) {
                    flameCore.style.transform += ` translateX(${Math.random() * 6 - 3}px)`;
                }
            }, 100 + index * 50);
        });
    }

    // Candle height variation
    function simulateMelting() {
        candles.forEach((candle, index) => {
            let baseHeight = 160;
            let currentHeight = baseHeight;
            
            setInterval(() => {
                // Gradually reduce height and then restore
                const cycle = (Date.now() / 100) % 160;
                if (cycle < 80) {
                    currentHeight = baseHeight - (cycle * 0.5);
                } else {
                    currentHeight = baseHeight - (40 - (cycle - 80) * 0.5);
                }
                
                candle.style.height = `${Math.max(100, currentHeight)}px`;
            }, 200 + index * 100);
        });
    }

    // Wax drip animation enhancement
    function enhanceWaxDrips() {
        const waxDrips = document.querySelectorAll('.wax-drip');
        
        waxDrips.forEach((drip, index) => {
            setInterval(() => {
                // Random drip timing
                if (Math.random() > 0.7) {
                    drip.style.animation = 'none';
                    void drip.offsetWidth; // Trigger reflow
                    drip.style.animation = 'waxDrip 3s ease-out';
                }
            }, 2000 + index * 1000);
        });
    }

    // Progress simulation with realistic pauses
    function simulateLoading() {
        const stages = [0, 15, 35, 50, 65, 80, 95, 100];
        let stageIndex = 0;
        
        const progressInterval = setInterval(() => {
            if (stageIndex < stages.length) {
                const targetProgress = stages[stageIndex];
                const increment = (targetProgress - currentProgress) / 10;
                
                const smoothProgress = setInterval(() => {
                    if (currentProgress < targetProgress) {
                        currentProgress += increment;
                        progress.style.width = `${Math.min(currentProgress, targetProgress)}%`;
                    } else {
                        clearInterval(smoothProgress);
                        stageIndex++;
                        
                        // Add realistic pauses at certain stages
                        if (stageIndex === 3 || stageIndex === 6) {
                            setTimeout(() => {}, 1000); // Pause for realism
                        }
                        
                        if (stageIndex >= stages.length) {
                            loadingComplete = true;
                            setTimeout(() => {
                                // Reset for continuous loop
                                currentProgress = 0;
                                stageIndex = 0;
                                progress.style.width = '0%';
                                loadingComplete = false;
                            }, 2000);
                        }
                    }
                }, 50);
            }
        }, 1500);
    }

    // Add interactive flame blow effect
    function addInteractiveEffects() {
        candles.forEach(candle => {
            candle.addEventListener('click', function() {
                const flame = this.querySelector('.flame-core');
                const originalTransform = flame.style.transform;
                
                // Blow effect
                flame.style.transform = 'scale(0.3) rotate(45deg) translateX(20px)';
                flame.style.opacity = '0.3';
                
                setTimeout(() => {
                    flame.style.transform = originalTransform;
                    flame.style.opacity = '1';
                }, 300);
            });
        });
    }

    // Initialize all effects
    enhanceFlameFlicker();
    simulateMelting();
    enhanceWaxDrips();
    simulateLoading();
    addInteractiveEffects();

    // Auto-restart the loading cycle
    setInterval(() => {
        if (loadingComplete) {
            currentProgress = 0;
            progress.style.width = '0%';
            loadingComplete = false;
        }
    }, 18000);

    // Add ambient glow effect to background
    const container = document.querySelector('.container');
    let glowIntensity = 0;
    
    setInterval(() => {
        glowIntensity = 0.1 + Math.random() * 0.1;
        container.style.filter = `drop-shadow(0 0 50px rgba(244, 162, 97, ${glowIntensity}))`;
    }, 200);
});