window._DEFAULT_SITE_DATA = {
  // Struktur minimal yang dipakai oleh populate functions
  hero: [
    { image: "assets/hero1.jpg", title: "Selamat Datang di Sekolah Modern", subtitle: "Tempat pendidikan unggulan berwawasan global" },
    { image: "assets/hero2.jpg", title: "Mencetak Generasi Emas", subtitle: "Berakhlak mulia dan berprestasi internasional" }
  ],
  about: {
    paragraphs: [
      "Sekolah Modern berdiri dengan visi membentuk generasi cerdas dan berkarakter.",
      "Kami menghadirkan sistem pembelajaran terpadu, fasilitas lengkap, dan tenaga pendidik profesional."
    ],
    galleries: ["assets/about.jpg"]
  },
  programs: [
    { id: "p1", title: "Program Unggulan 1", short: "Deskripsi singkat program 1", image: "assets/program1.jpg", detail: "Detail program 1" },
    { id: "p2", title: "Program Unggulan 2", short: "Deskripsi singkat program 2", image: "assets/program2.jpg", detail: "Detail program 2" }
  ],
  news: [
    { title: "Berita 1", date: (new Date()).toISOString(), short: "Ringkasan berita 1", image: "assets/news1.jpg" },
    { title: "Berita 2", date: (new Date()).toISOString(), short: "Ringkasan berita 2", image: "assets/news2.jpg" }
  ],
  testimonials: [],
  faqs: [],
  siteInfo: {
    tagline: "Sekolah Modern - unggul & berkarakter",
    phone: "0812-3456-7890",
    email: "info@sekolah.id",
    address: "Jl. Pendidikan No.1"
  },
  telegram: { botComment: "", groupId: "" },
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
      console.warn('Running locally — skip fetch and use fallback.');
      siteData = window._DEFAULT_SITE_DATA; // fallback lokal
    } else {
      const res = await fetch('package.json', { cache: 'no-cache' });
      if (!res.ok) throw new Error(`Fetch failed (${res.status})`);
      const json = await res.json();
      siteData = json.content ? json.content : json;
      console.info('✅ Loaded data from package.json');
    }
  } catch (err) {
    console.warn('⚠️ package.json fetch failed — using fallback.', err);
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
    if (safeQuery('#aboutGallery')) populateAboutGallery(); // tambahan
    if (safeQuery('#programsGrid')) populatePrograms();
    if (safeQuery('#newsSlider')) populateNews();
    if (safeQuery('#testimonialsGrid')) populateTestimonials();
    if (safeQuery('#faqList')) populateFAQ();
    if (safeQuery('.about-detail')) populateAboutDetail();
    populateFooter();
  } catch (e) {
    console.error('Error when populating content (non-fatal):', e);
  }

  // === Initialize UI components ===
  try {
    if (safeQuery('.hero-slider')) initSliders();
    if (safeQuery('.stats')) initStats();
    if (safeQuery('.faq-question')) initFAQ();
    if (safeQuery('#programModal')) initModal();
    if (safeQuery('#newsModal')) initNewsModal();
  } catch (e) {
    console.warn('Some inits failed:', e);
  }

  // === Global inits ===
  initDropdowns();
  initMobileMenu();
  initScrollTop();
  initSmoothScroll();
  initHeader();
  initRouting();
}

/* ---------------------------
   DROPDOWN BEHAVIOR (mobile + desktop)
----------------------------*/
function initDropdowns() {
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      const menu = toggle.nextElementSibling;
      const isMobile = window.innerWidth <= 1024;

      if (isMobile) {
        e.preventDefault();

        // Tutup dropdown lain agar hanya satu terbuka
        document.querySelectorAll('.dropdown-menu.active').forEach(m => {
          if (m !== menu) m.classList.remove('active');
        });

        // Toggle dropdown ini
        menu.classList.toggle('active');
      } else {
        // Untuk desktop, biarkan CSS hover yang mengatur
        menu.classList.remove('active');
      }
    });
  });

  // === Klik link dalam dropdown ===
  document.querySelectorAll('.dropdown-link[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('href');
      if (target) {
        showSection(target);
        history.pushState({ section: target }, '', target);
        setActiveNav(target);
        closeMobileMenu();
      }
    });
  });
}

