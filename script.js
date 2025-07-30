/*!
 * ShadesHub JavaScript
 * ====================
 * 
 * This file contains all JavaScript functionality for the ShadesHub website.
 * It includes performance optimizations, interactive features, and progressive
 * enhancement patterns.
 * 
 * Organization:
 * 1. Application Initialization
 * 2. Lazy Loading & Performance
 * 3. Mobile Navigation System
 * 4. Smooth Scrolling & Animations
 * 5. Image Optimization
 * 6. UI Components
 * 7. Product Filtering (Products Page)
 * 8. Font Loading Optimization
 * 9. Resource Management
 * 10. Event Listeners & Initialization
 * 
 * Dependencies:
 * - WOW.js (optional, for scroll animations)
 * - Font Awesome (for icons)
 * - Animate.css (for animations)
 * 
 * Browser Support: Modern browsers (ES6+)
 * 
 * Author: ShadesHub Development Team
 * Last Updated: 2025-01-26
 * Version: 2.0
 */

/* ============================================================================
   1. APPLICATION INITIALIZATION
   ============================================================================ */

/**
 * Main application initialization
 * Runs when DOM is fully loaded and sets up all components
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 ShadesHub: Initializing application...');
    
    // Mark fonts as loaded for performance optimization
    document.documentElement.classList.remove('font-loading');
    document.documentElement.classList.add('font-loaded');

    // Initialize components with error handling
    try {
        // Core functionality - order matters for dependencies
        initLazyLoading();          // Must run first for image optimization
        initMobileMenu();           // Critical for navigation
        initSmoothScrolling();      // Enhance user experience
        initScrollAnimations();     // Visual enhancements
        initImageOptimization();    // Performance optimization
        initScrollToTop();          // User convenience
        
        // Initialize WOW.js if available (optional dependency)
        if (typeof WOW !== 'undefined') {
            new WOW({
                boxClass: 'wow',           // CSS class for animation trigger
                animateClass: 'animated',  // CSS class for animation
                offset: 100,               // Distance to trigger animation
                mobile: true,              // Enable on mobile
                live: true                 // Watch for new elements
            }).init();
            console.log('✨ WOW.js animations initialized');
        }
        
        console.log('✅ All components initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing components:', error);
        // Graceful degradation - continue without enhanced features
    }
});

/* ============================================================================
   2. LAZY LOADING & PERFORMANCE OPTIMIZATION
   ============================================================================ */

/**
 * Initialize lazy loading for images and iframes
 * Improves page load performance by deferring non-critical images
 */
function initLazyLoading() {
    console.log('🖼️ Initializing lazy loading...');
    
    // First, process all images with loading="lazy" attribute
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    // Check for native lazy loading support (modern browsers)
    if ('loading' in HTMLImageElement.prototype) {
        console.log('📱 Using native lazy loading');
        
        // Browser supports native lazy loading
        lazyImages.forEach(img => {
            // Use data-src as actual src if present
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
            // Handle responsive srcset if present
            if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
                img.removeAttribute('data-srcset');
            }
        });
    } 
    // Fallback: Use Intersection Observer for older browsers
    else if ('IntersectionObserver' in window) {
        console.log('👁️ Using Intersection Observer fallback');
        
        const lazyMedia = document.querySelectorAll('[data-src], [data-srcset]');
        
        // Create intersection observer for lazy loading
        const lazyMediaObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const media = entry.target;
                    
                    // Handle images and source elements
                    if (media.tagName === 'IMG' || media.tagName === 'SOURCE') {
                        if (media.dataset.src) {
                            media.src = media.dataset.src;
                            media.removeAttribute('data-src');
                        }
                        if (media.dataset.srcset) {
                            media.srcset = media.dataset.srcset;
                            media.removeAttribute('data-srcset');
                        }
                        
                        // Add loaded class for CSS transitions
                        media.classList.add('lazy-loaded');
                    }
                    
                    // Stop observing this element
                    observer.unobserve(media);
                }
            });
        }, {
            // Configure intersection observer
            threshold: 0.1,                    // Trigger when 10% visible
            rootMargin: '50px 0px 50px 0px'   // Load 50px before entering viewport
        });

        // Start observing all lazy media elements
        lazyMedia.forEach(media => {
            lazyMediaObserver.observe(media);
        });
    }
    // Final fallback: Load all images immediately (very old browsers)
    else {
        console.log('⚡ Loading all images immediately (fallback)');
        
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
            if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
                img.removeAttribute('data-srcset');
            }
            img.classList.add('lazy-loaded');
        });
    }
}

