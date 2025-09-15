import * as THREE from 'three';
import ScenePluginBase from './ScenePluginBase.js';
import { CubeCursor } from './CubeCursor.js';
import { cellCount, cellSize } from '../utils.js';
import { CMS } from '../models/CMS.js'

class HouseModelEditorViewPlugin extends ScenePluginBase {

    #plane;
    #cursor = new CubeCursor();
    #modelsForCursor;
    #activeModel;

    constructor() {
        super();

        // plane for raycast
        const geometry = new THREE.PlaneGeometry(cellSize * cellCount, cellSize * cellCount);
        geometry.rotateX(-Math.PI / 2);
        this.#plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ visible: false }));
    }

    onSceneCreated(viewManager) {
        super.onSceneCreated(viewManager);

        this.#modelsForCursor = new Map();
        for (const { id, fbxName } of CMS.getEntities('block')) {
            this.#modelsForCursor.set(id, this.resourceManager.getObject(fbxName));
        }

        const subscription = this.houseViewModel.activeToolChanged.subscribeAndNotify(this.#onToolChanged.bind(this));

        this.#cursor.setScene(viewManager.scene);
    }

    #onToolChanged() {
        this.#cursor.setDirection(this.houseViewModel.activeDirection);
        this.#activeModel = this.#modelsForCursor.get(this.houseViewModel.activeBlockName);

        if (this.houseViewModel.canPlaceAtCoords(this.#cursor.getCoords())) {
            this.#cursor.setModel(this.#activeModel);
        }
        else {
            this.#cursor.setModel(null);
        }
    }

    onPointerMove(event, raycaster) {
        const intersects = raycaster.intersectObject(this.#plane, true);

        if (intersects.length === 0) {
            this.#cursor.hide();
            return;
        }
        const intersect = intersects[0];

        this.#cursor.showAt(intersect.point);

        if (this.houseViewModel.canPlaceAtCoords(this.#cursor.getCoords())) {
            this.#cursor.setModel(this.#activeModel);
        }
        else {
            this.#cursor.setModel(null);
        }
    }

    onPointerDown(event, raycaster) {
        if (event.buttons !== 1)
            return;

        if (!this.#cursor.visible)
            return;

        if (this.houseViewModel.canPlaceAtCoords(this.#cursor.getCoords())) {
            this.houseViewModel.placeAtCoords(this.#cursor.getCoords());
        }
        else {
            this.houseViewModel.removeAtCoords(this.#cursor.getCoords());
        }
        this.#cursor.setModel(null);
    }
}

ScenePluginBase.registerPlugin(HouseModelEditorViewPlugin);