class WeatherWidget {
    constructor() {
        this.weatherStates = [
            {
                condition: 'Sunny',
                temperature: 24,
                humidity: 65,
                wind: 12,
                pressure: 1013,
                icon: 'sunny'
            },
            {
                condition: 'Cloudy',
                temperature: 18,
                humidity: 78,
                wind: 8,
                pressure: 1008,
                icon: 'cloudy'
            },
            {
                condition: 'Rainy',
                temperature: 15,
                humidity: 89,
                wind: 15,
                pressure: 995,
                icon: 'rainy'
            }
        ];
        
        this.currentStateIndex = 0;
        this.init();
    }

    init() {
        this.updateDate();
        this.createWeatherParticles();
        this.setupEventListeners();
        this.startWeatherCycle();
    }

    updateDate() {
        const now = new Date();
        const options = { 
            weekday: 'long',
            month: 'short',
            day: 'numeric'
        };
        document.getElementById('current-date').textContent = 
            now.toLocaleDateString('en-US', options);
    }

    createWeatherParticles() {
        const particlesContainer = document.getElementById('weather-particles');
        
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'weather-particle';
            particle.style.width = Math.random() * 4 + 2 + 'px';
            particle.style.height = particle.style.width;
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 3 + 's';
            particle.style.animationDuration = (Math.random() * 2 + 2) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    updateWeatherIcon(iconType) {
        const iconContainer = document.getElementById('weather-icon');
        iconContainer.className = `weather-icon ${iconType}`;
        
        iconContainer.innerHTML = '';
        
        if (iconType === 'sunny') {
            iconContainer.innerHTML = `
                <div class="sun">
                    <div class="sun-rays"></div>
                </div>
            `;
        } else if (iconType === 'cloudy') {
            iconContainer.innerHTML = `
                <div class="cloud">
                    <div class="cloud-part cloud-part-1"></div>
                    <div class="cloud-part cloud-part-2"></div>
                    <div class="cloud-part cloud-part-3"></div>
                </div>
            `;
        } else if (iconType === 'rainy') {
            iconContainer.innerHTML = `
                <div class="rain-cloud">
                    <div class="cloud">
                        <div class="cloud-part cloud-part-1"></div>
                        <div class="cloud-part cloud-part-2"></div>
                    </div>
                    <div class="rain-drops">
                        <div class="rain-drop"></div>
                        <div class="rain-drop"></div>
                        <div class="rain-drop"></div>
                    </div>
                </div>
            `;
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

    updateWeatherState() {
        const state = this.weatherStates[this.currentStateIndex];
        const widget = document.querySelector('.weather-widget');
        
        widget.style.transform = 'scale(0.95)';
        widget.style.opacity = '0.7';
        
        setTimeout(() => {
            // Update weather icon with animation
            this.updateWeatherIcon(state.icon);
            
            // Animate temperature change
            const tempElement = document.getElementById('temperature');
            const currentTemp = parseInt(tempElement.textContent);
            this.animateValue(tempElement, currentTemp, state.temperature, 800, '°');
            
            // Update description
            document.getElementById('weather-desc').textContent = state.condition;
            
            // Animate other values
            const humidityElement = document.getElementById('humidity');
            const currentHumidity = parseInt(humidityElement.textContent);
            this.animateValue(humidityElement, currentHumidity, state.humidity, 600, '%');
            
            const windElement = document.getElementById('wind');
            const currentWind = parseInt(windElement.textContent);
            this.animateValue(windElement, currentWind, state.wind, 600, ' km/h');
            
            const pressureElement = document.getElementById('pressure');
            const currentPressure = parseInt(pressureElement.textContent);
            this.animateValue(pressureElement, currentPressure, state.pressure, 600, ' hPa');
            
            widget.style.transform = 'scale(1)';
            widget.style.opacity = '1';
        }, 200);
        
        this.currentStateIndex = (this.currentStateIndex + 1) % this.weatherStates.length;
    }

    setupEventListeners() {
        const refreshBtn = document.getElementById('refresh-btn');
        
        refreshBtn.addEventListener('click', () => {
            refreshBtn.classList.add('rotating');
            this.updateWeatherState();
            
            setTimeout(() => {
                refreshBtn.classList.remove('rotating');
            }, 500);
        });
    }

    startWeatherCycle() {
        setInterval(() => {
            this.updateWeatherState();
        }, 5000);
    }
}

// Add additional CSS for cloud and rain animations
const additionalCSS = `
.cloud {
    position: relative;
    width: 60px;
    height: 40px;
}

.cloud-part {
    position: absolute;
    background: linear-gradient(45deg, #ecf0f1, #bdc3c7);
    border-radius: 20px;
    animation: cloudFloat 4s ease-in-out infinite;
}

.cloud-part-1 {
    width: 30px;
    height: 30px;
    top: 5px;
    left: 10px;
}

.cloud-part-2 {
    width: 40px;
    height: 25px;
    top: 10px;
    left: 0;
    animation-delay: -1s;
}

.cloud-part-3 {
    width: 35px;
    height: 28px;
    top: 8px;
    right: 5px;
    animation-delay: -2s;
}

.rain-cloud {
    position: relative;
}

.rain-drops {
    position: absolute;
    top: 35px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 8px;
}

.rain-drop {
    width: 2px;
    height: 12px;
    background: linear-gradient(to bottom, #3498db, #2980b9);
    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
    animation: rainFall 1s ease-in-out infinite;
}

.rain-drop:nth-child(2) {
    animation-delay: -0.3s;
}

.rain-drop:nth-child(3) {
    animation-delay: -0.6s;
}

@keyframes cloudFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
}

@keyframes rainFall {
    0% { 
        transform: translateY(0);
        opacity: 0;
    }
    50% {
        opacity: 1;
    }
    100% { 
        transform: translateY(20px);
        opacity: 0;
    }
}

.weather-widget {
    transition: all 0.3s ease;
}
`;

// Inject additional CSS
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);

// Initialize widget when page loads
document.addEventListener('DOMContentLoaded', () => {
    new WeatherWidget();
});