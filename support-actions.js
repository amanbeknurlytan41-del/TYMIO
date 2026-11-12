// Make the three previously informational cards actionable.
(() => {
    const t = window.Tymio.text;
    const cards = [
        ...document.querySelectorAll('.support .cards article')
    ];
    const dashboard = document.createElement('section');
    dashboard.id = 'study-dashboard';
    dashboard.hidden = true;
    dashboard.tabIndex = -1;
    dashboard.className = 'study-dashboard';
    dashboard.innerHTML = '<h3 id="dashboard-title"></h3><p id="dashboard-progress"></p><progress id="dashboard-bar" max="32" value="0"></progress><p id="dashboard-note"></p><button id="dashboard-continue"></button><button id="dashboard-close"></button>';
    document.querySelector('.support').append(dashboard);
    const labels = [
        [
            'Прогресті ашу', 'Открыть прогресс', 'Open progress'
        ], [
            'Көріністі баптау', 'Настроить вид', 'Adjust appearance'
        ], [
            'Видео мен мәтінді ашу', 'Открыть видео и текст', 'Open video and text'
        ]
    ];
    function focusSection(section) {
        section.scrollIntoView({
            behavior: 'auto', block: 'start'
        });
        section.focus({
            preventScroll: true
        });
    }
    const buttons = cards.map((card, index) => {
        const button = document.createElement('button');
        button.className = 'support-action';
        button.type = 'button';
        card.append(button);
        button.onclick = () => {
            if (index === 0) {
                dashboard.hidden = false;
                render();
                focusSection(dashboard);
            }
            if (index === 1) {
                const panel = document.getElementById('panel');
                panel.hidden = false;
                document.getElementById('settings').setAttribute('aria-expanded', 'true');
                panel.tabIndex = -1;
                focusSection(panel);
            }
            if (index === 2) {
                const video = document.getElementById('video');
                video.tabIndex = -1;
                focusSection(video);
                document.getElementById('video-topic').focus({
                    preventScroll: true
                });
            }
        };
        card.addEventListener('click', event => {
            if (event.target !== button && !event.target.closest('button'))
                button.click();
        });
        return button;
    });
    document.getElementById('dashboard-continue').onclick = () => {
        window.TymioAcademy.selectCourse(0);
    };
    document.getElementById('dashboard-close').onclick = () => {
        dashboard.hidden = true;
        buttons[0].focus();
    };
    function render() {
        buttons.forEach((button, index) => button.textContent = t(labels[index]));
        const totals = window.TymioAcademy.totals();
        document.getElementById('dashboard-title').textContent = t([
            'Сенің оқу жолың', 'Твой учебный путь', 'Your learning journey'
        ]);
        document.getElementById('dashboard-progress').textContent = t([
            `${totals.modules}/16 модуль · ${totals.tasks}/32 тапсырма`, `${totals.modules}/16 модулей · ${totals.tasks}/32 задания`, `${totals.modules}/16 modules · ${totals.tasks}/32 tasks`
        ]);
        document.getElementById('dashboard-bar').value = totals.tasks;
        document.getElementById('dashboard-bar').setAttribute('aria-label', t([
            'Оқу прогресі', 'Прогресс обучения', 'Learning progress'
        ]));
        document.getElementById('dashboard-note').textContent = t([
            'Прогресс осы браузерде сақталады. Таймер жоқ. Екі тапсырманы дұрыс шешкенде модуль аяқталады.', 'Прогресс сохраняется в этом браузере. Таймера нет. Для завершения модуля нужны два верных задания.', 'Progress is saved in this browser. There is no timer. Complete both tasks to finish a module.'
        ]);
        document.getElementById('dashboard-continue').textContent = t([
            'Python модуліне өту', 'Перейти к Python', 'Go to Python'
        ]);
        document.getElementById('dashboard-close').textContent = t([
            'Жабу', 'Закрыть', 'Close'
        ]);
    }
    window.addEventListener('tymio-language', render);
    window.addEventListener('tymio-progress', render);
    render();
})();
