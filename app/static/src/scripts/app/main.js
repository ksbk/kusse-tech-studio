// Main JavaScript entry point for KusseTechStudio
import "./dark-mode.js";
import "./animations.js";

// Import styles
import "@styles/main.scss";

console.log("KusseTechStudio application initialized");

// Enhanced UI/UX Manager for the refactored structure
class UIManager {
  constructor() {
    this.touchDevice = this.detectTouchDevice();
    this.prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    this.initialize();
  }

  initialize() {
    this.initializeMobileMenu();
    this.initializeSmoothScrolling();
    this.initializeFormHandling();
    this.setupAccessibilityFeatures();
    this.setupErrorHandling();
    this.initializeLazyLoading();
    console.log("✅ UI Manager initialized");
  }

  detectTouchDevice() {
    return (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  }

  initializeMobileMenu() {
    const mobileMenuButton = document.getElementById("mobile-menu-button");
    const mobileMenu = document.getElementById("mobile-menu");

    if (mobileMenuButton && mobileMenu) {
      mobileMenuButton.addEventListener("click", function () {
        mobileMenu.classList.toggle("hidden");
      });

      // Close mobile menu when clicking outside
      document.addEventListener("click", function (event) {
        if (
          !mobileMenuButton.contains(event.target) &&
          !mobileMenu.contains(event.target)
        ) {
          mobileMenu.classList.add("hidden");
        }
      });
    }
  }

  initializeSmoothScrolling() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener(
        "click",
        function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute("href"));
          if (target) {
            const offset = 80; // Account for fixed header
            const targetPosition = target.offsetTop - offset;

            window.scrollTo({
              top: targetPosition,
              behavior: this.prefersReducedMotion ? "auto" : "smooth",
            });
          }
        }.bind(this),
      );
    });
  }

  initializeFormHandling() {
    // Add loading states to forms
    const forms = document.querySelectorAll("form");
    forms.forEach((form) => {
      form.addEventListener("submit", function () {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = "Sending...";
        }
      });
    });
  }

  setupAccessibilityFeatures() {
    // Enhanced keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        document.body.classList.add("keyboard-focus-mode");
      }
    });

    document.addEventListener("mousedown", () => {
      document.body.classList.remove("keyboard-focus-mode");
    });

    // Auto-add ARIA labels to buttons without accessible names
    document
      .querySelectorAll("button:not([aria-label]):not([aria-labelledby])")
      .forEach((button) => {
        const text = button.textContent.trim();
        const icon = button.querySelector("i, svg");

        if (!text && icon) {
          const iconClass = icon.className;
          let label = "";

          if (iconClass.includes("menu")) label = "Open menu";
          else if (iconClass.includes("close")) label = "Close";
          else if (iconClass.includes("search")) label = "Search";
          else if (iconClass.includes("moon")) label = "Switch to dark mode";
          else if (iconClass.includes("sun")) label = "Switch to light mode";
          else label = "Button";

          button.setAttribute("aria-label", label);
        }
      });
  }

  setupErrorHandling() {
    window.addEventListener("error", (event) => {
      console.error("Global error:", event.error);
      this.showNotification(
        "Something went wrong. Please refresh the page.",
        "error",
      );
    });

    window.addEventListener("unhandledrejection", (event) => {
      console.error("Unhandled promise rejection:", event.reason);
      this.showNotification(
        "Something went wrong. Please refresh the page.",
        "error",
      );
    });
  }

  initializeLazyLoading() {
    // Intersection Observer for lazy loading images
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;

              // Handle img elements
              if (img.tagName === "IMG") {
                if (img.dataset.src) {
                  // Preserve aspect ratio with width/height attributes
                  if (img.dataset.width && img.dataset.height) {
                    img.width = img.dataset.width;
                    img.height = img.dataset.height;
                  }

                  img.src = img.dataset.src;
                  img.removeAttribute("data-src");

                  // Clean up dimension data attributes
                  img.removeAttribute("data-width");
                  img.removeAttribute("data-height");
                }

                img.addEventListener("load", () => {
                  img.classList.add("loaded");
                });

                img.addEventListener("error", () => {
                  img.classList.add("error");
                  console.warn(
                    `Failed to load image: ${img.src || img.dataset.src}`,
                  );
                });
              }

              // Handle background images
              if (img.dataset.bg) {
                img.style.backgroundImage = `url(${img.dataset.bg})`;
                img.removeAttribute("data-bg");
                img.classList.add("loaded");
              }

              observer.unobserve(img);
            }
          });
        },
        {
          root: null,
          rootMargin: "50px",
          threshold: 0.1,
        },
      );

      // Observe all lazy loading elements
      document
        .querySelectorAll('img[loading="lazy"], [data-src], [data-bg]')
        .forEach((img) => {
          imageObserver.observe(img);
        });

      console.log("✅ Lazy loading initialized");
    } else {
      // Fallback for browsers without Intersection Observer
      document.querySelectorAll("img[data-src]").forEach((img) => {
        // Handle dimensions in fallback too
        if (img.dataset.width && img.dataset.height) {
          img.width = img.dataset.width;
          img.height = img.dataset.height;
          img.removeAttribute("data-width");
          img.removeAttribute("data-height");
        }

        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        img.classList.add("loaded");
      });

      document.querySelectorAll("[data-bg]").forEach((el) => {
        el.style.backgroundImage = `url(${el.dataset.bg})`;
        el.removeAttribute("data-bg");
        el.classList.add("loaded");
      });
    }
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.setAttribute("role", "alert");

    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
      notification.classList.add("show");
    });

    // Auto-remove after 5 seconds
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }
}

// Initialize the UI manager when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("loaded");
  document.body.classList.remove("loading");

  window.uiManager = new UIManager();
});

// Add essential CSS for notifications
const styles = document.createElement("style");
styles.textContent = `
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
`;
document.head.appendChild(styles);
