window._DEFAULT_SITE_DATA = {
    // Struktur minimal yang dipakai oleh populate functions
    hero: [{
            image: "assets/hero1.jpg",
            title: "Selamat Datang di Sekolah Modern",
            subtitle: "Tempat pendidikan unggulan berwawasan global"
        },
        {
            image: "assets/hero2.jpg",
            title: "Mencetak Generasi Emas",
            subtitle: "Berakhlak mulia dan berprestasi internasional"
        }
    ],
    about: {
        paragraphs: [
            "Sekolah Modern berdiri dengan visi membentuk generasi cerdas dan berkarakter.",
            "Kami menghadirkan sistem pembelajaran terpadu, fasilitas lengkap, dan tenaga pendidik profesional."
        ],
        galleries: ["assets/about.jpg"]
    },
    programs: [{
            id: "p1",
            title: "Program Unggulan 1",
            short: "Deskripsi singkat program 1",
            image: "assets/program1.jpg",
            detail: "Detail program 1"
        },
        {
            id: "p2",
            title: "Program Unggulan 2",
            short: "Deskripsi singkat program 2",
            image: "assets/program2.jpg",
            detail: "Detail program 2"
        }
    ],
    news: [{
            title: "Berita 1",
            date: (new Date()).toISOString(),
            short: "Ringkasan berita 1",
            image: "assets/news1.jpg"
        },
        {
            title: "Berita 2",
            date: (new Date()).toISOString(),
            short: "Ringkasan berita 2",
            image: "assets/news2.jpg"
        }
    ],
    testimonials: [],
    faqs: [],
    siteInfo: {
        tagline: "Sekolah Modern - unggul & berkarakter",
        phone: "0812-3456-7890",
        email: "info@sekolah.id",
        address: "Jl. Pendidikan No.1"
    },
    telegram: {
        botComment: "",
        groupId: ""
    },
    achievements: [],
    units: [],
    galleryItems: []
};


/* ---------------------------
   Utility kecil
----------------------------*/
const safeQuery = (sel, ctx = document) => ctx.querySelector(sel);
const safeQueryAll = (sel, ctx = document) =>
    Array.from((ctx || document).querySelectorAll(sel || []));

/* ---------------------------
   DATA LOADING
----------------------------*/
let siteData = null;

async function loadData() {
    try {
        if (window.location.protocol === 'file:') {
            console.warn('Running locally — skipping fetch and using fallback.');
            siteData = window._DEFAULT_SITE_DATA; // Fallback for local runs
        } else {
            const res = await fetch('package.json', { cache: 'no-cache' });
            if (!res.ok) throw new Error(`Fetch failed (${res.status})`);
            const json = await res.json();
            siteData = json.content || json;
            console.info('✅ Loaded data from package.json');
        }
    } catch (err) {
        console.warn('⚠️ Failed to fetch package.json — using fallback.', err);
        siteData = window._DEFAULT_SITE_DATA;
    } finally {
        siteData = siteData || window._DEFAULT_SITE_DATA;
        initializePage();
}
}

console.log("✅ initializePage() started");


/* ---------------------------
   INITIALIZE PAGE (populate + inits)
----------------------------*/
function initializePage() {
    if (!siteData) siteData = window._DEFAULT_SITE_DATA;

    // === Populate dynamic content ===
    try {
        if (safeQuery('.hero-slider')) populateHero();
        if (safeQuery('#aboutPara1')) populateAbout();
        if (safeQuery('#aboutGallery')) populateAboutGallery();
        if (safeQuery('#programsGrid')) populatePrograms();
        if (safeQuery('#newsSlider')) populateNews();
        if (safeQuery('#testimonialsGrid')) populateTestimonials();
        if (safeQuery('#faqList')) populateFAQ();
        populateFooter();
    } catch (e) {
        console.error('Error when populating content:', e);
    }

    // === Initialize UI components ===
    try {
        if (safeQuery('.hero-slider')) initSliders();
        if (safeQuery('.stats')) initStats();
        if (safeQuery('.faq-question')) initFAQ();
        if (safeQuery('#newsModal')) initNewsModal();
        if (safeQuery('#programModal')) initProgramModal();
    } catch (e) {
        console.warn('Some initializations failed:', e);
    }

    // === Global inits ===
    if (typeof initDropdowns === 'function') initDropdowns();
    if (typeof toggleMobileMenu === 'function') initMobileMenu();
    if (typeof initScrollTop === 'function') initScrollTop();
    if (typeof initSmoothScroll === 'function') initSmoothScroll();
    if (typeof initHeader === 'function') initHeader();
    if (typeof initRouting === 'function') initRouting();
}

