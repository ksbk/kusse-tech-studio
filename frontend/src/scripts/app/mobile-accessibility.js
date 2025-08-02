// ===================================================================
// MOBILE & ACCESSIBILITY INTERACTIONS
// Enhanced mobile UX and WCAG 2.1 AAA compliance
// ===================================================================

class MobileAccessibilityManager {
  constructor() {
    this.isMobile = window.innerWidth <= 768;
    this.hasTouch = "ontouchstart" in window;
    this.prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    this.isHighContrast = window.matchMedia("(prefers-contrast: high)").matches;

    this.init();
  }

  init() {
    this.setupViewportHandling();
    this.setupTouchInteractions();
    this.setupKeyboardNavigation();
    this.setupScreenReaderSupport();
    this.setupFocusManagement();
    this.setupMobileMenu();
    this.setupSwipeGestures();
    this.setupPullToRefresh();
    this.setupResizeHandler();
  }

  // Viewport and Mobile Handling
  // -----------------------------
  setupViewportHandling() {
    // Prevent zoom on iOS double-tap
    let lastTouchEnd = 0;
    document.addEventListener(
      "touchend",
      (e) => {
        const now = new Date().getTime();
        if (now - lastTouchEnd <= 300) {
          e.preventDefault();
        }
        lastTouchEnd = now;
      },
      false,
    );

    // Handle viewport height changes (mobile browsers)
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVH();
    window.addEventListener("resize", setVH);
    window.addEventListener("orientationchange", () => {
      setTimeout(setVH, 100);
    });
  }

  // Touch Interactions
  // ------------------
  setupTouchInteractions() {
    if (!this.hasTouch) return;

    // Add touch feedback to interactive elements
    const interactiveElements = document.querySelectorAll(
      'button, [role="button"], a, .mobile-card.interactive',
    );

    interactiveElements.forEach((element) => {
      element.addEventListener(
        "touchstart",
        (e) => {
          element.style.transform = "scale(0.98)";
          element.style.transition = "transform 0.1s ease";
        },
        { passive: true },
      );

      element.addEventListener(
        "touchend",
        (e) => {
          setTimeout(() => {
            element.style.transform = "";
          }, 100);
        },
        { passive: true },
      );

      element.addEventListener(
        "touchcancel",
        (e) => {
          element.style.transform = "";
        },
        { passive: true },
      );
    });
  }

