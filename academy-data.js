window.TymioCourses = [
    {
        "id": "python",
        "name": "Python",
        "badge": "PY",
        "color": "#d8fa72",
        "modules": [
            {
                "title": [
                    "Тізім, сүзгі және жинақтау",
                    "Списки, фильтрация и накопление",
                    "Lists, filtering and accumulation"
                ],
                "theory": [
                    "Бұл модульде циклді оқып қана қоймай, оның әр қадамындағы күйді бақылайсың. total айнымалысы цикл басталғанға дейін бір рет жасалады. Әр айналымда n келесі санға ауысады, бірақ total бұрынғы мәнін сақтайды.\n\n% қалдықты есептейді. n % 2 == 0 болса, сан жұп. Шарттан өткен сандар ғана жинаққа қосылады. += бұрынғы мәнге жаңа мәнді қосып, нәтижені сол айнымалыға қайта жазады.\n\nЖиі қате: total = 0 жолын циклдің ішіне орналастыру. Онда бұрынғы жинақ әр айналымда жоғалады. Алдымен кіріс, шарт және жинақтау қадамдарын бөлек түсіндіріп көр.",
                    "В этом модуле отслеживай состояние на каждой итерации. total создаётся один раз перед циклом. n получает очередное число, но total сохраняет накопленное значение.\n\n% вычисляет остаток. Условие n % 2 == 0 выбирает чётные числа. Только они попадают в сумму. += прибавляет значение к текущему результату.\n\nЧастая ошибка: поместить total = 0 внутрь цикла. Тогда предыдущая сумма теряется на каждой итерации. Разделяй входные данные, фильтрацию и накопление.",
                    "Track the state on every iteration. total is initialized once before the loop. n receives each new number while total keeps the accumulated value.\n\n% computes the remainder. n % 2 == 0 selects even numbers. Only these numbers contribute to the sum. += adds to the existing value.\n\nA common mistake is placing total = 0 inside the loop. That discards the previous sum on every iteration. Separate the input, filtering and accumulation steps."
                ],
                "code": "numbers = [3, 8, 5, 12, 7]\ntotal = 0\nfor n in numbers:\n    if n % 2 == 0:\n        total += n\nprint(total)",
                "output": "20",
                "reason": [
                    "8 және 12 ғана жұп: 0 → 8 → 20. Қалған сандар total мәнін өзгертпейді.",
                    "Только 8 и 12 чётные: 0 → 8 → 20. Остальные числа не меняют total.",
                    "Only 8 and 12 are even: 0 → 8 → 20. Other numbers leave total unchanged."
                ],
                "question": [
                    "total = 0 цикл ішіне көшсе не бұзылады?",
                    "Что сломается, если перенести total = 0 в цикл?",
                    "What breaks if total = 0 moves inside the loop?"
                ],
                "options": [
                    [
                        "Жинақ әр айналымда өшеді",
                        "Тізім сұрыпталады",
                        "Цикл тоқтамайды"
                    ],
                    [
                        "Сумма сбрасывается каждый раз",
                        "Список сортируется",
                        "Цикл становится бесконечным"
                    ],
                    [
                        "The sum resets each iteration",
                        "The list becomes sorted",
                        "The loop becomes infinite"
                    ]
                ],
                "correct": 0,
                "hint": [
                    "Әр n үшін: қалдық, шарт, total деген үш баған жаз.",
                    "Для каждого n запиши остаток, условие и total.",
                    "For each n, write the remainder, condition and total."
                ]
            },
            {
                "title": [
                    "Функция, сөздік және шеткі жағдай",
                    "Функция, словарь и крайний случай",
                    "Functions, dictionaries and edge cases"
                ],
                "theory": [
                    "Функция есептеу ережесін бір жерге жинайды. Сөздік әр кілтке мән байланыстырады. counts.get(word, 0) кілт бар болса бұрынғы санын, болмаса 0 қайтарады.\n\nТөменгі код әр сөздің кездесу санын есептейді. return циклден кейін тұр, сондықтан барлық сөз өңделеді. Оны цикл ішіне шегіндірсең, бірінші сөзден кейін функция аяқталады.\n\nБос тізім үшін цикл орындалмайды, бірақ бос сөздік қайтарылады. Бұл — функцияны тексеруге қажет шеткі жағдай. Жаңа сөз бен қайталанған сөзді бөлек қадағала.",
                    "Функция собирает правило вычисления в одном месте. Словарь связывает ключ со значением. counts.get(word, 0) возвращает старое количество либо 0 для нового ключа.\n\nКод считает частоты слов. return находится после цикла, поэтому обрабатываются все слова. Если сделать его частью цикла, функция завершится после первого слова.\n\nДля пустого списка цикл не выполнится, но вернётся пустой словарь. Это важный крайний случай. Отслеживай новые и повторные слова отдельно.",
                    "A function groups a computation rule. A dictionary maps keys to values. counts.get(word, 0) returns the previous count or 0 for a new key.\n\nThe code counts word frequencies. return is after the loop, so every word is processed. Moving it inside the loop ends the function after the first word.\n\nAn empty list skips the loop and returns an empty dictionary. This is an important edge case. Track new and repeated words separately."
                ],
                "code": "def frequencies(words):\n    counts = {}\n    for word in words:\n        counts[word] = counts.get(word, 0) + 1\n    return counts\n\nresult = frequencies([\"code\", \"learn\", \"code\", \"code\"])\nprint(result[\"code\"])",
                "output": "3",
                "reason": [
                    "code үш рет кездеседі: 0 + 1 → 2 → 3. learn бөлек кілт.",
                    "code встречается три раза: 0 + 1 → 2 → 3. learn — отдельный ключ.",
                    "code occurs three times: 0 + 1 → 2 → 3. learn is a separate key."
                ],
                "question": [
                    "get(word, 0) не үшін қажет?",
                    "Зачем нужен get(word, 0)?",
                    "Why use get(word, 0)?"
                ],
                "options": [
                    [
                        "Сөздерді өшіру үшін",
                        "Жаңа кілтке бастапқы 0 беру үшін",
                        "Сөздерді сұрыптау үшін"
                    ],
                    [
                        "Чтобы удалить слова",
                        "Чтобы дать новому ключу начальный 0",
                        "Чтобы сортировать слова"
                    ],
                    [
                        "To delete words",
                        "To provide 0 for a new key",
                        "To sort words"
                    ]
                ],
                "correct": 1,
                "hint": [
                    "Әр сөзден кейін counts сөздігін қағазға жаз.",
                    "Записывай counts после каждого слова.",
                    "Write down counts after each word."
                ]
            }
        ]
    },
    {
        "id": "javascript",
        "name": "JavaScript",
        "badge": "JS",
        "color": "#ffe294",
        "modules": [
            {
                "title": [
                    "filter, map, reduce тізбегі",
                    "Цепочка filter, map, reduce",
                    "The filter, map, reduce pipeline"
                ],
                "theory": [
                    "Массив әдістері есепті үш бөлікке бөледі. filter элементті қалдыру-қалдырмауды шешеді, map әр элементті түрлендіреді, reduce бір қорытынды мән жинайды.\n\nОсы мысалда алдымен 1000-нан кем емес бағалар алынады. Содан кейін әр баға 10% арзандайды. Соңында бастапқы 0-ге бәрі қосылады. Әр кезеңнің аралық массивін жазу күрделі тізбекті түсінуге көмектеседі.\n\nfilter мен map жаңа массив береді. reduce үшін бастапқы мән жазу бос массив кезінде де болжамды нәтиже алуға мүмкіндік береді.",
                    "Методы массива делят задачу на этапы. filter решает, сохранить ли элемент, map преобразует элементы, reduce собирает одно итоговое значение.\n\nСначала выбираются цены не ниже 1000, затем каждая уменьшается на 10%, после чего они суммируются с начальным 0. Выписывай промежуточный массив после каждого этапа.\n\nfilter и map возвращают новые массивы. Начальное значение reduce позволяет получить определённый результат даже для пустого массива.",
                    "Array methods split a problem into stages. filter decides which items to keep, map transforms each item and reduce accumulates one result.\n\nFirst select prices of at least 1000, then discount each by 10%, then sum them starting at 0. Write the intermediate array after each stage.\n\nfilter and map return new arrays. An initial reduce value gives a defined result even when the array is empty."
                ],
                "code": "const prices = [500, 1000, 2000];\nconst total = prices\n  .filter(price => price >= 1000)\n  .map(price => price * 0.9)\n  .reduce((sum, price) => sum + price, 0);\nconsole.log(total);",
                "output": "2700",
                "reason": [
                    "[1000, 2000] → [900, 1800] → 2700.",
                    "[1000, 2000] → [900, 1800] → 2700.",
                    "[1000, 2000] → [900, 1800] → 2700."
                ],
                "question": [
                    "filter нәтижесінде қандай мән қалады?",
                    "Что остаётся после filter?",
                    "What remains after filter?"
                ],
                "options": [
                    [
                        "[500, 1000, 2000]",
                        "[900, 1800]",
                        "[1000, 2000]"
                    ],
                    [
                        "[500, 1000, 2000]",
                        "[900, 1800]",
                        "[1000, 2000]"
                    ],
                    [
                        "[500, 1000, 2000]",
                        "[900, 1800]",
                        "[1000, 2000]"
                    ]
                ],
                "correct": 2,
                "hint": [
                    "Жеңілдік filter-ден кейін есептеледі.",
                    "Скидка применяется после filter.",
                    "The discount is applied after filter."
                ]
            },
            {
                "title": [
                    "Асинхрондық кезек",
                    "Асинхронная очередь",
                    "Asynchronous scheduling"
                ],
                "theory": [
                    "JavaScript ағымдағы синхрондық кодты алдымен аяқтайды. Promise.then ішіндегі функция microtask кезегіне түседі. setTimeout кері шақыруы кейінгі тапсырма ретінде орындалады.\n\n0 миллисекунд таймері «дәл қазір» дегенді білдірмейді. Ол ағымдағы код біткеннен және microtask кезегі өңделгеннен кейін орындалуға дайын болады.\n\nБұл айырмашылық интерфейс пен желі жауаптарын түсінуге көмектеседі. Кодтағы жол ретімен емес, орындалу кезегімен ойлан. Мысал браузер контекстіне арналған.",
                    "JavaScript сначала завершает текущий синхронный код. Обработчик Promise.then попадает в очередь микрозадач. Обработчик setTimeout выполняется как последующая задача.\n\nТаймер 0 мс не означает «прямо сейчас». Он готов к выполнению после текущего кода и обработки микрозадач.\n\nЭто помогает понимать интерфейсы и сетевые ответы. Рассуждай по очереди исполнения, а не по порядку строк. Пример рассчитан на браузер.",
                    "JavaScript first finishes the current synchronous code. A Promise.then callback enters the microtask queue. A setTimeout callback runs as a later task.\n\nA zero-millisecond timer does not mean immediately. It becomes eligible after current code and pending microtasks have been processed.\n\nThis distinction helps explain interfaces and network responses. Follow execution order rather than line order. This example targets a browser."
                ],
                "code": "console.log(\"A\");\nsetTimeout(() => console.log(\"B\"), 0);\nPromise.resolve().then(() => console.log(\"C\"));\nconsole.log(\"D\");",
                "output": "A D C B",
                "reason": [
                    "A және D синхронды; C microtask; B таймер тапсырмасы.",
                    "A и D синхронные; C — микрозадача; B — таймер.",
                    "A and D are synchronous; C is a microtask; B is the timer task."
                ],
                "question": [
                    "Неге C B-дан бұрын шығады?",
                    "Почему C выводится раньше B?",
                    "Why does C appear before B?"
                ],
                "options": [
                    [
                        "Microtask кезегі келесі таймер тапсырмасынан бұрын өңделеді",
                        "Таймерлер ешқашан орындалмайды",
                        "Promise синхронды іске қосылады"
                    ],
                    [
                        "Микрозадачи обрабатываются перед следующей задачей таймера",
                        "Таймеры никогда не работают",
                        "Promise.then выполняется синхронно"
                    ],
                    [
                        "Microtasks run before the next timer task",
                        "Timers never run",
                        "Promise.then runs synchronously"
                    ]
                ],
                "correct": 0,
                "hint": [
                    "Алдымен тек console.log тұрған синхрондық жолдарды белгіле.",
                    "Сначала отметь синхронные console.log.",
                    "Mark the synchronous console.log calls first."
                ]
            }
        ]
    },
    {
        "id": "html",
        "name": "HTML",
        "badge": "<>",
        "color": "#f6c9af",
        "modules": [
            {
                "title": [
                    "Қолжетімді форма",
                    "Доступная форма",
                    "Accessible forms"
                ],
                "theory": [
                    "Форма тек сыртқы көрініс емес: әр өрістің түсінікті атауы және тексеру ережесі болуы керек. label for мәні input id мәнімен сәйкес келсе, экран оқу құралы оларды байланыстырады.\n\nplaceholder атауды алмастырмайды: мәтін енгізілгенде ол жоғалады. type=\"email\" браузердің негізгі пішім тексеруін қосады, required бос мәнді жіберуге жол бермейді.\n\nБраузер тексеруі сервер тексеруін алмастырмайды. Бұл мысал құрылымды үйретеді; нақты деректерді жіберетін сервер оған қосылмаған.",
                    "Форма — это не только внешний вид: каждому полю нужны понятное имя и правила проверки. Значение label for должно совпадать с input id, чтобы скринридер связывал их.\n\nplaceholder не заменяет подпись: он исчезает при вводе. type=\"email\" включает базовую проверку формата, required запрещает пустое значение.\n\nПроверка браузера не заменяет серверную. Здесь изучается структура; сервер для отправки данных не подключён.",
                    "A form needs more than visual styling: every field needs a clear name and validation rules. Matching label for with input id connects them for assistive technology.\n\nA placeholder is not a label: it disappears when typing. type=\"email\" enables basic format validation and required rejects an empty value.\n\nBrowser validation does not replace server validation. This example teaches structure; no submission backend is attached."
                ],
                "code": "<form>\n  <label for=\"email\">Email</label>\n  <input id=\"email\" name=\"email\" type=\"email\" required>\n  <button type=\"submit\">Send</button>\n</form>",
                "output": "email",
                "reason": [
                    "for=\"email\" және id=\"email\" бірдей болуы керек.",
                    "for=\"email\" и id=\"email\" должны совпадать.",
                    "for=\"email\" must match id=\"email\"."
                ],
                "question": [
                    "placeholder неге label орнына жүрмейді?",
                    "Почему placeholder не заменяет label?",
                    "Why is a placeholder not a label?"
                ],
                "options": [
                    [
                        "Ол міндетті түрде қызыл",
                        "Ол енгізгенде жоғалып, тұрақты атау бермейді",
                        "Ол тек сан қабылдайды"
                    ],
                    [
                        "Он обязательно красный",
                        "Он исчезает при вводе и не даёт постоянного имени",
                        "Он принимает только числа"
                    ],
                    [
                        "It is always red",
                        "It disappears and does not provide a persistent label",
                        "It accepts only numbers"
                    ]
                ],
                "correct": 1,
                "hint": [
                    "Мәтіндік жауапта label байланыстыратын input id мәнін жаз.",
                    "В текстовом ответе укажи id поля, связанного с label.",
                    "For the text answer, enter the input id linked by the label."
                ]
            },
            {
                "title": [
                    "Семантика және пернетақта",
                    "Семантика и клавиатура",
                    "Semantics and keyboard use"
                ],
                "theory": [
                    "Навигация үшін сілтеме, әрекет үшін батырма қолданылады. button Enter және Space арқылы іске қосылады; div элементіне click қосу мұны өздігінен бермейді.\n\nmain, nav және h1 құжаттың мағынасын білдіреді. Қолданушы экран оқу құралы арқылы негізгі бөлімге не тақырыпқа жылдам өте алады. Тақырып деңгейлерін өлшем үшін емес, құрылым үшін таңда.\n\nБірегей id якорь сілтемесінің нақты нысанын көрсетеді. tabindex=\"0\" элементті қалыпты пернетақта ретіне қосады, бірақ дұрыс HTML элементін таңдаудың орнын баспайды.",
                    "Для перехода используй ссылку, для действия — кнопку. button поддерживает Enter и Space; обработчик click на div сам по себе этого не даёт.\n\nmain, nav и h1 описывают смысл документа. Со скринридером можно быстро перейти к основной области или заголовку. Выбирай уровни заголовков по структуре, не по размеру.\n\nУникальный id задаёт цель якорной ссылки. tabindex=\"0\" добавляет элемент в клавиатурный порядок, но не заменяет правильный HTML-элемент.",
                    "Use links for navigation and buttons for actions. button supports Enter and Space; adding click to a div does not provide that automatically.\n\nmain, nav and h1 describe document meaning. Screen-reader users can jump to a landmark or heading. Choose heading levels for structure, not font size.\n\nA unique id identifies an anchor target. tabindex=\"0\" adds an element to keyboard order but does not replace choosing the correct HTML element."
                ],
                "code": "<a href=\"#lesson\">Go to lesson</a>\n<main id=\"lesson\">\n  <h1>Algorithms</h1>\n  <button type=\"button\">Check answer</button>\n</main>",
                "output": "lesson",
                "reason": [
                    "#lesson сілтемесі id=\"lesson\" бар main элементіне апарады.",
                    "Ссылка #lesson ведёт к main с id=\"lesson\".",
                    "The #lesson link targets main with id=\"lesson\"."
                ],
                "question": [
                    "Жауапты тексеруге қай элемент дұрыс?",
                    "Какой элемент подходит для проверки ответа?",
                    "Which element should check an answer?"
                ],
                "options": [
                    [
                        "div",
                        "span",
                        "button"
                    ],
                    [
                        "div",
                        "span",
                        "button"
                    ],
                    [
                        "div",
                        "span",
                        "button"
                    ]
                ],
                "correct": 2,
                "hint": [
                    "Мәтіндік жауап: якорь нысанының id мәні, # таңбасынсыз.",
                    "Текстовый ответ: id цели без #.",
                    "Text answer: the target id without #."
                ]
            }
        ]
    },
    {
        "id": "css",
        "name": "CSS",
        "badge": "{ }",
        "color": "#b8d9ff",
        "modules": [
            {
                "title": [
                    "Box model және өлшем",
                    "Box model и размеры",
                    "The box model and sizing"
                ],
                "theory": [
                    "Элемент ені тек мазмұннан тұрмауы мүмкін: padding ішкі бос орын, border шекара, margin сыртқы аралық. box-sizing ені қай бөліктерді қамтитынын анықтайды.\n\ncontent-box кезінде берілген width — мазмұн ені. padding пен border оған қосылады. border-box кезінде width мазмұнды, padding пен border-ді бірге қамтиды.\n\nТөмендегі мысалда сыртқы енді есепте. Бұл есепке margin кірмейді. Контейнерге сыймау мәселесін тек width мәнін азайтып емес, box model арқылы талда.",
                    "Ширина элемента может включать не только содержимое: padding — внутренний отступ, border — рамка, margin — внешний отступ. box-sizing определяет состав заданной ширины.\n\nПри content-box width задаёт содержимое, padding и border прибавляются. При border-box ширина уже включает эти части.\n\nРассчитай внешнюю ширину примера без margin. Проблему переполнения лучше понимать через box model, а не случайное уменьшение width.",
                    "An element includes content, padding, border and margin. box-sizing determines which parts are included in its declared width.\n\nWith content-box, width describes content only; padding and borders are added. With border-box, width already includes content, padding and borders.\n\nCalculate the example’s outer width, excluding margin. Understand overflow using the box model instead of randomly reducing width."
                ],
                "code": ".card {\n  box-sizing: content-box;\n  width: 240px;\n  padding: 20px;\n  border: 2px solid;\n}",
                "output": "284",
                "reason": [
                    "240 + 20×2 + 2×2 = 284 px.",
                    "240 + 20×2 + 2×2 = 284 px.",
                    "240 + 20×2 + 2×2 = 284 px."
                ],
                "question": [
                    "border-box болса сыртқы ені неше px?",
                    "Какова внешняя ширина при border-box?",
                    "What is the outer width with border-box?"
                ],
                "options": [
                    [
                        "240",
                        "280",
                        "284"
                    ],
                    [
                        "240",
                        "280",
                        "284"
                    ],
                    [
                        "240",
                        "280",
                        "284"
                    ]
                ],
                "correct": 0,
                "hint": [
                    "Мәтіндік жауапта content-box үшін санды ғана жаз.",
                    "Введи только число для content-box.",
                    "Enter only the number for content-box."
                ]
            },
            {
                "title": [
                    "Каскад және specificity",
                    "Каскад и специфичность",
                    "Cascade and specificity"
                ],
                "theory": [
                    "Бір элементке бірнеше ереже әсер еткенде каскад жеңімпазды анықтайды. Бірдей origin, маңыздылық және layer ішінде specificity салыстырылады.\n\nID селекторы класс селекторынан, класс тег селекторынан басым. Specificity тең болса, кейінгі ереже жеңеді. !important-ты себепсіз қосу стильдерді басқаруды қиындатады.\n\nТөменде барлық ереже бір стиль контекстінде. Элементте class=\"card\" және id=\"hero\" бар. Сондықтан жол ретіне ғана қарап шешпе.",
                    "Когда действуют несколько правил, каскад выбирает победителя. При одинаковом origin, важности и слое сравнивается специфичность.\n\nID сильнее класса, класс сильнее селектора тега. При равной специфичности выигрывает более позднее правило. Не добавляй !important без причины.\n\nНиже правила находятся в одном контексте. У элемента есть class=\"card\" и id=\"hero\". Не ориентируйся только на порядок строк.",
                    "When multiple rules apply, the cascade selects a winner. Within the same origin, importance and layer, specificity is compared.\n\nAn ID selector outranks a class, and a class outranks a type selector. Equal specificity is resolved by source order. Avoid adding !important without a reason.\n\nAll rules below share a context. The element has class=\"card\" and id=\"hero\". Do not decide by line order alone."
                ],
                "code": "/* <div id=\"hero\" class=\"card\">Text</div> */\n.card { color: green; }\n#hero { color: purple; }\ndiv { color: blue; }",
                "output": "purple",
                "reason": [
                    "#hero ID селекторы .card және div селекторларынан басым.",
                    "#hero имеет приоритет над .card и div.",
                    "#hero outranks .card and div."
                ],
                "question": [
                    "Specificity тең болса не шешеді?",
                    "Что решает при равной специфичности?",
                    "What resolves equal specificity?"
                ],
                "options": [
                    [
                        "Әріп саны",
                        "Ережелердің жазылу реті",
                        "Элемент биіктігі"
                    ],
                    [
                        "Число букв",
                        "Порядок правил в исходнике",
                        "Высота элемента"
                    ],
                    [
                        "Number of letters",
                        "Source order",
                        "Element height"
                    ]
                ],
                "correct": 1,
                "hint": [
                    "Мәтіндік жауап: соңғы түс атауын ағылшынша жаз.",
                    "Введи итоговый цвет по-английски.",
                    "Enter the resulting color name."
                ]
            }
        ]
    },
    {
        "id": "java",
        "name": "Java",
        "badge": "JV",
        "color": "#f9c7ca",
        "modules": [
            {
                "title": [
                    "Бүтін бөлу және түрлендіру",
                    "Целочисленное деление и приведение",
                    "Integer division and casting"
                ],
                "theory": [
                    "Java-да операцияға қатысатын мәндердің типі есептеу тәсіліне әсер етеді. Екі int бөлінсе, нәтиже бүтін сан болады; бөлшек бөлігі сақталмайды.\n\nНәтижені кейін double айнымалысына жазу жоғалған бөлшекті қайтармайды. Бөлуден бұрын бір операндты double-ға түрлендіру керек.\n\nОрташа балл есептегенде осы айырмашылық жиі қате туғызады. Код үзіндісі Java әдісінің ішінде орындалады.",
                    "Типы операндов влияют на вычисление. При делении двух int результат целочисленный: дробная часть отбрасывается.\n\nПрисваивание результата переменной double не восстанавливает потерянную дробь. Нужно привести один операнд к double до деления.\n\nЭто частая ошибка при вычислении среднего балла. Фрагмент выполняется внутри метода Java.",
                    "Operand types affect computation. Dividing two int values performs integer division, discarding the fractional part.\n\nAssigning that result to double does not restore the lost fraction. Cast one operand to double before dividing.\n\nThis often causes incorrect averages. The snippet belongs inside a Java method."
                ],
                "code": "int total = 17;\nint count = 4;\ndouble average = (double) total / count;\nSystem.out.println(average);",
                "output": "4.25",
                "reason": [
                    "17 алдымен 17.0 болады; 17.0 / 4 = 4.25.",
                    "17 сначала превращается в 17.0; 17.0 / 4 = 4.25.",
                    "17 becomes 17.0 first; 17.0 / 4 = 4.25."
                ],
                "question": [
                    "(double) болмаса average мәні қандай?",
                    "Что будет в average без (double)?",
                    "What is average without the cast?"
                ],
                "options": [
                    [
                        "4.25",
                        "5.0",
                        "4.0"
                    ],
                    [
                        "4.25",
                        "5.0",
                        "4.0"
                    ],
                    [
                        "4.25",
                        "5.0",
                        "4.0"
                    ]
                ],
                "correct": 2,
                "hint": [
                    "Тип түрлендіру бөлуден бұрын орындалады.",
                    "Приведение выполняется до деления.",
                    "The cast happens before division."
                ]
            },
            {
                "title": [
                    "Массив пен шартты санау",
                    "Массив и условный подсчёт",
                    "Arrays and conditional counting"
                ],
                "theory": [
                    "for-each массив элементтерін бірінен кейін бірін береді. Индекс қажет болмаса, бұл тәсіл шекара қатесін азайтады.\n\n&& екі шарттың да дұрыс болуын талап етеді. Төменде 50 мен 90 аралығындағы, шекаралары кіретін баллдар саналады. count — баллдардың қосындысы емес, сәйкес элементтер саны.\n\nТексерулерге дәл 50, дәл 90, шектен төмен және жоғары мәндерді қосуды үйрен.",
                    "for-each перебирает элементы массива. Когда индекс не нужен, он снижает риск ошибки границ.\n\n&& требует истинности обоих условий. Здесь считаются баллы от 50 до 90 включительно. count — число подходящих элементов, не сумма баллов.\n\nПроверяй значения ровно 50, ровно 90, ниже и выше границ.",
                    "A for-each loop visits array elements. When you do not need indexes, it reduces boundary mistakes.\n\n&& requires both conditions to be true. This example counts scores from 50 through 90, inclusive. count is the number of matching items, not the sum of scores.\n\nTest exact boundaries, values below them and values above them."
                ],
                "code": "int[] scores = {49, 50, 70, 90, 91};\nint count = 0;\nfor (int score : scores) {\n    if (score >= 50 && score <= 90) count++;\n}\nSystem.out.println(count);",
                "output": "3",
                "reason": [
                    "50, 70, 90 сәйкес келеді: 3 элемент.",
                    "Подходят 50, 70, 90: 3 элемента.",
                    "50, 70 and 90 match: 3 elements."
                ],
                "question": [
                    "&& орнына || қойсақ не өзгереді?",
                    "Что изменится при замене && на ||?",
                    "What changes if && becomes ||?"
                ],
                "options": [
                    [
                        "Барлық бес сан шарттан өтеді",
                        "Тек 70 қалады",
                        "Ешбір сан өтпейді"
                    ],
                    [
                        "Пройдут все пять чисел",
                        "Останется только 70",
                        "Ни одно число не пройдёт"
                    ],
                    [
                        "All five values pass",
                        "Only 70 remains",
                        "No value passes"
                    ]
                ],
                "correct": 0,
                "hint": [
                    "Әр балл үшін екі салыстыруды бөлек тексер.",
                    "Проверь оба сравнения для каждого балла.",
                    "Check both comparisons for each score."
                ]
            }
        ]
    },
    {
        "id": "cpp",
        "name": "C++",
        "badge": "C++",
        "color": "#c8d0ff",
        "modules": [
            {
                "title": [
                    "Көшірме және сілтеме",
                    "Копия и ссылка",
                    "Copies and references"
                ],
                "theory": [
                    "Функцияға int мәнін беру әдетте көшірме жасайды. Параметрді өзгерту бастапқы айнымалыны өзгертпейді. int& бастапқы айнымалыға сілтеме береді.\n\nСілтеме арқылы өзгерту функциядан тыс та көрінеді. Сондықтан функцияның мәнді тек оқитынын не өзгертетінін анық көрсету маңызды.\n\nБұл толық C++ мысалы екі тәсілді салыстырады. Алдымен a мәнін, кейін b мәнін бақыла. Үлкен объектіні тек оқу үшін const сілтеме бөлек пайдалы тәсіл болады.",
                    "Передача int по значению создаёт копию. Изменение параметра не меняет исходную переменную. int& передаёт ссылку на исходное значение.\n\nИзменение через ссылку видно снаружи функции. Поэтому важно понимать, читает функция аргумент или меняет его.\n\nПолный пример сравнивает оба способа. Отслеживай a и b отдельно. Для чтения больших объектов также полезны const-ссылки.",
                    "Passing an int by value creates a copy. Changing the parameter does not change the original variable. int& provides a reference to the original.\n\nChanges through a reference are visible outside the function. Understand whether a function reads or modifies its argument.\n\nThis complete example compares both approaches. Track a and b separately. Const references are also useful for reading large objects."
                ],
                "code": "#include <iostream>\nvoid byValue(int x) { x += 5; }\nvoid byReference(int& x) { x += 5; }\nint main() {\n    int a = 10, b = 10;\n    byValue(a);\n    byReference(b);\n    std::cout << a << \" \" << b;\n}",
                "output": "10 15",
                "reason": [
                    "a көшірмесі ғана өзгерді; b бастапқы мәні 15 болды.",
                    "У a изменилась только копия; исходное b стало 15.",
                    "Only a copy of a changed; the original b became 15."
                ],
                "question": [
                    "Бастапқы мәнді өзгерткен белгі қайсы?",
                    "Какое обозначение позволило изменить исходное значение?",
                    "Which notation enabled changing the original?"
                ],
                "options": [
                    [
                        "int",
                        "int&",
                        "void"
                    ],
                    [
                        "int",
                        "int&",
                        "void"
                    ],
                    [
                        "int",
                        "int&",
                        "void"
                    ]
                ],
                "correct": 1,
                "hint": [
                    "byValue ішіндегі x пен main ішіндегі a бір айнымалы емес.",
                    "x в byValue и a в main — не одна переменная.",
                    "x in byValue and a in main are not the same variable."
                ]
            },
            {
                "title": [
                    "Вектор шекарасы",
                    "Границы вектора",
                    "Vector boundaries"
                ],
                "theory": [
                    "Вектордың size() мәні элемент санын береді. Соңғы индекс size()-1, себебі индекстеу 0-ден басталады.\n\nЦиклде i < size() қолдану соңғы заңды индексте тоқтайды. <= қолдану артық бір элементке қол жеткізуге әкеледі. operator[] шекараны автоматты тексермейді.\n\nМысалда жұп индекстердегі элементтер қосылады. Индекстің жұп болуы мен элементтің жұп болуы екі бөлек шарт екенін ажырат.",
                    "size() возвращает число элементов вектора. Последний индекс равен size()-1, потому что индексация начинается с 0.\n\ni < size() останавливается на последнем допустимом индексе. <= обращается ещё к одному элементу за границей. operator[] автоматически границы не проверяет.\n\nЗдесь суммируются элементы на чётных индексах. Чётный индекс и чётное значение — разные условия.",
                    "size() returns the number of vector elements. The last index is size()-1 because indexing begins at 0.\n\ni < size() stays within the valid range. Using <= accesses one position beyond it. operator[] does not automatically check bounds.\n\nThis example adds elements at even indexes. An even index and an even value are different conditions."
                ],
                "code": "#include <vector>\n#include <iostream>\nint main() {\n    std::vector<int> v = {5, 8, 3, 6, 9};\n    int sum = 0;\n    for (std::size_t i = 0; i < v.size(); i++) {\n        if (i % 2 == 0) sum += v[i];\n    }\n    std::cout << sum;\n}",
                "output": "17",
                "reason": [
                    "0, 2, 4 индекстері: 5 + 3 + 9 = 17.",
                    "Индексы 0, 2, 4: 5 + 3 + 9 = 17.",
                    "Indexes 0, 2, 4: 5 + 3 + 9 = 17."
                ],
                "question": [
                    "Қауіпсіз цикл шекарасы қайсы?",
                    "Какая граница цикла верна?",
                    "Which loop bound is correct?"
                ],
                "options": [
                    [
                        "i <= v.size()",
                        "i > v.size()",
                        "i < v.size()"
                    ],
                    [
                        "i <= v.size()",
                        "i > v.size()",
                        "i < v.size()"
                    ],
                    [
                        "i <= v.size()",
                        "i > v.size()",
                        "i < v.size()"
                    ]
                ],
                "correct": 2,
                "hint": [
                    "Алдымен мәндерді емес, индекстерді 0-ден бастап жаз.",
                    "Сначала выпиши индексы с нуля, не значения.",
                    "List indexes from zero before looking at values."
                ]
            }
        ]
    },
    {
        "id": "csharp",
        "name": "C#",
        "badge": "C#",
        "color": "#dbc7ff",
        "modules": [
            {
                "title": [
                    "LINQ: сүзу және проекция",
                    "LINQ: фильтрация и проекция",
                    "LINQ: filtering and projection"
                ],
                "theory": [
                    "LINQ тізбектерді декларативті өңдеуге көмектеседі. Where элементтерді сүзеді, Select түрлендіреді, Sum қорытынды санды есептейді.\n\nЛямбдадағы n әр элементті білдіреді. Мысалда алдымен 3-тен үлкен сандар алынады, содан кейін әрқайсысы квадратталады. Операциялар ретін ауыстыру нәтижені өзгертуі мүмкін.\n\nБұл мысал қазіргі C# жобасында top-level statements түрінде орындала алады. using System.Linq әдістерін қолжетімді етеді.",
                    "LINQ помогает декларативно обрабатывать последовательности. Where фильтрует, Select преобразует, Sum вычисляет сумму.\n\nn в лямбде обозначает очередной элемент. Сначала выбираются числа больше 3, затем каждое возводится в квадрат. Изменение порядка операций может изменить результат.\n\nПример подходит для top-level statements современного проекта C#. using System.Linq подключает нужные методы.",
                    "LINQ processes sequences declaratively. Where filters, Select transforms and Sum totals the results.\n\nn in the lambda represents each element. First select numbers greater than 3, then square them. Changing operation order can change the result.\n\nThis example can run as top-level statements in a modern C# project. using System.Linq provides these methods."
                ],
                "code": "using System;\nusing System.Linq;\nint[] numbers = {2, 3, 4, 5};\nint total = numbers.Where(n => n > 3)\n                   .Select(n => n * n)\n                   .Sum();\nConsole.WriteLine(total);",
                "output": "41",
                "reason": [
                    "[4, 5] → [16, 25] → 41.",
                    "[4, 5] → [16, 25] → 41.",
                    "[4, 5] → [16, 25] → 41."
                ],
                "question": [
                    "Select не істейді?",
                    "Что делает Select?",
                    "What does Select do?"
                ],
                "options": [
                    [
                        "Әр элементті түрлендіреді",
                        "Міндетті түрде сұрыптайды",
                        "Тек бірінші элементті береді"
                    ],
                    [
                        "Преобразует каждый элемент",
                        "Всегда сортирует",
                        "Возвращает только первый элемент"
                    ],
                    [
                        "Transforms each element",
                        "Always sorts",
                        "Returns only the first element"
                    ]
                ],
                "correct": 0,
                "hint": [
                    "Where нәтижесін бөлек тізім ретінде елестет.",
                    "Представь результат Where отдельным списком.",
                    "Imagine the Where result as a separate list."
                ]
            },
            {
                "title": [
                    "null және әдепкі мән",
                    "null и значение по умолчанию",
                    "null and fallback values"
                ],
                "theory": [
                    "null — мәннің жоқтығын білдіреді; ол бос жолмен бірдей емес. ?. операторы объект null болмаса ғана мүшесін оқиды.\n\n?? сол жақ null болғанда оң жақтағы әдепкі мәнді алады. Осы екеуін бірге пайдалану null мәніне мүшені тікелей шақыру қатесін болдырмайды.\n\nМысалда name жоқ, сондықтан Length алынбайды. Ал name бос жол болса, Length 0 болар еді — бірақ null арқылы емес, нақты өлшем ретінде.",
                    "null означает отсутствие значения и отличается от пустой строки. ?. читает член только если объект не null.\n\n?? берёт правое значение, когда левое равно null. Вместе они предотвращают обращение к члену отсутствующего объекта.\n\nВ примере name отсутствует, поэтому Length не читается. Для пустой строки Length тоже был бы 0, но уже как реальная длина.",
                    "null means no value and differs from an empty string. ?. accesses a member only when the object is not null.\n\n?? uses the right-hand fallback when the left value is null. Together they avoid accessing a member on a missing object.\n\nHere name is missing, so Length is not read. An empty string would also have length 0, but as an actual length rather than a fallback."
                ],
                "code": "#nullable enable\nusing System;\nstring? name = null;\nint length = name?.Length ?? 0;\nConsole.WriteLine(length);",
                "output": "0",
                "reason": [
                    "name?.Length null береді; ?? 0 нәтижені 0 етеді.",
                    "name?.Length даёт null; ?? 0 выбирает 0.",
                    "name?.Length yields null; ?? 0 chooses 0."
                ],
                "question": [
                    "?? қашан оң жақ мәнді алады?",
                    "Когда ?? выбирает правое значение?",
                    "When does ?? choose the right value?"
                ],
                "options": [
                    [
                        "Сол жақ әрқашан 0 болса",
                        "Сол жақ null болса",
                        "Жол ұзын болса"
                    ],
                    [
                        "Всегда когда слева 0",
                        "Когда слева null",
                        "Когда строка длинная"
                    ],
                    [
                        "Whenever the left is 0",
                        "When the left is null",
                        "When the string is long"
                    ]
                ],
                "correct": 1,
                "hint": [
                    "null-ды 0 және бос жолдан ажырат.",
                    "Отличай null от 0 и пустой строки.",
                    "Distinguish null from 0 and an empty string."
                ]
            }
        ]
    },
    {
        "id": "sql",
        "name": "SQL",
        "badge": "SQL",
        "color": "#b5e4dc",
        "modules": [
            {
                "title": [
                    "GROUP BY, WHERE және HAVING",
                    "GROUP BY, WHERE и HAVING",
                    "GROUP BY, WHERE and HAVING"
                ],
                "theory": [
                    "SQL-де WHERE жеке жолдарды топтастыруға дейін сүзеді. GROUP BY бірдей мәндерді топқа біріктіреді. HAVING дайын топтардың агрегат нәтижесін тексереді.\n\nSUM(amount) әр топтың жалпы сомасын есептейді. Мысал деректері: A қаласы — 100, 150; B қаласы — 80. HAVING шарты 200-ден жоғары топты ғана қалдырады.\n\nЖол саны мен соманы шатастырма: COUNT(*) жолдарды, SUM(amount) мәндерді қосады. Мұнда нақты базаға сұрау жіберілмейді, нәтижені қолмен талдайсың.",
                    "WHERE фильтрует отдельные строки до группировки. GROUP BY объединяет одинаковые значения. HAVING проверяет агрегаты готовых групп.\n\nSUM(amount) вычисляет сумму группы. Данные примера: город A — 100 и 150; город B — 80. HAVING оставляет только сумму больше 200.\n\nНе путай число строк и сумму: COUNT(*) считает строки, SUM(amount) складывает значения. Здесь результат анализируется вручную, без подключения к базе.",
                    "WHERE filters individual rows before grouping. GROUP BY combines equal values. HAVING checks aggregates of completed groups.\n\nSUM(amount) totals each group. Example data: city A has 100 and 150; city B has 80. HAVING keeps only totals above 200.\n\nDo not confuse row count with total amount: COUNT(*) counts rows and SUM(amount) adds values. Here you trace the result without a live database."
                ],
                "code": "-- sales(city, amount): (A,100), (A,150), (B,80)\nSELECT city, SUM(amount) AS total\nFROM sales\nGROUP BY city\nHAVING SUM(amount) > 200;",
                "output": "A 250",
                "reason": [
                    "A: 100+150=250 өтеді; B:80 өтпейді.",
                    "A: 100+150=250 проходит; B:80 — нет.",
                    "A: 100+150=250 passes; B:80 does not."
                ],
                "question": [
                    "Топтың сомасын қай бөлім сүзеді?",
                    "Что фильтрует сумму группы?",
                    "Which clause filters a group total?"
                ],
                "options": [
                    [
                        "WHERE",
                        "ORDER BY",
                        "HAVING"
                    ],
                    [
                        "WHERE",
                        "ORDER BY",
                        "HAVING"
                    ],
                    [
                        "WHERE",
                        "ORDER BY",
                        "HAVING"
                    ]
                ],
                "correct": 2,
                "hint": [
                    "Мәтіндік жауап: қала мен соманы бос орынмен жаз.",
                    "Введи город и сумму через пробел.",
                    "Enter the city and total separated by a space."
                ]
            },
            {
                "title": [
                    "LEFT JOIN және NULL",
                    "LEFT JOIN и NULL",
                    "LEFT JOIN and NULL"
                ],
                "theory": [
                    "LEFT JOIN сол жақ кестенің барлық жолын сақтайды. Сәйкестік болмаса, оң жақ кесте бағандары NULL болады. INNER JOIN тек сәйкес жұптарды қалдырады.\n\nБір пайдаланушыда бірнеше тапсырыс болса, JOIN нәтижесінде бірнеше жол пайда болады. Сондықтан пайдаланушы саны мен нәтиже жолының саны бірдей болмауы мүмкін.\n\nМысалда 1-пайдаланушының екі тапсырысы, 2-пайдаланушының тапсырысы жоқ. COUNT(o.id) NULL-ды санамайды; COUNT(*) сақталған жолды санайды. Осы айырмашылыққа назар аудар.",
                    "LEFT JOIN сохраняет все строки левой таблицы. При отсутствии совпадения столбцы справа становятся NULL. INNER JOIN оставляет только совпавшие пары.\n\nНесколько заказов одного пользователя создают несколько строк результата. Поэтому число пользователей и строк JOIN может различаться.\n\nУ пользователя 1 два заказа, у пользователя 2 нет заказов. COUNT(o.id) не считает NULL, а COUNT(*) считает сохранённую строку. Это важное различие.",
                    "LEFT JOIN keeps every row from the left table. Without a match, right-side columns become NULL. INNER JOIN keeps only matching pairs.\n\nMultiple orders for one user produce multiple result rows. The number of users and joined rows can therefore differ.\n\nUser 1 has two orders; user 2 has none. COUNT(o.id) ignores NULL, while COUNT(*) counts the preserved row. Notice this distinction."
                ],
                "code": "-- users(id): (1), (2)\n-- orders(id,user_id): (10,1), (11,1)\nSELECT u.id, COUNT(o.id) AS n\nFROM users u\nLEFT JOIN orders o ON o.user_id = u.id\nGROUP BY u.id\nORDER BY u.id;",
                "output": "1 2; 2 0",
                "reason": [
                    "1-пайдаланушы: 2 тапсырыс. 2-пайдаланушы: NULL саналмайды, 0.",
                    "Пользователь 1: 2 заказа. Пользователь 2: NULL не считается, 0.",
                    "User 1: 2 orders. User 2: NULL is ignored, giving 0."
                ],
                "question": [
                    "2-пайдаланушы үшін COUNT(*) не береді?",
                    "Что вернёт COUNT(*) для пользователя 2?",
                    "What would COUNT(*) return for user 2?"
                ],
                "options": [
                    [
                        "1",
                        "0",
                        "2"
                    ],
                    [
                        "1",
                        "0",
                        "2"
                    ],
                    [
                        "1",
                        "0",
                        "2"
                    ]
                ],
                "correct": 0,
                "hint": [
                    "Мәтіндік жауап: екі жолды 1 2; 2 0 түрінде жаз.",
                    "Формат двух строк: 1 2; 2 0.",
                    "Format the two rows as: 1 2; 2 0."
                ]
            }
        ]
    }
];
