/* ==========================================================================
   SHADES WEBSITE - MAIN JAVASCRIPT FILE
   ==========================================================================
   
   Table of Contents:
   1. Global Variables & Configuration
   2. Utility Functions
   3. Mobile Navigation System
   4. Performance Optimizations
   5. User Experience Enhancements
   6. Form Handling
   7. Animation & Effects
   8. Initialization & Event Listeners
   ========================================================================== */

/* ==========================================================================
   1. GLOBAL VARIABLES & CONFIGURATION
   ========================================================================== */
// Performance configuration
const PERFORMANCE_CONFIG = {
    SCROLL_THRESHOLD: 300,
    LAZY_LOADING_THRESHOLD: 100,
    ANIMATION_DURATION: 300,
    DEBOUNCE_DELAY: 250
};

// Mobile breakpoint
const MOBILE_BREAKPOINT = 768;

// DOM elements cache
let cachedElements = {};

/* ==========================================================================
   2. UTILITY FUNCTIONS
   ========================================================================== */

/**
 * Debounce function to limit the rate of function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function to limit function execution frequency
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Check if element is in viewport
 * @param {Element} element - Element to check
 * @returns {boolean} True if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Get cached DOM element or query and cache it
 * @param {string} selector - CSS selector
 * @returns {Element|null} DOM element
 */
function getElement(selector) {
    if (!cachedElements[selector]) {
        cachedElements[selector] = document.querySelector(selector);
    }
    return cachedElements[selector];
}

/**
 * Get all cached DOM elements or query and cache them
 * @param {string} selector - CSS selector
 * @returns {NodeList} DOM elements
 */
function getElements(selector) {
    if (!cachedElements[selector]) {
        cachedElements[selector] = document.querySelectorAll(selector);
    }
    return cachedElements[selector];
}

/* ==========================================================================
   3. MOBILE NAVIGATION SYSTEM
   ========================================================================== */

/**
 * Initialize mobile navigation functionality
 * Handles hamburger menu toggle, accessibility, and touch interactions
 */
function initMobileMenu() {
    const menuToggle = getElement('.mobile-nav-toggle');
    const primaryNav = getElement('#primary-navigation');
    
    if (!menuToggle || !primaryNav) {
        console.warn('Mobile navigation elements not found');
        return;
    }

    // Set initial state
    primaryNav.setAttribute('data-visible', 'false');
    menuToggle.setAttribute('aria-expanded', 'false');

    /**
     * Toggle mobile menu visibility
     * @param {Event} e - Click event
     */
    function toggleMobileMenu(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isVisible = primaryNav.getAttribute('data-visible') === 'true';
        const newState = !isVisible;
        
        // Update navigation visibility
        primaryNav.setAttribute('data-visible', String(newState));
        menuToggle.setAttribute('aria-expanded', String(newState));
        
        // Toggle body scroll lock
        if (newState) {
            document.body.classList.add('menu-open');
        } else {
            document.body.classList.remove('menu-open');
        }
    }

    // Event listeners
    menuToggle.addEventListener('click', toggleMobileMenu);

    // Close menu when clicking on navigation links
    const navLinks = primaryNav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            primaryNav.setAttribute('data-visible', 'false');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('menu-open');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !primaryNav.contains(e.target)) {
            primaryNav.setAttribute('data-visible', 'false');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('menu-open');
        }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            primaryNav.setAttribute('data-visible', 'false');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('menu-open');
        }
    });

    // Handle window resize
    window.addEventListener('resize', debounce(() => {
        if (window.innerWidth > MOBILE_BREAKPOINT) {
            primaryNav.setAttribute('data-visible', 'false');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('menu-open');
        }
    }, PERFORMANCE_CONFIG.DEBOUNCE_DELAY));
}

/* ==========================================================================
   4. PERFORMANCE OPTIMIZATIONS
   ========================================================================== */

/**
 * Initialize lazy loading for images
 * Uses Intersection Observer API for better performance
 */
function initLazyLoading() {
    const images = getElements('img[data-src]');
    
    if (!images.length) return;

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('loading');
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: `${PERFORMANCE_CONFIG.LAZY_LOADING_THRESHOLD}px`
    });

    images.forEach(img => {
        img.classList.add('loading');
        imageObserver.observe(img);
    });
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    const anchorLinks = getElements('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Initialize scroll animations using Intersection Observer
 */
function initScrollAnimations() {
    const animatedElements = getElements('.animate-on-scroll');
    
    if (!animatedElements.length) return;

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(element => {
        animationObserver.observe(element);
    });
}

/**
 * Initialize image optimization
 * Handles responsive images and WebP support
 */
function initImageOptimization() {
    const images = getElements('img[data-srcset]');
    
    images.forEach(img => {
        // Check for WebP support
        const webpSupported = document.createElement('canvas')
            .toDataURL('image/webp')
            .indexOf('data:image/webp') === 0;
        
        if (webpSupported && img.dataset.srcsetWebp) {
            img.srcset = img.dataset.srcsetWebp;
        } else if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
        }
    });
}

