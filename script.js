// Main JavaScript - Optimized for Performance

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded, initializing components...');
    
    // Mark fonts as loaded
    document.documentElement.classList.remove('font-loading');
    document.documentElement.classList.add('font-loaded');

    // Initialize components
    initLazyLoading();
    initMobileMenu();
    initSmoothScrolling();
    initScrollAnimations();
    initImageOptimization();
    initScrollToTop();
    initProductFiltering();
    initFontLoading();
    
    // Initialize WOW.js if available
    if (typeof WOW !== 'undefined') {
        new WOW().init();
    }
    
    console.log('Page initialization complete');
});

// Start loading non-critical resources after initial load
window.addEventListener('load', loadNonCriticalResources, { once: true });

// Lazy load images and iframes
function initLazyLoading() {
    // First, process all images with loading="lazy"
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    // If native lazy loading is supported
    if ('loading' in HTMLImageElement.prototype) {
        lazyImages.forEach(img => {
            // If image has data-src, use it as src
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
            // Handle srcset if present
            if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
            }
        });
    } 
    // Fallback for browsers without native lazy loading
    else if ('IntersectionObserver' in window) {
        const lazyMedia = document.querySelectorAll('[data-src], [data-srcset]');
        const lazyMediaObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const media = entry.target;
                    if (media.tagName === 'IMG' || media.tagName === 'SOURCE') {
                        if (media.dataset.src) {
                            media.src = media.dataset.src;
                        }
                        if (media.dataset.srcset) {
                            media.srcset = media.dataset.srcset;
                        }
                        media.removeAttribute('data-src');
                        media.removeAttribute('data-srcset');
                    }
                    observer.unobserve(media);
                }
            });
        });

        lazyMedia.forEach(media => {
            lazyMediaObserver.observe(media);
        });
    }
    // Fallback for older browsers without IntersectionObserver
    else {
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
            if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
                img.removeAttribute('data-srcset');
            }
        });
    }
}

// Mobile menu functionality
function initMobileMenu() {
    console.log('Initializing mobile menu...');
    const menuToggle = document.querySelector('.mobile-nav-toggle');
    const primaryNav = document.querySelector('.nav-list');
    
    console.log('Menu elements:', { menuToggle, primaryNav });
    
    if (!menuToggle || !primaryNav) {
        console.error('Required menu elements not found');
        return;
    }
    
    // Ensure initial state
    primaryNav.setAttribute('data-visible', 'false');
    menuToggle.setAttribute('aria-expanded', 'false');
    
    // Toggle menu - using click event with proper handling
    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Menu toggle clicked');
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        console.log('Current state - isExpanded:', isExpanded);
        
        // Toggle the expanded state
        const newState = !isExpanded;
        this.setAttribute('aria-expanded', String(newState));
        
        // Toggle menu visibility
        if (newState) {
            primaryNav.setAttribute('data-visible', 'true');
            document.body.classList.add('menu-open');
        } else {
            primaryNav.setAttribute('data-visible', 'false');
            document.body.classList.remove('menu-open');
        }
        
        console.log('New state - isExpanded:', newState);
        console.log('primaryNav data-visible:', primaryNav.getAttribute('data-visible'));
    });
    
    // Close menu when clicking on a nav link
    const navLinks = primaryNav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            console.log('Nav link clicked, closing menu');
            menuToggle.setAttribute('aria-expanded', 'false');
            primaryNav.setAttribute('data-visible', 'false');
            document.body.classList.remove('menu-open');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !primaryNav.contains(e.target)) {
            if (primaryNav.getAttribute('data-visible') === 'true') {
                console.log('Click outside menu, closing');
                menuToggle.setAttribute('aria-expanded', 'false');
                primaryNav.setAttribute('data-visible', 'false');
                document.body.classList.remove('menu-open');
            }
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && primaryNav.getAttribute('data-visible') === 'true') {
            console.log('Escape key pressed, closing menu');
            menuToggle.setAttribute('aria-expanded', 'false');
            primaryNav.setAttribute('data-visible', 'false');
            document.body.classList.remove('menu-open');
        }
    });
    
    console.log('Mobile menu initialization complete');
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip empty or non-hash links
            if (targetId === '#' || !document.querySelector(targetId)) return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Use smooth scroll if supported
                if ('scrollBehavior' in document.documentElement.style) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Account for fixed header
                        behavior: 'smooth'
                    });
                } else {
                    // Fallback for older browsers
                    window.scrollTo(0, targetElement.offsetTop - 80);
                }
            }
        }, { passive: true });
    });
}

// Animate elements when they come into view
function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) return;
    
    const animateOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        animateOnScroll.observe(el);
    });
}

// Optimize images
function initImageOptimization() {
    console.log('Image optimization initialized');
    
    // Process all images
    const images = document.querySelectorAll('img[src]');
    
    images.forEach(img => {
        // Ensure the image has loaded
        if (!img.complete) {
            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });
        } else {
            img.classList.add('loaded');
        }
        
        // Add error handling
        img.addEventListener('error', function() {
            console.error('Failed to load image:', this.src);
            this.style.visibility = 'hidden';
        });
    });
}

// Scroll to top button
function initScrollToTop() {
    // Check if scroll-to-top button already exists
    let scrollToTopButton = document.querySelector('.scroll-to-top');
    
    // Only create the button if it doesn't exist
    if (!scrollToTopButton) {
        scrollToTopButton = document.createElement('button');
        scrollToTopButton.textContent = '↑';
        scrollToTopButton.classList.add('scroll-to-top');
        document.body.appendChild(scrollToTopButton);

        // Add click event listener
        scrollToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Toggle visibility based on scroll position
    const toggleScrollButton = () => {
        if (window.scrollY > 300) {
            scrollToTopButton.style.display = 'block';
        } else {
            scrollToTopButton.style.display = 'none';
        }
    };

    // Set initial state
    toggleScrollButton();
    
    // Add scroll event listener
    window.addEventListener('scroll', toggleScrollButton);
}

// Initialize product filtering
function initProductFiltering() {
    const filterButtons = document.querySelectorAll('.filter-button');
    const productCards = document.querySelectorAll('.product-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active state of buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter products
            productCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    // Add animation class
                    card.classList.add('animate__animated', 'animate__fadeInUp');
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Initialize font loading detection
function initFontLoading() {
    // Check if fonts are already loaded
    if (document.fonts) {
        document.fonts.ready.then(function() {
            document.documentElement.classList.add('fonts-loaded');
        });
    } else {
        // Fallback for browsers that don't support the Font Loading API
        setTimeout(function() {
            document.documentElement.classList.add('fonts-loaded');
        }, 1000);
    }
}

// Load non-critical resources when idle
function loadNonCriticalResources() {
    if ('requestIdleCallback' in window) {
        requestIdleCallback(loadNonCriticalCSS);
        requestIdleCallback(loadNonCriticalJS);
    } else {
        // Fallback for browsers that don't support requestIdleCallback
        setTimeout(loadNonCriticalCSS, 2000);
        setTimeout(loadNonCriticalJS, 3000);
    }
}

// Load non-critical CSS
function loadNonCriticalCSS() {
    // Preload fonts with font-display: swap
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
    fontLink.as = 'style';
    fontLink.onload = function() {
        this.rel = 'stylesheet';
    };
    document.head.appendChild(fontLink);
}

// Load non-critical JavaScript
function loadNonCriticalJS() {
    // Add any non-critical JS here
    console.log('Loading non-critical JavaScript...');
}