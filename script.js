// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Handle dropdown clicks on mobile
        const dropdowns = document.querySelectorAll('.nav-item.dropdown');
        dropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('.nav-link');
            
            link.addEventListener('click', function(e) {
                // Only toggle dropdown on mobile
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    
                    // Close all other dropdowns
                    dropdowns.forEach(otherDropdown => {
                        if (otherDropdown !== dropdown) {
                            otherDropdown.classList.remove('active');
                        }
                    });
                    
                    // Toggle current dropdown
                    dropdown.classList.toggle('active');
                }
            });
        });

        // Close mobile menu when clicking on dropdown items (not parent links)
        document.querySelectorAll('.dropdown-menu a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                // Close all dropdowns
                dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            });
        });

        // Close mobile menu when clicking on non-dropdown links
        document.querySelectorAll('.nav-link').forEach(link => {
            if (!link.closest('.dropdown')) {
                link.addEventListener('click', function() {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                // Close all dropdowns
                dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });
    }
});

// Clinic carousel logic
let clinicIndex = 0;

function updateClinicDots() {
    const track = document.getElementById('clinicTrack');
    const slides = track ? Array.from(track.children) : [];
    const dotsContainer = document.getElementById('clinicDots');
    if (!dotsContainer || slides.length === 0) return;
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === clinicIndex ? ' active' : '');
        dot.setAttribute('aria-label', `Go to slide ${i+1}`);
        dot.addEventListener('click', () => scrollClinicTo(i));
        dotsContainer.appendChild(dot);
    });
}

function scrollClinic(direction) {
    const track = document.getElementById('clinicTrack');
    const viewport = document.getElementById('clinicViewport');
    if (!track || !viewport) return;
    const slides = Array.from(track.children);
    const maxIndex = slides.length - 1;
    clinicIndex = direction === 'left' ? Math.max(0, clinicIndex - 1) : Math.min(maxIndex, clinicIndex + 1);
    const offset = viewport.clientWidth * clinicIndex;
    track.scrollTo({ left: offset, behavior: 'smooth' });
    updateClinicDots();
}

function scrollClinicTo(index) {
    const track = document.getElementById('clinicTrack');
    const viewport = document.getElementById('clinicViewport');
    if (!track || !viewport) return;
    const slides = Array.from(track.children);
    const maxIndex = slides.length - 1;
    clinicIndex = Math.max(0, Math.min(maxIndex, index));
    const offset = viewport.clientWidth * clinicIndex;
    track.scrollTo({ left: offset, behavior: 'smooth' });
    updateClinicDots();
}

window.addEventListener('resize', () => {
    // Re-align on resize
    scrollClinicTo(clinicIndex);
});

document.addEventListener('DOMContentLoaded', () => {
    updateClinicDots();
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Packages carousel scroll function
function scrollPackages(direction) {
    const packagesGrid = document.getElementById('packagesGrid');
    if (packagesGrid) {
        const scrollAmount = 400; // Adjust this value to control scroll distance
        if (direction === 'left') {
            packagesGrid.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        } else if (direction === 'right') {
            packagesGrid.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    }
}

// Contact form handling
const contactForm = document.querySelector('.contact-form');
const formInputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');

// Form label animation
formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
        if (!input.value) {
            input.parentElement.classList.remove('focused');
        }
    });
    
    // Check if input has value on page load
    if (input.value) {
        input.parentElement.classList.add('focused');
    }
});

// Form submission
contactForm?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const formFields = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        service: formData.get('service'),
        message: formData.get('message')
    };
    
    // Basic validation
    if (!formFields.name || !formFields.email || !formFields.phone || !formFields.service) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formFields.email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    // Submit to Netlify
    fetch('/', {
        method: 'POST',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString()
    })
    .then(() => {
        showNotification('Thank you for your inquiry! We\'ll contact you within 24 hours.', 'success');
        this.reset();
        formInputs.forEach(input => {
            input.parentElement.classList.remove('focused');
        });
    })
    .catch((error) => {
        console.error('Error:', error);
        showNotification('Sorry, there was an error submitting your form. Please try again or call us directly.', 'error');
    })
    .finally(() => {
        // Reset button
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    });
});

// Notification system
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification__content">
            <span class="notification__message">${message}</span>
            <button class="notification__close">&times;</button>
        </div>
    `;
    
    // Add styles for notification
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: white;
            border-radius: 8px;
            padding: 1rem 1.5rem;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            max-width: 400px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            border-left: 4px solid #000000;
        }
        
        .notification--error {
            border-left-color: #e74c3c;
        }
        
        .notification--success {
            border-left-color: #27ae60;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification__content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
        }
        
        .notification__message {
            color: #2c2c2c;
            font-size: 0.95rem;
            line-height: 1.5;
        }
        
        .notification__close {
            background: none;
            border: none;
            font-size: 1.5rem;
            color: #999;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .notification__close:hover {
            color: #666;
        }
    `;
    
    if (!document.querySelector('#notification-styles')) {
        style.id = 'notification-styles';
        document.head.appendChild(style);
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification__close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        if (notification.classList.contains('show')) {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-package, .tech-item, .founder-card, .hero-content');
    animateElements.forEach(el => {
        observer.observe(el);
    });
});

// Add CSS for animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .service-package, .tech-item, .founder-card, .hero-content {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .navbar.scrolled {
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(15px);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    }
    
    .hamburger.active .bar:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active .bar:nth-child(1) {
        transform: translateY(8px) rotate(45deg);
    }
    
    .hamburger.active .bar:nth-child(3) {
        transform: translateY(-8px) rotate(-45deg);
    }
    
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            left: -100%;
            top: 70px;
            flex-direction: column;
            background-color: white;
            width: 100%;
            text-align: center;
            transition: 0.3s;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            padding: 2rem 0;
            z-index: 999;
        }
        
        .nav-menu.active {
            left: 0;
        }
        
        .nav-item {
            margin: 1rem 0;
        }
        
        .notification {
            right: 10px;
            left: 10px;
            max-width: none;
        }
    }
