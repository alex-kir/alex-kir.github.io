import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { shared_view_manager } from './app_view_manager.js';
import { deg } from './utils.js';

class app_resource_manager_class {
    #_fbxLoader;
    #_cache;
    #_inProgress;

    constructor() {
        this.#_fbxLoader = new FBXLoader();
        this.#_cache = new Map();
        this.#_inProgress = new Map();
    }

    get_object(name) {
        const result = new THREE.Group();
        const cache = this.#_cache;
        if (cache.has(name)) {
            result.add(cache.get(name).clone());
        }
        else {
            const inProgress = this.#_inProgress;
            if (inProgress.has(name)) {
                const list = inProgress.get(name);
                list.push(result);
            }
            else {
                const list = [];
                list.push(result);
                inProgress.set(name, list);
                // const self = this;
                this.#_fbxLoader.load('models/' + name + '.fbx', function (obj) {

                    obj.scale.set(0.1, 0.1, 0.1);

                    if (name.startsWith('a/'))
                    {
                        //obj.rotation.set(0, deg(-90), 0);
                        obj.rotation.set(0, deg(0), 0);
                        obj.position.set(-150, 0 , 150);
                    }

                    cache.set(name, obj);
                    list.forEach(element => {
                        element.add(obj.clone());
                    });

                    if (list.length) {
                        shared_view_manager.render();
                    }

                    list.length = 0;
                });
            }
        }

        return result;
    }
}

export const shared_resource_manager = new app_resource_manager_class();
