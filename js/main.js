class TimeTracker {
    constructor() {
        this.refreshRate = 100;
        this.animationId = null;
        this.timezone = 'local';
        this.language = this.detectLanguage();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSettings();
        this.startTracking();
        this.updateTimezoneDisplay();
    }

    detectLanguage() {
        const savedLang = localStorage.getItem('language');
        if (savedLang) return savedLang;
        
        const browserLang = navigator.language || navigator.userLanguage;
        return browserLang.startsWith('zh') ? 'zh-CN' : 'en';
    }

    setupEventListeners() {
        const refreshRateSlider = document.getElementById('refresh-rate');
        const refreshRateValue = document.getElementById('refresh-rate-value');
        
        refreshRateSlider.addEventListener('input', (e) => {
            this.refreshRate = parseInt(e.target.value);
            refreshRateValue.textContent = `${this.refreshRate}ms`;
            localStorage.setItem('refreshRate', this.refreshRate);
            this.restartTracking();
        });

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
            this.updateTimezoneDisplay();
        });
    }

    loadSettings() {
        const savedRefreshRate = localStorage.getItem('refreshRate');
        if (savedRefreshRate) {
            this.refreshRate = parseInt(savedRefreshRate);
            document.getElementById('refresh-rate').value = this.refreshRate;
            document.getElementById('refresh-rate-value').textContent = `${this.refreshRate}ms`;
        }

        const savedTimezone = localStorage.getItem('timezone');
        if (savedTimezone) {
            this.timezone = savedTimezone;
            document.getElementById('timezone-selector').value = this.timezone;
        }
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

        // Update seconds display
        const secondsDisplay = document.getElementById('seconds-display');
        secondsDisplay.textContent = timeData.elapsedSeconds.toFixed(3);

        // Update progress bar
        const progressBar = document.getElementById('progress-bar');
        progressBar.style.width = `${Math.min(timeData.percentage, 100)}%`;

        // Update percentage
        const progressPercentage = document.getElementById('progress-percentage');
        progressPercentage.textContent = `${timeData.percentage.toFixed(1)}%`;

        // Update current date based on timezone
        const currentDateElement = document.getElementById('current-date');
        if (this.timezone === 'local') {
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            currentDateElement.textContent = `${year}-${month}-${day}`;
        } else {
            // Format date in target timezone
            const formatter = new Intl.DateTimeFormat('en-CA', {
                timeZone: this.timezone,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
            currentDateElement.textContent = formatter.format(now);
        }

        // Update current time based on timezone
        const currentTime = document.getElementById('current-time');
        if (this.timezone === 'local') {
            currentTime.textContent = this.formatTime(now);
        } else {
            // Format current time in target timezone
            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: this.timezone,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
            currentTime.textContent = formatter.format(now);
        }
    }

    updateTimezoneDisplay() {
        const timezoneDisplay = document.getElementById('timezone-display');
        if (this.timezone === 'local') {
            const offset = new Date().getTimezoneOffset();
            const offsetHours = Math.abs(Math.floor(offset / 60));
            const offsetMinutes = Math.abs(offset % 60);
            const sign = offset <= 0 ? '+' : '-';
            const offsetString = offsetMinutes > 0 
                ? `UTC${sign}${offsetHours}:${String(offsetMinutes).padStart(2, '0')}`
                : `UTC${sign}${offsetHours}`;
            timezoneDisplay.textContent = offsetString;
        } else {
            // Get timezone abbreviation
            const now = new Date();
            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: this.timezone,
                timeZoneName: 'short'
            });
            const parts = formatter.formatToParts(now);
            const timeZoneName = parts.find(part => part.type === 'timeZoneName');
            timezoneDisplay.textContent = timeZoneName ? timeZoneName.value : this.timezone;
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