`;

if (!document.querySelector('#animation-styles')) {
    animationStyles.id = 'animation-styles';
    document.head.appendChild(animationStyles);
}

// Service package selection tracking
document.querySelectorAll('.service-package .btn-primary, .service-package .btn-secondary').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const packageTitle = this.closest('.service-package').querySelector('.package-title').textContent;
        
        // Store selection in session storage for form
        sessionStorage.setItem('selectedPackage', packageTitle);
        
        // Pre-fill service field if form is on the same page
        const serviceSelect = document.querySelector('#service');
        if (serviceSelect) {
            setTimeout(() => {
                if (packageTitle.includes('Complete')) {
                    serviceSelect.value = 'complete';
                } else if (packageTitle.includes('Essential')) {
                    serviceSelect.value = 'essential';
                }
                serviceSelect.parentElement.classList.add('focused');
            }, 100);
        }
    });
});

// Check for pre-selected service on page load
document.addEventListener('DOMContentLoaded', () => {
    const selectedPackage = sessionStorage.getItem('selectedPackage');
    const serviceSelect = document.querySelector('#service');
    
    if (selectedPackage && serviceSelect) {
        if (selectedPackage.includes('Complete')) {
            serviceSelect.value = 'complete';
        } else if (selectedPackage.includes('Essential')) {
            serviceSelect.value = 'essential';
        }
        
        if (serviceSelect.value) {
            serviceSelect.parentElement.classList.add('focused');
        }
    }
});

// Enhanced Package Pre-selection Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Handle package button clicks with better UX
    document.querySelectorAll('[data-package]').forEach(button => {
        button.addEventListener('click', function(e) {
            const packageType = this.getAttribute('data-package');
            
            // Add loading state to button
            this.style.transform = 'scale(0.95)';
            this.style.opacity = '0.8';
            
            setTimeout(() => {
                this.style.transform = '';
                this.style.opacity = '';
                
                // Pre-select the package in the form
                const serviceSelect = document.getElementById('service');
                if (serviceSelect) {
                    serviceSelect.value = packageType;
                    
                    // Add visual feedback with golden highlight
                    serviceSelect.style.border = '2px solid #000000';
                    serviceSelect.style.boxShadow = '0 0 10px rgba(212, 175, 55, 0.3)';
                    
                    // Focus on first name field for better UX
                    const nameField = document.getElementById('name');
                    if (nameField) {
                        nameField.focus();
                    }
                    
                    // Remove highlight after 3 seconds
                    setTimeout(() => {
                        serviceSelect.style.border = '';
                        serviceSelect.style.boxShadow = '';
                    }, 3000);
                }
            }, 200);
        });
    });
    
    // Add booking urgency indicators
    const packageCards = document.querySelectorAll('.package-card');
    packageCards.forEach(card => {
        const button = card.querySelector('.package-btn');
        if (button) {
            // Add subtle pulsing animation to premium package
            if (card.classList.contains('premium')) {
                button.style.animation = 'pulse-gold 2s infinite';
            }
        }
    });
});

// Medesk Integration Functions
function loadMedeskWidget() {
    const widgetContainer = document.getElementById('medesk-booking-widget');
    const placeholder = widgetContainer.querySelector('.booking-placeholder');
    
    // Add loading state
    placeholder.innerHTML = `
        <div class="booking-placeholder-content">
            <div class="loading-spinner"></div>
            <h3>Loading Booking System...</h3>
            <p>Please wait while we prepare your booking experience</p>
        </div>
    `;
    
    // Add loading spinner styles dynamically
    if (!document.getElementById('spinner-styles')) {
        const style = document.createElement('style');
        style.id = 'spinner-styles';
        style.textContent = `
            .loading-spinner {
                width: 40px;
                height: 40px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid #000000;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 1rem;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Replace with actual Medesk widget after 1 second
    setTimeout(() => {
        insertMedeskWidget();
    }, 1000);
}

function insertMedeskWidget() {
    const widgetContainer = document.getElementById('medesk-booking-widget');
    
    // WhatsApp booking system
    const whatsappBookingCode = `
        <div class="whatsapp-booking-widget">
            <div style="padding: 2rem; text-align: center; background: linear-gradient(135deg, #f8f9fa, #ffffff); border-radius: 12px;">
                <h3 style="color: #000000; margin-bottom: 1rem;">📱 Instant WhatsApp Booking</h3>
                <p style="margin-bottom: 2rem; color: #666; font-size: 1.1rem;">
                    Book your appointment instantly via WhatsApp<br>
                    Get immediate confirmation and personalized service
                </p>
                
                <div class="whatsapp-booking-options" style="display: flex; flex-direction: column; gap: 1rem; max-width: 500px; margin: 0 auto;">
                    <button onclick="bookViaWhatsApp('diagnostic')" class="whatsapp-book-btn diagnostic">
                        <span class="service-icon">💎</span>
                        <div class="service-details">
                            <strong>Skin Diagnostic & Consultation Package</strong>
                            <span class="price">£250</span>
                        </div>
                        <span class="whatsapp-icon">💬</span>
                    </button>
                    
                    <button onclick="bookViaWhatsApp('redness')" class="whatsapp-book-btn redness">
                        <span class="service-icon">🔬</span>
                        <div class="service-details">
                            <strong>Redness Protocol</strong>
                            <span class="price">£1,200</span>
                        </div>
                        <span class="whatsapp-icon">💬</span>
                    </button>
                    
                    <button onclick="bookViaWhatsApp('pigmentation')" class="whatsapp-book-btn pigmentation">
                        <span class="service-icon">🔬</span>
                        <div class="service-details">
                            <strong>Pigmentation Protocol</strong>
                            <span class="price">£1,300</span>
                        </div>
                        <span class="whatsapp-icon">💬</span>
                    </button>
                    
                    <button onclick="bookViaWhatsApp('wrinkled')" class="whatsapp-book-btn wrinkled">
                        <span class="service-icon">🔬</span>
                        <div class="service-details">
                            <strong>Skin Rejuvenation Protocol</strong>
                            <span class="price">£1,800</span>
                        </div>
                        <span class="whatsapp-icon">💬</span>
                    </button>
                    
                    <button onclick="bookViaWhatsApp('tightening')" class="whatsapp-book-btn tightening">
                        <span class="service-icon">🔬</span>
                        <div class="service-details">
                            <strong>Tightening Protocol</strong>
                            <span class="price">£1,600</span>
                        </div>
                        <span class="whatsapp-icon">💬</span>
                    </button>
                    
                    <button onclick="bookViaWhatsApp('eye')" class="whatsapp-book-btn eye">
                        <span class="service-icon">🔬</span>
                        <div class="service-details">
                            <strong>Eye Rejuvenation Protocol</strong>
                            <span class="price">£1,200</span>
                        </div>
                        <span class="whatsapp-icon">💬</span>
                    </button>
                    
                    <button onclick="bookViaWhatsApp('hair')" class="whatsapp-book-btn hair">
                        <span class="service-icon">🔬</span>
                        <div class="service-details">
                            <strong>Hair Protocol</strong>
                            <span class="price">£500</span>
                        </div>
                        <span class="whatsapp-icon">💬</span>
                    </button>
                    
                    <button onclick="bookViaWhatsApp('beard')" class="whatsapp-book-btn beard">
                        <span class="service-icon">🔬</span>
                        <div class="service-details">
                            <strong>Beard Protocol</strong>
                            <span class="price">£400</span>
                        </div>
                        <span class="whatsapp-icon">💬</span>
                    </button>
                </div>
                
                <div style="margin-top: 2rem; padding: 1rem; background: rgba(0, 0, 0, 0.1); border-radius: 8px; border-left: 4px solid #000000;">
                    <p style="margin: 0; color: #666; font-size: 0.9rem;">
                        <strong>📞 Direct Contact:</strong> +447427746836<br>
                        <em>Available Monday - Friday: 9:00 AM - 6:00 PM</em>
                    </p>
                </div>
            </div>
        </div>
    `;
    
    widgetContainer.innerHTML = whatsappBookingCode;
}

