// TYMIO Orbit: a local learning dashboard and accessible CSS 3D experience.
(() => {
    const t = window.Tymio.text;
    const $ = id => document.getElementById(id);
    const courses = window.TymioCourses;
    const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const savedMode = window.Tymio.read('tymio-visual-mode', null);
    let flat = savedMode === 'flat' || (savedMode === null && Boolean(motionQuery?.matches));
    let angle = -24;
    let currentNote = 'general';
    const storedNotes = window.Tymio.read('tymio-notes', {});
    let notes = storedNotes && typeof storedNotes === 'object' && !Array.isArray(storedNotes) ? storedNotes : {};
    let dailyCorrect = false;
    let dailyFeedback = null;
    const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Qyzylorda', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
    const dayNumber = Math.floor(Date.parse(day + 'T00:00:00Z') / 86400000);
    const dailyPool = [courses[0].modules[0], courses[0].modules[1], courses[1].modules[0], courses[4].modules[0], courses[6].modules[0]];
    const daily = dailyPool[dayNumber % dailyPool.length];
    const dailyStored = window.Tymio.read('tymio-daily', []);
    const solvedDays = new Set(Array.isArray(dailyStored) ? dailyStored.filter(value => /^\d{4}-\d{2}-\d{2}$/.test(value)) : []);
    dailyCorrect = solvedDays.has(day);

    document.body.classList.add('orbit-theme');
    document.querySelector('header .logo').innerHTML = '<span class="brand-mark" aria-hidden="true">◈</span>TYMIO<span class="brand-sub">ORBIT</span>';
    document.querySelector('.hero').id = 'home';
    document.querySelector('.hero .art').innerHTML = `
        <div class="scene-star star-one" aria-hidden="true"></div>
        <div class="scene-star star-two" aria-hidden="true"></div>
        <div class="orbit-stage" aria-hidden="true">
            <div class="scene-floor"></div><div class="scene-ring ring-one"></div><div class="scene-ring ring-two"></div>
            <div class="orbit-cube" id="orbit-cube">
                <div class="cube-face front">{ }</div><div class="cube-face back">01</div>
                <div class="cube-face right">JS</div><div class="cube-face left">PY</div>
                <div class="cube-face top">✦</div><div class="cube-face bottom">∞</div>
            </div>
            <div class="floating-chip chip-python">PY <span>Python</span></div>
            <div class="floating-chip chip-sql">SQL <span>Data</span></div>
            <div class="floating-chip chip-web">&lt;/&gt; <span>Web</span></div>
        </div>
        <div class="scene-caption"><span class="live-dot"></span><span id="scene-caption"></span><span class="scene-coordinate">X: 08 / Y: 16</span></div>
        <div class="codecard"><div class="dots">● ● ● <span>your_next_step.py</span></div><code></code></div>
        <div class="scene-controls"><button id="rotate-left" type="button">↶</button><label for="scene-angle" id="scene-angle-label"></label><input id="scene-angle" type="range" min="-180" max="180" value="-24"><button id="rotate-right" type="button">↷</button></div>`;
    const settingsButton = document.createElement('button');
    settingsButton.id = 'visual-mode';
    settingsButton.type = 'button';
    document.querySelector('#panel').append(settingsButton);

    const hub = document.createElement('section');
    hub.id = 'orbit-hub';
    hub.innerHTML = `
      <div class="sectionhead"><div><div class="eyebrow" id="hub-label"></div><h2 id="hub-title"></h2></div><span class="local-badge" id="local-badge"></span></div>
      <div class="hub-grid">
        <article class="hub-card continue-card"><div class="hub-card-top"><span class="panel-number">01 / MISSION</span><span class="mini-orbit" aria-hidden="true">◉</span></div><h3 id="resume-title"></h3><p id="resume-description"></p><button id="resume-course" class="primary" type="button"></button></article>
        <article class="hub-card progress-card"><span class="panel-number">02 / PROGRESS</span><div class="progress-display"><div class="progress-orbit" id="progress-orbit"><strong id="orbit-percent"></strong></div><div><strong id="orbit-xp"></strong><p id="orbit-summary"></p></div></div><progress id="orbit-progress" max="32" value="0"></progress><span id="progress-footnote"></span></article>
        <article class="hub-card trophy-card"><span class="panel-number">03 / ACHIEVEMENTS</span><h3 id="achievements-title"></h3><div id="achievement-list"></div></article>
      </div>
      <div class="map-heading"><h3 id="map-title"></h3><p id="map-description"></p></div><div class="world-map" id="world-map"></div>
    `;
    document.querySelector('#courses').before(hub);

    const practice = document.createElement('section');
    practice.id = 'personal-space';
    practice.innerHTML = `
      <div class="sectionhead"><div><div class="eyebrow" id="space-label"></div><h2 id="space-title"></h2></div></div>
      <div class="personal-grid">
        <article class="hub-card daily-card"><div class="hub-card-top"><span class="panel-number" id="daily-label"></span><span id="daily-date"></span></div><h3 id="daily-title"></h3><p id="daily-instruction"></p><pre id="daily-code"></pre><form id="daily-form"><label for="daily-answer" id="daily-answer-label"></label><div class="daily-input-row"><input id="daily-answer" maxlength="200" required autocomplete="off"><button type="submit" id="daily-submit" class="primary"></button></div></form><p id="daily-status" role="status"></p><details><summary id="daily-hint-label"></summary><p id="daily-hint"></p></details></article>
        <article class="hub-card notes-card"><span class="panel-number">PERSONAL / NOTES</span><h3 id="notes-title"></h3><p id="notes-description"></p><label for="note-topic" id="note-topic-label"></label><select id="note-topic"></select><label for="learning-note" id="note-label"></label><textarea id="learning-note" maxlength="8000" rows="9"></textarea><div class="note-bottom"><span id="note-status" role="status"></span><button id="note-export" type="button"></button></div></article>
      </div>
    `;
    document.querySelector('#video').after(practice);

    const quickNav = document.createElement('nav');
    quickNav.className = 'orbit-dock';
    quickNav.innerHTML = '<a href="#home" data-label="home">⌂</a><a href="#orbit-hub" data-label="hub">◈</a><a href="#courses" data-label="courses">&lt;/&gt;</a><a href="#play" data-label="play">◉</a><a href="#video" data-label="video">▷</a><a href="#personal-space" data-label="notes">≡</a>';
    document.body.append(quickNav);
    const hubLink = document.createElement('a');
    hubLink.href = '#orbit-hub';hubLink.id = 'hub-nav-link';
    document.querySelector('header nav').prepend(hubLink);

    function applyMode() {
        document.body.classList.toggle('flat-mode', flat);
        settingsButton.setAttribute('aria-pressed', String(flat));
        settingsButton.textContent = t(flat ? ['3D көріністі қосу', 'Включить 3D', 'Enable 3D'] : ['Қозғалыссыз 2D режим', 'Режим 2D без движения', 'Motion-free 2D mode']);
        $('scene-angle').disabled = flat;
        $('rotate-left').disabled = flat;
        $('rotate-right').disabled = flat;
    }
    settingsButton.onclick = () => {
        flat = !flat;
        window.Tymio.save('tymio-visual-mode', flat ? 'flat' : '3d');
        applyMode();
    };
    function rotate(value) {
        angle = Math.max(-180, Math.min(180, Number(value)));
        $('scene-angle').value = angle;
        $('orbit-cube').style.setProperty('--cube-angle', angle + 'deg');
    }
    $('scene-angle').oninput = event => rotate(event.target.value);
    $('rotate-left').onclick = () => rotate(angle - 30);
    $('rotate-right').onclick = () => rotate(angle + 30);
    motionQuery?.addEventListener?.('change', event => {
        if (event.matches) { flat = true; applyMode(); }
    });
    const games = () => {
        const values = window.Tymio.read('tymio-quest-v2', []);
        return new Set(Array.isArray(values) ? values.filter(value => Number.isInteger(value) && value >= 1 && value <= 8) : []).size;
    };
    function courseDone(course) {
        const progress = window.Tymio.read('tymio-academy-v2', {}) || {};
        return course.modules.filter((_, index) => progress[course.id + ':' + index]?.concept === true && progress[course.id + ':' + index]?.trace === true).length;
    }
    function nextLocation() {
        const last = window.Tymio.read('tymio-last-module', null);
        if (last && Number.isInteger(last.courseIndex) && courses[last.courseIndex]?.modules[last.moduleIndex]) return last;
        for (let index = 0; index < courses.length; index++) {
            if (courseDone(courses[index]) < courses[index].modules.length) return { courseIndex: index, moduleIndex: 0 };
        }
        return { courseIndex: 0, moduleIndex: 0 };
    }
    $('resume-course').onclick = () => {
        const last = nextLocation();
        window.TymioAcademy.openModule(last.courseIndex, last.moduleIndex);
    };
    function renderStats() {
        const totals = window.TymioAcademy.totals();
        const gameCount = games();
        const percent = Math.round(totals.tasks / 32 * 100);
        $('orbit-percent').textContent = percent + '%';
        $('progress-orbit').style.setProperty('--progress-deg', percent * 3.6 + 'deg');
        $('orbit-xp').textContent = `${totals.tasks * 40 + gameCount * 80 + solvedDays.size * 25} XP`;
        $('orbit-summary').textContent = t([`${totals.modules}/16 модуль · ${gameCount}/8 карта`, `${totals.modules}/16 модулей · ${gameCount}/8 карт`, `${totals.modules}/16 modules · ${gameCount}/8 maps`]);
        $('orbit-progress').value = totals.tasks;
        $('orbit-progress').setAttribute('aria-label', t(['Оқу прогресі', 'Прогресс обучения', 'Learning progress']));
        $('progress-footnote').textContent = t(['XP тек орындалған тапсырмалардан есептеледі.', 'XP начисляется только за выполненные задания.', 'XP is calculated from completed tasks only.']);
        const last = nextLocation();
        $('resume-title').textContent = courses[last.courseIndex].name;
        $('resume-description').textContent = t(courses[last.courseIndex].modules[last.moduleIndex].title);
        $('achievement-list').replaceChildren();
        const achievements = [
            { symbol: '✦', earned: totals.modules >= 1, label: ['Алғашқы модуль', 'Первый модуль', 'First module'] },
            { symbol: '◈', earned: totals.modules >= 8, label: ['8 модуль', '8 модулей', '8 modules'] },
            { symbol: '⌘', earned: gameCount >= 1, label: ['Алгоритм шебері', 'Первый алгоритм', 'First algorithm'] },
            { symbol: '◎', earned: solvedDays.size >= 1, label: ['Күнделікті қадам', 'Ежедневный шаг', 'Daily step'] }
        ];
        achievements.forEach(item => {
            const badge = document.createElement('div');
            badge.className = 'achievement' + (item.earned ? ' earned' : ' locked');
            const icon = document.createElement('span');icon.textContent = item.symbol;
            const label = document.createElement('span');label.textContent = t(item.label);
            badge.append(icon, label);
            badge.title = t(item.earned ? ['Алынды', 'Получено', 'Earned'] : ['Әлі алынбаған', 'Ещё не получено', 'Not yet earned']);
            badge.setAttribute('aria-label', label.textContent + ': ' + badge.title);
            $('achievement-list').append(badge);
        });
        $('world-map').replaceChildren();
        courses.forEach((course, index) => {
            const tile = document.createElement('button');
            tile.type = 'button';tile.className = 'world-tile';tile.style.setProperty('--world-color', course.color);
            const island = document.createElement('span');island.className = 'island';island.setAttribute('aria-hidden', 'true');
            const symbol = document.createElement('span');symbol.className = 'island-symbol';symbol.textContent = course.badge;island.append(symbol);
            const label = document.createElement('strong');label.textContent = course.name;
            const count = document.createElement('small');count.textContent = `${courseDone(course)}/2 ` + t(['модуль', 'модуля', 'modules']);
            tile.append(island, label, count);
            tile.onclick = () => window.TymioAcademy.selectCourse(index);
            $('world-map').append(tile);
        });
    }
    function noteStatus(saved = false) {
        $('note-status').textContent = saved ? t(['Осы браузерде сақталды', 'Сохранено в этом браузере', 'Saved in this browser']) : `${$('learning-note').value.length} / 8000`;
    }
    function saveNote() {
        notes[currentNote] = $('learning-note').value;
        try {
            localStorage.setItem('tymio-notes', JSON.stringify(notes));
            noteStatus(true);
        } catch {
            $('note-status').textContent = t(['Сақтау мүмкін болмады. Файлға жүктеп ал.', 'Не удалось сохранить. Скачай файл.', 'Could not save. Download a copy.']);
        }
    }
    $('learning-note').oninput = saveNote;
    $('note-topic').onchange = () => {
        currentNote = $('note-topic').value;
        $('learning-note').value = typeof notes[currentNote] === 'string' ? notes[currentNote] : '';
        noteStatus();
    };
    $('note-export').onclick = () => {
        const content = Object.entries(notes).filter(([, value]) => typeof value === 'string' && value.trim()).map(([topic, value]) => `## ${topic}\n\n${value}`).join('\n\n');
        const blob = new Blob([`TYMIO / ${day}\n\n${content}`], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob), link = document.createElement('a');
        link.href = url;link.download = 'tymio-notes-' + day + '.txt';document.body.append(link);link.click();link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    };
    $('daily-form').onsubmit = event => {
        event.preventDefault();
        const normalize = value => value.trim().replace(/\s+/g, ' ').toLowerCase();
        dailyFeedback = normalize($('daily-answer').value) === normalize(daily.output);
        if (dailyFeedback) { solvedDays.add(day); dailyCorrect = true; window.Tymio.save('tymio-daily', [...solvedDays]); }
        renderDaily();renderStats();
    };
    function renderDaily() {
        $('daily-label').textContent = t(['КҮН ТАПСЫРМАСЫ / +25 XP', 'ЗАДАНИЕ ДНЯ / +25 XP', 'DAILY CHALLENGE / +25 XP']);
        $('daily-date').textContent = day;
        $('daily-title').textContent = t(daily.title);
        $('daily-instruction').textContent = t(['Кодты орындамай, соңғы нәтижесін есепте. Дұрыс жауап күніне бір рет XP береді.', 'Вычисли результат без запуска кода. Верный ответ даёт XP один раз в день.', 'Predict the result without running the code. A correct answer earns XP once per day.']);
        $('daily-code').textContent = daily.code;
        $('daily-answer-label').textContent = t(['Сенің жауабың', 'Твой ответ', 'Your answer']);
        $('daily-submit').textContent = t(['Тексеру', 'Проверить', 'Check']);
        $('daily-hint-label').textContent = t(['Ишараны ашу', 'Показать подсказку', 'Show hint']);
        $('daily-hint').textContent = t(daily.hint);
        $('daily-status').textContent = dailyFeedback === false ? t(['Әлі дұрыс емес. Мәндерді қадамдап бақыла.', 'Пока неверно. Проследи значения по шагам.', 'Not quite. Trace the values step by step.']) : dailyCorrect ? t(['✓ Бүгінгі тапсырма орындалды. +25 XP есептелді.', '✓ Задание дня выполнено. +25 XP учтено.', '✓ Today’s challenge is complete. +25 XP counted.']) : '';
    }
    function render() {
        document.querySelector('.hero .eyebrow').textContent = t(['TYMIO ORBIT / МҮМКІНДІКТЕР КЕҢІСТІГІ', 'TYMIO ORBIT / ПРОСТРАНСТВО ВОЗМОЖНОСТЕЙ', 'TYMIO ORBIT / A SPACE OF POSSIBILITIES']);
        document.querySelector('.hero h1').innerHTML = t(['Болашағыңды<br><em>өзің құрастыр.</em>', 'Создай своё<br><em>будущее.</em>', 'Build your<br><em>own future.</em>']);
        document.querySelector('.hero .lead').textContent = t(['Кодты түсін. Идеяңды іске асыр. Өз қарқыныңмен оқуға арналған 3D кеңістік — әркімге ашық.', 'Понимай код. Воплощай идеи. Твоё 3D-пространство для обучения в своём темпе — открыто каждому.', 'Understand code. Bring ideas to life. A 3D learning space at your own pace — open to everyone.']);
        document.querySelector('.hero .actions .primary').textContent = t(['Оқу әлеміне кіру ↗', 'Войти в мир обучения ↗', 'Enter your learning world ↗']);
        document.querySelector('.hero .actions .primary').href = '#orbit-hub';
        document.querySelector('.codecard code').textContent = 'future = you.build()\n\nwhile curious:\n    learn()\n    create()';
        $('scene-caption').textContent = t(['Сенің келесі қадамың', 'Твой следующий шаг', 'Your next step']);
        $('scene-angle-label').textContent = t(['3D бұрышы', 'Поворот 3D', '3D rotation']);
        $('rotate-left').setAttribute('aria-label', t(['Солға бұру', 'Повернуть влево', 'Rotate left']));
        $('rotate-right').setAttribute('aria-label', t(['Оңға бұру', 'Повернуть вправо', 'Rotate right']));
        $('hub-label').textContent = t(['ЖЕКЕ ОҚУ ОРТАЛЫҒЫ', 'ЛИЧНЫЙ УЧЕБНЫЙ ЦЕНТР', 'YOUR LEARNING CONTROL ROOM']);
        $('hub-title').textContent = t(['Бүгін не жасаймыз?', 'Что создадим сегодня?', 'What will you create today?']);
        $('local-badge').textContent = t(['◉ Осы құрылғыдағы прогресс', '◉ Прогресс на этом устройстве', '◉ Progress on this device']);
        $('hub-nav-link').textContent = t(['Менің орбитам', 'Моя орбита', 'My orbit']);
        $('resume-course').textContent = t(['Оқуды жалғастыру →', 'Продолжить обучение →', 'Continue learning →']);
        $('achievements-title').textContent = t(['Шағын жеңістер.', 'Маленькие победы.', 'Small wins.']);
        $('map-title').textContent = t(['Бағытыңды таңда.', 'Выбери направление.', 'Choose your direction.']);
        $('map-description').textContent = t(['Әр арал — жаңа дағды. Ашып, екі модульді зертте.', 'Каждый остров — новый навык. Открой и изучи два модуля.', 'Each island is a new skill. Open it and explore two modules.']);
        $('space-label').textContent = t(['КҮНДЕЛІКТІ ТӘЖІРИБЕ / ЖЕКЕ КЕҢІСТІК', 'ЕЖЕДНЕВНАЯ ПРАКТИКА / ЛИЧНОЕ ПРОСТРАНСТВО', 'DAILY PRACTICE / PERSONAL SPACE']);
        $('space-title').textContent = t(['Үйренгеніңді бекіт.', 'Закрепляй знания.', 'Make your learning stick.']);
        $('notes-title').textContent = t(['Сенің идея дәптерің.', 'Твой блокнот идей.', 'Your idea notebook.']);
        $('notes-description').textContent = t(['Түсінгеніңді өз сөзіңмен жаз. Жазбалар автоматты түрде осы браузерде сақталады.', 'Записывай понимание своими словами. Заметки автоматически сохраняются в этом браузере.', 'Explain what you learned in your own words. Notes save automatically in this browser.']);
        $('note-topic-label').textContent = t(['Тақырып', 'Тема', 'Topic']);
        $('note-label').textContent = t(['Жазбаң', 'Твоя заметка', 'Your note']);
        $('note-topic').replaceChildren();
        [['general', t(['Жалпы идеялар', 'Общие идеи', 'General ideas'])], ...courses.map(course => [course.id, course.name])].forEach(([value, label]) => {
            const option = document.createElement('option');option.value = value;option.textContent = label;$('note-topic').append(option);
        });
        $('note-topic').value = currentNote;
        $('learning-note').placeholder = t(['Бүгін мен түсіндім…\nКелесіде байқап көремін…', 'Сегодня я понял(а)…\nВ следующий раз попробую…', 'Today I understood…\nNext I will try…']);
        $('note-export').textContent = t(['Жазбаларды жүктеу ↓', 'Скачать заметки ↓', 'Download notes ↓']);
        const dockLabels = {home:['Басты бет','Главная','Home'],hub:['Менің орбитам','Моя орбита','My orbit'],courses:['Курстар','Курсы','Courses'],play:['Ойын','Игра','Game'],video:['Видео','Видео','Video'],notes:['Дәптер','Блокнот','Notebook']};
        quickNav.setAttribute('aria-label', t(['Жылдам өту', 'Быстрый переход', 'Quick navigation']));
        quickNav.querySelectorAll('a').forEach(link => {link.title=t(dockLabels[link.dataset.label]);link.setAttribute('aria-label',link.title)});
        applyMode();renderStats();renderDaily();noteStatus();
    }
    $('learning-note').value = typeof notes[currentNote] === 'string' ? notes[currentNote] : '';
    window.addEventListener('tymio-language', render);
    window.addEventListener('tymio-progress', renderStats);
    window.addEventListener('tymio-module-open', renderStats);
    $('quest-run').addEventListener('click', renderStats);
    $('quest-step').addEventListener('click', renderStats);
    render();rotate(angle);
})();
