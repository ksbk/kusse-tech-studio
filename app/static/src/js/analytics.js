// Google Analytics and Event Tracking

// Initialize Google Analytics if GA_MEASUREMENT_ID is set
const GA_MEASUREMENT_ID = window.GA_MEASUREMENT_ID || null;

if (GA_MEASUREMENT_ID) {
    // Load Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);
    
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
        page_title: document.title,
        page_location: window.location.href
    });
    
    console.log('Google Analytics initialized');
} else {
    // Fallback for development/testing
    window.gtag = function() {
        console.log('Analytics Event:', arguments);
    };
}

// Track project views
function trackProjectView(projectName) {
    gtag('event', 'view_project', { 
        project_name: projectName,
        page_title: document.title,
        page_location: window.location.href
    });
}

// Track form submissions
function trackFormSubmission(formType) {
    gtag('event', 'form_submit', {
        form_type: formType,
        page_title: document.title
    });
}

// Track file downloads
function trackDownload(fileName) {
    gtag('event', 'file_download', {
        file_name: fileName,
        page_title: document.title
    });
}

// Track scroll depth
let maxScrollDepth = 0;
function trackScrollDepth() {
    const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    
    if (scrollPercent > maxScrollDepth && scrollPercent >= 25 && scrollPercent % 25 === 0) {
        maxScrollDepth = scrollPercent;
        gtag('event', 'scroll_depth', {
            scroll_depth: scrollPercent,
            page_title: document.title
        });
    }
}

// Track time on page
let startTime = Date.now();
function trackTimeOnPage() {
    const timeOnPage = Math.round((Date.now() - startTime) / 1000);
    if (timeOnPage > 30) { // Only track if user stayed more than 30 seconds
        gtag('event', 'time_on_page', {
            time_seconds: timeOnPage,
            page_title: document.title
        });
    }
}

// Initialize tracking
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                
                // Track internal link clicks
                gtag('event', 'internal_link_click', {
                    link_text: this.textContent,
                    link_url: this.getAttribute('href')
                });
            }
        });
    });

    // Track contact link clicks
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
        link.addEventListener('click', () => {
            gtag('event', 'contact_click', { 
                method: 'email',
                contact_email: link.href
            });
        });
    });

    // Track phone link clicks
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', () => {
            gtag('event', 'contact_click', { 
                method: 'phone',
                phone_number: link.href
            });
        });
    });

    // Track external link clicks
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        // Skip if it's our own domain
        if (!link.href.includes(window.location.hostname)) {
            link.addEventListener('click', () => {
                gtag('event', 'outbound_click', {
                    link_url: link.href,
                    link_text: link.textContent
                });
            });
        }
    });

    // Track GitHub links specifically
    document.querySelectorAll('a[href*="github.com"]').forEach(link => {
        link.addEventListener('click', () => {
            gtag('event', 'github_click', {
                link_url: link.href,
                project_name: link.textContent
            });
        });
    });

    // Track contact form submissions
    const contactForm = document.querySelector('form[action*="contact"]');
    if (contactForm) {
        contactForm.addEventListener('submit', () => {
            trackFormSubmission('contact');
        });
    }

    // Track scroll depth
    window.addEventListener('scroll', trackScrollDepth);

    // Track time on page when user leaves
    window.addEventListener('beforeunload', trackTimeOnPage);
});