// WhatsApp Booking Function
function bookViaWhatsApp(packageType) {
    const phoneNumber = '447427746836';
    let message = '';
    
    switch(packageType) {
        case 'diagnostic':
            message = `Hi! I'd like to book the Skin Diagnostic Package (£250). 

This includes:
• Initial Consultation
• VISIA Scan Age-Analysis
• QOVES Scan AI Aesthetics Analysis
• Glycation Age Analysis
• Observ Skin Imaging
• 100 skin markers
• Comprehensive report with personalised recommendations

Please let me know your available appointments. Thank you!`;
            break;
            
        case 'complete':
            message = `Hi! I'm interested in booking the Complete Health Package (£1,500).

This comprehensive package includes:
• All Skin Diagnostic services
• Glycation Age Analysis
• Total Body Surface Area Skin Age
• Blood Panel (120 biomarkers)
• Fitness Assessment (VO2 MAX, grip strength, spirometry)
• Complete health & longevity protocol

Could you please share available appointment times? Thank you!`;
            break;
            
        case 'consultation':
            message = `Hi! I'd like to book an Initial Consultation at Collagen Clinic London.

I'm interested in learning more about your skin diagnostic services and would like to discuss my specific needs.

Please let me know your available consultation times. Thank you!`;
            break;
            
        default:
            message = `Hi! I'd like to book an appointment at Collagen Clinic London. Please let me know your available times. Thank you!`;
    }
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Add visual feedback
    const clickedButton = event.target.closest('.whatsapp-book-btn');
    if (clickedButton) {
        clickedButton.style.transform = 'scale(0.95)';
        clickedButton.style.opacity = '0.8';
        
        setTimeout(() => {
            clickedButton.style.transform = '';
            clickedButton.style.opacity = '';
        }, 200);
    }
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
}

// Dynamic Urgency Counter
function initializeUrgencyCounter() {
    const slotsElement = document.getElementById('slots-remaining');
    if (slotsElement) {
        // Keep it at 1 slot for special intro offer - no countdown needed
        slotsElement.textContent = '1';
        
        // Add occasional flash effect to draw attention
        setInterval(() => {
            slotsElement.style.animation = 'flash 0.5s ease-in-out';
            setTimeout(() => {
                slotsElement.style.animation = '';
            }, 500);
        }, 10000); // Flash every 10 seconds
    }
}

// Enhanced Booking Analytics
function trackBookingIntent(packageType) {
    // Track user engagement
    console.log(`Booking intent: ${packageType}`);
    
    // You can add Google Analytics or other tracking here
    if (typeof gtag !== 'undefined') {
        gtag('event', 'booking_intent', {
            'package_type': packageType,
            'value': packageType === 'complete' ? 1500 : 250
        });
    }
}

// Treatment Categories Functionality
function initializeTreatmentTabs() {
    const categoryTabs = document.querySelectorAll('.category-tab');
    const categoryGrids = document.querySelectorAll('.treatment-category-grid');
    
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Remove active class from all tabs
            categoryTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all category grids
            categoryGrids.forEach(grid => {
                grid.classList.remove('active');
            });
            
            // Show selected category grid
            const targetGrid = document.querySelector(`[data-category="${category}"].treatment-category-grid`);
            if (targetGrid) {
                targetGrid.classList.add('active');
            }
        });
    });
}

// Treatment Detail - Open in New Tab
function showTreatmentDetail(treatmentId) {
    const treatments = {
        'tixel': 'treatments/tixel-rejuvenation.html',
        'genesis': 'treatments/genesis-rejuvenation.html',
        'ultraformer': 'treatments/ultraformer-iii.html',
        'ultraformer-hifu': 'treatments/ultraformer-hifu.html',
        'gentlemax': 'treatments/candela-gentlemax-pro-plus.html',
        'lasemd': 'treatments/lutronic-lasemd-ultra.html',
        'keralase-hair': 'treatments/keralase-hair.html',
        'coolview': 'treatments/coolview-vascular-laser.html',
        'exion-tightening': 'treatments/exion-tightening.html',
        'exion-microneedling': 'treatments/exion-microneedling.html',
        'dermal-fillers': 'treatments/dermal-fillers.html',
        'botox': 'treatments/botox.html',
        'julaine': 'treatments/julaine.html',
        'rejuran': 'treatments/rejuran.html',
        'sculptra': 'treatments/sculptra.html',
        'sunekos': 'treatments/sunekos.html',
        'peels': 'treatments/chemical-peels.html',
        'exosomes': 'treatments/exosomes.html',
        'visia-scan': 'treatments/visia-scan.html',
        'observ520': 'treatments/observ520.html',
        'qoves-ai': 'treatments/qoves-ai.html',
        'body-surface-analysis': 'treatments/body-surface-analysis.html',
        'glycation-analysis': 'treatments/glycation-analysis.html',
        'inbody-analysis': 'treatments/inbody-analysis.html',
        'inbody-stadiometer': 'treatments/inbody-stadiometer.html',
        'inbody-yscope': 'treatments/inbody-yscope.html',
        'blood-pressure': 'treatments/blood-pressure.html',
        'cardiocoach-vo2': 'treatments/cardiocoach-vo2.html',
        'vald-strength': 'treatments/vald-strength.html',
        'spirometry': 'treatments/spirometry.html'
    };
    
    const treatmentUrl = treatments[treatmentId];
    if (!treatmentUrl) return;
    
    // Open treatment page in new tab
    window.open(treatmentUrl, '_blank');
}


// Initialize all conversion optimizations
document.addEventListener('DOMContentLoaded', function() {
    initializeUrgencyCounter();
    initializeTreatmentTabs();
    
    // Track booking button clicks
    document.querySelectorAll('.btn-whatsapp').forEach(button => {
        button.addEventListener('click', function() {
            const packageType = this.getAttribute('data-package');
            trackBookingIntent(packageType);
        });
    });
});

// Contact form removed - using WhatsApp booking system
// Dr. Lamiche style treatment modals active

// Packages Carousel Function
let currentCarouselIndex = 0;

