// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger?.classList.remove('active');
    navMenu?.classList.remove('active');
}));

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
    
    // TODO: Replace this with your actual Medesk embed code
    const medeskEmbedCode = `
        <div class="medesk-widget-placeholder">
            <div style="padding: 2rem; text-align: center; background: #f8f9fa; border-radius: 12px;">
                <h3 style="color: #d4af37; margin-bottom: 1rem;">🔧 Medesk Integration Ready</h3>
                <p style="margin-bottom: 2rem; color: #666;">
                    Please provide your Medesk embed code to complete the integration.<br>
                    You can find this in your Medesk account under Settings → Online Booking.
                </p>
                <div style="background: white; padding: 1.5rem; border-radius: 8px; border-left: 4px solid #d4af37; text-align: left; font-family: monospace; font-size: 0.9rem; color: #333;">
                    <strong>Expected format:</strong><br>
                    &lt;iframe src="https://your-clinic.medesk.com/booking" width="100%" height="600"&gt;&lt;/iframe&gt;<br><br>
                    <em>Or</em><br><br>
                    &lt;script src="https://your-clinic.medesk.com/widget.js"&gt;&lt;/script&gt;
                </div>
                <button onclick="showContactForm()" style="margin-top: 1rem; background: #d4af37; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 6px; cursor: pointer;">
                    Use Contact Form Instead
                </button>
            </div>
        </div>
    `;
    
    widgetContainer.innerHTML = medeskEmbedCode;
}

function showContactForm() {
    const widgetContainer = document.getElementById('medesk-booking-widget');
    const contactForm = document.querySelector('.contact-form');
    
    // Hide widget container
    widgetContainer.style.display = 'none';
    
    // Show contact form
    if (contactForm) {
        contactForm.scrollIntoView({ behavior: 'smooth' });
        const nameField = contactForm.querySelector('#name');
        if (nameField) {
            nameField.focus();
        }
    }
} 