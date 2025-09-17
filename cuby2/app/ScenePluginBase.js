
export default class ScenePluginBase {

    static registeredPluginClasses = [];

    #viewManager;

    get viewManager() { return this.#viewManager; }
    get scene() { return this.#viewManager.scene; }
    get houseViewModel() { return this.#viewManager.rootViewModel.houseViewModel; }
    get houseModel() { return this.#viewManager.rootViewModel.houseViewModel.houseModel; }
    get resourceManager() { return this.#viewManager.rootViewModel.resourceManager; }

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

    getWidget() { return null; }

    static registerPlugin(pluginClass) {
        ScenePluginBase.registeredPluginClasses.push(pluginClass);
    }
}
