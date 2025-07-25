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
        // Don't announce theme change on initial load
    }

    registerDefaultThemes() {
        this.customThemes.set('light', {
            name: 'Light',
            primary: '#3b82f6',
            background: '#ffffff',
            surface: '#f9fafb',
            text: '#111827',
            textSecondary: '#6b7280',
            accent: '#10b981',
            border: '#e5e7eb'
        });

        this.customThemes.set('dark', {
            name: 'Dark',
            primary: '#60a5fa',
            background: '#111827',
            surface: '#1f2937',
            text: '#f9fafb',
            textSecondary: '#d1d5db',
            accent: '#34d399',
            border: '#374151'
        });

        this.customThemes.set('high-contrast', {
            name: 'High Contrast',
            primary: '#0000ff',
            background: '#000000',
            surface: '#000000',
            text: '#ffffff',
            textSecondary: '#ffffff',
            accent: '#ffff00',
            border: '#ffffff'
        });

        this.customThemes.set('warm', {
            name: 'Warm',
            primary: '#f59e0b',
            background: '#fef7ed',
            surface: '#fed7aa',
            text: '#92400e',
            textSecondary: '#d97706',
            accent: '#dc2626',
            border: '#fdba74'
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

        // Apply theme attributes for new components
        document.documentElement.setAttribute('data-theme', activeTheme);
        document.documentElement.setAttribute('data-reduced-motion', isReducedMotion);
        document.documentElement.setAttribute('data-high-contrast', isHighContrast);
        
        // Apply Tailwind dark class for existing components
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        
        // Apply CSS custom properties for active theme
        const themeData = this.customThemes.get(activeTheme);
        if (themeData) {
            this.setCSSVariables(themeData);
        }

        // Update theme selector UI
        this.updateThemeSelector();
        
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

    updateThemeSelector() {
        // Update desktop theme selector
        const themeOptions = document.querySelectorAll('.theme-option');
        const mobileThemeOptions = document.querySelectorAll('.mobile-theme-option');
        
        themeOptions.forEach(option => {
            const themeCheck = option.querySelector('.theme-check');
            const isSelected = option.getAttribute('data-theme') === this.theme;
            
            if (themeCheck) {
                if (isSelected) {
                    themeCheck.classList.remove('hidden');
                    option.classList.add('bg-blue-50', 'dark:bg-blue-900/20');
                } else {
                    themeCheck.classList.add('hidden');
                    option.classList.remove('bg-blue-50', 'dark:bg-blue-900/20');
                }
            }
        });
        
        // Update mobile theme selector
        mobileThemeOptions.forEach(option => {
            const themeCheck = option.querySelector('.mobile-theme-check');
            const isSelected = option.getAttribute('data-theme') === this.theme;
            
            if (themeCheck) {
                if (isSelected) {
                    themeCheck.classList.remove('hidden');
                    option.classList.add('bg-blue-50', 'dark:bg-blue-900/20');
                } else {
                    themeCheck.classList.add('hidden');
                    option.classList.remove('bg-blue-50', 'dark:bg-blue-900/20');
                }
            }
        });
    }

    updateToggleButton(isDark) {
        // Legacy method for backward compatibility
        // The new theme selector doesn't need icon updates
        console.log('🎨 Theme applied:', isDark ? 'dark' : 'light');
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
        console.log('🔄 Toggling theme from:', this.theme);
        const themes = ['light', 'dark', 'auto'];
        const currentIndex = themes.indexOf(this.theme);
        this.theme = themes[(currentIndex + 1) % themes.length];
        
        console.log('🔄 New theme:', this.theme);
        localStorage.setItem(THEME_KEY, this.theme);
        this.applyTheme();
        this.announceThemeChange();
    }

    setTheme(themeName) {
        if (this.customThemes.has(themeName) || ['auto', 'light', 'dark'].includes(themeName)) {
            console.log('🎯 Setting theme to:', themeName);
            this.theme = themeName;
            localStorage.setItem(THEME_KEY, this.theme);
            this.applyTheme();
            this.announceThemeChange();
        }
    }

    setupToggle() {
        // Setup theme selector options (desktop)
        const themeOptions = document.querySelectorAll('.theme-option');
        const mobileThemeOptions = document.querySelectorAll('.mobile-theme-option');
        
        console.log('🔧 Setting up theme selector...');
        console.log('Desktop theme options found:', themeOptions.length);
        console.log('Mobile theme options found:', mobileThemeOptions.length);
        
        // Handle desktop theme options
        themeOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const selectedTheme = option.getAttribute('data-theme');
                console.log('🖱️ Desktop theme selected:', selectedTheme);
                this.setTheme(selectedTheme);
                
                // Close settings menu
                const settingsMenu = document.getElementById('settings-menu');
                if (settingsMenu) {
                    settingsMenu.classList.add('hidden');
                }
            });
        });
        
        // Handle mobile theme options
        mobileThemeOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const selectedTheme = option.getAttribute('data-theme');
                console.log('📱 Mobile theme selected:', selectedTheme);
                this.setTheme(selectedTheme);
                
                // Close mobile menu
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu) {
                    mobileMenu.classList.add('hidden');
                }
            });
        });
        
        // Update the UI to show current selection
        this.updateThemeSelector();
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
    --theme-surface: #000000 !important;
    --theme-text: #ffffff !important;
    --theme-textSecondary: #ffffff !important;
    --theme-accent: #ffff00 !important;
    --theme-border: #ffffff !important;
}