  // Keyboard Navigation
  // -------------------
  setupKeyboardNavigation() {
    let isTabbing = false;

    // Detect tab navigation
    document.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        isTabbing = true;
        document.body.classList.add("keyboard-navigation");
      }
    });

    document.addEventListener("mousedown", () => {
      isTabbing = false;
      document.body.classList.remove("keyboard-navigation");
    });

    // Enhanced keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      // Skip to main content (Alt + M)
      if (e.altKey && e.key === "m") {
        e.preventDefault();
        const mainContent = document.getElementById("main-content");
        if (mainContent) {
          mainContent.focus();
          mainContent.scrollIntoView({ behavior: "smooth" });
        }
      }

      // Open mobile menu (Alt + N)
      if (e.altKey && e.key === "n") {
        e.preventDefault();
        this.toggleMobileMenu();
      }

      // Close modals/menus (Escape)
      if (e.key === "Escape") {
        this.closeMobileMenu();
        this.closeAllModals();
      }
    });
  }

  // Screen Reader Support
  // ---------------------
  setupScreenReaderSupport() {
    // Announce page changes
    this.announcePageChange = (message) => {
      const announcement = document.createElement("div");
      announcement.setAttribute("aria-live", "polite");
      announcement.setAttribute("aria-atomic", "true");
      announcement.className = "sr-only";
      announcement.textContent = message;

      document.body.appendChild(announcement);

      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    };

    // Enhanced form validation announcements
    const forms = document.querySelectorAll("form");
    forms.forEach((form) => {
      form.addEventListener("submit", (e) => {
        const errors = form.querySelectorAll('[aria-invalid="true"]');
        if (errors.length > 0) {
          this.announcePageChange(
            `Form has ${errors.length} error${errors.length > 1 ? "s" : ""}`,
          );
        }
      });
    });
  }

  // Focus Management
  // ----------------
  setupFocusManagement() {
    // Focus trap for mobile menu
    this.trapFocus = (element) => {
      const focusableElements = element.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select',
      );

      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement =
        focusableElements[focusableElements.length - 1];

      element.addEventListener("keydown", (e) => {
        if (e.key === "Tab") {
          if (e.shiftKey) {
            if (document.activeElement === firstFocusableElement) {
              lastFocusableElement.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastFocusableElement) {
              firstFocusableElement.focus();
              e.preventDefault();
            }
          }
        }
      });
    };

    // Restore focus after modal close
    this.previousFocus = null;

    this.saveFocus = () => {
      this.previousFocus = document.activeElement;
    };

    this.restoreFocus = () => {
      if (this.previousFocus) {
        this.previousFocus.focus();
        this.previousFocus = null;
      }
    };
  }

  // Mobile Menu
  // -----------
  setupMobileMenu() {
    const menuToggle = document.querySelector(".mobile-menu-toggle");
    const mobileMenu = document.querySelector(".mobile-nav");

    if (!menuToggle || !mobileMenu) return;

    menuToggle.addEventListener("click", () => {
      this.toggleMobileMenu();
    });

    // Close menu on outside click
    document.addEventListener("click", (e) => {
      if (
        mobileMenu.classList.contains("active") &&
        !mobileMenu.contains(e.target) &&
        !menuToggle.contains(e.target)
      ) {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    const menuToggle = document.querySelector(".mobile-menu-toggle");
    const mobileMenu = document.querySelector(".mobile-nav");
    const hamburger = document.querySelector(".hamburger");

    if (!mobileMenu) return;

    const isOpen = mobileMenu.classList.contains("active");

    if (isOpen) {
      this.closeMobileMenu();
    } else {
      this.saveFocus();
      mobileMenu.classList.add("active");
      hamburger?.classList.add("active");
      menuToggle?.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";

      // Focus first menu item
      const firstMenuItem = mobileMenu.querySelector("a");
      if (firstMenuItem) {
        firstMenuItem.focus();
      }

      this.trapFocus(mobileMenu);
      this.announcePageChange("Navigation menu opened");
    }
  }

  closeMobileMenu() {
    const menuToggle = document.querySelector(".mobile-menu-toggle");
    const mobileMenu = document.querySelector(".mobile-nav");
    const hamburger = document.querySelector(".hamburger");

    if (!mobileMenu) return;

    mobileMenu.classList.remove("active");
    hamburger?.classList.remove("active");
    menuToggle?.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";

    this.restoreFocus();
    this.announcePageChange("Navigation menu closed");
  }

  closeAllModals() {
    // Close any open modals or overlays
    const modals = document.querySelectorAll(".modal.active, .overlay.active");
    modals.forEach((modal) => {
      modal.classList.remove("active");
      this.restoreFocus();
    });
  }

  // Swipe Gestures
  // --------------
  setupSwipeGestures() {
    if (!this.hasTouch) return;

    let startX, startY, endX, endY;
    const threshold = 50;

    document.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      },
      { passive: true },
    );

    document.addEventListener(
      "touchend",
      (e) => {
        endX = e.changedTouches[0].clientX;
        endY = e.changedTouches[0].clientY;

        const deltaX = endX - startX;
        const deltaY = endY - startY;

        // Horizontal swipe
        if (
          Math.abs(deltaX) > Math.abs(deltaY) &&
          Math.abs(deltaX) > threshold
        ) {
          if (deltaX > 0) {
            this.handleSwipeRight();
          } else {
            this.handleSwipeLeft();
          }
        }
      },
      { passive: true },
    );
  }

  handleSwipeRight() {
    // Open mobile menu on swipe right from left edge
    if (window.innerWidth <= 768) {
      this.toggleMobileMenu();
    }
  }

  handleSwipeLeft() {
    // Close mobile menu on swipe left
    this.closeMobileMenu();
  }

  // Pull to Refresh
  // ---------------
  setupPullToRefresh() {
    if (!this.hasTouch || !this.isMobile) return;

    let startY = 0;
    let currentY = 0;
    let pullDistance = 0;
    const threshold = 80;

    const container = document.documentElement;

    container.addEventListener(
      "touchstart",
      (e) => {
        if (window.scrollY === 0) {
          startY = e.touches[0].clientY;
        }
      },
      { passive: true },
    );

    container.addEventListener("touchmove", (e) => {
      if (window.scrollY === 0 && startY !== 0) {
        currentY = e.touches[0].clientY;
        pullDistance = currentY - startY;

        if (pullDistance > 0) {
          container.classList.add("pulling");
          e.preventDefault();
        }
      }
    });

    container.addEventListener(
      "touchend",
      () => {
        if (pullDistance > threshold) {
          this.handlePullToRefresh();
        }

        container.classList.remove("pulling");
        startY = 0;
        currentY = 0;
        pullDistance = 0;
      },
      { passive: true },
    );
  }

  handlePullToRefresh() {
    // Refresh page content
    this.announcePageChange("Refreshing page content");

    // Simulate refresh - replace with actual refresh logic
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }

  // Resize Handler
  // --------------
  setupResizeHandler() {
    let resizeTimeout;

    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.isMobile = window.innerWidth <= 768;

        // Close mobile menu on desktop
        if (!this.isMobile) {
          this.closeMobileMenu();
        }

        // Update touch interactions
        this.setupTouchInteractions();
      }, 250);
    });
  }

  // Form Enhancements
  // -----------------
  enhanceFormAccessibility() {
    const forms = document.querySelectorAll("form");

    forms.forEach((form) => {
      // Add real-time validation
      const inputs = form.querySelectorAll("input, textarea, select");

      inputs.forEach((input) => {
        input.addEventListener("blur", () => {
          this.validateField(input);
        });

        input.addEventListener("input", () => {
          if (input.getAttribute("aria-invalid") === "true") {
            this.validateField(input);
          }
        });
      });
    });
  }

  validateField(field) {
    const isValid = field.checkValidity();
    field.setAttribute("aria-invalid", !isValid);

    let errorElement = document.getElementById(`${field.id}-error`);

    if (!isValid) {
      if (!errorElement) {
        errorElement = document.createElement("div");
        errorElement.id = `${field.id}-error`;
        errorElement.className = "error-message";
        errorElement.setAttribute("role", "alert");
        field.parentNode.appendChild(errorElement);
        field.setAttribute("aria-describedby", errorElement.id);
      }
      errorElement.textContent = field.validationMessage;
    } else if (errorElement) {
      errorElement.remove();
      field.removeAttribute("aria-describedby");
    }
  }
}

