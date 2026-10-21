// ===================================
// Configuration and Constants
// ===================================
const weddingData = {
    couple: {
        bride: {
            name: "सौ.का. सोनल",
            father: "श्री कमलाकिशोर लखेरा",
            mother: "श्रीमती मिथलेश लखेरा",
            address: "लखेरा गली, किलागेट, ग्वालियर (म.प्र.)"
        },
        groom: {
            name: "चि. देवाकिशन (सोनू)",
            lateFather: "स्व. श्री छोटेलाल लखेरा",
            lateMother: "स्व. श्रीमती कटोरी देवी",
            guardianFather: "श्री मनमोहन लखेरा",
            guardianMother: "श्रीमती सुमन देवी",
            address: "शताब्दी पुरम फेज-1, ब्लॉक डी.डी. नगर, ग्वालियर (म.प्र.)"
        }
    },
    mainEvent: {
        date: new Date('2026-11-21T19:00:00'), // 21 November 2026, 7 PM
        venue: "गणेशी बारात घर",
        location: "मछली मण्डी, जिला ग्वालियर (म.प्र.)"
    },
    contacts: [
        "7804065775",
        "6263293489",
        "6263363129",
        "6263755898",
        "7000532647"
    ]
};

// ===================================
// Utility Functions
// ===================================
const utils = {
    hasSeenIntro() {
        return sessionStorage.getItem('seenIntro') === 'true';
    },
    
    markIntroSeen() {
        sessionStorage.setItem('seenIntro', 'true');
    },
    
    prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// ===================================
// Opening Gate Animation
// ===================================
class OpeningGateController {
    constructor() {
        this.openingScene = document.getElementById('openingScene');
        this.ganeshaScene = document.getElementById('ganeshaScene');
        this.mainInvitation = document.getElementById('mainInvitation');
        this.openGateBtn = document.getElementById('openGateBtn');
        this.skipIntroBtn = document.getElementById('skipIntroBtn');
        
        this.init();
    }
    
    init() {
        // Skip intro if already seen or reduced motion preferred
        if (utils.hasSeenIntro() || utils.prefersReducedMotion()) {
            this.skipToMain();
            return;
        }
        
        // Show opening scene and lock body scroll
        document.body.classList.add('intro-active');
        this.openingScene.classList.add('active');
        this.createParticles();
        this.setupEventListeners();
    }
    
    createParticles() {
        const particlesContainer = document.getElementById('particles');
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.setProperty('--tx', `${(Math.random() - 0.5) * 200}px`);
            particle.style.animationDelay = `${Math.random() * 6}s`;
            particlesContainer.appendChild(particle);
        }
    }
    
    setupEventListeners() {
        this.openGateBtn.addEventListener('click', () => this.openGates());
        this.skipIntroBtn.addEventListener('click', () => this.skipToMain());
    }
    
    openGates() {
        this.openingScene.classList.add('gate-opening');
        
        // Start music when user clicks
        if (window.musicController) {
            window.musicController.play();
        }
        
        // Wait for gate animation (reduced from 2000ms to 1200ms)
        setTimeout(() => {
            this.showGaneshaBlessing();
        }, 1200);
    }
    
    showGaneshaBlessing() {
        this.openingScene.style.display = 'none';
        this.ganeshaScene.classList.add('active');
        
        this.createFallingPetals();
        
        // Transition to main invitation (reduced from 4000ms to 2000ms)
        setTimeout(() => {
            this.showMainInvitation();
        }, 2000);
    }
    
    createFallingPetals() {
        const petalsContainer = document.getElementById('fallingPetals');
        const petalEmojis = ['🌸', '🌺', '🌼', '🏵️'];
        const petalCount = 30;
        
        for (let i = 0; i < petalCount; i++) {
            const petal = document.createElement('div');
            petal.className = 'petal';
            petal.textContent = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];
            petal.style.left = `${Math.random() * 100}%`;
            petal.style.animationDelay = `${Math.random() * 2}s`;
            petalsContainer.appendChild(petal);
        }
    }
    
    showMainInvitation() {
        this.ganeshaScene.style.display = 'none';
        this.mainInvitation.classList.add('active');
        document.body.classList.remove('intro-active');
        utils.markIntroSeen();
        
        // Ensure music is playing
        if (window.musicController && !window.musicController.isPlaying) {
            window.musicController.play();
        }
        
        // Initialize main invitation features
        if (window.countdownController) {
            window.countdownController.start();
        }
        if (window.scrollAnimations) {
            window.scrollAnimations.observe();
        }
    }
    
    skipToMain() {
        this.openingScene.style.display = 'none';
        this.ganeshaScene.style.display = 'none';
        this.mainInvitation.classList.add('active');
        document.body.classList.remove('intro-active');
        utils.markIntroSeen();
        
        // Start music when user skips
        if (window.musicController) {
            window.musicController.play();
        }
        
        // Initialize main invitation features
        if (window.countdownController) {
            window.countdownController.start();
        }
        if (window.scrollAnimations) {
            window.scrollAnimations.observe();
        }
    }
}

