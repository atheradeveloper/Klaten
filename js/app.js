/* ============================================================
 * ATHERA PROPERTI - STANDALONE SCRIPT (NO DEPENDENCIES)
 * ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navbar Effect
  initNavbar();

  // 2. Mobile Hamburger Menu Toggle
  initMobileMenu();

  // 3. Standalone Pure Vanilla JS Slider (Menggantikan Swiper JS)
  initStandaloneSliders();

  // 4. Inisialisasi Floating WhatsApp Tooltip
  initDefaultWhatsAppWidget();
});

/* --- 1. Sticky Navbar Function --- */
function initNavbar() {
  const navbar = document.getElementById('main-navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('shadow-md', 'bg-brand-dark/95', 'backdrop-blur-md');
    } else {
      navbar.classList.remove('shadow-md', 'bg-brand-dark/95', 'backdrop-blur-md');
    }
  });
}

/* --- 2. Mobile Menu Toggle --- */
function initMobileMenu() {
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }
}

/* --- 3. Standalone Slider (Custom Engine with Touch Swipe) --- */
function initStandaloneSliders() {
  const sliderContainers = document.querySelectorAll('.product-slider-container');

  sliderContainers.forEach(container => {
    const track = container.querySelector('.product-slider-track');
    const slides = container.querySelectorAll('.product-slider-slide');
    const prevBtn = container.querySelector('.slider-nav-prev');
    const nextBtn = container.querySelector('.slider-nav-next');
    const dotsContainer = container.querySelector('.slider-dots-wrapper');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    let autoSlideTimer = null;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let isDragging = false;

    // Buat Indikator Dots secara dinamis
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (idx === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(idx));
        dotsContainer.appendChild(dot);
      });
    }

    function updateSliderPosition() {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      
      // Update Dots State
      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.slider-dot');
        dots.forEach((dot, idx) => {
          if (idx === currentIndex) dot.classList.add('active');
          else dot.classList.remove('active');
        });
      }
    }

    function goToSlide(index) {
      currentIndex = index;
      if (currentIndex < 0) currentIndex = slides.length - 1;
      if (currentIndex >= slides.length) currentIndex = 0;
      updateSliderPosition();
      restartAutoSlide();
    }

    function nextSlide() {
      goToSlide(currentIndex + 1);
    }

    function prevSlide() {
      goToSlide(currentIndex - 1);
    }

    // Event Listener Navigasi Panah
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    // Auto Slide Timer (3.5 Detik)
    function startAutoSlide() {
      if (autoSlideTimer) clearInterval(autoSlideTimer);
      autoSlideTimer = setInterval(nextSlide, 3500);
    }

    function restartAutoSlide() {
      clearInterval(autoSlideTimer);
      startAutoSlide();
    }

    // Touch / Swipe Handling untuk Layar HP
    container.addEventListener('touchstart', touchStart);
    container.addEventListener('touchend', touchEnd);
    container.addEventListener('touchmove', touchMove);

    function touchStart(event) {
      startX = event.touches[0].clientX;
      isDragging = true;
      clearInterval(autoSlideTimer);
    }

    function touchMove(event) {
      if (!isDragging) return;
      const currentX = event.touches[0].clientX;
      const diffX = currentX - startX;
    }

    function touchEnd(event) {
      if (!isDragging) return;
      isDragging = false;
      const endX = event.changedTouches[0].clientX;
      const diffX = endX - startX;

      // Ambang batas geser 50px
      if (diffX < -50) {
        nextSlide();
      } else if (diffX > 50) {
        prevSlide();
      } else {
        restartAutoSlide();
      }
    }

    // Jalankan Auto Slide Pertama Kali
    startAutoSlide();
  });
}

/* --- 4. WhatsApp Widget Logic --- */
function initDefaultWhatsAppWidget() {
  const nomorSales = "6285124665145";
  const defaultText = "Halo Athera Properti Klaten, saya tertarik untuk bertanya mengenai proyek rumah dan kavling yang tersedia. Mohon infonya.";
  const defaultUrl = `https://api.whatsapp.com/send?phone=${nomorSales}&text=${encodeURIComponent(defaultText)}`;

  const floatingWidget = document.getElementById('floating-wa-widget');
  if (floatingWidget && !floatingWidget.getAttribute('href')) {
    floatingWidget.href = defaultUrl;
  }
}