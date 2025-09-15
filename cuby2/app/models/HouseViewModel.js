
import { Signal } from '../utils.js'
import HouseModel from './HouseModel.js'
import { BlockDirection, BlockModel } from './BlockModel.js'
import { CMS } from '../models/CMS.js'

export default class HouseViewModel {
    #houseModel = new HouseModel();

    activeBlockName = CMS.getEntity('key|1').id;
    activeDirection = BlockDirection.North;
    activeToolChanged = new Signal();

    get houseModel() { return this.#houseModel; }
    get blocksChanged() { return this.#houseModel.blocksChanged; }

    blockToSceneObjMapping = new Map();

    constructor() {
    }

    setDirection(direction) {
        this.activeDirection = direction;
        this.#fixRotation();
        this.#fireChanged();
    }

    rotateLeft() {
        switch (this.activeDirection) {
            case 0: this.activeDirection = 270; break;
            case 90: this.activeDirection = 0; break;
            case 180: this.activeDirection = 90; break;
            case 270: this.activeDirection = 180; break;
        }
        this.#fixRotation(-1);
        this.#fireChanged();
    }

    rotateRight() {
        switch (this.activeDirection) {
            case 0: this.activeDirection = 90; break;
            case 90: this.activeDirection = 180; break;
            case 180: this.activeDirection = 270; break;
            case 270: this.activeDirection = 0; break;
        }
        this.#fixRotation();
        this.#fireChanged();
    }

    #fixRotation(mode) {
        if (this.activeBlockName.startsWith('house_')) {
            if (mode === -1) {
                switch (this.activeDirection) {
                    case 90: this.activeDirection = 0; break;
                    case 270: this.activeDirection = 180; break;
                }
            }
            else {
                switch (this.activeDirection) {
                    case 90: this.activeDirection = 180; break;
                    case 270: this.activeDirection = 0; break;
                }
            }
        }
    }

    setBlockName(name) {
        this.activeBlockName = name;
        this.#fixRotation();
        this.#fireChanged();
    }

    #fireChanged() {
        this.activeToolChanged.notify();
    }

    canPlaceAtCoords(coords) {
        const { width, height } = CMS.getEntity('block', this.activeBlockName);
        const block = new BlockModel(this.activeBlockName, coords.x, coords.y, width, height, this.activeDirection);
        return this.#houseModel.canAdd(block);
    }

    placeAtCoords(coords) {
        const { width, height } = CMS.getEntity('block', this.activeBlockName);
        const block = new BlockModel(this.activeBlockName, coords.x, coords.y, width, height, this.activeDirection);
        this.#houseModel.add(block);
    }

    removeAtCoords(coords) {
        const block = new BlockModel(null, coords.x, coords.y, 1, 1, BlockDirection.North);
        const removed = [];
        for (const b of this.#houseModel.blocks) {
            if (b.isIntersected(block))
                removed.push(b);
        }
        for (const b of removed) {
            this.#houseModel.remove(b);
        }
    }
}
