class AdvancedGlassShardSuite {
    constructor() {
        // Core elements
        this.pages = document.querySelectorAll('.page');
        this.glassShards = document.getElementById('glassShards');
        this.particleSystem = document.getElementById('particleSystem');
        this.dustSystem = document.getElementById('dustSystem');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.performanceMonitor = document.getElementById('performanceMonitor');
        
        // Control elements
        this.shardCountSlider = document.getElementById('shardCount');
        this.explosionForceSlider = document.getElementById('explosionForce');
        this.gravitySlider = document.getElementById('gravity');
        this.shardSizeSlider = document.getElementById('shardSize');
        this.patternButtons = document.querySelectorAll('.pattern-btn');
        
        // Interactive elements
        this.interactiveArea = document.getElementById('interactiveArea');
        this.impactIndicators = document.querySelector('.impact-indicators');
        
        // State management
        this.currentPage = 1;
        this.isTransitioning = false;
        this.shatterSettings = {
            count: 30,
            explosionForce: 1.5,
            gravity: 0.8,
            size: 1,
            pattern: 'random'
        };
        
        // Performance tracking
        this.performanceStats = {
            fps: 60,
            shardCount: 0,
            particleCount: 0,
            lastFrameTime: performance.now()
        };
        
        // Physics simulation
        this.physicsEngine = new GlassPhysicsEngine();
        
        // Auto-demo system
        this.autoDemoTimer = null;
        this.impactPoints = [];
        
        this.init();
    }

    async init() {
        await this.showLoadingScreen();
        this.setupEventListeners();
        this.setupControls();
        this.setupInteractiveDemo();
        this.startPerformanceMonitoring();
        this.startAutoDemo();
        this.initSoundVisualization();
        this.setupKeyboardControls();
        this.setupTouchGestures();
        await this.hideLoadingScreen();
    }

    async showLoadingScreen() {
        return new Promise(resolve => {
            setTimeout(() => {
                this.loadingOverlay.classList.add('hidden');
                resolve();
            }, 2000);
        });
    }

    async hideLoadingScreen() {
        return new Promise(resolve => {
            setTimeout(resolve, 500);
        });
    }

