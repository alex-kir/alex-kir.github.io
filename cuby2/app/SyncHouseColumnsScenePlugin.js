import ScenePluginBase from './ScenePluginBase.js';
import { coordsToXZ, Linq } from '../utils.js'

import { RootWidget, ContainerWidget, ScrollWidget, TextWidget } from 'widgets/widgets-core.js';

class SyncHouseColumnsScenePlugin extends ScenePluginBase {
    #widget;
    #columnSceneObjs = [];

    constructor() {
        super();

        const text = new TextWidget();
        text.Constraints.With('height', 48);
        text.Text = '\u2611 Show House Columns';
        text.TextAlignment = [-1, 0];

        this.#widget = text;
    }

    getWidget() { return [this.#widget, 100]; }

    onSceneCreated(vm) {
        super.onSceneCreated(vm);
        const subs1 = this.houseModel.blocksChanged.subscribeAndNotify(this.#syncSceneWithModel.bind(this));
    }

    #syncSceneWithModel() {

        const unused = new Set(this.#columnSceneObjs);

        for (const block of this.houseModel.blocks) {
            for (const [cX, cZ] of this.#getCorners(block)) {
                const column = this.#findColumn(cX, cZ);
                if (column) {
                    unused.delete(column);
                    continue;
                }

                const sceneObj = this.resourceManager.getObject('column');
                this.scene.add(sceneObj);
                this.#columnSceneObjs.push(sceneObj);
                sceneObj.position.set(cX, 0, cZ);
            }
        }

        for (const sceneObj of unused) {
            Linq.Remove(this.#columnSceneObjs, sceneObj);
            this.scene.remove(sceneObj);
        }
    }

    #findColumn(x, z) {
        for (const sceneObj of this.#columnSceneObjs) {
            const px = sceneObj.position.x;
            const pz = sceneObj.position.z;
            if (x + 1 < px)
                continue;
            if (x - 1 > px)
                continue;
            if (z + 1 < pz)
                continue;
            if (z - 1 > pz)
                continue;
            return sceneObj;
        }
        return null;
    }

    #cellCoordsToXZ(x, y) {
        const [px1, pz1] = coordsToXZ(x, y);
        const [px2, pz2] = coordsToXZ(x - 1, y - 1);
        return [(px2 + px1) / 2, (pz2 + pz1) / 2];
    }

    #getCorners(block) {
        const blockSceneObj = this.houseViewModel.blockToSceneObjMapping.get(block);

        const [aX, aZ] = coordsToXZ(block.x, block.y);
        const bX = blockSceneObj.position.x;
        const bZ = blockSceneObj.position.z;

        const dX = bX - aX;
        const dZ = bZ - aZ;

        const corners = [
            this.#cellCoordsToXZ(block.realX, block.realY),
            this.#cellCoordsToXZ(block.realX + block.realWidth, block.realY),
            this.#cellCoordsToXZ(block.realX, block.realY + block.realHeight),
            this.#cellCoordsToXZ(block.realX + block.realWidth, block.realY + block.realHeight),
        ];

        const result = [];

        for (const [x, z] of corners) {
            result.push([x + dX, z + dZ]);
        }

        return result;
    }
}

ScenePluginBase.registerPlugin(SyncHouseColumnsScenePlugin);
