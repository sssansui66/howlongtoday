class TimezoneManager {
    constructor() {
        this.timezones = [
            { value: 'local', name: 'timezone.local', offset: null },
            { value: 'UTC', name: 'UTC', offset: 0 },
            { value: 'Asia/Shanghai', name: 'timezone.beijing', offset: 8 },
            { value: 'Asia/Tokyo', name: 'timezone.tokyo', offset: 9 },
            { value: 'America/New_York', name: 'timezone.newyork', offset: -5 },
            { value: 'Europe/London', name: 'timezone.london', offset: 0 },
            { value: 'Europe/Paris', name: 'timezone.paris', offset: 1 },
            { value: 'Australia/Sydney', name: 'timezone.sydney', offset: 11 },
            { value: 'Europe/Moscow', name: 'timezone.moscow', offset: 3 },
            { value: 'Asia/Dubai', name: 'timezone.dubai', offset: 4 },
            { value: 'Asia/Singapore', name: 'timezone.singapore', offset: 8 },
            { value: 'America/Los_Angeles', name: 'timezone.losangeles', offset: -8 }
        ];
        
        this.init();
    }

    init() {
        this.populateTimezoneSelector();
        this.detectUserTimezone();
    }

    populateTimezoneSelector() {
        const selector = document.getElementById('timezone-selector');
        if (!selector) return;

        // Clear existing options except the first one (local timezone)
        while (selector.options.length > 1) {
            selector.remove(1);
        }

        // Add timezone options
        this.timezones.slice(1).forEach(tz => {
            const option = document.createElement('option');
            option.value = tz.value;
            option.setAttribute('data-i18n', tz.name);
            option.textContent = this.getTimezoneName(tz);
            selector.appendChild(option);
        });
    }

    getTimezoneName(timezone) {
        // This will be replaced by i18n translation
        const names = {
            'UTC': 'UTC',
            'Asia/Shanghai': '北京时间 (UTC+8)',
            'Asia/Tokyo': '东京时间 (UTC+9)',
            'America/New_York': '纽约时间 (UTC-5)',
            'Europe/London': '伦敦时间 (UTC+0)',
            'Europe/Paris': '巴黎时间 (UTC+1)',
            'Australia/Sydney': '悉尼时间 (UTC+11)',
            'Europe/Moscow': '莫斯科时间 (UTC+3)',
            'Asia/Dubai': '迪拜时间 (UTC+4)',
            'Asia/Singapore': '新加坡时间 (UTC+8)',
            'America/Los_Angeles': '洛杉矶时间 (UTC-8)'
        };
        
        return names[timezone.value] || timezone.value;
    }

    detectUserTimezone() {
        try {
            const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            console.log('Detected timezone:', userTimezone);
            
            // Try to match with our predefined timezones
            const matchedTimezone = this.timezones.find(tz => tz.value === userTimezone);
            if (matchedTimezone) {
                const selector = document.getElementById('timezone-selector');
                if (selector) {
                    selector.value = matchedTimezone.value;
                }
            }
        } catch (error) {
            console.log('Could not detect timezone:', error);
        }
    }

    getTimezoneOffset(timezone) {
        if (timezone === 'local' || !timezone) {
            return new Date().getTimezoneOffset();
        }

        const tz = this.timezones.find(t => t.value === timezone);
        if (tz && tz.offset !== null) {
            return -tz.offset * 60; // Convert hours to minutes and invert
        }

        // Fallback: try to calculate using Date
        try {
            const date = new Date();
            const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
            const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
            return (utcDate - tzDate) / (1000 * 60); // Difference in minutes
        } catch (error) {
            console.error('Error calculating timezone offset:', error);
            return new Date().getTimezoneOffset();
        }
    }

    convertToTimezone(date, timezone) {
        if (timezone === 'local' || !timezone) {
            return date;
        }

        try {
            const options = {
                timeZone: timezone,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            };
            
            const formatter = new Intl.DateTimeFormat('en-US', options);
            const parts = formatter.formatToParts(date);
            
            const dateParts = {};
            parts.forEach(part => {
                dateParts[part.type] = part.value;
            });
            
            return new Date(
                `${dateParts.year}-${dateParts.month}-${dateParts.day}T${dateParts.hour}:${dateParts.minute}:${dateParts.second}`
            );
        } catch (error) {
            console.error('Error converting timezone:', error);
            return date;
        }
    }

    getTodayStartInTimezone(timezone) {
        const now = new Date();
        
        if (timezone === 'local' || !timezone) {
            const todayStart = new Date(now);
            todayStart.setHours(0, 0, 0, 0);
            return todayStart;
        }

        try {
            // Get the date in the target timezone
            const options = {
                timeZone: timezone,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            };
            
            const formatter = new Intl.DateTimeFormat('en-US', options);
            const dateString = formatter.format(now);
            const [month, day, year] = dateString.split('/');
            
            // Create a date object for midnight in that timezone
            const midnightInTz = new Date(`${year}-${month}-${day}T00:00:00`);
            
            // Calculate the offset
            const tzOffset = this.getTimezoneOffset(timezone);
            const localOffset = now.getTimezoneOffset();
            const offsetDiff = (localOffset - tzOffset) * 60000; // Convert to milliseconds
            
            return new Date(midnightInTz.getTime() - offsetDiff);
        } catch (error) {
            console.error('Error getting today start in timezone:', error);
            const todayStart = new Date(now);
            todayStart.setHours(0, 0, 0, 0);
            return todayStart;
        }
    }
}

// Initialize timezone manager
document.addEventListener('DOMContentLoaded', () => {
    window.timezoneManager = new TimezoneManager();
});