import ScenePluginBase from './ScenePluginBase.js';
import { shared_resource_manager } from '../app_resource_manager.js'
import { copyCoordsToPos, deg, Linq } from '../utils.js'
import { CMS } from '../models/CMS.js'
import findIslands, { getOneToManyIslandTouches } from './IslandUtils.js'

class SyncHouseBlocksScenePlugin extends ScenePluginBase {

    constructor() {
        super();
    }

    onSceneCreated(vm) {
        super.onSceneCreated(vm);
        const subs1 = this.houseModel.blocksChanged.subscribeAndNotify(this.#syncSceneWithModel.bind(this));
    }

    #getOrCreateSceneObject(block) {
        const map = this.houseViewModel.blockToSceneObjMapping;
        if (map.has(block)) {
            return map.get(block);
        }

        const { fbxName } = CMS.getEntity('block', block.name);
        const sceneObj = shared_resource_manager.get_object(fbxName);

        sceneObj.rotation.set(0, deg(-block.direction), 0);

        map.set(block, sceneObj);
        this.scene.add(sceneObj);

        return sceneObj;
    }

    #syncSceneWithModel() {

        const map = this.houseViewModel.blockToSceneObjMapping;
        for (const block of this.houseModel.blocks) {
            this.#getOrCreateSceneObject(block);
        }

        this.#updateWorldPosition();

        const removed = [];
        for (const key of map.keys()) {
            if (!this.houseModel.blocks.includes(key)) {
                removed.push(key);
            }
        }

        for (const key of removed) {
            const sceneObj = map.get(key);
            map.delete(key);
            this.scene.remove(sceneObj);
        }
    }

    #updateWorldPosition() {

        const all = this.houseModel.blocks.map(it => {
            const { order } = CMS.getEntity('block_shift', it.name);
            return {
                block: it,
                x: it.realX, y: it.realY,
                width: it.realWidth, height: it.realHeight,
                name: `${order}`,
                order: order,
            };
        });
        
        const sorted = Linq.OrderBy(all, it => it.order);

        // islands are sorted because builded from sorted blocks
        const islands = findIslands(sorted);

        for (let i = 0; i < islands.length; i++) {
            const pinned = islands.slice(0, i);
            const island = islands[i];
            const touches = getOneToManyIslandTouches(island, pinned);

            let shiftX = 0;
            let shiftY = 0;
            for (const t of touches) {
                switch (t) {
                    case 'left':
                        shiftX = shiftX + 42.5;
                        break;
                    case 'right':
                        shiftX = shiftX - 42.5;
                        break;
                    case 'up':
                        shiftY = shiftY + 42.5;
                        break;
                    case 'down':
                        shiftY = shiftY - 42.5;
                        break;
                }
            }

            for (const { block } of island) {
                const sceneObj = this.#getOrCreateSceneObject(block);
                copyCoordsToPos(block.x, block.y, sceneObj.position);
                sceneObj.position.set(sceneObj.position.x + shiftX, sceneObj.position.y, sceneObj.position.z - shiftY);
            }
        }
    }
}


ScenePluginBase.registerPlugin(SyncHouseBlocksScenePlugin);

