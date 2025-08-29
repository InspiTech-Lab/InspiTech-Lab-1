class BatteryChargingAnimation {
    constructor() {
        this.batteryLevel = 0;
        this.isCharging = false;
        this.chargingSpeed = 1;
        this.maxLevel = 100;
        
        this.elements = {
            batteryLevel: document.getElementById('battery-level'),
            percentage: document.getElementById('percentage'),
            chargingStatus: document.getElementById('charging-status'),
            timeRemaining: document.getElementById('time-remaining'),
            voltage: document.getElementById('voltage'),
            current: document.getElementById('current'),
            power: document.getElementById('power'),
            lightningBolt: document.getElementById('lightning-bolt'),
            chargingParticles: document.getElementById('charging-particles'),
            toggleBtn: document.getElementById('toggle-btn')
        };
        
        this.init();
    }

    init() {
        this.createChargingParticles();
        this.setupEventListeners();
        this.startCharging();
        this.updateBatteryDisplay();
    }

    createChargingParticles() {
        const particlesContainer = this.elements.chargingParticles;
        
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'charging-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.bottom = '0';
            particle.style.animationDelay = Math.random() * 2 + 's';
            particle.style.animationDuration = (Math.random() * 1 + 1.5) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    updateBatteryLevel() {
        if (this.isCharging && this.batteryLevel < this.maxLevel) {
            this.batteryLevel += this.chargingSpeed;
            if (this.batteryLevel > this.maxLevel) {
                this.batteryLevel = this.maxLevel;
                this.completeCharging();
            }
        }
        
        // Update visual battery level
        this.elements.batteryLevel.style.width = this.batteryLevel + '%';
        
        // Update percentage with animation
        this.animateValue(this.elements.percentage, 
            parseInt(this.elements.percentage.textContent) || 0, 
            this.batteryLevel, 300, '%');
        
        // Update battery level color based on percentage
        this.updateBatteryColor();
    }

    updateBatteryColor() {
        const level = this.batteryLevel;
        let color;
        
        if (level < 20) {
            color = '#ff6b6b'; // Red for low battery
        } else if (level < 50) {
            color = '#feca57'; // Yellow for medium battery
        } else {
            color = '#48cab2'; // Green for good battery
        }
        
        this.elements.batteryLevel.style.background = `linear-gradient(90deg, ${color}, rgba(255,255,255,0.9))`;
    }

    updateChargingInfo() {
        if (this.isCharging) {
            // Simulate realistic charging values
            const voltage = (4.1 + Math.random() * 0.3).toFixed(1);
            const current = (1.2 + Math.random() * 0.8).toFixed(1);
            const power = (parseFloat(voltage) * parseFloat(current)).toFixed(1);
            
            this.elements.voltage.textContent = voltage + 'V';
            this.elements.current.textContent = current + 'A';
            this.elements.power.textContent = power + 'W';
            
            // Calculate time remaining
            const remainingPercent = this.maxLevel - this.batteryLevel;
            const timeMinutes = Math.round(remainingPercent / this.chargingSpeed * 0.6);
            
            if (timeMinutes > 60) {
                const hours = Math.floor(timeMinutes / 60);
                const mins = timeMinutes % 60;
                this.elements.timeRemaining.textContent = `${hours}h ${mins}m remaining`;
            } else if (timeMinutes > 0) {
                this.elements.timeRemaining.textContent = `${timeMinutes}m remaining`;
            } else {
                this.elements.timeRemaining.textContent = 'Almost done!';
            }
        }
    }

    animateValue(element, start, end, duration, suffix = '') {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.round(current) + suffix;
        }, 16);
    }

    startCharging() {
        this.isCharging = true;
        const widget = document.querySelector('.battery-widget');
        widget.classList.add('charging');
        
        this.elements.chargingStatus.textContent = 'Charging';
        this.elements.lightningBolt.style.display = 'block';
        
        // Update charging animation
        this.chargingInterval = setInterval(() => {
            this.updateBatteryLevel();
            this.updateChargingInfo();
        }, 100);
        
        this.updateToggleButton();
    }

    stopCharging() {
        this.isCharging = false;
        const widget = document.querySelector('.battery-widget');
        widget.classList.remove('charging');
        
        this.elements.chargingStatus.textContent = 'Not Charging';
        this.elements.lightningBolt.style.display = 'none';
        this.elements.timeRemaining.textContent = 'Paused';
        
        clearInterval(this.chargingInterval);
        this.updateToggleButton();
    }

    completeCharging() {
        this.elements.chargingStatus.textContent = 'Fully Charged';
        this.elements.timeRemaining.textContent = 'Complete!';
        this.elements.lightningBolt.style.display = 'none';
        
        // Create completion celebration
        this.createCompletionEffect();
        
        // Reset after delay
        setTimeout(() => {
            this.resetBattery();
        }, 3000);
    }

    createCompletionEffect() {
        const widget = document.querySelector('.battery-widget');
        
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'completion-particle';
            
            const angle = (360 / 30) * i;
            const distance = 150;
            const x = Math.cos(angle * Math.PI / 180) * distance;
            const y = Math.sin(angle * Math.PI / 180) * distance;
            
            particle.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: 6px;
                height: 6px;
                background: #48cab2;
                border-radius: 50%;
                transform: translate(-50%, -50%);
                animation: completionBurst 2s ease-out forwards;
                --end-x: ${x}px;
                --end-y: ${y}px;
                pointer-events: none;
                box-shadow: 0 0 10px rgba(72, 202, 178, 0.8);
            `;
            
            widget.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 2000);
        }
    }

    resetBattery() {
        this.batteryLevel = 0;
        this.stopCharging();
        this.updateBatteryDisplay();
        
        setTimeout(() => {
            this.startCharging();
        }, 1000);
    }

    updateBatteryDisplay() {
        this.elements.batteryLevel.style.width = this.batteryLevel + '%';
        this.elements.percentage.textContent = this.batteryLevel + '%';
        this.updateBatteryColor();
    }

    updateToggleButton() {
        const playIcon = document.querySelector('.play-icon');
        const pauseIcon = document.querySelector('.pause-icon');
        
        if (this.isCharging) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        } else {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        }
    }

    setupEventListeners() {
        this.elements.toggleBtn.addEventListener('click', () => {
            if (this.isCharging) {
                this.stopCharging();
            } else {
                this.startCharging();
            }
        });
    }
}

// Add dynamic CSS for completion effect
const completionCSS = `
@keyframes completionBurst {
    to {
        transform: translate(calc(-50% + var(--end-x)), calc(-50% + var(--end-y))) scale(0);
        opacity: 0;
    }
}

.battery-widget.charging .lightning-bolt {
    animation: lightningFlash 1s ease-in-out infinite;
}

.battery-widget.charging .charging-particle {
    animation: chargeFlow 2s linear infinite;
}
`;

const style = document.createElement('style');
style.textContent = completionCSS;
document.head.appendChild(style);

// Initialize battery animation when page loads
document.addEventListener('DOMContentLoaded', () => {
    new BatteryChargingAnimation();
});