// Best Practice Hero Section Animations - Accessibility First
document.addEventListener("DOMContentLoaded", function () {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // Enhanced typing effect for the hero headline
  const typingElement = document.querySelector(".typing-effect");
  if (typingElement && !prefersReducedMotion) {
    const text = typingElement.textContent;
    typingElement.textContent = "";
    typingElement.setAttribute("aria-live", "polite");

    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        typingElement.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      } else {
        // Announce completion to screen readers
        typingElement.setAttribute("aria-live", "off");
      }
    };

    // Start typing after a short delay
    setTimeout(typeWriter, 1000);
  }

  // Accessible stats counter animation with intersection observer
  const statsElements = document.querySelectorAll("[data-stat]");

  if (statsElements.length > 0) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !prefersReducedMotion) {
            const element = entry.target;
            const targetValue = parseInt(
              element.getAttribute("data-stat") || element.textContent,
            );
            const suffix = element.textContent.replace(/[0-9]/g, "");
            let currentValue = 0;
            const increment = Math.ceil(targetValue / 30);

            element.setAttribute("aria-live", "polite");

            const counter = setInterval(() => {
              currentValue += increment;
              if (currentValue >= targetValue) {
                element.textContent = targetValue + suffix;
                element.setAttribute("aria-live", "off");
                clearInterval(counter);
              } else {
                element.textContent = currentValue + suffix;
              }
            }, 50);

            // Only animate once
            statsObserver.unobserve(element);
          } else if (entry.isIntersecting && prefersReducedMotion) {
            // Just show final values for reduced motion
            const element = entry.target;
            const targetValue = parseInt(
              element.getAttribute("data-stat") || element.textContent,
            );
            const suffix = element.textContent.replace(/[0-9]/g, "");
            element.textContent = targetValue + suffix;
            statsObserver.unobserve(element);
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    statsElements.forEach((element) => {
      statsObserver.observe(element);
    });
  }

  // Enhanced smooth scroll with proper focus management
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const target = document.getElementById(targetId);

      if (target) {
        // Smooth scroll with reduced motion support
        const scrollBehavior = prefersReducedMotion ? "auto" : "smooth";
        target.scrollIntoView({
          behavior: scrollBehavior,
          block: "start",
        });

        // Manage focus for accessibility
        target.focus();
        if (document.activeElement !== target) {
          target.setAttribute("tabindex", "-1");
          target.focus();
        }
      }
    });
  });

  // Enhanced CTA button interactions with proper ARIA
  const ctaButtons = document.querySelectorAll(".hero-cta");
  ctaButtons.forEach((button, index) => {
    // Add ARIA labels if not present
    if (!button.getAttribute("aria-label")) {
      const text = button.textContent.trim();
      button.setAttribute("aria-label", text);
    }

    // Enhanced keyboard support
    button.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.click();
      }
    });

    // Track CTA interactions for A/B testing
    button.addEventListener("click", function () {
      // Analytics event (replace with your analytics solution)
      if (typeof gtag !== "undefined") {
        gtag("event", "cta_click", {
          cta_position: index === 0 ? "primary" : "secondary",
          cta_text: this.textContent.trim(),
          page_location: window.location.href,
        });
      }
    });
  });

  // Add smooth reveal animation for hero elements
  const heroElements = document.querySelectorAll(".animate-fade-in-up");

  if (heroElements.length > 0 && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      },
    );

    heroElements.forEach((element, index) => {
      // Set initial state
      element.style.opacity = "0";
      element.style.transform = "translateY(20px)";
      element.style.transition = `opacity 0.8s ease-out ${index * 0.2}s, transform 0.8s ease-out ${index * 0.2}s`;

      revealObserver.observe(element);
    });
  }

  // Performance monitoring for hero load time
  const heroSection = document.querySelector(".hero-section");
  if (heroSection) {
    const heroLoadTime = performance.now();

    // Mark hero as loaded
    setTimeout(() => {
      heroSection.setAttribute("data-loaded", "true");

      // Report hero load time for optimization
      if (typeof gtag !== "undefined") {
        gtag("event", "timing_complete", {
          name: "hero_load",
          value: Math.round(heroLoadTime),
        });
      }
    }, 100);
  }

  // Add focus trap for keyboard navigation
  const focusableElements = document.querySelectorAll(
    'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select',
  );

  if (focusableElements.length > 0) {
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    document.addEventListener("keydown", function (e) {
      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        } else if (!e.shiftKey && document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    });
  }
});