/* ---------------------------
   POPULATE FUNCTIONS (keep original logic — slightly guarded)
   (Jika Anda punya implementasi asli, ini akan dipakai; saya hanya pastikan tidak crash)
----------------------------*/
function populateHero() {
    const heroSlider = document.querySelector('.hero-slider');
    const indicators = document.querySelector('.slider-indicators');
    const slides = siteData.hero || [];
    heroSlider.innerHTML = slides.map((s, i) => `
        <div class="hero-slide ${i === 0 ? 'active' : ''}">
            <img src="${s.image || ''}" alt="${s.title || 'Hero Image'}" loading="lazy">
            <div class="hero-overlay"></div>
            <div class="hero-content">
                <h1 class="hero-title">${s.title || ''}</h1>
                <p class="hero-subtitle">${s.subtitle || ''}</p>
            </div>
        </div>
    `).join('');

    indicators.innerHTML = slides.map((_, i) => `
        <button class="slider-indicator ${i === 0 ? 'active' : ''}" data-slide="${i}" aria-label="Go to slide ${i+1}"></button>
    `).join('');
}

function populateAbout() {
    const para1 = document.getElementById('aboutPara1');
    const para2 = document.getElementById('aboutPara2');
    if (para1) para1.textContent = siteData.about?.paragraphs[0] || 'Loading...';
    if (para2) para2.textContent = siteData.about?.paragraphs[1] || 'Loading...';
}

function populateAboutGallery() {
    const galleryContainer = document.getElementById('aboutGallery');
    if (!galleryContainer || !siteData.about?.galleries) return;
    galleryContainer.innerHTML = siteData.about.galleries.map((url, idx) => `
        <img src="${url}" alt="Gallery ${idx+1}" loading="lazy" class="about-gallery-img" data-index="${idx}">
    `).join('');
}

function populatePrograms() {
    const programsGrid = document.getElementById('programsGrid');
    const programs = siteData.programs || [];
    programsGrid.innerHTML = programs.map(p => `
        <div class="program-card" data-program-id="${p.id}">
            <img src="${p.image || 'assets/program1.jpg'}" alt="${p.title || ''}" class="program-image" loading="lazy">
            <div class="program-content">
                <h3 class="program-title">${p.title || ''}</h3>
                <p class="program-description">${p.short || ''}</p>
            </div>
        </div>
    `).join('');
}

function populateNews() {
    const newsSlider = document.getElementById('newsSlider');
    const news = siteData.news || [];
    newsSlider.innerHTML = news.map(n => {
        const date = new Date(n.date);
        return `
            <div class="news-card">
                <img src="${n.image || 'assets/news1.jpg'}" alt="${n.title || ''}" class="news-image" loading="lazy">
                <div class="news-content">
                    <div class="news-date">${date.toLocaleDateString()}</div>
                    <h3 class="news-title">${n.title || ''}</h3>
                    <p class="news-description">${n.short || ''}</p>
                </div>
            </div>
        `;
    }).join('');
}

