import ScenePluginBase from './ScenePluginBase.js';
import { shared_resource_manager } from '../app_resource_manager.js'
import { copyCoordsToPos, deg } from '../utils.js'
import { CMS } from '../models/CMS.js'

export default class SyncHouseModelPlugin extends ScenePluginBase {
    #vm;
    #houseModel;
    #map = new Map();

    constructor() {
        super();
    }

    onSceneCreated(vm) {
        this.#vm = vm;
        this.#houseModel = vm.rootViewModel.houseViewModel.houseModel;
        const subs1 = this.#houseModel.blocksChanged.subscribeAndNotify(this.#syncSceneWithModel.bind(this));
    }

    #getOrCreateSceneObject(block) {
        if (this.#map.has(block)) {
            return this.#map.get(block);
        }

        const { fbxName } = CMS.getEntity('block', block.name);
        const sceneObj = shared_resource_manager.get_object(fbxName);

        this.#map.set(block, sceneObj);
        this.#vm.scene.add(sceneObj);

        return sceneObj;
    }

    #syncSceneWithModel() {

        for (const block of this.#houseModel.blocks) {
            const sceneObj = this.#getOrCreateSceneObject(block);
            copyCoordsToPos(block.x, block.y, sceneObj.position);
            sceneObj.rotation.set(0, deg(-block.direction), 0);
        }

        const removed = [];
        for (const key of this.#map.keys()) {
            if (!this.#houseModel.blocks.includes(key)) {
                removed.push(key);
            }
        }

        for (const key of removed) {
            const sceneObj = this.#map.get(key);
            this.#map.delete(key);
            this.#vm.scene.remove(sceneObj);
        }
    }
}