/* ---------------------------
   MOBILE MENU TOGGLE & OVERLAY
----------------------------*/
function initMobileMenu() {
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const nav = document.getElementById('mainNav');
  const body = document.body;

  if (!mobileBtn || !nav) return;

  // === Buat overlay (jika belum ada) ===
  let overlay = document.querySelector('.nav-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);
  }

  // === Tombol toggle menu ===
  mobileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isActive = nav.classList.toggle('active');
    mobileBtn.classList.toggle('active', isActive);
    body.classList.toggle('menu-open', isActive);
    overlay.classList.toggle('active', isActive);

    // Tutup semua dropdown saat menutup menu
    if (!isActive) {
      document.querySelectorAll('.dropdown-menu.active').forEach(m => m.classList.remove('active'));
    }
  });

  // === Klik overlay menutup menu ===
  overlay.addEventListener('click', closeMobileMenu);

  // === Klik link di menu menutup menu (mobile only) ===
  document.querySelectorAll('.nav-link, .dropdown-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 1024) closeMobileMenu();
    });
  });

  // === Klik di luar nav menutup menu (untuk keamanan tambahan) ===
  document.addEventListener('click', (e) => {
    const insideNav = e.target.closest('#mainNav');
    const insideBtn = e.target.closest('#mobileMenuBtn');
    if (!insideNav && !insideBtn && nav.classList.contains('active')) {
      closeMobileMenu();
    }
  });
}

/* ---------------------------
   CLOSE MOBILE MENU (universal)
----------------------------*/
function closeMobileMenu() {
  const nav = document.getElementById('mainNav');
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const overlay = document.querySelector('.nav-overlay');
  const body = document.body;

  if (nav) nav.classList.remove('active');
  if (mobileBtn) mobileBtn.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
  body.classList.remove('menu-open');

  // Tutup semua dropdown aktif
  document.querySelectorAll('.dropdown-menu.active').forEach(m => m.classList.remove('active'));
}






/* ============================
   HERO SECTION FUNCTIONS
   ============================ */

let heroInterval;
let currentHeroIndex = 0;
let isAnimating = false;

// Fungsi utama untuk mengisi konten Hero
function populateHero() {
  const heroSlider = document.querySelector('.hero-slider');
  const indicatorsContainer = document.querySelector('.slider-indicators');
  
  if (!heroSlider) return;

  // Ambil data slide atau gunakan fallback jika kosong
  const slides = Array.isArray(window.siteData?.hero) && window.siteData.hero.length > 0 
    ? window.siteData.hero 
    : [{
        image: window.siteData?.about?.galleries?.[0] || 'assets/hero-fallback.jpg',
        title: window.siteData?.siteInfo?.tagline || 'Selamat Datang',
        subtitle: window.siteData?.siteInfo?.description || ''
      }];

  // Render Slides
  heroSlider.innerHTML = slides.map((s, i) => `
    <div class="hero-slide ${i === 0 ? 'active' : ''}" data-index="${i}">
      <img src="${s.image || ''}" alt="${s.title || 'Hero Slide'}" loading="lazy">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">${s.title || ''}</h1>
        <p class="hero-subtitle">${s.subtitle || ''}</p>
      </div>
    </div>
  `).join('');

  // Render Indicators
  if (indicatorsContainer) {
    indicatorsContainer.innerHTML = slides.map((_, i) => `
      <button class="slider-indicator ${i === 0 ? 'active' : ''}" 
              data-slide="${i}" 
              aria-label="Lihat slide ke ${i + 1}"></button>
    `).join('');
  }

  // Inisialisasi slider jika lebih dari 1 slide
  if (slides.length > 1) {
    initHeroSlider(slides.length);
  }
}

