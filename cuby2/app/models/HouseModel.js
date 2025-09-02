import { Signal } from '../utils.js'
import { BlockModel } from './BlockModel.js';

export default class HouseModel {
    #blocks = [];

    constructor() {
    }

    get blocks() { return this.#blocks; }
    blocksChanged = new Signal();

    canAdd(block) {
        if (block instanceof BlockModel) {
            for (const b of this.#blocks) {
                if (b.isIntersected(block))
                    return false;
            }
            return true;
        }
        return false;
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
