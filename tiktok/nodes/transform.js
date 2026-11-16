// ============================================================
// Нода-контейнер: «Трансформация»
//
// Сдвигает, масштабирует и поворачивает вложенные ноды относительно центра
// кадра: меняет x, y, scale, rotate в RenderContext, применяет их приложение.
// Может анимировать: значения «к концу» линейно достигаются к концу
// полученной длительности (а внутри Easing-контейнера — по его кривой).
//
// Контракт контейнера описан в nodes/window.js.
// ============================================================

export const meta = {
    name: 'Трансформация',
    container: true,
    params: {
        x: { label: 'Сдвиг X, px', type: 'number', min: -1000, max: 1000, step: 1, default: 0 },
        y: { label: 'Сдвиг Y, px', type: 'number', min: -1000, max: 1000, step: 1, default: 0 },
        scale: { label: 'Масштаб', type: 'number', min: 0.05, max: 5, step: 0.05, default: 1 },
        rotate: { label: 'Поворот, °', type: 'number', min: -360, max: 360, step: 1, default: 0 },
        animate: { label: 'Анимировать к концу', type: 'checkbox', default: false },
        xTo: { label: 'К концу: сдвиг X, px', type: 'number', min: -1000, max: 1000, step: 1, default: 0 },
        yTo: { label: 'К концу: сдвиг Y, px', type: 'number', min: -1000, max: 1000, step: 1, default: 0 },
        scaleTo: { label: 'К концу: масштаб', type: 'number', min: 0.05, max: 5, step: 0.05, default: 1 },
        rotateTo: { label: 'К концу: поворот, °', type: 'number', min: -360, max: 360, step: 1, default: 0 }
    }
};

function mix(a, b, u) {
    return a + (b - a) * u;
}

export function create() {
    function render(rc, p, children) {
        let x = p.x, y = p.y, s = p.scale, r = p.rotate;
        if (p.animate) {
            const u = Math.min(1, Math.max(0, rc.t / rc.duration));
            x = mix(p.x, p.xTo, u);
            y = mix(p.y, p.yTo, u);
            s = mix(p.scale, p.scaleTo, u);
            r = mix(p.rotate, p.rotateTo, u);
        }
        children({
            ...rc,
            x: rc.x + x * rc.scale,
            y: rc.y + y * rc.scale,
            scale: rc.scale * s,
            rotate: rc.rotate + r
        });
    }

    return { render };
}