// Fungsi untuk menangani logika animasi slider
function initHeroSlider(totalSlides) {
  // Bersihkan interval lama jika ada (untuk mencegah duplikasi saat re-render)
  if (heroInterval) clearInterval(heroInterval);

  const slides = document.querySelectorAll('.hero-slide');
  const indicators = document.querySelectorAll('.slider-indicator');

  function goToSlide(nextIndex, direction = 'next') {
    if (isAnimating || nextIndex === currentHeroIndex) return;
    isAnimating = true;

    const currentSlide = slides[currentHeroIndex];
    const nextSlide = slides[nextIndex];

    // Tentukan kelas animasi berdasarkan arah
    // Jika 'next', slide saat ini geser ke kiri (exit-left), slide baru masuk dari kanan
    // Jika 'prev', slide saat ini geser ke kanan (exit-right), slide baru masuk dari kiri
    let exitClass, enterClass;
    if (direction === 'next') {
      exitClass = 'exit-left';
      enterClass = 'enter-right';
    } else {
      exitClass = 'exit-right';
      enterClass = 'enter-left';
    }

    // 1. Persiapkan slide berikutnya (posisikan di luar layar sebelum animasi mulai)
    nextSlide.classList.add(enterClass);
    // Force reflow agar browser menyadari posisi awal sebelum transisi
    void nextSlide.offsetWidth; 

    // 2. Mulai animasi
    currentSlide.classList.add(exitClass);
    currentSlide.classList.remove('active');
    
    nextSlide.classList.add('active');
    nextSlide.classList.remove(enterClass);

    // 3. Update indicators
    if (indicators.length > 0) {
      indicators[currentHeroIndex]?.classList.remove('active');
      indicators[nextIndex]?.classList.remove('active'); // Safety
      indicators[nextIndex]?.classList.add('active');
    }

    // 4. Cleanup kelas setelah animasi selesai
    setTimeout(() => {
      currentSlide.classList.remove(exitClass);
      currentSlide.classList.remove('enter-left', 'enter-right'); // Bersihkan sisa kelas lain
      isAnimating = false;
      currentHeroIndex = nextIndex;
    }, 800); // Sesuaikan dengan durasi transition CSS (0.8s)
  }

  function nextSlide() {
    let nextIndex = (currentHeroIndex + 1) % totalSlides;
    goToSlide(nextIndex, 'next');
  }

  function prevSlide() {
    let prevIndex = (currentHeroIndex - 1 + totalSlides) % totalSlides;
    goToSlide(prevIndex, 'prev');
  }

  // Event Listeners untuk tombol navigasi (jika ada di HTML)
  document.querySelector('.slider-next')?.addEventListener('click', () => {
    nextSlide();
    resetInterval();
  });

  document.querySelector('.slider-prev')?.addEventListener('click', () => {
    prevSlide();
    resetInterval();
  });

  // Event Listeners untuk indicators
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      if (index === currentHeroIndex) return;
      const direction = index > currentHeroIndex ? 'next' : 'prev';
      goToSlide(index, direction);
      resetInterval();
    });
  });

  // Auto slide
  function startInterval() {
    heroInterval = setInterval(nextSlide, 6000); // Ganti slide setiap 6 detik
  }

  function resetInterval() {
    clearInterval(heroInterval);
    startInterval();
  }

  startInterval();
}

// Panggil fungsi populate saat file dimuat (atau panggil manual dari main.js Anda)
// document.addEventListener('DOMContentLoaded', populateHero);


function populateAbout() {
  const para1 = document.getElementById('aboutPara1');
  const para2 = document.getElementById('aboutPara2');
  if (!para1 && !para2) return;
  const paragraphs = siteData.about?.paragraphs || [];
  if (para1) para1.textContent = paragraphs[0] || '';
  if (para2) para2.textContent = paragraphs[1] || '';
  const gallerySlider = document.querySelector('.gallery-slider');
  if (gallerySlider && Array.isArray(siteData.about?.galleries) && siteData.about.galleries.length) {
    gallerySlider.innerHTML = `<img src="${siteData.about.galleries[0]}" alt="Galeri 1" loading="lazy">`;
    // rotate images if more than 1
    if (siteData.about.galleries.length > 1) {
      let idx = 0;
      setInterval(() => {
        idx = (idx + 1) % siteData.about.galleries.length;
        const img = gallerySlider.querySelector('img');
        if (!img) return;
        img.style.opacity = '0';
        setTimeout(() => {
          img.src = siteData.about.galleries[idx];
          img.style.opacity = '1';
        }, 300);
      }, 5000);
    }
  }
}

function populateAboutGallery() {
  const galleryContainer = document.getElementById("aboutGallery");
  if (!galleryContainer || !siteData.galleries) return;

  galleryContainer.innerHTML = siteData.galleries
    .map((url, index) => `
      <img src="${url}" 
           alt="Galeri ${index + 1}" 
           loading="lazy"
           class="about-gallery-img"
           data-index="${index}">
    `)
    .join("");

  // Event klik tiap gambar
  galleryContainer.querySelectorAll(".about-gallery-img").forEach((img, idx) => {
    img.addEventListener("click", () => {
      if (idx === 0) {
        // jika Galeri 1 → buka YouTube
        window.open("https://www.youtube.com/watch?v=YOUR_VIDEO_ID", "_blank");
      } else {
        // selainnya → buka fullscreen seperti biasa
        openImageFullscreen(siteData.galleries[idx], `Galeri ${idx + 1}`);
      }
    });
  });
}