/* ----------------------------------------
   NEWS MODAL HANDLING
---------------------------------------- */
function initNewsModal() {
    const modal = document.getElementById("newsModal");
    const modalImg = document.getElementById("newsModalImage");
    const modalTitle = document.getElementById("newsModalTitle");
    const modalText = document.getElementById("newsModalText");
    const modalClose = modal.querySelector(".modal-close");
    const overlay = modal.querySelector(".modal-overlay");

    const closeModal = () => modal.classList.remove("active");
    modalClose.addEventListener("click", closeModal);
    overlay.addEventListener("click", closeModal);

    // Tambahkan click listener ke semua news-card
    document.querySelectorAll(".news-card").forEach((card) => {
        card.addEventListener("click", () => {
            const img = card.querySelector(".news-image")?.src || "";
            const title = card.querySelector(".news-title")?.textContent || "";
            const desc = card.querySelector(".news-description")?.textContent || "";
            const date = card.querySelector(".news-date")?.textContent || "";

            modalImg.src = img;
            modalTitle.textContent = title;
            modalText.innerHTML = `<strong>${date}</strong><br><br>${desc}`;
            modal.classList.add("active");
        });
    });
}

function populateTestimonials() {
    const testimonialsGrid = document.getElementById('testimonialsGrid');
    const testimonials = siteData.testimonials || [];
    testimonialsGrid.innerHTML = testimonials.map(t => {
        const date = new Date(t.date);
        return `
            <div class="testimonial-card">
                <div class="testimonial-header">
                    <img src="${t.photo || 'assets/avatar.png'}" alt="${t.name || ''}" class="testimonial-photo">
                    <div class="testimonial-info">
                        <h4>${t.name || ''}</h4>
                        <p class="testimonial-role">${t.role || ''}</p>
                    </div>
                </div>
                <div class="testimonial-rating">
                    ${Array(t.rating || 0).fill('<span class="star">★</span>').join('')}
                </div>
                <p class="testimonial-comment">"${t.comment || ''}"</p>
                <p class="testimonial-date">${date.toLocaleDateString()}</p>
            </div>
        `;
    }).join('');
}

function populateFAQ() {
    const faqList = document.getElementById('faqList');
    const faqs = siteData.faqs || [];
    faqList.innerHTML = faqs.map(faq => `
        <div class="faq-item">
            <button class="faq-question" aria-expanded="false">
                <span>${faq.q || ''}</span>
            </button>
            <div class="faq-answer">
                <div class="faq-answer-content">${faq.a || ''}</div>
            </div>
        </div>
    `).join('');
}

/* ---------------------------
   POPULATE ABOUT DETAIL PAGE
----------------------------*/
function populateAboutDetail() {
    if (!siteData || !siteData.aboutPage) {
        console.warn("⚠️ aboutPage data not found in package.json");
        return;
    }

    const about = siteData.aboutPage;

    // === Visi & Misi ===
    if (safeQuery("#visionText")) {
        safeQuery("#visionText").textContent = about.vision || "Visi belum tersedia.";
    }

    if (safeQuery("#missionList") && Array.isArray(about.mission)) {
        safeQuery("#missionList").innerHTML = about.mission
            .map(m => `<li>${m}</li>`)
            .join("");
    }

    // === Nilai Inti ===
    if (safeQuery("#coreValuesGrid") && Array.isArray(about.coreValues)) {
        safeQuery("#coreValuesGrid").innerHTML = about.coreValues
            .map(
                v => `
        <div class="core-value-card">
          <h4>${v.title}</h4>
          <p>${v.desc}</p>
        </div>
      `
            )
            .join("");
    }

    // === Kurikulum ===
    if (safeQuery("#curriculumText")) {
        safeQuery("#curriculumText").textContent = about.curriculum || "Kurikulum belum tersedia.";
    }

    // === Tim Kami ===
    if (safeQuery("#teamGrid") && Array.isArray(about.team)) {
        safeQuery("#teamGrid").innerHTML = about.team
            .map(
                t => `
        <div class="team-card">
          <img src="${t.photo}" alt="${t.name}" class="team-photo">
          <h4 class="team-name">${t.name}</h4>
          <p class="team-role">${t.role}</p>
        </div>
      `
            )
            .join("");
    }

    // === Profil (opsional jika kamu mau tampilkan di sini juga) ===
    if (safeQuery("#aboutProfile") && about.profile) {
        safeQuery("#aboutProfile").innerHTML = `<p>${about.profile}</p>`;
    }
}



