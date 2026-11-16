// ============================================================
// Нода: «Текст»
//
// Универсальная текстовая надпись: несколько строк, привязка к верху,
// середине или низу кадра, шрифт, цвет и простой эффект появления.
// Одну и ту же ноду можно добавить несколько раз с разными параметрами
// (например, заголовок сверху и подпись снизу — см. nodes/index.json).
//
// Контракт нод описан в nodes/sphere.js.
// ============================================================

export const meta = {
    name: 'Текст',
    params: {
        text: {
            label: 'Текст', type: 'text', multiline: true,
            default: 'СМОЖЕШЬ ИЗМЕНИТЬ\nНАПРАВЛЕНИЕ ВРАЩЕНИЯ\nСИЛОЙ МЫСЛИ?'
        },
        anchor: {
            label: 'Привязка', type: 'select', default: 'top',
            options: [
                { value: 'top', label: 'К верху' },
                { value: 'middle', label: 'К середине' },
                { value: 'bottom', label: 'К низу' }
            ]
        },
        offset: { label: 'Отступ от привязки, px', type: 'number', min: -400, max: 400, step: 1, default: 70 },
        align: {
            label: 'Выравнивание', type: 'select', default: 'center',
            options: [
                { value: 'left', label: 'Слева' },
                { value: 'center', label: 'По центру' },
                { value: 'right', label: 'Справа' }
            ]
        },
        margin: { label: 'Поле слева/справа, px', type: 'number', min: 0, max: 200, step: 1, default: 20 },
        font: {
            label: 'Шрифт', type: 'select', default: 'Courier New',
            options: ['Courier New', 'Arial', 'Georgia', 'Times New Roman', 'Impact', 'Verdana']
        },
        fontSize: { label: 'Размер шрифта, px', type: 'number', min: 8, max: 120, step: 1, default: 22 },
        bold: { label: 'Жирный', type: 'checkbox', default: true },
        lineHeight: { label: 'Межстрочный интервал, px', type: 'number', min: 8, max: 160, step: 1, default: 32 },
        letterSpacing: { label: 'Межбуквенный интервал, px', type: 'number', min: 0, max: 30, step: 0.5, default: 4 },
        color: { label: 'Цвет', type: 'color', default: '#ffffff' },
        strokeWidth: { label: 'Обводка: толщина, px (0 — нет)', type: 'number', min: 0, max: 20, step: 0.5, default: 0 },
        strokeColor: { label: 'Обводка: цвет', type: 'color', default: '#000000' },
        effect: {
            label: 'Эффект появления', type: 'select', default: 'none',
            options: [
                { value: 'none', label: 'Нет' },
                { value: 'fade', label: 'Проявление' },
                { value: 'typewriter', label: 'Печатная машинка' }
            ]
        },
        effectTime: { label: 'Длительность эффекта, с', type: 'number', min: 0.1, max: 10, step: 0.1, default: 1 }
    }
};

export function create() {
    function frame(ctx, W, H, t, duration, p) {
        let lines = String(p.text).split('\n');
        if (lines.length === 0) return;

        // Прогресс эффекта появления: 0 при t = 0, 1 после effectTime
        const progress = Math.min(1, Math.max(0, t / p.effectTime));

        if (p.effect === 'fade') {
            ctx.globalAlpha = progress;
        } else if (p.effect === 'typewriter') {
            const total = lines.reduce((n, l) => n + l.length, 0);
            let left = Math.floor(total * progress);
            lines = lines.map(line => {
                const part = line.slice(0, Math.max(0, left));
                left -= line.length;
                return part;
            });
        }

        ctx.fillStyle = p.color;
        ctx.font = (p.bold ? 'bold ' : '') + p.fontSize + 'px "' + p.font + '", monospace';
        ctx.textAlign = p.align;
        ctx.textBaseline = 'alphabetic';
        ctx.letterSpacing = p.letterSpacing + 'px';

        const x = p.align === 'left' ? p.margin
            : p.align === 'right' ? W - p.margin
                : W / 2;

        // Базовая линия первой строки в зависимости от привязки
        const blockH = (lines.length - 1) * p.lineHeight;
        let y;
        if (p.anchor === 'top') y = p.offset;
        else if (p.anchor === 'bottom') y = H - p.offset - blockH;
        else y = H / 2 + p.offset - blockH / 2;

        // Обводка рисуется под буквами и выступает наружу на strokeWidth.
        // Сначала обводка всех строк, затем заливка: соседняя строка не перекроет буквы
        if (p.strokeWidth > 0) {
            ctx.strokeStyle = p.strokeColor;
            ctx.lineWidth = p.strokeWidth * 2;
            ctx.lineJoin = 'round';
            lines.forEach((line, i) => {
                if (line) ctx.strokeText(line, x, y + i * p.lineHeight);
            });
        }
        lines.forEach((line, i) => {
            if (line) ctx.fillText(line, x, y + i * p.lineHeight);
        });

        ctx.globalAlpha = 1;
    }

    return { frame };
}
