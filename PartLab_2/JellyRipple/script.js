class AdvancedJellyRippleSuite {
    constructor() {
        this.buttons = document.querySelectorAll('.jelly-button');
        this.themeButtons = document.querySelectorAll('.theme-btn');
        this.globalParticles = document.getElementById('globalParticles');
        this.achievements = document.querySelectorAll('.achievement');
        
        // Control elements
        this.jellyIntensitySlider = document.getElementById('jellyIntensity');
        this.rippleSpeedSlider = document.getElementById('rippleSpeed');
        this.particleCountSlider = document.getElementById('particleCount');
        
        // State management
        this.buttonStates = new Map();
        this.currentTheme = 'neon';
        this.globalStats = {
            totalClicks: 0,
            maxCombo: 0,
            totalParticles: 0,
            achievements: new Set()
        };
        
        // Performance tracking
        this.lastClickTime = 0;
        this.clickSequence = [];
        this.comboTimer = null;
        
        this.init();
    }

    init() {
        this.setupButtons();
        this.setupThemes();
        this.setupControls();
        this.setupAchievements();
        this.startBackgroundEffects();
        this.setupKeyboardControls();
        this.setupTouchGestures();
        this.initPerformanceOptimization();
    }

    setupButtons() {
        this.buttons.forEach((button, index) => {
            const type = button.dataset.type;
            const container = button.closest('.button-container');
            const clickCountEl = container.querySelector('.click-count');
            const comboCountEl = container.querySelector('.combo-count');
            
            // Initialize button state
            this.buttonStates.set(button, {
                clicks: 0,
                combo: 0,
                lastClickTime: 0,
                isAnimating: false,
                particles: [],
                type: type
            });
            
            // Setup event listeners
            button.addEventListener('click', (e) => this.handleButtonClick(e, button));
            button.addEventListener('mousedown', (e) => this.handleMouseDown(e, button));
            button.addEventListener('mouseup', (e) => this.handleMouseUp(e, button));
            button.addEventListener('mouseleave', (e) => this.handleMouseLeave(e, button));
            
            // Touch events for mobile
            button.addEventListener('touchstart', (e) => this.handleTouchStart(e, button));
            button.addEventListener('touchend', (e) => this.handleTouchEnd(e, button));
            
            // Multi-touch for specific button
            if (type === 'multitouch') {
                this.setupMultiTouch(button);
            }
            
            // Initialize type-specific features
            this.initButtonType(button, type);
        });
    }

    initButtonType(button, type) {
        switch(type) {
            case 'classic':
                this.initClassicJelly(button);
                break;
            case 'morphing':
                this.initMorphingJelly(button);
                break;
            case 'liquid':
                this.initLiquidJelly(button);
                break;
            case 'particle':
                this.initParticleJelly(button);
                break;
            case '3d':
                this.init3DJelly(button);
                break;
            case 'multitouch':
                this.initMultiTouchJelly(button);
                break;
        }
    }

    initClassicJelly(button) {
        // Enhanced classic jelly with physics simulation
        button.addEventListener('mouseenter', () => {
            button.style.animation = 'classicWobble 0.6s ease-in-out infinite';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.animation = 'classicFloat 4s ease-in-out infinite';
        });
    }

    initMorphingJelly(button) {
        const layers = button.querySelectorAll('.morph-layer');
        let morphLevel = 1;
        
        button.addEventListener('click', () => {
            morphLevel = (morphLevel % 5) + 1;
            this.updateMorphLevel(button, morphLevel);
            this.updateButtonStat(button, 'combo', morphLevel);
        });
    }

    updateMorphLevel(button, level) {
        const layers = button.querySelectorAll('.morph-layer');
        layers.forEach((layer, index) => {
            if (index < level) {
                layer.style.opacity = '0.3';
                layer.style.transform = `scale(${1 + index * 0.1}) rotate(${index * 60}deg)`;
            } else {
                layer.style.opacity = '0';
            }
        });
    }

    initLiquidJelly(button) {
        const waves = button.querySelectorAll('.wave');
        let intensity = 'Low';
        
        button.addEventListener('click', () => {
            const intensities = ['Low', 'Medium', 'High', 'Extreme'];
            const currentIndex = intensities.indexOf(intensity);
            intensity = intensities[(currentIndex + 1) % intensities.length];
            
            this.updateLiquidIntensity(waves, intensity);
            this.updateButtonStat(button, 'combo', intensity);
        });
    }

    updateLiquidIntensity(waves, intensity) {
        const multipliers = { 'Low': 1, 'Medium': 1.5, 'High': 2, 'Extreme': 3 };
        const multiplier = multipliers[intensity];
        
        waves.forEach((wave, index) => {
            wave.style.animationDuration = `${2 / multiplier}s`;
            wave.style.transform = `scaleY(${multiplier})`;
        });
    }

    initParticleJelly(button) {
        const emitter = button.querySelector('.particle-emitter');
        let particleCount = 0;
        
        button.addEventListener('click', () => {
            const count = parseInt(this.particleCountSlider.value);
            this.createButtonParticles(emitter, count);
            particleCount += count;
            this.updateButtonStat(button, 'combo', particleCount);
        });
    }

    init3DJelly(button) {
        const core = button.querySelector('.jelly-3d-core');
        let rotationAngle = 0;
        
        button.addEventListener('click', () => {
            rotationAngle += 90;
            core.style.transform = `rotateX(${rotationAngle}deg) rotateY(${rotationAngle}deg)`;
            this.updateButtonStat(button, 'combo', `${rotationAngle}°`);
        });
    }

    initMultiTouchJelly(button) {
        let maxSimultaneousTouches = 0;
        let currentTouches = 0;
        
        button.addEventListener('touchstart', (e) => {
            currentTouches = e.touches.length;
            maxSimultaneousTouches = Math.max(maxSimultaneousTouches, currentTouches);
            this.updateButtonStat(button, 'combo', maxSimultaneousTouches);
            
            // Create touch indicators
            Array.from(e.touches).forEach(touch => {
                this.createTouchIndicator(button, touch);
            });
        });
    }

    setupMultiTouch(button) {
        const indicators = button.querySelector('.touch-indicators');
        
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            Array.from(e.touches).forEach((touch, index) => {
                this.createTouchIndicator(indicators, touch, button);
            });
        });
    }

    createTouchIndicator(container, touch, button) {
        const indicator = document.createElement('div');
        indicator.className = 'touch-indicator';
        
        const rect = button.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        indicator.style.left = x + 'px';
        indicator.style.top = y + 'px';
        
        container.appendChild(indicator);
        
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.parentNode.removeChild(indicator);
            }
        }, 500);
    }

    handleButtonClick(e, button) {
        const state = this.buttonStates.get(button);
        const currentTime = Date.now();
        
        // Update click stats
        state.clicks++;
        this.globalStats.totalClicks++;
        
        // Handle combo system
        if (currentTime - state.lastClickTime < 1000) {
            state.combo++;
        } else {
            state.combo = 1;
        }
        
        state.lastClickTime = currentTime;
        this.globalStats.maxCombo = Math.max(this.globalStats.maxCombo, state.combo);
        
        // Update UI
        this.updateButtonStats(button, state);
        
        // Create ripple effect
        this.createRipple(e, button);
        
        // Create particles
        this.createButtonParticles(button, Math.min(state.combo * 2, 20));
        
        // Trigger button-specific effects
        this.triggerButtonEffect(button, state);
        
        // Check achievements
        this.checkAchievements();
        
        // Haptic feedback
        this.triggerHapticFeedback();
        
        // Sound visualization
        this.triggerSoundVisualization();
    }

    handleMouseDown(e, button) {
        const state = this.buttonStates.get(button);
        state.isAnimating = true;
        
        button.style.transform = 'scale(0.95)';
        button.style.filter = 'brightness(1.2)';
    }

    handleMouseUp(e, button) {
        const state = this.buttonStates.get(button);
        state.isAnimating = false;
        
        button.style.transform = '';
        button.style.filter = '';
    }

    handleMouseLeave(e, button) {
        this.handleMouseUp(e, button);
    }

    handleTouchStart(e, button) {
        e.preventDefault();
        this.handleMouseDown(e, button);
    }

    handleTouchEnd(e, button) {
        e.preventDefault();
        this.handleMouseUp(e, button);
        
        // Simulate click for touch
        if (e.changedTouches.length === 1) {
            this.handleButtonClick(e.changedTouches[0], button);
        }
    }

    createRipple(e, button) {
        const rippleContainer = button.querySelector('.ripple-container');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        
        let x, y;
        if (e.clientX !== undefined) {
            x = e.clientX - rect.left - size / 2;
            y = e.clientY - rect.top - size / 2;
        } else {
            x = rect.width / 2 - size / 2;
            y = rect.height / 2 - size / 2;
        }
        
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        // Apply current theme colors
        const colors = this.getThemeColors();
        ripple.style.background = `radial-gradient(circle, ${colors.primary}80, transparent)`;
        
        rippleContainer.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 800);
        
        // Create additional ripples for enhanced effect
        if (Math.random() > 0.6) {
            setTimeout(() => this.createSecondaryRipple(rippleContainer, x, y, size * 0.7), 200);
        }
    }

    createSecondaryRipple(container, x, y, size) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (x + size * 0.15) + 'px';
        ripple.style.top = (y + size * 0.15) + 'px';
        ripple.style.background = 'radial-gradient(circle, rgba(255,255,255,0.3), transparent)';
        
        container.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    createButtonParticles(button, count) {
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                this.createParticle(centerX, centerY);
            }, i * 50);
        }
        
        this.globalStats.totalParticles += count;
    }

    createParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'global-particle';
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = 50 + Math.random() * 100;
        const size = 4 + Math.random() * 8;
        
        particle.style.width = particle.style.height = size + 'px';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        const colors = this.getThemeColors();
        particle.style.background = `radial-gradient(circle, ${colors.primary}, transparent)`;
        
        // Apply physics
        particle.style.setProperty('--vx', Math.cos(angle) * velocity + 'px');
        particle.style.setProperty('--vy', Math.sin(angle) * velocity + 'px');
        
        this.globalParticles.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 4000);
    }

    triggerButtonEffect(button, state) {
        const type = state.type;
        
        switch(type) {
            case 'classic':
                this.triggerClassicEffect(button, state);
                break;
            case 'morphing':
                this.triggerMorphingEffect(button, state);
                break;
            case 'liquid':
                this.triggerLiquidEffect(button, state);
                break;
            case 'particle':
                this.triggerParticleEffect(button, state);
                break;
            case '3d':
                this.trigger3DEffect(button, state);
                break;
            case 'multitouch':
                this.triggerMultiTouchEffect(button, state);
                break;
        }
    }

    triggerClassicEffect(button, state) {
        button.style.animation = 'classicSquish 0.4s ease-out';
        setTimeout(() => {
            button.style.animation = 'classicFloat 4s ease-in-out infinite';
        }, 400);
    }

    triggerMorphingEffect(button, state) {
        const layers = button.querySelectorAll('.morph-layer');
        layers.forEach((layer, index) => {
            layer.style.animation = `morphLayer${index + 1} 1s ease-out`;
        });
    }

    triggerLiquidEffect(button, state) {
        const waves = button.querySelectorAll('.wave');
        waves.forEach(wave => {
            wave.style.animationDuration = '0.5s';
            setTimeout(() => {
                wave.style.animationDuration = '2s';
            }, 1000);
        });
    }

    triggerParticleEffect(button, state) {
        const emitter = button.querySelector('.particle-emitter');
        this.createButtonParticles(button, state.combo * 3);
    }

    trigger3DEffect(button, state) {
        const core = button.querySelector('.jelly-3d-core');
        core.style.animationDuration = '0.5s';
        setTimeout(() => {
            core.style.animationDuration = '8s';
        }, 500);
    }

    triggerMultiTouchEffect(button, state) {
        button.style.transform = `scale(${1 + state.combo * 0.05}) rotate(${state.combo * 5}deg)`;
        setTimeout(() => {
            button.style.transform = '';
        }, 300);
    }

    setupThemes() {
        this.themeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchTheme(btn.dataset.theme);
            });
        });
    }

    switchTheme(theme) {
        this.currentTheme = theme;
        document.body.setAttribute('data-theme', theme);
        
        // Update active theme button
        this.themeButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-theme="${theme}"]`).classList.add('active');
        
        // Trigger theme transition effect
        this.triggerThemeTransition();
    }

    triggerThemeTransition() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, ${this.getThemeColors().primary}40, transparent);
            z-index: 9999;
            pointer-events: none;
            animation: themeTransition 1s ease-out forwards;
        `;
        
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            document.body.removeChild(overlay);
        }, 1000);
    }

    getThemeColors() {
        const themes = {
            neon: { primary: '#ff6b6b', secondary: '#4facfe', accent: '#43e97b' },
            ocean: { primary: '#4facfe', secondary: '#00f2fe', accent: '#43e97b' },
            fire: { primary: '#ff6b6b', secondary: '#ff8e53', accent: '#fa709a' },
            cosmic: { primary: '#f093fb', secondary: '#667eea', accent: '#4facfe' }
        };
        return themes[this.currentTheme] || themes.neon;
    }

    setupControls() {
        // Jelly intensity control
        this.jellyIntensitySlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            document.documentElement.style.setProperty('--jelly-intensity', value);
            e.target.nextElementSibling.textContent = value.toFixed(1) + 'x';
            this.updateJellyPhysics(value);
        });
        
        // Ripple speed control
        this.rippleSpeedSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            document.documentElement.style.setProperty('--ripple-speed', value);
            e.target.nextElementSibling.textContent = value.toFixed(1) + 'x';
        });
        
        // Particle count control
        this.particleCountSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            document.documentElement.style.setProperty('--particle-count', value);
            e.target.nextElementSibling.textContent = value;
        });
    }

    updateJellyPhysics(intensity) {
        this.buttons.forEach(button => {
            const animations = button.style.animation.split(',');
            button.style.animationDuration = animations.map(anim => 
                anim.includes('s') ? `${4 / intensity}s` : anim
            ).join(',');
        });
    }

    setupAchievements() {
        // Initialize achievement system
        this.achievementChecks = {
            'first-click': () => this.globalStats.totalClicks >= 1,
            'combo-master': () => this.globalStats.maxCombo >= 10,
            'speed-demon': () => this.checkSpeedDemon(),
            'particle-lord': () => this.globalStats.totalParticles >= 1000
        };
    }

    checkAchievements() {
        Object.entries(this.achievementChecks).forEach(([id, check]) => {
            if (!this.globalStats.achievements.has(id) && check()) {
                this.unlockAchievement(id);
            }
        });
    }

    unlockAchievement(id) {
        this.globalStats.achievements.add(id);
        const achievement = document.querySelector(`[data-achievement="${id}"]`);
        
        if (achievement) {
            achievement.classList.add('unlocked');
            this.showAchievementNotification(achievement);
        }
    }

    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #43e97b, #38f9d7);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            font-weight: bold;
            z-index: 10000;
            animation: achievementNotification 3s ease-out forwards;
        `;
        notification.textContent = `Achievement Unlocked: ${achievement.querySelector('.achievement-text').textContent}`;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }

    checkSpeedDemon() {
        const recentClicks = this.clickSequence.filter(time => 
            Date.now() - time < 5000
        );
        return recentClicks.length >= 20;
    }

    updateButtonStats(button, state) {
        const container = button.closest('.button-container');
        const clickCountEl = container.querySelector('.click-count');
        const comboCountEl = container.querySelector('.combo-count');
        
        if (clickCountEl) clickCountEl.textContent = state.clicks;
        if (comboCountEl) {
            const comboText = state.type === 'morphing' ? state.combo : 
                            state.type === 'liquid' ? this.getLiquidIntensityText(state.combo) :
                            state.type === 'particle' ? state.combo :
                            state.type === '3d' ? `${state.combo * 90}°` :
                            state.combo;
            comboCountEl.textContent = comboText;
        }
    }

    updateButtonStat(button, statType, value) {
        const state = this.buttonStates.get(button);
        if (statType === 'combo') {
            state.combo = value;
        }
        this.updateButtonStats(button, state);
    }

    getLiquidIntensityText(combo) {
        const intensities = ['Low', 'Medium', 'High', 'Extreme'];
        return intensities[Math.min(combo - 1, 3)] || 'Low';
    }

    startBackgroundEffects() {
        // Ambient particle generation
        setInterval(() => {
            if (this.globalParticles.children.length < 50) {
                this.createAmbientParticle();
            }
        }, 3000);
        
        // Background wave animation
        this.animateBackgroundWaves();
    }

    createAmbientParticle() {
        const particle = document.createElement('div');
        particle.className = 'global-particle';
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = window.innerHeight + 20 + 'px';
        particle.style.width = particle.style.height = (2 + Math.random() * 4) + 'px';
        particle.style.opacity = '0.3';
        
        const colors = this.getThemeColors();
        particle.style.background = `radial-gradient(circle, ${colors.accent}, transparent)`;
        
        this.globalParticles.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 8000);
    }

    animateBackgroundWaves() {
        const waves = document.querySelectorAll('.bg-wave');
        waves.forEach((wave, index) => {
            wave.style.animationDelay = `${index * 2}s`;
        });
    }

    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                    const buttonIndex = parseInt(e.key) - 1;
                    if (this.buttons[buttonIndex]) {
                        this.simulateButtonClick(this.buttons[buttonIndex]);
                    }
                    break;
                case ' ':
                    e.preventDefault();
                    this.triggerRandomButton();
                    break;
                case 't':
                    this.cycleTheme();
                    break;
                case 'r':
                    this.resetAllStats();
                    break;
            }
        });
    }

    simulateButtonClick(button) {
        const rect = button.getBoundingClientRect();
        const fakeEvent = {
            clientX: rect.left + rect.width / 2,
            clientY: rect.top + rect.height / 2
        };
        this.handleButtonClick(fakeEvent, button);
    }

    triggerRandomButton() {
        const randomButton = this.buttons[Math.floor(Math.random() * this.buttons.length)];
        this.simulateButtonClick(randomButton);
    }

    cycleTheme() {
        const themes = ['neon', 'ocean', 'fire', 'cosmic'];
        const currentIndex = themes.indexOf(this.currentTheme);
        const nextTheme = themes[(currentIndex + 1) % themes.length];
        this.switchTheme(nextTheme);
    }

    resetAllStats() {
        this.buttonStates.forEach((state, button) => {
            state.clicks = 0;
            state.combo = 0;
            this.updateButtonStats(button, state);
        });
        
        this.globalStats = {
            totalClicks: 0,
            maxCombo: 0,
            totalParticles: 0,
            achievements: new Set()
        };
        
        // Reset achievements
        this.achievements.forEach(achievement => {
            achievement.classList.remove('unlocked');
        });
    }

    setupTouchGestures() {
        let touchStartTime = 0;
        let touchCount = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartTime = Date.now();
            touchCount = e.touches.length;
        });
        
        document.addEventListener('touchend', (e) => {
            const touchDuration = Date.now() - touchStartTime;
            
            // Multi-finger gestures
            if (touchCount >= 3 && touchDuration < 500) {
                this.triggerSpecialEffect();
            }
        });
    }

    triggerSpecialEffect() {
        // Create massive particle explosion
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                this.createParticle(
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerHeight
                );
            }, i * 20);
        }
        
        // Flash effect
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(255,255,255,0.8), transparent);
            z-index: 9999;
            pointer-events: none;
            animation: flashEffect 0.5s ease-out forwards;
        `;
        
        document.body.appendChild(flash);
        
        setTimeout(() => {
            document.body.removeChild(flash);
        }, 500);
    }

    triggerHapticFeedback() {
        if ('vibrate' in navigator) {
            navigator.vibrate([50, 30, 50]);
        }
    }

    triggerSoundVisualization() {
        const bars = document.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            bar.style.animationDuration = `${0.3 + Math.random() * 0.4}s`;
            bar.style.transform = `scaleY(${1 + Math.random() * 2})`;
            
            setTimeout(() => {
                bar.style.transform = 'scaleY(1)';
                bar.style.animationDuration = '1s';
            }, 800);
        });
    }

    initPerformanceOptimization() {
        // Throttle particle creation on low-end devices
        this.performanceMode = this.detectPerformanceMode();
        
        if (this.performanceMode === 'low') {
            document.documentElement.style.setProperty('--particle-count', '10');
            this.particleCountSlider.value = '10';
        }
        
        // Monitor FPS and adjust accordingly
        this.monitorPerformance();
    }

    detectPerformanceMode() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) return 'low';
        
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
            const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            if (renderer.includes('Intel') || renderer.includes('Mali')) {
                return 'medium';
            }
        }
        
        return navigator.hardwareConcurrency > 4 ? 'high' : 'medium';
    }

    monitorPerformance() {
        let frameCount = 0;
        let lastTime = performance.now();
        
        const checkPerformance = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                
                if (fps < 30 && this.performanceMode !== 'low') {
                    this.optimizeForPerformance();
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(checkPerformance);
        };
        
        requestAnimationFrame(checkPerformance);
    }

    optimizeForPerformance() {
        // Reduce particle count
        document.documentElement.style.setProperty('--particle-count', '5');
        
        // Simplify animations
        this.buttons.forEach(button => {
            button.style.willChange = 'transform';
        });
        
        // Limit global particles
        const particles = this.globalParticles.children;
        for (let i = particles.length - 1; i >= 20; i--) {
            particles[i].remove();
        }
    }
}

// Add CSS animations via JavaScript
const additionalStyles = `
    @keyframes themeTransition {
        0% { opacity: 0; transform: scale(0); }
        50% { opacity: 1; transform: scale(1.2); }
        100% { opacity: 0; transform: scale(2); }
    }
    
    @keyframes achievementNotification {
        0% { transform: translateX(100%); opacity: 0; }
        20% { transform: translateX(0); opacity: 1; }
        80% { transform: translateX(0); opacity: 1; }
        100% { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes flashEffect {
        0% { opacity: 0; }
        50% { opacity: 1; }
        100% { opacity: 0; }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AdvancedJellyRippleSuite();
});