class StretchyInputs {
    constructor() {
        this.inputs = document.querySelectorAll('.stretchy-input');
        this.wrappers = document.querySelectorAll('.stretchy-wrapper');
        this.submitBtn = document.querySelector('.stretchy-submit');
        
        this.init();
    }
    
    init() {
        this.inputs.forEach((input, index) => {
            const wrapper = input.closest('.stretchy-wrapper');
            
            // Focus events
            input.addEventListener('focus', () => this.onFocus(wrapper, input));
            input.addEventListener('blur', () => this.onBlur(wrapper, input));
            
            // Input events for dynamic effects
            input.addEventListener('input', () => this.onInput(wrapper, input));
            
            // Auto demo with staggered timing
            setTimeout(() => {
                this.autoDemo(input, wrapper);
            }, (index + 1) * 2000);
        });
        
        // Submit button effect
        if (this.submitBtn) {
            this.submitBtn.addEventListener('click', () => this.onSubmit());
        }
        
        // Continuous auto demo
        // setInterval(() => {
        //     this.randomDemo();
        // }, 8000);
    }
    
    onFocus(wrapper, input) {
        wrapper.classList.add('focused');
        
        // Add specific animation based on data-style
        const style = wrapper.getAttribute('data-style');
        this.addStyleAnimation(wrapper, style);
        
        // Create focus particles
        this.createFocusParticles(wrapper);
    }
    
    onBlur(wrapper, input) {
        wrapper.classList.remove('focused');
        
        // Clean up any temporary animations
        wrapper.style.animation = '';
    }
    
    onInput(wrapper, input) {
        const value = input.value;
        
        // Add typing animation
        if (value.length > 0) {
            wrapper.classList.add('has-content');
            this.createTypingEffect(wrapper);
        } else {
            wrapper.classList.remove('has-content');
        }
    }
    
    addStyleAnimation(wrapper, style) {
        switch(style) {
            case 'elastic':
                wrapper.style.animation = 'elasticPulse 0.6s ease-out';
                break;
            case 'wave':
                wrapper.style.animation = 'wave 1s ease-in-out';
                break;
            case 'morph':
                wrapper.style.animation = 'morph 0.8s ease-in-out';
                break;
            case 'rainbow':
                wrapper.style.animation = 'rainbow 2s ease-in-out infinite';
                break;
            case 'pulse':
                wrapper.style.animation = 'pulse 1.5s ease-in-out infinite';
                break;
        }
    }
    
    createFocusParticles(wrapper) {
        const rect = wrapper.getBoundingClientRect();
        const particleCount = 8;
        
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    background: linear-gradient(45deg, #8b5cf6, #06b6d4);
                    border-radius: 50%;
                    pointer-events: none;
                    top: ${rect.top + Math.random() * rect.height}px;
                    left: ${rect.left + Math.random() * rect.width}px;
                    animation: particleFloat 1.5s ease-out forwards;
                    z-index: 1000;
                `;
                
                document.body.appendChild(particle);
                
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 1500);
            }, i * 100);
        }
    }
    
    createTypingEffect(wrapper) {
        const highlight = wrapper.querySelector('.input-highlight');
        if (highlight) {
            highlight.style.animation = 'highlightPulse 0.3s ease-out';
            setTimeout(() => {
                highlight.style.animation = '';
            }, 300);
        }
    }
    
    autoDemo(input, wrapper) {
        const demoTexts = {
            'text': 'Inspitech User',
            'email': 'hello@inspitech.com',
            'tel': '+91 0000000000',
            'password': '••••••••',
            'textarea': 'Hey! I’m excited to connect with Inspitech 🚀',
            'select-one': 'Inspiration & Technology'
          };
          
        const inputType = input.type || input.tagName.toLowerCase();
        const demoText = demoTexts[inputType] || demoTexts['text'];
        
        // Simulate focus
        input.focus();
        
        if (demoText) {
            // Simulate typing
            this.typeText(input, demoText, () => {
                setTimeout(() => {
                    input.blur();
                    setTimeout(() => {
                        input.value = '';
                        input.dispatchEvent(new Event('input'));
                    }, 2000);
                }, 4000);
            });
        }
    }
    
    typeText(input, text, callback) {
        let index = 0;
        const typeChar = () => {
            if (index < text.length) {
                input.value += text.charAt(index);
                input.dispatchEvent(new Event('input'));
                index++;
                setTimeout(typeChar, 100);
            } else if (callback) {
                callback();
            }
        };
        typeChar();
    }
    
    randomDemo() {
        const randomInput = this.inputs[Math.floor(Math.random() * this.inputs.length)];
        const wrapper = randomInput.closest('.stretchy-wrapper');
        
        if (!randomInput.matches(':focus')) {
            this.autoDemo(randomInput, wrapper);
        }
    }
    
    onSubmit() {
        this.submitBtn.classList.add('clicked');
        
        setTimeout(() => {
            this.submitBtn.classList.remove('clicked');
        }, 400);
        
        // Success animation
        this.showSuccessAnimation();
    }
    
    showSuccessAnimation() {
        const success = document.createElement('div');
        success.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(16, 185, 129, 0.9);
            color: white;
            padding: 1rem 2rem;
            border-radius: 50px;
            font-weight: 700;
            z-index: 10000;
            animation: successPop 2s ease-out forwards;
            backdrop-filter: blur(10px);
        `;
        success.textContent = '✨ Message Sent!';
        
        document.body.appendChild(success);
        
        setTimeout(() => {
            if (success.parentNode) {
                success.parentNode.removeChild(success);
            }
        }, 2000);
    }
}

// Add CSS animations for particles
const style = document.createElement('style');
style.textContent = `
    @keyframes particleFloat {
        0% { opacity: 1; transform: translateY(0) scale(1); }
        100% { opacity: 0; transform: translateY(-30px) scale(0); }
    }
    
    @keyframes highlightPulse {
        0%, 100% { transform: translateX(-50%) scaleX(1); }
        50% { transform: translateX(-50%) scaleX(1.1); }
    }
    
    @keyframes successPop {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new StretchyInputs();
});