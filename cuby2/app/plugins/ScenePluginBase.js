
import { shared_view_manager } from '../app_view_manager.js';

export default class ScenePluginBase {

    #viewManager;

    get viewManager() { return this.#viewManager; }
    get scene() { return this.#viewManager.scene; }
    get houseViewModel() { return this.#viewManager.rootViewModel.houseViewModel; }
    get houseModel() { return this.#viewManager.rootViewModel.houseViewModel.houseModel; }

    onSceneCreated(viewManager) {
        this.#viewManager = viewManager;
    }

    onRender(viewManager) {
    }

    onPointerMove(event, raycaster) {
    }

    onPointerDown(event, raycaster) {
    }

    onDocumentKeyDown(event) {
    }

    onDocumentKeyUp(event) {
    }

    static registerPlugin(pluginClass) {
        shared_view_manager.addPlugin(new pluginClass());
    }
}
