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
                'timezone.losangeles': '洛杉矶时间',
                'time.reference.title': '时间尺度参考',
                'time.reference.duration': '时间长度',
                'time.reference.concept': '概念对照',
                'time.reference.activities': '代表性活动',
                'time.reference.second': '秒',
                'time.reference.seconds': '秒',
                'time.reference.1s.concept': '眨眼四次',
                'time.reference.1s.activity': '眨眼、提醒自己保持专注',
                'time.reference.10s.concept': '几次深呼吸',
                'time.reference.10s.activity': '调整坐姿、微笑、深呼吸',
                'time.reference.100s.concept': '1 分 40 秒',
                'time.reference.100s.activity': '两分钟法则，快速回复、整理',
                'time.reference.1000s.concept': '≈16.7 分钟',
                'time.reference.1000s.activity': '看 TED 演讲、简版番茄专注',
                'time.reference.10000s.concept': '≈2 小时 46 分钟',
                'time.reference.10000s.activity': '看完电影《沙丘2》(1倍速)/《泰坦尼克号》(1.2倍速)'
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
                'timezone.losangeles': 'Los Angeles Time',
                'time.reference.title': 'Time Scale Reference',
                'time.reference.duration': 'Duration',
                'time.reference.concept': 'Conceptual Reference',
                'time.reference.activities': 'Representative Activities',
                'time.reference.second': 'second',
                'time.reference.seconds': 'seconds',
                'time.reference.1s.concept': 'Four blinks',
                'time.reference.1s.activity': 'Blink, remind yourself to stay focused',
                'time.reference.10s.concept': 'A few deep breaths',
                'time.reference.10s.activity': 'Adjust posture, smile, deep breathing',
                'time.reference.100s.concept': '1 min 40 sec',
                'time.reference.100s.activity': 'Two-minute rule, quick reply, organize',
                'time.reference.1000s.concept': '≈16.7 minutes',
                'time.reference.1000s.activity': 'Watch TED talk, mini Pomodoro session',
                'time.reference.10000s.concept': '≈2 hours 46 minutes',
                'time.reference.10000s.activity': 'Watch a movie: Dune 2 (1x speed) / Titanic (1.2x speed)'
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