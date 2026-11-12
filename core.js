const $ = s => document.querySelector(s);
let saved = {};
try {
    saved = (JSON.parse(localStorage.getItem('tymio') || '{}') || {});
}
catch {
}
let done = Array.isArray(saved.done) ? [
    ...new Set(saved.done.filter(x => Number.isInteger(x) && x >= 0 && x < 4))
] : [];
function save() {
    try {
        localStorage.setItem('tymio', JSON.stringify({
            done, contrast: document.body.classList.contains('contrast'), large: document.body.classList.contains('large')
        }));
    }
    catch {
    }
}
for (const cls of [
    'contrast', 'large'
])
    if (saved[cls])
        document.body.classList.add(cls);
$('#settings').onclick = () => {
    const p = $('#panel');
    p.hidden = !p.hidden;
    $('#settings').setAttribute('aria-expanded', String(!p.hidden));
};
for (const [id, cls] of [
    [
        'contrast', 'contrast'
    ], [
        'font', 'large'
    ]
]) {
    const b = $('#' + id);
    b.setAttribute('aria-pressed', String(document.body.classList.contains(cls)));
    b.onclick = () => {
        document.body.classList.toggle(cls);
        b.setAttribute('aria-pressed', String(document.body.classList.contains(cls)));
        save();
    };
}
let videoURL, captionURL;
$('#videofile').onchange = e => {
    const file = e.target.files[0];
    if (!file)
        return;
    if (videoURL)
        URL.revokeObjectURL(videoURL);
    videoURL = URL.createObjectURL(file);
    $('#player').src = videoURL;
    $('#videostatus').textContent = window.Tymio.text([
        "Видео тек осы құрылғыда ашылды. Серверге жіберілген жоқ.", "Видео открыто на этом устройстве. Оно не отправлено на сервер.", "The video opened locally. It was not sent to a server."
    ]);
};
$('#captions').onchange = e => {
    const file = e.target.files[0];
    if (!file)
        return;
    if (captionURL)
        URL.revokeObjectURL(captionURL);
    $('#player').querySelectorAll('track').forEach(t => t.remove());
    captionURL = URL.createObjectURL(file);
    const t = document.createElement('track');
    t.kind = 'captions';
    t.label = file.name;
    t.src = captionURL;
    t.default = true;
    $('#player').append(t);
    t.addEventListener('load', () => {
        t.track.mode = 'showing';
    });
    $('#videostatus').textContent = window.Tymio.text([
        "Субтитр қосылды. Ойнатқыштағы CC батырмасын қолданыңыз.", "Субтитры добавлены. Используй кнопку CC.", "Captions added. Use the CC button."
    ]);
};
