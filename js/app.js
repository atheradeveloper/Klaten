// Global app logic
document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Effect
    const navbar = document.getElementById('main-navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                navbar.classList.add('shadow-md', 'bg-brand-dark/95', 'backdrop-blur-md');
                navbar.classList.remove('bg-transparent');
            } else {
                navbar.classList.remove('shadow-md', 'bg-brand-dark/95', 'backdrop-blur-md');
                navbar.classList.add('bg-transparent');
            }
        });
    }

    // 2. Mobile Menu Toggle
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            // Toggle hamburger icon animation
            const paths = menuBtn.querySelectorAll('path');
            if (paths.length >= 2) {
                // simple toggle of classes or icons can be done here
            }
        });
    }

    // Close mobile menu on clicking a link
    const mobileLinks = mobileMenu?.querySelectorAll('a');
    if (mobileLinks) {
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // 3. WhatsApp Floating Widget Logic (Set default)
    initDefaultWhatsAppWidget();
});

// Default pre-filled message for general inquiry
function initDefaultWhatsAppWidget() {
    const nomorSales = "6281234567890"; // Ganti dengan nomor WhatsApp resmi
    const defaultText = "Halo Griya Asri Development, saya tertarik untuk bertanya mengenai proyek perumahan dan kavling yang tersedia. Bisa tolong hubungi saya?";
    const defaultUrl = `https://api.whatsapp.com/send?phone=${nomorSales}&text=${encodeURIComponent(defaultText)}`;

    const floatingWidget = document.getElementById('floating-wa-widget');
    if (floatingWidget && !floatingWidget.getAttribute('href')) {
        floatingWidget.href = defaultUrl;
    }
}
