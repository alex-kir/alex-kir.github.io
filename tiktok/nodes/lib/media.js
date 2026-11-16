// Общее для нод с файлами: путь к файлу (все), а для «Видео» и «Аудио» —
// время в файле, громкость и синхронизация <video>/<audio> со временем сцены.

// Файл из панели «Медиа» (blob-URL) или null. Медиатеку даёт приложение через
// глобальный объект (src/library.js), а не через import: ноды — отдельные файлы
// и после сборки приложения в один файл его модули импортировать не могут.
function libraryUrl(name) {
    const app = globalThis.tiktokMachine;
    return app && app.libraryUrl ? app.libraryUrl(name) : null;
}

// Имя файла ('clip.mp4') ищется в панели «Медиа», потом в папке media/.
// Полный путь, URL и data: — как есть; встроенная картинка { dataUrl } — её данные
export function srcOf(v) {
    if (!v) return null;
    if (typeof v !== 'string') return v.dataUrl || null;
    if (/^(data:|blob:|https?:|\/|media\/)/i.test(v)) return v;
    return libraryUrl(v) || 'media/' + v;
}

// Параметры звука, одинаковые у обеих нод
export const soundParams = {
    start: { label: 'Начало фрагмента в файле, с', type: 'number', min: 0, max: 600, step: 0.1, default: 0 },
    loop: { label: 'Повторять по кругу', type: 'checkbox', default: false },
    volume: { label: 'Громкость (0 — без звука)', type: 'number', min: 0, max: 1, step: 0.05, default: 1 },
    fadeIn: { label: 'Звук: нарастание, с', type: 'number', min: 0, max: 10, step: 0.1, default: 0 },
    fadeOut: { label: 'Звук: затухание к концу, с', type: 'number', min: 0, max: 10, step: 0.1, default: 0 }
};

// Громкость 0..1 в локальное время ноды t
export function gainAt(t, duration, p) {
    let k = Math.min(1, Math.max(0, p.volume));
    if (p.fadeIn > 0) k *= Math.min(1, Math.max(0, t / p.fadeIn));
    if (p.fadeOut > 0) k *= Math.min(1, Math.max(0, (duration - t) / p.fadeOut));
    return k;
}

// Время в файле для локального времени ноды t. length — длительность файла, с.
// Без повтора после конца файла остаётся последний кадр.
export function mediaTime(t, p, length) {
    const start = Math.max(0, p.start);
    if (!(length > 0)) return start + t;
    if (p.loop) {
        const span = length - start;
        return span > 0 ? start + t % span : 0;
    }
    return Math.min(start + t, Math.max(0, length - 0.01));
}

// Описание звука для экспорта (контракт audio() в nodes/sphere.js)
export function audioSpec(url, p) {
    if (!url || !(p.volume > 0)) return null;
    return {
        url,
        offset: Math.max(0, p.start),
        loop: !!p.loop,
        gain: (t, duration) => gainAt(t, duration, p)
    };
}

// Просмотр: подвести элемент к локальному времени ноды t (null — нода не
// показывается, замолчать). При воспроизведении элемент играет сам, а время
// поправляется, только если разошлось; на паузе — перематывается точно.
// muted — звук просмотра выключен кнопкой в плеере.
export function syncElement(el, t, duration, p, playing, muted) {
    if (!el) return;
    if (t === null || !p) {
        if (!el.paused) el.pause();
        return;
    }
    el.muted = !!muted;
    el.volume = gainAt(t, duration, p);
    const want = mediaTime(t, p, el.duration);
    const over = !p.loop && el.duration > 0 && Math.max(0, p.start) + t >= el.duration;
    if (playing && !over) {
        if (Math.abs(el.currentTime - want) > 0.25) el.currentTime = want;
        if (el.paused) el.play().catch(() => { /* нет жеста пользователя или файл не готов */ });
    } else {
        if (!el.paused) el.pause();
        if (!el.seeking && Math.abs(el.currentTime - want) > 0.02) el.currentTime = want;
    }
}