    setupEventListeners() {
        // Navigation buttons
        document.getElementById('shatterBtn')?.addEventListener('click', () => {
            this.triggerShatterTransition(2, 'explosion');
        });
        
        document.getElementById('customizeBtn')?.addEventListener('click', () => {
            this.navigateToPage(3);
        });
        
        document.getElementById('backBtn')?.addEventListener('click', () => {
            this.navigateToPage(1);
        });
        
        document.getElementById('testShatterBtn')?.addEventListener('click', () => {
            this.testCurrentSettings();
        });
        
        document.getElementById('backToMainBtn')?.addEventListener('click', () => {
            this.navigateToPage(1);
        });
        
        document.getElementById('clearImpactsBtn')?.addEventListener('click', () => {
            this.clearImpactPoints();
        });
        
        document.getElementById('autoShatterBtn')?.addEventListener('click', () => {
            this.triggerAutoShatter();
        });
        
        document.getElementById('backFromDemoBtn')?.addEventListener('click', () => {
            this.navigateToPage(1);
        });
        
        // Gallery items
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', () => {
                const effect = item.dataset.effect;
                this.triggerShatterTransition(4, effect);
            });
        });
    }

    setupControls() {
        // Shard count control
        this.shardCountSlider?.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            this.shatterSettings.count = value;
            e.target.nextElementSibling.textContent = value;
            document.documentElement.style.setProperty('--shard-count', value);
        });
        
        // Explosion force control
        this.explosionForceSlider?.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.shatterSettings.explosionForce = value;
            e.target.nextElementSibling.textContent = value.toFixed(1) + 'x';
            document.documentElement.style.setProperty('--explosion-force', value);
        });
        
        // Gravity control
        this.gravitySlider?.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.shatterSettings.gravity = value;
            e.target.nextElementSibling.textContent = value.toFixed(1) + 'x';
            document.documentElement.style.setProperty('--gravity', value);
        });
        
        // Shard size control
        this.shardSizeSlider?.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.shatterSettings.size = value;
            e.target.nextElementSibling.textContent = value.toFixed(1) + 'x';
            document.documentElement.style.setProperty('--shard-size', value);
        });
        
        // Pattern buttons
        this.patternButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.patternButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.shatterSettings.pattern = btn.dataset.pattern;
                document.documentElement.style.setProperty('--shatter-pattern', btn.dataset.pattern);
            });
        });
    }

    setupInteractiveDemo() {
        if (!this.interactiveArea) return;
        
        this.interactiveArea.addEventListener('click', (e) => {
            this.createImpactPoint(e);
        });
        
        this.interactiveArea.addEventListener('touchstart', (e) => {
            e.preventDefault();
            Array.from(e.touches).forEach(touch => {
                this.createImpactPoint(touch);
            });
        });
    }

    createImpactPoint(e) {
        const rect = this.interactiveArea.getBoundingClientRect();
        const x = (e.clientX || e.pageX) - rect.left;
        const y = (e.clientY || e.pageY) - rect.top;
        
        const impact = {
            x: x,
            y: y,
            timestamp: Date.now(),
            intensity: Math.random() * 0.5 + 0.5
        };
        
        this.impactPoints.push(impact);
        
        // Create visual indicator
        const indicator = document.createElement('div');
        indicator.className = 'impact-point';
        indicator.style.left = x + 'px';
        indicator.style.top = y + 'px';
        indicator.style.animationDuration = `${2 / impact.intensity}s`;
        
        this.impactIndicators.appendChild(indicator);
        
        // Create immediate micro-shatter
        this.createMicroShatter(rect.left + x, rect.top + y, impact.intensity);
        
        // Remove indicator after animation
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.parentNode.removeChild(indicator);
            }
        }, 2000);
        
        // Auto-shatter if too many impact points
        if (this.impactPoints.length >= 5) {
            setTimeout(() => {
                this.triggerShatterFromImpacts();
            }, 500);
        }
    }

    createMicroShatter(x, y, intensity) {
        const microShardCount = Math.floor(intensity * 8) + 3;
        
        for (let i = 0; i < microShardCount; i++) {
            setTimeout(() => {
                this.createShard({
                    x: x,
                    y: y,
                    size: (10 + Math.random() * 15) * this.shatterSettings.size * 0.5,
                    velocity: {
                        x: (Math.random() - 0.5) * 100 * intensity,
                        y: (Math.random() - 0.5) * 100 * intensity
                    },
                    rotation: Math.random() * 360,
                    duration: 1 + Math.random() * 0.5
                });
            }, i * 50);
        }
    }

    clearImpactPoints() {
        this.impactPoints = [];
        this.impactIndicators.innerHTML = '';
    }

    triggerAutoShatter() {
        // Create random impact points
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const rect = this.interactiveArea.getBoundingClientRect();
                const fakeEvent = {
                    clientX: rect.left + Math.random() * rect.width,
                    clientY: rect.top + Math.random() * rect.height
                };
                this.createImpactPoint(fakeEvent);
            }, i * 200);
        }
    }

    navigateToPage(pageNumber) {
        if (this.isTransitioning || this.currentPage === pageNumber) return;
        
        this.isTransitioning = true;
        const currentPageEl = document.getElementById(`page${this.currentPage}`);
        const targetPageEl = document.getElementById(`page${pageNumber}`);
        
        // Simple fade transition for navigation
        currentPageEl.classList.remove('active');
        
        setTimeout(() => {
            targetPageEl.classList.add('active');
            this.currentPage = pageNumber;
            this.isTransitioning = false;
        }, 300);
    }

    triggerShatterTransition(targetPage, effect = 'explosion') {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        const currentPageEl = document.getElementById(`page${this.currentPage}`);
        
        // Create shatter overlay
        this.createShatterOverlay();
        
        // Generate shards based on current settings and effect
        this.generateShatterEffect(effect);
        
        // Transition pages
        setTimeout(() => {
            currentPageEl.classList.remove('active');
            currentPageEl.classList.add('transitioning-out');
        }, 200);
        
        setTimeout(() => {
            const targetPageEl = document.getElementById(`page${targetPage}`);
            targetPageEl.classList.add('active');
            currentPageEl.classList.remove('transitioning-out');
            this.currentPage = targetPage;
        }, 1000);
        
        // Clean up
        setTimeout(() => {
            this.cleanupShards();
            this.isTransitioning = false;
        }, 4000);
    }

    generateShatterEffect(effect) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const shardCount = this.shatterSettings.count;
        
        switch (effect) {
            case 'explosion':
                this.generateExplosionShatter(centerX, centerY, shardCount);
                break;
            case 'spiral':
                this.generateSpiralShatter(centerX, centerY, shardCount);
                break;
            case 'wave':
                this.generateWaveShatter(shardCount);
                break;
            case 'gravity':
                this.generateGravityShatter(shardCount);
                break;
            default:
                this.generateRandomShatter(shardCount);
        }
        
        // Create particles and dust
        this.generateParticleEffects(centerX, centerY);
        this.generateDustEffects();
        
        // Trigger sound visualization
        this.triggerSoundVisualization();
    }

    generateExplosionShatter(centerX, centerY, count) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
            const distance = 50 + Math.random() * 100;
            const velocity = this.shatterSettings.explosionForce * (100 + Math.random() * 200);
            
            const startX = centerX + Math.cos(angle) * distance;
            const startY = centerY + Math.sin(angle) * distance;
            
            this.createShard({
                x: startX,
                y: startY,
                size: (20 + Math.random() * 40) * this.shatterSettings.size,
                velocity: {
                    x: Math.cos(angle) * velocity,
                    y: Math.sin(angle) * velocity
                },
                rotation: Math.random() * 360,
                duration: 2 + Math.random() * 2,
                shape: this.generateShardShape()
            });
        }
    }

    generateSpiralShatter(centerX, centerY, count) {
        for (let i = 0; i < count; i++) {
            const progress = i / count;
            const angle = progress * Math.PI * 6; // 3 full rotations
            const radius = progress * 200;
            const velocity = this.shatterSettings.explosionForce * (80 + Math.random() * 120);
            
            const startX = centerX + Math.cos(angle) * radius;
            const startY = centerY + Math.sin(angle) * radius;
            
            this.createShard({
                x: startX,
                y: startY,
                size: (15 + Math.random() * 30) * this.shatterSettings.size,
                velocity: {
                    x: Math.cos(angle + Math.PI/2) * velocity,
                    y: Math.sin(angle + Math.PI/2) * velocity
                },
                rotation: angle * 180 / Math.PI,
                duration: 2.5 + Math.random() * 1.5,
                shape: this.generateShardShape()
            });
        }
    }

    generateWaveShatter(count) {
        const waves = 3;
        const shardsPerWave = Math.floor(count / waves);
        
        for (let wave = 0; wave < waves; wave++) {
            setTimeout(() => {
                for (let i = 0; i < shardsPerWave; i++) {
                    const x = (window.innerWidth * i) / shardsPerWave;
                    const y = window.innerHeight * 0.3 + Math.sin((i / shardsPerWave) * Math.PI * 4) * 100;
                    const velocity = this.shatterSettings.explosionForce * (60 + Math.random() * 80);
                    
                    this.createShard({
                        x: x,
                        y: y,
                        size: (18 + Math.random() * 35) * this.shatterSettings.size,
                        velocity: {
                            x: (Math.random() - 0.5) * velocity,
                            y: velocity * 0.5
                        },
                        rotation: Math.random() * 360,
                        duration: 3 + Math.random() * 2,
                        shape: this.generateShardShape()
                    });
                }
            }, wave * 300);
        }
    }

    generateGravityShatter(count) {
        for (let i = 0; i < count; i++) {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight * 0.3;
            
            this.createShard({
                x: x,
                y: y,
                size: (25 + Math.random() * 50) * this.shatterSettings.size,
                velocity: {
                    x: (Math.random() - 0.5) * 50,
                    y: 0
                },
                rotation: Math.random() * 360,
                duration: 4 + Math.random() * 2,
                gravity: this.shatterSettings.gravity * (0.8 + Math.random() * 0.4),
                shape: this.generateShardShape()
            });
        }
    }

    generateRandomShatter(count) {
        for (let i = 0; i < count; i++) {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const velocity = this.shatterSettings.explosionForce * (50 + Math.random() * 150);
            const angle = Math.random() * Math.PI * 2;
            
            this.createShard({
                x: x,
                y: y,
                size: (20 + Math.random() * 40) * this.shatterSettings.size,
                velocity: {
                    x: Math.cos(angle) * velocity,
                    y: Math.sin(angle) * velocity
                },
                rotation: Math.random() * 360,
                duration: 2.5 + Math.random() * 2,
                shape: this.generateShardShape()
            });
        }
    }

    generateShardShape() {
        const shapes = [
            'polygon(50% 0%, 0% 100%, 100% 100%)', // Triangle
            'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)', // Hexagon
            'polygon(20% 0%, 80% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 40%)', // Irregular
            'polygon(30% 0%, 70% 0%, 100% 30%, 70% 70%, 30% 100%, 0% 70%)', // Another irregular
            'polygon(0% 20%, 60% 0%, 100% 40%, 40% 100%)', // Sharp triangle
            'polygon(50% 0%, 100% 25%, 82% 100%, 18% 100%, 0% 25%)', // Pentagon
        ];
        return shapes[Math.floor(Math.random() * shapes.length)];
    }

    createShard(config) {
        const shard = document.createElement('div');
        shard.className = 'shard';
        
        // Set initial properties
        shard.style.width = config.size + 'px';
        shard.style.height = config.size + 'px';
        shard.style.left = config.x + 'px';
        shard.style.top = config.y + 'px';
        shard.style.clipPath = config.shape || this.generateShardShape();
        
        // Calculate physics
        const gravity = config.gravity || this.shatterSettings.gravity;
        const duration = config.duration || 3;
        const endX = config.x + config.velocity.x * duration;
        const endY = config.y + config.velocity.y * duration + (gravity * duration * duration * 50);
        const endRotation = config.rotation + (Math.random() - 0.5) * 720 * duration;
        const endScale = 0.2 + Math.random() * 0.3;
        
        // Set CSS custom properties for animation
        shard.style.setProperty('--start-x', '0px');
        shard.style.setProperty('--start-y', '0px');
        shard.style.setProperty('--start-rotation', config.rotation + 'deg');
        shard.style.setProperty('--start-scale', '1');
        shard.style.setProperty('--end-x', (endX - config.x) + 'px');
        shard.style.setProperty('--end-y', (endY - config.y) + 'px');
        shard.style.setProperty('--end-rotation', endRotation + 'deg');
        shard.style.setProperty('--end-scale', endScale);
        shard.style.setProperty('--fall-duration', duration + 's');
        
        this.glassShards.appendChild(shard);
        this.performanceStats.shardCount++;
        
        // Trigger animation
        requestAnimationFrame(() => {
            shard.classList.add('animate');
        });
        
        // Remove after animation
        setTimeout(() => {
            if (shard.parentNode) {
                shard.parentNode.removeChild(shard);
                this.performanceStats.shardCount--;
            }
        }, duration * 1000);
    }

    generateParticleEffects(centerX, centerY) {
        const particleCount = Math.min(this.shatterSettings.count * 2, 100);
        
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                this.createParticle(centerX, centerY);
            }, i * 20);
        }
    }

    createParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'glass-particle';
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = 30 + Math.random() * 70;
        const size = 2 + Math.random() * 4;
        
        particle.style.width = particle.style.height = size + 'px';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        // Add some randomness to the starting position
        const offsetX = (Math.random() - 0.5) * 100;
        const offsetY = (Math.random() - 0.5) * 100;
        particle.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        
        this.particleSystem.appendChild(particle);
        this.performanceStats.particleCount++;
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
                this.performanceStats.particleCount--;
            }
        }, 4000);
    }

    generateDustEffects() {
        const dustCount = Math.min(this.shatterSettings.count, 50);
        
        for (let i = 0; i < dustCount; i++) {
            setTimeout(() => {
                this.createDustParticle();
            }, i * 100);
        }
    }

    createDustParticle() {
        const dust = document.createElement('div');
        dust.className = 'dust-particle';
        
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const drift = (Math.random() - 0.5) * 200;
        
        dust.style.left = x + 'px';
        dust.style.top = y + 'px';
        dust.style.setProperty('--drift', drift + 'px');
        
        this.dustSystem.appendChild(dust);
        
        setTimeout(() => {
            if (dust.parentNode) {
                dust.parentNode.removeChild(dust);
            }
        }, 6000);
    }

    createShatterOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'shatter-overlay';
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            if (overlay.parentNode) {
                document.body.removeChild(overlay);
            }
        }, 1500);
    }

    triggerShatterFromImpacts() {
        if (this.impactPoints.length === 0) return;
        
        // Calculate center of impact points
        const centerX = this.impactPoints.reduce((sum, p) => sum + p.x, 0) / this.impactPoints.length;
        const centerY = this.impactPoints.reduce((sum, p) => sum + p.y, 0) / this.impactPoints.length;
        
        // Convert to screen coordinates
        const rect = this.interactiveArea.getBoundingClientRect();
        const screenX = rect.left + centerX;
        const screenY = rect.top + centerY;
        
        // Create shatter effect from impact center
        this.generateExplosionShatter(screenX, screenY, this.shatterSettings.count);
        this.generateParticleEffects(screenX, screenY);
        this.generateDustEffects();
        
        // Clear impact points
        this.clearImpactPoints();
        
        // Trigger sound visualization
        this.triggerSoundVisualization();
    }

    testCurrentSettings() {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        this.createShatterOverlay();
        this.generateShatterEffect(this.shatterSettings.pattern);
        
        setTimeout(() => {
            this.cleanupShards();
        }, 5000);
    }

    cleanupShards() {
        // Remove all shards
        const shards = this.glassShards.querySelectorAll('.shard');
        shards.forEach(shard => {
            if (shard.parentNode) {
                shard.parentNode.removeChild(shard);
            }
        });
        
        // Remove all particles
        const particles = this.particleSystem.querySelectorAll('.glass-particle');
        particles.forEach(particle => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        });
        
        // Remove all dust
        const dust = this.dustSystem.querySelectorAll('.dust-particle');
        dust.forEach(d => {
            if (d.parentNode) {
                d.parentNode.removeChild(d);
            }
        });
        
        // Reset counters
        this.performanceStats.shardCount = 0;
        this.performanceStats.particleCount = 0;
    }

    startAutoDemo() {
        // Auto-trigger shatter effects for demo
        this.autoDemoTimer = setInterval(() => {
            if (!this.isTransitioning && this.currentPage === 1) {
                const effects = ['explosion', 'spiral', 'wave', 'gravity'];
                const randomEffect = effects[Math.floor(Math.random() * effects.length)];
                
                // Create a subtle auto-shatter
                const centerX = window.innerWidth / 2 + (Math.random() - 0.5) * 200;
                const centerY = window.innerHeight / 2 + (Math.random() - 0.5) * 200;
                
                // Reduce intensity for auto-demo
                const originalCount = this.shatterSettings.count;
                this.shatterSettings.count = Math.floor(originalCount * 0.3);
                
                this.generateShatterEffect(randomEffect);
                
                // Restore original settings
                setTimeout(() => {
                    this.shatterSettings.count = originalCount;
                }, 100);
            }
        }, 8000);
    }

    startPerformanceMonitoring() {
        const monitor = () => {
            const currentTime = performance.now();
            const deltaTime = currentTime - this.performanceStats.lastFrameTime;
            
            if (deltaTime >= 1000) {
                this.performanceStats.fps = Math.round(1000 / deltaTime * 60);
                this.performanceStats.lastFrameTime = currentTime;
                
                // Update performance display
                const fpsCounter = document.getElementById('fpsCounter');
                const shardCounter = document.getElementById('shardCounter');
                
                if (fpsCounter) fpsCounter.textContent = this.performanceStats.fps;
                if (shardCounter) shardCounter.textContent = this.performanceStats.shardCount;
                
                // Auto-optimize if performance is poor
                if (this.performanceStats.fps < 30) {
                    this.optimizePerformance();
                }
            }
            
            requestAnimationFrame(monitor);
        };
        
        requestAnimationFrame(monitor);
    }

    optimizePerformance() {
        // Reduce shard count
        if (this.shatterSettings.count > 15) {
            this.shatterSettings.count = Math.max(15, this.shatterSettings.count * 0.7);
            if (this.shardCountSlider) {
                this.shardCountSlider.value = this.shatterSettings.count;
                this.shardCountSlider.nextElementSibling.textContent = this.shatterSettings.count;
            }
        }
        
        // Clean up excess particles
        const particles = this.particleSystem.children;
        for (let i = particles.length - 1; i >= 30; i--) {
            particles[i].remove();
        }
        
        // Show performance monitor
        this.performanceMonitor.classList.add('show');
    }

    initSoundVisualization() {
        const bars = document.querySelectorAll('.frequency-bar');
        
        // Create base animation
        bars.forEach((bar, index) => {
            bar.style.setProperty('--delay', `${index * 0.1}s`);
            bar.style.setProperty('--height', `${20 + Math.random() * 25}px`);
        });
    }

    triggerSoundVisualization() {
        const bars = document.querySelectorAll('.frequency-bar');
        
        bars.forEach((bar, index) => {
            const intensity = 1 + Math.random() * 2;
            const duration = 0.3 + Math.random() * 0.4;
            
            bar.style.animationDuration = `${duration}s`;
            bar.style.transform = `scaleY(${intensity})`;
            
            setTimeout(() => {
                bar.style.transform = 'scaleY(1)';
                bar.style.animationDuration = '1s';
            }, duration * 1000);
        });
    }

    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case ' ':
                    e.preventDefault();
                    if (this.currentPage === 1) {
                        this.triggerShatterTransition(2, 'explosion');
                    } else if (this.currentPage === 4) {
                        this.triggerAutoShatter();
                    }
                    break;
                case '1':
                case '2':
                case '3':
                case '4':
                    const pageNum = parseInt(e.key);
                    if (pageNum !== this.currentPage) {
                        if (pageNum === 1 || this.currentPage === 1) {
                            this.navigateToPage(pageNum);
                        } else {
                            this.triggerShatterTransition(pageNum, 'explosion');
                        }
                    }
                    break;
                case 'c':
                    if (this.currentPage === 4) {
                        this.clearImpactPoints();
                    }
                    break;
                case 't':
                    this.testCurrentSettings();
                    break;
                case 'p':
                    this.performanceMonitor.classList.toggle('show');
                    break;
                case 'Escape':
                    this.navigateToPage(1);
                    break;
            }
        });
    }

    setupTouchGestures() {
        let touchStartTime = 0;
        let touchStartPos = { x: 0, y: 0 };
        
        document.addEventListener('touchstart', (e) => {
            touchStartTime = Date.now();
            touchStartPos.x = e.touches[0].clientX;
            touchStartPos.y = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            const touchEndTime = Date.now();
            const touchDuration = touchEndTime - touchStartTime;
            const touchEndPos = {
                x: e.changedTouches[0].clientX,
                y: e.changedTouches[0].clientY
            };
            
            const deltaX = touchEndPos.x - touchStartPos.x;
            const deltaY = touchEndPos.y - touchStartPos.y;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            // Swipe gestures
            if (touchDuration < 500 && distance > 50) {
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    // Horizontal swipe
                    if (deltaX > 0) {
                        // Swipe right - go to next page
                        const nextPage = Math.min(4, this.currentPage + 1);
                        if (nextPage !== this.currentPage) {
                            this.triggerShatterTransition(nextPage, 'wave');
                        }
                    } else {
                        // Swipe left - go to previous page
                        const prevPage = Math.max(1, this.currentPage - 1);
                        if (prevPage !== this.currentPage) {
                            this.navigateToPage(prevPage);
                        }
                    }
                }
            }
            
            // Multi-finger tap
            if (e.changedTouches.length >= 3 && touchDuration < 300) {
                this.triggerSpecialShatterEffect();
            }
        });
    }

    triggerSpecialShatterEffect() {
        // Create massive shatter effect
        const originalCount = this.shatterSettings.count;
        this.shatterSettings.count = 100;
        
        this.createShatterOverlay();
        this.generateShatterEffect('explosion');
        
        // Create additional effects
        setTimeout(() => {
            this.generateShatterEffect('spiral');
        }, 500);
        
        setTimeout(() => {
            this.generateShatterEffect('wave');
        }, 1000);
        
        // Restore original settings
        setTimeout(() => {
            this.shatterSettings.count = originalCount;
            this.cleanupShards();
        }, 6000);
    }
}

