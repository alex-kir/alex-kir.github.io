
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

export function copyCoordsToPos(cellX, cellY, pos) {
    const [x, z] = coordsToXZ(cellX, cellY);
    pos.set(x, 0, z);
}

export function coordsToXZ(cellX, cellY) {
    const half = cellSize / 2;
    return [cellX * cellSize + half, -half - cellY * cellSize];
}


export function arrayRemoveItem(array, item) {
    var index = array.indexOf(item);
    if (index > -1) {
        array.splice(index, 1);
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



export class ObservableUnit {
    #value;
    #subscribers = [];
    constructor(value) { this.#value = value; }
    get Value() { return this.#value; }
    set Value(value) { this.#value = value; this.#RaiseChanged(); }

    Subscribe(action, disposables = null) {
        const disposable = this.SubscribeToChanges(listener, disposables);
        action(this.#value);
        return disposable;
    }

    SubscribeToChanges(action, disposables = null) {
        const subscriber = (...args) => action(...args);
        this.#subscribers.push(subscriber);
        const disposable = new DisposableAction(function () { arrayRemoveItem(this.#subscribers, subscriber) });
        if (disposables) {
            disposables.Add(disposable);
        }
        return disposable;
    }

    #RaiseChanged() {
        for (const subscriber of this.#subscribers) {
            subscriber(this.#value);
        }
    }
}

export class Linq {

    #array;

    constructor(array) {
        this.#array = array;
    }

    ToArray() {
        return this.#array;
    }

    ToList() {
        return this.#array;
    }

    OrderBy(func) {
        return new Linq(Linq.OrderBy(this.#array, func));
    }

    Select(func) {
        return new Linq(Linq.Select(this.#array, func));
    }

    static Select(array, func) {
        return array.map(func);
    }

    static OrderBy(array, func) {
        function sortFunc(a, b) {
            const aa = func(a);
            const bb = func(b);
            if (aa < bb)
                return -1;
            if (aa > bb)
                return 1;
            return 0;
        }
        const result = [...array];
        result.sort(sortFunc);
        return result;
    }

    static RemoveAt(array, index) {
        array.splice(index, 1);
    }

    static Remove(array, item) {
        var index = array.indexOf(item);
        if (index > -1) {
            array.splice(index, 1);
        }
    }

    static ToArray(array) {
        const result = [...array];
        return result;
    }
}

function getMediaTypeFromFilename(filename) {
    if (filename.endsWith('.csv'))
        return 'text/csv';
    if (filename.endsWith('.json'))
        return 'application/json';
    if (filename.endsWith('.txt'))
        return 'text/plain';
    return 'application/json';
}

export function saveFileInDownloads(json, filename) {
    /*
    Create a Blob:
    Convert the data into a Blob object. A Blob represents file-like immutable raw data.
     The Blob constructor takes an array of data parts and an options object, where type 
     can specify the MIME type of the file (e.g., 'text/plain', 'text/csv', 'application/json').
    */
    let fileType = getMediaTypeFromFilename(filename);
    const blob = new Blob([json], { type: fileType });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');

    a.href = url;
    a.download = filename;

    //    document.body.appendChild(a); // Optional, for compatibility
    a.click();
    // document.body.removeChild(a); // Optional, for cleanup

    URL.revokeObjectURL(url);
}