function populateFooter() {
    const footer = siteData.siteInfo || {};
    const footerTagline = document.getElementById('footerTagline');
    const footerPhone = document.getElementById('footerPhone');
    const footerEmail = document.getElementById('footerEmail');
    const footerAddress = document.getElementById('footerAddress');
    if (footerTagline) footerTagline.textContent = footer.tagline || '';
    if (footerPhone) footerPhone.textContent = footer.phone || '';
    if (footerEmail) footerEmail.textContent = footer.email || '';
    if (footerAddress) footerAddress.textContent = footer.address || '';
}

/* ---------------------------
   SLIDER (hero + news) — safer guards
----------------------------*/
function initSliders() {
    const slides = document.querySelectorAll('.hero-slide');
    if (!slides || slides.length === 0) return;

    let currentSlide = 0;
    const indicators = document.querySelectorAll('.slider-indicator');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    const intervalMs = 7000;

    const showSlide = (index) => {
        slides.forEach(s => s.classList.remove('active'));
        if (indicators) indicators.forEach(i => i.classList.remove('active'));
        slides[index] && slides[index].classList.add('active');
        if (indicators && indicators[index]) indicators[index].classList.add('active');
    };

    const nextSlide = () => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    };

    const prevSlide = () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    };

    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    if (indicators && indicators.length) {
        indicators.forEach((ind, idx) => ind.addEventListener('click', () => {
            currentSlide = idx;
            showSlide(idx);
        }));
    }

    // auto rotate
    setInterval(nextSlide, intervalMs);

    // news slider simple buttons (if present)
    const newsSliderEl = document.getElementById('newsSlider');
    const newsPrevBtn = document.querySelector('.news-prev');
    const newsNextBtn = document.querySelector('.news-next');
    if (newsSliderEl && newsPrevBtn && newsNextBtn) {
        let newsOffset = 0;
        newsPrevBtn.addEventListener('click', () => {
            newsOffset = Math.max(0, newsOffset - 300);
            newsSliderEl.style.transform = `translateX(-${newsOffset}px)`;
        });
        newsNextBtn.addEventListener('click', () => {
            const maxOffset = newsSliderEl.scrollWidth - newsSliderEl.clientWidth;
            newsOffset = Math.min(maxOffset, newsOffset + 300);
            newsSliderEl.style.transform = `translateX(-${newsOffset}px)`;
        });
    }
}

/* ---------------------------
   STATS COUNTER (unchanged logic, guarded)
----------------------------*/
function initStats() {
    const stats = document.querySelectorAll('.stat-number');
    if (!stats || stats.length === 0) return;
    let animated = false;

    function animateStats() {
        if (animated) return;
        const statsSection = document.querySelector('.stats');
        if (!statsSection) return;
        const rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            animated = true;
            stats.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target')) || 0;
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        stat.textContent = target;
                        clearInterval(timer);
                    } else {
                        stat.textContent = Math.floor(current);
                    }
                }, 16);
            });
        }
    }
    window.addEventListener('scroll', animateStats);
    animateStats();
}

/* ---------------------------
   FAQ (toggle)
----------------------------*/
function initFAQ() {
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.faq-question');
        if (!btn) return;
        const item = btn.closest('.faq-item');
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(it => {
            it.classList.remove('active');
            const q = it.querySelector('.faq-question');
            if (q) q.setAttribute('aria-expanded', 'false');
        });
        if (!isActive) {
            item.classList.add('active');
            btn.setAttribute('aria-expanded', 'true');
        }
    });
}

