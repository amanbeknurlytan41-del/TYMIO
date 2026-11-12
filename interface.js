(() => {
    const t = window.Tymio.text;
    const ui = [
        [
            'nav a[href="#learn"]', [
                'Python сабақтары', 'Уроки Python', 'Python lessons'
            ]
        ], [
            'nav a[href="#play"]', [
                'Код ойыны', 'Игра с кодом', 'Code game'
            ]
        ], [
            'nav a[href="#video"]', [
                'Видеосабақ', 'Видеоурок', 'Video lesson'
            ]
        ], [
            '#settings', [
                '◐ Қолжетімділік', '◐ Доступность', '◐ Accessibility'
            ]
        ], [
            '#panel strong', [
                'Өзіңе ыңғайла', 'Настрой под себя', 'Make it yours'
            ]
        ], [
            '#contrast', [
                'Жоғары контраст', 'Высокий контраст', 'High contrast'
            ]
        ], [
            '#font', [
                'Үлкен мәтін', 'Крупный текст', 'Large text'
            ]
        ], [
            '.hero .lead', [
                'Әркімнің өз жолы. Бәріне бір мүмкіндік. Программалау тілдерін таны, ойна және идеяңды кодқа айналдыр.', 'У каждого свой путь. Возможности — для всех. Знакомься с языками программирования, играй и воплощай идеи в коде.', 'Everyone has their own path. Opportunity for all. Explore programming languages, play and turn ideas into code.'
            ]
        ], [
            '.hero .actions .primary', [
                'Оқуды бастау ↗', 'Начать обучение ↗', 'Start learning ↗'
            ]
        ], [
            '.hero .actions a:last-child', [
                'Ойынды байқап көр →', 'Попробовать игру →', 'Try the game →'
            ]
        ], [
            '#play h2', [
                'Роботқа жол көрсет.', 'Покажи роботу путь.', 'Guide the robot.'
            ]
        ], [
            '#video h2', [
                'Саған ыңғайлы сабақ.', 'Урок в удобном формате.', 'Learn your way.'
            ]
        ], [
            '.support h2', [
                'Оқу саған бейімделеді.', 'Обучение подстраивается под тебя.', 'Learning adapts to you.'
            ]
        ], [
            'footer p', [
                'Код үйренуге әркімнің құқығы бар.', 'Каждый имеет право учиться программированию.', 'Everyone deserves to learn to code.'
            ]
        ]
    ];
    function render() {
        ui.forEach(([selector, values]) => {
            const node = document.querySelector(selector);
            if (node)
                node.textContent = t(values);
        });
        document.querySelector('.hero h1').innerHTML = t([
            'Сенің әлемің.<br>Сенің <em>кодың.</em>', 'Твой мир.<br>Твой <em>код.</em>', 'Your world.<br>Your <em>code.</em>'
        ]);
        document.querySelector('nav a[href="#learn"]').textContent = t([
            'Практикум', 'Практикум', 'Workshop'
        ]);
    }
    document.querySelector('.hero .actions .primary').href = '#courses';
    const link = document.createElement('a');
    link.href = '#courses';
    link.textContent = '8 IT';
    document.querySelector('header nav').prepend(link);
    window.addEventListener('tymio-language', render);
    render();
})();