function moveCarousel(direction) {
    const carousel = document.getElementById('packagesCarousel');
    if (!carousel) return;
    
    const cards = carousel.querySelectorAll('.package-card');
    const totalCards = cards.length;
    
    // Update index - scroll one card at a time
    currentCarouselIndex += direction;
    
    // Clamp index to allow scrolling through all cards
    if (currentCarouselIndex < 0) {
        currentCarouselIndex = 0;
    } else if (currentCarouselIndex >= totalCards) {
        currentCarouselIndex = totalCards - 1;
    }
    
    // Calculate translateX value (each card is 320px + 2rem gap = ~352px)
    const cardWidth = 352; // 320px + 32px gap
    const translateX = -currentCarouselIndex * cardWidth;
    
    carousel.style.transform = `translateX(${translateX}px)`;
    
    // Update button visibility
    updateCarouselButtons();
}

function updateCarouselButtons() {
    const carousel = document.getElementById('packagesCarousel');
    if (!carousel) return;
    
    const cards = carousel.querySelectorAll('.package-card');
    const totalCards = cards.length;
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    if (prevBtn) {
        prevBtn.style.opacity = currentCarouselIndex === 0 ? '0.5' : '1';
        prevBtn.style.cursor = currentCarouselIndex === 0 ? 'not-allowed' : 'pointer';
    }
    
    if (nextBtn) {
        nextBtn.style.opacity = currentCarouselIndex >= totalCards - 1 ? '0.5' : '1';
        nextBtn.style.cursor = currentCarouselIndex >= totalCards - 1 ? 'not-allowed' : 'pointer';
    }
}

// Initialize carousel on page load
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.getElementById('packagesCarousel');
    if (carousel) {
        // Initialize button states
        updateCarouselButtons();
        
        // Reset position on window resize
        window.addEventListener('resize', function() {
            currentCarouselIndex = 0;
            moveCarousel(0);
        });
        
        // Mobile touch swipe support
        initializeTouchSwipe(carousel);
    }
});

// ============================================
// MOBILE TOUCH SWIPE FOR CAROUSELS
// ============================================

function initializeTouchSwipe(carousel) {
    if (!carousel) return;
    
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    let isSwiping = false;
    
    const minSwipeDistance = 50; // Minimum swipe distance in pixels
    const maxVerticalSwipe = 75; // Maximum vertical movement to still count as horizontal swipe
    
    carousel.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        isSwiping = true;
    }, { passive: true });
    
    carousel.addEventListener('touchmove', function(e) {
        if (!isSwiping) return;
        
        const currentX = e.changedTouches[0].screenX;
        const currentY = e.changedTouches[0].screenY;
        const diffX = Math.abs(currentX - touchStartX);
        const diffY = Math.abs(currentY - touchStartY);
        
        // If horizontal swipe is dominant, prevent vertical scroll
        if (diffX > diffY && diffX > 10) {
            e.preventDefault();
        }
    }, { passive: false });
    
    carousel.addEventListener('touchend', function(e) {
        if (!isSwiping) return;
        
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        
        const diffX = touchStartX - touchEndX;
        const diffY = Math.abs(touchStartY - touchEndY);
        
        // Only trigger swipe if horizontal movement is significant and vertical is minimal
        if (Math.abs(diffX) > minSwipeDistance && diffY < maxVerticalSwipe) {
            if (diffX > 0) {
                // Swipe left - go to next
                moveCarousel(1);
            } else {
                // Swipe right - go to previous
                moveCarousel(-1);
            }
        }
        
        isSwiping = false;
    }, { passive: true });
    
    // Prevent default drag behavior on images
    carousel.querySelectorAll('img').forEach(img => {
        img.addEventListener('dragstart', e => e.preventDefault());
    });
}

// Initialize touch swipe for all carousels on the page
document.addEventListener('DOMContentLoaded', function() {
    // Find all carousel wrappers and initialize touch support
    const carouselWrappers = document.querySelectorAll('.packages-carousel, [id$="Carousel"]');
    carouselWrappers.forEach(wrapper => {
        initializeTouchSwipe(wrapper);
    });
});

// Treatment Carousel Functions
let treatmentCarouselIndices = {
    'diagnostics': 0,
    'lasers': 0,
    'injectables': 0
};

function moveTreatmentCarousel(carouselId, direction) {
    const carousel = document.getElementById(carouselId + 'Carousel');
    if (!carousel) return;
    
    const cards = carousel.querySelectorAll('.package-card');
    const totalCards = cards.length;
    
    // Update index
    treatmentCarouselIndices[carouselId] += direction;
    
    // Clamp index
    if (treatmentCarouselIndices[carouselId] < 0) {
        treatmentCarouselIndices[carouselId] = 0;
    } else if (treatmentCarouselIndices[carouselId] >= totalCards) {
        treatmentCarouselIndices[carouselId] = totalCards - 1;
    }
    
    // Calculate translateX value
    const cardWidth = 352; // 320px + 32px gap
    const translateX = -treatmentCarouselIndices[carouselId] * cardWidth;
    
    carousel.style.transform = `translateX(${translateX}px)`;
    
    // Update button visibility
    updateTreatmentCarouselButtons(carouselId);
}

function updateTreatmentCarouselButtons(carouselId) {
    const carousel = document.getElementById(carouselId + 'Carousel');
    if (!carousel) return;
    
    const cards = carousel.querySelectorAll('.package-card');
    const totalCards = cards.length;
    const prevBtn = document.querySelector('.' + carouselId + '-prev');
    const nextBtn = document.querySelector('.' + carouselId + '-next');
    
    if (prevBtn) {
        prevBtn.style.opacity = treatmentCarouselIndices[carouselId] === 0 ? '0.5' : '1';
        prevBtn.style.cursor = treatmentCarouselIndices[carouselId] === 0 ? 'not-allowed' : 'pointer';
    }
    
    if (nextBtn) {
        nextBtn.style.opacity = treatmentCarouselIndices[carouselId] >= totalCards - 1 ? '0.5' : '1';
        nextBtn.style.cursor = treatmentCarouselIndices[carouselId] >= totalCards - 1 ? 'not-allowed' : 'pointer';
    }
}

// Initialize treatment carousels on page load
document.addEventListener('DOMContentLoaded', function() {
    ['diagnostics', 'lasers', 'injectables'].forEach(function(carouselId) {
        const carousel = document.getElementById(carouselId + 'Carousel');
        if (carousel) {
            updateTreatmentCarouselButtons(carouselId);
            
            // Reset position on window resize
            window.addEventListener('resize', function() {
                treatmentCarouselIndices[carouselId] = 0;
                moveTreatmentCarousel(carouselId, 0);
            });
        }
    });
});

