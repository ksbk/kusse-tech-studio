// Enhanced Analytics and Performance Monitoring System

// Initialize Google Analytics if GA_MEASUREMENT_ID is set
const GA_MEASUREMENT_ID = window.GA_MEASUREMENT_ID || "G-XJ4B5R12L4";

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
    if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== "GA_MEASUREMENT_ID") {
      // Load Google Analytics asynchronously
      window.addEventListener("load", () => {
        const script = document.createElement("script");
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag() {
          dataLayer.push(arguments);
        }
        gtag("js", new Date());
        gtag("config", GA_MEASUREMENT_ID, {
          page_title: document.title,
          page_location: window.location.href,
          anonymize_ip: true,
          send_page_view: false,
        });

        // Make gtag globally available
        window.gtag = gtag;

        // Send initial page view
        this.sendEvent("page_view", {
          page_title: document.title,
          page_location: window.location.href,
          page_path: window.location.pathname,
          session_id: this.session.id,
        });

        console.log("Enhanced Google Analytics initialized");
      });
    } else {
      // Fallback for development/testing
      window.gtag = function () {
        console.log("Analytics Event:", arguments);
      };
    }
  }

  getOrCreateSession() {
    let session = sessionStorage.getItem("analytics_session");
    if (!session) {
      session = {
        id: this.generateSessionId(),
        startTime: Date.now(),
        pageViews: 0,
        interactions: 0,
      };
      sessionStorage.setItem("analytics_session", JSON.stringify(session));
    } else {
      session = JSON.parse(session);
    }
    return session;
  }

  generateSessionId() {
    return (
      "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
    );
  }

  trackPageLoad() {
    // Fixed page load time tracking with better error handling
    window.addEventListener("load", () => {
      setTimeout(() => {
        try {
          const perfData = performance.getEntriesByType("navigation")[0];

          if (
            perfData &&
            perfData.loadEventEnd > 0 &&
            perfData.fetchStart > 0
          ) {
            this.metrics.pageLoad = {
              domContentLoaded: Math.max(
                0,
                perfData.domContentLoadedEventEnd -
                  perfData.domContentLoadedEventStart,
              ),
              loadComplete: Math.max(
                0,
                perfData.loadEventEnd - perfData.loadEventStart,
              ),
              totalTime: Math.max(
                0,
                perfData.loadEventEnd - perfData.fetchStart,
              ),
              timestamp: Date.now(),
            };

            // Only send positive load times
            if (this.metrics.pageLoad.totalTime > 0) {
              this.sendMetric(
                "page_load_time",
                this.metrics.pageLoad.totalTime,
              );
            }
          } else {
            console.log(
              "Analytics: Performance data not ready, skipping page load time",
            );
          }
        } catch (error) {
          console.warn("Analytics: Could not measure page load time:", error);
        }
      }, 100); // Small delay to ensure performance data is ready
    });
  }

  trackCoreWebVitals() {
    // Largest Contentful Paint (LCP)
    if ("PerformanceObserver" in window) {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.sendMetric("largest_contentful_paint", lastEntry.startTime);
      }).observe({ entryTypes: ["largest-contentful-paint"] });

      // First Input Delay (FID)
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          this.sendMetric(
            "first_input_delay",
            entry.processingStart - entry.startTime,
          );
        });
      }).observe({ entryTypes: ["first-input"] });

      // Cumulative Layout Shift (CLS) - throttled reporting
      let clsValue = 0;
      let clsReportTimeout;
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });

        // Throttle CLS reporting to reduce console spam
        clearTimeout(clsReportTimeout);
        clsReportTimeout = setTimeout(() => {
          if (clsValue > 0) {
            this.sendMetric("cumulative_layout_shift", clsValue);
            clsValue = 0; // Reset after reporting
          }
        }, 1000); // Report maximum once per second
      }).observe({ entryTypes: ["layout-shift"] });
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
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      scrollDepth = Math.round(
        ((scrollTop + windowHeight) / documentHeight) * 100,
      );
      maxScrollDepth = Math.max(maxScrollDepth, scrollDepth);
    };

    // Track page visibility
    document.addEventListener("visibilitychange", () => {
      isVisible = !document.hidden;
      if (document.hidden) {
        this.sendMetric("time_on_page", Date.now() - startTime);
        this.sendMetric("max_scroll_depth", maxScrollDepth);
      } else {
        startTime = Date.now();
      }
    });

    // Track scroll events
    let scrollTimeout;
    window.addEventListener("scroll", () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(trackScrollDepth, 100);
    });

    // Track before page unload
    window.addEventListener("beforeunload", () => {
      this.sendMetric("time_on_page", Date.now() - startTime);
      this.sendMetric("max_scroll_depth", maxScrollDepth);
    });
  }

  trackUserBehavior() {
    // Track clicks on important elements
    document.addEventListener("click", (event) => {
      const target = event.target;
      const button = target.closest('button, a, [role="button"]');

      if (button) {
        this.session.interactions++;
        sessionStorage.setItem(
          "analytics_session",
          JSON.stringify(this.session),
        );

        this.sendEvent("click", {
          element_type: button.tagName.toLowerCase(),
          element_text: button.textContent.trim().substring(0, 50),
          element_href: button.href || null,
          element_classes: Array.from(button.classList).join(" "),
          session_id: this.session.id,
        });
      }
    });

    // Track form interactions
    document.addEventListener(
      "focus",
      (event) => {
        if (
          event.target.tagName === "INPUT" ||
          event.target.tagName === "TEXTAREA"
        ) {
          this.sendEvent("form_interaction", {
            field_name: event.target.name || event.target.id,
            field_type: event.target.type,
            action: "focus",
            session_id: this.session.id,
          });
        }
      },
      true,
    );

    // Track downloads
    document.addEventListener("click", (event) => {
      const target = event.target.closest("a");
      if (target && target.href) {
        const url = new URL(target.href, window.location.origin);
        const isDownload =
          target.hasAttribute("download") ||
          /\.(pdf|doc|docx|xls|xlsx|zip|rar)$/i.test(url.pathname);

        if (isDownload) {
          this.sendEvent("file_download", {
            file_url: url.href,
            file_type: url.pathname.split(".").pop(),
            session_id: this.session.id,
          });
        }
      }
    });
  }

  setupErrorTracking() {
    // JavaScript errors
    window.addEventListener("error", (event) => {
      this.sendEvent("exception", {
        description: `JS Error: ${event.message}`,
        fatal: false,
        filename: event.filename,
        lineno: event.lineno,
        session_id: this.session.id,
      });
    });

    // Promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      this.sendEvent("exception", {
        description: `Promise Rejection: ${event.reason}`,
        fatal: false,
        session_id: this.session.id,
      });
    });
  }

  sendEvent(eventName, parameters = {}) {
    if (!this.isEnabled) return;

    if (typeof gtag !== "undefined") {
      gtag("event", eventName, parameters);
    }

    console.log("Analytics Event:", eventName, parameters);
  }

  sendMetric(metricName, value, customDimensions = {}) {
    if (!this.isEnabled) return;

    this.sendEvent("custom_metric", {
      metric_name: metricName,
      metric_value: Math.round(value),
      ...customDimensions,
    });
  }
}

