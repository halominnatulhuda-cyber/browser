let siteData = null;

async function loadData() {
    try {
        const response = await fetch('package.json');
        const data = await response.json();
        siteData = data.content;
        initializePage();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

function initializePage() {
    if (!siteData) return;

    if (document.querySelector('.hero-slider')) populateHero();
    if (document.getElementById('aboutPara1')) populateAbout();
    if (document.getElementById('programsGrid')) populatePrograms();
    if (document.getElementById('newsSlider')) populateNews();
    if (document.getElementById('testimonialsGrid')) populateTestimonials();
    if (document.getElementById('faqList')) populateFAQ();
    populateFooter();
    if (document.querySelector('.hero-slider')) initSliders();
    if (document.querySelector('.stats')) initStats();
    if (document.querySelector('.faq-question')) initFAQ();
    if (document.getElementById('programModal')) initModal();
    initMobileMenu();
    initScrollTop();
    initSmoothScroll();
    initHeader();
    
    if (document.getElementById('currentYear')) {
        document.getElementById('currentYear').textContent = new Date().getFullYear();
    }
    
    initCurrentPage();
}

function populateHero() {
    const heroSlider = document.querySelector('.hero-slider');
    const indicators = document.querySelector('.slider-indicators');
    if (!heroSlider || !indicators) return;
    
    heroSlider.innerHTML = siteData.hero.map((slide, index) => `
        <div class="hero-slide ${index === 0 ? 'active' : ''}">
            <img src="${slide.image}" alt="Slide ${index + 1}" loading="lazy">
            <div class="hero-overlay"></div>
            <div class="hero-content">
                <h1 class="hero-title">${slide.title}</h1>
                <p class="hero-subtitle">${slide.subtitle}</p>
            </div>
        </div>
    `).join('');

    indicators.innerHTML = siteData.hero.map((_, index) => `
        <button class="slider-indicator ${index === 0 ? 'active' : ''}" data-slide="${index}" aria-label="Go to slide ${index + 1}"></button>
    `).join('');
}

function populateAbout() {
    const para1 = document.getElementById('aboutPara1');
    const para2 = document.getElementById('aboutPara2');
    if (!para1 || !para2) return;
    
    para1.textContent = siteData.about.paragraphs[0];
    para2.textContent = siteData.about.paragraphs[1];
    
    const gallerySlider = document.querySelector('.gallery-slider');
    if (!gallerySlider) return;
    gallerySlider.innerHTML = `<img src="${siteData.about.galleries[0]}" alt="Galeri 1" loading="lazy">`;
    
    let currentGalleryIndex = 0;
    setInterval(() => {
        currentGalleryIndex = (currentGalleryIndex + 1) % siteData.about.galleries.length;
        const img = gallerySlider.querySelector('img');
        img.style.opacity = '0';
        setTimeout(() => {
            img.src = siteData.about.galleries[currentGalleryIndex];
            img.style.opacity = '1';
        }, 300);
    }, 5000);
}

function populatePrograms() {
    const programsGrid = document.getElementById('programsGrid');
    if (!programsGrid) return;
    programsGrid.innerHTML = siteData.programs.map(program => `
        <div class="program-card" data-program-id="${program.id}">
            <img src="${program.image}" alt="${program.title}" class="program-image" loading="lazy">
            <div class="program-content">
                <h3 class="program-title">${program.title}</h3>
                <p class="program-description">${program.short}</p>
            </div>
        </div>
    `).join('');
}

function populateNews() {
    const newsSlider = document.getElementById('newsSlider');
    if (!newsSlider) return;
    const newsToShow = siteData.news.slice(0, 3);
    
    newsSlider.innerHTML = newsToShow.map(news => {
        const date = new Date(news.date);
        const formattedDate = date.toLocaleDateString('id-ID', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        return `
            <div class="news-card">
                <img src="${news.image}" alt="${news.title}" class="news-image" loading="lazy">
                <div class="news-content">
                    <div class="news-date">${formattedDate}</div>
                    <h3 class="news-title">${news.title}</h3>
                    <p class="news-description">${news.short}</p>
                </div>
            </div>
        `;
    }).join('');
}

function populateTestimonials() {
    const testimonialsGrid = document.getElementById('testimonialsGrid');
    if (!testimonialsGrid) return;
    testimonialsGrid.innerHTML = siteData.testimonials.map(testimonial => {
        const stars = '★'.repeat(testimonial.rating);
        const date = new Date(testimonial.date);
        const formattedDate = date.toLocaleDateString('id-ID', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        return `
            <div class="testimonial-card">
                <div class="testimonial-header">
                    <img src="${testimonial.photo}" alt="${testimonial.name}" class="testimonial-photo">
                    <div class="testimonial-info">
                        <h4>${testimonial.name}</h4>
                        <p class="testimonial-role">${testimonial.role}</p>
                    </div>
                </div>
                <div class="testimonial-rating">
                    ${Array(testimonial.rating).fill('<span class="star">★</span>').join('')}
                </div>
                <p class="testimonial-comment">"${testimonial.comment}"</p>
                <p class="testimonial-date">${formattedDate}</p>
            </div>
        `;
    }).join('');
}

function populateFAQ() {
    const faqList = document.getElementById('faqList');
    if (!faqList) return;
    faqList.innerHTML = siteData.faqs.map((faq, index) => `
        <div class="faq-item">
            <button class="faq-question" aria-expanded="false">
                <span>${faq.q}</span>
                <svg class="icon faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
            </button>
            <div class="faq-answer">
                <div class="faq-answer-content">${faq.a}</div>
            </div>
        </div>
    `).join('');
}

function populateFooter() {
    const footerTagline = document.getElementById('footerTagline');
    const footerPhone = document.getElementById('footerPhone');
    const footerEmail = document.getElementById('footerEmail');
    const footerAddress = document.getElementById('footerAddress');
    
    if (footerTagline) footerTagline.textContent = siteData.siteInfo.tagline;
    if (footerPhone) footerPhone.textContent = siteData.siteInfo.phone;
    if (footerEmail) footerEmail.textContent = siteData.siteInfo.email;
    if (footerAddress) footerAddress.textContent = siteData.siteInfo.address;
}

function initSliders() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    const indicators = document.querySelectorAll('.slider-indicator');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }
    
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
    
    setInterval(nextSlide, 5000);
    
    const newsSliderEl = document.getElementById('newsSlider');
    const newsPrevBtn = document.querySelector('.news-prev');
    const newsNextBtn = document.querySelector('.news-next');
    let newsOffset = 0;
    
    if (newsPrevBtn && newsNextBtn) {
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

function initStats() {
    const stats = document.querySelectorAll('.stat-number');
    let animated = false;
    
    function animateStats() {
        if (animated) return;
        
        const statsSection = document.querySelector('.stats');
        const rect = statsSection.getBoundingClientRect();
        
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            animated = true;
            
            stats.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
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

function initFAQ() {
    document.addEventListener('click', (e) => {
        if (e.target.closest('.faq-question')) {
            const button = e.target.closest('.faq-question');
            const faqItem = button.closest('.faq-item');
            const isActive = faqItem.classList.contains('active');
            
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });
            
            if (!isActive) {
                faqItem.classList.add('active');
                button.setAttribute('aria-expanded', 'true');
            }
        }
    });
}

function initModal() {
    const modal = document.getElementById('programModal');
    const modalOverlay = modal.querySelector('.modal-overlay');
    const modalClose = modal.querySelector('.modal-close');
    
    function openModal(programId) {
        const program = siteData.programs.find(p => p.id === programId);
        if (!program) return;
        
        document.getElementById('modalImage').src = program.image;
        document.getElementById('modalImage').alt = program.title;
        document.getElementById('modalTitle').textContent = program.title;
        document.getElementById('modalText').textContent = program.detail;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    document.addEventListener('click', (e) => {
        if (e.target.closest('.program-card')) {
            const programId = e.target.closest('.program-card').getAttribute('data-program-id');
            openModal(programId);
        }
    });
    
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const nav = document.getElementById('mainNav');
    if (!mobileMenuBtn || !nav) return;
    
    mobileMenuBtn.addEventListener('click', () => {
        nav.classList.toggle('active');
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
        });
    });
}

function initScrollTop() {
    const scrollTopBtn = document.getElementById('scrollTop');
    if (!scrollTopBtn) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

document.addEventListener('DOMContentLoaded', loadData);

function initAboutPage() {
    if (!siteData) return;
    
    if (document.getElementById('aboutProfile')) {
        document.getElementById('aboutProfile').innerHTML = siteData.about.paragraphs.map(p => `<p class="about-paragraph">${p}</p>`).join('');
    }
    
    if (document.getElementById('visionText')) {
        document.getElementById('visionText').textContent = siteData.aboutPage.vision;
    }
    
    if (document.getElementById('missionList')) {
        document.getElementById('missionList').innerHTML = siteData.aboutPage.mission.map(m => `<li>${m}</li>`).join('');
    }
    
    if (document.getElementById('coreValuesGrid')) {
        document.getElementById('coreValuesGrid').innerHTML = siteData.aboutPage.coreValues.map(cv => `
            <div class="value-card">
                <h4>${cv.title}</h4>
                <p>${cv.desc}</p>
            </div>
        `).join('');
    }
    
    if (document.getElementById('curriculumText')) {
        document.getElementById('curriculumText').textContent = siteData.aboutPage.curriculum;
    }
    
    if (document.getElementById('teamGrid')) {
        document.getElementById('teamGrid').innerHTML = siteData.aboutPage.team.map(member => `
            <div class="team-card">
                <img src="${member.photo}" alt="${member.name}" class="team-photo">
                <h4>${member.name}</h4>
                <p>${member.role}</p>
            </div>
        `).join('');
    }
}

function initAchievementsPage() {
    if (!siteData) return;
    
    const achievementsGrid = document.getElementById('achievementsGrid');
    if (!achievementsGrid) return;
    
    achievementsGrid.innerHTML = siteData.achievements.map(ach => `
        <div class="achievement-card" data-achievement-id="${ach.id}">
            <img src="${ach.image}" alt="${ach.title}" class="achievement-image" loading="lazy">
            <div class="achievement-content">
                <span class="achievement-category">${ach.category}</span>
                <h3 class="achievement-title">${ach.title}</h3>
            </div>
        </div>
    `).join('');
    
    document.addEventListener('click', (e) => {
        if (e.target.closest('.achievement-card')) {
            const achId = e.target.closest('.achievement-card').getAttribute('data-achievement-id');
            openAchievementModal(achId);
        }
    });
}

function openAchievementModal(achId) {
    const achievement = siteData.achievements.find(a => a.id === achId);
    if (!achievement) return;
    
    const modal = document.getElementById('achievementModal');
    document.getElementById('modalImage').src = achievement.image;
    document.getElementById('modalImage').alt = achievement.title;
    document.getElementById('modalTitle').textContent = achievement.title;
    document.getElementById('modalText').textContent = achievement.detail;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function initUnitsPage() {
    if (!siteData) return;
    
    const unitsContainer = document.getElementById('unitsContainer');
    if (!unitsContainer) return;
    
    unitsContainer.innerHTML = siteData.units.map(unit => `
        <div class="unit-section">
            <div class="unit-header">
                <h2>${unit.name}</h2>
                <p>${unit.desc}</p>
            </div>
            <div class="unit-stats">
                ${Object.entries(unit.stats).map(([key, value]) => `
                    <div class="unit-stat">
                        <span class="unit-stat-value">${value}</span>
                        <span class="unit-stat-label">${key.charAt(0).toUpperCase() + key.slice(1)}</span>
                    </div>
                `).join('')}
            </div>
            <div class="unit-content">
                <div class="unit-list">
                    <h4>Fasilitas</h4>
                    <ul>
                        ${unit.facilities.map(f => `<li>${f}</li>`).join('')}
                    </ul>
                </div>
                <div class="unit-list">
                    <h4>Program Unggulan</h4>
                    <ul>
                        ${unit.programs.map(p => `<li>${p}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `).join('');
}

function initGalleryPage() {
    if (!siteData) return;
    
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;
    
    let currentFilter = 'all';
    
    function renderGallery(filter = 'all') {
        const items = filter === 'all' 
            ? siteData.galleryItems 
            : siteData.galleryItems.filter(item => item.category === filter);
        
        galleryGrid.innerHTML = items.map(item => `
            <div class="gallery-item" data-image="${item.image}" data-title="${item.title}">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
                <div class="gallery-item-overlay">
                    <p>${item.title}</p>
                </div>
            </div>
        `).join('');
    }
    
    renderGallery();
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            currentFilter = filter;
            renderGallery(filter);
        });
    });
    
    document.addEventListener('click', (e) => {
        if (e.target.closest('.gallery-item')) {
            const item = e.target.closest('.gallery-item');
            const image = item.getAttribute('data-image');
            const title = item.getAttribute('data-title');
            openGalleryModal(image, title);
        }
    });
}

function openGalleryModal(image, title) {
    const modal = document.getElementById('galleryModal');
    document.getElementById('fullscreenImage').src = image;
    document.getElementById('fullscreenCaption').textContent = title;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function initRegistrationForm() {
    const form = document.getElementById('registrationForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        const message = `
🎓 *PENDAFTARAN SANTRI BARU*

*Nama Lengkap:* ${data.namaLengkap}
*Tempat, Tanggal Lahir:* ${data.tempatLahir}, ${data.tanggalLahir}
*Jenis Kelamin:* ${data.jenisKelamin}
*Unit Pendidikan:* ${data.unit}

*Orang Tua/Wali:* ${data.namaOrangTua}
*Nomor HP/WA:* ${data.nomorHP}
*Email:* ${data.email || '-'}
*Alamat:* ${data.alamat}
${data.catatan ? `*Catatan:* ${data.catatan}` : ''}

${siteData.telegram.botComment}
        `.trim();
        
        const formMessage = document.getElementById('formMessage');
        
        try {
            formMessage.textContent = 'Mengirim data pendaftaran...';
            formMessage.className = 'form-message';
            formMessage.style.display = 'block';
            
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            formMessage.textContent = 'Pendaftaran berhasil dikirim! Tim kami akan menghubungi Anda segera.';
            formMessage.className = 'form-message success';
            
            form.reset();
            
            console.log('Form data:', data);
            console.log('Telegram message:', message);
            console.log('Telegram Group ID:', siteData.telegram.groupId);
            
        } catch (error) {
            formMessage.textContent = 'Terjadi kesalahan. Silakan coba lagi atau hubungi kami langsung.';
            formMessage.className = 'form-message error';
        }
    });
}

function initCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    
    if (page === 'tentang.html') {
        initAboutPage();
    } else if (page === 'prestasi.html') {
        initAchievementsPage();
    } else if (page === 'unit.html') {
        initUnitsPage();
    } else if (page === 'gallery.html') {
        initGalleryPage();
    } else if (page === 'daftar.html') {
        initRegistrationForm();
    }
}

/* --- SCRIPT.JS (updated) --- */
let siteData = null;

async function loadData(){
  try{
    const res = await fetch('package.json');
    const json = await res.json();
    siteData = json.content;
    initializePage();
  }catch(err){
    console.error('Error loading data', err);
  }
}

function initializePage(){
  if(!siteData) return;
  // populate functions (existing)...
  if (document.querySelector('.hero-slider')) populateHero();
  if (document.getElementById('aboutPara1')) populateAbout();
  if (document.getElementById('programsGrid')) populatePrograms();
  if (document.getElementById('newsSlider')) populateNews();
  if (document.getElementById('testimonialsGrid')) populateTestimonials();
  if (document.getElementById('faqList')) populateFAQ();
  populateFooter();

  // inits
  if (document.querySelector('.hero-slider')) initSliders();
  initStats();
  initFAQ();
  initModal();
  initMobileMenu();
  initSmoothScroll();
  initHeader();
  initRouting(); // <--- new routing for "show only selected page"
  initScrollTop();

  // set year
  const elYear = document.getElementById('currentYear');
  if(elYear) elYear.textContent = new Date().getFullYear();
}

////////////////////////////////////////////////////////////////////////////////
// MOBILE MENU: toggle + body-scroll lock
function initMobileMenu(){
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const nav = document.getElementById('mainNav');
  if(!mobileMenuBtn || !nav) return;

  mobileMenuBtn.addEventListener('click', () => {
    const isActive = nav.classList.toggle('active');
    // lock page scroll when nav open on mobile
    document.body.style.overflow = isActive ? 'hidden' : '';
    // add inert to main (if supported) - progressive enhancement
    const main = document.querySelector('main') || document.querySelector('body > section') || document.body;
    if(isActive){
      main.setAttribute('aria-hidden','true');
    } else {
      main.removeAttribute('aria-hidden');
    }
  });

  // close nav when a nav-link clicked (mobile)
  document.querySelectorAll('.nav-link').forEach(link=>{
    link.addEventListener('click', () => {
      const navEl = document.getElementById('mainNav');
      if(navEl && navEl.classList.contains('active')){
        navEl.classList.remove('active');
        document.body.style.overflow = '';
        const main = document.querySelector('main') || document.querySelector('body > section') || document.body;
        main.removeAttribute('aria-hidden');
      }
    });
  });
}

////////////////////////////////////////////////////////////////////////////////
// ROUTING: show only the section for the selected menu item (single page feel)
function initRouting(){
  // Accept anchors like href="#about" or href="tentang.html" or "/tentang.html"
  document.querySelectorAll('.nav-link').forEach(link=>{
    link.addEventListener('click', function(e){
      const href = (this.getAttribute('href') || '').trim();

      // external or absolute? let browser handle it
      if(!href) return;
      // If it's an external full url or has target blank - allow default
      if(href.startsWith('http') || this.target === '_blank') return;

      // Derive section id from href:
      // If href is hash (#about) -> use that id
      // If href is a filename (tentang.html) -> try mapping 'tentang' -> 'about'
      e.preventDefault();

      let targetId = null;
      if(href.startsWith('#')){
        targetId = href.slice(1);
      } else {
        // strip path and extension
        const file = href.split('/').pop().split('?')[0].split('#')[0];
        const name = file.replace('.html','').toLowerCase();
        // common mapping - you can extend this mapping if you have custom slug
        const mapping = {
          'tentang':'about',
          'prestasi':'prestasi',
          'unit':'unit',
          'gallery':'gallery',
          'daftar':'daftar',
          'index':'home',
          '':'home'
        };
        targetId = mapping[name] || name;
      }

      // if target exists on page -> show section
      if(targetId){
        // if section element exists
        const targetEl = document.getElementById(targetId);
        if(targetEl){
          showSection(targetId);
          // push state so back button works
          history.pushState({ section: targetId }, '', '#' + targetId);
          // close mobile nav if open
          const navEl = document.getElementById('mainNav');
          if(navEl && navEl.classList.contains('active')){
            navEl.classList.remove('active');
            document.body.style.overflow = '';
          }
          return;
        }
      }

      // fallback: if not found, try full navigation
      window.location.href = href;
    });
  });

  // handle back/forward navigation
  window.addEventListener('popstate', (e) => {
    const state = e.state;
    if(state && state.section){
      showSection(state.section, true);
    } else {
      // if no state, show home
      const hash = location.hash ? location.hash.slice(1) : 'home';
      showSection(hash, true);
    }
  });

  // on initial load if there's a hash, show that section
  const initialHash = location.hash ? location.hash.slice(1) : null;
  if(initialHash){
    setTimeout(()=> showSection(initialHash, true), 160);
  }
}

/**
 * showSection(id, instant)
 * - hides all main sections and shows only the target section (adds .section-visible)
 * - keeps header intact
 */
function showSection(id, instant = false){
  // select top-level sections only (skip header/footer)
  const sections = Array.from(document.querySelectorAll('body > section, main > section, section[id]'));
  if(sections.length === 0){
    // fallback: select by ids used in your site
    const all = document.querySelectorAll('section[id]');
    all.forEach(s => s.classList.add('section-hidden'), s=>s.classList.remove('section-visible'));
  }

  // hide all
  document.querySelectorAll('section').forEach(sec=>{
    if(sec.id){
      sec.classList.add('section-hidden');
      sec.classList.remove('section-visible','fade-in');
    }
  });

  // find target
  const target = document.getElementById(id);
  if(!target) {
    // nothing found - unhide all
    document.querySelectorAll('section').forEach(sec=>{
      sec.classList.remove('section-hidden');
      sec.classList.add('section-visible');
    });
    return;
  }

  // show the target section (make it look like a page)
  target.classList.remove('section-hidden');
  target.classList.add('section-visible','fade-in','section-full');

  // update active link in nav
  document.querySelectorAll('.nav-link').forEach(a=>{
    a.classList.toggle('active', (a.getAttribute('href') || '').includes('#'+id) || a.getAttribute('href')?.toLowerCase().includes(id));
  });

  // scroll to top of section, ensuring header offset
  const header = document.querySelector('.header');
  const headerHeight = header ? header.offsetHeight : 0;
  const topPos = target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
  if(instant){
    window.scrollTo(0, topPos);
  } else {
    window.scrollTo({ top: topPos, behavior:'smooth' });
  }
}

////////////////////////////////////////////////////////////////////////////////
// existing helpers kept from your original file (sliders, stats, etc)
// NOTE: keep your populateHero/populateAbout/populatePrograms/etc unchanged
// just ensure they are still present in this file. If they were long, keep them.
// I'll attach minimal stubs here for context — keep your original implementations.

function populateHero(){ /* existing implementation (keep original) */ }
function initSliders(){ /* existing implementation (keep original) */ }
function populateAbout(){ /* existing implementation (keep original) */ }
function populatePrograms(){ /* existing implementation (keep original) */ }
function populateNews(){ /* existing implementation (keep original) */ }
function populateTestimonials(){ /* existing implementation (keep original) */ }
function populateFAQ(){ /* existing implementation (keep original) */ }
function populateFooter(){ /* existing implementation (keep original) */ }
function initStats(){ /* existing implementation (keep original) */ }
function initFAQ(){ /* existing implementation (keep original) */ }
function initModal(){ /* existing implementation (keep original) */ }
function initSmoothScroll(){ /* existing implementation (keep original) */ }
function initHeader(){ /* existing implementation (keep original) */ }
function initScrollTop(){ /* existing implementation (keep original) */ }

document.addEventListener('DOMContentLoaded', loadData);
