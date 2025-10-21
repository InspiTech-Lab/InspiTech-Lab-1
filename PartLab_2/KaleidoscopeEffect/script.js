const canvas = document.getElementById('kaleidoscopeCanvas');
const ctx = canvas.getContext('2d');

const wrapper = document.querySelector('.kaleidoscope-wrapper');
canvas.width = wrapper.offsetWidth;
canvas.height = wrapper.offsetHeight;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const segments = 12;
const segmentAngle = (Math.PI * 2) / segments;

let hue = 0;
let isDrawing = false;
let autoRotate = 0;

class KaleidoscopeParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.hue = hue;
        this.size = Math.random() * 5 + 2;
        this.alpha = 1;
        this.speed = Math.random() * 2 + 1;
    }

    update() {
        this.alpha -= 0.01;
        this.size += 0.1;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;

        for (let i = 0; i < segments; i++) {
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(segmentAngle * i + autoRotate);

            const gradient = ctx.createRadialGradient(
                this.x - centerX, this.y - centerY, 0,
                this.x - centerX, this.y - centerY, this.size
            );
            gradient.addColorStop(0, `hsla(${this.hue + i * 30}, 100%, 60%, ${this.alpha})`);
            gradient.addColorStop(1, `hsla(${this.hue + i * 30}, 100%, 50%, 0)`);

            ctx.fillStyle = gradient;
            ctx.shadowBlur = 20;
            ctx.shadowColor = `hsl(${this.hue + i * 30}, 100%, 60%)`;
            ctx.beginPath();
            ctx.arc(this.x - centerX, this.y - centerY, this.size, 0, Math.PI * 2);
            ctx.fill();

            ctx.scale(-1, 1);
            ctx.beginPath();
            ctx.arc(this.x - centerX, this.y - centerY, this.size, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }

        ctx.restore();
    }
}

const particles = [];

function drawKaleidoscope(x, y) {
    particles.push(new KaleidoscopeParticle(x, y));
    hue = (hue + 2) % 360;
}

function animate() {
    ctx.fillStyle = 'rgba(26, 26, 46, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    autoRotate += 0.002;

    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();

        if (particles[i].alpha <= 0) {
            particles.splice(i, 1);
        }
    }

    if (isDrawing && Math.random() > 0.3) {
        const randomX = centerX + (Math.random() - 0.5) * 100;
        const randomY = centerY + (Math.random() - 0.5) * 100;
        drawKaleidoscope(randomX, randomY);
    }

    requestAnimationFrame(animate);
}

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    drawKaleidoscope(x, y);
});

canvas.addEventListener('mouseenter', () => {
    isDrawing = true;
});

canvas.addEventListener('mouseleave', () => {
    isDrawing = false;
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;
    drawKaleidoscope(x, y);
});

canvas.addEventListener('touchstart', () => {
    isDrawing = true;
});

canvas.addEventListener('touchend', () => {
    isDrawing = false;
});

window.addEventListener('resize', () => {
    canvas.width = wrapper.offsetWidth;
    canvas.height = wrapper.offsetHeight;
});

animate();

setInterval(() => {
    if (!isDrawing) {
        const randomX = centerX + (Math.random() - 0.5) * 150;
        const randomY = centerY + (Math.random() - 0.5) * 150;
        drawKaleidoscope(randomX, randomY);
    }
}, 200);