// ===================================
// Countdown Timer
// ===================================
class CountdownController {
    constructor() {
        this.targetDate = weddingData.mainEvent.date;
        this.countdownContainer = document.getElementById('countdownContainer');
        this.daysEl = document.getElementById('days');
        this.hoursEl = document.getElementById('hours');
        this.minutesEl = document.getElementById('minutes');
        this.secondsEl = document.getElementById('seconds');
        this.interval = null;
    }
    
    start() {
        this.update();
        this.interval = setInterval(() => this.update(), 1000);
    }
    
    update() {
        const now = new Date().getTime();
        const distance = this.targetDate - now;
        
        if (distance < 0) {
            this.stop();
            this.showEventMessage();
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        this.daysEl.textContent = this.pad(days);
        this.hoursEl.textContent = this.pad(hours);
        this.minutesEl.textContent = this.pad(minutes);
        this.secondsEl.textContent = this.pad(seconds);
    }
    
    pad(num) {
        return num.toString().padStart(2, '0');
    }
    
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
    
    showEventMessage() {
        this.countdownContainer.innerHTML = `
            <h3 class="countdown-title">आज का शुभ दिन है!</h3>
            <p style="font-size: 1.5rem; color: var(--color-gold); margin-top: 1rem;">
                हमारे विवाह समारोह में आपका स्वागत है
            </p>
        `;
    }
}

// ===================================
// Music Controller
// ===================================
class MusicController {
    constructor() {
        this.audio = document.getElementById('bgMusic');
        this.toggleBtn = document.getElementById('musicToggle');
        this.musicIcon = this.toggleBtn.querySelector('.music-icon');
        this.musicOffIcon = this.toggleBtn.querySelector('.music-off-icon');
        this.isPlaying = false;
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.toggleBtn.addEventListener('click', () => this.toggle());
        
        // Handle audio events
        this.audio.addEventListener('play', () => this.onPlay());
        this.audio.addEventListener('pause', () => this.onPause());
        this.audio.addEventListener('error', (e) => this.onError(e));
    }
    
    async toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            await this.play();
        }
    }
    
    async play() {
        try {
            // Reset audio if needed
            if (this.audio.readyState < 2) {
                this.audio.load();
            }
            
            // Try to play
            const playPromise = this.audio.play();
            
            if (playPromise !== undefined) {
                await playPromise;
                console.log('🎵 Music started successfully!');
            }
        } catch (error) {
            if (error.name === 'NotAllowedError') {
                console.log('🔇 Music autoplay blocked by browser. Click music button to start.');
            } else if (error.name !== 'AbortError') {
                console.log('Audio playback failed:', error.message);
            }
        }
    }
    
    pause() {
        this.audio.pause();
    }
    
    onPlay() {
        this.isPlaying = true;
        this.musicIcon.classList.add('hidden');
        this.musicOffIcon.classList.remove('hidden');
        this.toggleBtn.classList.add('playing');
    }
    
    onPause() {
        this.isPlaying = false;
        this.musicIcon.classList.remove('hidden');
        this.musicOffIcon.classList.add('hidden');
        this.toggleBtn.classList.remove('playing');
    }
    
    onError(e) {
        console.log('Audio file not available. Music feature disabled.');
        // Keep the button but don't show errors to user
    }
}

// ===================================
// Scroll Animations
// ===================================
class ScrollAnimations {
    constructor() {
        this.observer = null;
        this.init();
    }
    
    init() {
        const options = {
            threshold: 0.15,
            rootMargin: '0px 0px -100px 0px'
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);
                }
            });
        }, options);
    }
    
    observe() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach(el => this.observer.observe(el));
    }
}