/* ============================================================================
   3. MOBILE NAVIGATION SYSTEM
   ============================================================================ */

/**
 * Initialize mobile navigation menu functionality
 * Handles hamburger menu toggle and mobile-specific interactions
 */
function initMobileMenu() {
    console.log('📱 Initializing mobile menu...');
    
    // Get navigation elements
    const menuToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    const primaryNav = document.querySelector('#primary-navigation');
    
    // Debug: Log found elements
    console.log('📋 Menu elements found:', { 
        menuToggle: !!menuToggle, 
        mainNav: !!mainNav, 
        primaryNav: !!primaryNav 
    });
    
    // Ensure all required elements exist
    if (!menuToggle || !mainNav || !primaryNav) {
        console.warn('⚠️ Required menu elements not found - mobile menu disabled');
        return;
    }
    
    /**
     * Toggle mobile menu visibility
     * Updates ARIA attributes for accessibility
     */
    function toggleMobileMenu() {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        const newState = !isExpanded;
        
        console.log(`🔄 Toggling menu: ${isExpanded} → ${newState}`);
        
        // Update ARIA attribute for screen readers
        menuToggle.setAttribute('aria-expanded', String(newState));
        
        // Toggle menu visibility
        if (newState) {
            // Show menu
            mainNav.classList.add('active');
            primaryNav.setAttribute('data-visible', 'true');
            document.body.classList.add('menu-open');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = 'hidden';
        } else {
            // Hide menu
            mainNav.classList.remove('active');
            primaryNav.setAttribute('data-visible', 'false');
            document.body.classList.remove('menu-open');
            
            // Restore body scroll
            document.body.style.overflow = '';
        }
        
        // Log state for debugging
        console.log('📱 Menu state updated:', {
            expanded: newState,
            visible: primaryNav.getAttribute('data-visible'),
            bodyClass: document.body.className
        });
    }
    
    // Add click event listener to menu toggle
    menuToggle.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent any default button behavior
        toggleMobileMenu();
    });
    
    /**
     * Close menu when navigation link is clicked (mobile only)
     * Improves user experience by automatically closing menu after selection
     */
    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Only auto-close on mobile viewports
            if (window.innerWidth <= 768) {
                console.log('🔗 Nav link clicked - closing mobile menu');
                
                menuToggle.setAttribute('aria-expanded', 'false');
                mainNav.classList.remove('active');
                primaryNav.setAttribute('data-visible', 'false');
                document.body.classList.remove('menu-open');
                document.body.style.overflow = '';
            }
        });
    });
    
    /**
     * Close menu when clicking outside (mobile only)
     * Enhances user experience with intuitive interaction
     */
    document.addEventListener('click', function(e) {
        const isMenuOpen = primaryNav.getAttribute('data-visible') === 'true';
        const clickedInsideMenu = mainNav.contains(e.target);
        const clickedMenuToggle = menuToggle.contains(e.target);
        
        if (isMenuOpen && !clickedInsideMenu && !clickedMenuToggle && window.innerWidth <= 768) {
            console.log('👆 Clicked outside menu - closing');
            toggleMobileMenu();
        }
    });
    
    console.log('✅ Mobile menu initialization complete');
}

/* ============================================================================
   4. SMOOTH SCROLLING & ANIMATIONS
   ============================================================================ */

/**
 * Initialize smooth scrolling for anchor links
 * Enhances user experience with smooth page transitions
 */
