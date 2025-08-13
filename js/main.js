class TimeTracker {
    constructor() {
        this.refreshRate = 10;
        this.animationId = null;
        this.timezone = 'local';
        this.language = this.detectLanguage();
        // Cached DOM references for performance
        this.dom = {
            secondsDisplay: null,
            progressBar: null,
            progressPercentage: null,
            currentDate: null,
            currentTime: null,
        };
        // Cached Intl formatters (rebuilt on timezone change)
        this.formatters = {
            date: null,
            time: null,
        };
        // Precomputed constants
        this.CIRCUMFERENCE = 2 * Math.PI * 85; // radius = 85
        this.init();
    }

    init() {
        // Cache DOM nodes once
        this.dom.secondsDisplay = document.getElementById('seconds-display');
        this.dom.progressBar = document.getElementById('circular-progress-bar');
        this.dom.progressPercentage = document.getElementById('progress-percentage');
        this.dom.currentDate = document.getElementById('current-date');
        this.dom.currentTime = document.getElementById('current-time');
        this.setupEventListeners();
        this.loadSettings();
        this.initFormatters();
        this.startTracking();
    }

    detectLanguage() {
        const savedLang = localStorage.getItem('language');
        if (savedLang) return savedLang;
        
        const browserLang = navigator.language || navigator.userLanguage;
        return browserLang.startsWith('zh') ? 'zh-CN' : 'en';
    }

    setupEventListeners() {
        const languageSelector = document.getElementById('language-selector');
        languageSelector.value = this.language;
        languageSelector.addEventListener('change', (e) => {
            this.language = e.target.value;
            localStorage.setItem('language', this.language);
            if (window.i18n) {
                window.i18n.setLanguage(this.language);
            }
        });

        const timezoneSelector = document.getElementById('timezone-selector');
        timezoneSelector.addEventListener('change', (e) => {
            this.timezone = e.target.value;
            localStorage.setItem('timezone', this.timezone);
            this.initFormatters();
        });
    }

    loadSettings() {
        const savedTimezone = localStorage.getItem('timezone');
        if (savedTimezone) {
            this.timezone = savedTimezone;
            document.getElementById('timezone-selector').value = this.timezone;
        }
    }

    initFormatters() {
        // Build formatters only when needed (non-local timezones)
        if (this.timezone === 'local') {
            this.formatters.date = null;
            this.formatters.time = null;
            return;
        }
        this.formatters.date = new Intl.DateTimeFormat('en-CA', {
            timeZone: this.timezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        this.formatters.time = new Intl.DateTimeFormat('en-US', {
            timeZone: this.timezone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    }

    getTodayStart() {
        if (this.timezone === 'local') {
            const now = new Date();
            const todayStart = new Date(now);
            todayStart.setHours(0, 0, 0, 0);
            return todayStart.getTime();
        }

        // For specific timezone, calculate the start of day in that timezone
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: this.timezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });

        const parts = formatter.formatToParts(now);
        const dateParts = {};
        parts.forEach(part => {
            if (part.type !== 'literal') {
                dateParts[part.type] = part.value;
            }
        });

        // Create date string for midnight in target timezone
        const midnightStr = `${dateParts.year}-${dateParts.month}-${dateParts.day}T00:00:00`;
        
        // Get the formatter for midnight
        const midnightFormatter = new Intl.DateTimeFormat('en-US', {
            timeZone: this.timezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZoneName: 'short'
        });

        // Parse the midnight time in target timezone
        const midnightDate = new Date(midnightStr);
        
        // Calculate the offset between local and target timezone
        const localOffset = now.getTimezoneOffset() * 60000;
        const targetDate = new Date(now.toLocaleString('en-US', { timeZone: this.timezone }));
        const localDate = new Date(now.toLocaleString('en-US'));
        const tzOffset = localDate - targetDate;
        
        // Return the start of day adjusted for timezone
        return midnightDate.getTime() + tzOffset;
    }

    calculateElapsedTime() {
        const currentDate = new Date();
        let elapsedSeconds, elapsedMs;
        
        if (this.timezone === 'local') {
            // Local timezone calculation
            const todayStart = new Date(currentDate);
            todayStart.setHours(0, 0, 0, 0);
            elapsedMs = currentDate - todayStart;
            elapsedSeconds = elapsedMs / 1000;
        } else {
            // Get current time in target timezone
            try {
                const formatter = new Intl.DateTimeFormat('en-US', {
                    timeZone: this.timezone,
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                    hour12: false
                });

                const timeString = formatter.format(currentDate);
                const [hours, minutes, seconds] = timeString.split(':').map(Number);
                
                // Calculate elapsed seconds since midnight in target timezone
                elapsedSeconds = hours * 3600 + minutes * 60 + seconds + (currentDate.getMilliseconds() / 1000);
                elapsedMs = elapsedSeconds * 1000;
            } catch (error) {
                console.error('Error calculating time for timezone:', error);
                // Fallback to local time
                const todayStart = new Date(currentDate);
                todayStart.setHours(0, 0, 0, 0);
                elapsedMs = currentDate - todayStart;
                elapsedSeconds = elapsedMs / 1000;
            }
        }
        
        const totalSecondsInDay = 86400;
        const percentage = (elapsedSeconds / totalSecondsInDay) * 100;
        const remainingMs = (totalSecondsInDay * 1000) - elapsedMs;

        return {
            elapsedMs,
            elapsedSeconds,
            percentage,
            remainingMs
        };
    }

    formatTime(date) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    formatDuration(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    updateDisplay() {
        const timeData = this.calculateElapsedTime();
        const now = new Date();

        // Update seconds display with formatted number and data attribute
        const formattedSeconds = timeData.elapsedSeconds.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        this.dom.secondsDisplay.textContent = formattedSeconds;
        this.dom.secondsDisplay.setAttribute('data-value', formattedSeconds);

        // Update circular progress bar
        const offset = this.CIRCUMFERENCE - (timeData.percentage / 100) * this.CIRCUMFERENCE;
        this.dom.progressBar.style.strokeDashoffset = offset;

        // Update percentage
        this.dom.progressPercentage.textContent = `${timeData.percentage.toFixed(1)}%`;

        // Update current date based on timezone
        if (this.timezone === 'local') {
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            this.dom.currentDate.textContent = `${year}-${month}-${day}`;
        } else {
            // Format date in target timezone
            this.dom.currentDate.textContent = this.formatters.date.format(now);
        }

        // Update current time based on timezone
        if (this.timezone === 'local') {
            this.dom.currentTime.textContent = this.formatTime(now);
        } else {
            // Format current time in target timezone
            this.dom.currentTime.textContent = this.formatters.time.format(now);
        }
    }

    startTracking() {
        const animate = () => {
            this.updateDisplay();
            this.animationId = setTimeout(() => {
                requestAnimationFrame(animate);
            }, this.refreshRate);
        };
        animate();
    }

    stopTracking() {
        if (this.animationId) {
            clearTimeout(this.animationId);
            this.animationId = null;
        }
    }

    restartTracking() {
        this.stopTracking();
        this.startTracking();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.timeTracker = new TimeTracker();
});