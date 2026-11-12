// Accessible general-purpose AI chat, with a clearly labelled local fallback.
(() => {
    const t = window.Tymio.text;
    const languageNames = [
        'Қазақша', 'Русский', 'English'
    ];
    const languageCodes = [
        'kk', 'ru', 'en'
    ];
    const knowledge = window.AivaKnowledge;
    let responseLanguage = 'auto';
    let messages = [];
    let connection = {
        configured: false, token: ''
    };
    let busy = false;
    let controller;
    let generation = 0;
    const launch = document.createElement('button');
    launch.className = 'aiva-launch';
    launch.setAttribute('aria-expanded', 'false');
    launch.setAttribute('aria-controls', 'aiva-panel');
    document.body.append(launch);
    const panel = document.createElement('section');
    panel.id = 'aiva-panel';
    panel.className = 'aiva-panel';
    panel.hidden = true;
    panel.setAttribute('aria-labelledby', 'aiva-title');
    panel.innerHTML = `
        <div class="aiva-head">
            <div>
                <strong id="aiva-title">✦ AIVA</strong>
                <small id="aiva-tagline"></small>
            </div>
            <button type="button" id="aiva-close">×</button>
        </div>
        <div class="aiva-language-row">
            <label for="aiva-language" id="aiva-language-label"></label>
            <select id="aiva-language"></select>
        </div>
        <p class="aiva-note" id="aiva-note"></p>
        <p id="aiva-status" role="status"></p>
        <div id="aiva-log" class="aiva-log"
             role="log" aria-live="polite" aria-relevant="additions" tabindex="0"></div>
        <div class="aiva-prompts"></div>
        <form id="aiva-form">
            <label for="aiva-input" id="aiva-input-label"></label>
            <div class="aiva-compose">
                <textarea id="aiva-input" rows="2" maxlength="1500" required></textarea>
                <button type="submit" id="aiva-send">↑</button>
            </div>
            <small id="aiva-key-hint"></small>
        </form>
        <button type="button" id="aiva-clear"></button>
        <button type="button" id="aiva-stop" hidden></button>
    `;
    document.body.append(panel);
    const get = id => panel.querySelector('#' + id);
    const log = get('aiva-log');
    const input = get('aiva-input');
    const select = get('aiva-language');
    function replyLanguage() {
        return responseLanguage === 'auto' ? window.Tymio.language : responseLanguage;
    }
    function translated(values) {
        return values[languageCodes.indexOf(replyLanguage())];
    }
    function answerFor(message) {
        if (message.topic === 'intro') {
            return {
                title: translated([
                    'Сәлем! Мен AIVA', 'Привет! Я AIVA', 'Hello! I am AIVA'
                ]),
                text: translated([
                    'Ғылым, тарих, математика, мәтін жазу, күнделікті сұрақтар және код туралы сұрай аласың. Жалпы тақырыптарға жауап беру үшін AI байланысы қосулы болуы керек. Жауап тілін жоғарыдан таңда.',
                    'Спрашивай о науке, истории, математике, текстах, повседневных вопросах и коде. Для общих тем нужно активное подключение AI. Выбери язык ответа выше.',
                    'Ask about science, history, mathematics, writing, everyday questions and code. General questions require an active AI connection. Choose the response language above.'
                ])
            };
        }
        if (message.ai)
            return {
                title: '', text: message.text
            };
        if (message.error)
            return {
                title: translated([
                    'Байланыс', 'Подключение', 'Connection'
                ]), text: errorText(message.error)
            };
        if (message.topic === 'fallback') {
            return {
                title: translated([
                    'Тақырыпты нақтылайық', 'Уточним тему', 'Let’s clarify the topic'
                ]),
                text: translated([
                    'Бұл сұраққа дайын материалымнан нақты жауап табылмады. Мен еркін жауап жасайтын GPT моделі емеспін.\n\n«Айнымалы», «Цикл», «Шарт», «Функция», «Тізім», Python, JavaScript, HTML/CSS, Java, C++, C#, SQL немесе «Ойынға көмек» деп сұрап көр.',
                    'В моих учебных материалах нет точного ответа. Я не модель GPT, генерирующая произвольные ответы.\n\nСпроси о переменных, циклах, условиях, функциях, списках, Python, JavaScript, HTML/CSS, Java, C++, C#, SQL или помощи с игрой.',
                    'I could not find an exact answer in my learning materials. I am not a GPT model that generates arbitrary answers.\n\nAsk about variables, loops, conditions, functions, lists, Python, JavaScript, HTML/CSS, Java, C++, C#, SQL or game help.'
                ])
            };
        }
        const topic = knowledge.find(item => item.id === message.topic);
        return {
            title: translated(topic.title),
            text: translated(topic.answers),
            code: topic.code
        };
    }
    function createMessage(message) {
        const article = document.createElement('article');
        article.className = 'aiva-message ' + message.role;
        const sender = document.createElement('strong');
        sender.textContent = message.role === 'user' ? t([
            'Сен', 'Ты', 'You'
        ]) : 'AIVA';
        article.append(sender);
        const body = document.createElement('p');
        if (message.role === 'user') {
            // User input is always text, never interpreted as HTML.
            body.textContent = message.text;
        }
        else {
            const answer = answerFor(message);
            article.lang = message.language === 'auto' ? window.Tymio.language : (message.language || replyLanguage());
            const heading = document.createElement('h4');
            heading.textContent = answer.title;
            article.append(heading);
            body.textContent = answer.text;
            article.append(body);
            if (answer.code) {
                const code = document.createElement('pre');
                code.textContent = answer.code;
                article.append(code);
            }
            return article;
        }
        article.append(body);
        return article;
    }
    function append(message) {
        messages.push(message);
        log.append(createMessage(message));
        if (messages.length > 41) {
            messages.shift();
            log.firstElementChild?.remove();
        }
        log.scrollTop = log.scrollHeight;
    }
    function renderHistory() {
        // Existing assistant replies are retranslated; user messages stay unchanged.
        log.setAttribute('aria-live', 'off');
        log.replaceChildren(...messages.map(createMessage));
        log.setAttribute('aria-live', 'polite');
        log.scrollTop = log.scrollHeight;
    }
    function errorText(code) {
        const errors = {
            not_configured: [
                'Жалпы сұрақтарға жауап беру үшін AI кілті әлі қосылмаған. Жоба иесі .env файлына OPENAI_API_KEY мәнін енгізіп, сайтты http://127.0.0.1:8787 арқылы ашуы керек. Кілтті чатқа жазба.',
                'Для общих вопросов ещё не подключён AI-ключ. Владелец проекта должен заполнить OPENAI_API_KEY в .env и открыть сайт через http://127.0.0.1:8787. Не отправляй ключ в чат.',
                'An AI key has not been connected for general questions. The project owner must set OPENAI_API_KEY in .env and open http://127.0.0.1:8787. Do not send the key in chat.'
            ],
            invalid_key: [
                'AI кілті қабылданбады. Жергілікті баптауды тексер.', 'AI-ключ не принят. Проверь локальные настройки.', 'The AI key was rejected. Check local settings.'
            ],
            quota_or_rate_limit: [
                'AI қызметінің лимиті не балансы жеткіліксіз. Аккаунтты тексеріп, кейін қайтала.', 'Достигнут лимит или недостаточно баланса AI-сервиса. Проверь аккаунт и повтори позже.', 'The AI service limit or quota was reached. Check the account and retry later.'
            ],
            model_unavailable: [
                'Бұл модель аккаунтта қолжетімсіз. OPENAI_MODEL баптауын тексер.', 'Модель недоступна для аккаунта. Проверь OPENAI_MODEL.', 'This model is unavailable for the account. Check OPENAI_MODEL.'
            ],
            timeout: [
                'Жауап күту уақыты бітті. Қайта сұрап көр.', 'Время ожидания истекло. Повтори запрос.', 'The request timed out. Please try again.'
            ],
            cancelled: [
                'Сұрау тоқтатылды.', 'Запрос остановлен.', 'Request stopped.'
            ],
            busy: [
                'Алдыңғы жауапты күте тұр.', 'Дождись предыдущего ответа.', 'Wait for the previous response.'
            ],
            rate_limit: [
                'Бір минутта тым көп сұрау жіберілді. Сәлден соң қайтала.', 'Слишком много запросов за минуту. Попробуй чуть позже.', 'Too many requests this minute. Try again shortly.'
            ],
            connection_error: [
                'AI байланысы үзілді. Интернет пен серверді тексеріп, қайта сұрап көр.', 'Связь с AI прервалась. Проверь интернет и сервер, затем повтори запрос.', 'The AI connection failed. Check the internet and server, then retry.'
            ]
        };
        return translated(errors[code] || errors.connection_error);
    }
    function connectionNote() {
        get('aiva-note').textContent = connection.configured ? t([
            'AI режимі · Сұрақ пен соңғы хабарламалар жауап алу үшін OpenAI қызметіне жіберіледі. Жеке құпияларды жазба.',
            'Режим AI · Вопрос и последние сообщения отправляются в OpenAI для ответа. Не вводи секретные данные.',
            'AI mode · Your question and recent messages are sent to OpenAI for a response. Do not enter secrets.'
        ]) : t([
            'AI әлі қосылмаған · Қазір тек дайын оқу жауаптары бар. Жалпы сұрақтар үшін жоба иесі AI кілтін қосуы керек.',
            'AI ещё не подключён · Пока доступны готовые учебные ответы. Для общих вопросов владельцу нужно подключить AI-ключ.',
            'AI not connected yet · Only prepared learning answers are available. The owner needs to connect an AI key for general questions.'
        ]);
    }
    async function checkConnection() {
        if (![
            'http:', 'https:'
        ].includes(location.protocol) || typeof fetch !== 'function') {
            connection = {
                configured: false, token: ''
            };
            connectionNote();
            return;
        }
        try {
            const status = await fetch('/api/status', {
                signal: AbortSignal.timeout(4000), cache: 'no-store'
            });
            if (!status.ok)
                throw new Error('offline');
            const result = await status.json();
            connection = {
                configured: result.configured === true, token: result.token || ''
            };
        }
        catch {
            connection = {
                configured: false, token: ''
            };
        }
        connectionNote();
    }
    function setBusy(value) {
        busy = value;
        get('aiva-send').disabled = value;
        get('aiva-stop').hidden = !value;
        get('aiva-clear').disabled = value;
        panel.querySelectorAll('.aiva-prompts button').forEach(button => {
            button.disabled = value;
        });
        get('aiva-status').textContent = value ? t([
            'AIVA жауап дайындап жатыр…', 'AIVA готовит ответ…', 'AIVA is preparing a response…'
        ]) : '';
    }
    async function respond(value) {
        const question = value.trim().slice(0, 1500);
        if (!question || busy)
            return;
        setBusy(true);
        const requestGeneration = ++generation;
        append({
            role: 'user', text: question
        });
        input.value = '';
        await checkConnection();
        if (requestGeneration !== generation)
            return;
        if (!connection.configured) {
            const match = knowledge.find(topic => topic.pattern.test(question));
            append(match ? {
                role: 'bot', topic: match.id
            } : {
                role: 'bot', error: 'not_configured'
            });
            setBusy(false);
            input.focus();
            return;
        }
        const selectedLanguage = responseLanguage === 'auto' ? 'auto' : replyLanguage();
        const history = messages.filter(message => message.role === 'user' || message.ai)
            .slice(-12).map(message => ({
            role: message.role === 'user' ? 'user' : 'assistant',
            content: message.text
        }));
        // Keep bounded context while retaining the latest question.
        while (history.reduce((sum, message) => sum + message.content.length, 0) > 45000 && history.length > 1)
            history.shift();
        controller = new AbortController();
        const timeout = setTimeout(() => controller.abort('timeout'), 55000);
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 'X-Aiva-Token': connection.token
                },
                body: JSON.stringify({
                    language: selectedLanguage, messages: history
                }),
                signal: controller.signal
            });
            const payload = await response.json();
            if (requestGeneration !== generation)
                return;
            if (!response.ok || typeof payload.answer !== 'string') {
                append({
                    role: 'bot', error: payload.error || 'connection_error'
                });
            }
            else {
                append({
                    role: 'bot', ai: true, text: payload.answer, language: selectedLanguage
                });
            }
        }
        catch {
            if (requestGeneration === generation)
                append({
                    role: 'bot', error: controller.signal.aborted ? 'timeout' : 'connection_error'
                });
        }
        finally {
            clearTimeout(timeout);
            if (requestGeneration === generation)
                setBusy(false);
        }
        input.focus();
    }
    function open() {
        panel.hidden = false;
        launch.setAttribute('aria-expanded', 'true');
        input.focus();
        checkConnection();
    }
    function close() {
        panel.hidden = true;
        launch.setAttribute('aria-expanded', 'false');
        launch.focus();
    }
    function renderInterface() {
        launch.textContent = t([
            '✦ AIVA · Көмекші', '✦ AIVA · Помощник', '✦ AIVA · Assistant'
        ]);
        get('aiva-tagline').textContent = t([
            'Сұрақтарыңа арналған көмекші', 'Помощник для твоих вопросов', 'A companion for your questions'
        ]);
        get('aiva-close').setAttribute('aria-label', t([
            'Чатты жабу', 'Закрыть чат', 'Close chat'
        ]));
        get('aiva-language-label').textContent = t([
            'Жауап тілі', 'Язык ответа', 'Response language'
        ]);
        connectionNote();
        get('aiva-input-label').textContent = t([
            'Сұрағыңды жаз', 'Задай вопрос', 'Ask a question'
        ]);
        input.placeholder = t([
            'Кез келген тақырыпта сұрақ қой…', 'Задай вопрос на любую тему…', 'Ask a question on any topic…'
        ]);
        get('aiva-send').setAttribute('aria-label', t([
            'Жіберу', 'Отправить', 'Send'
        ]));
        get('aiva-key-hint').textContent = t([
            'Enter — жіберу · Shift + Enter — жаңа жол', 'Enter — отправить · Shift + Enter — новая строка', 'Enter: send · Shift + Enter: new line'
        ]);
        get('aiva-clear').textContent = t([
            'Чатты тазалау', 'Очистить чат', 'Clear chat'
        ]);
        get('aiva-stop').textContent = t([
            'Тоқтату', 'Остановить', 'Stop'
        ]);
        log.setAttribute('aria-label', t([
            'Хабарламалар', 'Сообщения', 'Messages'
        ]));
        select.replaceChildren();
        const automatic = document.createElement('option');
        automatic.value = 'auto';
        automatic.textContent = t([
            'Сайт тілі', 'Язык сайта', 'Site language'
        ]);
        select.append(automatic);
        languageCodes.forEach((code, index) => {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = languageNames[index];
            select.append(option);
        });
        select.value = responseLanguage;
        const prompts = panel.querySelector('.aiva-prompts');
        prompts.replaceChildren();
        const questions = [
            [
                'Кемпірқосақ қалай пайда болады?', 'Как появляется радуга?', 'How does a rainbow form?'
            ],
            [
                'Оқу жоспарын құруға көмектес', 'Помоги составить план учёбы', 'Help me make a study plan'
            ],
            [
                'Досыма құттықтау жаз', 'Напиши поздравление другу', 'Write a greeting for a friend'
            ]
        ];
        questions.forEach(question => {
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = t(question);
            button.onclick = () => respond(t(question));
            prompts.append(button);
        });
        renderHistory();
        setBusy(busy);
    }
    launch.onclick = () => panel.hidden ? open() : close();
    get('aiva-close').onclick = close;
    panel.addEventListener('keydown', event => {
        if (event.key === 'Escape')
            close();
    });
    get('aiva-form').onsubmit = event => {
        event.preventDefault();
        respond(input.value);
    };
    input.onkeydown = event => {
        if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
            event.preventDefault();
            respond(input.value);
        }
    };
    select.onchange = () => {
        responseLanguage = select.value;
        renderHistory();
    };
    get('aiva-clear').onclick = () => {
        messages = [
            {
                role: 'bot', topic: 'intro'
            }
        ];
        renderHistory();
        input.focus();
    };
    get('aiva-stop').onclick = () => {
        generation++;
        controller?.abort();
        append({
            role: 'bot', error: 'cancelled'
        });
        setBusy(false);
        input.focus();
    };
    window.addEventListener('tymio-language', renderInterface);
    messages.push({
        role: 'bot', topic: 'intro'
    });
    renderInterface();
    checkConnection();
    if (location.hash === '#aiva')
        open();
})();
