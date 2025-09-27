// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
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
            border-left: 4px solid #d4af37;
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
                    serviceSelect.style.border = '2px solid #d4af37';
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
                border-top: 4px solid #d4af37;
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
                <h3 style="color: #d4af37; margin-bottom: 1rem;">📱 Instant WhatsApp Booking</h3>
                <p style="margin-bottom: 2rem; color: #666; font-size: 1.1rem;">
                    Book your appointment instantly via WhatsApp<br>
                    Get immediate confirmation and personalized service
                </p>
                
                <div class="whatsapp-booking-options" style="display: flex; flex-direction: column; gap: 1rem; max-width: 500px; margin: 0 auto;">
                    <button onclick="bookViaWhatsApp('diagnostic')" class="whatsapp-book-btn diagnostic">
                        <span class="service-icon">💎</span>
                        <div class="service-details">
                            <strong>Skin Diagnostic Package</strong>
                            <span class="price">£250</span>
                        </div>
                        <span class="whatsapp-icon">💬</span>
                    </button>
                    
                    <button onclick="bookViaWhatsApp('complete')" class="whatsapp-book-btn complete">
                        <span class="service-icon">🌟</span>
                        <div class="service-details">
                            <strong>Complete Health Package</strong>
                            <span class="price">£1,500</span>
                        </div>
                        <span class="whatsapp-icon">💬</span>
                    </button>
                    
                    <button onclick="bookViaWhatsApp('consultation')" class="whatsapp-book-btn consultation">
                        <span class="service-icon">📋</span>
                        <div class="service-details">
                            <strong>Initial Consultation</strong>
                            <span class="price">Enquire</span>
                        </div>
                        <span class="whatsapp-icon">💬</span>
                    </button>
                </div>
                
                <div style="margin-top: 2rem; padding: 1rem; background: rgba(212, 175, 55, 0.1); border-radius: 8px; border-left: 4px solid #d4af37;">
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

