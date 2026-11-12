// Shared language service. All features listen to the same language event.
window.Tymio = (() => {
    const languages = [
        'kk', 'ru', 'en'
    ];
    let language = 'kk';
    try {
        const stored = localStorage.getItem('tymio-language');
        if (languages.includes(stored))
            language = stored;
    }
    catch {
        // Storage can be unavailable in private browsing.
    }
    function text(values) {
        return values[languages.indexOf(language)];
    }
    function setLanguage(value) {
        if (!languages.includes(value))
            return;
        language = value;
        document.documentElement.lang = value;
        try {
            localStorage.setItem('tymio-language', value);
        }
        catch {
        }
        window.dispatchEvent(new CustomEvent('tymio-language', {
            detail: value
        }));
    }
    function save(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        }
        catch {
        }
    }
    function read(key, fallback) {
        try {
            return JSON.parse(localStorage.getItem(key)) ?? fallback;
        }
        catch {
            return fallback;
        }
    }
    return {
        text, setLanguage, save, read, get language() {
            return language;
        }
    };
})();
(() => {
    const text = window.Tymio.text;
    const translations = [
        [
            '.skip', [
                'Мазмұнға өту', 'Перейти к содержимому', 'Skip to content'
            ]
        ],
        [
            '#panel p', [
                'Tab — келесі батырма. Enter — таңдау. Дыбыс қажет емес.', 'Tab — следующая кнопка. Enter — выбор. Звук не требуется.', 'Tab: next control. Enter: select. No sound is required.'
            ]
        ],
        [
            '.hero .eyebrow', [
                'БІЛІМГЕ КЕДЕРГІ ЖОҚ / TYMIO', 'ЗНАНИЯ БЕЗ БАРЬЕРОВ / TYMIO', 'LEARNING WITHOUT BARRIERS / TYMIO'
            ]
        ],
        [
            '.tags span:nth-child(1)', [
                'Үш тілде', 'На трёх языках', 'Three languages'
            ]
        ],
        [
            '.tags span:nth-child(2)', [
                'Өз қарқыныңмен', 'В своём темпе', 'At your own pace'
            ]
        ],
        [
            '.tags span:nth-child(3)', [
                'Тегін', 'Бесплатно', 'Free'
            ]
        ],
        [
            '.sticker', [
                'Сенің қолыңнан келеді ↗', 'У тебя получится ↗', 'You can do this ↗'
            ]
        ],
        [
            '.strip span:nth-child(1)', [
                '01 / ҮЙРЕН', '01 / УЧИСЬ', '01 / LEARN'
            ]
        ],
        [
            '.strip span:nth-child(2)', [
                '02 / ОЙНА', '02 / ИГРАЙ', '02 / PLAY'
            ]
        ],
        [
            '.strip span:nth-child(3)', [
                '03 / ЖАСА', '03 / СОЗДАВАЙ', '03 / CREATE'
            ]
        ],
        [
            '.strip span:nth-child(4)', [
                '∞ / ӨС', '∞ / РАСТИ', '∞ / GROW'
            ]
        ],
        [
            '#learn .sectionhead .eyebrow', [
                'КІШКЕНТАЙ ҚАДАМ. ҮЛКЕН БАСТАМА.', 'МАЛЕНЬКИЙ ШАГ. БОЛЬШОЕ НАЧАЛО.', 'SMALL STEPS. BIG BEGINNINGS.'
            ]
        ],
        [
            '#learn h2', [
                'Код әлеміне қош келдің.', 'Добро пожаловать в мир кода.', 'Welcome to the world of code.'
            ]
        ],
        [
            '#play .eyebrow', [
                'ОЙНАП ҮЙРЕН / CODE QUEST', 'УЧИСЬ ИГРАЯ / CODE QUEST', 'LEARN THROUGH PLAY / CODE QUEST'
            ]
        ],
        [
            '#play > div > p:first-of-type', [
                'Командаларды ретімен қосып, роботты жұлдызға жеткіз. Қабырғалардан айналып өт. Әр орындау бастапқы ұяшықтан басталады.', 'Добавляй команды по порядку и доведи робота до звезды. Обходи стены. Каждый запуск начинается со стартовой клетки.', 'Queue commands to guide the robot to the star. Avoid walls. Every run starts from the starting cell.'
            ]
        ],
        [
            '[data-move="U"]', [
                '↑ Жоғары', '↑ Вверх', '↑ Up'
            ]
        ],
        [
            '[data-move="D"]', [
                '↓ Төмен', '↓ Вниз', '↓ Down'
            ]
        ],
        [
            '[data-move="L"]', [
                '← Солға', '← Влево', '← Left'
            ]
        ],
        [
            '[data-move="R"]', [
                '→ Оңға', '→ Вправо', '→ Right'
            ]
        ],
        [
            '#reset', [
                'Қайта бастау', 'Начать заново', 'Restart'
            ]
        ],
        [
            '#undo', [
                '↶ Соңғысын өшіру', '↶ Удалить последнюю', '↶ Undo last'
            ]
        ],
        [
            '.legend', [
                '🤖 Робот · ★ Мақсат · ▧ Қабырға', '🤖 Робот · ★ Цель · ▧ Стена', '🤖 Robot · ★ Goal · ▧ Wall'
            ]
        ],
        [
            '#video .eyebrow', [
                'КӨР. ОҚЫ. ҚАЙТАЛА.', 'СМОТРИ. ЧИТАЙ. ПОВТОРЯЙ.', 'WATCH. READ. REPEAT.'
            ]
        ],
        [
            '.videobox > p:first-of-type', [
                'Өз видеоңды таңдап, осы жерде көр.', 'Выбери своё видео и смотри здесь.', 'Choose your own video to watch here.'
            ]
        ],
        [
            '.videogrid article h3', [
                'Бірінші сабақ: мәтін шығару', 'Первый урок: вывод текста', 'First lesson: displaying text'
            ]
        ],
        [
            '.videogrid article > p:nth-of-type(1)', [
                'Python-да print() нәтижені экранға шығарады. Мәтін тырнақшаға алынады.', 'В Python print() выводит результат на экран. Текст записывается в кавычках.', 'In Python print() displays output. Put text inside quotation marks.'
            ]
        ],
        [
            '.videogrid article > p:nth-of-type(2)', [
                'Нәтиже: Hello, world!', 'Результат: Hello, world!', 'Output: Hello, world!'
            ]
        ],
        [
            '.videogrid article > p:nth-of-type(3)', [
                'Өзің орында: My first code мәтінін экранға шығар.', 'Попробуй вывести текст My first code.', 'Try displaying the text My first code.'
            ]
        ],
        [
            '.videogrid summary', [
                'Жауабын көру', 'Показать ответ', 'Show answer'
            ]
        ],
        [
            '.videogrid article .notice', [
                'Ым тіліндегі дайын видеолар әлі қосылмаған. Маманмен түсірілген видеоны және VTT субтитрін таңдай аласың. Жоғарыда сабақтың мәтіндік нұсқасы бар.', 'Готовые видео на жестовом языке пока не добавлены. Можно выбрать видео, снятое со специалистом, и субтитры VTT. Выше доступна текстовая версия урока.', 'Sign-language videos have not been added yet. You can choose a video recorded with a qualified signer and VTT captions. A text version of the lesson is available above.'
            ]
        ],
        [
            '.support .eyebrow', [
                'ӘР ТҮРЛІ ҚАБІЛЕТ. ОРТАҚ МҮМКІНДІК.', 'РАЗНЫЕ СПОСОБНОСТИ. ОБЩИЕ ВОЗМОЖНОСТИ.', 'DIFFERENT ABILITIES. SHARED OPPORTUNITY.'
            ]
        ],
        [
            '.cards article:nth-child(1) h3', [
                'Өз қарқының', 'Свой темп', 'Your own pace'
            ]
        ],
        [
            '.cards article:nth-child(1) p', [
                'Таймер жоқ. Қайтала, үзіліс жаса. Прогресс осы браузерде сақталады.', 'Нет таймера. Повторяй, делай перерывы. Прогресс сохраняется в этом браузере.', 'No timer. Repeat and take breaks. Progress is saved in this browser.'
            ]
        ],
        [
            '.cards article:nth-child(2) h3', [
                'Ыңғайлы көрініс', 'Удобный вид', 'A comfortable view'
            ]
        ],
        [
            '.cards article:nth-child(2) p', [
                'Үлкен мәтін, жоғары контраст және пернетақтамен басқару.', 'Крупный текст, высокий контраст и управление клавиатурой.', 'Large text, high contrast and keyboard controls.'
            ]
        ],
        [
            '.cards article:nth-child(3) h3', [
                'Дыбыссыз түсінікті', 'Понятно без звука', 'Clear without sound'
            ]
        ],
        [
            '.cards article:nth-child(3) p', [
                'Үш тілдегі түсіндірме, жазбаша кері байланыс және VTT субтитрлері.', 'Объяснения на трёх языках, письменная обратная связь и субтитры VTT.', 'Explanations in three languages, written feedback and VTT captions.'
            ]
        ],
        [
            'footer > span', [
                'Айсана · 3-турға арналған жоба', 'Айсана · Проект для 3-го тура', 'Aisana · Round 3 project'
            ]
        ]
    ];
    function render() {
        for (const [selector, values] of translations) {
            const element = document.querySelector(selector);
            if (element)
                element.textContent = text(values);
        }
        const labels = [
            [
                '#videofile', [
                    'Видео таңдау', 'Выбрать видео', 'Choose video'
                ]
            ],
            [
                '#captions', [
                    'Субтитр қосу (.vtt)', 'Добавить субтитры (.vtt)', 'Add captions (.vtt)'
                ]
            ]
        ];
        for (const [selector, values] of labels) {
            const input = document.querySelector(selector);
            const label = input.parentElement;
            for (const node of [
                ...label.childNodes
            ]) {
                if (node.nodeType === Node.TEXT_NODE)
                    node.remove();
            }
            label.prepend(document.createTextNode(text(values)));
        }
        document.querySelector('.videogrid article > pre').textContent = 'print("Hello, world!")';
        document.querySelector('.videogrid details pre').textContent = 'print("My first code")';
        document.querySelector('.art').setAttribute('aria-label', text([
            'Код иллюстрациясы', 'Иллюстрация кода', 'Code illustration'
        ]));
        document.querySelector('#board')?.setAttribute('aria-label', text([
            'Ойын алаңы', 'Игровое поле', 'Game board'
        ]));
        document.querySelector('#player').setAttribute('aria-label', text([
            'Сабақ видеосы', 'Видео урока', 'Lesson video'
        ]));
        document.querySelector('nav').setAttribute('aria-label', text([
            'Негізгі мәзір', 'Главное меню', 'Main navigation'
        ]));
        document.querySelector('.codecard code').textContent = 'dream = "I can do this"\n\nfor step in range(3):\n    print(dream)';
        document.title = text([
            'TYMIO — IT бәріне қолжетімді', 'TYMIO — IT для каждого', 'TYMIO — IT for everyone'
        ]);
    }
    window.addEventListener('tymio-language', render);
    render();
})();