/* ---------------------------
   MODAL (programs / gallery)
----------------------------*/
function initModal() {
    const modal = document.getElementById('programModal');
    if (!modal) return;
    const modalOverlay = modal.querySelector('.modal-overlay');
    const modalClose = modal.querySelector('.modal-close');

    const openModal = (programId) => {
        const program = (siteData.programs || []).find(p => p.id === programId);
        if (!program) return;
        const img = document.getElementById('modalImage');
        if (img) {
            img.src = program.image || '';
            img.alt = program.title || '';
        }
        const title = document.getElementById('modalTitle');
        if (title) title.textContent = program.title || '';
        const text = document.getElementById('modalText');
        if (text) text.textContent = program.detail || '';
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    document.addEventListener('click', (e) => {
        const card = e.target.closest('.program-card');
        if (card) {
            const id = card.getAttribute('data-program-id');
            if (id) openModal(id);
        }
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
}


/* ---------------------------
   SCROLL TOP BUTTON
----------------------------*/
function initScrollTop() {
    const scrollTopBtn = document.getElementById('scrollTop');
    if (!scrollTopBtn) return;
    window.addEventListener('scroll', () => {
        scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
    });
    scrollTopBtn.addEventListener('click', () => window.scrollTo({
        top: 0,
        behavior: 'smooth'
    }));
}

/* ---------------------------
   SMOOTH ANCHOR SCROLL (non-SPA links)
----------------------------*/
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            // If anchor is navigation link handled by routing, do not perform native smooth scroll here
            if (this.classList.contains('nav-link')) {
                // routing handles scrolling
                return;
            }
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const header = document.querySelector('.header');
                const offset = (header ? header.offsetHeight : 0);
                const top = target.getBoundingClientRect().top + window.scrollY - offset - 8;
                window.scrollTo({
                    top,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ---------------------------
   HEADER SCROLL EFFECT
----------------------------*/
function initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 100) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });
}

/* ---------------------------
   PAGE-SPECIFIC INITS (kept original names)
----------------------------*/
/* keep your original initAboutPage, initAchievementsPage, etc.
   (If present earlier in your script, they'll be used; else placeholders are here)
*/
function initAboutPage() {
    // original implementation expected to be present in your file.
    // If you had a full implementation earlier, it will run because we didn't remove it.
    if (typeof window.initAboutPageOriginal === 'function') {
        window.initAboutPageOriginal();
        return;
    }
    // minimal fallback behavior (populates some about placeholders)
    if (!siteData) return;
    if (document.getElementById('aboutProfile')) {
        document.getElementById('aboutProfile').innerHTML = (siteData.about?.paragraphs || []).map(p => `<p class="about-paragraph">${p}</p>`).join('');
    }
}

function initAchievementsPage() {
    if (typeof window.initAchievementsPageOriginal === 'function') {
        window.initAchievementsPageOriginal();
        return;
    }
    const grid = document.getElementById('achievementsGrid');
    if (!grid) return;
    grid.innerHTML = (siteData.achievements || []).map(a => `
    <div class="achievement-card">
      <img src="${a.image || 'assets/achievement.jpg'}" alt="${a.title || ''}" />
      <div class="achievement-content">
        <span class="achievement-category">${a.category || ''}</span>
        <h3 class="achievement-title">${a.title || ''}</h3>
      </div>
    </div>
  `).join('');
}

function initUnitsPage() {
    if (typeof window.initUnitsPageOriginal === 'function') {
        window.initUnitsPageOriginal();
        return;
    }
    const container = document.getElementById('unitsContainer');
    if (!container) return;
    container.innerHTML = (siteData.units || []).map(u => `
    <div class="unit-section">
      <div class="unit-header"><h2>${u.name}</h2><p>${u.desc}</p></div>
    </div>
  `).join('');
}

function initGalleryPage() {
    if (typeof window.initGalleryPageOriginal === 'function') {
        window.initGalleryPageOriginal();
        return;
    }
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;
    grid.innerHTML = (siteData.galleryItems || []).map(i => `
    <div class="gallery-item"><img src="${i.image}" alt="${i.title}" /></div>
  `).join('');
}

function initRegistrationForm() {
    if (typeof window.initRegistrationFormOriginal === 'function') {
        window.initRegistrationFormOriginal();
        return;
    }
    const form = document.getElementById('registrationForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // minimal feedback
        const msg = document.getElementById('formMessage');
        if (msg) {
            msg.textContent = 'Terima kasih, pendaftaran diterima (demo).';
            msg.className = 'form-message success';
        }
        form.reset();
    });
}

