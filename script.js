/* ========================================
   VYUHA — AI & ML ASSOCIATION
   GSAP Animations + Interactivity
   ======================================== */

// ===== PRELOADER =====
// =====================================================
// VYUHA CINEMATIC PRELOADER
// =====================================================

// ========================================
// VYUHA INTRO VIDEO
// ========================================
// ========================================
// VYUHA INTRO VIDEO
// ========================================

// ========================================
// VYUHA INTRO VIDEO & PORTAL PRELOADER
// ========================================

// ===== PRELOADER & INTRO VIDEO =====
// ===== PRELOADER & CYBER-QUANTUM ANIMATED INTRO =====
// ===== PRELOADER & CINEMATIC CIRCULAR VIDEO INTRO (DZYPHER STYLE) =====
// ===== PRELOADER & CINEMATIC PURE CIRCULAR VIDEO INTRO =====
(function initVyuhaCircularIntro() {
    const introScreen = document.getElementById("intro-screen");
    const introVideo = document.getElementById("intro-video");

    if (!introScreen) return;

    // Check if intro preloader has already been shown in this browser session
    if (sessionStorage.getItem("vyuha_intro_shown") === "true") {
        introScreen.classList.add("removed");
        introScreen.style.display = "none";
        if (introVideo) {
            try { introVideo.pause(); } catch (err) { }
        }
        requestAnimationFrame(() => {
            if (typeof initHeroAnimations === "function") {
                initHeroAnimations();
            }
            if (typeof ScrollTrigger !== "undefined") {
                ScrollTrigger.refresh();
            }
        });
        return;
    }

    let hasExited = false;

    // Start video playback
    if (introVideo) {
        introVideo.currentTime = 0;
        introVideo.play().catch(() => {
            console.log("Autoplay handled by browser.");
        });
    }

    // Smooth Portal Morph Exit Sequence directly into Hero Logo
    function exitIntroScreen() {
        if (hasExited) return;
        hasExited = true;

        sessionStorage.setItem("vyuha_intro_shown", "true");

        introScreen.classList.add("portal-shrink");

        const portal = document.querySelector(".intro-video-portal");
        const heroLogo = document.getElementById("heroLogo") || document.querySelector(".hero-logo");

        let targetX = 0;
        let targetY = -40;
        let targetScale = 0.538;

        if (portal && heroLogo) {
            const portalRect = portal.getBoundingClientRect();
            const heroRect = heroLogo.getBoundingClientRect();

            if (portalRect.width > 0 && heroRect.width > 0) {
                const portalCenterX = portalRect.left + portalRect.width / 2;
                const portalCenterY = portalRect.top + portalRect.height / 2;
                const heroCenterX = heroRect.left + heroRect.width / 2;
                const heroCenterY = heroRect.top + heroRect.height / 2;

                targetX = heroCenterX - portalCenterX;
                targetY = heroCenterY - portalCenterY;
                targetScale = heroRect.width / portalRect.width;
            }
        }

        const skipBtn = document.getElementById("skipIntroBtn");

        if (typeof gsap !== "undefined" && portal) {
            const masterTl = gsap.timeline({
                onComplete: () => {
                    introScreen.classList.add("removed");
                    introScreen.style.display = "none";
                    if (introVideo) {
                        try { introVideo.pause(); } catch (err) { }
                    }
                    if (typeof ScrollTrigger !== "undefined") {
                        ScrollTrigger.refresh();
                    }
                }
            });

            if (skipBtn) {
                masterTl.to(skipBtn, { opacity: 0, duration: 0.2 }, 0);
            }

            // 1. Smoothly dissolve intro screen dark overlay
            masterTl.to(introScreen, {
                backgroundColor: "rgba(2, 5, 10, 0)",
                duration: 0.9,
                ease: "power2.inOut"
            }, 0);

            // 2. Video portal glides and scales directly to hero logo center
            masterTl.to(portal, {
                x: targetX,
                y: targetY,
                scale: targetScale,
                boxShadow: "0 0 45px rgba(212, 175, 55, 0.9)",
                duration: 0.9,
                ease: "power3.inOut"
            }, 0);

            // 3. Inject hero animations onto master timeline in exact sync at 0.55s
            if (typeof initHeroAnimations === "function") {
                initHeroAnimations(masterTl, 0.55);
            }

            // 4. Symmetrical crossfade from portal into hero logo
            masterTl.to(portal, {
                opacity: 0,
                duration: 0.35,
                ease: "power2.out"
            }, 0.55);

        } else {
            if (typeof initHeroAnimations === "function") {
                initHeroAnimations();
            }
            setTimeout(() => {
                introScreen.classList.add("removed");
                introScreen.style.display = "none";
                if (introVideo) {
                    try { introVideo.pause(); } catch (err) { }
                }
            }, 800);
        }
    }

    // Exit when the video completes playing from start to finish
    if (introVideo) {
        introVideo.addEventListener("ended", exitIntroScreen);
        introVideo.addEventListener("error", exitIntroScreen);
    }

    // Also exit on click or keypress
    introScreen.addEventListener("click", exitIntroScreen);

    document.addEventListener("keydown", (e) => {
        if ((e.key === "Enter" || e.key === " ") && !hasExited) {
            exitIntroScreen();
        }
    });

    // Skip button
    const skipBtn = document.getElementById("skipIntroBtn");
    if (skipBtn) {
        skipBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // don't bubble to introScreen click
            exitIntroScreen();
        });
    }
})();

