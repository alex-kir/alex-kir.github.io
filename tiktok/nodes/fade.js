// ============================================================
// Нода-контейнер: «Появление / исчезание»
//
// Плавно проявляет вложенные ноды в первые fadeIn секунд и гасит в последние
// fadeOut секунд полученной длительности. Меняет только rc.opacity:
// непрозрачность к конечным нодам применяет приложение.
//
// Контракт контейнера описан в nodes/window.js.
// ============================================================

export const meta = {
    name: 'Появление / исчезание',
    container: true,
    params: {
        fadeIn: { label: 'Появление, с', type: 'number', min: 0, max: 20, step: 0.1, default: 1 },
        fadeOut: { label: 'Исчезание, с', type: 'number', min: 0, max: 20, step: 0.1, default: 0 },
        smooth: { label: 'Сглаженно (ease-in-out)', type: 'checkbox', default: true }
    }
};

function smoothstep(u) {
    return u * u * (3 - 2 * u);
}

export function create() {
    function render(rc, p, children) {
        let k = 1;
        if (p.fadeIn > 0) k *= Math.min(1, Math.max(0, rc.t / p.fadeIn));
        if (p.fadeOut > 0) k *= Math.min(1, Math.max(0, (rc.duration - rc.t) / p.fadeOut));
        if (p.smooth) k = smoothstep(k);
        if (k <= 0) return;
        children({ ...rc, opacity: rc.opacity * k });
    }

    return { render };
}
