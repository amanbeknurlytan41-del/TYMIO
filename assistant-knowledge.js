// Curated answers in Kazakh, Russian and English. This is not a remote AI model.
window.AivaKnowledge = [
    {
        id: 'welcome',
        pattern: /сәлем|салем|привет|здравств|\bhello\b|\bhi\b/i,
        title: [
            'Сәлем!', 'Привет!', 'Hello!'
        ],
        answers: [
            'Мен AIVA, сенің IT оқу көмекшіңмін. Python, JavaScript, HTML, CSS, Java, C++, C# және SQL негіздерін түсіндіремін.\n\n«Цикл деген не?» немесе «Ойынға көмек» деп жаз. Жауап тілін чаттың жоғарғы жағынан таңдауға болады.',
            'Я AIVA, твой помощник по изучению IT. Объясняю основы Python, JavaScript, HTML, CSS, Java, C++, C# и SQL.\n\nНапиши «Что такое цикл?» или «Помоги с игрой». Язык ответа можно выбрать вверху чата.',
            'I am AIVA, your IT learning assistant. I explain the basics of Python, JavaScript, HTML, CSS, Java, C++, C# and SQL.\n\nAsk “What is a loop?” or “Help with the game”. Choose the response language at the top of the chat.'
        ]
    },
    {
        id: 'thanks',
        pattern: /рахмет|рақмет|спасибо|благодар|thank/i,
        title: [
            'Жарайсың', 'Продолжай', 'Keep going'
        ],
        answers: [
            'Оқуыңа сәттілік! Келесі қадам: код мысалындағы бір мәнді өзгерт те, нәтижені алдын ала болжап көр.',
            'Успехов в учёбе! Следующий шаг: измени одно значение в примере и попробуй предсказать результат.',
            'Good luck learning! Next step: change one value in an example and try to predict the result.'
        ]
    },
    {
        id: 'game',
        pattern: /ойын|робот|игр|robot|game|маршрут|route/i,
        title: [
            'Ойынға көмек', 'Помощь с игрой', 'Game help'
        ],
        answers: [
            "Code Quest 2.0 ойынында 8 карта бар. Барлық кристалды және кілтті жинап, жұлдызға жет. Кілтсіз есік жабық. Блок пен қадам шегін бақыла. Repeat бір бағыт үлгісін 1–6 рет қайталайды. U жоғары, D төмен, L солға, R оңға. Мысалы, R R U U үлгісі ×3 — үш рет оңға-оңға-жоғары-жоғары. «Бір қадам» қатені табуға көмектеседі.",
            "В Code Quest 2.0 восемь карт. Собери все кристаллы и ключ, затем дойди до звезды. Без ключа дверь закрыта. Следи за лимитом блоков и шагов. Repeat повторяет шаблон 1–6 раз. U вверх, D вниз, L влево, R вправо. Например R R U U ×3 повторяет пару шагов вправо и вверх три раза. «Один шаг» помогает отладить маршрут.",
            "Code Quest 2.0 has eight maps. Collect every crystal and the key, then reach the star. Doors require the key. Watch block and step limits. Repeat repeats a pattern 1–6 times. U is up, D down, L left, R right. For example, R R U U ×3 repeats two right steps and two up steps three times. Step mode helps debug the route."
        ]
    },
    {
        id: 'choice',
        pattern: /қай тіл|таңда|выбрать|какой язык|which language|choose/i,
        title: [
            'Тілді таңдау', 'Выбор языка', 'Choosing a language'
        ],
        answers: [
            'Мақсатыңа қарай таңда:\n• Алғашқы код пен автоматтандыру — Python.\n• Беттің құрылымы — HTML.\n• Дизайн — CSS.\n• Батырмалар мен веб-ойындар — JavaScript.\n• Деректер қоры — SQL.\n\nБастапқы жол: Python → айнымалы → шарт → цикл. HTML мен CSS — веб-құрылым мен стильге арналған тілдер.',
            'Выбирай по цели:\n• Первые программы и автоматизация — Python.\n• Структура страницы — HTML.\n• Дизайн — CSS.\n• Кнопки и веб-игры — JavaScript.\n• Базы данных — SQL.\n\nНачни с Python: переменные → условия → циклы. HTML и CSS предназначены для разметки и оформления.',
            'Choose by your goal:\n• First programs and automation: Python.\n• Page structure: HTML.\n• Design: CSS.\n• Interactive buttons and web games: JavaScript.\n• Databases: SQL.\n\nStart with Python: variables → conditions → loops. HTML and CSS describe page structure and styling.'
        ]
    },
    {
        id: 'errors',
        pattern: /қате|error|ошиб|debug|exception/i,
        title: [
            'Қатені іздеу', 'Поиск ошибки', 'Finding an error'
        ],
        answers: [
            'Қатені тексеру реті:\n1. Хабарламадағы жол нөмірін қара.\n2. Жақша мен тырнақшалар жабылған ба?\n3. Python-да if және for соңында : бар ма?\n4. Ішкі кодта шегініс бар ма?\n5. Айнымалы алдын ала жарияланған ба?\n\nМен кодты орындамаймын және кез келген қатені талдай алмаймын. Бұл — бастапқы тексеру тізімі.',
            'Порядок проверки ошибки:\n1. Найди номер строки в сообщении.\n2. Закрыты ли скобки и кавычки?\n3. Есть ли : после if и for в Python?\n4. Есть ли отступ внутри блока?\n5. Объявлена ли переменная до использования?\n\nЯ не выполняю код и не анализирую произвольные ошибки. Это начальная проверка.',
            'Check errors in this order:\n1. Find the reported line number.\n2. Check closing brackets and quotes.\n3. In Python, check for : after if and for.\n4. Check indentation inside a block.\n5. Check that variables are defined before use.\n\nI do not execute code or analyze arbitrary errors. This is a starting checklist.'
        ]
    },
    {
        id: 'loops',
        pattern: /цикл|\bfor\b|\bwhile\b|loop|range|қайталау/i,
        title: [
            'Циклдер', 'Циклы', 'Loops'
        ],
        code: 'for i in range(3):\n    print("Go!")',
        answers: [
            'Цикл бір әрекетті бірнеше рет қайталайды. range(3) үш мән береді: 0, 1, 2. Сондықтан төмендегі код Go! сөзін үш рет шығарады.\n\nprint жолының алдындағы төрт бос орын оның циклге тиесілі екенін көрсетеді.\nТапсырма: range(5) қолдансаң, неше рет шығады? Жауабы: 5 рет.',
            'Цикл повторяет действие. range(3) даёт три значения: 0, 1, 2. Поэтому пример ниже выводит Go! три раза.\n\nЧетыре пробела перед print обозначают тело цикла.\nЗадание: сколько повторений даст range(5)? Ответ: 5.',
            'A loop repeats an action. range(3) produces three values: 0, 1, 2. The example below prints Go! three times.\n\nThe four spaces before print mark the loop body.\nExercise: how many repetitions does range(5) produce? Answer: 5.'
        ]
    },
    {
        id: 'variables',
        pattern: /айнымалы|переменн|variable|\blet\b|\bvar\b/i,
        title: [
            'Айнымалы', 'Переменная', 'Variable'
        ],
        code: 'name = "Aina"\nage = 16\nprint(name)',
        answers: [
            'Айнымалы — мән сақтайтын атау. Мысалда name мәтінді, age бүтін санды сақтайды. print(name) Aina деп шығарады.\n\n= мәнді меншіктейді, == екі мәнді салыстырады. Тапсырма: name мәнін өз атыңа өзгерт.',
            'Переменная — имя, которое хранит значение. В примере name хранит текст, а age — целое число. print(name) выводит Aina.\n\n= присваивает значение, == сравнивает два значения. Задание: замени name своим именем.',
            'A variable is a name that stores a value. Here name stores text and age stores an integer. print(name) displays Aina.\n\n= assigns a value; == compares two values. Exercise: change name to your own name.'
        ]
    },
    {
        id: 'conditions',
        pattern: /шарт|услов|\bif\b|\belse\b|condition/i,
        title: [
            'Шарт', 'Условие', 'Condition'
        ],
        code: 'score = 7\nif score >= 5:\n    print("Pass")\nelse:\n    print("Try again")',
        answers: [
            'Шарт бағдарламаға шешім қабылдауға көмектеседі. 7 саны 5-тен үлкен болғандықтан, Pass шығады. score = 3 болса, Try again шығады.\n\n>= үлкен немесе тең екенін тексереді. : және шегіністерді ұмытпа.',
            'Условие помогает программе принять решение. Поскольку 7 больше 5, выводится Pass. При score = 3 выводится Try again.\n\n>= означает «больше или равно». Не забывай : и отступы.',
            'A condition lets a program make a decision. Since 7 is greater than 5, the output is Pass. With score = 3, it prints Try again.\n\n>= means greater than or equal to. Remember the colons and indentation.'
        ]
    },
    {
        id: 'functions',
        pattern: /функци|function|\bdef\b|return/i,
        title: [
            'Функция', 'Функция', 'Function'
        ],
        code: 'def greet(name):\n    return "Hello, " + name\n\nprint(greet("Aina"))',
        answers: [
            'Функция — атауы бар, қайта шақырылатын код бөлігі. name — кіріс параметрі. return нәтижені қайтарады. Мысал Hello, Aina деп шығарады.\n\nФункцияны анықтау оны бірден орындамайды: greet("Aina") оны шақырады.',
            'Функция — именованный блок кода, который можно вызывать повторно. name — входной параметр. return возвращает результат. Пример выводит Hello, Aina.\n\nОпределение не запускает функцию: вызов greet("Aina") запускает её.',
            'A function is a named block of reusable code. name is an input parameter. return gives back the result. This example prints Hello, Aina.\n\nDefining a function does not run it; greet("Aina") calls it.'
        ]
    },
    {
        id: 'lists',
        pattern: /тізім|список|\blist\b|массив|array/i,
        title: [
            'Тізім', 'Список', 'List'
        ],
        code: 'colors = ["red", "green", "blue"]\nprint(colors[0])\nprint(len(colors))',
        answers: [
            'Тізім бірнеше мәнді бірге сақтайды. Python-да индекс 0-ден басталады: colors[0] — red. len(colors) элементтер санын, яғни 3 санын береді.\n\nСоңғы элементтің индексі — 2. colors[3] сұрау бұл тізім үшін қате болады.',
            'Список хранит несколько значений. Индексы Python начинаются с 0: colors[0] — red. len(colors) возвращает число элементов: 3.\n\nИндекс последнего элемента — 2. colors[3] для этого списка вызовет ошибку.',
            'A list stores multiple values. Python indexes start at 0: colors[0] is red. len(colors) returns the number of items: 3.\n\nThe last index is 2. Accessing colors[3] would cause an error for this list.'
        ]
    },
    {
        id: 'html',
        pattern: /html|css|сайт|website|веб/i,
        title: [
            'HTML және CSS', 'HTML и CSS', 'HTML and CSS'
        ],
        code: '<h1>Hello!</h1>\n\n/* style.css */\nh1 { color: green; }',
        answers: [
            'HTML беттің құрылымын, CSS көрінісін сипаттайды. JavaScript әрекеттер қосады. h1 — басты тақырып, color — мәтін түсі.\n\nTYMIO-да index.html — құрылым, style.css — дизайн. JavaScript файлдары сабақтар мен ойынды басқарады. CSS ережесін стиль файлына жаз.',
            'HTML описывает структуру, CSS — оформление. JavaScript добавляет действия. h1 — главный заголовок, color — цвет текста.\n\nВ TYMIO index.html хранит структуру, style.css — дизайн. JavaScript управляет уроками и игрой. Правило CSS помести в файл стилей.',
            'HTML describes structure; CSS describes presentation. JavaScript adds behavior. h1 is a main heading and color sets text color.\n\nIn TYMIO, index.html contains structure and style.css contains design. JavaScript controls lessons and the game. Put the CSS rule in the stylesheet.'
        ]
    },
    {
        id: 'javascript',
        pattern: /javascript|джаваскрипт|\bjs\b/i,
        title: [
            'JavaScript', 'JavaScript', 'JavaScript'
        ],
        code: 'let score = 2;\nconsole.log(score + 3);',
        answers: [
            'JavaScript веб-бетке әрекет қосады: батырмалар, ойындар және чат интерфейсі. let айнымалы жасайды. console.log нәтижені браузер консоліне шығарады.\n\nМысал нәтижесі: 5. score мәнін 10 етсең, нәтиже 13 болады.',
            'JavaScript добавляет действия на страницу: кнопки, игры и интерфейс чата. let создаёт переменную. console.log выводит результат в консоль браузера.\n\nРезультат примера: 5. Если score равен 10, результат будет 13.',
            'JavaScript adds behavior to a page: buttons, games and chat interfaces. let declares a variable. console.log displays output in the browser console.\n\nThe example outputs 5. If score is 10, the result is 13.'
        ]
    },
    {
        id: 'java',
        pattern: /\bjava\b|джава/i,
        title: [
            'Java', 'Java', 'Java'
        ],
        code: 'int age = 16;\nSystem.out.println(age);',
        answers: [
            'Java — типтері анық көрсетілетін программалау тілі. int бүтін санды сақтайды. Бұл үзінді Java әдісінің ішінде жазылады және 16 деп шығарады.\n\nJava мен JavaScript — бөлек тілдер. Атаулары ұқсас болғанымен, бір тіл емес.',
            'Java — язык со статической типизацией. int хранит целое число. Этот фрагмент размещается внутри метода Java и выводит 16.\n\nJava и JavaScript — разные языки, несмотря на похожие названия.',
            'Java is a statically typed programming language. int stores an integer. This snippet belongs inside a Java method and prints 16.\n\nJava and JavaScript are different languages despite their similar names.'
        ]
    },
    {
        id: 'cpp',
        pattern: /c\+\+|си плюс|cpp/i,
        title: [
            'C++', 'C++', 'C++'
        ],
        code: '#include <iostream>\nint main() {\n    int x = 4;\n    std::cout << x * 2;\n    return 0;\n}',
        answers: [
            'C++ бағдарламасы main функциясынан басталады. iostream шығару құралдарын қосады. std::cout нәтижені шығарады. * — көбейту.\n\nМысал 8 санын шығарады. Бұл кодты C++ компиляторында іске қосады, JavaScript файлына жазбайды.',
            'Программа C++ начинается с main. iostream подключает инструменты вывода. std::cout выводит результат, * означает умножение.\n\nПример выводит 8. Запускай его через компилятор C++, а не как JavaScript.',
            'A C++ program starts at main. iostream provides output tools. std::cout displays a result and * means multiplication.\n\nThis program displays 8. Run it with a C++ compiler, not as JavaScript.'
        ]
    },
    {
        id: 'csharp',
        pattern: /c#|csharp|си шарп/i,
        title: [
            'C#', 'C#', 'C#'
        ],
        code: 'int points = 7;\nConsole.WriteLine(points + 1);',
        answers: [
            'C# .NET платформасында қолданылады. int бүтін санды сақтайды, Console.WriteLine нәтижені шығарады. Бұл үзінді 8 санын шығарады.\n\nБұл код C# жобасына арналған; веб-беттегі JavaScript орнына тікелей қойылмайды.',
            'C# используется на платформе .NET. int хранит целое число, Console.WriteLine выводит результат. Фрагмент выводит 8.\n\nКод предназначен для проекта C# и не заменяет JavaScript прямо в веб-странице.',
            'C# is used on .NET. int stores an integer and Console.WriteLine displays output. This snippet displays 8.\n\nIt belongs in a C# project; it cannot directly replace JavaScript in a web page.'
        ]
    },
    {
        id: 'sql',
        pattern: /sql|деректер|база|database/i,
        title: [
            'SQL', 'SQL', 'SQL'
        ],
        code: 'SELECT name\nFROM students\nWHERE age >= 16;',
        answers: [
            'SQL деректер қорындағы ақпаратпен жұмыс істейді. SELECT бағанды, FROM кестені, WHERE сүзгі шартын көрсетеді.\n\nМысал жасы 16-дан кем емес оқушылардың name мәндерін таңдайды. Сайтта деректер қорына қосылмай, синтаксисті үйреніп отырмыз.',
            'SQL работает с данными. SELECT указывает столбец, FROM — таблицу, WHERE — условие фильтра.\n\nПример выбирает name учеников не младше 16 лет. Здесь мы изучаем синтаксис без подключения к базе данных.',
            'SQL works with data. SELECT names a column, FROM names a table and WHERE specifies a filter.\n\nThe example retrieves name values for students aged at least 16. Here we study syntax without connecting to a database.'
        ]
    },
    {
        id: 'python',
        pattern: /python|пайтон|питон|print/i,
        title: [
            'Python-ды бастау', 'Начало с Python', 'Getting started with Python'
        ],
        code: 'print("Hello, world!")',
        answers: [
            'Python-ды төрт қадаммен баста:\n1. print() — экранға шығару.\n2. Айнымалылар — мән сақтау.\n3. if — шарт.\n4. for — қайталау.\n\nАлғашқы мысалда тырнақша ішіндегі мәтін экранға шығады. Сайттың Python бөлімінде 4 сабақ пен тест бар.',
            'Начни Python с четырёх шагов:\n1. print() — вывод.\n2. Переменные — хранение значений.\n3. if — условие.\n4. for — повторение.\n\nВ первом примере текст в кавычках выводится на экран. В разделе Python есть четыре урока с тестами.',
            'Start Python in four steps:\n1. print(): display output.\n2. Variables: store values.\n3. if: a condition.\n4. for: repetition.\n\nThe first example displays the quoted text. The Python section contains four lessons with quizzes.'
        ]
    },
    {
        id: 'accessibility',
        pattern: /естім|ым тіл|субтитр|доступ|қолжет|шрифт|контраст|accessib|caption|font|contrast/i,
        title: [
            'Қолжетімділік', 'Доступность', 'Accessibility'
        ],
        answers: [
            'Жоғарыдағы «Қолжетімділік» мәзірінен үлкен мәтін мен жоғары контрастты қос. Tab арқылы басқару элементтеріне өтіп, Enter арқылы таңда.\n\nВидео бөлімінде өз видеоң мен .vtt субтитріңді таңдауға болады. Ым тіліндегі дайын видеолар әзірге қосылмаған. Мәтіндік сабақтар үш тілде бар.',
            'В меню «Доступность» включи крупный текст и высокий контраст. Переходи по элементам клавишей Tab, выбирай Enter.\n\nВ разделе видео можно выбрать свой файл и субтитры .vtt. Готовые видео на жестовом языке ещё не добавлены. Текстовые уроки доступны на трёх языках.',
            'Use Accessibility to enable large text and high contrast. Navigate with Tab and select with Enter.\n\nThe video section accepts your own video and .vtt captions. Ready-made sign-language videos have not been added. Text lessons are available in three languages.'
        ]
    }
];
