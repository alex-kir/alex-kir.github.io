// ============================================================
// Нода-контейнер: «Easing времени»
//
// Искривляет время для вложенных нод: прогресс u = t / duration проходит
// через выбранную кривую, и вложенные получают t' = ease(u) * duration.
// Вложенные ноды ничего не знают про easing, но все их эффекты (проявление,
// наезд, вращение) идут по этой кривой. Внутрь можно класть и другие
// easing-контейнеры: кривые тогда складываются.
//
// Контракт контейнера описан в nodes/window.js.
// ============================================================

const curves = {
    linear: { label: 'Линейно', fn: u => u },
    inQuad: { label: 'Разгон (ease-in)', fn: u => u * u },
    outQuad: { label: 'Торможение (ease-out)', fn: u => 1 - (1 - u) * (1 - u) },
    inOutCubic: {
        label: 'Плавно (ease-in-out)',
        fn: u => u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2
    },
    outBack: {
        label: 'С перелётом (back)',
        fn: u => 1 + 2.70158 * Math.pow(u - 1, 3) + 1.70158 * Math.pow(u - 1, 2)
    },
    outElastic: {
        label: 'Пружина (elastic)',
        fn: u => u === 0 ? 0 : u === 1 ? 1
            : Math.pow(2, -10 * u) * Math.sin((u * 10 - 0.75) * (2 * Math.PI / 3)) + 1
    },
    steps: { label: 'Ступеньки', fn: u => Math.floor(u * 8) / 8 }
};

export const meta = {
    name: 'Easing времени',
    container: true,
    params: {
        curve: {
            label: 'Кривая', type: 'select', default: 'inOutCubic',
            options: Object.entries(curves).map(([value, c]) => ({ value, label: c.label }))
        },
        span: { label: 'Применять к первым N с (0 — ко всей длительности)', type: 'number', min: 0, max: 60, step: 0.1, default: 0 }
    }
};

export function create() {
    function render(rc, p, children) {
        const fn = (curves[p.curve] || curves.linear).fn;
        // span позволяет искривить только начало (например, эффект появления),
        // дальше время идёт как есть
        const span = p.span > 0 ? Math.min(p.span, rc.duration) : rc.duration;
        let t = rc.t;
        if (t < span) {
            t = fn(Math.min(1, Math.max(0, t / span))) * span;
        }
        children({ ...rc, t });
    }

    return { render };
}
