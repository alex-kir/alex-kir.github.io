import { Signal } from '../utils.js'
import { BlockModel } from './BlockModel.js';
import { Rules } from './Rules.js';

class debug {
    static #isDev = '?';
    static isDev() {
        if (debug.#isDev === true)
            return true;
        if (debug.#isDev === false)
            return false;

        debug.#isDev = (document.location + '').indexOf('127.0.0.1') !== -1;
        console.log('debug.#isDebug:', debug.#isDev);
        return debug.#isDev;
    }

    static log(...args) {
        if (this.isDev()) {
            console.log(...args);
        }
    }
}

export default class HouseModel {
    #blocks = [];

    constructor() {
    }

    get blocks() { return this.#blocks; }
    blocksChanged = new Signal();

    canAdd(block) {
        if (block instanceof BlockModel) {
            for (const b of this.#blocks) {
                if (b.isIntersected(block)) {
                    return false;
                }
            }
            return HouseModel.#validatePlacement([block, ...this.#blocks])
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

    printUndefinedRules()
    {
        HouseModel.#allUndefinedRules.clear();

        HouseModel.#validatePlacement(this.#blocks);

        console.log('#allUndefinedRules = ', [...HouseModel.#allUndefinedRules].join('\n'));
    }

    static #validatePlacement(blocks) {

        // --- convert to list of cells ---
        const cells = [];
        for (const block of blocks) {
            if (block instanceof BlockModel) {
                block.forEachCell(function (b, x, y, sub) {
                    cells.push([b, x, y, sub]);
                });
            }
        }

        // --- convert to matrix ---
        const matrix = new Map();
        for (const [b, x, y, sub] of cells) {

            const key = `${x}:${y}`;
            const value = Rules.remapBlockCode(`${b.name}:${b.direction}:${sub}`);
            
            if (!HouseModel.#isAllowed(matrix.get(`${x - 1}:${y}`), value, 'hor'))
                return false;

            if (!HouseModel.#isAllowed(value, matrix.get(`${x + 1}:${y}`), 'hor'))
                return false;

            if (!HouseModel.#isAllowed(matrix.get(`${x}:${y - 1}`), value, 'ver'))
                return false;

            if (!HouseModel.#isAllowed(value, matrix.get(`${x}:${y + 1}`), 'ver'))
                return false;

            matrix.set(key, value);
        }

        // ---------

        return HouseModel.validatePlacementDefaults;
    }

    static validatePlacementDefaults = true;

    static #allUndefinedRules = new Set();

    static #isAllowed(left, right, dir) {
        if (left) {
            if (right) {
                for (const [left1, right1, dir1, allowed] of Rules.allRules) {
                    if (left == left1 && right == right1 && dir1 == dir) {
                        return allowed;
                    }
                }

                const newRule = `['${left}', '${right}', '${dir}', true],`;
                    HouseModel.#allUndefinedRules.add(newRule);
            }
        }
        return true;
    }

}
