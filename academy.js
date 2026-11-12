// Structured learning: 8 courses, 16 modules and 32 assessed tasks.
(() => {
    const t = window.Tymio.text;
    const courses = window.TymioCourses;
    const state = window.Tymio.read('tymio-academy-v2', {});
    let progress = state && typeof state === 'object' && !Array.isArray(state) ? state : {};
    let courseIndex = 0;
    let moduleIndex = 0;
    let feedback = '';
    let showHint = false;
    let showSolution = false;
    const selector = document.createElement('select');
    selector.id = 'language';
    selector.setAttribute('aria-label', 'Тіл / Язык / Language');
    [
        'Қазақша', 'Русский', 'English'
    ].forEach((name, index) => {
        const option = document.createElement('option');
        option.value = [
            'kk', 'ru', 'en'
        ][index];
        option.textContent = name;
        selector.append(option);
    });
    selector.value = window.Tymio.language;
    selector.onchange = () => window.Tymio.setLanguage(selector.value);
    document.querySelector('header').append(selector);
    const catalog = document.createElement('section');
    catalog.id = 'courses';
    catalog.innerHTML = '<div class="eyebrow" id="cataloglabel"></div><div class="sectionhead"><h2 id="catalogtitle"></h2><span id="catalogprogress"></span></div><label id="searchlabel" for="course-search"></label><input id="course-search" type="search"><div id="catalog" class="catalog"></div>';
    document.querySelector('#learn').before(catalog);
    const section = document.querySelector('#learn');
    section.innerHTML = `
      <div class="sectionhead"><div><div class="eyebrow" id="academy-path"></div><h2 id="academy-title"></h2></div><span id="progress"></span></div>
      <div class="learning"><nav id="module-list" aria-label="Modules"></nav>
      <article class="lesson" id="module-detail" tabindex="-1">
        <div class="eyebrow" id="module-level"></div><h3 id="module-title"></h3>
        <div id="module-theory"></div><h4 id="code-label"></h4><pre id="module-code"></pre>
        <p class="notice" id="exercise-note"></p>
        <fieldset class="assessment"><legend id="question-one"></legend><p id="concept-question"></p><div id="concept-options"></div></fieldset>
        <form id="trace-form" class="assessment"><label for="trace-answer" id="trace-label"></label><textarea id="trace-answer" rows="2" maxlength="200" required></textarea><button type="submit" id="trace-check"></button></form>
        <p id="academy-feedback" role="status"></p>
        <div class="actions"><button id="hint-button" type="button"></button><button id="solution-button" type="button"></button><button id="module-next" type="button"></button></div>
        <div id="module-hint" class="notice" hidden></div><div id="module-solution" class="notice" hidden></div>
      </article></div>`;
    const $ = id => document.getElementById(id);
    const current = () => courses[courseIndex].modules[moduleIndex];
    const key = () => `${courses[courseIndex].id}:${moduleIndex}`;
    function record() {
        const item = progress[key()];
        return item && typeof item === 'object' ? item : {};
    }
    function totals() {
        let tasks = 0, modules = 0;
        courses.forEach(course => course.modules.forEach((_, index) => {
            const item = progress[`${course.id}:${index}`] || {};
            tasks += Number(item.concept === true) + Number(item.trace === true);
            if (item.concept === true && item.trace === true)
                modules++;
        }));
        return {
            tasks, modules
        };
    }
    function mark(type) {
        progress[key()] = {
            ...record(), [type]: true
        };
        window.Tymio.save('tymio-academy-v2', progress);
        window.dispatchEvent(new CustomEvent('tymio-progress', {
            detail: totals()
        }));
        renderProgress();
        renderCatalog();
    }
    function renderProgress() {
        const count = totals();
        $('progress').textContent = `${count.tasks} / 32 ${t([
            'тапсырма', 'задания', 'tasks'
        ])}`;
        $('catalogprogress').textContent = `${count.modules} / 16 ${t([
            'модуль', 'модулей', 'modules'
        ])}`;
    }
    function rememberModule() {
        window.Tymio.save('tymio-last-module', { courseIndex, moduleIndex });
        window.dispatchEvent(new CustomEvent('tymio-module-open'));
    }
    function selectCourse(index, selectedModule = 0) {
        if (!Number.isInteger(index) || !courses[index]) return;
        courseIndex = index;
        moduleIndex = courses[index].modules[selectedModule] ? selectedModule : 0;
        rememberModule();
        resetView();
        render();
        $('module-detail').focus({
            preventScroll: true
        });
        section.scrollIntoView({
            block: 'start', behavior: 'auto'
        });
    }
    function resetView() {
        feedback = '';
        showHint = false;
        showSolution = false;
        $('trace-answer').value = '';
    }
    function renderCatalog() {
        $('catalog').replaceChildren();
        const query = $('course-search').value.toLowerCase().trim();
        courses.forEach((course, index) => {
            if (!course.name.toLowerCase().includes(query))
                return;
            const button = document.createElement('button');
            button.className = 'course-card';
            button.setAttribute('aria-pressed', String(index === courseIndex));
            const badge = document.createElement('span');
            badge.className = 'course-icon';
            badge.style.background = course.color;
            badge.textContent = course.badge;
            const name = document.createElement('strong');
            name.textContent = course.name;
            const description = document.createElement('small');
            description.textContent = t([
                '2 терең модуль · 4 тапсырма', '2 углублённых модуля · 4 задания', '2 in-depth modules · 4 tasks'
            ]);
            button.append(badge, name, description);
            button.onclick = () => selectCourse(index);
            $('catalog').append(button);
        });
        if (!$('catalog').children.length)
            $('catalog').textContent = t([
                'Курс табылмады', 'Курс не найден', 'No course found'
            ]);
    }
    function renderModule() {
        const course = courses[courseIndex], module = current();
        $('academy-path').textContent = course.name + ' / ' + t([
            'ТЕРЕҢ ОҚУ', 'УГЛУБЛЁННОЕ ОБУЧЕНИЕ', 'IN-DEPTH LEARNING'
        ]);
        $('academy-title').textContent = t([
            'Түсін. Талда. Дәлелде.', 'Пойми. Разбери. Обоснуй.', 'Understand. Trace. Explain.'
        ]);
        $('module-list').replaceChildren();
        course.modules.forEach((item, index) => {
            const button = document.createElement('button');
            button.textContent = `0${index + 1}  ${t(item.title)}`;
            button.setAttribute('aria-current', String(index === moduleIndex));
            button.onclick = () => {
                moduleIndex = index;
                rememberModule();
                resetView();
                renderModule();
            };
            $('module-list').append(button);
        });
        $('module-level').textContent = t([
            'ОРТА ДЕҢГЕЙ → КҮРДЕЛІ', 'СРЕДНИЙ УРОВЕНЬ → СЛОЖНЫЙ', 'INTERMEDIATE → ADVANCED'
        ]);
        $('module-title').textContent = t(module.title);
        $('module-theory').replaceChildren();
        t(module.theory).split('\n\n').forEach(text => {
            const p = document.createElement('p');
            p.textContent = text;
            $('module-theory').append(p);
        });
        $('code-label').textContent = t([
            'Қадамдап талдайтын код', 'Код для пошагового разбора', 'Code to trace step by step'
        ]);
        $('module-code').textContent = module.code;
        $('exercise-note').textContent = t([
            'Бұл — код нәтижесін болжау жаттығуы. Мұнда еркін код орындалмайды. Бір модуль екі тапсырма дұрыс болғанда аяқталады.', 'Это упражнение на прогноз результата, не запуск произвольного кода. Модуль завершён после двух верных заданий.', 'This is an output-prediction exercise, not an arbitrary code runner. Complete both tasks to finish the module.'
        ]);
        $('question-one').textContent = t([
            '1 / Себебін түсіндір', '1 / Объясни причину', '1 / Explain the reasoning'
        ]);
        $('concept-question').textContent = t(module.question);
        $('concept-options').replaceChildren();
        t(module.options).forEach((option, index) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = option;
            button.onclick = () => {
                if (index === module.correct) {
                    mark('concept');
                    feedback = 'concept-correct';
                }
                else
                    feedback = 'concept-wrong';
                renderFeedback();
            };
            $('concept-options').append(button);
        });
        $('trace-label').textContent = course.id === 'html'
            ? t([
                '2 / Кодтағы нысанның id мәнін жаз (ишараны қара)', '2 / Введи id цели в коде (см. подсказку)', '2 / Enter the target id (see the hint)'
            ])
            : t([
                '2 / Нәтижені өзің жаз (бірнеше мәнді бос орынмен бөл)', '2 / Самостоятельно введи результат (значения через пробел)', '2 / Enter the result yourself (separate values with spaces)'
            ]);
        if (course.id === 'css')
            $('trace-label').textContent = t([
                '2 / Есептелген енді немесе соңғы түсті жаз', '2 / Введи вычисленную ширину или итоговый цвет', '2 / Enter the computed width or final color'
            ]);
        $('trace-check').textContent = t([
            'Нәтижені тексер', 'Проверить результат', 'Check result'
        ]);
        $('hint-button').textContent = t([
            'Ишара', 'Подсказка', 'Hint'
        ]);
        $('solution-button').textContent = t([
            'Талдауды ашу', 'Открыть разбор', 'Show explanation'
        ]);
        $('module-next').textContent = t([
            'Келесі модуль →', 'Следующий модуль →', 'Next module →'
        ]);
        $('module-hint').hidden = !showHint;
        $('module-hint').textContent = t(module.hint);
        $('module-solution').hidden = !showSolution;
        $('module-solution').textContent = module.output + '\n\n' + t(module.reason);
        renderFeedback();
        renderProgress();
    }
    function renderFeedback() {
        const messages = {
            'concept-correct': [
                '✓ Себебі дұрыс. Енді нәтижені өзің есепте.', '✓ Верно. Теперь вычисли результат сам.', '✓ Correct reasoning. Now compute the result yourself.'
            ],
            'concept-wrong': [
                'Әзірге дұрыс емес. Теориядағы механизмді қайта оқы.', 'Пока неверно. Перечитай объяснение механизма.', 'Not yet correct. Review the mechanism in the explanation.'
            ],
            'trace-correct': [
                '✓ Нәтиже дұрыс! ', '✓ Результат верный! ', '✓ Correct result! '
            ],
            'trace-wrong': [
                'Нәтиже сәйкес емес. Әр қадамдағы мәнді жазып көр.', 'Результат не совпадает. Запиши значения на каждом шаге.', 'The result does not match. Trace the value at every step.'
            ]
        };
        $('academy-feedback').textContent = feedback ? t(messages[feedback]) + (feedback === 'trace-correct' ? t(current().reason) : '') : '';
        if (record().concept && record().trace)
            $('academy-feedback').textContent += ' ' + t([
                '✓ Модуль аяқталды.', '✓ Модуль завершён.', '✓ Module completed.'
            ]);
    }
    $('trace-form').onsubmit = event => {
        event.preventDefault();
        const normalize = value => value.trim().replace(/\s+/g, ' ').replace(/\s*;\s*/g, ';').toLowerCase();
        if (normalize($('trace-answer').value) === normalize(current().output)) {
            mark('trace');
            feedback = 'trace-correct';
        }
        else
            feedback = 'trace-wrong';
        renderFeedback();
    };
    $('hint-button').onclick = () => {
        showHint = !showHint;
        $('module-hint').hidden = !showHint;
        $('module-hint').textContent = t(current().hint);
    };
    $('solution-button').onclick = () => {
        showSolution = !showSolution;
        $('module-solution').hidden = !showSolution;
        $('module-solution').textContent = current().output + '\n\n' + t(current().reason);
    };
    $('module-next').onclick = () => {
        moduleIndex++;
        if (moduleIndex >= courses[courseIndex].modules.length) {
            moduleIndex = 0;
            courseIndex = (courseIndex + 1) % courses.length;
        }
        rememberModule();
        resetView();
        render();
    };
    $('course-search').oninput = renderCatalog;
    function render() {
        $('cataloglabel').textContent = t([
            '8 БАҒЫТ · 16 МОДУЛЬ · 32 ТАПСЫРМА', '8 НАПРАВЛЕНИЙ · 16 МОДУЛЕЙ · 32 ЗАДАНИЯ', '8 PATHS · 16 MODULES · 32 TASKS'
        ]);
        $('catalogtitle').textContent = t([
            'Жай бастама емес. Нақты түсінік.', 'Больше, чем начало. Настоящее понимание.', 'Beyond the basics. Real understanding.'
        ]);
        $('searchlabel').textContent = t([
            'Бағыт іздеу', 'Поиск направления', 'Find a course'
        ]);
        $('course-search').placeholder = 'Python, JavaScript, SQL…';
        renderCatalog();
        renderModule();
    }
    window.TymioAcademy = {
        totals, selectCourse, openModule: selectCourse
    };
    window.addEventListener('tymio-language', render);
    render();
})();
