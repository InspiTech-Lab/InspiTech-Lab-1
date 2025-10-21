class CountdownTimer {
    constructor() {
        this.targetDate = new Date();
        this.targetDate.setFullYear(this.targetDate.getFullYear() + 1, 0, 1);
        this.targetDate.setHours(0, 0, 0, 0);
        
        this.elements = {
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds'),
            daysNext: document.getElementById('days-next'),
            hoursNext: document.getElementById('hours-next'),
            minutesNext: document.getElementById('minutes-next'),
            secondsNext: document.getElementById('seconds-next'),
            daysFlip: document.getElementById('days-flip'),
            hoursFlip: document.getElementById('hours-flip'),
            minutesFlip: document.getElementById('minutes-flip'),
            secondsFlip: document.getElementById('seconds-flip')
        };
        
        this.previousTime = this.getTimeRemaining();
        this.createParticles();
        this.updateTimer();
        this.startTimer();
    }

    getTimeRemaining() {
        const now = new Date();
        const difference = this.targetDate - now;
        
        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((difference % (1000 * 60)) / 1000)
        };
    }

    formatTime(value) {
        return value.toString().padStart(2, '0');
    }

    flipCard(unit, newValue, oldValue) {
        if (newValue !== oldValue) {
            const flipElement = this.elements[`${unit}Flip`];
            const nextElement = this.elements[`${unit}Next`];
            
            nextElement.textContent = this.formatTime(newValue);
            
            flipElement.parentElement.classList.add('flipping');
            
            setTimeout(() => {
                this.elements[unit].textContent = this.formatTime(newValue);
                flipElement.parentElement.classList.remove('flipping');
            }, 300);
        }
    }

    updateTimer() {
        const timeRemaining = this.getTimeRemaining();
        
        this.flipCard('days', timeRemaining.days, this.previousTime.days);
        this.flipCard('hours', timeRemaining.hours, this.previousTime.hours);
        this.flipCard('minutes', timeRemaining.minutes, this.previousTime.minutes);
        this.flipCard('seconds', timeRemaining.seconds, this.previousTime.seconds);
        
        this.previousTime = timeRemaining;
    }

    createParticles() {
        const particlesContainer = document.querySelector('.particles');
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 4 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    startTimer() {
        this.updateTimer();
        setInterval(() => {
            this.updateTimer();
        }, 1000);
    }
}

// Initialize timer when page loads
document.addEventListener('DOMContentLoaded', () => {
    new CountdownTimer();
});