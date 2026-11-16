// ============================================================
// Нода: «Аудио»
//
// Звуковая дорожка из файла в media/ (параметр типа 'audio'). Ничего не рисует.
// Звучит, пока показывается: внутри «Окна времени» начинается с начала окна.
// При просмотре играет через <audio>, в экспорт попадает через audio().
//
// Контракт нод описан в nodes/sphere.js.
// ============================================================

import { srcOf, soundParams, audioSpec, syncElement } from './lib/media.js';

export const meta = {
    name: 'Аудио',
    params: {
        src: { label: 'Аудиофайл', type: 'audio', default: null, rebuild: true },
        ...soundParams
    }
};

export function create() {
    let el = null;

    function setup(W, H, p) {
        if (el) {
            el.pause();
            el.removeAttribute('src');
            el.load();
            el = null;
        }
        const src = srcOf(p.src);
        if (src) {
            el = new Audio();
            el.preload = 'auto';
            el.src = src;
        }
    }

    function frame() {
        // Звук не рисуется
    }

    function sync(t, duration, p, playing, muted) {
        syncElement(el, t, duration, p, playing, muted);
    }

    function audio(p) {
        return audioSpec(srcOf(p.src), p);
    }

    return { setup, frame, sync, audio };
}
