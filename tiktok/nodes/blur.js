// ============================================================
// Нода: «Размытие области»
//
// Размывает в прямоугольной области всё, что нарисовано ниже неё (ноды под ней
// в списке и фон сцены). Сама ничего не добавляет, кроме затемнения по желанию.
// Ноды выше неё остаются резкими.
//
// Уже нарисованный кадр нода берёт из env.backdrop (см. контракт в
// nodes/sphere.js). Сдвиг, масштаб и поворот контейнера «Трансформация»
// действуют на область, «Появление / исчезание» — на силу эффекта.
// Нужен ctx.filter (Chrome, Edge, Firefox).
// ============================================================

export const meta = {
    name: 'Размытие области',
    params: {
        x: { label: 'Центр: сдвиг X, px', type: 'number', min: -2000, max: 2000, step: 1, default: 0 },
        y: { label: 'Центр: сдвиг Y, px', type: 'number', min: -2000, max: 2000, step: 1, default: 0 },
        width: { label: 'Ширина, px', type: 'number', min: 1, max: 4096, step: 1, default: 240 },
        height: { label: 'Высота, px', type: 'number', min: 1, max: 4096, step: 1, default: 120 },
        blur: { label: 'Сила размытия, px', type: 'number', min: 0, max: 60, step: 0.5, default: 12 },
        corner: { label: 'Скругление углов, px', type: 'number', min: 0, max: 400, step: 1, default: 0 },
        dim: { label: 'Затемнение (0 — нет)', type: 'number', min: 0, max: 1, step: 0.05, default: 0 },
        dimColor: { label: 'Цвет затемнения', type: 'color', default: '#000000' }
    }
};

export function create() {
    function frame(ctx, W, H, t, duration, p, env) {
        const src = (env && env.backdrop) || ctx.canvas;
        const w = p.width;
        const h = p.height;
        const x = W / 2 + p.x - w / 2;
        const y = H / 2 + p.y - h / 2;

        // Область задаётся в координатах ноды (с учётом трансформаций) и
        // становится маской; сам кадр перерисовывается на своём месте
        const m = ctx.getTransform();
        const blur = p.blur * Math.sqrt(Math.abs(m.a * m.d - m.b * m.c));
        ctx.beginPath();
        if (p.corner > 0 && ctx.roundRect) ctx.roundRect(x, y, w, h, Math.min(p.corner, w / 2, h / 2));
        else ctx.rect(x, y, w, h);
        ctx.clip();

        // Размываем не весь кадр, а только окрестность области: её габариты
        // на канвасе с запасом на радиус размытия
        const xs = [];
        const ys = [];
        for (const [px, py] of [[x, y], [x + w, y], [x, y + h], [x + w, y + h]]) {
            xs.push(m.a * px + m.c * py + m.e);
            ys.push(m.b * px + m.d * py + m.f);
        }
        const pad = blur * 3 + 2;
        const x0 = Math.max(0, Math.floor(Math.min(...xs) - pad));
        const y0 = Math.max(0, Math.floor(Math.min(...ys) - pad));
        const x1 = Math.min(src.width, Math.ceil(Math.max(...xs) + pad));
        const y1 = Math.min(src.height, Math.ceil(Math.max(...ys) + pad));
        if (x1 <= x0 || y1 <= y0) return;

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        if (blur > 0) ctx.filter = 'blur(' + blur + 'px)';
        ctx.drawImage(src, x0, y0, x1 - x0, y1 - y0, x0, y0, x1 - x0, y1 - y0);
        ctx.filter = 'none';

        if (p.dim > 0) {
            ctx.globalAlpha = Math.min(1, p.dim);
            ctx.fillStyle = p.dimColor;
            ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
            ctx.globalAlpha = 1;
        }
    }

    return { frame };
}
