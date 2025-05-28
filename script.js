document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});


function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}


setInterval(() => {
    const logo = document.querySelector('.logo');
    logo.style.textShadow = `0 0 20px #${Math.random() > 0.5 ? '00ffff' : 'ff0040'}`;
}, 2000);

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    document.querySelector('.grid-background').style.transform = `translate3d(0, ${rate}px, 0)`;
});


window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    document.body.style.transition = 'none';

    particleNetwork = new ParticleNetwork();
});


class ParticleNetwork {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.animationId = null;
        
        this.config = {
            particleCount: 80,
            particleSpeed: 0.5,
            lineDistance: 150,
            mouseDistance: 200,
            particleSize: 2,
            lineOpacity: 0.3,
            particleOpacity: 0.8
        };
        
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.pointerEvents = 'none';
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        
        const gridBg = document.querySelector('.grid-background');
        if (gridBg) {
            gridBg.style.display = 'none';
        }
        
        document.body.appendChild(this.canvas);
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.config.particleSpeed,
                vy: (Math.random() - 0.5) * this.config.particleSpeed,
                size: Math.random() * this.config.particleSize + 1
            });
        }
    }
    
    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.createParticles();
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.config.mouseDistance) {
                const force = (this.config.mouseDistance - distance) / this.config.mouseDistance;
                particle.vx += dx * force * 0.001;
                particle.vy += dy * force * 0.001;
            }
            
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
            }
            
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            
            particle.vx *= 0.99;
            particle.vy *= 0.99;
        });
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 255, 255, ${this.config.particleOpacity})`;
            this.ctx.fill();
        });
    }
    
    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.lineDistance) {
                    const opacity = (this.config.lineDistance - distance) / this.config.lineDistance * this.config.lineOpacity;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(0, 255, 255, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
            
            const dx = this.mouse.x - this.particles[i].x;
            const dy = this.mouse.y - this.particles[i].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.config.mouseDistance) {
                const opacity = (this.config.mouseDistance - distance) / this.config.mouseDistance * 0.5;
                this.ctx.beginPath();
                this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                this.ctx.lineTo(this.mouse.x, this.mouse.y);
                this.ctx.strokeStyle = `rgba(255, 0, 64, ${opacity})`;
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            }
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.updسParticles();
        this.drawConnections();
        this.drawParticles();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

let particleNetwork;
