import { Signal } from '../utils.js'

export default class HouseModel {
    /** @type {BlockModel[]} */
    #blocks = [];

    constructor() {
    }

    get blocks() { return this.#blocks; }
    blocksChanged = new Signal();

    canAdd(block) {
        for (const b of this.#blocks) {
            if (b.isIntersected(block))
                return false;
        }
        return true;
    }

    add(block) {
        if (!this.canAdd(block))
            return false;

        this.#blocks.push(block);
        this.blocksChanged.notify();
        //console.log('house block added:', block);
        return true;
    }

    remove(block) {
        const index = this.#blocks.indexOf(block);
        if (index === -1)
            return;

        this.#blocks.splice(index, 1);
        this.blocksChanged.notify();
        //console.log('house block removed:', index, block);
        return true;
    }
}