/* =========================================================
   NAVIGATION MODULE (global)
   - Single implementation available globally
   - Exposes: initDropdowns, initMobileMenu, initRouting, toggleMobileMenu,
             closeAllDropdowns, showSection, setActiveNav
   ========================================================= */
(function globalNavigationModule() {
    let overlayEl = null;

    function ensureOverlay() {
        if (!overlayEl) {
            overlayEl = document.querySelector('.nav-overlay');
            if (!overlayEl) {
                overlayEl = document.createElement('div');
                overlayEl.className = 'nav-overlay';
                document.body.appendChild(overlayEl);
            }
        }
        return overlayEl;
    }

    /* DROPDOWN (FAQ-style) */
    function initDropdowns() {
        const toggles = document.querySelectorAll('.dropdown-toggle');
        toggles.forEach(toggle => {
            const menu = toggle.nextElementSibling;
            if (!menu) return;

            const handleToggle = (e) => {
                e.preventDefault();
                e.stopPropagation();
                document.querySelectorAll('.dropdown-menu.active').forEach(m => {
                    if (m !== menu) m.classList.remove('active');
                });
                menu.classList.toggle('active');
                toggle.classList.toggle('active', menu.classList.contains('active'));
            };

            toggle.addEventListener('click', handleToggle);
            toggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleToggle(e);
                }
            });
        });

        // close dropdowns when clicking outside nav but keep nav open
        document.addEventListener('click', (e) => {
            const insideNav = e.target.closest('#mainNav');
            const insideBtn = e.target.closest('#mobileMenuBtn');
            if (!insideNav && !insideBtn) {
                document.querySelectorAll('.dropdown-menu.active').forEach(m => m.classList.remove('active'));
                document.querySelectorAll('.dropdown-toggle.active').forEach(t => t.classList.remove('active'));
            }
        });
    }

    /* MOBILE MENU: expose both initMobileMenu (initializer) and toggleMobileMenu (action) */
    function toggleMobileMenu(force) {
        const nav = document.getElementById('mainNav');
        const mobileBtn = document.getElementById('mobileMenuBtn');
        const body = document.body;
        if (!nav || !mobileBtn) return;
        const isActive = (typeof force === 'boolean') ? force : !nav.classList.contains('active');
        nav.classList.toggle('active', isActive);
        mobileBtn.classList.toggle('active', isActive);
        const ov = ensureOverlay();
        ov.classList.toggle('active', isActive);
        body.classList.toggle('menu-open', isActive);
        if (!isActive) closeAllDropdowns();
    }

