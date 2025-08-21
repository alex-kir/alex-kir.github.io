
export default class ScenePluginBase {

    #viewManager;

    get houseViewModel() { return this.#viewManager.rootViewModel.houseViewModel; }

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
}