function initSmoothScrolling() {
    console.log('🏃 Initializing smooth scrolling...');
    
    // Find all anchor links that point to page sections
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip empty or invalid hash links
            if (targetId === '#' || targetId.length <= 1) {
                return;
            }
            
            const targetElement = document.querySelector(targetId);
            
            // Only handle valid targets
            if (!targetElement) {
                console.warn(`⚠️ Scroll target not found: ${targetId}`);
                return;
            }
            
            e.preventDefault();
            
            // Calculate scroll position (account for fixed header)
            const headerOffset = 80; // Adjust based on header height
            const elementPosition = targetElement.offsetTop;
            const offsetPosition = elementPosition - headerOffset;
            
            // Use modern smooth scroll if supported
            if ('scrollBehavior' in document.documentElement.style) {
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            } else {
                // Fallback for older browsers
                window.scrollTo(0, offsetPosition);
            }
            
            console.log(`📍 Smooth scrolled to: ${targetId}`);
        }, { passive: false }); // Not passive because we prevent default
    });
}

/**
 * Initialize scroll-triggered animations
 * Adds animations when elements come into viewport
 */
function initScrollAnimations() {
    // Check for Intersection Observer support
    if (!('IntersectionObserver' in window)) {
        console.warn('⚠️ Intersection Observer not supported - skipping scroll animations');
        return;
    }
    
    console.log('🎬 Initializing scroll animations...');
    
    // Create intersection observer for animations
    const animateOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animation class when element enters viewport
                entry.target.classList.add('animate');
                
                // Stop observing this element (animation should only happen once)
                observer.unobserve(entry.target);
                
                console.log('🎭 Animated element:', entry.target.className);
            }
        });
    }, {
        threshold: 0.1,                     // Trigger when 10% visible
        rootMargin: '0px 0px -50px 0px'    // Trigger slightly before fully visible
    });

    // Find and observe all elements marked for animation
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => {
        animateOnScroll.observe(el);
    });
    
    console.log(`🎬 Watching ${animatedElements.length} elements for scroll animations`);
}

/* ============================================================================
   5. IMAGE OPTIMIZATION & LOADING
   ============================================================================ */

/**
 * Initialize image optimization and loading states
 * Handles image loading feedback and error states
 */
function initImageOptimization() {
    console.log('🖼️ Initializing image optimization...');
    
    // Process all images on the page
    const images = document.querySelectorAll('img[src]');
    let loadedCount = 0;
    let totalImages = images.length;
    
    console.log(`📊 Processing ${totalImages} images...`);
    
    images.forEach((img, index) => {
        /**
         * Handle successful image loading
         */
        function handleImageLoad() {
            img.classList.add('loaded');
            loadedCount++;
            
            console.log(`✅ Image loaded (${loadedCount}/${totalImages}):`, img.src);
            
            // Log completion when all images are loaded
            if (loadedCount === totalImages) {
                console.log('🎉 All images loaded successfully!');
            }
        }
        
        /**
         * Handle image loading errors
         */
        function handleImageError() {
            console.error('❌ Failed to load image:', img.src);
            
            // Hide broken images gracefully
            img.style.visibility = 'hidden';
            img.classList.add('error');
            
            // Optionally replace with placeholder
            // img.src = '/images/placeholder.webp';
        }
        
        // Check if image is already loaded (cached)
        if (img.complete && img.naturalHeight !== 0) {
            handleImageLoad();
        } else {
            // Add event listeners for loading states
            img.addEventListener('load', handleImageLoad, { once: true });
            img.addEventListener('error', handleImageError, { once: true });
        }
    });
}

/* ============================================================================
   6. UI COMPONENTS
   ============================================================================ */

/**
 * Initialize scroll-to-top button
 * Provides easy navigation back to page top
 */
