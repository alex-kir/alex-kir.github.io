// ============================================================
// Нода: «Комментарий»
//
// Плашка в стиле комментария из соцсети: круглый аватар, имя, время,
// текст с переносом строк и эмодзи, «Ответить», сердце со счётчиком лайков.
// Размеры считаются от размера шрифта, ширина плашки задаётся параметром.
//
// Контракт нод описан в nodes/sphere.js.
// ============================================================

import { srcOf } from './lib/media.js';

export const meta = {
    name: 'Комментарий',
    params: {
        avatar: { label: 'Аватар (пусто — кружок с буквой)', type: 'image', default: null, rebuild: true },
        avatarSize: { label: 'Размер аватара, px (0 — без аватара)', type: 'number', min: 0, max: 200, step: 1, default: 42 },
        username: { label: 'Имя', type: 'text', default: 'abdumanon.ahmedqulov' },
        time: { label: 'Время', type: 'text', default: '1 дн.' },
        text: { label: 'Текст', type: 'text', multiline: true, default: 'Мы с тобой брат😂' },
        likes: { label: 'Лайков (0 — без сердца)', type: 'number', min: 0, max: 100000, step: 1, default: 1021 },
        liked: { label: 'Сердце закрашено', type: 'checkbox', default: false },
        reply: { label: 'Показывать «Ответить»', type: 'checkbox', default: true },
        replyText: { label: 'Текст ссылки ответа', type: 'text', default: 'Ответить' },

        font: {
            label: 'Шрифт', type: 'select', default: 'Segoe UI',
            options: ['Segoe UI', 'Arial', 'Helvetica', 'Roboto', 'Verdana', 'Tahoma']
        },
        fontSize: { label: 'Размер шрифта, px', type: 'number', min: 10, max: 64, step: 1, default: 20 },
        width: { label: 'Ширина плашки, px', type: 'number', min: 120, max: 2000, step: 1, default: 360 },
        anchor: {
            label: 'Привязка', type: 'select', default: 'middle',
            options: [
                { value: 'top', label: 'К верху' },
                { value: 'middle', label: 'К середине' },
                { value: 'bottom', label: 'К низу' }
            ]
        },
        offsetY: { label: 'Отступ по Y, px', type: 'number', min: -1000, max: 1000, step: 1, default: 0 },
        offsetX: { label: 'Сдвиг по X, px', type: 'number', min: -1000, max: 1000, step: 1, default: 0 },

        card: { label: 'Подложка', type: 'checkbox', default: true },
        cardColor: { label: 'Цвет подложки', type: 'color', default: '#000000' },
        cardAlpha: { label: 'Непрозрачность подложки', type: 'number', min: 0, max: 1, step: 0.05, default: 0.85 },
        radius: { label: 'Скругление, px', type: 'number', min: 0, max: 80, step: 1, default: 14 },
        padding: { label: 'Поля, px', type: 'number', min: 0, max: 80, step: 1, default: 16 },
        textColor: { label: 'Цвет текста', type: 'color', default: '#ffffff' },
        mutedColor: { label: 'Цвет времени и «Ответить»', type: 'color', default: '#8e8e8e' },
        heartColor: { label: 'Цвет закрашенного сердца', type: 'color', default: '#ff3040' },

        effect: {
            label: 'Эффект появления', type: 'select', default: 'none',
            options: [
                { value: 'none', label: 'Нет' },
                { value: 'fade', label: 'Проявление' },
                { value: 'slideUp', label: 'Выезд снизу' },
                { value: 'typewriter', label: 'Печатная машинка (текст)' }
            ]
        },
        effectTime: { label: 'Длительность эффекта, с', type: 'number', min: 0.1, max: 10, step: 0.1, default: 0.8 }
    }
};

// Переносит текст по словам в строки не шире maxWidth; явные \n сохраняются
function wrapText(ctx, text, maxWidth) {
    const out = [];
    for (const para of String(text).split('\n')) {
        const words = para.split(' ');
        let line = '';
        for (const word of words) {
            const probe = line ? line + ' ' + word : word;
            if (ctx.measureText(probe).width <= maxWidth || !line) {
                line = probe;
            } else {
                out.push(line);
                line = word;
            }
        }
        out.push(line);
    }
    return out;
}

function roundRect(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}

function heartPath(ctx, cx, cy, size) {
    const w = size;
    const h = size;
    ctx.beginPath();
    ctx.moveTo(cx, cy + h * 0.45);
    ctx.bezierCurveTo(cx - w * 0.95, cy - h * 0.15, cx - w * 0.55, cy - h * 0.75, cx, cy - h * 0.3);
    ctx.bezierCurveTo(cx + w * 0.55, cy - h * 0.75, cx + w * 0.95, cy - h * 0.15, cx, cy + h * 0.45);
    ctx.closePath();
}

