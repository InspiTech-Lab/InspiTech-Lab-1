class SmoothClock {
    constructor() {
        this.clockFace = document.querySelector('.clock-face');
        this.hourHand = document.getElementById('hour-hand');
        this.minuteHand = document.getElementById('minute-hand');
        this.secondHand = document.getElementById('second-hand');
        this.digitalTime = document.getElementById('digital-time');
        this.timezone = document.getElementById('timezone');
        this.currentDate = document.getElementById('current-date');
        
        this.init();
    }

    init() {
        this.createHourMarkers();
        this.createTickMarks();
        this.createParticles();
        this.updateClock();
        this.updateDate();
        this.startClock();
    }

    createHourMarkers() {
        const markersContainer = document.querySelector('.hour-markers');
        
        for (let i = 0; i < 12; i++) {
            const marker = document.createElement('div');
            marker.className = 'hour-marker';
            if (i % 3 === 0) {
                marker.classList.add('major');
            }
            marker.style.transform = `translateX(-50%) rotate(${i * 30}deg)`;
            markersContainer.appendChild(marker);
        }
    }

    createTickMarks() {
        const clockFace = document.querySelector('.clock-face');
        
        for (let i = 0; i < 60; i++) {
            if (i % 5 !== 0) { // Skip hour positions
                const tick = document.createElement('div');
                tick.className = 'tick-mark';
                tick.style.transform = `translateX(-50%) rotate(${i * 6}deg)`;
                clockFace.appendChild(tick);
            }
        }
    }

    createParticles() {
        const particlesContainer = document.querySelector('.clock-particles');
        
        for (let i = 0; i < 25; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    updateClock() {
        const now = new Date();
        const hours = now.getHours() % 12;
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const milliseconds = now.getMilliseconds();

        // Calculate smooth angles
        const secondAngle = (seconds + milliseconds / 1000) * 6;
        const minuteAngle = (minutes + seconds / 60) * 6;
        const hourAngle = (hours + minutes / 60) * 30;

        // Apply smooth transforms
        this.secondHand.style.transform = `rotate(${secondAngle}deg)`;
        this.minuteHand.style.transform = `rotate(${minuteAngle}deg)`;
        this.hourHand.style.transform = `rotate(${hourAngle}deg)`;

        // Update digital time
        const timeString = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        this.digitalTime.textContent = timeString;

        // Add tick effect on second change
        if (milliseconds < 50) {
            this.addTickEffect();
        }
    }

    updateDate() {
        const now = new Date();
        
        // Update timezone
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const shortTZ = timeZone.split('/').pop() || 'LOCAL';
        this.timezone.textContent = shortTZ.toUpperCase();
        
        // Update date
        const dateOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };
        this.currentDate.textContent = now.toLocaleDateString('en-US', dateOptions);
    }

    addTickEffect() {
        // Create ripple effect on tick
        const ripple = document.createElement('div');
        ripple.className = 'tick-ripple';
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 20px;
            height: 20px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        this.clockFace.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);

        // Add particle burst
        this.createTickParticles();
    }

    createTickParticles() {
        const particleCount = 5;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'tick-particle';
            
            const angle = (360 / particleCount) * i;
            const distance = 50;
            const x = Math.cos(angle * Math.PI / 180) * distance;
            const y = Math.sin(angle * Math.PI / 180) * distance;
            
            particle.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: 4px;
                height: 4px;
                background: #64b5f6;
                border-radius: 50%;
                transform: translate(-50%, -50%);
                animation: tickBurst 1s ease-out forwards;
                --end-x: ${x}px;
                --end-y: ${y}px;
                pointer-events: none;
            `;
            
            this.clockFace.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1000);
        }
    }

    startClock() {
        this.updateClock();
        
        // Use requestAnimationFrame for smooth animation
        const animate = () => {
            this.updateClock();
            requestAnimationFrame(animate);
        };
        
        requestAnimationFrame(animate);
        
        // Update date every minute
        setInterval(() => {
            this.updateDate();
        }, 60000);
    }
}

// Add dynamic CSS animations
const dynamicCSS = `
@keyframes ripple {
    to {
        transform: translate(-50%, -50%) scale(10);
        opacity: 0;
    }
}

@keyframes tickBurst {
    to {
        transform: translate(calc(-50% + var(--end-x)), calc(-50% + var(--end-y))) scale(0);
        opacity: 0;
    }
}

.hand {
    transition: none;
}

.second-hand {
    animation: secondGlow 1s ease-in-out infinite alternate;
}

@keyframes secondGlow {
    0% { box-shadow: 0 0 15px rgba(254, 202, 87, 0.7); }
    100% { box-shadow: 0 0 25px rgba(254, 202, 87, 0.9); }
}
`;

const style = document.createElement('style');
style.textContent = dynamicCSS;
document.head.appendChild(style);

// Initialize clock when page loads
document.addEventListener('DOMContentLoaded', () => {
    new SmoothClock();
});