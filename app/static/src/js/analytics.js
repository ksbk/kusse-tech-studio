// Enhanced Analytics and Performance Monitoring System

// Initialize Google Analytics if GA_MEASUREMENT_ID is set
const GA_MEASUREMENT_ID = window.GA_MEASUREMENT_ID || 'G-XJ4B5R12L4';

// Enhanced Analytics Class
class AdvancedAnalytics {
    constructor() {
        this.isEnabled = true;
        this.metrics = {};
        this.session = this.getOrCreateSession();
        this.init();
    }

    init() {
        this.setupGoogleAnalytics();
        this.trackPageLoad();
        this.trackUserEngagement();
        this.trackCoreWebVitals();
        this.setupErrorTracking();
        this.trackUserBehavior();
    }

    setupGoogleAnalytics() {
        if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== 'GA_MEASUREMENT_ID') {
            // Load Google Analytics asynchronously
            window.addEventListener('load', () => {
                const script = document.createElement('script');
                script.async = true;
                script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
                document.head.appendChild(script);
                
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', GA_MEASUREMENT_ID, {
                    page_title: document.title,
                    page_location: window.location.href,
                    anonymize_ip: true,
                    send_page_view: false
                });
                
                // Make gtag globally available
                window.gtag = gtag;
                
                // Send initial page view
                this.sendEvent('page_view', {
                    page_title: document.title,
                    page_location: window.location.href,
                    page_path: window.location.pathname,
                    session_id: this.session.id
                });
                
                console.log('Enhanced Google Analytics initialized');
            });
        } else {
            // Fallback for development/testing
            window.gtag = function() {
                console.log('Analytics Event:', arguments);
            };
        }
    }

    getOrCreateSession() {
        let session = sessionStorage.getItem('analytics_session');
        if (!session) {
            session = {
                id: this.generateSessionId(),
                startTime: Date.now(),
                pageViews: 0,
                interactions: 0
            };
            sessionStorage.setItem('analytics_session', JSON.stringify(session));
        } else {
            session = JSON.parse(session);
        }
        return session;
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    trackPageLoad() {
        // Fixed page load time tracking with better error handling
        window.addEventListener('load', () => {
            setTimeout(() => {
                try {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    
                    if (perfData && perfData.loadEventEnd > 0 && perfData.fetchStart > 0) {
                        this.metrics.pageLoad = {
                            domContentLoaded: Math.max(0, perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
                            loadComplete: Math.max(0, perfData.loadEventEnd - perfData.loadEventStart),
                            totalTime: Math.max(0, perfData.loadEventEnd - perfData.fetchStart),
                            timestamp: Date.now()
                        };

                        // Only send positive load times
                        if (this.metrics.pageLoad.totalTime > 0) {
                            this.sendMetric('page_load_time', this.metrics.pageLoad.totalTime);
                        }
                    } else {
                        console.log('Analytics: Performance data not ready, skipping page load time');
                    }
                } catch (error) {
                    console.warn('Analytics: Could not measure page load time:', error);
                }
            }, 100); // Small delay to ensure performance data is ready
        });
    }

    trackCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.sendMetric('largest_contentful_paint', lastEntry.startTime);
            }).observe({ entryTypes: ['largest-contentful-paint'] });

            // First Input Delay (FID)
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach(entry => {
                    this.sendMetric('first_input_delay', entry.processingStart - entry.startTime);
                });
            }).observe({ entryTypes: ['first-input'] });

            // Cumulative Layout Shift (CLS)
            let clsValue = 0;
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                this.sendMetric('cumulative_layout_shift', clsValue);
            }).observe({ entryTypes: ['layout-shift'] });
        }
    }

    trackUserEngagement() {
        let startTime = Date.now();
        let isVisible = true;
        let scrollDepth = 0;
        let maxScrollDepth = 0;

        // Track scroll depth
        const trackScrollDepth = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            scrollDepth = Math.round((scrollTop + windowHeight) / documentHeight * 100);
            maxScrollDepth = Math.max(maxScrollDepth, scrollDepth);
        };

        // Track page visibility
        document.addEventListener('visibilitychange', () => {
            isVisible = !document.hidden;
            if (document.hidden) {
                this.sendMetric('time_on_page', Date.now() - startTime);
                this.sendMetric('max_scroll_depth', maxScrollDepth);
            } else {
                startTime = Date.now();
            }
        });

        // Track scroll events
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(trackScrollDepth, 100);
        });

        // Track before page unload
        window.addEventListener('beforeunload', () => {
            this.sendMetric('time_on_page', Date.now() - startTime);
            this.sendMetric('max_scroll_depth', maxScrollDepth);
        });
    }

    trackUserBehavior() {
        // Track clicks on important elements
        document.addEventListener('click', (event) => {
            const target = event.target;
            const button = target.closest('button, a, [role="button"]');
            
            if (button) {
                this.session.interactions++;
                sessionStorage.setItem('analytics_session', JSON.stringify(this.session));
                
                this.sendEvent('click', {
                    element_type: button.tagName.toLowerCase(),
                    element_text: button.textContent.trim().substring(0, 50),
                    element_href: button.href || null,
                    element_classes: Array.from(button.classList).join(' '),
                    session_id: this.session.id
                });
            }
        });

        // Track form interactions
        document.addEventListener('focus', (event) => {
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                this.sendEvent('form_interaction', {
                    field_name: event.target.name || event.target.id,
                    field_type: event.target.type,
                    action: 'focus',
                    session_id: this.session.id
                });
            }
        }, true);

        // Track downloads
        document.addEventListener('click', (event) => {
            const target = event.target.closest('a');
            if (target && target.href) {
                const url = new URL(target.href, window.location.origin);
                const isDownload = target.hasAttribute('download') || 
                                 /\.(pdf|doc|docx|xls|xlsx|zip|rar)$/i.test(url.pathname);
                
                if (isDownload) {
                    this.sendEvent('file_download', {
                        file_url: url.href,
                        file_type: url.pathname.split('.').pop(),
                        session_id: this.session.id
                    });
                }
            }
        });
    }

    setupErrorTracking() {
        // JavaScript errors
        window.addEventListener('error', (event) => {
            this.sendEvent('exception', {
                description: `JS Error: ${event.message}`,
                fatal: false,
                filename: event.filename,
                lineno: event.lineno,
                session_id: this.session.id
            });
        });

        // Promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.sendEvent('exception', {
                description: `Promise Rejection: ${event.reason}`,
                fatal: false,
                session_id: this.session.id
            });
        });
    }

    sendEvent(eventName, parameters = {}) {
        if (!this.isEnabled) return;

        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, parameters);
        }
        
        console.log('Analytics Event:', eventName, parameters);
    }

    sendMetric(metricName, value, customDimensions = {}) {
        if (!this.isEnabled) return;

        this.sendEvent('custom_metric', {
            metric_name: metricName,
            metric_value: Math.round(value),
            ...customDimensions
        });
    }
}