// ===== CURSOR GLOW =====
const cursorGlow = document.getElementById('cursor-glow');
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.08;
    cursorY += (mouseY - cursorY) * 0.08;
    if (cursorGlow) {
        cursorGlow.style.left = cursorX + 'px';
        cursorGlow.style.top = cursorY + 'px';
    }
    requestAnimationFrame(animateCursor);
}
animateCursor();

// ===== HERO CANVAS — CIRCUIT PARTICLE NETWORK =====
const canvas = document.getElementById('heroCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;
let particles = [];
let animFrame;

function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
if (canvas) {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
}

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * (canvas ? canvas.width : window.innerWidth);
        this.y = Math.random() * (canvas ? canvas.height : window.innerHeight);
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.pulseSpeed = Math.random() * 0.02 + 0.005;
        this.pulsePhase = Math.random() * Math.PI * 2;
    }
    update() {
        if (!canvas) return;
        this.x += this.speedX;
        this.y += this.speedY;
        this.pulsePhase += this.pulseSpeed;
        this.currentOpacity = this.opacity * (0.5 + 0.5 * Math.sin(this.pulsePhase));

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 168, 76, ${this.currentOpacity})`;
        ctx.fill();
    }
}

function initParticles() {
    if (!canvas) return;
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
    particles = [];
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}
if (canvas) initParticles();

function drawConnections() {
    if (!ctx) return;
    const maxDist = 150;
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < maxDist) {
                const opacity = (1 - dist / maxDist) * 0.12;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(201, 168, 76, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    drawConnections();
    animFrame = requestAnimationFrame(animateParticles);
}
if (canvas) animateParticles();

// ===== NAVIGATION =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

// Sticky nav
window.addEventListener('scroll', () => {
    if (navbar) {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Mobile menu
if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

// ===== GSAP & SCROLLTRIGGER REVEAL CONTROLLER =====
let heroAnimInitialized = false;

function initHeroAnimations(parentTl, startTime) {
    if (heroAnimInitialized) return;
    heroAnimInitialized = true;

    if (typeof gsap === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const useParent = !!parentTl;
    const heroTl = useParent ? parentTl : gsap.timeline({ defaults: { ease: 'power3.out' } });
    const pos = useParent ? (startTime !== undefined ? startTime : 0.55) : 0;

    if (useParent) {
        // Unified Master Timeline: 100% in sync with portal landing
        heroTl
            .fromTo('.hero-logo',
                { opacity: 0, scale: 0.95 },
                { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }, pos
            )
            .fromTo('.hero-ring-1',
                { scale: 0.4, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.7, ease: 'power2.out' }, pos
            )
            .fromTo('.hero-ring-2',
                { scale: 0.4, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.7, ease: 'power2.out' }, pos + 0.05
            )
            .fromTo('.hero-ring-3',
                { scale: 0.4, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.7, ease: 'power2.out' }, pos + 0.1
            )
            .fromTo('.hero-wordmark',
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: 'power4.out' }, pos + 0.12
            )
            .fromTo('.hero-title-sub',
                { y: 18, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6 }, pos + 0.22
            )
            .fromTo('.hero-tagline',
                { y: 15, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6 }, pos + 0.28
            )
            .fromTo('.hero-est',
                { scale: 0.85, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.5 }, pos + 0.34
            )
            .fromTo('.hero-actions .btn-hero',
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }, pos + 0.4
            )
            .fromTo('.scroll-indicator',
                { y: 15, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5 }, pos + 0.46
            );
    } else {
        // Direct reveal when intro is skipped
        heroTl
            .fromTo('.hero-logo',
                { scale: 0.9, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.6, ease: 'power2.out' }
            )
            .fromTo('.hero-ring-1', { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6 }, '-=0.5')
            .fromTo('.hero-ring-2', { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6 }, '-=0.5')
            .fromTo('.hero-ring-3', { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6 }, '-=0.5')
            .fromTo('.hero-wordmark', { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.4')
            .fromTo('.hero-title-sub', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.4')
            .fromTo('.hero-tagline', { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.3')
            .fromTo('.hero-est', { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5 }, '-=0.3')
            .fromTo('.hero-actions .btn-hero', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 }, '-=0.2')
            .fromTo('.scroll-indicator', { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, '-=0.2');
    }

    // Hero parallax on scroll (subtle vertical shift without dimming/fading opacity)
    gsap.to('.hero-content', {
        y: -40,
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        }
    });

    if (canvas) {
        gsap.to('#heroCanvas', {
            y: 50,
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            }
        });
    }

    // ===== UNIFIED REVEAL TEXT =====
    gsap.utils.toArray('.reveal-text').forEach(el => {
        gsap.fromTo(el,
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 90%',
                    once: true,
                    onEnter: () => el.classList.add('is-visible')
                }
            }
        );
    });

    // ===== UNIFIED REVEAL UP =====
    gsap.utils.toArray('.reveal-up').forEach((el, i) => {
        gsap.fromTo(el,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 88%',
                    once: true,
                    onEnter: () => el.classList.add('is-visible')
                }
            }
        );
    });

    // Section Labels
    gsap.utils.toArray('.section-label').forEach(label => {
        gsap.from(label, {
            x: -20,
            opacity: 0,
            duration: 0.6,
            scrollTrigger: {
                trigger: label,
                start: 'top 90%',
                once: true
            }
        });
    });

    // Timeline line & dots
    const timelineLine = document.querySelector('.timeline-line');
    if (timelineLine) {
        gsap.from(timelineLine, {
            scaleY: 0,
            transformOrigin: 'top',
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.timeline',
                start: 'top 80%',
                once: true
            }
        });
    }

    gsap.utils.toArray('.timeline-dot').forEach((dot, i) => {
        gsap.from(dot, {
            scale: 0,
            duration: 0.5,
            delay: i * 0.15,
            ease: 'back.out(2)',
            scrollTrigger: {
                trigger: dot,
                start: 'top 90%',
                once: true
            }
        });
    });

    // Circuit svg decoration
    const circuitSvg = document.querySelector('.circuit-svg');
    if (circuitSvg) {
        gsap.from(circuitSvg, {
            scale: 0.5,
            opacity: 0,
            rotation: -90,
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: circuitSvg,
                start: 'top 85%',
                once: true
            }
        });
    }

    // Vision 3D Orbit pinning
    const visionOrbit = document.getElementById('visionOrbit');
    if (visionOrbit) {
        gsap.from('.vision-orbit-card', {
            opacity: 0,
            y: 40,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '#vision',
                start: 'top 80%',
                once: true,
                onEnter: () => {
                    document.querySelectorAll('.vision-orbit-card').forEach(c => c.classList.add('is-visible'));
                }
            }
        });

        gsap.to(visionOrbit, {
            rotateY: -270,
            ease: 'none',
            scrollTrigger: {
                trigger: '#vision',
                start: 'center center',
                end: '+=150%',
                scrub: 1,
                pin: true,
                anticipatePin: 1,
                onLeave: () => {
                    if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
                }
            }
        });
    }

    // Project placeholder floating animation
    const projectPlaceholder = document.querySelector('.project-placeholder');
    if (projectPlaceholder) {
        gsap.to(projectPlaceholder, {
            y: -10,
            duration: 3,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut'
        });
    }

    // Join section entrance
    const joinSection = document.querySelector('.section-join');
    if (joinSection) {
        gsap.from('.join-form-wrap', {
            y: 40,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: joinSection,
                start: 'top 80%',
                once: true,
                onEnter: () => {
                    const wrap = document.querySelector('.join-form-wrap');
                    if (wrap) wrap.classList.add('is-visible');
                }
            }
        });
    }

    // Footer entrance
    gsap.from('#footer', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '#footer',
            start: 'top 95%',
            once: true
        }
    });

    // Member Cards — Magnetic 3D tilt effect
    document.querySelectorAll('.member-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -4;
            const rotateY = ((x - centerX) / centerX) * 4;
            card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // Fallback IntersectionObserver for scroll reveal reliability
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    if (typeof gsap !== 'undefined') {
                        gsap.set(entry.target, { opacity: 1, y: 0 });
                    }
                }
            });
        }, { threshold: 0.05 });

        document.querySelectorAll('.reveal-text, .reveal-up').forEach(el => observer.observe(el));
    }

    const revealVisibleElements = () => {
        const vh = window.innerHeight || document.documentElement.clientHeight;
        document.querySelectorAll('.reveal-text, .reveal-up').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top <= vh * 0.98) {
                el.classList.add('is-visible');
                if (typeof gsap !== 'undefined') {
                    gsap.set(el, { opacity: 1, y: 0 });
                }
            }
        });
    };

    revealVisibleElements();
    setTimeout(() => {
        revealVisibleElements();
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }, 100);
}

// Window pageshow event handler for back navigation
window.addEventListener('pageshow', () => {
    if (sessionStorage.getItem("vyuha_intro_shown") === "true") {
        document.querySelectorAll('.reveal-text, .reveal-up').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.98) {
                el.classList.add('is-visible');
                if (typeof gsap !== 'undefined') {
                    gsap.set(el, { opacity: 1, y: 0 });
                }
            }
        });
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== JOIN FORM =====
function handleJoinSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('joinBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span>WELCOME TO VYUHA ✦</span>';
    btn.style.background = 'var(--gold)';
    btn.style.color = 'var(--bg)';
    btn.disabled = true;

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.style.color = '';
        btn.disabled = false;
        e.target.reset();
    }, 3000);
}

// ===== ACTIVE NAV LINK HIGHLIGHT =====
const navAnchors = document.querySelectorAll('.nav-links a:not(.nav-cta)');
const sectionElements = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    let current = '';
    sectionElements.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navAnchors.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href').replace('#', '');
        // Map section IDs to nav hrefs
        const mapping = {
            'beginning': 'beginning',
            'vision': 'beginning',
            'people': 'people',
            'explore': 'explore',
            'activities': 'explore',
            'events': 'events',
            'projects': 'projects',
            'resources': 'resources',
            'roadahead': 'resources',
            'join': 'join'
        };
        if (mapping[current] === href) {
            link.style.color = 'var(--gold)';
        } else {
            link.style.color = '';
        }
    });
});

// ===== VIDEO LIGHTBOX MODAL CONTROLLER =====
(function initVideoModal() {
    const videoModal = document.getElementById("videoModal");
    const modalVideo = document.getElementById("modalVideo");
    const watchReelBtn = document.getElementById("watchReelBtn");
    const navReelBtn = document.getElementById("navReelBtn");
    const videoModalClose = document.getElementById("videoModalClose");
    const videoModalBackdrop = document.getElementById("videoModalBackdrop");

    if (!videoModal || !modalVideo) return;

    function openModal() {
        videoModal.classList.add("active");
        videoModal.setAttribute("aria-hidden", "false");
        modalVideo.currentTime = 0;
        modalVideo.play().catch(() => { });
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        videoModal.classList.remove("active");
        videoModal.setAttribute("aria-hidden", "true");
        try { modalVideo.pause(); } catch (err) { }
        document.body.style.overflow = "";
    }

    if (watchReelBtn) watchReelBtn.addEventListener("click", openModal);
    if (navReelBtn) navReelBtn.addEventListener("click", openModal);
    if (videoModalClose) videoModalClose.addEventListener("click", closeModal);
    if (videoModalBackdrop) videoModalBackdrop.addEventListener("click", closeModal);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && videoModal.classList.contains("active")) {
            closeModal();
        }
    });
})();

// ===== RESIZE LISTENER FOR PARTICLES =====
window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});