// Glass Physics Engine
class GlassPhysicsEngine {
    constructor() {
        this.gravity = 9.81;
        this.airResistance = 0.99;
        this.bounceRestitution = 0.3;
    }
    
    calculateTrajectory(initialVelocity, gravity, time) {
        return {
            x: initialVelocity.x * time * this.airResistance,
            y: initialVelocity.y * time + 0.5 * gravity * time * time
        };
    }
    
    calculateRotation(initialRotation, angularVelocity, time) {
        return initialRotation + angularVelocity * time;
    }
    
    simulateShatter(impactPoint, force, material) {
        // Advanced shatter simulation would go here
        // For now, return basic parameters
        return {
            shardCount: Math.floor(force * 10) + 15,
            averageSize: Math.max(10, 50 - force * 5),
            spreadRadius: force * 100
        };
    }
}

// Add additional CSS animations via JavaScript
const additionalStyles = `
    @keyframes impactShockwave {
        0% { transform: scale(0); opacity: 1; }
        100% { transform: scale(10); opacity: 0; }
    }
    
    @keyframes glassReflection {
        0%, 100% { transform: translateX(-100%); }
        50% { transform: translateX(100%); }
    }
    
    .impact-shockwave {
        position: absolute;
        width: 20px;
        height: 20px;
        border: 2px solid rgba(255,255,255,0.8);
        border-radius: 50%;
        animation: impactShockwave 1s ease-out forwards;
        pointer-events: none;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AdvancedGlassShardSuite();
});