export function create() {
    let img = null;
    let loaded = false;

    function setup(W, H, p) {
        img = null;
        loaded = false;
        const src = srcOf(p.avatar);
        if (src) {
            const im = new Image();
            im.onload = () => { loaded = true; };
            im.src = src;
            img = im;
        }
    }

    function fontOf(p, weight, scale) {
        return (weight ? weight + ' ' : '') + Math.round(p.fontSize * (scale || 1)) + 'px "' + p.font + '", sans-serif';
    }

    function frame(ctx, W, H, t, duration, p) {
        const s = p.fontSize;
        const lineH = s * 1.35;
        const avatarR = Math.max(0, p.avatarSize) / 2;
        const gap = s * 0.6;
        const avatarCol = avatarR > 0 ? avatarR * 2 + gap : 0;
        const heartCol = p.likes > 0 ? s * 1.8 : 0;

        // Прогресс эффекта появления
        const progress = Math.min(1, Math.max(0, t / p.effectTime));

        // Раскладка: аватар слева, текст по центру, сердце справа
        const cardW = Math.min(p.width, W);
        const contentX = p.padding;
        const textX = contentX + avatarCol;
        const textW = cardW - p.padding * 2 - avatarCol - (heartCol ? heartCol + gap : 0);

        ctx.font = fontOf(p);
        const lines = wrapText(ctx, p.text, Math.max(20, textW));

        const headerH = lineH;
        const replyH = p.reply ? lineH * 0.9 : 0;
        // Крупный аватар может быть выше текста — плашка подстраивается
        const contentH = Math.max(headerH + lines.length * lineH + replyH, avatarR * 2);
        const cardH = contentH + p.padding * 2;

        let cardX = (W - cardW) / 2 + p.offsetX;
        let cardY;
        if (p.anchor === 'top') cardY = p.offsetY;
        else if (p.anchor === 'bottom') cardY = H - cardH - p.offsetY;
        else cardY = (H - cardH) / 2 + p.offsetY;

        if (p.effect === 'fade') ctx.globalAlpha = progress;
        if (p.effect === 'slideUp') {
            ctx.globalAlpha = progress;
            cardY += (1 - progress) * s * 2.5;
        }

        // Подложка
        if (p.card) {
            ctx.save();
            ctx.globalAlpha *= p.cardAlpha;
            ctx.fillStyle = p.cardColor;
            roundRect(ctx, cardX, cardY, cardW, cardH, p.radius);
            ctx.fill();
            ctx.restore();
        }

        // Аватар
        if (avatarR > 0) {
            const ax = cardX + contentX + avatarR;
            const ay = cardY + p.padding + avatarR;
            ctx.save();
            ctx.beginPath();
            ctx.arc(ax, ay, avatarR, 0, Math.PI * 2);
            ctx.clip();
            if (img && loaded) {
                // Заполняем круг картинкой по принципу cover
                const iw = img.naturalWidth;
                const ih = img.naturalHeight;
                const k = Math.max(avatarR * 2 / iw, avatarR * 2 / ih);
                ctx.drawImage(img, ax - iw * k / 2, ay - ih * k / 2, iw * k, ih * k);
            } else {
                ctx.fillStyle = '#3a3a3a';
                ctx.fillRect(ax - avatarR, ay - avatarR, avatarR * 2, avatarR * 2);
                ctx.fillStyle = '#bbbbbb';
                // Буква масштабируется под кружок, а не под шрифт текста
                ctx.font = 'bold ' + Math.round(avatarR * 1.1) + 'px "' + p.font + '", sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(String(p.username || '?').charAt(0).toUpperCase(), ax, ay + avatarR * 0.05);
            }
            ctx.restore();
        }

        // Имя и время
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
        const baseline0 = cardY + p.padding + s;
        const tx = cardX + textX;
        ctx.fillStyle = p.textColor;
        ctx.font = fontOf(p, 'bold');
        ctx.fillText(p.username, tx, baseline0);
        const nameW = ctx.measureText(p.username).width;
        if (p.time) {
            ctx.fillStyle = p.mutedColor;
            ctx.font = fontOf(p, '', 0.9);
            ctx.fillText(p.time, tx + nameW + s * 0.4, baseline0);
        }

        // Текст (с печатной машинкой при необходимости)
        let shown = lines;
        if (p.effect === 'typewriter') {
            const total = lines.reduce((n, l) => n + l.length, 0);
            let left = Math.floor(total * progress);
            shown = lines.map(line => {
                const part = line.slice(0, Math.max(0, left));
                left -= line.length;
                return part;
            });
        }
        ctx.fillStyle = p.textColor;
        ctx.font = fontOf(p);
        shown.forEach((line, i) => {
            if (line) ctx.fillText(line, tx, baseline0 + (i + 1) * lineH);
        });

        // «Ответить»
        if (p.reply) {
            ctx.fillStyle = p.mutedColor;
            ctx.font = fontOf(p, '', 0.8);
            ctx.fillText(p.replyText, tx, baseline0 + (lines.length + 1) * lineH - s * 0.15);
        }

        // Сердце и счётчик
        if (heartCol) {
            const hx = cardX + cardW - p.padding - heartCol / 2;
            const hy = cardY + p.padding + s * 0.9;
            heartPath(ctx, hx, hy, s * 0.95);
            if (p.liked) {
                ctx.fillStyle = p.heartColor;
                ctx.fill();
            } else {
                ctx.strokeStyle = p.textColor;
                ctx.lineWidth = Math.max(1, s * 0.08);
                ctx.lineJoin = 'round';
                ctx.stroke();
            }
            ctx.fillStyle = p.textColor;
            ctx.font = fontOf(p, '', 0.75);
            ctx.textAlign = 'center';
            ctx.fillText(String(Math.round(p.likes)), hx, hy + s * 1.35);
        }

        ctx.globalAlpha = 1;
    }

    return { setup, frame };
}
