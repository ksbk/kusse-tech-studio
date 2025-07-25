// Animation and interaction enhancements

document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initializeScrollAnimations();
    initializeLoadingAnimation();
    initializeFormAnimations();
    initializeCardHoverEffects();
});

// Intersection Observer for scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                entry.target.classList.remove('opacity-0');
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => {
        el.classList.add('opacity-0');
        observer.observe(el);
    });
}

// Page loading animation
function initializeLoadingAnimation() {
    // Add loading class to body
    document.body.classList.add('loading');
    
    // Remove loading after page is ready
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.body.classList.remove('loading');
            document.body.classList.add('loaded');
        }, 150);
    });
}

// Form interaction animations
function initializeFormAnimations() {
    const formInputs = document.querySelectorAll('input, textarea');
    
    formInputs.forEach(input => {
        const label = input.previousElementSibling;
        
        // Add focus/blur animations
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('form-field-focused');
            if (label) label.classList.add('text-blue-600', 'dark:text-blue-400');
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('form-field-focused');
            if (label && !input.value) {
                label.classList.remove('text-blue-600', 'dark:text-blue-400');
            }
        });
        
        // Floating label effect for non-empty fields
        if (input.value) {
            if (label) label.classList.add('text-blue-600', 'dark:text-blue-400');
        }
    });
    
    // Form submission animation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.classList.add('loading');
                submitButton.disabled = true;
                
                // Add loading spinner
                const originalText = submitButton.textContent;
                submitButton.innerHTML = `
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                `;
            }
        });
    });
}

// Card hover effects
function initializeCardHoverEffects() {
    const cards = document.querySelectorAll('.hover-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px) scale(1.02)';
            card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

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

// Add typing animation for hero text
function addTypingAnimation() {
    const typingElements = document.querySelectorAll('.typing-animation');
    
    typingElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        element.style.borderRight = '2px solid';
        element.style.animation = 'blink 1s infinite';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                element.style.borderRight = 'none';
                element.style.animation = 'none';
            }
        };
        
        // Start typing animation with delay
        setTimeout(typeWriter, 500);
    });
}

// Initialize typing animation
setTimeout(addTypingAnimation, 1000);
