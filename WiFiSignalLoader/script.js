class WiFiLoader {
    constructor() {
        this.states = [
            { status: 'Searching...', speed: 0, bars: 0 },
            { status: 'Found Network', speed: 0, bars: 1 },
            { status: 'Connecting...', speed: 0, bars: 2 },
            { status: 'Authenticating...', speed: 12, bars: 3 },
            { status: 'Connected!', speed: 150, bars: 5 }
        ];
        
        this.currentState = 0;
        this.isConnected = false;
        
        this.init();
    }

    init() {
        this.createSignalWaves();
        this.startConnectionSequence();
        this.setupEventListeners();
    }

    createSignalWaves() {
        const wavesContainer = document.querySelector('.signal-waves');
        
        for (let i = 0; i < 8; i++) {
            const wave = document.createElement('div');
            wave.className = 'wave';
            wave.style.left = Math.random() * 100 + '%';
            wave.style.top = Math.random() * 100 + '%';
            wave.style.animationDelay = Math.random() * 4 + 's';
            wave.style.animationDuration = (Math.random() * 2 + 3) + 's';
            wavesContainer.appendChild(wave);
        }
    }

    updateSignalBars(activeCount) {
        const strengthBars = document.querySelectorAll('.strength-bar');
        
        strengthBars.forEach((bar, index) => {
            if (index < activeCount) {
                bar.classList.add('active');
            } else {
                bar.classList.remove('active');
            }
        });
    }

    animateConnectionSpeed(targetSpeed) {
        const speedElement = document.getElementById('connection-speed');
        const currentSpeed = parseInt(speedElement.textContent) || 0;
        
        this.animateValue(speedElement, currentSpeed, targetSpeed, 1000, ' Mbps');
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

    updateConnectionState() {
        if (this.currentState >= this.states.length) {
            this.currentState = 0;
            this.resetConnection();
            return;
        }

        const state = this.states[this.currentState];
        const statusText = document.getElementById('status-text');
        const wifiLoader = document.querySelector('.wifi-loader');
        
        // Update status text with typewriter effect
        this.typewriterEffect(statusText, state.status);
        
        // Update signal strength
        this.updateSignalBars(state.bars);
        
        // Animate connection speed
        this.animateConnectionSpeed(state.speed);
        
        // Add visual feedback
        if (this.currentState === this.states.length - 1) {
            wifiLoader.classList.add('connected');
            this.createSuccessParticles();
        }
        
        this.currentState++;
    }

    typewriterEffect(element, text) {
        element.textContent = '';
        let i = 0;
        
        const typeTimer = setInterval(() => {
            element.textContent += text.charAt(i);
            i++;
            if (i >= text.length) {
                clearInterval(typeTimer);
            }
        }, 50);
    }

    createSuccessParticles() {
        const loader = document.querySelector('.wifi-loader');
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'success-particle';
            
            const angle = (360 / 20) * i;
            const distance = 100;
            const x = Math.cos(angle * Math.PI / 180) * distance;
            const y = Math.sin(angle * Math.PI / 180) * distance;
            
            particle.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: 6px;
                height: 6px;
                background: #10b981;
                border-radius: 50%;
                transform: translate(-50%, -50%);
                animation: successBurst 1.5s ease-out forwards;
                --end-x: ${x}px;
                --end-y: ${y}px;
                pointer-events: none;
                box-shadow: 0 0 10px rgba(16, 185, 129, 0.8);
            `;
            
            loader.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1500);
        }
    }

    resetConnection() {
        const wifiLoader = document.querySelector('.wifi-loader');
        wifiLoader.classList.remove('connected');
        this.updateSignalBars(0);
        
        setTimeout(() => {
            this.startConnectionSequence();
        }, 2000);
    }

    startConnectionSequence() {
        const updateState = () => {
            this.updateConnectionState();
            
            if (this.currentState < this.states.length) {
                setTimeout(updateState, 1500);
            } else {
                setTimeout(() => {
                    this.resetConnection();
                }, 3000);
            }
        };
        
        updateState();
    }

    setupEventListeners() {
        const retryBtn = document.getElementById('retry-btn');
        
        retryBtn.addEventListener('click', () => {
            retryBtn.classList.add('spinning');
            this.currentState = 0;
            this.resetConnection();
            
            setTimeout(() => {
                retryBtn.classList.remove('spinning');
            }, 1000);
        });
    }
}

// Add dynamic CSS for success animation
const successCSS = `
@keyframes successBurst {
    to {
        transform: translate(calc(-50% + var(--end-x)), calc(-50% + var(--end-y))) scale(0);
        opacity: 0;
    }
}

.wifi-loader.connected {
    border-color: rgba(16, 185, 129, 0.5);
    box-shadow: 0 20px 40px rgba(16, 185, 129, 0.2);
    animation: connectedGlow 2s ease-in-out infinite alternate;
}

@keyframes connectedGlow {
    0% { background: rgba(255, 255, 255, 0.1); }
    100% { background: rgba(16, 185, 129, 0.1); }
}

.signal-bar {
    transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
`;

const style = document.createElement('style');
style.textContent = successCSS;
document.head.appendChild(style);

// Initialize WiFi loader when page loads
document.addEventListener('DOMContentLoaded', () => {
    new WiFiLoader();
});