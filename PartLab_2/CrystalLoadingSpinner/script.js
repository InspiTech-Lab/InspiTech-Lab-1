document.addEventListener('DOMContentLoaded', function() {
    const crystal = document.querySelector('.crystal');
    const crystalFaces = document.querySelectorAll('.crystal-face');
    const rainbowRing = document.querySelector('.rainbow-ring');
    const particles = document.querySelectorAll('.particle');
    const beams = document.querySelectorAll('.beam');
    const container = document.querySelector('.container');
    
    let mouseX = 0;
    let mouseY = 0;
    let isInteracting = false;

    // Enhanced crystal face reflections
    function enhanceCrystalReflections() {
        crystalFaces.forEach((face, index) => {
            let baseOpacity = 0.1;
            let reflectionIntensity = 0;
            
            setInterval(() => {
                // Simulate light hitting different faces
                const time = Date.now() / 1000;
                reflectionIntensity = Math.sin(time + index * 0.5) * 0.3 + 0.1;
                
                face.style.background = `
                    linear-gradient(45deg, 
                        rgba(142, 202, 230, ${baseOpacity}) 0%,
                        rgba(219, 242, 249, ${reflectionIntensity}) 25%,
                        rgba(142, 202, 230, ${baseOpacity}) 50%,
                        rgba(255, 255, 255, ${reflectionIntensity + 0.1}) 75%,
                        rgba(142, 202, 230, ${baseOpacity}) 100%
                    )`;
                
                face.style.boxShadow = `
                    inset 0 0 20px rgba(255, 255, 255, ${reflectionIntensity}),
                    0 0 ${20 + reflectionIntensity * 30}px rgba(142, 202, 230, ${reflectionIntensity})`;
            }, 100);
        });
    }

    // Dynamic rainbow ring colors
    function animateRainbowRing() {
        const segments = document.querySelectorAll('.ring-segment');
        
        setInterval(() => {
            segments.forEach((segment, index) => {
                const hue = (Date.now() / 20 + index * 60) % 360;
                const saturation = 80 + Math.sin(Date.now() / 1000) * 20;
                const lightness = 50 + Math.sin(Date.now() / 800 + index) * 15;
                
                const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
                
                if (index % 2 === 0) {
                    segment.style.borderTopColor = color;
                    segment.style.borderBottomColor = 'transparent';
                } else {
                    segment.style.borderRightColor = color;
                    segment.style.borderLeftColor = 'transparent';
                }
            });
        }, 50);
    }

    // Interactive mouse effects
    function addMouseInteractions() {
        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            mouseX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
            mouseY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
            
            isInteracting = true;
            
            // Tilt crystal based on mouse position
            const tiltX = mouseY * 20;
            const tiltY = mouseX * -20;
            
            crystal.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
            
            // Adjust particle speeds
            particles.forEach((particle, index) => {
                const baseSpeed = 8 + index;
                const mouseInfluence = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
                const newSpeed = baseSpeed + mouseInfluence * 5;
                particle.style.animationDuration = `${newSpeed}s`;
            });
        });

        container.addEventListener('mouseleave', () => {
            isInteracting = false;
            crystal.style.transform = '';
            
            // Reset particle speeds
            particles.forEach((particle, index) => {
                const baseSpeed = 8 + index;
                particle.style.animationDuration = `${baseSpeed}s`;
            });
        });
    }

    // Touch interactions for mobile
    function addTouchInteractions() {
        container.addEventListener('touchstart', (e) => {
            e.preventDefault();
            isInteracting = true;
            
            // Add touch glow effect
            crystal.style.filter = 'brightness(1.3) contrast(1.2)';
        });

        container.addEventListener('touchend', () => {
            isInteracting = false;
            crystal.style.filter = '';
        });

        container.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = container.getBoundingClientRect();
            
            mouseX = (touch.clientX - rect.left - rect.width / 2) / (rect.width / 2);
            mouseY = (touch.clientY - rect.top - rect.height / 2) / (rect.height / 2);
            
            const tiltX = mouseY * 15;
            const tiltY = mouseX * -15;
            
            crystal.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        });
    }

    // Enhanced refraction beams
    function enhanceRefractionBeams() {
        beams.forEach((beam, index) => {
            let intensity = 0;
            
            setInterval(() => {
                intensity = Math.sin(Date.now() / 500 + index * 2) * 0.5 + 0.5;
                const hue = (Date.now() / 30 + index * 120) % 360;
                
                beam.style.background = `
                    linear-gradient(to bottom, 
                        transparent,
                        hsla(${hue}, 80%, 60%, ${intensity * 0.8}),
                        transparent)`;
                
                beam.style.boxShadow = `
                    0 0 ${10 + intensity * 20}px hsla(${hue}, 80%, 60%, ${intensity})`;
            }, 100);
        });
    }

    // Create additional sparkle particles
    function createSparkles() {
        const sparkleContainer = document.createElement('div');
        sparkleContainer.className = 'sparkles';
        sparkleContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            overflow: hidden;
        `;
        
        container.appendChild(sparkleContainer);
        
        setInterval(() => {
            if (Math.random() > 0.7) {
                const sparkle = document.createElement('div');
                sparkle.style.cssText = `
                    position: absolute;
                    width: 3px;
                    height: 3px;
                    background: white;
                    border-radius: 50%;
                    top: ${Math.random() * 100}%;
                    left: ${Math.random() * 100}%;
                    animation: sparkleLife 2s ease-out forwards;
                    box-shadow: 0 0 10px rgba(255,255,255,0.8);
                `;
                
                sparkleContainer.appendChild(sparkle);
                
                setTimeout(() => {
                    sparkle.remove();
                }, 2000);
            }
        }, 300);
        
        // Add sparkle animation
        const sparkleStyle = document.createElement('style');
        sparkleStyle.textContent = `
            @keyframes sparkleLife {
                0% { opacity: 0; transform: scale(0); }
                50% { opacity: 1; transform: scale(1.5); }
                100% { opacity: 0; transform: scale(0); }
            }
        `;
        document.head.appendChild(sparkleStyle);
    }

    // Initialize all enhancements
    enhanceCrystalReflections();
    animateRainbowRing();
    addMouseInteractions();
    addTouchInteractions();
    enhanceRefractionBeams();
    createSparkles();

    // Performance optimization
    let frameCount = 0;
    function optimizePerformance() {
        frameCount++;
        
        // Reduce effects on slower devices
        if (frameCount % 60 === 0) {
            const fps = 60 / ((performance.now() - lastTime) / 1000);
            if (fps < 30) {
                // Reduce particle count and animation frequency
                particles.forEach(particle => {
                    particle.style.display = Math.random() > 0.5 ? 'block' : 'none';
                });
            }
        }
        
        requestAnimationFrame(optimizePerformance);
    }
    
    let lastTime = performance.now();
    optimizePerformance();
});