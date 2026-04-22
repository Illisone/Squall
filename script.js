// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

// Theme Toggle with SVG Icons
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const moonIcon = document.querySelector('.theme-icon--moon');
const sunIcon = document.querySelector('.theme-icon--sun');

function updateThemeIcon(theme) {
    if (theme === 'dark') {
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'block';
    } else {
        moonIcon.style.display = 'block';
        sunIcon.style.display = 'none';
    }
}

const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    gsap.fromTo('body', { opacity: 0.8 }, { opacity: 1, duration: 0.3 });
});

// Smooth Scroll for Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            const mobileMenu = document.getElementById('mobileMenu');
            const navToggle = document.getElementById('navToggle');
            if (mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
            const offset = 100;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
    });
});

// 3D Tilt Cards
document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});

// Text Scramble Effect
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="scramble-char">${char}</span>`;
            } else {
                output += from;
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

document.querySelectorAll('.scramble-text').forEach(el => {
    const fx = new TextScramble(el);
    const originalText = el.dataset.text;
    el.addEventListener('mouseenter', () => { fx.setText(originalText); });
});


// Parallax Effect on Mouse Move for Hero
const heroParallax = document.getElementById('heroParallax');
if (heroParallax && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        heroParallax.style.transform = `translate(${x}px, ${y}px) scale(1.1)`;
    });
}

// Navigation Scroll Effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Mobile Menu
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

// ===== SPECS CAROUSEL LOGIC =====
const specsTrack = document.getElementById('specsTrack');
const specsBtnUp = document.getElementById('specsBtnUp');
const specsBtnDown = document.getElementById('specsBtnDown');
const specsIndicators = document.getElementById('specsIndicators');
const specItems = document.querySelectorAll('.spec-item');

let currentSpecIndex = 0;
const totalSpecs = specItems.length;
const itemHeight = 102; // height + margin

function updateSpecsCarousel(index) {
    if (index < 0) index = 0;
    if (index >= totalSpecs) index = totalSpecs - 1;
    currentSpecIndex = index;
    
    specsTrack.style.transform = `translateY(-${currentSpecIndex * itemHeight}px)`;
    
    specItems.forEach((item, i) => {
        item.classList.toggle('active', i === currentSpecIndex);
    });
    
    const indicators = specsIndicators.querySelectorAll('span');
    indicators.forEach((ind, i) => {
        ind.classList.toggle('active', i === currentSpecIndex);
    });
    
    specsBtnUp.disabled = currentSpecIndex === 0;
    specsBtnDown.disabled = currentSpecIndex === totalSpecs - 1;
}

specsBtnUp.addEventListener('click', () => updateSpecsCarousel(currentSpecIndex - 1));
specsBtnDown.addEventListener('click', () => updateSpecsCarousel(currentSpecIndex + 1));

specItems.forEach((item, index) => {
    item.addEventListener('click', () => updateSpecsCarousel(index));
});

specsIndicators.querySelectorAll('span').forEach((ind, index) => {
    ind.addEventListener('click', () => updateSpecsCarousel(index));
});

// Auto-rotate specs carousel
let specsAutoRotate = setInterval(() => {
    const nextIndex = (currentSpecIndex + 1) % totalSpecs;
    updateSpecsCarousel(nextIndex);
}, 4000);

// Pause auto-rotate on hover
specsTrack.addEventListener('mouseenter', () => clearInterval(specsAutoRotate));
specsTrack.addEventListener('mouseleave', () => {
    specsAutoRotate = setInterval(() => {
        const nextIndex = (currentSpecIndex + 1) % totalSpecs;
        updateSpecsCarousel(nextIndex);
    }, 4000);
});

// Initialize carousel
updateSpecsCarousel(0);

// Countdown with Flip Animation
const targetDate = new Date('2026-06-01T00:00:00').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;
    if (distance < 0) return;
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    updateFlip('days', days);
    updateFlip('hours', hours);
    updateFlip('minutes', minutes);
    updateFlip('seconds', seconds);
}

function updateFlip(id, value) {
    const el = document.getElementById(id);
    const newValue = value.toString().padStart(2, '0');
    if (el.textContent !== newValue) {
        gsap.to(el, {
            scale: 1.1,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            onComplete: () => { el.textContent = newValue; }
        });
    }
}

setInterval(updateCountdown, 1000);
updateCountdown();

// Video Modal
const playVideoBtn = document.getElementById('playVideo');
const videoModal = document.getElementById('videoModal');
const closeModal = document.getElementById('closeModal');
const modalVideo = document.getElementById('modalVideo');

playVideoBtn.addEventListener('click', () => {
    videoModal.classList.add('active');
    modalVideo.play();
});

closeModal.addEventListener('click', closeVideoModal);
videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) closeVideoModal();
});

function closeVideoModal() {
    videoModal.classList.remove('active');
    modalVideo.pause();
    modalVideo.currentTime = 0;
}

// Gallery Carousel
const carousel = document.getElementById('galleryCarousel');
const prevBtn = document.querySelector('.carousel__btn--prev');
const nextBtn = document.querySelector('.carousel__btn--next');

if (carousel && prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: -300, behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: 300, behavior: 'smooth' });
    });
}

// Form Handling with Confetti
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<span>Отправка...</span>';
    btn.disabled = true;
    setTimeout(() => {
        btn.style.background = '#22c55e';
        btn.innerHTML = `<span>Отправлено!</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>`;
        createConfetti(btn);
        setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.disabled = false;
            btn.style.background = '';
            e.target.reset();
        }, 3000);
    }, 1500);
});

function createConfetti(element) {
    const rect = element.getBoundingClientRect();
    const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${['#0066CC', '#0080ff', '#22c55e', '#f59e0b'][Math.floor(Math.random() * 4)]};
            left: ${center.x}px;
            top: ${center.y}px;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
        `;
        document.body.appendChild(confetti);
        gsap.to(confetti, {
            x: (Math.random() - 0.5) * 200,
            y: (Math.random() - 0.5) * 200,
            opacity: 0,
            scale: 0,
            duration: 1,
            ease: 'power2.out',
            onComplete: () => confetti.remove()
        });
    }
}

// Newsletter Form
document.getElementById('notifyForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.textContent = 'Подписка оформлена!';
    btn.style.background = '#22c55e';
    setTimeout(() => {
        btn.textContent = 'Узнать первым';
        btn.style.background = '';
        e.target.reset();
    }, 3000);
});

// AOS-like Scroll Animations
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('aos-animate');
    });
}, observerOptions);
document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));

// Reveal Images on Scroll
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'scale(1)';
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal-image').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'scale(0.95)';
    el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    imageObserver.observe(el);
});

// Spec Items Stagger Animation
gsap.from('.spec-item', {
    scrollTrigger: { trigger: '#specs', start: 'top 80%' },
    x: -50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power3.out'
});

// Magnetic effect - REDUCED RANGE (0.1 instead of 0.2)
document.querySelectorAll('.magnetic-button').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

console.log('🚙 Шквал загружен и готов к бездорожью!');