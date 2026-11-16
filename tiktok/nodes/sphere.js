// ============================================================
// Нода: «Шар из точек» (иллюзия смены направления вращения)
//
// Файл содержит только рисование. Запись в файл делает приложение (src/).
//
// Контракт ноды — ES-модуль с двумя экспортами:
//   export const meta = {
//     name             — подпись по умолчанию в списке нод
//     params           — описание настраиваемых параметров (необязательно):
//                        { key: { label, type, default, min, max, step,
//                                 options, multiline, rebuild } }
//                        type: 'number' | 'color' | 'checkbox' | 'select' | 'text' | 'image'
//                              | 'video' | 'audio' (имя файла в media/)
//                        rebuild: true — при изменении заново вызвать setup()
//                        Параметры number, color, checkbox, select (без rebuild) можно
//                        анимировать ключами: нода об этом не знает, в frame()/render()
//                        приходит p со значениями на нужное время (src/anim.js)
//     container        — true у нод с вложенными нодами (для меню и «Обернуть»)
//   }
//   export function create()
//                      — создаёт экземпляр: модуль грузится один раз, а нод в сцене
//                        может быть несколько, поэтому состояние живёт внутри create().
//                        Возвращает объект:
//     setup(W, H, p)   — (необязательно) после создания и при смене rebuild-параметра;
//                        p — текущие значения параметров
//
//     Конечная нода (без вложенных нод) реализует frame:
//     frame(ctx, W, H, t, duration, p)
//                      — рисует кадр для момента t (секунды, 0..duration)
//                        на прозрачном канвасе; фон не заливать, иначе нода
//                        затрёт нижние. Рисовать надо от t, а не накапливать
//                        состояние между кадрами: время можно перематывать.
//                        Нода считает, что живёт всю длительность от t = 0.
//                        Сдвиг, масштаб, поворот и непрозрачность из
//                        RenderContext приложение применяет к ctx само, до вызова.
//
//                        Седьмым аргументом приходит env: { backdrop } — канвас
//                        с тем, что уже нарисовано ниже ноды. Нужен эффектам,
//                        которые меняют нижние слои (nodes/blur.js); читать его
//                        надо именно оттуда, а не из ctx.canvas.
//
//     Конечная нода с видео или звуком может добавить (всё необязательно,
//     примеры — nodes/video.js и nodes/audio.js):
//     sync(t, duration, p, playing, muted)
//                      — просмотр: вызывается каждый кадр, нода подводит свой
//                        <video>/<audio> к локальному времени t. t === null —
//                        нода сейчас не показывается, нужно замолчать.
//                        muted — звук просмотра выключен кнопкой в плеере.
//     prepare(t, duration, p)
//                      — экспорт: возвращает Promise, который выполнится, когда
//                        кадр для времени t готов к рисованию; затем вызывается frame.
//     audio(p)         — экспорт: звук ноды { url, offset, loop, gain(t, duration) }
//                        или null. Приложение само сводит дорожку (src/audio-mix.js).
//
//     Нода-контейнер (с вложенными нодами) вместо frame реализует render:
//     render(rc, p, children)
//                      — rc: RenderContext { ctx, W, H, t, duration,
//                        x, y, scale, rotate, opacity }. children(rc2) рисует
//                        вложенные ноды с переданным контекстом. Контейнер
//                        не меняет rc, а делает копию: { ...rc, t: ... }.
//                        Так устроены окно времени, easing, появление,
//                        трансформация — см. nodes/window.js.
// ============================================================

// Детерминированный генератор случайных чисел (mulberry32):
// при одном seed раскладка точек всегда одинаковая
function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
        a = (a + 0x6D2B79F5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

export const meta = {
    name: 'Шар из точек',
    params: {
        dotCount: { label: 'Количество точек', type: 'number', min: 50, max: 3000, step: 50, default: 800, rebuild: true },
        seed: { label: 'Seed раскладки точек', type: 'number', min: 1, max: 9999, step: 1, default: 1, rebuild: true },
        radius: { label: 'Радиус шара, px', type: 'number', min: 50, max: 200, step: 1, default: 155 },
        centerY: { label: 'Сдвиг центра по Y, px', type: 'number', min: -300, max: 300, step: 1, default: 20 },
        dotScale: { label: 'Размер точек', type: 'number', min: 0.3, max: 3, step: 0.1, default: 1 },
        dotColor: { label: 'Цвет точек', type: 'color', default: '#ffffff' },
        rotSpeed: { label: 'Скорость, рад/с', type: 'number', min: 0.1, max: 5, step: 0.1, default: 0.5 },
        direction: {
            label: 'Направление', type: 'select', default: 'cw',
            options: [
                { value: 'cw', label: 'По часовой' },
                { value: 'ccw', label: 'Против часовой' }
            ]
        }
    }
};

export function create() {
    let dots = [];

    function setup(W, H, p) {
        dots = [];
        const rnd = mulberry32(p.seed);
        // Равномерно распределённые точки на единичной сфере
        for (let i = 0; i < p.dotCount; i++) {
            const u = rnd() * 2 - 1;
            const theta = rnd() * Math.PI * 2;
            const r = Math.sqrt(1 - u * u);
            dots.push({
                x: r * Math.cos(theta),
                y: u,
                z: r * Math.sin(theta),
                size: 1.5 + rnd() * 2
            });
        }
    }

    function frame(ctx, W, H, t, duration, p) {
        // Угол считаем от времени. Число оборотов целое,
        // чтобы при зацикливании не было скачка
        const turns = Math.max(1, Math.round(p.rotSpeed * duration / (2 * Math.PI)));
        const sign = p.direction === 'ccw' ? -1 : 1;
        const angleY = sign * 2 * Math.PI * turns * (t / duration);

        const R = p.radius;
        const CX = W / 2;
        const CY = H / 2 + p.centerY;

        // Обрезаем по кругу
        ctx.save();
        ctx.beginPath();
        ctx.arc(CX, CY, R, 0, Math.PI * 2);
        ctx.clip();

        const cosA = Math.cos(angleY);
        const sinA = Math.sin(angleY);

        // Поворот вокруг оси Y и проекция на плоскость.
        // Точки рисуем без сортировки по глубине, чтобы иллюзия оставалась двусмысленной
        ctx.fillStyle = p.dotColor;
        for (const d of dots) {
            const rx = d.x * cosA - d.z * sinA;
            const sx = CX + rx * R;
            const sy = CY + d.y * R;
            ctx.beginPath();
            ctx.arc(sx, sy, d.size * p.dotScale, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    return { setup, frame };
}
