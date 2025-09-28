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
            fullName: 'TIXEL Thermo-Mechanical Fractional Treatment',
            image: 'Images/tixel.jpg',
            tagline: 'Revolutionary thermo-mechanical fractional technology for superior skin resurfacing with minimal downtime.',
            subtitle: 'What is it?',
            mainDescription: 'TIXEL is an innovative thermo-mechanical fractional treatment that uses heated titanium pyramid tips to deliver controlled thermal energy to the skin. Unlike traditional laser treatments, TIXEL creates precise micro-channels through direct contact, stimulating natural collagen production and skin renewal. This advanced technology offers superior results for skin resurfacing, texture improvement, and anti-aging with significantly reduced downtime compared to ablative lasers.',
            whatResults: 'Results to Expect: Initial improvement visible within 1 week, with progressive enhancement over 3-6 months. Benefits include reduced fine lines and wrinkles, improved skin texture and tone, minimized pore size, reduced acne scarring, enhanced skin elasticity and firmness, and overall skin rejuvenation. Most patients require 3-4 sessions spaced 4-6 weeks apart for optimal results.',
            whoTitle: 'Who is a Good Candidate?',
            whoCandidates: [
                'Individuals with fine lines, wrinkles, and signs of aging',
                'Those with acne scarring and uneven skin texture',
                'Patients seeking skin resurfacing with minimal downtime',
                'Individuals with enlarged pores and loss of skin elasticity',
                'Those wanting non-laser fractional treatment alternatives',
                'Patients with sun damage and age-related skin concerns',
                'Individuals seeking gradual, natural-looking skin improvement'
            ],
            howTitle: 'Technology and Science',
            howDescription: 'Advanced thermo-mechanical fractional technology using heated titanium pyramid tips.',
            howDetails: 'TIXEL utilizes proprietary thermo-mechanical fractional technology featuring titanium pyramid tips heated to 400°C that make brief contact (1-10 milliseconds) with the skin surface. This creates precise micro-channels (120-600 microns) without laser energy, eliminating risks associated with pigmentation changes. The controlled thermal injury triggers immediate collagen contraction and long-term neocollagenesis through heat shock protein activation. The fractional approach preserves surrounding tissue, accelerating healing while maximizing efficacy. Advanced tip geometry ensures uniform energy delivery and optimal penetration depth control.',
            link: 'treatments/tixel-rejuvenation.html'
        },
        'genesis': {
            name: 'Genesis',
            fullName: 'Cutera Excel V Genesis Laser Rejuvenation',
            image: 'Images/cutera.webp',
            tagline: 'Advanced 1064nm Nd:YAG laser technology for comprehensive skin rejuvenation with zero downtime.',
            subtitle: 'What is it?',
            mainDescription: 'Cutera Excel V Genesis is a non-invasive laser treatment utilizing 1064nm Nd:YAG laser technology to deliver gentle, controlled heating to the dermis. This advanced laser system promotes collagen synthesis, improves skin texture, reduces pore size, and enhances overall skin quality. Genesis is suitable for all skin types and requires no downtime, making it an ideal "lunchtime" treatment for busy patients seeking immediate skin improvement.',
            whatResults: 'Results to Expect: Immediate skin improvement with progressive enhancement over 4-6 treatments. Benefits include reduced pore size, improved skin texture and tone, enhanced collagen production, diminished fine lines, reduced redness and diffuse rosacea, improved skin radiance and clarity, and overall skin rejuvenation. Results continue to improve for 3-6 months post-treatment.',
            whoTitle: 'Who is a Good Candidate?',
            whoCandidates: [
                'Individuals seeking immediate skin improvement without downtime',
                'Those with enlarged pores and uneven skin texture',
                'Patients with mild rosacea or facial redness',
                'Individuals wanting collagen stimulation and anti-aging benefits',
                'Those with sensitive skin requiring gentle treatments',
                'Patients seeking regular maintenance treatments',
                'Individuals with busy lifestyles requiring no recovery time'
            ],
            howTitle: 'Technology and Science',
            howDescription: 'Advanced 1064nm Nd:YAG laser with micro-pulse technology for optimal dermal heating.',
            howDetails: 'Genesis utilizes a 1064nm Nd:YAG laser with proprietary micro-pulse technology that delivers controlled thermal energy to the papillary dermis. The laser creates gentle, uniform heating (40-45°C) that stimulates fibroblast activity and neocollagenesis without damaging the epidermis. The 1064nm wavelength penetrates deeply while being absorbed by water and hemoglobin, making it effective for both collagen stimulation and vascular improvement. The micro-pulse delivery system ensures consistent energy distribution and patient comfort while maximizing therapeutic efficacy.',
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
            fullName: 'Lutronic LaseMD Ultra Fractional Thulium Laser',
            image: 'Images/lutronic.jpg',
            tagline: 'Advanced 1927nm fractional thulium laser technology for precision skin resurfacing and pigmentation correction.',
            subtitle: 'What is it?',
            mainDescription: 'Lutronic LaseMD Ultra is a state-of-the-art fractional thulium laser system operating at 1927nm wavelength. This advanced laser technology creates precise microscopic treatment zones while preserving surrounding healthy tissue. LaseMD Ultra offers customizable treatment parameters, making it ideal for addressing various skin concerns from mild texture improvement to significant pigmentation correction with minimal downtime.',
            whatResults: 'Results to Expect: Initial improvement visible within 1 week, with progressive enhancement over 3-6 months. Benefits include significant reduction in age spots and sun damage, improved skin texture and tone, reduced fine lines and wrinkles, enhanced skin radiance and clarity, minimized pore size, and overall skin rejuvenation. Most patients require 2-4 sessions spaced 4-6 weeks apart for optimal results.',
            whoTitle: 'Who is a Good Candidate?',
            whoCandidates: [
                'Individuals with sun damage, age spots, and hyperpigmentation',
                'Those seeking fractional laser resurfacing with minimal downtime',
                'Patients with melasma and other pigmentation disorders',
                'Individuals wanting customizable treatment intensity',
                'Those with fine lines, wrinkles, and textural irregularities',
                'Patients seeking significant skin improvement with controlled recovery',
                'Individuals with realistic expectations about gradual improvement'
            ],
            howTitle: 'Technology and Science',
            howDescription: 'Advanced 1927nm fractional thulium laser with precision microscopic treatment zones.',
            howDetails: 'LaseMD Ultra utilizes a 1927nm thulium fiber laser that targets water in the epidermis and superficial dermis with exceptional precision. The wavelength is optimally absorbed by melanin and water, making it highly effective for pigmentation correction and skin resurfacing. The fractional delivery system creates microscopic treatment zones (MTZs) of 120-200 microns while preserving intervening healthy tissue, accelerating healing and minimizing downtime. Advanced beam shaping technology ensures uniform energy distribution and consistent treatment depth. The system offers variable spot sizes and energy densities for customized treatments.',
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
        'exion-tightening': {
            name: 'EXION RF Tightening',
            fullName: 'EXION Radiofrequency Skin Tightening',
            image: 'Images/exion.jpg',
            tagline: 'Advanced monopolar radiofrequency technology for comprehensive skin tightening and lifting.',
            subtitle: 'What is it?',
            mainDescription: 'EXION RF Tightening utilizes advanced monopolar radiofrequency technology to deliver controlled thermal energy deep into the skin and subcutaneous layers. This innovative treatment stimulates collagen production, tightens existing collagen fibers, and promotes tissue remodeling for comprehensive skin lifting and firming. EXION\'s unique energy delivery system ensures optimal heating while maintaining patient comfort.',
            whatResults: 'Results to Expect: Immediate skin tightening with progressive improvement over 3-6 months. Benefits include lifted and firmed skin, reduced sagging and laxity, improved facial contours, enhanced skin elasticity, reduced fine lines and wrinkles, and overall skin rejuvenation. Most patients require 4-6 sessions spaced 1-2 weeks apart for optimal results.',
            whoTitle: 'Who is a Good Candidate?',
            whoCandidates: [
                'Individuals with mild to moderate skin laxity and sagging',
                'Those seeking non-surgical skin lifting and tightening',
                'Patients wanting to improve facial and body contours',
                'Individuals with loss of skin elasticity due to aging',
                'Those seeking comfortable treatments with minimal downtime',
                'Patients wanting gradual, natural-looking skin improvement',
                'Individuals looking for maintenance after surgical procedures'
            ],
            howTitle: 'Technology and Science',
            howDescription: 'Advanced monopolar radiofrequency with intelligent energy delivery and real-time temperature monitoring.',
            howDetails: 'EXION RF Tightening employs monopolar radiofrequency technology that penetrates deeper than bipolar systems, reaching the subcutaneous layer for comprehensive tissue heating. The system uses intelligent energy delivery with real-time impedance monitoring to ensure optimal energy distribution and consistent heating throughout the treatment area. Advanced temperature control maintains therapeutic temperatures (40-45°C) for collagen denaturation and subsequent remodeling. The monopolar configuration allows for deeper penetration and more effective tissue tightening compared to traditional RF systems.',
            link: 'treatments/exion-tightening.html'
        },
        'exion-microneedling': {
            name: 'EXION RF Microneedling',
            fullName: 'EXION Radiofrequency Microneedling',
            image: 'Images/exion.jpg',
            tagline: 'Revolutionary fractional radiofrequency microneedling for advanced skin resurfacing and remodeling.',
            subtitle: 'What is it?',
            mainDescription: 'EXION RF Microneedling combines the precision of microneedling with the power of radiofrequency energy to deliver targeted treatment deep into the skin. This advanced technology creates controlled micro-injuries while simultaneously delivering RF energy to stimulate collagen production, improve skin texture, and address various skin concerns including acne scarring, fine lines, and skin laxity.',
            whatResults: 'Results to Expect: Initial improvement visible within 1-2 weeks, with progressive enhancement over 3-6 months. Benefits include significantly improved skin texture and tone, reduced acne scarring and stretch marks, minimized pore size, enhanced skin firmness and elasticity, reduced fine lines and wrinkles, and overall skin rejuvenation. Most patients require 3-4 sessions spaced 4-6 weeks apart for optimal results.',
            whoTitle: 'Who is a Good Candidate?',
            whoCandidates: [
                'Individuals with acne scarring and textural irregularities',
                'Those with fine lines, wrinkles, and skin aging concerns',
                'Patients with enlarged pores and uneven skin texture',
                'Individuals seeking advanced skin resurfacing treatments',
                'Those with stretch marks and other skin imperfections',
                'Patients wanting significant skin improvement with controlled downtime',
                'Individuals with realistic expectations about gradual improvement'
            ],
            howTitle: 'Technology and Science',
            howDescription: 'Advanced fractional radiofrequency microneedling with precise depth control and energy delivery.',
            howDetails: 'EXION RF Microneedling utilizes ultra-fine insulated microneedles that deliver radiofrequency energy at precise depths (0.5-4mm) within the skin. The fractional approach creates controlled thermal zones while preserving surrounding tissue, accelerating healing and minimizing downtime. The insulated needles ensure energy is delivered only at the needle tips, preventing epidermal damage while maximizing dermal heating. Advanced pulse control allows for customized energy delivery based on skin type and treatment goals. The combination of mechanical stimulation from microneedling and thermal stimulation from RF energy creates a synergistic effect for enhanced collagen remodeling.',
            link: 'treatments/exion-microneedling.html'
        },
        'dermal-fillers': {
            name: 'Dermal Fillers',
            fullName: 'Premium Hyaluronic Acid Dermal Fillers',
            image: 'Images/filler.jpg',
            tagline: 'Advanced hyaluronic acid technology for immediate volume restoration and facial enhancement.',
            subtitle: 'What is it?',
            mainDescription: 'Dermal fillers are injectable gels primarily composed of hyaluronic acid (HA), a naturally occurring substance in the body that maintains skin hydration and volume. Our premium fillers use cross-linked HA technology to provide immediate volume restoration, wrinkle smoothing, and facial contouring. These FDA-approved treatments offer versatile solutions for facial rejuvenation with minimal downtime.',
            whatResults: 'Results to Expect: Immediate visible improvement with full results apparent within 2 weeks. Benefits include restored facial volume, smoothed lines and wrinkles, enhanced lip definition and volume, improved facial contours and symmetry, and natural-looking rejuvenation. Results typically last 6-18 months depending on the product used and treatment area.',
            whoTitle: 'Who is a Good Candidate?',
            whoCandidates: [
                'Adults seeking immediate facial volume restoration',
                'Those with static wrinkles, nasolabial folds, or marionette lines',
                'Individuals wanting lip enhancement or facial contouring',
                'Patients with realistic expectations about natural-looking results',
                'Those seeking non-surgical facial rejuvenation alternatives',
                'Individuals with good overall health and no active skin infections'
            ],
            howTitle: 'Technology and Science',
            howDescription: 'Advanced cross-linked hyaluronic acid gel technology with optimal integration properties.',
            howDetails: 'Modern dermal fillers utilize sophisticated cross-linking technology to create stable hyaluronic acid gels with varying viscosities and lifting capacities. The cross-linking process (using BDDE - 1,4-butanediol diglycidyl ether) creates a three-dimensional network that resists enzymatic breakdown while maintaining biocompatibility. Different molecular weights and cross-linking densities allow for targeted applications - from fine line correction to deep volume restoration. The HA attracts and binds water molecules (up to 1000 times its weight), providing natural hydration and volume. Advanced manufacturing techniques ensure smooth injection, reduced inflammatory response, and optimal tissue integration.',
            link: 'treatments/dermal-fillers.html'
        },
        'botox': {
            name: 'Botox',
            fullName: 'Botox Cosmetic Neurotoxin Treatment',
            image: 'Images/botox.webp',
            tagline: 'FDA-approved botulinum toxin for precise dynamic wrinkle reduction and facial muscle relaxation.',
            subtitle: 'What is it?',
            mainDescription: 'Botox Cosmetic is a purified botulinum toxin type A, a prescription medicine that is injected into muscles to temporarily improve the appearance of dynamic wrinkles. It is the most extensively researched and FDA-approved neurotoxin with over 20 years of clinical use. Botox works by blocking nerve signals that cause muscle contractions, resulting in smoother, more youthful-looking skin.',
            whatResults: 'Results to Expect: Initial effects visible within 3-5 days, with full results apparent in 10-14 days. Benefits include smoothed forehead lines, reduced crow\'s feet, diminished frown lines, lifted brow position, and prevention of new wrinkle formation. Results typically last 3-4 months, with some patients experiencing longer duration with regular treatments.',
            whoTitle: 'Who is a Good Candidate?',
            whoCandidates: [
                'Adults with dynamic wrinkles caused by muscle movement',
                'Those with forehead lines, crow\'s feet, or glabellar (frown) lines',
                'Individuals seeking preventative anti-aging treatments',
                'Patients wanting non-surgical wrinkle reduction with minimal downtime',
                'Those with realistic expectations about natural-looking results',
                'Individuals without neuromuscular disorders or allergies to botulinum toxin'
            ],
            howTitle: 'Technology and Science',
            howDescription: 'Precision botulinum toxin type A technology for targeted neuromuscular blockade.',
            howDetails: 'Botox contains onabotulinumtoxinA, a highly purified protein derived from Clostridium botulinum bacteria. The mechanism involves blocking acetylcholine release at neuromuscular junctions, preventing muscle contraction. The toxin binds irreversibly to nerve terminals, cleaving SNARE proteins essential for neurotransmitter release. This creates temporary chemical denervation lasting 3-6 months until new nerve terminals sprout. The precision of modern Botox allows for targeted muscle relaxation while preserving natural facial expression. Advanced purification techniques ensure consistent potency and minimize immunogenic response.',
            link: 'treatments/botox.html'
        },
        'julaine': {
            name: 'Julaine',
            fullName: 'JULÄINE™ PLLA Collagen Regenerator',
            image: 'Images/julaine.jpg',
            tagline: 'Swedish biomaterial science innovation for active regeneration and natural anti-aging.',
            subtitle: 'What is it?',
            mainDescription: 'JULÄINE™ is a revolutionary PLLA (Poly-L-Lactic Acid) based medical device designed to help preserve your own natural youthfulness through active regeneration. Developed by Nordberg Medical with over 15 years of research in biomaterial science, JULÄINE™ is a superior collagen regenerator produced with high purity biomaterials to activate your skin biology and preserve your own beauty safely, effectively, and with long-term results.',
            whatResults: 'Results to Expect: Immediate skin glow effect visible after injection, with progressive improvement over several weeks as collagen production increases. Benefits include natural skin quality improvement, prevention and rejuvenation through skin tightening, enhanced skin biology activation, long-lasting collagen stimulation, and subtle natural-looking results. The patented technology provides continuous stimulation of collagen production with sustained outcomes.',
            whoTitle: 'Who is a Good Candidate?',
            whoCandidates: [
                'Adult immune-competent individuals seeking natural anti-aging',
                'Those with shallow to deep nasolabial folds and skin depressions',
                'Individuals wanting to achieve their best version without overfilling',
                'Patients seeking active regeneration and skin quality improvement',
                'Those desiring natural results with skin tightening effects',
                'Individuals looking for biomaterial-based collagen activation treatments',
                'Patients wanting Swedish excellence in aesthetic medicine'
            ],
            howTitle: 'Technology and Science',
            howDescription: 'Patented Swedish PLLA biomaterial technology for active collagen regeneration.',
            howDetails: 'JULÄINE™ utilizes patented Poly-L-Lactic Acid technology reflecting over 15 years of research by Nordberg Medical in biomaterial science. The high purity PLLA biomaterial activates natural collagen production through controlled tissue response. Made in Sweden with dedicated research, development, and manufacturing capabilities, JULÄINE™ delivers optimized biomaterial-based medical devices from molecule to finished product. The technology provides continuous stimulation of collagen synthesis, creating natural-looking rejuvenating and skin tightening effects while maintaining the highest safety profile.',
            link: 'treatments/julaine.html'
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
        'sculptra': {
            name: 'Sculptra',
            fullName: 'Sculptra Aesthetic Collagen Stimulator',
            image: 'Images/Sculptra-Ploly-L-Milchsaure.jpg.webp',
            tagline: 'Revolutionary collagen biostimulator for natural facial rejuvenation and volume restoration.',
            subtitle: 'What is it?',
            mainDescription: 'Sculptra is an FDA-approved injectable collagen biostimulator containing poly-L-lactic acid (PLLA). Unlike traditional dermal fillers that provide immediate volume, Sculptra works gradually by stimulating your body\'s natural collagen production process. This biocompatible synthetic material has been safely used in medical applications for decades and provides a foundation for natural-looking, long-lasting facial rejuvenation.',
            whatResults: 'Results to Expect: Gradual improvement over 3-6 months with results lasting up to 2 years. Patients typically see increased facial volume, improved skin thickness and texture, reduction in deep folds and wrinkles, enhanced facial contours, and overall skin quality improvement. The treatment requires 2-3 sessions spaced 4-6 weeks apart for optimal results.',
            whoTitle: 'Who is a Good Candidate?',
            whoCandidates: [
                'Adults experiencing age-related facial volume loss',
                'Those with hollow temples, sunken cheeks, or deep nasolabial folds',
                'Patients seeking gradual, natural-looking results over immediate dramatic changes',
                'Individuals wanting long-lasting facial rejuvenation (up to 2 years)',
                'Those with realistic expectations about gradual improvement timeline',
                'Patients not suitable for immediate-result fillers due to lifestyle or preference'
            ],
            howTitle: 'Technology and Science',
            howDescription: 'Advanced poly-L-lactic acid (PLLA) collagen stimulation technology.',
            howDetails: 'Sculptra utilizes poly-L-lactic acid (PLLA), a biocompatible and biodegradable synthetic polymer. When injected, PLLA microparticles create a scaffold that stimulates fibroblasts to produce new collagen (primarily Type I and Type III). The science is based on controlled tissue response - as PLLA is gradually absorbed over 12-18 months, it triggers neocollagenesis, resulting in thicker, more resilient skin. This process mimics natural collagen production, making results appear completely natural. The treatment targets the deep dermis and subcutaneous layers where collagen loss is most significant with aging.',
            link: 'treatments/sculptra.html'
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
            image: 'Images/exosomes rose new.webp',
            tagline: 'Revolutionary cellular communication technology for advanced skin regeneration and repair.',
            subtitle: 'What is it?',
            mainDescription: 'Exosome therapy represents cutting-edge regenerative medicine utilizing extracellular vesicles (30-150 nanometers) that serve as natural cellular messengers. These microscopic vesicles contain over 1,000 growth factors, proteins, lipids, and microRNAs that facilitate intercellular communication and tissue regeneration. Derived from stem cells, exosomes are the active component responsible for many regenerative benefits, offering a cell-free approach to tissue repair and rejuvenation.',
            whatResults: 'Results to Expect: Progressive improvement over 4-12 weeks with continued enhancement for up to 6 months. Benefits include accelerated wound healing, reduced inflammation and redness, improved skin texture and tone, enhanced collagen production, diminished fine lines and wrinkles, reduced scarring and hyperpigmentation, and overall skin rejuvenation. Multiple sessions may enhance and prolong results.',
            whoTitle: 'Who is a Good Candidate?',
            whoCandidates: [
                'Individuals seeking cutting-edge regenerative treatments',
                'Those with acne scarring, surgical scars, or stretch marks',
                'Patients with chronic inflammatory skin conditions',
                'Individuals wanting natural cellular repair without synthetic substances',
                'Those seeking advanced anti-aging and skin rejuvenation',
                'Patients with sun damage, age spots, or uneven skin tone',
                'Individuals looking for enhanced healing post-procedure'
            ],
            howTitle: 'Technology and Science',
            howDescription: 'Advanced extracellular vesicle technology for targeted cellular communication and regeneration.',
            howDetails: 'Exosomes are naturally occurring nanovesicles (30-150nm) secreted by cells, particularly mesenchymal stem cells. They contain a complex cargo of over 1,000 bioactive molecules including growth factors (VEGF, PDGF, TGF-β), cytokines, microRNAs, and proteins that regulate cellular processes. The technology leverages natural intercellular communication pathways - exosomes bind to target cells via surface receptors, delivering their regenerative cargo directly into the cytoplasm. This triggers cascades of cellular repair, including enhanced collagen synthesis, angiogenesis, and anti-inflammatory responses. Advanced isolation and purification techniques ensure high-quality, sterile exosome preparations with optimal bioactivity.',
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