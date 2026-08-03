function initTestimonials() {
    const track = document.querySelector('.testimonial-track');
    if (!track) return;

    let index = 0;
    const items = track.children;
    const total = items.length;

    setInterval(() => {
        index = (index + 1) % total;
        track.style.transform = `translateX(-${index * 100}%)`;
    }, 5000); // Ganti slide setiap 5 detik
}

document.addEventListener('DOMContentLoaded', initTestimonials);