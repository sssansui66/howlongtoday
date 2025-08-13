class ThemeManager {
    constructor() {
        this.currentTheme = this.getInitialTheme();
        this.init();
    }

    getInitialTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }

        // Auto detect based on system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }

        // Default to light theme
        return 'light';
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.setupEventListeners();
        this.setupAutoThemeDetection();
    }

    applyTheme(theme) {
        this.currentTheme = theme;
        
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            this.updateThemeIcon('☀️');
            this.updateLogoIcon('hlt_brand_kit/hlt_icon_light_64.png');
        } else {
            document.documentElement.removeAttribute('data-theme');
            this.updateThemeIcon('🌙');
            this.updateLogoIcon('hlt_brand_kit/hlt_icon_dark_64.png');
        }

        localStorage.setItem('theme', theme);
    }

    updateThemeIcon(icon) {
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = icon;
        }
    }

    updateLogoIcon(src) {
        const logoIcon = document.querySelector('.logo-icon');
        if (logoIcon) {
            logoIcon.src = src;
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }

    setupEventListeners() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    setupAutoThemeDetection() {
        // Listen for system theme changes
        if (window.matchMedia) {
            const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            // Modern browsers
            if (darkModeQuery.addEventListener) {
                darkModeQuery.addEventListener('change', (e) => {
                    // Only auto-switch if user hasn't manually set a preference
                    const savedTheme = localStorage.getItem('theme');
                    if (!savedTheme || savedTheme === 'auto') {
                        this.applyTheme(e.matches ? 'dark' : 'light');
                    }
                });
            } 
            // Older browsers
            else if (darkModeQuery.addListener) {
                darkModeQuery.addListener((e) => {
                    const savedTheme = localStorage.getItem('theme');
                    if (!savedTheme || savedTheme === 'auto') {
                        this.applyTheme(e.matches ? 'dark' : 'light');
                    }
                });
            }
        }
    }

    // Check if current time is within night hours (for auto night mode feature)
    isNightTime() {
        const hour = new Date().getHours();
        return hour >= 20 || hour < 6; // 8 PM to 6 AM
    }

    // Optional: Auto switch based on time of day
    enableTimeBasedTheme() {
        const applyTimeBasedTheme = () => {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'auto' || !savedTheme) {
                this.applyTheme(this.isNightTime() ? 'dark' : 'light');
            }
        };

        // Check every minute
        applyTimeBasedTheme();
        setInterval(applyTimeBasedTheme, 60000);
    }
}

// Initialize theme manager
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});