
export function deg(val) {
    return Math.PI * val / 180;
}

export const cellSize = 300;
export const cellCount = 20;

export function roundPos(source, result) {
    const c = posToCoords(source);
    copyCoordsToPos(c.x, c.y, result);
}

export function posToCoords(pos) {
    return { x: (Math.floor(pos.x / cellSize)), y: (-1 - Math.floor(pos.z / cellSize)) };
}

export function copyCoordsToPos(x, y, pos) {
    const half = cellSize / 2;
    pos.set(x * cellSize + half, 0, -half - y * cellSize);
}

export class Signal {
    constructor() {
        this.subscribers = [];
    }

    subscribe(func) {
        const wrapper = (...args) => func(...args);

        const subscription = {
            unsubscribe: () => {
                this.subscribers = this.subscribers.filter(
                    sub => sub.wrapper !== wrapper
                );
            }
        };

        this.subscribers.push(wrapper);
        return subscription;
    }

    subscribeAndNotify(func) {
        const subscription = this.subscribe(func);
        func();
        return subscription;
    }

    notify(...args) {
        this.subscribers.forEach(sub => sub(...args));
    }
}

// // Пример использования:
// const emitter = new EventEmitter();
// const logEvent = () => console.log("Event fired!");

// // Подписываемся дважды одной функцией
// const sub1 = emitter.subscribe(logEvent);
// const sub2 = emitter.subscribe(logEvent);

// emitter.notify(); // Выведет "Event fired!" дважды

// sub1.unsubscribe(); // Отписываем только первый вызов
// emitter.notify();   // Выведет "Event fired!" один раз (остался sub2)