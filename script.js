// Main JavaScript - Optimized for Performance

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
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
    
    // Initialize WOW.js if available
    if (typeof WOW !== 'undefined') {
        new WOW().init();
    }
});

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
    const mainNav = document.querySelector('.main-nav');
    const primaryNav = document.querySelector('.nav-list');
    
    console.log('Menu elements:', { menuToggle, mainNav, primaryNav });
    
    if (!menuToggle || !mainNav || !primaryNav) {
        console.error('Required menu elements not found');
        return;
    }
    
    // Toggle menu - using click event with proper passive handling
    menuToggle.addEventListener('click', function(e) {
        console.log('Menu toggle clicked');
        // Remove preventDefault since we're not handling any default behavior to prevent
        const isExpanded = this.getAttribute('aria-expanded') === 'true' || false;
        console.log('Current state - isExpanded:', isExpanded);
        
        // Toggle the expanded state
        const newState = !isExpanded;
        this.setAttribute('aria-expanded', String(newState));
        
        // Toggle menu visibility
        if (newState) {
            mainNav.classList.add('active');
            primaryNav.setAttribute('data-visible', 'true');
            document.body.classList.add('menu-open');
        } else {
            mainNav.classList.remove('active');
            primaryNav.setAttribute('data-visible', 'false');
            document.body.classList.remove('menu-open');
        }
        
        console.log('New state - isExpanded:', newState);
        console.log('mainNav classes:', mainNav.className);
        console.log('primaryNav data-visible:', primaryNav.getAttribute('data-visible'));
    });
    
    // Close menu when clicking on a nav link
    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                console.log('Nav link clicked, closing menu');
                menuToggle.setAttribute('aria-expanded', 'false');
                mainNav.classList.remove('active');
                primaryNav.setAttribute('data-visible', 'false');
                document.body.classList.remove('menu-open');
            }
        });
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

// Smooth Scrolling
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Product Filtering
function applyFilter(filter) {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        const category = card.getAttribute('data-category');
        const isVisible = filter === 'all' || category === filter;
        card.style.display = isVisible ? 'block' : 'none';
    });
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

// Initialize all page components
function initPage() {
    console.log('Initializing page components...');
    
    // Initialize mobile menu if elements exist
    if (document.querySelector('.mobile-nav-toggle') && 
        document.querySelector('.main-nav') && 
        document.querySelector('.nav-list')) {
        initMobileMenu();
    }
    
    // Initialize other common components
    if (typeof initScrollToTop === 'function') initScrollToTop();
    if (typeof initImageOptimization === 'function') initImageOptimization();
    if (typeof initLazyLoading === 'function') initLazyLoading();
    if (typeof initProductFiltering === 'function') initProductFiltering();
    if (typeof initFontLoading === 'function') initFontLoading();
    
    // Load non-critical resources
    if (typeof loadNonCriticalResources === 'function') loadNonCriticalResources();
    
    console.log('Page initialization complete');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded, initializing components...');
    initPage();
});

// Start loading non-critical resources after initial load
window.addEventListener('load', loadNonCriticalResources, { once: true });

// Optimize passive event listeners
(function() {
    // Test if passive is supported
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
    
    // Apply passive event listeners to scroll and touch events
    const events = ['touchstart', 'touchmove', 'wheel', 'mousewheel', 'scroll'];
    events.forEach(event => {
        window.addEventListener(event, () => {}, 
            passiveSupported ? { passive: true } : false
        );
    });
})();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded, initializing components...');
    initMobileMenu();
    
    // Also log when the document is clicked to check event propagation
    document.addEventListener('click', function(e) {
        console.log('Document clicked:', e.target);
    });
});