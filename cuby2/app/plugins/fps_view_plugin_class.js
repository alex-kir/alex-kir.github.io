import ScenePluginBase from './ScenePluginBase.js';
import Stats from 'three/addons/libs/stats.module.js';


export default class fps_view_plugin_class extends ScenePluginBase {
    #stats;
    constructor() {
        super();
        this.#stats = new Stats();
        this.#stats.dom.style.top = '150px';
    }

    onSceneCreated(viewManager) {
        //viewManager.container
        document.body.appendChild(this.#stats.dom);
    }

    onRender(viewManager) {
        this.#stats.update();
    }
}
