// Advanced Theme Management System
const THEME_KEY = 'theme-preference';
const THEME_TRANSITION_DURATION = 300;

class AdvancedThemeManager {
    constructor() {
        this.theme = localStorage.getItem(THEME_KEY) || 'auto';
        this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        this.reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        this.highContrastQuery = window.matchMedia('(prefers-contrast: high)');
        this.observers = [];
        this.customThemes = new Map();
        this.initialize();
    }

    initialize() {
        this.registerDefaultThemes();
        this.applyTheme();
        this.setupToggle();
        this.setupKeyboardShortcuts();
        this.setupSystemPreferenceListeners();
        this.announceThemeChange();
    }

    registerDefaultThemes() {
        this.customThemes.set('light', {
            name: 'Light',
            primary: '#007acc',
            background: '#ffffff',
            text: '#333333',
            accent: '#ff6b35'
        });

        this.customThemes.set('dark', {
            name: 'Dark',
            primary: '#4fc3f7',
            background: '#121212',
            text: '#ffffff',
            accent: '#ff8a65'
        });

        this.customThemes.set('high-contrast', {
            name: 'High Contrast',
            primary: '#0000ff',
            background: '#000000',
            text: '#ffffff',
            accent: '#ffff00'
        });

        this.customThemes.set('warm', {
            name: 'Warm',
            primary: '#d2691e',
            background: '#fdf6e3',
            text: '#5d4037',
            accent: '#ff5722'
        });
    }

    applyTheme() {
        const isDark = this.theme === 'dark' || 
            (this.theme === 'auto' && this.mediaQuery.matches);
        
        const isHighContrast = this.highContrastQuery.matches;
        const isReducedMotion = this.reducedMotionQuery.matches;
        
        let activeTheme = isDark ? 'dark' : 'light';
        if (isHighContrast) {
            activeTheme = 'high-contrast';
        }
        if (this.customThemes.has(this.theme) && this.theme !== 'auto') {
            activeTheme = this.theme;
        }

        // Apply theme attributes
        document.documentElement.setAttribute('data-theme', activeTheme);
        document.documentElement.setAttribute('data-reduced-motion', isReducedMotion);
        document.documentElement.setAttribute('data-high-contrast', isHighContrast);
        
        // Apply CSS custom properties for active theme
        const themeData = this.customThemes.get(activeTheme);
        if (themeData) {
            this.setCSSVariables(themeData);
        }

        // Update toggle button state
        this.updateToggleButton(isDark);
        
        // Smooth transition for theme changes (respecting reduced motion)
        if (!isReducedMotion) {
            this.animateThemeTransition();
        }

        // Notify observers
        this.notifyObservers(activeTheme, themeData);
        
        // Track theme usage
        if (window.analytics) {
            window.analytics.sendEvent('theme_change', {
                theme: activeTheme,
                method: this.theme === 'auto' ? 'system' : 'manual'
            });
        }
    }

    setCSSVariables(themeData) {
        const root = document.documentElement;
        Object.entries(themeData).forEach(([key, value]) => {
            if (key !== 'name') {
                root.style.setProperty(`--theme-${key}`, value);
            }
        });
    }

    animateThemeTransition() {
        document.documentElement.style.transition = `
            color-scheme ${THEME_TRANSITION_DURATION}ms ease,
            background-color ${THEME_TRANSITION_DURATION}ms ease,
            color ${THEME_TRANSITION_DURATION}ms ease
        `;
        
        setTimeout(() => {
            document.documentElement.style.transition = '';
        }, THEME_TRANSITION_DURATION);
    }

    updateToggleButton(isDark) {
        const toggle = document.getElementById('theme-toggle');
        if (toggle) {
            const icon = toggle.querySelector('i, svg, .icon');
            const label = `Switch to ${isDark ? 'light' : 'dark'} mode`;
            
            toggle.setAttribute('aria-label', label);
            toggle.setAttribute('title', label);
            
            if (icon) {
                icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
            }
            
            // Add ripple effect on click
            toggle.addEventListener('click', this.addRippleEffect.bind(this));
        }
    }