function initScrollToTop() {
    console.log('⬆️ Initializing scroll-to-top button...');
    
    // Check if button already exists to prevent duplicates
    let scrollToTopButton = document.querySelector('.scroll-to-top');
    
    // Create button if it doesn't exist
    if (!scrollToTopButton) {
        scrollToTopButton = document.createElement('button');
        scrollToTopButton.innerHTML = '↑';
        scrollToTopButton.classList.add('scroll-to-top');
        scrollToTopButton.setAttribute('aria-label', 'Scroll to top');
        scrollToTopButton.setAttribute('type', 'button');
        
        // Add styles programmatically for self-contained component
        Object.assign(scrollToTopButton.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: 'var(--secondary-color)',
            color: 'white',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            display: 'none',
            zIndex: '1000',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
        });
        
        // Add hover effects
        scrollToTopButton.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.backgroundColor = 'var(--primary-color)';
        });
        
        scrollToTopButton.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.backgroundColor = 'var(--secondary-color)';
        });
        
        // Add click functionality
        scrollToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            console.log('⬆️ Scrolled to top');
        });
        
        // Append to document
        document.body.appendChild(scrollToTopButton);
        console.log('✅ Scroll-to-top button created');
    }

    /**
     * Toggle button visibility based on scroll position
     */
    function toggleScrollButton() {
        const scrollThreshold = 300; // Show after scrolling 300px
        const shouldShow = window.scrollY > scrollThreshold;
        
        scrollToTopButton.style.display = shouldShow ? 'block' : 'none';
    }

    // Set initial state
    toggleScrollButton();
    
    // Add scroll event listener with throttling
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        // Throttle scroll events for performance
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(toggleScrollButton, 10);
    }, { passive: true });
}

/* ============================================================================
   7. PRODUCT FILTERING (Products Page)
   ============================================================================ */

/**
 * Initialize product filtering functionality
 * Allows users to filter products by category
 */
function initProductFiltering() {
    console.log('🏷️ Initializing product filtering...');
    
    const filterButtons = document.querySelectorAll('.filter-button');
    const productCards = document.querySelectorAll('.product-card');
    
    // Only initialize if filter elements exist
    if (filterButtons.length === 0 || productCards.length === 0) {
        console.log('ℹ️ No filter elements found - skipping product filtering');
        return;
    }
    
    console.log(`🎛️ Found ${filterButtons.length} filter buttons and ${productCards.length} products`);

    /**
     * Apply filter to product cards
     * @param {string} filter - The filter category ('all' or category name)
     */
    function applyFilter(filter) {
        console.log(`🔍 Applying filter: ${filter}`);
        
        let visibleCount = 0;
        
        productCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const shouldShow = filter === 'all' || category === filter;
            
            if (shouldShow) {
                // Show product with animation
                card.style.display = 'block';
                card.classList.add('animate__animated', 'animate__fadeInUp');
                visibleCount++;
                
                // Remove animation class after animation completes
                setTimeout(() => {
                    card.classList.remove('animate__animated', 'animate__fadeInUp');
                }, 500);
            } else {
                // Hide product
                card.style.display = 'none';
            }
        });
        
        console.log(`📊 Filter applied: ${visibleCount} products visible`);
    }

    // Add event listeners to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active state of buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Apply the filter
            applyFilter(filter);
            
            console.log(`🎯 Filter button clicked: ${filter}`);
        });
    });
    
    console.log('✅ Product filtering initialized');
}

/* ============================================================================
   8. FONT LOADING OPTIMIZATION
   ============================================================================ */

/**
 * Initialize font loading detection and optimization
 * Improves perceived performance by managing font loading states
 */
function initFontLoading() {
    console.log('🔤 Initializing font loading optimization...');
    
    // Check for Font Loading API support
    if (document.fonts && document.fonts.ready) {
        // Modern browsers with Font Loading API
        document.fonts.ready.then(function() {
            document.documentElement.classList.add('fonts-loaded');
            console.log('✅ Fonts loaded (Font Loading API)');
        });
    } else {
        // Fallback for browsers without Font Loading API
        console.log('⏳ Font Loading API not supported - using fallback timer');
        
        setTimeout(function() {
            document.documentElement.classList.add('fonts-loaded');
            console.log('✅ Fonts loaded (fallback timer)');
        }, 1000); // Assume fonts are loaded after 1 second
    }
}

/* ============================================================================
   9. RESOURCE MANAGEMENT
   ============================================================================ */

/**
 * Load non-critical resources when the browser is idle
 * Improves initial page load performance
 */
