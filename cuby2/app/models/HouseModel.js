import { Signal } from '../utils.js'
import { BlockModel } from './BlockModel.js';
import { CMS } from './CMS.js';

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

    printUndefinedRules() {
        HouseModel.#allUndefinedRules.clear();
        HouseModel.#validatePlacement(this.#blocks);
        const result = [...HouseModel.#allUndefinedRules].join('\n');
        console.log(result);
        return result;
    }

    static #validatePlacement(blocks) {

        // --- convert to list of cells ---
        const cells = [];
        for (const block of blocks) {
            if (block instanceof BlockModel) {
                block.forEachCell(function (b, x, y) {
                    cells.push([b, x, y]);
                });
            }
        }

        // --- convert to matrix ---
        const matrix = new Map();
        if (HouseModel.validatePlacementDefaults) {
            for (const [b, x, y] of cells) {

                const code = b.getCode(x, y);

                if (matrix.has(`${x - 1}:${y}`))
                    if (!HouseModel.#isAllowed(matrix.get(`${x - 1}:${y}`), code, 'hor', true))
                        return false;

                if (matrix.has(`${x + 1}:${y}`))
                    if (!HouseModel.#isAllowed(code, matrix.get(`${x + 1}:${y}`), 'hor', true))
                        return false;

                if (matrix.has(`${x}:${y - 1}`))
                    if (!HouseModel.#isAllowed(matrix.get(`${x}:${y - 1}`), code, 'ver', true))
                        return false;

                if (matrix.has(`${x}:${y + 1}`))
                    if (!HouseModel.#isAllowed(code, matrix.get(`${x}:${y + 1}`), 'ver', true))
                        return false;

                matrix.set(`${x}:${y}`, code);
            }
            
            return true;
        }
        else {
            for (const [b, x, y] of cells) {

                const code = b.getCode(x, y);

                if (matrix.has(`${x - 1}:${y}`))
                    if (!HouseModel.#isAllowed(matrix.get(`${x - 1}:${y}`), code, 'hor', false))
                        return false;

                if (matrix.has(`${x + 1}:${y}`))
                    if (!HouseModel.#isAllowed(code, matrix.get(`${x + 1}:${y}`), 'hor', false))
                        return false;

                if (matrix.has(`${x}:${y - 1}`))
                    if (!HouseModel.#isAllowed(matrix.get(`${x}:${y - 1}`), code, 'ver', false))
                        return false;

                if (matrix.has(`${x}:${y + 1}`))
                    if (!HouseModel.#isAllowed(code, matrix.get(`${x}:${y + 1}`), 'ver', false))
                        return false;

                matrix.set(`${x}:${y}`, code);
            }

            return true;
        }
    }

    static validatePlacementDefaults = false;

    static #allUndefinedRules = new Set();

    static #isAllowed(left, right, dir, defolt) {
        if (left) {
            if (right) {
                const rule = CMS.findEntity('rules', dir, left, right);
                if (rule)
                    return rule.allowed;

                // const newRule = `data.set('rules|${dir}|${left}|${right}', allowed);`;
                const newRule = `${dir}|${left}|${right}`;
                HouseModel.#allUndefinedRules.add(newRule);
            }
        }
        return defolt;
    }

}
