// Authored, silent text videos with translated frames and synchronized captions.
(() => {
    const t = window.Tymio.text, courses = window.TymioCourses;
    const player = document.getElementById('player');
    const signPlayer = document.getElementById('sign-player');
    const signFile = document.getElementById('sign-file');
    const signText = document.getElementById('sign-text');
    let courseIndex = 0, moduleIndex = 0, videoLanguage = window.Tymio.language, captionLanguage = videoLanguage, custom = false;
    let signObjectUrl = '';
    let narrationOn = false, narrationCues = [], narrationCueIndex = -1, lastSpokenSlide = -1;
    let narrationSpeaking = false;
    const controls = document.createElement('div');
    controls.className = 'video-library-controls';
    controls.innerHTML = '<label for="video-topic" id="video-topic-label"></label><select id="video-topic"></select><label for="video-language" id="video-language-label"></label><select id="video-language"></select><label for="caption-language" id="caption-language-label"></label><select id="caption-language"></select><p id="video-description" class="notice"></p>';
    document.querySelector('.videobox').prepend(controls);
    const $ = id => document.getElementById(id);
    const names = {
        kk: 'Қазақша', ru: 'Русский', en: 'English'
    };
    const languageIndex = language => ({ kk: 0, ru: 1, en: 2 }[language] ?? 0);
    const videoText = values => Array.isArray(values) ? values[languageIndex(videoLanguage)] : values;
    function renderText() {
        $('video-topic-label').textContent = t([
            'Бейнесабақ тақырыбы', 'Тема видеоурока', 'Video lesson topic'
        ]);
        $('video-language-label').textContent = t([
            'Видео мәтінінің тілі', 'Язык текста в видео', 'Video text language'
        ]);
        $('caption-language-label').textContent = t([
            'Субтитр тілі', 'Язык субтитров', 'Caption language'
        ]);
        $('video-description').textContent = t([
            '12 дыбыссыз мәтіндік сабақ · қазақша, орысша және ағылшынша. 8 сабақта видео, 4 сабақта басқарылатын слайд бар. Видео мәтіні мен субтитр тілін бөлек таңда.', '12 беззвучных текстовых уроков · на казахском, русском и английском. В 8 уроках видео, в 4 — управляемые слайды. Язык текста и субтитров выбирается отдельно.', '12 silent text-based lessons · in Kazakh, Russian and English. Eight lessons use video; four use controllable slides. Video text and caption languages can be selected separately.'
        ]);
        $('narration-toggle').textContent = narrationOn ? t(['Дыбысты тоқтату', 'Остановить озвучку', 'Stop narration']) : t(['🔊 Дауыстап оқу', '🔊 Читать вслух', '🔊 Read aloud']);
        $('narration-toggle').setAttribute('aria-pressed', String(narrationOn));
        $('narration-help').textContent = t(['Дайын MP4 файлдар дыбыссыз. Бұл батырма субтитр мәтінін компьютер дауысымен оқиды.', 'Готовые MP4 без звука. Эта кнопка читает текст субтитров голосом компьютера.', 'The MP4 files are silent. This button reads their subtitle text with a computer voice.']);
        $('sign-tools-title').textContent = t(['Ым тілімен түсіндіру', 'Объяснение на жестовом языке', 'Sign-language explanation']);
        $('sign-tools-help').textContent = t([
            'Бар видео болса, ым тіліндегі түсіндірмені жүкте. Немесе сабақ мәтінін көшіріп, AI-Ym аудармашысына өзің қой. AI-Ym қазақша/орысша мәтінді қолдайды. Мәтін сыртқы сайтқа автоматты түрде жіберілмейді.',
            'Если есть видео с переводом на жестовый язык, загрузи его. Либо скопируй текст урока и вставь в AI-Ym. Переводчик работает с казахским и русским текстом. Текст не отправляется туда автоматически.',
            'Upload a sign-language interpretation video if you have one. Or copy the lesson text and paste it into AI-Ym. Its translator supports Kazakh and Russian text. Text is not sent there automatically.'
        ]);
        $('sign-file-label').firstChild.textContent = t(['Ым тіліндегі видео қос', 'Добавить видео на жестовом языке', 'Add sign-language video']);
        $('sign-text-label').textContent = t(['Аударылатын мәтін', 'Текст для перевода', 'Text to translate']);
        $('copy-lesson-text').textContent = t(['Осы сабақ мәтінін қою', 'Вставить текст урока', 'Fill with lesson text']);
        $('copy-sign-text').textContent = t(['Мәтінді көшіру', 'Скопировать текст', 'Copy text']);
        $('sign-translator-link').textContent = t(['AI-Ym аудармашысын аш ↗', 'Открыть переводчик AI-Ym ↗', 'Open AI-Ym translator ↗']);
        $('video-topic').replaceChildren();
        const videoTopics = [];
        courses.forEach((course, index) => {
            videoTopics.push({ courseIndex: index, moduleIndex: 0 });
            if (['python', 'javascript', 'html', 'css'].includes(course.id)) videoTopics.push({ courseIndex: index, moduleIndex: 1 });
        });
        videoTopics.forEach((topic, index) => {
            const course = courses[topic.courseIndex], module = course.modules[topic.moduleIndex];
            const option = document.createElement('option');
            option.value = index;
            option.textContent = course.name + ' · ' + t(module.title);
            $('video-topic').append(option);
        });
        const topicIndex = videoTopics.findIndex(topic => topic.courseIndex === courseIndex && topic.moduleIndex === moduleIndex);
        $('video-topic').value = topicIndex < 0 ? 0 : topicIndex;
        for (const id of [
            'video-language', 'caption-language'
        ]) {
            $(id).replaceChildren();
            if (id === 'caption-language') {
                const off = document.createElement('option');
                off.value = 'off';
                off.textContent = t([
                    'Субтитрсіз', 'Без субтитров', 'Captions off'
                ]);
                $(id).append(off);
            }
            Object.entries(names).forEach(([code, name]) => {
                const option = document.createElement('option');
                option.value = code;
                option.textContent = name;
                $(id).append(option);
            });
        }
        $('video-language').value = videoLanguage;
        $('caption-language').value = captionLanguage;
        const module = courses[courseIndex].modules[moduleIndex], article = document.querySelector('.videogrid article');
        article.querySelector('h3').textContent = t(module.title);
        const paragraphs = article.querySelectorAll(':scope > p');
        paragraphs[0].textContent = t(module.theory).split('\n\n')[0];
        article.querySelector(':scope > pre').textContent = module.code;
        paragraphs[1].textContent = t([
            'Нәтиже: ', 'Результат: ', 'Result: '
        ]) + module.output;
        paragraphs[2].textContent = t(module.reason);
        article.querySelector('details pre').textContent = t(module.theory).split('\n\n').slice(1).join('\n\n');
        article.querySelector('summary').textContent = t([
            'Толық түсіндірмені оқу', 'Прочитать полное объяснение', 'Read the full explanation'
        ]);
        article.querySelector('.notice').textContent = t([
            'Қарап болған соң жоғарыдағы модульдің екі тапсырмасын орында. Видео қарау автоматты түрде жетістік бермейді.', 'После просмотра выполни два задания модуля выше. Просмотр сам по себе не засчитывает модуль.', 'After watching, complete the two module tasks above. Watching alone does not complete the module.'
        ]);
        document.querySelector('.videobox > p:first-of-type').textContent = t([
            'Төменнен өз видеоңды да таңдауға болады.', 'Ниже можно также выбрать собственное видео.', 'You can also choose your own video below.'
        ]);
    }
    function setCaptions() {
        for (const track of player.textTracks) {
            track.mode = track.language === captionLanguage ? 'showing' : 'disabled';
        }
    }
    function loadVideo(preserve = false) {
        const course = courses[courseIndex], module = course.modules[moduleIndex];
        if (moduleIndex > 0) {
            custom = false;
            player.pause();
            player.hidden = true;
            showSlideLesson(course, module);
            $('videostatus').textContent = t([
                'Слайд-сабақ дайын. ▶ батырмасын бас.', 'Слайды готовы. Нажми ▶.', 'Slide lesson ready. Press ▶.'
            ]);
            return;
        }
        removeSlideLesson();
        player.hidden = false;
        const time = preserve && Number.isFinite(player.currentTime) ? player.currentTime : 0;
        player.pause();
        custom = false;
        player.querySelectorAll('track').forEach(track => track.remove());
        player.poster = `media/${course.id}-${videoLanguage}.jpg`;
        player.src = `media/${course.id}-${videoLanguage}.mp4`;
        for (const language of Object.keys(names)) {
            const track = document.createElement('track');
            track.kind = 'subtitles';
            track.srclang = language;
            track.label = names[language];
            track.src = `media/${course.id}-${language}.vtt`;
            track.default = language === captionLanguage;
            track.addEventListener('load', setCaptions);
            player.append(track);
        }
        player.addEventListener('loadedmetadata', () => {
            player.currentTime = Math.min(time, Number.isFinite(player.duration) ? player.duration : time);
            setCaptions();
        }, {
            once: true
        });
        player.load();
        if (narrationOn) {
            window.speechSynthesis?.cancel();
            narrationSpeaking = false;
            loadNarrationCues().then(updateVideoNarration);
        }
        $('videostatus').textContent = t([
            'Видео дайын. ▶ батырмасын бас.', 'Видео готово. Нажми ▶.', 'Video ready. Press ▶.'
        ]);
    }
    let slideTimer = 0, slidePosition = 0, slideCards = [], slideDeck;
    function removeSlideLesson() {
        clearInterval(slideTimer);
        slideTimer = 0;
        slideDeck?.remove();
        slideDeck = null;
    }
    function resetSignVideo() {
        signPlayer.pause();
        signPlayer.removeAttribute('src');
        signPlayer.load();
        signPlayer.hidden = true;
        if (signObjectUrl) URL.revokeObjectURL(signObjectUrl);
        signObjectUrl = '';
        signFile.value = '';
    }
    function syncSignTime() {
        if (!signObjectUrl || !Number.isFinite(player.currentTime)) return;
        if (Math.abs(signPlayer.currentTime - player.currentTime) > 0.35) {
            try { signPlayer.currentTime = Math.min(player.currentTime, Number.isFinite(signPlayer.duration) ? signPlayer.duration : player.currentTime); } catch {}
        }
    }
    function parseTimecode(value) {
        const match = value.match(/(?:(\d+):)?(\d{2}):(\d{2})\.(\d{3})/);
        return match ? Number(match[1] || 0) * 3600 + Number(match[2]) * 60 + Number(match[3]) + Number(match[4]) / 1000 : 0;
    }
    async function loadNarrationCues() {
        narrationCues = [];
        narrationCueIndex = -1;
        if (moduleIndex > 0) return;
        try {
            const course = courses[courseIndex];
            const response = await fetch(`media/${course.id}-${videoLanguage}.vtt`, { cache: 'no-store' });
            if (!response.ok) return;
            const source = (await response.text()).replace(/\r/g, '');
            for (const block of source.split(/\n\s*\n/)) {
                const lines = block.split('\n'), at = lines.findIndex(line => line.includes('-->'));
                if (at < 0) continue;
                const times = lines[at].split('-->');
                const start = parseTimecode(times[0].trim()), end = parseTimecode(times[1].trim().split(/\s/)[0]);
                const text = lines.slice(at + 1).join(' ').replace(/<[^>]*>/g, '').trim();
                if (text) narrationCues.push({ start, end, text });
            }
        } catch { narrationCues = []; }
    }
    function sayNarration(text) {
        if (!narrationOn || !text || !window.speechSynthesis || !window.SpeechSynthesisUtterance) return;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = { kk: 'kk-KZ', ru: 'ru-RU', en: 'en-US' }[videoLanguage];
        const voices = speechSynthesis.getVoices();
        const voice = voices.find(item => item.lang.toLowerCase().startsWith(videoLanguage));
        if (voices.length && !voice) {
            $('narration-status').textContent = t(['Осы тілдің компьютер дауысы орнатылмаған.', 'Для этого языка не установлен голос компьютера.', 'A system voice for this language is not installed.']);
            return;
        }
        if (voice) utterance.voice = voice;
        utterance.rate = 0.96;
        utterance.onstart = () => {
            narrationSpeaking = true;
            $('narration-status').textContent = t(['Сабақ мәтіні дауыстап оқылып жатыр.', 'Текст урока читается вслух.', 'Lesson text is being read aloud.']);
        };
        utterance.onend = () => { narrationSpeaking = false; updateVideoNarration(); };
        utterance.onerror = () => {
            narrationSpeaking = false;
            $('narration-status').textContent = t(['Бұл тілге жүйелік дауыс табылмады. Компьютерге тиісті дауыс орнату керек.', 'Для этого языка не найден системный голос. Установи голос для выбранного языка.', 'No system voice was found for this language. Install a voice for the selected language.']);
        };
        speechSynthesis.speak(utterance);
    }
    function updateVideoNarration() {
        if (!narrationOn || moduleIndex > 0 || player.hidden || !narrationCues.length || narrationSpeaking) return;
        const index = narrationCues.findIndex(cue => player.currentTime >= cue.start && player.currentTime < cue.end);
        if (index < 0 || index === narrationCueIndex) return;
        narrationCueIndex = index;
        sayNarration(narrationCues[index].text);
    }
    $('narration-toggle').onclick = async () => {
        if (narrationOn) {
            narrationOn = false;
            window.speechSynthesis?.cancel();
            narrationSpeaking = false;
            $('narration-status').textContent = t(['Дауыстау тоқтатылды.', 'Озвучка остановлена.', 'Narration stopped.']);
        } else {
            narrationOn = true;
            narrationCueIndex = -1;
            lastSpokenSlide = -1;
            if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
                narrationOn = false;
                $('narration-status').textContent = t(['Бұл браузерде дауыстап оқу қолжетімсіз.', 'В этом браузере озвучка недоступна.', 'Read-aloud is not available in this browser.']);
            } else if (moduleIndex === 0) {
                await loadNarrationCues();
                updateVideoNarration();
            } else {
                renderSlide();
            }
        }
        renderText();
    };
    function playSignVideo() {
        if (!signObjectUrl) return;
        syncSignTime();
        signPlayer.playbackRate = player.playbackRate || 1;
        signPlayer.play().catch(() => {});
    }
    player.addEventListener('play', playSignVideo);
    player.addEventListener('pause', () => signPlayer.pause());
    player.addEventListener('seeked', syncSignTime);
    player.addEventListener('timeupdate', syncSignTime);
    player.addEventListener('loadedmetadata', syncSignTime);
    player.addEventListener('timeupdate', updateVideoNarration);
    player.addEventListener('play', () => window.speechSynthesis?.resume());
    player.addEventListener('pause', () => window.speechSynthesis?.pause());
    player.addEventListener('seeked', () => {
        if (narrationOn && moduleIndex === 0) {
            window.speechSynthesis?.cancel();
            narrationSpeaking = false;
            narrationCueIndex = -1;
            updateVideoNarration();
        }
    });
    player.addEventListener('ratechange', () => { if (signObjectUrl) signPlayer.playbackRate = player.playbackRate; });
    signPlayer.addEventListener('play', () => { if (player.paused && !player.hidden) player.play().catch(() => {}); });
    signPlayer.addEventListener('pause', () => { if (!player.paused && !player.hidden) player.pause(); });
    signPlayer.addEventListener('seeking', () => {
        if (!player.hidden && Number.isFinite(signPlayer.currentTime) && Math.abs(player.currentTime - signPlayer.currentTime) > 0.5) {
            try { player.currentTime = Math.min(signPlayer.currentTime, Number.isFinite(player.duration) ? player.duration : signPlayer.currentTime); } catch {}
        }
    });
    signFile.addEventListener('change', event => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (signObjectUrl) URL.revokeObjectURL(signObjectUrl);
        signObjectUrl = URL.createObjectURL(file);
        signPlayer.src = signObjectUrl;
        signPlayer.hidden = false;
        signPlayer.load();
        $('sign-status').textContent = t(['Ым тіліндегі видео жүктелді. Сабақ видеосын бастағанда бірге ойнатылады.', 'Видео жестового перевода загружено. Оно начнёт воспроизводиться вместе с уроком.', 'Sign-language video loaded. It will play alongside the lesson video.']);
        signPlayer.addEventListener('loadedmetadata', syncSignTime, { once: true });
    });
    $('copy-lesson-text').onclick = () => {
        const module = courses[courseIndex].modules[moduleIndex];
        signText.value = `${videoText(module.title)}\n\n${videoText(module.theory)}`;
        $('sign-status').textContent = t(['Сабақ мәтіні енгізілді. Қаласаң, өзгертіп ал.', 'Текст урока добавлен. При желании отредактируй его.', 'Lesson text added. Edit it if you like.']);
    };
    $('copy-sign-text').onclick = async () => {
        if (!signText.value.trim()) {
            $('sign-status').textContent = t(['Алдымен мәтін жаз немесе сабақ мәтінін қой.', 'Сначала введи текст или вставь текст урока.', 'Enter text or fill in the lesson text first.']);
            return;
        }
        try {
            await navigator.clipboard.writeText(signText.value);
            $('sign-status').textContent = t(['Мәтін көшірілді. AI-Ym сайтына өзің қой.', 'Текст скопирован. Вставь его на сайте AI-Ym.', 'Text copied. Paste it into AI-Ym yourself.']);
        } catch {
            signText.focus(); signText.select();
            $('sign-status').textContent = t(['Мәтінді белгілеп қойдым — Ctrl+C бас.', 'Текст выделен — нажми Ctrl+C.', 'Text selected — press Ctrl+C.']);
        }
    };
    function showSlideLesson(course, module) {
        clearInterval(slideTimer);
        if (!slideDeck) {
            slideDeck = document.createElement('section');
            slideDeck.className = 'video-slide-deck';
            slideDeck.setAttribute('aria-label', t(['Слайд бейнесабақ', 'Видеоурок-слайды', 'Slide video lesson']));
            slideDeck.innerHTML = '<div class="slide-top"><span id="slide-count"></span><span class="slide-progress" role="progressbar" aria-label="Lesson progress"><span></span></span></div><div class="slide-card" aria-live="polite"><p class="slide-kicker"></p><h3></h3><p class="slide-copy"></p><pre hidden></pre><p class="slide-caption"></p></div><div class="slide-controls"><button type="button" data-step="back"></button><button type="button" data-step="play" aria-pressed="false"></button><button type="button" data-step="next"></button></div>';
            document.querySelector('.videobox').append(slideDeck);
            slideDeck.querySelector('[data-step="back"]').onclick = () => { slidePosition = Math.max(0, slidePosition - 1); renderSlide(); };
            slideDeck.querySelector('[data-step="next"]').onclick = () => { slidePosition = Math.min(slideCards.length - 1, slidePosition + 1); renderSlide(); };
            slideDeck.querySelector('[data-step="play"]').onclick = toggleSlides;
        }
        const words = module.theory[languageIndex(videoLanguage)].split('\n\n');
        slideCards = [
            { title: module.title, copy: [module.theory[0].split('\n\n')[0], module.theory[1].split('\n\n')[0], module.theory[2].split('\n\n')[0]] },
            { title: ['Негізгі ұғым', 'Главная идея', 'The main idea'], copy: module.theory.map(text => text.split('\n\n')[0]) },
            { title: ['Қадамдап талдау', 'Разбор по шагам', 'Step-by-step'], copy: module.theory.map(text => text.split('\n\n')[1] || text.split('\n\n')[0]) },
            { title: ['Мысалды талдайық', 'Разберём пример', 'Let’s inspect the example'], copy: ['Кодқа назар аудар', 'Обрати внимание на код', 'Look closely at the code'], code: module.code },
            { title: ['Нәтиже және себеп', 'Результат и причина', 'Result and reasoning'], copy: module.reason.map((text, i) => text + '\n\n' + ['Күтілетін нәтиже: ', 'Ожидаемый результат: ', 'Expected result: '][i] + module.output) },
            { title: ['Өзіңді тексер', 'Проверь себя', 'Check your understanding'], copy: module.question }
        ];
        if (!Number.isFinite(slidePosition) || slidePosition >= slideCards.length) slidePosition = 0;
        renderSlide();
    }
    function renderSlide() {
        if (!slideDeck || !slideCards.length) return;
        const card = slideCards[slidePosition], content = slideDeck.querySelector('.slide-card');
        content.querySelector('.slide-kicker').textContent = t(['БЕЙНЕСАБАҚ', 'ВИДЕОУРОК', 'VIDEO LESSON']);
        content.querySelector('h3').textContent = videoText(card.title);
        content.querySelector('.slide-copy').textContent = videoText(card.copy);
        const code = content.querySelector('pre');
        code.hidden = !card.code;
        code.textContent = card.code || '';
        content.querySelector('.slide-caption').textContent = captionLanguage === 'off' ? '' : card.copy[languageIndex(captionLanguage)];
        slideDeck.querySelector('#slide-count').textContent = `${slidePosition + 1} / ${slideCards.length}`;
        const bar = slideDeck.querySelector('.slide-progress > span');
        bar.style.width = `${((slidePosition + 1) / slideCards.length) * 100}%`;
        const play = slideDeck.querySelector('[data-step="play"]');
        play.textContent = slideTimer ? t(['⏸ Тоқтату', '⏸ Пауза', '⏸ Pause']) : t(['▶ Ойнату', '▶ Воспроизвести', '▶ Play']);
        play.setAttribute('aria-pressed', String(Boolean(slideTimer)));
        slideDeck.querySelector('[data-step="back"]').textContent = t(['← Артқа', '← Назад', '← Back']);
        slideDeck.querySelector('[data-step="next"]').textContent = t(['Келесі →', 'Далее →', 'Next →']);
        if (narrationOn && slidePosition !== lastSpokenSlide) {
            lastSpokenSlide = slidePosition;
            window.speechSynthesis?.cancel();
            narrationSpeaking = false;
            sayNarration(`${videoText(card.title)}. ${videoText(card.copy)}`);
        }
    }
    function toggleSlides() {
        if (slideTimer) { clearInterval(slideTimer); slideTimer = 0; }
        else {
            if (slidePosition >= slideCards.length - 1) slidePosition = 0;
            slideTimer = setInterval(() => {
                if (slidePosition >= slideCards.length - 1) { clearInterval(slideTimer); slideTimer = 0; signPlayer.pause(); renderSlide(); return; }
                slidePosition += 1;
                renderSlide();
            }, 12000);
            if (signObjectUrl) {
                try { signPlayer.currentTime = 0; } catch {}
                signPlayer.play().catch(() => {});
            }
        }
        if (!slideTimer) signPlayer.pause();
        renderSlide();
    }
    $('video-topic').onchange = () => {
        const index = Number($('video-topic').value);
        const topics = [];
        courses.forEach((course, courseAt) => {
            topics.push({ courseIndex: courseAt, moduleIndex: 0 });
            if (['python', 'javascript', 'html', 'css'].includes(course.id)) topics.push({ courseIndex: courseAt, moduleIndex: 1 });
        });
        courseIndex = topics[index].courseIndex;
        moduleIndex = topics[index].moduleIndex;
        slidePosition = 0;
        resetSignVideo();
        $('sign-status').textContent = '';
        renderText();
        loadVideo();
    };
    $('video-language').onchange = () => {
        videoLanguage = $('video-language').value;
        loadVideo(true);
    };
    $('caption-language').onchange = () => {
        captionLanguage = $('caption-language').value;
        setCaptions();
        renderSlide();
    };
    player.addEventListener('error', () => {
        $('videostatus').textContent = t([
            'Видео ашылмады. Сайтты жергілікті серверден ашып көр: http://127.0.0.1:8787', 'Видео не загрузилось. Открой сайт через локальный сервер: http://127.0.0.1:8787', 'Video could not load. Open the local server: http://127.0.0.1:8787'
        ]);
    });
    $('videofile').addEventListener('change', event => {
        if (event.target.files.length) {
            custom = true;
            player.querySelectorAll('track').forEach(track => track.remove());
            player.removeAttribute('poster');
        }
    });
    window.addEventListener('tymio-language', () => {
        videoLanguage = window.Tymio.language;
        captionLanguage = videoLanguage;
        renderText();
        if (!custom) {
            slidePosition = 0;
            loadVideo(true);
        }
    });
    renderText();
    loadVideo();
})();
