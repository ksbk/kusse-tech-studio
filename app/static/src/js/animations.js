// Advanced Animation and Interaction System

class AdvancedAnimations {
    constructor() {
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.observers = new Map();
        this.init();
    }

    init() {
        this.initializeScrollAnimations();
        this.initializeLoadingAnimation();
        this.initializeFormAnimations();
        this.initializeCardHoverEffects();
        this.initializeParallaxEffects();
        this.initializeMicroInteractions();
        this.initializePageTransitions();
    }

    // Method to manually trigger animations for elements currently in viewport
    triggerAnimationsInViewport() {
        console.log('🎬 Manually triggering animations in viewport...');
        const animateElements = document.querySelectorAll('.animate-on-scroll, [data-animate]');
        animateElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible && el.style.opacity === '0') {
                console.log('👁️ Making visible:', el);
                this.animateIn(el);
            }
        });
    }

    // Enhanced Intersection Observer for scroll animations
    initializeScrollAnimations() {
        const observerOptions = {
            threshold: [0, 0.1, 0.5, 1],
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const animationType = target.dataset.animate || 'fade-up';
                    const delay = parseFloat(target.dataset.delay) || 0;
                    
                    setTimeout(() => {
                        this.animateIn(target, animationType);
                    }, delay * 1000);
                }
            });
        }, observerOptions);

        // Observe elements with animation classes
        const animateElements = document.querySelectorAll('.animate-on-scroll, [data-animate]');
        animateElements.forEach(el => {
            if (!this.isReducedMotion && !document.body.classList.contains('prefers-reduced-motion')) {
                // Only hide elements if animations are enabled
                setTimeout(() => {
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(30px)';
                }, 100); // Small delay to prevent flash
            }
            observer.observe(el);
        });

        this.observers.set('scroll', observer);
    }

    animateIn(element, type = 'fade-up') {
        if (this.isReducedMotion) {
            element.style.opacity = '1';
            element.style.transform = 'none';
            return;
        }

        element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        
        switch (type) {
            case 'fade-up':
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                break;
            case 'fade-in':
                element.style.opacity = '1';
                break;
            case 'slide-left':
                element.style.opacity = '1';
                element.style.transform = 'translateX(0)';
                break;
            case 'scale':
                element.style.opacity = '1';
                element.style.transform = 'scale(1)';
                break;
            case 'stagger':
                this.staggerAnimation(element.children);
                break;
            default:
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
        }
    }

    staggerAnimation(elements, delay = 100) {
        Array.from(elements).forEach((el, index) => {
            setTimeout(() => {
                this.animateIn(el, 'fade-up');
            }, index * delay);
        });
    }

    // Enhanced page loading animation
    initializeLoadingAnimation() {
        document.body.classList.add('loading');
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.body.classList.remove('loading');
                document.body.classList.add('loaded');
                
                if (!this.isReducedMotion) {
                    this.playLoadSequence();
                }
            }, 150);
        });
    }

    playLoadSequence() {
        const sequence = [
            { selector: '.page-header h1', delay: 0 },
            { selector: '.page-header p', delay: 200 },
            { selector: '.nav-item', delay: 400, stagger: 100 },
            { selector: '.hero-content', delay: 600 },
            { selector: '.feature-card', delay: 800, stagger: 150 }
        ];

        sequence.forEach(({ selector, delay, stagger }) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((el, index) => {
                setTimeout(() => {
                    this.animateIn(el, 'fade-up');
                }, delay + (stagger ? index * stagger : 0));
            });
        });
    }

    // Enhanced form interaction animations
    initializeFormAnimations() {
        const formInputs = document.querySelectorAll('input, textarea, select');
        
        formInputs.forEach(input => {
            const container = input.closest('.form-field') || input.parentElement;
            const label = container.querySelector('label');
            
            // Enhanced focus/blur animations
            input.addEventListener('focus', () => {
                container.classList.add('form-field-focused');
                if (label && !this.isReducedMotion) {
                    label.style.transform = 'translateY(-25px) scale(0.85)';
                    label.style.color = '#3b82f6';
                    label.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                }
                
                // Add focus ripple effect
                this.createFocusRipple(input);
            });
            
            input.addEventListener('blur', () => {
                container.classList.remove('form-field-focused');
                if (label && !input.value && !this.isReducedMotion) {
                    label.style.transform = 'translateY(0) scale(1)';
                    label.style.color = '#6b7280';
                }
            });
            
            // Floating label for pre-filled fields
            if (input.value && label) {
                label.style.transform = 'translateY(-25px) scale(0.85)';
                label.style.color = '#3b82f6';
            }
        });
        
        // Enhanced form submission animation
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                const submitButton = form.querySelector('button[type="submit"]');
                if (submitButton) {
                    this.animateSubmitButton(submitButton);
                }
            });
        });
    }

    createFocusRipple(input) {
        if (this.isReducedMotion) return;
        
        const ripple = document.createElement('div');
        ripple.className = 'focus-ripple';
        ripple.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border: 2px solid #3b82f6;
            border-radius: inherit;
            opacity: 0;
            pointer-events: none;
            animation: focusRipple 0.6s ease-out;
        `;
        
        input.parentElement.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    animateSubmitButton(button) {
        const originalText = button.textContent;
        
        if (!this.isReducedMotion) {
            // Scale down animation
            button.style.transform = 'scale(0.95)';
            button.style.transition = 'transform 0.15s ease-in';
            
            setTimeout(() => {
                button.style.transform = 'scale(1)';
                button.style.transition = 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            }, 150);
        }
        
        // Update button content
        button.classList.add('loading');
        button.disabled = true;
        button.innerHTML = `
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending...
        `;
    }

    // Enhanced card hover effects with 3D transforms
    initializeCardHoverEffects() {
        const cards = document.querySelectorAll('.hover-card, .project-card, .service-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                if (this.isReducedMotion) return;
                
                // Create ripple effect
                this.createHoverRipple(e, card);
                
                // 3D transform effect
                card.style.transform = 'translateY(-8px) rotateX(5deg) scale(1.02)';
                card.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
                card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                
                // Animate child elements
                const elements = card.querySelectorAll('h3, p, .btn');
                elements.forEach((el, index) => {
                    setTimeout(() => {
                        el.style.transform = 'translateY(-4px)';
                        el.style.transition = 'transform 0.3s ease-out';
                    }, index * 50);
                });
            });
            
            card.addEventListener('mouseleave', () => {
                if (this.isReducedMotion) return;
                
                card.style.transform = 'translateY(0) rotateX(0deg) scale(1)';
                card.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                
                const elements = card.querySelectorAll('h3, p, .btn');
                elements.forEach(el => {
                    el.style.transform = 'translateY(0)';
                });
            });
            
            // Magnetic effect for buttons inside cards
            const buttons = card.querySelectorAll('.btn, button');
            buttons.forEach(btn => {
                btn.addEventListener('mousemove', (e) => {
                    if (this.isReducedMotion) return;
                    
                    const rect = btn.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    
                    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
                });
                
                btn.addEventListener('mouseleave', () => {
                    btn.style.transform = 'translate(0, 0)';
                    btn.style.transition = 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                });
            });
        });
    }

    createHoverRipple(event, element) {
        if (this.isReducedMotion) return;
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('div');
        ripple.className = 'hover-ripple';
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            pointer-events: none;
            transform: scale(0);
            animation: hoverRipple 0.8s ease-out;
            z-index: 1;
        `;
        
        element.appendChild(ripple);
        setTimeout(() => ripple.remove(), 800);
    }

    // Parallax effects for enhanced depth
    initializeParallaxEffects() {
        if (this.isReducedMotion) return;
        
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        let ticking = false;
        
        const updateParallax = () => {
            const scrollY = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = parseFloat(element.dataset.parallax) || 0.5;
                const yPos = -(scrollY * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
            
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });
    }

    // Micro-interactions for enhanced UX
    initializeMicroInteractions() {
        // Button click ripples
        document.addEventListener('click', (e) => {
            const button = e.target.closest('button, .btn, a[role="button"]');
            if (button && !this.isReducedMotion) {
                this.createClickRipple(e, button);
            }
        });
        
        // Smooth scroll for anchor links
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const target = document.querySelector(e.target.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
        
        // Typing animation for hero text
        this.initializeTypingAnimation();
    }

    createClickRipple(event, element) {
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            pointer-events: none;
            transform: scale(0);
            animation: clickRipple 0.6s ease-out;
            z-index: 1000;
        `;
        
        element.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    initializeTypingAnimation() {
        const typingElements = document.querySelectorAll('.typing-animation, [data-typewriter]');
        
        typingElements.forEach(element => {
            const text = element.textContent;
            const speed = parseInt(element.dataset.speed) || 100;
            
            element.textContent = '';
            element.style.borderRight = '2px solid currentColor';
            element.style.animation = 'blink 1s infinite';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, speed);
                } else {
                    element.style.borderRight = 'none';
                    element.style.animation = 'none';
                }
            };
            
            // Start typing animation with delay
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(typeWriter, 500);
                        observer.unobserve(element);
                    }
                });
            });
            
            observer.observe(element);
        });
    }

    // Page transitions
    initializePageTransitions() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (link && 
                link.href.startsWith(window.location.origin) && 
                !link.target && 
                !e.ctrlKey && 
                !e.metaKey &&
                !this.isReducedMotion) {
                
                e.preventDefault();
                this.transitionToPage(link.href);
            }
        });
    }

    transitionToPage(url) {
        const main = document.querySelector('main') || document.body;
        
        main.style.transform = 'translateY(-20px)';
        main.style.opacity = '0';
        main.style.transition = 'all 0.3s ease-in-out';
        
        setTimeout(() => {
            window.location.href = url;
        }, 300);
    }

    // Cleanup method
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
    }
}

// Initialize advanced animations
document.addEventListener('DOMContentLoaded', function() {
    // Add classes to enable animation system
    document.body.classList.add('js-enabled');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.classList.add('prefers-reduced-motion');
    }
    
    window.advancedAnimations = new AdvancedAnimations();
    
    // Add required CSS animations
    const animationStyles = `
        /* Fallback to ensure content is visible if animations fail */
        .animate-on-scroll {
            opacity: 1 !important;
            transform: none !important;
        }
        
        /* Only hide for animation if not reduced motion and JS is working */
        .js-enabled:not(.prefers-reduced-motion) .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
        }
        
        @keyframes focusRipple {
            0% { transform: scale(0.8); opacity: 1; }
            100% { transform: scale(1.1); opacity: 0; }
        }
        
        @keyframes hoverRipple {
            0% { transform: scale(0); opacity: 1; }
            100% { transform: scale(2); opacity: 0; }
        }
        
        @keyframes clickRipple {
            0% { transform: scale(0); opacity: 1; }
            100% { transform: scale(4); opacity: 0; }
        }
        
        @keyframes blink {
            0%, 50% { border-color: currentColor; }
            51%, 100% { border-color: transparent; }
        }
        
        .form-field {
            position: relative;
            overflow: hidden;
        }
        
        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = animationStyles;
    document.head.appendChild(styleSheet);
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.advancedAnimations) {
        window.advancedAnimations.destroy();
    }
});