/* ==========================================================================
   5. USER EXPERIENCE ENHANCEMENTS
   ========================================================================== */

/**
 * Initialize scroll-to-top button
 */
function initScrollToTop() {
    const scrollButton = getElement('.scroll-to-top');
    
    if (!scrollButton) return;

    // Show/hide button based on scroll position
    const toggleScrollButton = throttle(() => {
        if (window.scrollY > PERFORMANCE_CONFIG.SCROLL_THRESHOLD) {
            scrollButton.style.display = 'block';
        } else {
            scrollButton.style.display = 'none';
        }
    }, 100);

    // Scroll to top functionality
    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Listen for scroll events
    window.addEventListener('scroll', toggleScrollButton);
}

/**
 * Initialize product filtering system
 */
function initProductFiltering() {
    const filterButtons = getElements('.filter-button');
    const productItems = getElements('.product-item');
    
    if (!filterButtons.length || !productItems.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            
            // Update active button state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter products
            productItems.forEach(item => {
                const category = item.dataset.category;
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.classList.add('fade-in');
                } else {
                    item.style.display = 'none';
                    item.classList.remove('fade-in');
                }
            });
        });
    });
}

/**
 * Initialize font loading optimization
 */
function initFontLoading() {
    // Add font loading class to body
    document.body.classList.add('font-loading');
    
    // Check if fonts are loaded
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
            document.body.classList.remove('font-loading');
            document.body.classList.add('font-loaded');
        });
    } else {
        // Fallback for older browsers
        setTimeout(() => {
            document.body.classList.remove('font-loading');
            document.body.classList.add('font-loaded');
        }, 1000);
    }
}

/* ==========================================================================
   6. FORM HANDLING
   ========================================================================== */

/**
 * Initialize contact form functionality
 */
function initContactForm() {
    const contactForm = getElement('.contact-form');
    
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Show loading state
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        try {
            // Simulate form submission (replace with actual endpoint)
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Show success message
            showFormMessage(contactForm, 'Thank you! Your message has been sent successfully.', 'success');
            contactForm.reset();
            
        } catch (error) {
            // Show error message
            showFormMessage(contactForm, 'Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            // Reset button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });
}

/**
 * Show form message (success/error)
 * @param {Element} form - Form element
 * @param {string} message - Message to display
 * @param {string} type - Message type ('success' or 'error')
 */
function showFormMessage(form, message, type) {
    // Remove existing messages
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.textContent = message;
    
    // Insert message
    form.insertBefore(messageElement, form.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.remove();
        }
    }, 5000);
}

/* ==========================================================================
   7. ANIMATION & EFFECTS
   ========================================================================== */

/**
 * Load non-critical resources asynchronously
 */
function loadNonCriticalResources() {
    // Load Font Awesome if not already loaded
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const fontAwesomeLink = document.createElement('link');
        fontAwesomeLink.rel = 'stylesheet';
        fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
        document.head.appendChild(fontAwesomeLink);
    }
    
    // Load Animate.css if not already loaded
    if (!document.querySelector('link[href*="animate.css"]')) {
        const animateCSSLink = document.createElement('link');
        animateCSSLink.rel = 'stylesheet';
        animateCSSLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css';
        document.head.appendChild(animateCSSLink);
    }
}

/**
 * Initialize WOW.js for scroll animations (if available)
 */
function initWOWAnimations() {
    if (typeof WOW !== 'undefined') {
        new WOW({
            boxClass: 'wow',
            animateClass: 'animated',
            offset: 0,
            mobile: true,
            live: true
        }).init();
    }
}

/* ==========================================================================
   8. INITIALIZATION & EVENT LISTENERS
   ========================================================================== */

/**
 * Main initialization function
 * Called when DOM is fully loaded
 */
function initializeWebsite() {
    console.log('Initializing Shades Website...');
    
    // Initialize core functionality
    initMobileMenu();
    initLazyLoading();
    initSmoothScrolling();
    initScrollAnimations();
    initImageOptimization();
    initScrollToTop();
    initProductFiltering();
    initFontLoading();
    initContactForm();
    
    // Load non-critical resources
    loadNonCriticalResources();
    
    // Initialize animations after resources are loaded
    window.addEventListener('load', () => {
        initWOWAnimations();
    });
    
    console.log('Website initialization complete');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeWebsite);

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initMobileMenu,
        initLazyLoading,
        initSmoothScrolling,
        initScrollAnimations,
        initImageOptimization,
        initScrollToTop,
        initProductFiltering,
        initFontLoading,
        initContactForm,
        debounce,
        throttle,
        isInViewport
    };
}