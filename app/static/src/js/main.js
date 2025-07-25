// Main application JavaScript

// Import other modules
import './analytics.js';
import './dark-mode.js';
import './animations.js';

// General initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('Kusse Tech Studio - Main JS loaded');
    
    // Initialize any global functionality here
    initializePerformanceOptimizations();
});

// Performance optimizations
function initializePerformanceOptimizations() {
    // Lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Preload critical resources
    const preloadLinks = [
        '/static/dist/css/styles.css',
        '/static/dist/js/main.js'
    ];

    preloadLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = href.endsWith('.css') ? 'style' : 'script';
        document.head.appendChild(link);
    });
}