// Treatment Detail Modal (Dr. Lamiche Style)
function showTreatmentDetail(treatmentId) {
    const treatments = {
        'tixel': {
            name: 'TIXEL',
            fullName: 'TIXEL Skin Rejuvenation',
            image: 'Images/tixel.jpg',
            tagline: 'Revolutionary fractional technology for comprehensive skin rejuvenation.',
            subtitle: 'Pain DOWN, Effect UP',
            mainDescription: 'The TIXEL treatment uses thermo-mechanical fractional technology to create controlled micro-injuries, stimulating natural healing and collagen production for comprehensive skin renewal.',
            whoTitle: 'Recommended candidates for TIXEL',
            whoCandidates: [
                'Those who want to improve fine lines and wrinkles',
                'Those who want to improve acne scars and skin texture',
                'Those who want to minimize pore size and improve skin elasticity',
                'Those seeking skin rejuvenation with minimal downtime'
            ],
            howTitle: 'How TIXEL Works',
            howDescription: 'TIXEL uses heated titanium tips to deliver controlled thermal energy to the skin.',
            howDetails: 'Unlike traditional fractional lasers, TIXEL uses thermo-mechanical technology with heated titanium tips that create precise micro-injuries in the skin. This stimulates the body\'s natural healing response, promoting collagen production and skin renewal while maintaining optimal safety and comfort.',
            link: 'treatments/tixel-rejuvenation.html'
        },
        'genesis': {
            name: 'Genesis',
            fullName: 'Genesis Laser Rejuvenation',
            image: 'Images/cutera.webp',
            tagline: 'Non-invasive laser treatment for immediate skin improvement.',
            subtitle: 'No Downtime, Immediate Results',
            mainDescription: 'Genesis laser treatment promotes collagen synthesis and improves skin texture through gentle heating of dermal tissues, suitable for all skin types with no downtime required.',
            whoTitle: 'Recommended candidates for Genesis',
            whoCandidates: [
                'Those who want immediate skin tone improvement',
                'Those who want to reduce pore size',
                'Those seeking collagen stimulation without downtime',
                'Those with sensitive skin requiring gentle treatment'
            ],
            howTitle: 'How Genesis Works',
            howDescription: 'Genesis uses gentle laser energy to heat dermal tissues and stimulate collagen production.',
            howDetails: 'The Genesis laser delivers controlled thermal energy to the dermis, promoting natural collagen synthesis and improving overall skin quality. The treatment is comfortable and requires no downtime, making it ideal for patients seeking immediate results.',
            link: 'treatments/genesis-rejuvenation.html'
        },
        'ultraformer': {
            name: 'UltraFormer III',
            fullName: 'UltraFormer III HIFU',
            image: 'Images/hifu.png',
            tagline: 'High-Intensity Focused Ultrasound for non-surgical lifting.',
            subtitle: 'Non-Surgical Lifting, Deep Results',
            mainDescription: 'UltraFormer III uses HIFU technology to deliver precise thermal energy to multiple tissue depths for comprehensive facial lifting and tightening without surgery.',
            whoTitle: 'Recommended candidates for UltraFormer III',
            whoCandidates: [
                'Those who want non-surgical skin lifting',
                'Those concerned about sagging skin and loss of elasticity',
                'Those who want to improve facial contours',
                'Those seeking deep tissue tightening without surgery'
            ],
            howTitle: 'How UltraFormer III Works',
            howDescription: 'UltraFormer III uses High-Intensity Focused Ultrasound to target multiple tissue depths.',
            howDetails: 'The UltraFormer III delivers precise ultrasound energy to specific depths in the skin and underlying tissues, creating thermal coagulation points that stimulate collagen production and tissue contraction for lifting and tightening effects.',
            link: 'treatments/ultraformer-iii.html'
        },
        'gentlemax': {
            name: 'GentleMax Pro Plus',
            fullName: 'Candela GentleMax Pro Plus',
            image: 'Images/candela.png',
            tagline: 'Advanced dual-wavelength laser system for comprehensive treatments.',
            subtitle: 'Two Wavelengths, Superior Results',
            mainDescription: 'GentleMax Pro Plus combines Alexandrite and Nd:YAG laser technologies for treating pigmented lesions, vascular conditions, and unwanted hair with superior safety and efficacy.',
            whoTitle: 'Recommended candidates for GentleMax Pro Plus',
            whoCandidates: [
                'Those seeking permanent hair reduction on all skin types',
                'Those with pigmented lesions and sun damage',
                'Those with vascular conditions like spider veins',
                'Those wanting versatile laser treatment options'
            ],
            howTitle: 'How GentleMax Pro Plus Works',
            howDescription: 'Dual-wavelength system using 755nm Alexandrite and 1064nm Nd:YAG lasers.',
            howDetails: 'The system combines two powerful wavelengths: 755nm Alexandrite for lighter skin types and pigmented lesions, and 1064nm Nd:YAG for darker skin types and deeper vascular lesions. This dual approach ensures optimal results across all skin types.',
            link: 'treatments/candela-gentlemax-pro-plus.html'
        },
        'lasemd': {
            name: 'LaseMD Ultra',
            fullName: 'Lutronic LaseMD Ultra',
            image: 'Images/lutronic.jpg',
            tagline: 'Advanced fractional thulium laser for customizable treatments.',
            subtitle: 'Customizable Intensity, Precise Results',
            mainDescription: 'LaseMD Ultra uses fractional thulium laser technology for comprehensive skin resurfacing, pigmentation correction, and anti-aging treatments with customizable intensity levels.',
            whoTitle: 'Recommended candidates for LaseMD Ultra',
            whoCandidates: [
                'Those with age spots and sun damage',
                'Those seeking skin resurfacing with minimal downtime',
                'Those with pigmentation disorders',
                'Those wanting customizable treatment intensity'
            ],
            howTitle: 'How LaseMD Ultra Works',
            howDescription: 'Fractional thulium laser creates controlled micro-channels for skin renewal.',
            howDetails: 'The 1927nm thulium laser creates microscopic channels in the skin, removing damaged tissue and stimulating natural healing processes. The fractional approach ensures faster recovery while achieving significant improvements in skin quality.',
            link: 'treatments/lutronic-lasemd-ultra.html'
        },
        'coolview': {
            name: 'CoolView',
            fullName: 'CoolView Vascular Laser',
            image: 'Images/cutera.webp',
            tagline: 'Precision vascular treatment with advanced cooling.',
            subtitle: 'Precision Targeting, Enhanced Comfort',
            mainDescription: 'CoolView uses advanced laser technology with cooling systems to target spider veins, broken capillaries, and vascular lesions with maximum precision and comfort.',
            whoTitle: 'Recommended candidates for CoolView',
            whoCandidates: [
                'Those with spider veins and broken capillaries',
                'Those with facial redness and rosacea',
                'Those with vascular lesions',
                'Those seeking precise vascular treatments'
            ],
            howTitle: 'How CoolView Works',
            howDescription: 'Advanced laser system with integrated cooling for vascular treatments.',
            howDetails: 'CoolView combines precise laser energy with advanced cooling technology to selectively target vascular lesions while protecting surrounding tissue. The integrated cooling system ensures maximum comfort during treatment.',
            link: 'treatments/coolview-vascular-laser.html'
        },
        'exion-face': {
            name: 'EXION Face',
            fullName: 'EXION Face Skin Tightening',
            image: 'Images/exion-face.jpg',
            tagline: 'Advanced facial skin tightening with BTL technology.',
            subtitle: 'Non-Invasive Facial Tightening',
            mainDescription: 'EXION Face combines radiofrequency and targeted energy delivery to provide comprehensive facial skin tightening, firming, and wrinkle reduction without surgery or downtime.',
            whoTitle: 'Recommended candidates for EXION Face',
            whoCandidates: [
                'Those with mild to moderate facial aging signs',
                'Those seeking non-surgical facial rejuvenation',
                'Those wanting to improve skin texture and tone',
                'Those looking for comfortable treatments with no downtime'
            ],
            howTitle: 'How EXION Face Works',
            howDescription: 'Advanced BTL technology delivers precise energy for optimal facial skin tightening.',
            howDetails: 'EXION Face utilizes BTL\'s advanced radiofrequency technology to deliver controlled thermal energy to facial tissues, stimulating collagen production and tissue remodeling for natural-looking facial skin tightening and firming.',
            link: 'treatments/exion-face.html'
        },
        'exion-body': {
            name: 'EXION Body',
            fullName: 'EXION Body Contouring',
            image: 'Images/exion-body.jpg',
            tagline: 'Revolutionary body contouring and fat reduction.',
            subtitle: 'Advanced Body Sculpting Technology',
            mainDescription: 'EXION Body delivers powerful radiofrequency energy for effective fat reduction and skin tightening across various body areas, providing comprehensive body contouring results.',
            whoTitle: 'Recommended candidates for EXION Body',
            whoCandidates: [
                'Those with stubborn fat deposits resistant to diet and exercise',
                'Those seeking non-surgical body contouring',
                'Those wanting skin tightening with fat reduction',
                'Those looking for effective body sculpting treatments'
            ],
            howTitle: 'How EXION Body Works',
            howDescription: 'Powerful radiofrequency technology targets fat cells and tightens skin.',
            howDetails: 'EXION Body uses BTL\'s advanced radiofrequency technology to heat adipose tissue to therapeutic temperatures, causing fat cell destruction while simultaneously stimulating collagen production for improved skin tightening and body contouring.',
            link: 'treatments/exion-body.html'
        },
        'exion-fractional': {
            name: 'EXION Fractional',
            fullName: 'EXION Fractional Skin Resurfacing',
            image: 'Images/exion-fractional.jpg',
            tagline: 'Fractional radiofrequency for skin texture improvement.',
            subtitle: 'Advanced Skin Resurfacing Technology',
            mainDescription: 'EXION Fractional delivers precise fractional radiofrequency energy to improve skin texture, reduce fine lines, and enhance overall skin quality with minimal downtime.',
            whoTitle: 'Recommended candidates for EXION Fractional',
            whoCandidates: [
                'Those with skin texture concerns and irregularities',
                'Those seeking fine line and wrinkle reduction',
                'Those wanting to improve skin tone and clarity',
                'Those looking for advanced skin resurfacing treatments'
            ],
            howTitle: 'How EXION Fractional Works',
            howDescription: 'Fractional RF energy creates controlled micro-zones for skin renewal.',
            howDetails: 'EXION Fractional uses fractional radiofrequency technology to create controlled thermal zones in the skin, triggering natural healing processes that stimulate collagen production and improve skin texture, tone, and overall quality.',
            link: 'treatments/exion-fractional.html'
        },
        'exion-forma': {
            name: 'EXION Forma',
            fullName: 'EXION Forma Deep Heating',
            image: 'Images/exion-forma.jpg',
            tagline: 'Comfortable deep tissue heating for collagen stimulation.',
            subtitle: 'Temperature-Controlled RF Technology',
            mainDescription: 'EXION Forma provides comfortable, temperature-controlled radiofrequency heating to stimulate deep collagen production and improve skin elasticity without discomfort.',
            whoTitle: 'Recommended candidates for EXION Forma',
            whoCandidates: [
                'Those seeking comfortable skin tightening treatments',
                'Those with sensitive skin requiring gentle procedures',
                'Those wanting gradual, natural-looking results',
                'Those looking for relaxing anti-aging treatments'
            ],
            howTitle: 'How EXION Forma Works',
            howDescription: 'Temperature-controlled RF ensures comfortable and effective treatment.',
            howDetails: 'EXION Forma uses advanced temperature monitoring and control to deliver optimal radiofrequency energy levels, ensuring comfortable treatment while maximizing collagen stimulation and skin tightening benefits.',
            link: 'treatments/exion-forma.html'
        },
        'exion-morpheus': {
            name: 'EXION Morpheus8',
            fullName: 'EXION Morpheus8 RF Microneedling',
            image: 'Images/exion-morpheus.jpg',
            tagline: 'Revolutionary fractional RF microneedling technology.',
            subtitle: 'Deep Tissue Remodeling',
            mainDescription: 'EXION Morpheus8 combines fractional radiofrequency with microneedling to deliver energy deep into the skin for comprehensive tissue remodeling and dramatic skin rejuvenation.',
            whoTitle: 'Recommended candidates for EXION Morpheus8',
            whoCandidates: [
                'Those with deeper skin concerns and aging signs',
                'Those seeking dramatic skin transformation',
                'Those wanting to address acne scarring',
                'Those looking for advanced skin remodeling treatments'
            ],
            howTitle: 'How EXION Morpheus8 Works',
            howDescription: 'Fractional RF microneedling delivers energy deep into tissue layers.',
            howDetails: 'EXION Morpheus8 uses fractional radiofrequency delivered through ultra-fine microneedles to penetrate deep into the skin, creating controlled thermal zones that stimulate extensive collagen and elastin production for comprehensive skin remodeling.',
            link: 'treatments/exion-morpheus8.html'
        },
        'dermal-fillers': {
            name: 'Dermal Fillers',
            fullName: 'Premium Dermal Fillers',
            image: 'Images/filler.jpg',
            tagline: 'Restore volume and enhance facial contours with premium hyaluronic acid.',
            subtitle: 'Instant Results, Natural Enhancement',
            mainDescription: 'Premium dermal fillers using advanced hyaluronic acid formulations to restore facial volume, smooth wrinkles, and enhance natural beauty with immediate, long-lasting results.',
            whoTitle: 'Recommended candidates for Dermal Fillers',
            whoCandidates: [
                'Those seeking to restore lost facial volume',
                'Those wanting to smooth lines and wrinkles',
                'Those looking to enhance lip volume and definition',
                'Those desiring natural-looking facial rejuvenation'
            ],
            howTitle: 'How Dermal Fillers Work',
            howDescription: 'Hyaluronic acid gel injections restore volume and stimulate collagen.',
            howDetails: 'Premium dermal fillers contain cross-linked hyaluronic acid that integrates with natural tissue to restore volume and hydration. The treatment stimulates natural collagen production while providing immediate volumizing effects that can last 12-18 months.',
            link: 'treatments/dermal-fillers.html'
        },
        'botox': {
            name: 'Botox',
            fullName: 'Botox Neurotoxin Treatment',
            image: 'Images/botox.webp',
            tagline: 'FDA-approved neurotoxin for dynamic wrinkle reduction and muscle relaxation.',
            subtitle: 'Proven Results, Minimal Downtime',
            mainDescription: 'Botox is a purified neurotoxin that temporarily relaxes facial muscles to reduce the appearance of dynamic wrinkles, providing a smoother, more youthful appearance with minimal downtime.',
            whoTitle: 'Recommended candidates for Botox',
            whoCandidates: [
                'Those with dynamic wrinkles from facial expressions',
                'Those seeking preventative anti-aging treatment',
                'Those with forehead lines, crow\'s feet, or frown lines',
                'Those looking for non-surgical wrinkle reduction'
            ],
            howTitle: 'How Botox Works',
            howDescription: 'Botulinum toxin temporarily blocks nerve signals to targeted facial muscles.',
            howDetails: 'Botox works by temporarily blocking nerve signals that cause muscle contractions. When injected into specific facial muscles, it prevents them from contracting, which smooths out dynamic wrinkles and prevents new ones from forming. Results typically last 3-6 months.',
            link: 'treatments/botox.html'
        },
        'julaine': {
            name: 'Julaine',
            fullName: 'Julaine Premium Dermal Filler',
            image: 'Images/julaine.jpg',
            tagline: 'Advanced hyaluronic acid filler for superior volume restoration and facial contouring.',
            subtitle: 'Premium Quality, Long-Lasting Results',
            mainDescription: 'Julaine is a premium hyaluronic acid-based dermal filler designed for superior volume restoration, facial contouring, and wrinkle correction with advanced cross-linking technology for longer-lasting results.',
            whoTitle: 'Recommended candidates for Julaine',
            whoCandidates: [
                'Those seeking premium volume restoration',
                'Those wanting enhanced facial contouring',
                'Those looking for long-lasting filler results',
                'Those desiring natural-looking facial enhancement'
            ],
            howTitle: 'How Julaine Works',
            howDescription: 'Advanced hyaluronic acid with superior cross-linking technology for optimal results.',
            howDetails: 'Julaine utilizes advanced cross-linking technology to create a premium hyaluronic acid gel that integrates seamlessly with natural tissue. This advanced formulation provides superior volume restoration, enhanced longevity, and natural-looking results that can last 12-18 months.',
            link: 'treatments/julaine.html'
        },
        'tixeltox': {
            name: 'TixelTox',
            fullName: 'TixelTox Combination Treatment',
            image: 'Images/tixel.jpg',
            tagline: 'Revolutionary combination of TIXEL resurfacing with precision toxin treatment.',
            subtitle: 'Dual Action, Maximum Results',
            mainDescription: 'TixelTox combines the power of TIXEL fractional resurfacing with strategic toxin placement for comprehensive facial rejuvenation and wrinkle reduction.',
            whoTitle: 'Recommended candidates for TixelTox',
            whoCandidates: [
                'Those seeking comprehensive facial rejuvenation',
                'Those with both dynamic and static wrinkles',
                'Those wanting maximum anti-aging results',
                'Those looking for advanced combination treatments'
            ],
            howTitle: 'How TixelTox Works',
            howDescription: 'Combines TIXEL fractional technology with precision neurotoxin treatment.',
            howDetails: 'TixelTox integrates TIXEL\'s thermo-mechanical fractional resurfacing to improve skin texture and quality, with strategically placed neurotoxin injections to address dynamic wrinkles. This dual approach provides comprehensive facial rejuvenation with enhanced, longer-lasting results.',
            link: 'treatments/tixeltox.html'
        },
        'rejuran': {
            name: 'Rejuran Polynucleotides',
            fullName: 'Rejuran Polynucleotide Treatment',
            image: 'Images/rejuran.jpeg',
            tagline: 'Polynucleotide skin healer for comprehensive skin repair and regeneration.',
            subtitle: 'DNA Repair Technology, Natural Healing',
            mainDescription: 'Rejuran contains polynucleotides derived from salmon DNA that promote natural skin healing and regeneration, stimulating collagen production and improving skin elasticity for comprehensive skin repair.',
            whoTitle: 'Recommended candidates for Rejuran',
            whoCandidates: [
                'Those with damaged or aging skin',
                'Those with acne scars and skin texture issues',
                'Those seeking natural skin healing and repair',
                'Those wanting to improve skin elasticity and firmness'
            ],
            howTitle: 'How Rejuran Works',
            howDescription: 'Polynucleotides from salmon DNA stimulate natural healing and collagen production.',
            howDetails: 'Rejuran uses polynucleotides (PN) derived from salmon DNA that are biocompatible with human tissue. These molecules promote cellular regeneration, stimulate collagen and elastin production, and enhance the skin\'s natural healing processes, resulting in improved texture, reduced scarring, and enhanced overall skin quality.',
            link: 'treatments/rejuran.html'
        },
        'profhilo': {
            name: 'Profhilo',
            fullName: 'Profhilo Bio-Remodelling Treatment',
            image: 'Images/profhilo.png',
            tagline: 'High-concentration hyaluronic acid for deep hydration and bio-remodelling.',
            subtitle: 'Bio-Remodelling Technology, Deep Hydration',
            mainDescription: 'Profhilo is a revolutionary bio-remodelling treatment using high-concentration hyaluronic acid to provide deep skin hydration, stimulate collagen and elastin production, and improve skin firmness and elasticity.',
            whoTitle: 'Recommended candidates for Profhilo',
            whoCandidates: [
                'Those experiencing skin laxity and loss of firmness',
                'Those with dry or dehydrated skin',
                'Those seeking overall skin quality enhancement',
                'Those wanting natural-looking skin improvement'
            ],
            howTitle: 'How Profhilo Works',
            howDescription: 'High-concentration hyaluronic acid provides bio-remodelling and deep hydration.',
            howDetails: 'Profhilo contains one of the highest concentrations of hyaluronic acid available, which spreads naturally through the skin tissue. This unique formulation stimulates collagen and elastin production while providing intense hydration, resulting in improved skin tone, texture, and overall quality.',
            link: 'treatments/profhilo.html'
        },
        'peels': {
            name: 'Chemical Peels',
            fullName: 'Professional Chemical Peels',
            image: 'Images/peel.png',
            tagline: 'Advanced chemical exfoliation for skin resurfacing and renewal.',
            subtitle: 'Controlled Exfoliation, Skin Renewal',
            mainDescription: 'Professional chemical peels use carefully selected acids to remove damaged skin layers, stimulate cellular turnover, and reveal smoother, more radiant skin with improved texture and tone.',
            whoTitle: 'Recommended candidates for Chemical Peels',
            whoCandidates: [
                'Those with sun damage and pigmentation issues',
                'Those with acne scars and uneven skin texture',
                'Those seeking skin rejuvenation and renewal',
                'Those with fine lines and surface wrinkles'
            ],
            howTitle: 'How Chemical Peels Work',
            howDescription: 'Controlled chemical exfoliation removes damaged skin layers and stimulates renewal.',
            howDetails: 'Chemical peels use various acids (glycolic, salicylic, TCA) to create controlled exfoliation of the skin. This process removes damaged surface layers, stimulates cellular turnover, and promotes the growth of new, healthier skin cells, resulting in improved texture, tone, and overall skin appearance.',
            link: 'treatments/chemical-peels.html'
        },
        'exosomes': {
            name: 'Exosomes',
            fullName: 'Exosome Regenerative Therapy',
            image: 'Images/exosomes.jpeg',
            tagline: 'Advanced regenerative medicine using nano-sized cellular messengers for skin rejuvenation.',
            subtitle: 'Cell Communication Technology, Natural Regeneration',
            mainDescription: 'Exosome therapy utilizes nano-sized vesicles that facilitate cell-to-cell communication, promoting natural regeneration, reducing inflammation, and enhancing collagen synthesis for comprehensive skin rejuvenation.',
            whoTitle: 'Recommended candidates for Exosomes',
            whoCandidates: [
                'Those seeking advanced regenerative treatments',
                'Those with aging skin and loss of elasticity',
                'Those wanting natural skin rejuvenation and repair',
                'Those looking for cutting-edge anti-aging solutions'
            ],
            howTitle: 'How Exosomes Work',
            howDescription: 'Nano-sized vesicles facilitate cell-to-cell communication and promote natural regeneration.',
            howDetails: 'Exosomes are nano-sized extracellular vesicles that carry growth factors, proteins, and genetic material between cells. When applied to the skin, they enhance cellular communication, stimulate collagen and elastin production, reduce inflammation, and promote tissue repair and regeneration for comprehensive anti-aging benefits.',
            link: 'treatments/exosomes.html'
        }
    };
    
    const treatment = treatments[treatmentId];
    if (!treatment) return;
    
    // Create Dr. Lamiche style modal
    const modal = document.createElement('div');
    modal.className = 'treatment-modal-overlay';
    modal.innerHTML = `
        <div class="treatment-modal lamiche-style">
            <div class="modal-header">
                <div class="treatment-title-section">
                    <h1 class="treatment-main-title">${treatment.name}</h1>
                    <h2 class="treatment-full-title">${treatment.fullName.toUpperCase()}</h2>
                    <p class="treatment-tagline">${treatment.tagline}</p>
                    <div class="treatment-subtitle-highlight">
                        <strong>${treatment.subtitle}</strong>
                    </div>
                </div>
                <span class="close-modal" onclick="closeTreatmentModal()">&times;</span>
            </div>
            
            <div class="modal-content">
                <div class="treatment-main-description">
                    <p>${treatment.mainDescription}</p>
                </div>
                
                <div class="treatment-image-section">
                    <img src="${treatment.image}" alt="${treatment.name}" class="modal-image">
                </div>
                
                <div class="treatment-sections">
                    <div class="treatment-section who-section">
                        <div class="section-header">
                            <h3 class="section-title">WHO</h3>
                        </div>
                        <h4 class="section-subtitle">${treatment.whoTitle}</h4>
                        <div class="candidates-list">
                            ${treatment.whoCandidates.map(candidate => `
                                <div class="candidate-item">
                                    <span class="candidate-bullet">•</span>
                                    <span class="candidate-text">${candidate}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="treatment-section how-section">
                        <div class="section-header">
                            <h3 class="section-title">HOW</h3>
                        </div>
                        <h4 class="section-subtitle">${treatment.howTitle}</h4>
                        <div class="how-description">
                            <p class="how-main">${treatment.howDescription}</p>
                            <div class="how-details">
                                <p>${treatment.howDetails}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="modal-actions">
                    <button onclick="bookViaWhatsApp('consultation')" class="btn-primary book-consultation-btn">Book Consultation</button>
                    <a href="${treatment.link}" class="btn-secondary learn-more-btn">Learn More</a>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function closeTreatmentModal() {
    const modal = document.querySelector('.treatment-modal-overlay');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
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