// Legacy function compatibility
function trackProjectView(projectName) {
  window.analytics?.sendEvent("view_project", {
    project_name: projectName,
    page_title: document.title,
    page_location: window.location.href,
  });
}

function trackFormSubmission(formType) {
  window.analytics?.sendEvent("form_submit", {
    form_type: formType,
    page_title: document.title,
  });
}

function trackDownload(fileName) {
  window.analytics?.sendEvent("file_download", {
    file_name: fileName,
    page_title: document.title,
  });
}

function trackExternalLink(linkUrl) {
  window.analytics?.sendEvent("click_external_link", {
    link_url: linkUrl,
    page_title: document.title,
  });
}

function trackSearch(query, resultsCount) {
  window.analytics?.sendEvent("search", {
    search_term: query,
    results_count: resultsCount,
  });
}

// Initialize analytics system
document.addEventListener("DOMContentLoaded", () => {
  window.analytics = new AdvancedAnalytics();

  // Track external links automatically
  document.querySelectorAll('a[href^="http"]').forEach((link) => {
    if (!link.href.includes(window.location.hostname)) {
      link.addEventListener("click", () => {
        trackExternalLink(link.href);
      });
    }
  });

  // Auto-track form submissions
  document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      const formId = form.id || form.className || "unknown";
      trackFormSubmission(formId);
    });
  });
});

// Expose for debugging
window.getAnalyticsData = () => {
  return {
    session: window.analytics?.session,
    metrics: window.analytics?.metrics,
    isEnabled: window.analytics?.isEnabled,
  };
};

// Analytics Dashboard Integration
class AnalyticsDashboardTracker {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.isTracking = true;

    // Integrate with existing analytics
    if (window.analytics) {
      this.mainAnalytics = window.analytics;
    }

