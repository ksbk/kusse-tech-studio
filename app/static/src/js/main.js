// Advanced Main Application JavaScript

// Import other modules
import './analytics.js';
import './dark-mode.js';
import './animations.js';

// Enhanced UI/UX Manager
class AdvancedUIManager {
    constructor() {
        this.observers = new Map();
        this.keyboardFocusMode = false;
        this.touchDevice = this.detectTouchDevice();
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.initialize();
    }

    initialize() {
        console.log('Kusse Tech Studio - Advanced UI Manager initialized');
        
        this.setupAccessibilityFeatures();
        this.initializePerformanceOptimizations();
        this.setupAdvancedInteractions();
        this.initializeProgressiveEnhancement();
        this.setupErrorHandling();
        this.setupOfflineDetection();
        this.initializeAdvancedNavigation();
    }

    detectTouchDevice() {
        return ('ontouchstart' in window) || 
               (navigator.maxTouchPoints > 0) || 
               (navigator.msMaxTouchPoints > 0);
    }

    setupAccessibilityFeatures() {
        // Enhanced keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                this.keyboardFocusMode = true;
                document.body.classList.add('keyboard-focus-mode');
            }
            
            // Skip to main content shortcut
            if (e.key === 'Enter' && e.target.classList.contains('skip-link')) {
                e.preventDefault();
                const mainContent = document.getElementById('main-content') || document.querySelector('main');
                if (mainContent) {
                    mainContent.focus();
                    mainContent.scrollIntoView();
                }
            }
        });

        document.addEventListener('mousedown', () => {
            this.keyboardFocusMode = false;
            document.body.classList.remove('keyboard-focus-mode');
        });

        // Enhanced focus management
        this.setupFocusTrap();
        this.setupLiveRegions();
        this.addARIALabels();
    }

    setupFocusTrap() {
        const modals = document.querySelectorAll('[role="dialog"], .modal');
        modals.forEach(modal => {
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            if (focusableElements.length === 0) return;
            
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey && document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    } else if (!e.shiftKey && document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
                
                if (e.key === 'Escape') {
                    this.closeModal(modal);
                }
            });
        });
    }

    setupLiveRegions() {
        // Create status live region for dynamic updates
        const statusRegion = document.createElement('div');
        statusRegion.setAttribute('aria-live', 'polite');
        statusRegion.setAttribute('aria-atomic', 'true');
        statusRegion.className = 'sr-only';
        statusRegion.id = 'status-region';
        document.body.appendChild(statusRegion);

        // Create alert live region for urgent updates
        const alertRegion = document.createElement('div');
        alertRegion.setAttribute('aria-live', 'assertive');
        alertRegion.setAttribute('aria-atomic', 'true');
        alertRegion.className = 'sr-only';
        alertRegion.id = 'alert-region';
        document.body.appendChild(alertRegion);
    }

    addARIALabels() {
        // Auto-add ARIA labels to buttons without accessible names
        document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])').forEach(button => {
            const text = button.textContent.trim();
            const icon = button.querySelector('i, svg');
            
            if (!text && icon) {
                // Try to get label from icon class or title
                const iconClass = icon.className;
                let label = '';
                
                if (iconClass.includes('menu')) label = 'Open menu';
                else if (iconClass.includes('close')) label = 'Close';
                else if (iconClass.includes('search')) label = 'Search';
                else if (iconClass.includes('moon')) label = 'Switch to dark mode';
                else if (iconClass.includes('sun')) label = 'Switch to light mode';
                else label = 'Button';
                
                button.setAttribute('aria-label', label);
            }
        });
    }

    initializePerformanceOptimizations() {
        // Enhanced lazy loading with intersection observer
        this.setupLazyLoading();
        this.preloadCriticalResources();
        this.optimizeImages();
        this.setupResourceHints();
    }

    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            // Lazy load images
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        imageObserver.unobserve(img);
                    }
                });
            }, { rootMargin: '50px' });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });

            // Lazy load sections
            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('section-visible');
                        this.initializeSectionFeatures(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            document.querySelectorAll('section[data-lazy]').forEach(section => {
                sectionObserver.observe(section);
            });
        }
    }

    loadImage(img) {
        const src = img.dataset.src;
        if (src) {
            // Create a new image to preload
            const newImg = new Image();
            newImg.onload = () => {
                img.src = src;
                img.classList.remove('lazy');
                img.classList.add('loaded');
                
                // Announce to screen readers if important
                if (img.hasAttribute('data-announce')) {
                    this.announceToScreenReader(`Image loaded: ${img.alt || 'Image'}`);
                }
            };
            newImg.onerror = () => {
                img.classList.add('error');
                console.error(`Failed to load image: ${src}`);
            };
            newImg.src = src;
        }
    }

    preloadCriticalResources() {
        const preloadLinks = [
            { href: '/static/dist/css/styles.css', as: 'style' },
            { href: '/static/dist/js/main.js', as: 'script' },
            { href: '/static/src/img/logo.svg', as: 'image' }
        ];

        preloadLinks.forEach(({ href, as }) => {
            if (!document.querySelector(`link[href="${href}"]`)) {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.href = href;
                link.as = as;
                if (as === 'style') {
                    link.onload = () => {
                        link.rel = 'stylesheet';
                    };
                }
                document.head.appendChild(link);
            }
        });
    }

    optimizeImages() {
        // Add responsive image support
        document.querySelectorAll('img[data-responsive]').forEach(img => {
            const sizes = img.dataset.responsive.split(',');
            let srcset = '';
            
            sizes.forEach(size => {
                const [width, path] = size.trim().split(':');
                srcset += `${path} ${width}w, `;
            });
            
            if (srcset) {
                img.srcset = srcset.slice(0, -2); // Remove trailing comma
                img.sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
            }
        });
    }

    setupResourceHints() {
        // Add DNS prefetch for external domains
        const externalDomains = ['fonts.googleapis.com', 'fonts.gstatic.com'];
        externalDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = `//${domain}`;
            document.head.appendChild(link);
        });
    }

    setupAdvancedInteractions() {
        this.setupSmartScrolling();
        this.setupAdvancedTooltips();
        this.setupContextualMenus();
        this.setupGestureSupport();
    }

    setupSmartScrolling() {
        let isScrolling = false;
        let scrollTimer;

        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                document.body.classList.add('scrolling');
                isScrolling = true;
            }

            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                document.body.classList.remove('scrolling');
                isScrolling = false;
            }, 150);

            // Update scroll progress
            const scrollProgress = window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight);
            document.documentElement.style.setProperty('--scroll-progress', scrollProgress);
        });
    }

    setupAdvancedTooltips() {
        document.querySelectorAll('[data-tooltip]').forEach(element => {
            const tooltip = document.createElement('div');
            tooltip.className = 'advanced-tooltip';
            tooltip.textContent = element.dataset.tooltip;
            tooltip.setAttribute('role', 'tooltip');
            document.body.appendChild(tooltip);

            element.addEventListener('mouseenter', (e) => {
                if (!this.touchDevice) {
                    this.showTooltip(tooltip, e.target);
                }
            });

            element.addEventListener('mouseleave', () => {
                this.hideTooltip(tooltip);
            });

            element.addEventListener('focus', (e) => {
                this.showTooltip(tooltip, e.target);
            });

            element.addEventListener('blur', () => {
                this.hideTooltip(tooltip);
            });
        });
    }

    showTooltip(tooltip, target) {
        const rect = target.getBoundingClientRect();
        tooltip.style.cssText = `
            position: fixed;
            top: ${rect.top - tooltip.offsetHeight - 8}px;
            left: ${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px;
            opacity: 1;
            visibility: visible;
            z-index: 1000;
            background: var(--theme-background, #333);
            color: var(--theme-text, #fff);
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 14px;
            pointer-events: none;
            transition: opacity 0.2s ease;
        `;
    }

    hideTooltip(tooltip) {
        tooltip.style.opacity = '0';
        tooltip.style.visibility = 'hidden';
    }

    setupGestureSupport() {
        if (this.touchDevice) {
            let startY = 0;
            let startX = 0;

            document.addEventListener('touchstart', (e) => {
                startY = e.touches[0].clientY;
                startX = e.touches[0].clientX;
            });

            document.addEventListener('touchend', (e) => {
                const endY = e.changedTouches[0].clientY;
                const endX = e.changedTouches[0].clientX;
                const deltaY = startY - endY;
                const deltaX = startX - endX;

                // Detect swipe gestures
                if (Math.abs(deltaY) > 50 || Math.abs(deltaX) > 50) {
                    const direction = Math.abs(deltaY) > Math.abs(deltaX) ? 
                        (deltaY > 0 ? 'up' : 'down') : 
                        (deltaX > 0 ? 'left' : 'right');
                    
                    this.handleSwipeGesture(direction, e.target);
                }
            });
        }
    }

    handleSwipeGesture(direction, target) {
        // Handle swipe gestures for navigation or dismissal
        if (direction === 'left' && target.closest('.carousel')) {
            // Navigate carousel
            const carousel = target.closest('.carousel');
            const nextButton = carousel.querySelector('.carousel-next');
            if (nextButton) nextButton.click();
        }
    }

    initializeProgressiveEnhancement() {
        // Add modern feature detection classes
        const features = [
            'intersectionobserver',
            'webp',
            'grid',
            'flexbox',
            'touchevents',
            'serviceworker'
        ];

        features.forEach(feature => {
            if (this.supportsFeature(feature)) {
                document.documentElement.classList.add(`supports-${feature}`);
            }
        });
    }

    supportsFeature(feature) {
        switch (feature) {
            case 'intersectionobserver':
                return 'IntersectionObserver' in window;
            case 'webp':
                return this.supportsWebP();
            case 'grid':
                return CSS.supports('display', 'grid');
            case 'flexbox':
                return CSS.supports('display', 'flex');
            case 'touchevents':
                return this.touchDevice;
            case 'serviceworker':
                return 'serviceWorker' in navigator;
            default:
                return false;
        }
    }

    supportsWebP() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('image/webp') === 5;
    }

    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.handleError(event.error, 'JavaScript Error');
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.handleError(event.reason, 'Promise Rejection');
        });
    }

    handleError(error, type) {
        // Create user-friendly error notification
        this.showNotification(`Something went wrong. Please refresh the page.`, 'error');
        
        // Track error for analytics
        if (window.analytics) {
            window.analytics.sendEvent('exception', {
                description: `${type}: ${error.message || error}`,
                fatal: false
            });
        }
    }

    setupOfflineDetection() {
        window.addEventListener('online', () => {
            this.showNotification('You\'re back online!', 'success');
            document.body.classList.remove('offline');
        });

        window.addEventListener('offline', () => {
            this.showNotification('You\'re currently offline. Some features may not work.', 'warning');
            document.body.classList.add('offline');
        });

        // Initial state
        if (!navigator.onLine) {
            document.body.classList.add('offline');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.setAttribute('role', 'alert');
        
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    announceToScreenReader(message) {
        const statusRegion = document.getElementById('status-region');
        if (statusRegion) {
            statusRegion.textContent = message;
        }
    }

    initializeAdvancedNavigation() {
        // Smart navigation with history management
        this.setupSmoothScrollNavigation();
        this.setupBreadcrumbNavigation();
    }

    setupSmoothScrollNavigation() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offset = 80; // Account for fixed header
                    const targetPosition = target.offsetTop - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: this.prefersReducedMotion ? 'auto' : 'smooth'
                    });
                    
                    // Update focus for accessibility
                    target.focus();
                    
                    // Track navigation
                    if (window.analytics) {
                        window.analytics.sendEvent('scroll_to_section', {
                            section_id: anchor.getAttribute('href').substring(1)
                        });
                    }
                }
            });
        });
    }

    setupBreadcrumbNavigation() {
        // Auto-generate breadcrumbs based on page structure
        const breadcrumbContainer = document.querySelector('.breadcrumb');
        if (breadcrumbContainer) {
            const pathSegments = window.location.pathname.split('/').filter(segment => segment);
            const breadcrumbs = [{ text: 'Home', url: '/' }];
            
            let currentPath = '';
            pathSegments.forEach(segment => {
                currentPath += `/${segment}`;
                breadcrumbs.push({
                    text: this.formatBreadcrumbText(segment),
                    url: currentPath
                });
            });
            
            this.renderBreadcrumbs(breadcrumbContainer, breadcrumbs);
        }
    }

    formatBreadcrumbText(segment) {
        return segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    renderBreadcrumbs(container, breadcrumbs) {
        container.innerHTML = breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return `
                <span class="breadcrumb-item" ${isLast ? 'aria-current="page"' : ''}>
                    ${isLast ? crumb.text : `<a href="${crumb.url}">${crumb.text}</a>`}
                </span>
            `;
        }).join('<span class="breadcrumb-separator">/</span>');
    }

    initializeSectionFeatures(section) {
        // Initialize features for lazy-loaded sections
        const animations = section.querySelectorAll('[data-animate]');
        animations.forEach(element => {
            if (window.advancedAnimations) {
                window.advancedAnimations.animateElement(element);
            }
        });
    }
}

// Initialize the advanced UI manager
document.addEventListener('DOMContentLoaded', () => {
    window.uiManager = new AdvancedUIManager();
});

// Add required CSS for notifications and enhanced UI
const enhancedStyles = document.createElement('style');
enhancedStyles.textContent = `
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
    max-width: 350px;
}

.notification.show {
    opacity: 1;
    transform: translateX(0);
}

.notification-info { background: #2196f3; }
.notification-success { background: #4caf50; }
.notification-warning { background: #ff9800; }
.notification-error { background: #f44336; }

.keyboard-focus-mode button:focus,
.keyboard-focus-mode a:focus,
.keyboard-focus-mode input:focus,
.keyboard-focus-mode select:focus,
.keyboard-focus-mode textarea:focus {
    outline: 2px solid var(--theme-primary, #007acc);
    outline-offset: 2px;
}

.advanced-tooltip {
    font-size: 14px;
    font-weight: 500;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    opacity: 0;
    visibility: hidden;
}

.offline .network-required {
    opacity: 0.5;
    pointer-events: none;
}

.scrolling .scroll-sensitive {
    transition: transform 0.2s ease;
}
`;
document.head.appendChild(enhancedStyles);
