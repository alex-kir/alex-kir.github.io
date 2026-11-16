// ============================================================
// Нода-контейнер: «Окно времени»
//
// Вложенные ноды видны только с секунды start по секунду end. Внутри окна
// они получают своё время: 0 в момент start и длительность end - start,
// поэтому их эффекты появления/наезда считаются от начала окна.
//
// Контракт нод описан в nodes/sphere.js. Контейнер реализует
//   render(rc, p, children)
// где rc — RenderContext { ctx, W, H, t, duration, x, y, scale, rotate, opacity },
// а children(rc2) рисует вложенные ноды с переданным контекстом.
// Контейнер не трогает пришедший rc, а передаёт дальше копию с изменениями.
// Контейнеры вкладываются друг в друга: [Окно → Easing → Появление → Текст]
// сначала вырезает окно, затем искривляет время внутри него, затем проявляет.
// ============================================================

export const meta = {
    name: 'Окно времени',
    container: true,
    params: {
        start: { label: 'Начало, с', type: 'number', min: 0, max: 60, step: 0.1, default: 0 },
        end: { label: 'Конец, с (0 — до конца)', type: 'number', min: 0, max: 60, step: 0.1, default: 0 },
        local: { label: 'Время вложенных от начала окна', type: 'checkbox', default: true }
    }
};

export function create() {
    function render(rc, p, children) {
        const start = Math.max(0, p.start);
        const end = p.end > start ? p.end : rc.duration;
        if (rc.t < start || rc.t > end) return;
        if (p.local) {
            children({ ...rc, t: rc.t - start, duration: Math.max(end - start, 0.001) });
        } else {
            children(rc);
        }
    }

    return { render };
}