// Legacy function compatibility
function trackProjectView(projectName) {
    window.analytics?.sendEvent('view_project', { 
        project_name: projectName,
        page_title: document.title,
        page_location: window.location.href
    });
}

function trackFormSubmission(formType) {
    window.analytics?.sendEvent('form_submit', {
        form_type: formType,
        page_title: document.title
    });
}

function trackDownload(fileName) {
    window.analytics?.sendEvent('file_download', {
        file_name: fileName,
        page_title: document.title
    });
}

function trackExternalLink(linkUrl) {
    window.analytics?.sendEvent('click_external_link', {
        link_url: linkUrl,
        page_title: document.title
    });
}

function trackSearch(query, resultsCount) {
    window.analytics?.sendEvent('search', {
        search_term: query,
        results_count: resultsCount
    });
}

// Initialize analytics system
document.addEventListener('DOMContentLoaded', () => {
    window.analytics = new AdvancedAnalytics();
    
    // Track external links automatically
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        if (!link.href.includes(window.location.hostname)) {
            link.addEventListener('click', () => {
                trackExternalLink(link.href);
            });
        }
    });
    
    // Auto-track form submissions
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            const formId = form.id || form.className || 'unknown';
            trackFormSubmission(formId);
        });
    });
});

// Expose for debugging
window.getAnalyticsData = () => {
    return {
        session: window.analytics?.session,
        metrics: window.analytics?.metrics,
        isEnabled: window.analytics?.isEnabled
    };
};
