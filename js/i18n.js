class I18n {
    constructor() {
        this.currentLanguage = 'zh-CN';
        this.translations = {
            'zh-CN': {
                'logo': 'How Long Today?',
                'seconds.passed': 'seconds have passed today',
                'current.date': '日期：',
                'current.time': '当前时间：',
                'timezone.display': '时区：',
                'timezone.local': '本地时区',
                'refresh.rate': '刷新率：',
                'footer.text': '感知时间的流逝 | HowLongToday',
                'timezone.beijing': '北京时间',
                'timezone.tokyo': '东京时间',
                'timezone.newyork': '纽约时间',
                'timezone.london': '伦敦时间',
                'timezone.paris': '巴黎时间',
                'timezone.sydney': '悉尼时间',
                'timezone.moscow': '莫斯科时间',
                'timezone.dubai': '迪拜时间',
                'timezone.singapore': '新加坡时间',
                'timezone.losangeles': '洛杉矶时间'
            },
            'en': {
                'logo': 'How Long Today?',
                'seconds.passed': 'seconds have passed today',
                'current.date': 'Date:',
                'current.time': 'Current Time:',
                'timezone.display': 'Timezone:',
                'timezone.local': 'Local Timezone',
                'refresh.rate': 'Refresh Rate:',
                'footer.text': 'Feel the passage of time | HowLongToday',
                'timezone.beijing': 'Beijing Time',
                'timezone.tokyo': 'Tokyo Time',
                'timezone.newyork': 'New York Time',
                'timezone.london': 'London Time',
                'timezone.paris': 'Paris Time',
                'timezone.sydney': 'Sydney Time',
                'timezone.moscow': 'Moscow Time',
                'timezone.dubai': 'Dubai Time',
                'timezone.singapore': 'Singapore Time',
                'timezone.losangeles': 'Los Angeles Time'
            }
        };
    }

    setLanguage(lang) {
        this.currentLanguage = lang;
        this.updatePageTranslations();
        document.documentElement.lang = lang;
        
        // Update page title
        const title = 'How Long Today? - How many seconds have passed today?';
        document.title = title;
        
        // Update timezone selector if available
        if (window.timezoneManager) {
            window.timezoneManager.populateTimezoneSelector();
        }
    }

    translate(key) {
        return this.translations[this.currentLanguage][key] || key;
    }

    updatePageTranslations() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.translate(key);
            if (translation) {
                element.textContent = translation;
            }
        });

        // Update placeholders and aria-labels
        this.updateAttributes();
    }

    updateAttributes() {
        const languageSelector = document.getElementById('language-selector');
        const timezoneSelector = document.getElementById('timezone-selector');
        const themeToggle = document.getElementById('theme-toggle');

        if (this.currentLanguage === 'zh-CN') {
            languageSelector.setAttribute('aria-label', '选择语言');
            timezoneSelector.setAttribute('aria-label', '选择时区');
            themeToggle.setAttribute('aria-label', '切换主题');
        } else {
            languageSelector.setAttribute('aria-label', 'Select Language');
            timezoneSelector.setAttribute('aria-label', 'Select Timezone');
            themeToggle.setAttribute('aria-label', 'Toggle Theme');
        }
    }
}

// Initialize i18n
document.addEventListener('DOMContentLoaded', () => {
    window.i18n = new I18n();
    
    // Set initial language
    const savedLang = localStorage.getItem('language');
    const browserLang = navigator.language || navigator.userLanguage;
    const defaultLang = savedLang || (browserLang.startsWith('zh') ? 'zh-CN' : 'en');
    
    window.i18n.setLanguage(defaultLang);
});