    this.init();
  }

  generateSessionId() {
    return (
      "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
    );
  }

  init() {
    // Track page view for dashboard
    this.trackPageView();

    // Track specific events for dashboard
    this.bindDashboardEvents();

    // Track time on page
    this.trackTimeOnPage();
  }

  trackPageView() {
    const data = {
      page_path: window.location.pathname,
      page_title: document.title,
      referrer: document.referrer || "direct",
      user_agent: navigator.userAgent,
      session_id: this.sessionId,
      timestamp: new Date().toISOString(),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      device_type: this.getDeviceType(),
      country: this.getUserCountry(),
    };

    this.sendToDashboard("/analytics/track-event", {
      event_name: "page_view",
      event_category: "navigation",
      event_value: JSON.stringify(data),
      page_path: data.page_path,
    });
  }

  bindDashboardEvents() {
    // Track blog reading progress
    if (window.location.pathname.includes("/blog/")) {
      this.trackBlogEngagement();
    }

    // Track service inquiries
    document.addEventListener("click", (e) => {
      if (e.target.matches(".service-cta, .contact-cta, .cta-button")) {
        this.trackEvent("service_inquiry", "business", {
          cta_text: e.target.textContent.trim(),
          page_section: this.getNearestSection(e.target),
        });
      }
    });

    // Track newsletter signups
    document.addEventListener("submit", (e) => {
      if (e.target.matches("#newsletter-form, .newsletter-form")) {
        this.trackEvent("newsletter_signup", "engagement", {
          source: window.location.pathname,
        });
      }
    });

    // Track contact form submissions
    document.addEventListener("submit", (e) => {
      if (e.target.matches("#contact-form, .contact-form")) {
        this.trackEvent("contact_form_submit", "lead_generation", {
          page: window.location.pathname,
        });
      }
    });
  }

  trackBlogEngagement() {
    let readingMilestones = [25, 50, 75, 100];
    let milestoneReached = new Set();

    const trackReadingProgress = () => {
      const scrollPercent = Math.round(
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
          100,
      );

      readingMilestones.forEach((milestone) => {
        if (scrollPercent >= milestone && !milestoneReached.has(milestone)) {
          milestoneReached.add(milestone);
          this.trackEvent("blog_read_progress", "engagement", {
            milestone: milestone,
            post_slug: window.location.pathname.split("/").pop(),
            time_to_milestone: Date.now() - this.startTime,
          });
        }
      });
    };

    let scrollTimeout;
    window.addEventListener("scroll", () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(trackReadingProgress, 100);
    });

    // Track social sharing
    document.addEventListener("click", (e) => {
      if (e.target.matches(".share-btn, [data-share]")) {
        const platform =
          e.target.getAttribute("data-share") ||
          e.target.className.match(/share-(\w+)/)?.[1] ||
          "unknown";

        this.trackEvent("blog_share", "social", {
          platform: platform,
          post_slug: window.location.pathname.split("/").pop(),
          post_title: document.title,
        });
      }
    });
  }

  trackTimeOnPage() {
    // Send time on page data periodically
    setInterval(() => {
      if (this.isUserActive()) {
        const timeOnPage = Date.now() - this.startTime;
        this.trackEvent("time_on_page", "engagement", {
          time_spent: timeOnPage,
          is_active: true,
          page: window.location.pathname,
        });
      }
    }, 30000);
  }

  trackEvent(eventName, category, value = null) {
    if (!this.isTracking) return;

    const data = {
      event_name: eventName,
      event_category: category,
      event_value: JSON.stringify(value),
      page_path: window.location.pathname,
      session_id: this.sessionId,
      timestamp: new Date().toISOString(),
    };

    this.sendToDashboard("/analytics/track-event", data);
  }

  sendToDashboard(endpoint, data) {
    // Use sendBeacon for better reliability, fallback to fetch
    const payload = JSON.stringify(data);

    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, payload);
    } else {
      fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
        keepalive: true,
      }).catch((error) => {
        console.debug("Dashboard analytics error:", error);
      });
    }
  }

  isUserActive() {
    return Date.now() - (window.lastActivity || this.startTime) < 60000;
  }

  getDeviceType() {
    const width = window.innerWidth;
    if (width < 768) return "mobile";
    if (width < 1024) return "tablet";
    return "desktop";
  }

  getUserCountry() {
    // Try to get country from timezone (basic detection)
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone.includes("Reykjavik")) return "Iceland";
    if (timezone.includes("Oslo")) return "Norway";
    if (timezone.includes("Copenhagen")) return "Denmark";
    if (timezone.includes("Stockholm")) return "Sweden";
    return "Unknown";
  }

  getNearestSection(element) {
    const section = element.closest("section, .section, [data-section]");
    return section
      ? section.id ||
          section.className ||
          section.getAttribute("data-section") ||
          "unknown"
      : "unknown";
  }
}

// Activity tracking for dashboard
document.addEventListener(
  "mousemove",
  () => (window.lastActivity = Date.now()),
);
document.addEventListener("keypress", () => (window.lastActivity = Date.now()));
document.addEventListener("scroll", () => (window.lastActivity = Date.now()));
document.addEventListener("click", () => (window.lastActivity = Date.now()));

// Initialize dashboard analytics
document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("analytics_opt_out") !== "true") {
    window.dashboardAnalytics = new AnalyticsDashboardTracker();
  }
});

// Global functions for manual event tracking
window.trackDashboardEvent = function (name, category, value) {
  if (window.dashboardAnalytics) {
    window.dashboardAnalytics.trackEvent(name, category, value);
  }
};

window.trackConversion = function (type, value) {
  if (window.dashboardAnalytics) {
    window.dashboardAnalytics.trackEvent("conversion", "business", {
      conversion_type: type,
      conversion_value: value,
      page: window.location.pathname,
    });
  }
};