function loadNonCriticalResources() {
    console.log('⚡ Loading non-critical resources...');
    
    // Use requestIdleCallback if available for optimal performance
    if ('requestIdleCallback' in window) {
        requestIdleCallback(loadNonCriticalCSS, { timeout: 2000 });
        requestIdleCallback(loadNonCriticalJS, { timeout: 3000 });
    } else {
        // Fallback timers for browsers without requestIdleCallback
        setTimeout(loadNonCriticalCSS, 2000);
        setTimeout(loadNonCriticalJS, 3000);
    }
}

/**
 * Load non-critical CSS files
 * Loads additional stylesheets that aren't needed for initial render
 */
function loadNonCriticalCSS() {
    console.log('🎨 Loading non-critical CSS...');
    
    // Example: Load additional fonts or animations
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
    fontLink.as = 'style';
    fontLink.onload = function() {
        this.rel = 'stylesheet';
        console.log('🔤 Additional fonts loaded');
    };
    
    // Only add if not already present
    if (!document.querySelector(`link[href="${fontLink.href}"]`)) {
        document.head.appendChild(fontLink);
    }
}

/**
 * Load non-critical JavaScript
 * Placeholder for additional non-essential features
 */
function loadNonCriticalJS() {
    console.log('⚙️ Loading non-critical JavaScript...');
    
    // Example: Analytics, chat widgets, etc.
    // This is where you'd load third-party scripts that aren't essential
    // for core functionality
    
    // Placeholder for future enhancements
    console.log('💡 Ready for additional features');
}

/**
 * Initialize page-specific components
 * Coordinates initialization of all features with proper error handling
 */
function initPage() {
    console.log('🏗️ Initializing page-specific components...');
    
    // Mobile menu initialization is handled in the main DOMContentLoaded event above
    
    // Initialize page-specific components that weren't loaded in main DOMContentLoaded
    if (typeof initProductFiltering === 'function') {
        initProductFiltering();
    }
    
    if (typeof initFontLoading === 'function') {
        initFontLoading();
    }
    
    // Load non-critical resources
    if (typeof loadNonCriticalResources === 'function') {
        loadNonCriticalResources();
    }
    
    console.log('✅ Page initialization complete');
}

/* ============================================================================
   10. EVENT LISTENERS & INITIALIZATION
   ============================================================================ */

// Start loading non-critical resources after initial page load
window.addEventListener('load', loadNonCriticalResources, { once: true });

/**
 * Optimize passive event listeners for performance
 * Improves scroll and touch performance by using passive listeners where appropriate
 */
(function setupPassiveListeners() {
    console.log('🎛️ Setting up optimized event listeners...');
    
    // Test for passive event listener support
    let passiveSupported = false;
    
    try {
        const options = {
            get passive() {
                passiveSupported = true;
                return false;
            }
        };
        
        window.addEventListener('test', null, options);
        window.removeEventListener('test', null, options);
    } catch (err) {
        passiveSupported = false;
    }
    
    console.log(`📱 Passive event listeners ${passiveSupported ? 'supported' : 'not supported'}`);
    
    // Apply passive event listeners to scroll and touch events for better performance
    const passiveEvents = ['touchstart', 'touchmove', 'wheel', 'mousewheel', 'scroll'];
    passiveEvents.forEach(event => {
        window.addEventListener(event, () => {
            // Empty handler - we're just setting up passive listeners for performance
        }, passiveSupported ? { passive: true } : false);
    });
})();

/**
 * Additional debugging for mobile menu
 * Helps track mobile navigation interactions
 */
document.addEventListener('click', function(e) {
    if (e.target.closest('.mobile-nav-toggle')) {
        console.log('📱 Mobile nav toggle clicked via event delegation');
    }
}, { passive: true });

// Global error handler for unhandled JavaScript errors
window.addEventListener('error', function(e) {
    console.error('🚨 JavaScript error occurred:', {
        message: e.message,
        filename: e.filename,
        line: e.lineno,
        column: e.colno
    });
});

// Log when all resources are fully loaded
window.addEventListener('load', function() {
    console.log('🎉 ShadesHub: All resources loaded successfully!');
}, { once: true });

console.log('📝 ShadesHub JavaScript loaded and ready');