// Treatment Details Data
const treatmentDetails = {
    'visia-scan': {
        title: 'VISIA Skin Analysis System',
        image: 'Images/visia.png',
        description: 'The VISIA Skin Analysis System is the world\'s most advanced multi-spectral skin imaging technology, providing comprehensive assessment of your skin\'s biological age and health. This cutting-edge diagnostic tool captures high-resolution images using multiple wavelengths of light to reveal skin conditions that are invisible to the naked eye.',
        features: [
            { title: 'UV Damage', text: 'Detects sun damage and pigmentation issues beneath the skin surface' },
            { title: 'Wrinkles & Fine Lines', text: 'Maps facial wrinkles and analyzes skin texture' },
            { title: 'Pores & Texture', text: 'Evaluates pore size and skin smoothness' },
            { title: 'Pigmentation', text: 'Identifies brown spots, melasma, and uneven skin tone' },
            { title: 'Redness & Vascular', text: 'Maps broken capillaries, rosacea, and vascular concerns' },
            { title: 'Porphyrins', text: 'Detects bacteria in pores that can lead to acne' }
        ],
        conclusion: 'VISIA provides objective, quantifiable data that allows Dr. Zolman to create a personalized treatment protocol targeting your specific skin concerns. The system tracks your progress over time, measuring improvements in skin health and biological age reversal.'
    },
    'observ520': {
        title: 'SYLTON Observ520 Multi-Spectral Imaging',
        image: 'Images/observ .png',
        description: 'The SYLTON Observ520 is a revolutionary multi-spectral imaging system that uses advanced polarized light technology to visualize subsurface skin structures and conditions. This non-invasive diagnostic tool provides detailed analysis of skin layers that cannot be seen with standard photography.',
        features: [
            { title: 'Polarized Light Analysis', text: 'Reveals subsurface pigmentation, vascular structures, and skin texture' },
            { title: 'Multi-Spectral Imaging', text: 'Captures images at multiple wavelengths for comprehensive skin assessment' },
            { title: 'Subsurface Visualization', text: 'Detects conditions beneath the skin surface before they become visible' },
            { title: 'Progress Tracking', text: 'Monitors treatment effectiveness and skin health improvements over time' },
            { title: 'High Resolution', text: 'Provides detailed imaging for precise diagnosis and treatment planning' }
        ],
        conclusion: 'The Observ520 complements VISIA analysis by providing additional insights into skin structure and subsurface conditions, enabling Dr. Zolman to develop even more targeted and effective treatment protocols.'
    },
    'qoves-ai': {
        title: 'QOVES AI Aesthetics Analysis',
        image: 'Images/qoves.png',
        description: 'QOVES AI is an exclusive artificial intelligence-powered facial aesthetics analysis system available only at Collagen Clinic London. This cutting-edge technology uses advanced machine learning algorithms to analyze facial features, proportions, and aesthetic harmony, providing objective insights into facial beauty and aging patterns.',
        features: [
            { title: 'Facial Proportions', text: 'Evaluates golden ratio and facial symmetry' },
            { title: 'Aging Patterns', text: 'Identifies areas of volume loss, sagging, and structural changes' },
            { title: 'Skin Quality', text: 'Assesses texture, tone, and overall skin health' },
            { title: 'Facial Contouring', text: 'Analyzes bone structure and soft tissue distribution' },
            { title: 'Treatment Recommendations', text: 'Suggests personalized interventions based on AI analysis' }
        ],
        conclusion: 'QOVES AI provides Dr. Zolman with data-driven insights to create highly personalized treatment plans that optimize both skin health and facial aesthetics, ensuring natural-looking results that enhance your unique features.',
        video: '<iframe width="100%" height="400" src="https://www.youtube.com/embed/_gV3w8lm_z8" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border-radius: 8px; max-width: 100%; margin-top: 2rem;"></iframe>'
    },
    'body-surface-analysis': {
        title: 'Total Body Surface Area Analysis',
        image: 'Images/whole body.jpeg',
        description: 'Our comprehensive body surface area analysis provides a complete mapping of your skin\'s biological age across your entire body. This innovative diagnostic approach goes beyond facial assessment to evaluate skin health, sun damage, and aging patterns across all body regions.',
        features: [
            { title: 'Full Body Mapping', text: 'Evaluates skin condition across all body surfaces' },
            { title: 'Age Mapping', text: 'Identifies areas of accelerated aging and sun damage' },
            { title: 'Pigmentation Analysis', text: 'Maps hyperpigmentation and uneven skin tone across the body' },
            { title: 'Texture Evaluation', text: 'Assesses skin smoothness and quality in different body regions' },
            { title: 'Treatment Prioritization', text: 'Helps identify which areas need the most attention' }
        ],
        conclusion: 'This comprehensive analysis ensures that your treatment protocol addresses not just facial concerns, but optimizes skin health across your entire body, providing a truly holistic approach to skin rejuvenation.'
    },
    'glycation-analysis': {
        title: 'Glycation Skin Stiffness Analysis',
        image: 'Images/glycation.jpg',
        description: 'Glycation is a key biomarker of skin aging, where sugar molecules attach to collagen and elastin fibers, causing them to become stiff and brittle. Our non-invasive glycation analysis measures Advanced Glycation End-products (AGEs) in your skin, providing crucial insights into your skin\'s biological age and structural integrity.',
        features: [
            { title: 'Skin Stiffness', text: 'Measures the rigidity of collagen and elastin fibers' },
            { title: 'AGE Accumulation', text: 'Detects advanced glycation end-products that accelerate aging' },
            { title: 'Structural Integrity', text: 'Evaluates the health of your skin\'s support matrix' },
            { title: 'Biological Age', text: 'Provides a more accurate measure of skin aging than chronological age' },
            { title: 'Treatment Response', text: 'Tracks how interventions reduce glycation and improve skin elasticity' }
        ],
        conclusion: 'By measuring glycation, Dr. Zolman can identify the root causes of skin aging and develop targeted interventions to reduce AGE accumulation, restore skin elasticity, and reverse your skin\'s biological age.'
    },
    // Lasers & Devices
    'tixel': {
        title: 'TIXEL Rejuvenation',
        image: 'Images/tixel.jpg',
        description: 'TIXEL is a thermo-mechanical fractional treatment using heated titanium tips to create controlled micro-injuries, stimulating collagen production and skin renewal with minimal downtime.',
        features: [
            { title: 'Minimal Downtime', text: 'Quick recovery with minimal disruption to daily activities' },
            { title: 'Fractional Technology', text: 'Precise, controlled treatment targeting specific skin areas' },
            { title: 'Collagen Stimulation', text: 'Promotes natural collagen production for improved skin texture' }
        ],
        conclusion: 'TIXEL offers an effective solution for skin rejuvenation with minimal downtime, making it ideal for those seeking visible improvements without extended recovery periods.'
    },
    'genesis': {
        title: 'Genesis Laser Rejuvenation',
        image: 'Images/cutera.webp',
        description: 'Non-invasive laser therapy promoting collagen synthesis and improving skin texture through gentle heating of dermal tissues, suitable for all skin types.',
        features: [
            { title: 'No Downtime', text: 'Immediate return to normal activities after treatment' },
            { title: 'Collagen Boost', text: 'Stimulates natural collagen production for firmer, smoother skin' },
            { title: 'All Skin Types', text: 'Safe and effective for all skin types and tones' }
        ],
        conclusion: 'Genesis provides gentle yet effective skin rejuvenation with no downtime, perfect for maintaining healthy, youthful-looking skin.'
    },
    'gentlemax': {
        title: 'GentleMax Pro Plus',
        image: 'Images/candela.png',
        description: 'Advanced dual-wavelength laser system combining Alexandrite and Nd:YAG technologies for treating pigmented lesions and vascular conditions with superior safety and efficacy.',
        features: [
            { title: 'All Skin Types', text: 'Safe and effective treatment for all skin types' },
            { title: 'Pigmentation Treatment', text: 'Effectively treats age spots, sun damage, and pigmentation issues' }
        ],
        conclusion: 'GentleMax Pro Plus offers versatile treatment options for multiple skin concerns with proven safety and effectiveness.'
    },
    'lasemd': {
        title: 'LaseMD Ultra',
        image: 'Images/lutronic.jpg',
        description: 'Precision laser technology for treating age spots, sun damage, and pigmentation disorders through selective photothermolysis with minimal downtime and excellent safety profile.',
        features: [
            { title: 'Customizable', text: 'Treatment parameters can be tailored to individual skin needs' },
            { title: 'Pigmentation', text: 'Effectively targets and removes unwanted pigmentation' },
            { title: 'Minimal Downtime', text: 'Quick recovery with excellent safety profile' }
        ],
        conclusion: 'LaseMD Ultra provides precise, customizable treatment for pigmentation concerns with minimal downtime and excellent results.'
    },
    'ultraformer-hifu': {
        title: 'Ultraformer HIFU',
        image: 'Images/ultraformer.jpg',
        description: 'Non-surgical lifting treatment using High-Intensity Focused Ultrasound (HIFU) to target the SMAS layer, providing natural-looking skin tightening and lifting.',
        features: [
            { title: 'SMAS Layer', text: 'Targets the deep structural layer for natural lifting' },
            { title: 'No Downtime', text: 'Immediate return to normal activities' },
            { title: 'Non-Surgical', text: 'Achieves surgical-like results without surgery' }
        ],
        conclusion: 'Ultraformer HIFU offers non-surgical skin tightening and lifting with natural, long-lasting results.'
    },
    'keralase-hair': {
        title: 'KeraLase Hair Regeneration',
        image: 'Images/lutronic.jpg',
        description: 'Advanced laser treatment for hair regeneration and scalp health, promoting natural hair growth and improving scalp condition.',
        features: [
            { title: 'Hair Growth', text: 'Stimulates natural hair growth and regeneration' },
            { title: 'Scalp Treatment', text: 'Improves scalp health and condition' },
            { title: 'Non-Invasive', text: 'Safe, non-invasive treatment option' }
        ],
        conclusion: 'KeraLase provides effective hair regeneration treatment with proven results for hair loss and scalp health.'
    },
    'coolview': {
        title: 'CoolView Vascular Laser',
        image: 'Images/cutera.webp',
        description: 'Advanced laser system targeting vascular conditions and redness using precise 532 nm and Nd:YAG 1064 nm wavelengths for optimal treatment of broken capillaries, spider veins, and facial redness.',
        features: [
            { title: 'Spider Veins', text: 'Effectively treats spider veins and broken capillaries' },
            { title: 'Precision', text: 'Precise targeting of vascular lesions' },
            { title: 'Redness Reduction', text: 'Reduces facial redness and vascular concerns' }
        ],
        conclusion: 'CoolView provides precise, effective treatment for vascular conditions with minimal discomfort and excellent results.'
    },
    'exion-tightening': {
        title: 'EXION RF Tightening',
        image: 'Images/exion.jpg',
        description: 'Radiofrequency treatment for non-invasive skin tightening and lifting, promoting collagen production for firmer, more youthful skin.',
        features: [
            { title: 'Non-Invasive', text: 'No surgery required for skin tightening' },
            { title: 'Skin Lifting', text: 'Provides natural lifting and tightening effects' },
            { title: 'Collagen Production', text: 'Stimulates natural collagen for long-term results' }
        ],
        conclusion: 'EXION RF offers effective non-invasive skin tightening with natural, long-lasting results.'
    },
    'exion-microneedling': {
        title: 'EXION RF Microneedling',
        image: 'Images/exion.jpg',
        description: 'Combined radiofrequency and microneedling technology for deep skin remodeling and texture improvement, targeting multiple skin concerns simultaneously.',
        features: [
            { title: 'Deep Remodeling', text: 'Targets deep skin layers for comprehensive improvement' },
            { title: 'Texture Improvement', text: 'Significantly improves skin texture and smoothness' },
            { title: 'Combined Technology', text: 'RF and microneedling work synergistically for enhanced results' }
        ],
        conclusion: 'EXION RF Microneedling provides deep skin remodeling with significant texture and appearance improvements.'
    },
    // Injectables & Peels
    'dermal-fillers': {
        title: 'Dermal Fillers',
        image: 'Images/filler.jpg',
        description: 'Advanced hyaluronic acid and bio-stimulating fillers for facial contouring, volume restoration, and wrinkle reduction. Precise injection techniques for natural-looking results and facial rejuvenation.',
        features: [
            { title: 'Hyaluronic Acid', text: 'Natural, safe filler material that integrates with your skin' },
            { title: 'Natural Results', text: 'Achieves natural-looking volume and contour improvements' },
            { title: 'Volume Restoration', text: 'Restores lost volume for a more youthful appearance' }
        ],
        conclusion: 'Dermal fillers provide natural-looking volume restoration and wrinkle reduction with immediate, visible results.'
    },
    'botox': {
        title: 'Botox',
        image: 'Images/botox.webp',
        description: 'FDA-approved botulinum toxin treatment for wrinkle relaxation and facial rejuvenation, providing smooth, natural-looking results.',
        features: [
            { title: 'FDA Approved', text: 'Proven safe and effective with FDA approval' },
            { title: 'Proven Results', text: 'Clinically proven to reduce wrinkles and fine lines' },
            { title: 'Wrinkle Relaxation', text: 'Smooth, natural-looking wrinkle reduction' }
        ],
        conclusion: 'Botox offers safe, effective wrinkle reduction with proven, natural-looking results.'
    },
    'julaine': {
        title: 'Julaine',
        image: 'Images/julaine.jpg',
        description: 'Premium advanced injectable treatment for facial rejuvenation and volume enhancement, providing long-lasting, natural results.',
        features: [
            { title: 'Premium Formula', text: 'High-quality, advanced formulation' },
            { title: 'Long-Lasting', text: 'Extended duration of results' },
            { title: 'Natural Enhancement', text: 'Achieves natural-looking facial improvements' }
        ],
        conclusion: 'Julaine provides premium facial enhancement with long-lasting, natural results.'
    },
    'rejuran': {
        title: 'Rejuran Polynucleotides',
        image: 'Images/rejuran.jpeg',
        description: 'Advanced skin healing and regeneration treatment using polynucleotides to promote DNA repair and cellular rejuvenation.',
        features: [
            { title: 'DNA Repair', text: 'Promotes cellular DNA repair and regeneration' },
            { title: 'Healing', text: 'Accelerates skin healing and recovery' },
            { title: 'Skin Healer', text: 'Comprehensive skin health improvement' }
        ],
        conclusion: 'Rejuran promotes deep skin healing and regeneration for improved overall skin health and appearance.'
    },
    'sculptra': {
        title: 'Sculptra',
        image: 'Images/Sculptra-Ploly-L-Milchsaure.jpg.webp',
        description: 'Collagen stimulator for natural volume restoration and facial contouring, providing gradual, long-lasting results through natural collagen production.',
        features: [
            { title: 'Long-Lasting', text: 'Results last up to 2 years or more' },
            { title: 'Natural Volume', text: 'Stimulates your body\'s own collagen for natural volume' },
            { title: 'Collagen Stimulator', text: 'Promotes natural collagen production' }
        ],
        conclusion: 'Sculptra provides natural, long-lasting volume restoration through your body\'s own collagen production.'
    },
    'sunekos': {
        title: 'Sunekos',
        image: 'Images/sunekos.png',
        description: 'Injectable biostimulator combining amino acids and hyaluronic acid to regenerate the skin\'s Extracellular Matrix (ECM), stimulating natural collagen and elastin production.',
        features: [
            { title: 'FDA Approved', text: 'Proven safe and effective treatment' },
            { title: 'Natural Results', text: 'Stimulates your body\'s natural regenerative processes' },
            { title: 'Skin Revitalisation', text: 'Comprehensive skin health and appearance improvement' }
        ],
        conclusion: 'Sunekos promotes natural skin regeneration and revitalization for improved skin health and youthful appearance.'
    },
    'peels': {
        title: 'Chemical Peels',
        image: 'Images/peel.png',
        description: 'Advanced chemical exfoliation treatments for skin resurfacing, renewal, and improvement of texture, tone, and overall skin appearance.',
        features: [
            { title: 'Exfoliation', text: 'Removes dead skin cells for smoother texture' },
            { title: 'Renewal', text: 'Promotes skin cell renewal and regeneration' },
            { title: 'Texture Improvement', text: 'Significantly improves skin texture and appearance' }
        ],
        conclusion: 'Chemical peels provide effective skin resurfacing and renewal for improved texture and appearance.'
    },
    'exosomes': {
        title: 'Exosomes',
        image: 'Images/exosomes rose new.webp',
        description: 'Regenerative medicine treatment using exosomes to promote cell communication and skin regeneration, providing advanced anti-aging benefits.',
        features: [
            { title: 'Cell Communication', text: 'Enhances cellular communication for improved skin function' },
            { title: 'Regeneration', text: 'Promotes deep skin regeneration and repair' },
            { title: 'Regenerative Medicine', text: 'Cutting-edge regenerative treatment technology' }
        ],
        conclusion: 'Exosomes represent the future of regenerative medicine, promoting deep skin regeneration and anti-aging benefits.'
    }
};

