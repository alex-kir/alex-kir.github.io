
import Stats from 'three/addons/libs/stats.module.js';

import { app_view_plugin_class } from 'app/app_view_plugin.js';

export class fps_view_plugin_class extends app_view_plugin_class {
    #stats;
    constructor() {
        super();
        this.#stats = new Stats();

    }

    onSceneCreated(viewManager) {
        viewManager.container.appendChild(this.#stats.dom);
    }

    onRender(viewManager) {
        this.#stats.update();
    }
}