[data-theme="high-contrast"] * {
    border-color: #ffffff !important;
}

[data-theme="high-contrast"] .bg-white {
    background-color: #000000 !important;
}

[data-theme="high-contrast"] .bg-gray-50,
[data-theme="high-contrast"] .bg-gray-100 {
    background-color: #000000 !important;
}

[data-theme="high-contrast"] .text-gray-700,
[data-theme="high-contrast"] .text-gray-800,
[data-theme="high-contrast"] .text-gray-900 {
    color: #ffffff !important;
}

/* Warm theme adjustments */
[data-theme="warm"] {
    --theme-primary: #f59e0b !important;
    --theme-background: #fef7ed !important;
    --theme-surface: #fed7aa !important;
    --theme-text: #92400e !important;
    --theme-textSecondary: #d97706 !important;
    --theme-accent: #dc2626 !important;
    --theme-border: #fdba74 !important;
}

[data-theme="warm"] .bg-white {
    background-color: #fef7ed !important;
}

[data-theme="warm"] .bg-gray-50 {
    background-color: #fed7aa !important;
}

[data-theme="warm"] .bg-gray-100 {
    background-color: #fdba74 !important;
}

[data-theme="warm"] .text-gray-700,
[data-theme="warm"] .text-gray-800,
[data-theme="warm"] .text-gray-900 {
    color: #92400e !important;
}

[data-theme="warm"] .text-blue-600 {
    color: #f59e0b !important;
}

[data-theme="warm"] .bg-blue-600 {
    background-color: #f59e0b !important;
}

[data-theme="warm"] .hover\\:bg-blue-700:hover {
    background-color: #d97706 !important;
}

/* Reduced motion adjustments */
[data-reduced-motion="true"] * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
}

/* Theme selector styling */
.theme-option.bg-blue-50 {
    background-color: rgba(59, 130, 246, 0.1);
}

.mobile-theme-option.bg-blue-50 {
    background-color: rgba(59, 130, 246, 0.1);
}
`;
document.head.appendChild(style);

// Initialize advanced theme manager
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 Initializing Advanced Theme Manager...');
    window.themeManager = new AdvancedThemeManager();
    
    // Expose theme manager methods globally for debugging and external use
    window.setTheme = (theme) => window.themeManager.setTheme(theme);
    window.getCurrentTheme = () => window.themeManager.theme;
    window.getAvailableThemes = () => Array.from(window.themeManager.customThemes.keys());
    
    console.log('🎨 Theme Manager initialized successfully!');
    console.log('Current theme:', window.themeManager.theme);
    console.log('Available themes:', window.getAvailableThemes());
});

