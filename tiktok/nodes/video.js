// ============================================================
// Нода: «Видео»
//
// Показывает видеофайл из media/ (параметр типа 'video') со звуком.
// Время в файле = «начало фрагмента» + локальное время ноды, поэтому внутри
// «Окна времени» видео стартует с начала окна.
//
// При просмотре <video> играет сам и подстраивается под время сцены (sync).
// При экспорте перед каждым кадром prepare() перематывает его на точное время
// и ждёт готовности кадра, звук берётся из файла через audio().
//
// Контракт нод описан в nodes/sphere.js.
// ============================================================

import { srcOf, soundParams, audioSpec, syncElement, mediaTime } from './lib/media.js';

export const meta = {
    name: 'Видео',
    params: {
        src: { label: 'Видеофайл', type: 'video', default: null, rebuild: true },
        fit: {
            label: 'Вписывание', type: 'select', default: 'cover',
            options: [
                { value: 'contain', label: 'Вписать целиком' },
                { value: 'cover', label: 'Заполнить кадр' },
                { value: 'stretch', label: 'Растянуть' },
                { value: 'none', label: 'Исходный размер' }
            ]
        },
        scale: { label: 'Масштаб', type: 'number', min: 0.05, max: 5, step: 0.05, default: 1 },
        offsetX: { label: 'Сдвиг X, px', type: 'number', min: -800, max: 800, step: 1, default: 0 },
        offsetY: { label: 'Сдвиг Y, px', type: 'number', min: -800, max: 800, step: 1, default: 0 },
        rotation: { label: 'Поворот, °', type: 'number', min: -180, max: 180, step: 1, default: 0 },
        ...soundParams
    }
};

export function create() {
    let video = null;
    let failed = false;

    function setup(W, H, p) {
        if (video) {
            video.pause();
            video.removeAttribute('src');
            video.load();
            video = null;
        }
        failed = false;
        const src = srcOf(p.src);
        if (src) {
            const v = document.createElement('video');
            v.preload = 'auto';
            v.playsInline = true;
            v.onerror = () => { failed = true; };
            v.src = src;
            video = v;
        }
    }

    function frame(ctx, W, H, t, duration, p) {
        if (!video || failed || video.readyState < 2) {
            // Подсказка, пока видео не выбрано, грузится или не нашлось
            ctx.fillStyle = 'rgba(255,255,255,0.35)';
            ctx.font = '14px sans-serif';
            ctx.textAlign = 'center';
            const hint = !video ? 'Выберите видео в параметрах ноды'
                : failed ? 'Файл не найден или не читается: ' + srcOf(p.src)
                    : 'Видео загружается...';
            ctx.fillText(hint, W / 2, H / 2);
            return;
        }

        const iw = video.videoWidth;
        const ih = video.videoHeight;
        if (!iw || !ih) return;

        let sx = 1;
        let sy = 1;
        if (p.fit === 'contain') sx = sy = Math.min(W / iw, H / ih);
        else if (p.fit === 'cover') sx = sy = Math.max(W / iw, H / ih);
        else if (p.fit === 'stretch') { sx = W / iw; sy = H / ih; }

        ctx.translate(W / 2 + p.offsetX, H / 2 + p.offsetY);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.scale(sx * p.scale, sy * p.scale);
        ctx.drawImage(video, -iw / 2, -ih / 2, iw, ih);
    }

    function sync(t, duration, p, playing, muted) {
        syncElement(video, t, duration, p, playing, muted);
    }

    // Экспорт: выставить кадр для локального времени t и дождаться его
    async function prepare(t, duration, p) {
        const v = video;
        if (!v || failed) return;
        if (v.readyState < 1) {
            await new Promise((resolve) => {
                v.addEventListener('loadedmetadata', resolve, { once: true });
                v.addEventListener('error', resolve, { once: true });
            });
            if (v !== video || failed) return;
        }
        if (!v.paused) v.pause();
        // Небольшой запас, чтобы попасть внутрь кадра, а не на его границу
        const want = mediaTime(t, p, v.duration) + 0.001;
        if (!v.seeking && v.readyState >= 2 && Math.abs(v.currentTime - want) < 0.0005) return;
        await new Promise((resolve) => {
            const done = () => {
                clearTimeout(timer);
                v.removeEventListener('seeked', done);
                v.removeEventListener('error', done);
                resolve();
            };
            const timer = setTimeout(done, 5000); // не вешать экспорт на битом файле
            v.addEventListener('seeked', done);
            v.addEventListener('error', done);
            v.currentTime = want;
        });
    }

    function audio(p) {
        return audioSpec(srcOf(p.src), p);
    }

    return { setup, frame, sync, prepare, audio };
}
