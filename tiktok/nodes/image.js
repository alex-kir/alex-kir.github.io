// ============================================================
// Нода: «Картинка»
//
// Показывает изображение, выбранное в панели параметров (тип 'image').
// Значение параметра: имя файла в media/ ('cat.png'), либо
// встроенный { name, dataUrl } как запасной вариант, либо null.
// Картинки лежат файлами в media/, в сцене хранится только имя файла.
//
// Контракт нод описан в nodes/sphere.js.
// ============================================================

import { srcOf } from './lib/media.js';

export const meta = {
    name: 'Картинка',
    params: {
        src: { label: 'Картинка', type: 'image', default: null, rebuild: true },
        fit: {
            label: 'Вписывание', type: 'select', default: 'contain',
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
        effect: {
            label: 'Эффект', type: 'select', default: 'none',
            options: [
                { value: 'none', label: 'Нет' },
                { value: 'fade', label: 'Проявление' },
                { value: 'zoom', label: 'Наезд (zoom)' },
                { value: 'spin', label: 'Вращение' }
            ]
        },
        effectTime: { label: 'Длительность проявления, с', type: 'number', min: 0.1, max: 10, step: 0.1, default: 1 },
        zoomTo: { label: 'Наезд: масштаб к концу', type: 'number', min: 0.2, max: 4, step: 0.05, default: 1.3 },
        spinTurns: { label: 'Вращение: оборотов за время ноды', type: 'number', min: 1, max: 20, step: 1, default: 1 }
    }
};

export function create() {
    let img = null;
    let loaded = false;
    let failed = false;

    function setup(W, H, p) {
        img = null;
        loaded = false;
        failed = false;
        const src = srcOf(p.src);
        if (src) {
            const im = new Image();
            im.onload = () => { loaded = true; };
            im.onerror = () => { failed = true; };
            im.src = src;
            img = im;
        }
    }

    function frame(ctx, W, H, t, duration, p) {
        if (!img || !loaded) {
            // Подсказка, пока картинка не выбрана, грузится или не нашлась
            ctx.fillStyle = 'rgba(255,255,255,0.35)';
            ctx.font = '14px sans-serif';
            ctx.textAlign = 'center';
            const hint = !img ? 'Выберите картинку в параметрах ноды'
                : failed ? 'Файл не найден: ' + srcOf(p.src)
                    : 'Картинка загружается...';
            ctx.fillText(hint, W / 2, H / 2);
            return;
        }

        const iw = img.naturalWidth;
        const ih = img.naturalHeight;
        if (!iw || !ih) return;

        // Базовый масштаб по режиму вписывания
        let sx = 1;
        let sy = 1;
        if (p.fit === 'contain') sx = sy = Math.min(W / iw, H / ih);
        else if (p.fit === 'cover') sx = sy = Math.max(W / iw, H / ih);
        else if (p.fit === 'stretch') { sx = W / iw; sy = H / ih; }

        // Эффекты считаются от полученного времени: 0..duration.
        // Кривую (easing) и окно показа задают контейнеры, нода о них не знает.
        const progress = Math.min(1, Math.max(0, t / duration));
        let extra = p.scale;
        let angle = p.rotation * Math.PI / 180;
        if (p.effect === 'zoom') extra *= 1 + (p.zoomTo - 1) * progress;
        if (p.effect === 'spin') angle += 2 * Math.PI * p.spinTurns * progress;
        if (p.effect === 'fade') ctx.globalAlpha = Math.min(1, Math.max(0, t / p.effectTime));

        ctx.translate(W / 2 + p.offsetX, H / 2 + p.offsetY);
        ctx.rotate(angle);
        ctx.scale(sx * extra, sy * extra);
        ctx.drawImage(img, -iw / 2, -ih / 2, iw, ih);
        ctx.globalAlpha = 1;
    }

    return { setup, frame };
}