// Performance Monitoring
// ----------------------
class PerformanceOptimizer {
  constructor() {
    this.init();
  }

  init() {
    this.optimizeImages();
    this.setupLazyLoading();
    this.preloadCriticalResources();
    this.monitorPerformance();
  }

  optimizeImages() {
    const images = document.querySelectorAll("img");

    images.forEach((img) => {
      // Add loading="lazy" for better performance
      if (!img.hasAttribute("loading")) {
        img.setAttribute("loading", "lazy");
      }

      // Add proper alt attributes if missing
      if (!img.hasAttribute("alt")) {
        img.setAttribute("alt", "");
        img.setAttribute("role", "presentation");
      }
    });
  }

  setupLazyLoading() {
    if ("IntersectionObserver" in window) {
      const lazyElements = document.querySelectorAll("[data-lazy]");

      const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target;
            element.src = element.dataset.lazy;
            element.removeAttribute("data-lazy");
            lazyObserver.unobserve(element);
          }
        });
      });

      lazyElements.forEach((element) => {
        lazyObserver.observe(element);
      });
    }
  }

  preloadCriticalResources() {
    // Preload critical images
    const criticalImages = [
      "/static/src/img/logo.svg",
      // Add other critical images
    ];

    criticalImages.forEach((src) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      document.head.appendChild(link);
    });
  }

  monitorPerformance() {
    // Monitor Core Web Vitals
    if ("web-vitals" in window) {
      // This would require importing the web-vitals library
      // getCLS, getFID, getFCP, getLCP, getTTFB
    }

    // Simple performance logging
    window.addEventListener("load", () => {
      const perfData = performance.getEntriesByType("navigation")[0];
      console.log(
        "Page Load Time:",
        perfData.loadEventEnd - perfData.fetchStart,
      );
    });
  }
}

// Initialize on DOM content loaded
document.addEventListener("DOMContentLoaded", () => {
  new MobileAccessibilityManager();
  new PerformanceOptimizer();
});

// Export for external use
window.MobileAccessibilityManager = MobileAccessibilityManager;
window.PerformanceOptimizer = PerformanceOptimizer;