function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navOverlay = document.querySelector('.nav-overlay');
    const nav = document.querySelector('.nav');
    if (!mobileMenuBtn || !nav) return;

    mobileMenuBtn.addEventListener('click', () => {
        nav.classList.toggle('active');
        navOverlay.classList.toggle('active');
    });

    document.addEventListener('DOMContentLoaded', loadData);

        overlay.addEventListener('click', () => toggleMobileMenu(false));

        document.addEventListener('click', (e) => {
            const insideNav = e.target.closest('#mainNav');
            const insideBtn = e.target.closest('#mobileMenuBtn');
            if (!insideNav && !insideBtn && nav.classList.contains('active')) {
                toggleMobileMenu(false);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('active')) toggleMobileMenu(false);
        });

        // on resize ensure mobile menu closed when switching to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1024 && nav.classList.contains('active')) toggleMobileMenu(false);
        });
    }

    function closeAllDropdowns() {
        document.querySelectorAll('.dropdown-menu.active').forEach(m => m.classList.remove('active'));
        document.querySelectorAll('.dropdown-toggle.active').forEach(t => t.classList.remove('active'));
    }

    /* ROUTING: nav-link & dropdown-link */
    function initRouting() {
        const links = document.querySelectorAll('.nav-link, .dropdown-link');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = (link.getAttribute('href') || '').trim();
                const isHash = href.startsWith('#');
                const isExternal = /^https?:\/\//i.test(href) || href.match(/\.html\b/i);

                if (isHash) {
                    e.preventDefault();
                    showSection(href);
                    history.pushState({ section: href }, '', href);
                    setActiveNav(href);
                    if (window.innerWidth <= 1024) toggleMobileMenu(false);
                } else if (isExternal) {
                    if (window.innerWidth <= 1024) toggleMobileMenu(false);
                    // allow default navigation
                } else {
                    if (window.innerWidth <= 1024) toggleMobileMenu(false);
                }
            });
        });

        window.addEventListener('popstate', () => {
            const hash = location.hash || '#home';
            showSection(hash);
            setActiveNav(hash);
        });
    }

    /* SPA show section */
    function showSection(selector) {
        let sel = selector || '#home';
        if (!sel.startsWith('#')) sel = `#${sel}`;
        const secs = document.querySelectorAll('main section');
        secs.forEach(s => {
            s.classList.remove('section-visible');
            s.classList.add('section-hidden');
        });

        const target = document.querySelector(sel) || document.querySelector('#home');
        if (target) {
            target.classList.remove('section-hidden');
            target.classList.add('section-visible');
            const header = document.querySelector('.header');
            const offset = header ? header.offsetHeight : 0;
            window.scrollTo({
                top: Math.max(target.offsetTop - offset - 8, 0),
                behavior: 'smooth'
            });
        }
    }

    function setActiveNav(hash) {
        const normalized = (hash || '').toString();
        document.querySelectorAll('.nav-link').forEach(a => {
            const href = a.getAttribute('href') || '';
            a.classList.toggle('active', href === normalized);
        });

        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            const childActive = Array.from(menu.querySelectorAll('.dropdown-link'))
                .some(link => (link.getAttribute('href') || '') === normalized);
            menu.classList.toggle('active', childActive);
            const parentToggle = menu.parentElement && menu.parentElement.querySelector('.dropdown-toggle');
            if (parentToggle) parentToggle.classList.toggle('active', childActive);
        });
    }

    // expose
    window.initDropdowns = initDropdowns;
    window.initMobileMenu = initMobileMenu;
    window.initRouting = initRouting;
    window.toggleMobileMenu = toggleMobileMenu;
    window.closeAllDropdowns = closeAllDropdowns;
    window.showSection = showSection;
    window.setActiveNav = setActiveNav;
})();



/* ---------------------------
   IntersectionObserver: [data-animate] elements
----------------------------*/
function init_scroll_animations() {
    const els = document.querySelectorAll('[data-animate]');
    if (!els || !els.length) return;
    const io = new IntersectionObserver(entries => {
        entries.forEach(en => {
            if (en.isIntersecting) en.target.classList.add('visible');
        });
    }, {
        threshold: 0.15
    });
    els.forEach(e => io.observe(e));
}

/* ---------------------------
   Detect and expose original page-specific functions if present
   (If your older script defined full implementations earlier, preserve them)
----------------------------*/
(function preserveOriginals() {
    // If there were full implementations defined earlier in the environment
    if (typeof initAboutPage === 'function') window.initAboutPageOriginal = initAboutPage;
    if (typeof initAchievementsPage === 'function') window.initAchievementsPageOriginal = initAchievementsPage;
    if (typeof initUnitsPage === 'function') window.initUnitsPageOriginal = initUnitsPage;
    if (typeof initGalleryPage === 'function') window.initGalleryPageOriginal = initGalleryPage;
    if (typeof initRegistrationForm === 'function') window.initRegistrationFormOriginal = initRegistrationForm;
})();

// === GALERI CLICK HANDLING (guarded) ===
safeQueryAll('.gallery-item img').forEach((img) => {
    img.addEventListener('click', (e) => {
        const altText = (img.alt || "").trim();
        if (altText === "Galeri 1") {
            window.open("https://www.youtube.com/watch?v=YOUR_VIDEO_ID", "_blank");
        } else {
            // buka gambar penuh (fungsi modal default)
            if (typeof openImageFullscreen === 'function') {
                openImageFullscreen(img.src, altText);
            } else {
                // fallback: buka di tab baru
                window.open(img.src, '_blank');
            }
        }
    });
});