// ===================================
// Back to Top Button
// ===================================
class BackToTopButton {
    constructor() {
        this.button = document.getElementById('backToTop');
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', utils.debounce(() => {
            if (window.pageYOffset > 300) {
                this.button.classList.remove('hidden');
            } else {
                this.button.classList.add('hidden');
            }
        }, 100));
        
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ===================================
// Share Invitation
// ===================================
class ShareController {
    constructor() {
        this.shareBtn = document.getElementById('shareBtn');
        this.init();
    }
    
    init() {
        this.shareBtn.addEventListener('click', () => this.share());
    }
    
    async share() {
        const shareData = {
            title: 'सोनल & देवाकिशन - विवाह समारोह',
            text: 'आप सादर आमंत्रित हैं - 21 नवम्बर 2026',
            url: window.location.href
        };
        
        // Check if Web Share API is supported
        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    this.fallbackShare();
                }
            }
        } else {
            this.fallbackShare();
        }
    }
    
    fallbackShare() {
        // Copy URL to clipboard
        const url = window.location.href;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(() => {
                this.showCopyNotification();
            }).catch(() => {
                this.showUrlPrompt(url);
            });
        } else {
            this.showUrlPrompt(url);
        }
    }
    
    showCopyNotification() {
        const notification = document.createElement('div');
        notification.textContent = 'लिंक कॉपी हो गया!';
        notification.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--color-gold);
            color: var(--color-maroon);
            padding: 1rem 2rem;
            border-radius: 50px;
            font-weight: 600;
            z-index: 10000;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
            animation: fadeInUp 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
    
    showUrlPrompt(url) {
        alert(`आमंत्रण लिंक:\n${url}`);
    }
}

// ===================================
// Timeline Scroll Animation
// ===================================
class TimelineAnimations {
    constructor() {
        this.timelineItems = document.querySelectorAll('.timeline-item');
        this.init();
    }
    
    init() {
        const options = {
            threshold: 0.2,
            rootMargin: '0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, 100);
                }
            });
        }, options);
        
        this.timelineItems.forEach(item => observer.observe(item));
    }
}

// ===================================
// Keyboard Navigation
// ===================================
class KeyboardNavigation {
    constructor() {
        this.init();
    }
    
    init() {
        document.addEventListener('keydown', (e) => {
            // Home key - scroll to top
            if (e.key === 'Home') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            
            // End key - scroll to bottom
            if (e.key === 'End') {
                e.preventDefault();
                window.scrollTo({ 
                    top: document.body.scrollHeight, 
                    behavior: 'smooth' 
                });
            }
        });
    }
}

// ===================================
// Initialize Everything
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize controllers
    window.openingGateController = new OpeningGateController();
    window.countdownController = new CountdownController();
    window.musicController = new MusicController();
    window.scrollAnimations = new ScrollAnimations();
    window.backToTopButton = new BackToTopButton();
    window.shareController = new ShareController();
    window.timelineAnimations = new TimelineAnimations();
    window.keyboardNavigation = new KeyboardNavigation();
    
    // Add smooth scroll behavior to all internal links
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
    
    // Handle page visibility for countdown and music
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (window.musicController.isPlaying) {
                window.musicController.pause();
            }
        }
    });
    
    // Log initialization
    console.log('🎉 Wedding invitation initialized successfully!');
    console.log('📅 Main event:', weddingData.mainEvent.date.toLocaleDateString('hi-IN'));
});

// ===================================
// Service Worker Registration (Optional)
// ===================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker for offline support
        // navigator.serviceWorker.register('/sw.js')
        //     .then(reg => console.log('Service Worker registered'))
        //     .catch(err => console.log('Service Worker registration failed'));
    });
}

// ===================================
// Analytics and Performance Monitoring
// ===================================
window.addEventListener('load', () => {
    // Log page load performance
    if (window.performance) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⚡ Page loaded in ${pageLoadTime}ms`);
    }
});

// ===================================
// Handle Orientation Change
// ===================================
window.addEventListener('orientationchange', () => {
    // Refresh scroll animations on orientation change
    setTimeout(() => {
        if (window.scrollAnimations) {
            window.scrollAnimations.observe();
        }
    }, 300);
});

// ===================================
// Export for testing (if needed)
// ===================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        weddingData,
        utils,
        OpeningGateController,
        CountdownController,
        MusicController,
        ScrollAnimations,
        ShareController
    };
}