function populatePrograms() {
  const programsGrid = document.getElementById('programsGrid');
  if (!programsGrid) return;
  const programs = Array.isArray(siteData.programs) ? siteData.programs : [];
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
  if (!newsSlider) return;
  const news = Array.isArray(siteData.news) ? siteData.news : [];
  const show = news.slice(0, 3);
  newsSlider.innerHTML = show.map(n => {
    const date = n.date ? new Date(n.date) : new Date();
    const formatted = date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    return `
      <div class="news-card">
        <img src="${n.image || 'assets/news1.jpg'}" alt="${n.title || ''}" class="news-image" loading="lazy">
        <div class="news-content">
          <div class="news-date">${formatted}</div>
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
  if (!testimonialsGrid) return;
  const arr = Array.isArray(siteData.testimonials) ? siteData.testimonials : [];
  testimonialsGrid.innerHTML = arr.map(t => {
    const date = t.date ? new Date(t.date) : new Date();
    const formatted = date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
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
          ${Array(Math.max(0, t.rating || 0)).fill('<span class="star">★</span>').join('')}
        </div>
        <p class="testimonial-comment">"${t.comment || ''}"</p>
        <p class="testimonial-date">${formatted}</p>
      </div>
    `;
  }).join('');
}

function populateFAQ() {
  const faqList = document.getElementById('faqList');
  if (!faqList) return;
  const faqs = Array.isArray(siteData.faqs) ? siteData.faqs : [];
  faqList.innerHTML = faqs.map((faq, i) => `
    <div class="faq-item">
      <button class="faq-question" aria-expanded="false">
        <span>${faq.q || ''}</span>
        <svg class="icon faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
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
  const footerTagline = document.getElementById('footerTagline');
  const footerPhone = document.getElementById('footerPhone');
  const footerEmail = document.getElementById('footerEmail');
  const footerAddress = document.getElementById('footerAddress');
  if (footerTagline) footerTagline.textContent = siteData.siteInfo?.tagline || '';
  if (footerPhone) footerPhone.textContent = siteData.siteInfo?.phone || '';
  if (footerEmail) footerEmail.textContent = siteData.siteInfo?.email || '';
  if (footerAddress) footerAddress.textContent = siteData.siteInfo?.address || '';
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
    if (img) { img.src = program.image || ''; img.alt = program.title || ''; }
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
  scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
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
        window.scrollTo({ top, behavior: 'smooth' });
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
    if (msg) { msg.textContent = 'Terima kasih, pendaftaran diterima (demo).'; msg.className = 'form-message success'; }
    form.reset();
  });
}

/* ---------------------------
   ROUTING / SPA: show only selected section
----------------------------*/
function initRouting() {
  // intercept nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href') || '';
      // only process internal hash or same-page links
      if (href.startsWith('#')) {
        e.preventDefault();
        const id = href;
        showSection(id);
        history.pushState({ section: id }, '', id);
        setActiveNav(id);
      } else {
        // allow external or file links to behave normally
      }
    });
  });

  // handle back/forward
  window.addEventListener('popstate', (e) => {
    const state = e.state;
    const hash = location.hash || (state && state.section) || '#home';
    showSection(hash);
    setActiveNav(hash);
  });

  // initial show
  const initialHash = location.hash || '#home';
  setTimeout(() => {
    showSection(initialHash);
    setActiveNav(initialHash);
  }, 120);
}

function showSection(hashOrSelector) {
  // Accept either '#id' or 'id' or element
  let selector = hashOrSelector;
  if (!selector) selector = '#home';
  if (!selector.startsWith('#') && typeof selector === 'string') selector = '#' + selector;

  const sections = document.querySelectorAll('main section');
  sections.forEach(s => {
    // hide all
    s.classList.remove('section-visible');
    s.classList.add('section-hidden');
  });

  const target = document.querySelector(selector);
  if (!target) {
    // fallback: show home
    const home = document.querySelector('#home');
    if (home) {
      home.classList.remove('section-hidden');
      home.classList.add('section-visible');
    }
    return;
  }

  // show target
  target.classList.remove('section-hidden');
  target.classList.add('section-visible');

  // scroll to top of page (header sticky accounted)
  const header = document.querySelector('.header');
  const offset = header ? header.offsetHeight : 0;
  window.scrollTo({ top: Math.max(target.offsetTop - offset - 8, 0), behavior: 'smooth' });
}

/* helper: update active class on nav */
function setActiveNav(hash) {
  const normalized = (hash || '').toString();
  document.querySelectorAll('.nav-link').forEach(a => {
    const href = a.getAttribute('href') || '';
    a.classList.toggle('active', href === normalized);
  });
}

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
  }, { threshold: 0.15 });
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

/* ---------------------------
   Start
----------------------------*/
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  init_scroll_animations();
});
// === GALERI CLICK HANDLING ===
document.querySelectorAll('.gallery-item img').forEach((img) => {
  img.addEventListener('click', (e) => {
    const altText = img.alt?.trim() || "";
    if (altText === "Galeri 1") {
      window.open("https://www.youtube.com/watch?v=YOUR_VIDEO_ID", "_blank");
    } else {
      // buka gambar penuh (fungsi modal default)
      openImageFullscreen(img.src, altText);
    }
  });
});
