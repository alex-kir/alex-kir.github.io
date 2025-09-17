import ScenePluginBase from './ScenePluginBase.js';
import Stats from 'three/addons/libs/stats.module.js';


export default class FpsScenePlugin extends ScenePluginBase {
    #stats;
    constructor() {
        super();
        this.#stats = new Stats();
        //this.#stats.dom.style.top = '150px';
        //this.#stats.dom.style.left = 'auto';
        //this.#stats.dom.style.right = '10px';
    }

    onSceneCreated(viewManager) {
        //viewManager.container
        document.body.appendChild(this.#stats.dom);
    }

    onRender(viewManager) {
        this.#stats.update();
    }
}

ScenePluginBase.registerPlugin(FpsScenePlugin);