// Header Scroll Effect
const header = document.querySelector('#header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Active Menu Scroll Spy
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function scrollSpy() {
    const scrollY = window.pageYOffset;
    const headerHeight = header.offsetHeight;
    
    // Default to highlighting home at the top of page
    if (scrollY <= 50) {
        navLinks.forEach(a => {
            if (a.getAttribute('href') === '#home') {
                a.classList.add('active');
            } else {
                a.classList.remove('active');
            }
        });
        return;
    }
    
    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - headerHeight - 120; // 120px threshold for early activation
        const sectionId = current.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(a => {
                if (a.getAttribute('href') === `#${sectionId}`) {
                    a.classList.add('active');
                } else {
                    a.classList.remove('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', scrollSpy);
document.addEventListener('DOMContentLoaded', scrollSpy);

// Mobile Menu Toggle
const menuToggle = document.getElementById('mobile-menu-btn');
const navLinksContainer = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
}

// Close mobile menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinksContainer.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// Smooth Scroll for Nav Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for Reveal Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
});

// Mobile Menu Styles (Injected via JS for simplicity, or could be in CSS)
const style = document.createElement('style');
style.textContent = `
    @media (max-width: 1023px) {
        .nav-links {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: rgba(10, 10, 11, 0.98);
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 2rem;
            z-index: 1000;
        }
        .nav-links.active {
            display: flex;
        }
        .menu-toggle.active span:nth-child(1) { transform: rotate(45deg) translate(5px, 6px); }
        .menu-toggle.active span:nth-child(2) { opacity: 0; }
        .menu-toggle.active span:nth-child(3) { transform: rotate(-45deg) translate(5px, -6px); }
    }
`;
document.head.appendChild(style);

// --- Custom Lightbox Logic ---
document.addEventListener("DOMContentLoaded", () => {
    // Create and append lightbox element to body if not exists
    let lightbox = document.getElementById('custom-lightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'custom-lightbox';
        lightbox.className = 'custom-lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close" id="lightbox-close">&times;</button>
                <button class="lightbox-btn lightbox-prev" id="lightbox-prev"><i class="fa-solid fa-chevron-left"></i></button>
                <img src="" alt="Lightbox Image" id="lightbox-img">
                <button class="lightbox-btn lightbox-next" id="lightbox-next"><i class="fa-solid fa-chevron-right"></i></button>
                <div class="lightbox-caption" id="lightbox-caption"></div>
            </div>
        `;
        document.body.appendChild(lightbox);
    }

    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');

    let currentGroup = [];
    let currentIndex = 0;

    function openLightbox(group, index) {
        currentGroup = group;
        currentIndex = index;
        updateLightboxContent();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // prevent page scroll
    }

    function updateLightboxContent() {
        if (!currentGroup.length) return;
        const item = currentGroup[currentIndex];
        lightboxImg.src = item.src;
        lightboxCaption.textContent = item.caption || '';
        
        // Hide prev/next buttons if only 1 image in group
        if (currentGroup.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'grid';
            nextBtn.style.display = 'grid';
        }
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showNext() {
        if (!currentGroup.length) return;
        currentIndex = (currentIndex + 1) % currentGroup.length;
        updateLightboxContent();
    }

    function showPrev() {
        if (!currentGroup.length) return;
        currentIndex = (currentIndex - 1 + currentGroup.length) % currentGroup.length;
        updateLightboxContent();
    }

    // Set up click handlers on triggers
    document.body.addEventListener('click', (e) => {
        const trigger = e.target.closest('.lightbox-trigger');
        if (!trigger) return;

        e.preventDefault();
        
        // Find all trigger elements in the same group (defined by data-lightbox-group attribute)
        const groupName = trigger.getAttribute('data-lightbox-group');
        const allTriggers = Array.from(document.querySelectorAll(`.lightbox-trigger[data-lightbox-group="${groupName}"]`));
        
        const groupItems = allTriggers.map(el => ({
            src: el.getAttribute('href') || el.getAttribute('src'),
            caption: el.getAttribute('data-lightbox-caption') || el.getAttribute('alt') || ''
        }));

        const activeIndex = allTriggers.indexOf(trigger);
        if (activeIndex !== -1) {
            openLightbox(groupItems, activeIndex);
        }
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', showPrev);
    if (nextBtn) nextBtn.addEventListener('click', showNext);

    // Close on clicking backdrop
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });
});
