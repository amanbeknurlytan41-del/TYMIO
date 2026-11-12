// A bounded command language: movement, repetition, keys and collectible goals.
(() => {
    const t = window.Tymio.text, levels = window.TymioQuestLevels;
    let levelIndex = 0, program = [], state, message = '', stepIndex = 0;
    const raw = window.Tymio.read('tymio-quest-v2', []);
    const completed = new Set(Array.isArray(raw) ? raw.filter(id => levels.some(level => level.id === id)) : []);
    const root = document.getElementById('play');
    root.innerHTML = `<div><div class="eyebrow">CODE QUEST / 2.0</div><h2 id="quest-title"></h2><p id="quest-intro"></p>
      <label for="quest-level" id="quest-level-label"></label><select id="quest-level"></select>
      <p id="quest-rules" class="notice"></p><div class="controls"><button data-command="U">↑</button><button data-command="L">←</button><button data-command="D">↓</button><button data-command="R">→</button></div>
      <form id="repeat-form"><label for="repeat-pattern" id="repeat-label"></label><input id="repeat-pattern" value="R R U U" maxlength="15" autocomplete="off" spellcheck="false"><label for="repeat-count" id="repeat-count-label"></label><select id="repeat-count">${[
        1, 2, 3, 4, 5, 6
    ].map(n => `<option>${n}</option>`).join('')}</select><button id="repeat-add" type="submit"></button></form>
      <ol id="quest-program"></ol><p id="quest-meter"></p><div class="actions"><button id="quest-run" class="primary"></button><button id="quest-step"></button><button id="quest-undo"></button><button id="quest-reset"></button></div><p id="quest-status" role="status"></p></div>
      <div><div id="quest-board"></div><p id="quest-legend"></p><p id="quest-progress"></p></div>`;
    const $ = id => document.getElementById(id);
    const arrows = {
        U: '↑', D: '↓', L: '←', R: '→'
    };
    const current = () => levels[levelIndex];
    function initial(level) {
        return {
            position: level.start, key: false, gems: new Set(), steps: 0, error: '', won: false
        };
    }
    function advance(level, before, move) {
        const next = {
            ...before, gems: new Set(before.gems)
        };
        if (next.error || next.won)
            return next;
        if (next.steps >= level.energy) {
            next.error = 'energy';
            return next;
        }
        const row = Math.floor(next.position / level.size) + (move === 'U' ? -1 : move === 'D' ? 1 : 0);
        const column = next.position % level.size + (move === 'L' ? -1 : move === 'R' ? 1 : 0);
        const target = row * level.size + column;
        next.steps++;
        if (row < 0 || row >= level.size || column < 0 || column >= level.size || level.walls.includes(target)) {
            next.error = 'wall';
            return next;
        }
        if (target === level.door && !next.key) {
            next.error = 'door';
            return next;
        }
        next.position = target;
        if (target === level.key)
            next.key = true;
        if (level.gems.includes(target))
            next.gems.add(target);
        next.won = target === level.target && next.key && next.gems.size === level.gems.length;
        return next;
    }
    function expanded() {
        return program.flatMap(block => Array.from({
            length: block.repeat
        }, () => block.moves).flat());
    }
    function resetExecution() {
        state = initial(current());
        stepIndex = 0;
        message = '';
    }
    function add(moves, repeat) {
        if (program.length >= current().budget) {
            message = 'budget';
            renderBoard();
            return;
        }
        const length = expanded().length + moves.length * repeat;
        if (length > current().energy) {
            message = 'too-long';
            renderBoard();
            return;
        }
        program.push({
            moves, repeat
        });
        resetExecution();
        render();
    }
    root.querySelectorAll('[data-command]').forEach(button => button.onclick = () => add([
        button.dataset.command
    ], 1));
    $('repeat-form').onsubmit = event => {
        event.preventDefault();
        const moves = $('repeat-pattern').value.toUpperCase().trim().split(/[\s,]+/).filter(Boolean);
        if (!moves.length || moves.length > 4 || moves.some(move => ![
            'U', 'D', 'L', 'R'
        ].includes(move))) {
            message = 'syntax';
            renderBoard();
            return;
        }
        add(moves, Number($('repeat-count').value));
    };
    function finish() {
        if (state.won) {
            completed.add(current().id);
            window.Tymio.save('tymio-quest-v2', [
                ...completed
            ]);
            message = 'won';
        }
        else if (state.error)
            message = state.error;
        else if (stepIndex >= expanded().length)
            message = 'unfinished';
        renderBoard();
    }
    $('quest-run').onclick = () => {
        resetExecution();
        const moves = expanded();
        if (!moves.length) {
            message = 'empty';
            renderBoard();
            return;
        }
        for (const move of moves) {
            state = advance(current(), state, move);
            stepIndex++;
            if (state.error || state.won)
                break;
        }
        finish();
    };
    $('quest-step').onclick = () => {
        const moves = expanded();
        if (!moves.length) {
            message = 'empty';
            renderBoard();
            return;
        }
        if (state.error || state.won || stepIndex >= moves.length)
            resetExecution();
        state = advance(current(), state, moves[stepIndex++]);
        finish();
    };
    $('quest-undo').onclick = () => {
        program.pop();
        resetExecution();
        render();
    };
    $('quest-reset').onclick = () => {
        program = [];
        resetExecution();
        render();
    };
    $('quest-level').onchange = () => {
        levelIndex = Number($('quest-level').value);
        program = [];
        resetExecution();
        render();
    };
    function renderBoard() {
        const level = current();
        $('quest-board').replaceChildren();
        $('quest-board').style.gridTemplateColumns = `repeat(${level.size},1fr)`;
        for (let pos = 0; pos < level.size * level.size; pos++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            let label;
            if (pos === state.position) {
                cell.textContent = '🤖';
                label = t([
                    'Робот', 'Робот', 'Robot'
                ]);
            }
            else if (level.walls.includes(pos)) {
                cell.textContent = '▧';
                cell.classList.add('wall');
                label = t([
                    'Қабырға', 'Стена', 'Wall'
                ]);
            }
            else if (pos === level.target) {
                cell.textContent = '★';
                cell.classList.add('goal');
                label = t([
                    'Мақсат', 'Цель', 'Goal'
                ]);
            }
            else if (pos === level.key && !state.key) {
                cell.textContent = '⚿';
                label = t([
                    'Кілт', 'Ключ', 'Key'
                ]);
            }
            else if (pos === level.door) {
                cell.textContent = state.key ? '□' : '▣';
                label = t([
                    'Есік', 'Дверь', 'Door'
                ]);
            }
            else if (level.gems.includes(pos) && !state.gems.has(pos)) {
                cell.textContent = '◆';
                cell.classList.add('gem');
                label = t([
                    'Кристалл', 'Кристалл', 'Crystal'
                ]);
            }
            else {
                cell.textContent = '·';
                label = t([
                    'Бос', 'Пусто', 'Empty'
                ]);
            }
            cell.setAttribute('aria-label', `${Math.floor(pos / level.size) + 1},${pos % level.size + 1}: ${label}`);
            $('quest-board').append(cell);
        }
        $('quest-meter').textContent = t([
            `Блоктар: ${program.length}/${level.budget} · Қадамдар: ${expanded().length}/${level.energy} · Орындалды: ${state.steps}`, `Блоки: ${program.length}/${level.budget} · Шаги: ${expanded().length}/${level.energy} · Выполнено: ${state.steps}`, `Blocks: ${program.length}/${level.budget} · Steps: ${expanded().length}/${level.energy} · Executed: ${state.steps}`
        ]);
        const messages = {
            budget: [
                'Блок шегіне жеттің. Қайталанатын бағыттарды repeat блогына біріктір.', 'Лимит блоков. Объедини повторяющиеся направления в repeat.', 'Block limit reached. Combine repeated directions into a repeat block.'
            ],
            'too-long': [
                'Қадам саны энергия шегінен асады. Маршрутты қысқарт.', 'Шагов больше запаса энергии. Сократи маршрут.', 'The route exceeds available energy. Shorten it.'
            ],
            syntax: [
                '1–4 бағыт жаз: U, D, L, R. Мысалы: R R U U.', 'Введи 1–4 направления U, D, L, R. Пример: R R U U.', 'Enter 1–4 directions U, D, L, R. Example: R R U U.'
            ],
            wall: [
                'Қабырғаға соғылдың. Қадамдап орындап, қатені тап.', 'Столкновение со стеной. Пройди по шагам и найди ошибку.', 'You hit a wall. Step through the route to find the error.'
            ],
            door: [
                'Есік жабық. Алдымен кілтті ал.', 'Дверь закрыта. Сначала забери ключ.', 'The door is locked. Collect the key first.'
            ],
            energy: [
                'Энергия бітті. Қысқа маршрут қажет.', 'Энергия закончилась. Нужен более короткий маршрут.', 'Out of energy. Find a shorter route.'
            ],
            empty: [
                'Алдымен бағдарлама құрастыр.', 'Сначала составь программу.', 'Build a program first.'
            ],
            unfinished: [
                'Барлық кристалл мен кілтті жинап, жұлдызға жет.', 'Собери все кристаллы и ключ, затем дойди до звезды.', 'Collect every crystal and the key, then reach the star.'
            ],
            won: [
                '🏆 Деңгей өтті! Келесі деңгейге тізімнен өт.', '🏆 Уровень пройден! Выбери следующий в списке.', '🏆 Level completed! Choose the next level from the list.'
            ]
        };
        $('quest-status').textContent = message ? t(messages[message]) : '';
        $('quest-progress').textContent = t([
            `Аяқталды: ${completed.size}/8 · Кристалл: ${state.gems.size}/${level.gems.length}`, `Пройдено: ${completed.size}/8 · Кристаллы: ${state.gems.size}/${level.gems.length}`, `Completed: ${completed.size}/8 · Crystals: ${state.gems.size}/${level.gems.length}`
        ]);
    }
    function render() {
        $('quest-title').textContent = t([
            'Енді нағыз алгоритм құрастыр.', 'Теперь создай настоящий алгоритм.', 'Now build a real algorithm.'
        ]);
        $('quest-intro').textContent = t([
            '8 күрделі карта. Кілтті ал, барлық кристалды жина, есіктен өтіп, жұлдызға жет. Блок пен қадам саны шектеулі; уақыт шектеуі жоқ.', '8 сложных карт. Забери ключ, собери все кристаллы, пройди дверь и достигни звезды. Блоки и шаги ограничены, время — нет.', '8 challenging maps. Collect the key and every crystal, pass the door and reach the star. Blocks and steps are limited; time is not.'
        ]);
        $('quest-level-label').textContent = t([
            'Деңгей', 'Уровень', 'Level'
        ]);
        $('quest-level').replaceChildren();
        levels.forEach((level, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${completed.has(level.id) ? '✓ ' : ''}${level.id} / 8 · ${level.budget} ${t([
                'блок', 'блоков', 'blocks'
            ])}`;
            $('quest-level').append(option);
        });
        $('quest-level').value = levelIndex;
        $('quest-rules').textContent = t([
            'U = ↑, D = ↓, L = ←, R = →. Repeat бір үлгіні 1–6 рет қайталайды, бірақ бір блок болып саналады. Барлық іске қосу бастапқы ұяшықтан басталады.', 'U = ↑, D = ↓, L = ←, R = →. Repeat повторяет шаблон 1–6 раз и занимает один блок. Каждый запуск начинается со старта.', 'U = ↑, D = ↓, L = ←, R = →. Repeat repeats a pattern 1–6 times and uses one block. Each run starts from the initial cell.'
        ]);
        $('repeat-label').textContent = t([
            'Қайталанатын үлгі', 'Повторяемый шаблон', 'Repeated pattern'
        ]);
        $('repeat-count-label').textContent = t([
            'Қайталау саны', 'Повторений', 'Repetitions'
        ]);
        $('repeat-add').textContent = t([
            'Repeat блогын қос', 'Добавить repeat', 'Add repeat block'
        ]);
        $('quest-program').replaceChildren();
        program.forEach((block, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. [ ${block.moves.map(move => arrows[move]).join(' ')} ] × ${block.repeat}`;
            $('quest-program').append(li);
        });
        $('quest-run').textContent = t([
            '▶ Орындау', '▶ Выполнить', '▶ Run'
        ]);
        $('quest-step').textContent = t([
            'Бір қадам', 'Один шаг', 'Step'
        ]);
        $('quest-undo').textContent = t([
            '↶ Соңғы блок', '↶ Последний блок', '↶ Undo block'
        ]);
        $('quest-reset').textContent = t([
            'Тазалау', 'Очистить', 'Clear'
        ]);
        $('quest-legend').textContent = t([
            '🤖 Робот · ★ Мақсат · ◆ Кристалл · ⚿ Кілт · ▣ Есік · ▧ Қабырға', '🤖 Робот · ★ Цель · ◆ Кристалл · ⚿ Ключ · ▣ Дверь · ▧ Стена', '🤖 Robot · ★ Goal · ◆ Crystal · ⚿ Key · ▣ Door · ▧ Wall'
        ]);
        renderBoard();
    }
    window.TymioQuest = {
        initial, advance, levels
    };
    window.addEventListener('tymio-language', render);
    resetExecution();
    render();
})();