    addRippleEffect(event) {
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('span');
        ripple.className = 'theme-toggle-ripple';
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: currentColor;
            border-radius: 50%;
            opacity: 0.3;
            pointer-events: none;
            animation: ripple-animation 0.6s ease-out;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    toggle() {
        const themes = ['light', 'dark', 'auto'];
        const currentIndex = themes.indexOf(this.theme);
        this.theme = themes[(currentIndex + 1) % themes.length];
        
        localStorage.setItem(THEME_KEY, this.theme);
        this.applyTheme();
        this.announceThemeChange();
    }

    setTheme(themeName) {
        if (this.customThemes.has(themeName) || ['auto', 'light', 'dark'].includes(themeName)) {
            this.theme = themeName;
            localStorage.setItem(THEME_KEY, this.theme);
            this.applyTheme();
            this.announceThemeChange();
        }
    }

    setupToggle() {
        const toggle = document.getElementById('theme-toggle');
        if (toggle) {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggle();
            });
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            // Ctrl/Cmd + Shift + T to toggle theme
            if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'T') {
                event.preventDefault();
                this.toggle();
            }
        });
    }

    setupSystemPreferenceListeners() {
        this.mediaQuery.addEventListener('change', () => {
            if (this.theme === 'auto') {
                this.applyTheme();
            }
        });

        this.highContrastQuery.addEventListener('change', () => {
            this.applyTheme();
        });

        this.reducedMotionQuery.addEventListener('change', () => {
            this.applyTheme();
        });
    }

    announceThemeChange() {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = `Theme changed to ${this.getCurrentThemeName()}`;
        
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    }

    getCurrentThemeName() {
        if (this.theme === 'auto') {
            return this.mediaQuery.matches ? 'dark (auto)' : 'light (auto)';
        }
        const themeData = this.customThemes.get(this.theme);
        return themeData ? themeData.name : this.theme;
    }

    // Observer pattern for theme changes
    addObserver(callback) {
        this.observers.push(callback);
    }

    removeObserver(callback) {
        this.observers = this.observers.filter(obs => obs !== callback);
    }

    notifyObservers(theme, themeData) {
        this.observers.forEach(callback => {
            try {
                callback(theme, themeData);
            } catch (error) {
                console.error('Theme observer error:', error);
            }
        });
    }

    // Advanced theme creation
    createCustomTheme(name, properties) {
        this.customThemes.set(name, {
            name: properties.displayName || name,
            ...properties
        });
    }

    // Theme persistence and sync
    exportThemes() {
        const themes = {};
        this.customThemes.forEach((value, key) => {
            themes[key] = value;
        });
        return JSON.stringify(themes);
    }

    importThemes(themesJson) {
        try {
            const themes = JSON.parse(themesJson);
            Object.entries(themes).forEach(([key, value]) => {
                this.customThemes.set(key, value);
            });
            return true;
        } catch (error) {
            console.error('Failed to import themes:', error);
            return false;
        }
    }
}

// Legacy dark mode function for backward compatibility
function toggleDarkMode() {
    if (window.themeManager) {
        window.themeManager.toggle();
    } else {
        document.documentElement.classList.toggle('dark');
    }
}

// Add required CSS for ripple animation and accessibility
const style = document.createElement('style');
style.textContent = `
@keyframes ripple-animation {
    0% {
        transform: scale(0);
        opacity: 0.3;
    }
    100% {
        transform: scale(2);
        opacity: 0;
    }
}

.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

/* High contrast mode adjustments */
[data-theme="high-contrast"] {
    --theme-primary: #0000ff !important;
    --theme-background: #000000 !important;
    --theme-text: #ffffff !important;
    --theme-accent: #ffff00 !important;
}

/* Reduced motion adjustments */
[data-reduced-motion="true"] * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
}
`;
document.head.appendChild(style);

// Initialize advanced theme manager
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new AdvancedThemeManager();
    
    // Expose theme manager methods globally for debugging and external use
    window.setTheme = (theme) => window.themeManager.setTheme(theme);
    window.getCurrentTheme = () => window.themeManager.theme;
    window.getAvailableThemes = () => Array.from(window.themeManager.customThemes.keys());
});

