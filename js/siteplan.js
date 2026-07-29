// Siteplan SVG Handler & Modal Dialog Interaction

let dataProyek = {};
let kavlingTerpilih = "";
let isSubsidizedProject = false;

// Initialize siteplan loading data
async function inisialisasiSiteplan(proyekId, isSubsidized = false) {
    isSubsidizedProject = isSubsidized;
    try {
        const response = await fetch('./data/proyek-data.json');
        const data = await response.json();
        dataProyek = data[proyekId];

        if (!dataProyek) {
            console.error(`Proyek ID "${proyekId}" tidak ditemukan.`);
            return;
        }

        // Apply status colors to SVG elements based on JSON
        applyKavlingStatusStyles();

        // Bind clicks to SVG paths/rects
        bindKavlingClickEvents();

        // Select the first available unit as default in KPR calculator
        selectDefaultKavling();

    } catch (error) {
        console.error("Gagal memuat data proyek:", error);
    }
}

// Map styles based on kavling status in JSON
function applyKavlingStatusStyles() {
    const kavlingData = dataProyek.kavling;
    Object.keys(kavlingData).forEach(kavlingId => {
        const unit = kavlingData[kavlingId];
        const element = document.getElementById(`kav-${kavlingId}`);
        
        if (element) {
            // Remove previous classes
            element.classList.remove('kavling-available', 'kavling-booked', 'kavling-sold');
            element.classList.add('kavling-path');

            // Apply appropriate class according to status
            if (unit.status === 'tersedia') {
                element.classList.add('kavling-available');
            } else if (unit.status === 'booked') {
                element.classList.add('kavling-booked');
            } else if (unit.status === 'terjual') {
                element.classList.add('kavling-sold');
            }
        }
    });
}

// Bind click listener on all SVG elements with 'data-kavling' attribute
function bindKavlingClickEvents() {
    const interactiveElements = document.querySelectorAll('[id^="kav-"]');
    interactiveElements.forEach(el => {
        const kavlingId = el.id.replace('kav-', '');
        
        // Mobile-friendly tap & click support
        el.addEventListener('click', (e) => {
            e.preventDefault();
            handleKavlingClick(kavlingId);
        });
    });

    // Close Modal Event Listeners
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modal = document.getElementById('detail-kavling-modal');
    
    if (closeModalBtn && modal) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });

        // Close on clicking outside modal-content
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }
}

// Handles selecting a default available unit on load
function selectDefaultKavling() {
    const kavlingData = dataProyek.kavling;
    // Find first available or booked unit (avoid sold if possible)
    let defaultKav = Object.keys(kavlingData).find(k => kavlingData[k].status === 'tersedia') 
                     || Object.keys(kavlingData).find(k => kavlingData[k].status === 'booked')
                     || Object.keys(kavlingData)[0];

    if (defaultKav) {
        const unit = kavlingData[defaultKav];
        // Populate inputs in KPR calculator
        const inputHarga = document.getElementById('input-harga-kpr');
        if (inputHarga) {
            inputHarga.value = unit.harga;
            // Trigger KPR calculation refresh
            const event = new Event('input');
            inputHarga.dispatchEvent(event);
        }
        
        // Pre-fill default WhatsApp link
        generateWhatsAppLink(defaultKav, unit.harga);
    }
}

// Main kavling click handler
function handleKavlingClick(kavlingId) {
    const unit = dataProyek.kavling[kavlingId];
    if (!unit) return;

    kavlingTerpilih = kavlingId;

    // Update UI elements in pop-up modal
    const modalNoKavling = document.getElementById('modal-no-kavling');
    const modalStatus = document.getElementById('modal-status');
    const modalLuas = document.getElementById('modal-luas');
    const modalDimensi = document.getElementById('modal-dimensi');
    const modalSertifikat = document.getElementById('modal-sertifikat');
    const modalHarga = document.getElementById('modal-harga');

    if (modalNoKavling) modalNoKavling.innerText = kavlingId;
    if (modalStatus) {
        modalStatus.innerText = unit.status.toUpperCase();
        modalStatus.className = "px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider";
        if (unit.status === 'tersedia') {
            modalStatus.classList.add('bg-emerald-100', 'text-emerald-800');
        } else if (unit.status === 'booked') {
            modalStatus.classList.add('bg-amber-100', 'text-amber-800');
        } else {
            modalStatus.classList.add('bg-red-100', 'text-red-800');
        }
    }
    if (modalLuas) modalLuas.innerText = `${unit.luasBangunan}/${unit.luasTanah} m² (LB/LT)`;
    if (modalDimensi) modalDimensi.innerText = unit.dimensi;
    if (modalSertifikat) modalSertifikat.innerText = unit.sertifikat;
    if (modalHarga) modalHarga.innerText = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(unit.harga);

    // Update KPR input
    const inputHarga = document.getElementById('input-harga-kpr');
    if (inputHarga) {
        inputHarga.value = unit.harga;
        // Trigger calculator update
        const event = new Event('input');
        inputHarga.dispatchEvent(event);
    }

    // Update WhatsApp links
    generateWhatsAppLink(kavlingId, unit.harga);

    // If unit is sold, customize CTA or show notice
    const btnCta = document.getElementById('btn-cta-whatsapp');
    if (btnCta) {
        if (unit.status === 'terjual') {
            btnCta.classList.add('opacity-50', 'cursor-not-allowed', 'pointer-events-none');
            btnCta.innerText = 'Kavling Sudah Terjual';
        } else {
            btnCta.classList.remove('opacity-50', 'cursor-not-allowed', 'pointer-events-none');
            btnCta.innerText = 'Booking Unit Via WhatsApp';
        }
    }

    // Show modal
    const modal = document.getElementById('detail-kavling-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

// Generate dynamic pre-filled WhatsApp message
function generateWhatsAppLink(kavlingId, harga) {
    const nomorSales = "6281234567890"; // WhatsApp Business Developer
    const kategoriProyek = dataProyek.kategori;
    const namaProyek = dataProyek.namaProyek;

    const teksPesan = `Halo Sales Griya Asri Development, saya tertarik dengan kategori *${kategoriProyek}* di proyek *${namaProyek}*, khususnya Kavling *${kavlingId}* seharga Rp ${harga.toLocaleString('id-ID')}. Mohon info ketersediaan unit, syarat administrasi, serta jadwal survey lokasinya. Terima kasih!`;
    const urlWA = `https://api.whatsapp.com/send?phone=${nomorSales}&text=${encodeURIComponent(teksPesan)}`;

    // Update CTA button inside modal
    const btnCta = document.getElementById('btn-cta-whatsapp');
    if (btnCta) {
        btnCta.href = urlWA;
    }

    // Update Floating WhatsApp Widget as well to match current selected unit
    const floatingWidget = document.getElementById('floating-wa-widget');
    if (floatingWidget) {
        floatingWidget.href = urlWA;
        
        // Add a tooltip or small visual indicator that widget is loaded with unit
        const tooltip = document.getElementById('wa-widget-tooltip');
        if (tooltip) {
            tooltip.innerText = `Tanya unit ${kavlingId}`;
            tooltip.classList.remove('hidden');
        }
    }
}
