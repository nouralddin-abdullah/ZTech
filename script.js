
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
});