// Treatment Modal Functions
function showTreatmentModal(treatmentId) {
    const modal = document.getElementById('treatmentModal');
    const modalContent = document.getElementById('treatmentModalContent');
    
    if (!modal || !modalContent) return;
    
    const treatment = treatmentDetails[treatmentId];
    
    if (!treatment) {
        modalContent.innerHTML = '<p>Treatment details coming soon...</p>';
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        return;
    }
    
    // Build the modal content
    let html = `
        <div style="display: grid; grid-template-columns: 200px 1fr; gap: 2.5rem; align-items: start;">
            <div>
                <img src="${treatment.image}" alt="${treatment.title}" style="width: 100%; height: auto; border-radius: 8px;">
            </div>
            <div>
                <h3 style="font-size: 2rem; font-weight: 600; margin-bottom: 1rem; color: #1a1a1a;">${treatment.title}</h3>
                <p style="font-size: 1.3rem; line-height: 1.8; color: #2c2c2c; margin-bottom: 1.5rem;">
                    ${treatment.description}
                </p>
    `;
    
    if (treatment.features && treatment.features.length > 0) {
        // Determine the section title based on treatment type
        let sectionTitle = 'Key Features:';
        if (treatment.features[0].title.includes('UV') || treatment.features[0].title.includes('Wrinkles')) {
            sectionTitle = 'What VISIA Measures:';
        } else if (treatment.features[0].title.includes('Polarized')) {
            sectionTitle = 'Key Features:';
        } else if (treatment.features[0].title.includes('Facial')) {
            sectionTitle = 'What QOVES AI Analyzes:';
        } else if (treatment.features[0].title.includes('Full') || treatment.features[0].title.includes('Age Mapping')) {
            sectionTitle = 'Comprehensive Assessment:';
        } else if (treatment.features[0].title.includes('Skin Stiffness')) {
            sectionTitle = 'What Glycation Analysis Reveals:';
        }
        
        html += `
                <div style="margin-top: 2rem;">
                    <h4 style="font-size: 1.4rem; font-weight: 600; margin-bottom: 1rem; color: #1a1a1a;">${sectionTitle}</h4>
                    <ul style="list-style: none; padding: 0; margin: 0;">
        `;
        
        treatment.features.forEach((feature, index) => {
            html += `
                <li style="padding: 0.75rem 0; ${index < treatment.features.length - 1 ? 'border-bottom: 1px solid #f0f0f0;' : ''} font-size: 1.2rem; line-height: 1.6;">
                    <strong style="color: #1a1a1a;">${feature.title}:</strong> ${feature.text}
                </li>
            `;
        });
        
        html += `
                    </ul>
                </div>
        `;
    }
    
    if (treatment.conclusion) {
        html += `
                <p style="font-size: 1.3rem; line-height: 1.8; color: #2c2c2c; margin-top: 2rem;">
                    ${treatment.conclusion}
                </p>
        `;
    }
    
    if (treatment.video) {
        html += treatment.video;
    }
    
    html += `
            </div>
        </div>
    `;
    
    modalContent.innerHTML = html;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeTreatmentModal() {
    const modal = document.getElementById('treatmentModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('treatmentModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeTreatmentModal();
            }
        });
    }
    
    // Initialize lazy loading for images
    initializeLazyLoading();
    
    // Initialize accessibility enhancements
    initializeAccessibility();
});

// ============================================
// LAZY LOADING FOR IMAGES AND COMPONENTS
// ============================================

function initializeLazyLoading() {
    // Use native lazy loading if supported, otherwise use Intersection Observer
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading supported
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.loading = 'lazy';
        });
    } else {
        // Fallback to Intersection Observer
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Handle data-src attribute
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    
                    // Handle srcset for responsive images
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                        img.removeAttribute('data-srcset');
                    }
                    
                    // Handle sizes attribute
                    if (img.dataset.sizes) {
                        img.sizes = img.dataset.sizes;
                        img.removeAttribute('data-sizes');
                    }
                    
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px' // Start loading 50px before image enters viewport
        });
        
        // Observe all images with data-src attribute
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Lazy load background images using Intersection Observer
    const backgroundImageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                if (element.dataset.bgImage) {
                    element.style.backgroundImage = `url(${element.dataset.bgImage})`;
                    element.removeAttribute('data-bg-image');
                    element.classList.add('loaded');
                }
                observer.unobserve(element);
            }
        });
    }, {
        rootMargin: '100px'
    });
    
    const lazyBackgrounds = document.querySelectorAll('[data-bg-image]');
    lazyBackgrounds.forEach(el => {
        backgroundImageObserver.observe(el);
    });
    
    // Lazy load iframes (videos, embeds)
    const iframeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const iframe = entry.target;
                if (iframe.dataset.src) {
                    iframe.src = iframe.dataset.src;
                    iframe.removeAttribute('data-src');
                    iframe.classList.add('loaded');
                }
                observer.unobserve(iframe);
            }
        });
    }, {
        rootMargin: '200px'
    });
    
    const lazyIframes = document.querySelectorAll('iframe[data-src]');
    lazyIframes.forEach(iframe => {
        iframeObserver.observe(iframe);
    });
}

// ============================================
// ACCESSIBILITY ENHANCEMENTS
// ============================================

function initializeAccessibility() {
    // Add skip to main content link if it doesn't exist
    if (!document.querySelector('.skip-to-main')) {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-to-main';
        skipLink.textContent = 'Skip to main content';
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    // Add main landmark if it doesn't exist
    if (!document.querySelector('main, [role="main"]')) {
        const mainContent = document.querySelector('.hero, .container, body > section');
        if (mainContent && !mainContent.closest('main')) {
            const mainElement = document.createElement('main');
            mainElement.id = 'main-content';
            mainElement.setAttribute('role', 'main');
            
            // Wrap first section in main
            const firstSection = document.querySelector('body > section, .hero');
            if (firstSection) {
                firstSection.parentNode.insertBefore(mainElement, firstSection);
                let nextSibling = firstSection;
                while (nextSibling && nextSibling !== document.querySelector('footer')) {
                    const current = nextSibling;
                    nextSibling = current.nextElementSibling;
                    mainElement.appendChild(current);
                }
            }
        }
    }
    
    // Enhance navigation with ARIA labels
    const nav = document.querySelector('nav');
    if (nav && !nav.getAttribute('aria-label')) {
        nav.setAttribute('aria-label', 'Main navigation');
    }
    
    // Enhance buttons with proper ARIA labels
    const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
    buttons.forEach(button => {
        if (!button.textContent.trim() && button.querySelector('span')) {
            button.setAttribute('aria-label', button.querySelector('span').textContent);
        }
    });
    
    // Enhance hamburger menu
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.setAttribute('aria-label', 'Toggle navigation menu');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-controls', 'nav-menu');
        
        hamburger.addEventListener('click', function() {
            const isExpanded = this.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);
        });
    }
    
    // Add keyboard navigation improvements
    document.addEventListener('keydown', function(e) {
        // Escape key closes mobile menu
        if (e.key === 'Escape') {
            const navMenu = document.querySelector('.nav-menu');
            const hamburger = document.querySelector('.hamburger');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (hamburger) {
                    hamburger.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                }
            }
        }
    });
    
    // Improve focus management for modals
    const modals = document.querySelectorAll('[role="dialog"], .modal');
    modals.forEach(modal => {
        modal.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const closeButton = modal.querySelector('[aria-label*="close"], .close-button, button');
                if (closeButton) {
                    closeButton.click();
                }
            }
        });
    });
    
    // Announce dynamic content changes to screen readers
    const announcementRegion = document.createElement('div');
    announcementRegion.setAttribute('role', 'status');
    announcementRegion.setAttribute('aria-live', 'polite');
    announcementRegion.setAttribute('aria-atomic', 'true');
    announcementRegion.className = 'sr-only';
    announcementRegion.id = 'announcements';
    document.body.appendChild(announcementRegion);
    
    // Function to announce messages
    window.announceToScreenReader = function(message) {
        announcementRegion.textContent = message;
        setTimeout(() => {
            announcementRegion.textContent = '';
        }, 1000);
    };
}

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

// Defer non-critical scripts
document.addEventListener('DOMContentLoaded', function() {
    // Load external resources after initial render
    if ('requestIdleCallback' in window) {
        requestIdleCallback(function() {
            // Load non-critical resources here
            loadExternalResources();
        });
    } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(loadExternalResources, 2000);
    }
});

function loadExternalResources() {
    // Load fonts if not already loaded
    // Load analytics scripts
    // Load social media widgets
    // etc.
}

// ============================================
// RESPONSIVE IMAGE HANDLING
// ============================================

function createResponsiveImage(img, srcset, sizes) {
    if (!img || !srcset) return;
    
    // Set srcset for responsive images
    img.srcset = srcset;
    
    // Set sizes attribute for responsive breakpoints
    if (sizes) {
        img.sizes = sizes;
    } else {
        // Default sizes
        img.sizes = '(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw';
    }
    
    // Add loading attribute
    img.loading = 'lazy';
}

// Auto-generate responsive image sets
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img:not([srcset])');
    images.forEach(img => {
        const src = img.src || img.dataset.src;
        if (src && !src.includes('data:image')) {
            // Create responsive srcset (simplified - in production, generate multiple sizes)
            const baseName = src.replace(/\.[^/.]+$/, '');
            const extension = src.split('.').pop();
            
            // Check if image supports responsive loading
            if (img.hasAttribute('data-responsive') || img.classList.contains('responsive-image')) {
                img.srcset = `
                    ${baseName}-480w.${extension} 480w,
                    ${baseName}-768w.${extension} 768w,
                    ${baseName}-1024w.${extension} 1024w,
                    ${baseName}-1400w.${extension} 1400w
                `.replace(/\s+/g, ' ').trim();
                
                img.sizes = '(max-width: 480px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 50vw, 1400px';
            }
        }
    });
});