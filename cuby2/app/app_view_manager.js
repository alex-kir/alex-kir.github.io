import * as THREE from 'three';
import RootViewModel from './models/RootViewModel.js'

class app_view_manager_class {

    #rootViewModel = new RootViewModel();
    get rootViewModel() { return this.#rootViewModel; }

    get canvas() { return this.renderer.domElement; }
    get container() { return this.renderer.domElement.parentNode; }

    camera;
    scene;
    renderer;

    #raycaster = new THREE.Raycaster();
    #raycasterPointer = new THREE.Vector2();

    #_plugins = [];

    init(container) {
        // NOTE: using window as singleton is not good but OK for web-development

        const camera = new THREE.PerspectiveCamera(45, 320 / 240, 1, 10000);
        this.camera = camera;
        this.camera.position.set(1700, 800, 1600);
        this.camera.lookAt(0, 0, 0);

        const scene = new THREE.Scene();
        this.scene = scene;
        this.scene.background = new THREE.Color(0xf0f0f0);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setAnimationLoop(this.render.bind(this));

        container.appendChild(this.renderer.domElement);

        // lights

        const ambientLight = new THREE.AmbientLight(0x606060, 3);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
        directionalLight.position.set(1, 0.75, 0.5).normalize();
        scene.add(directionalLight);

        // notify plugins

        for (const p of this.#_plugins) { p.onSceneCreated(this); }

        // subscribe to mouse and keyboard

        container.addEventListener('pointermove', this.#onPointerMove.bind(this));
        container.addEventListener('pointerdown', this.#onPointerDown.bind(this));

        document.addEventListener('keydown', this.#onDocumentKeyDown.bind(this));
        document.addEventListener('keyup', this.#onDocumentKeyUp.bind(this));

        // observe resize

        new ResizeObserver(this.#onContainerResize.bind(this)).observe(container);
        this.#onContainerResize();
    }

    #onPointerMove(event)
    {
        this.#updateRaycaster(event);
        for (const p of this.#_plugins) { p.onPointerMove(event, this.#raycaster); }
    }

    #onPointerDown(event)
    {
        this.#updateRaycaster(event);
        for (const p of this.#_plugins) { p.onPointerDown(event, this.#raycaster); }
    }

    #onDocumentKeyDown(event)
    {
        for (const p of this.#_plugins) { p.onDocumentKeyDown(event); }
    }

    #onDocumentKeyUp(event)
    {
        for (const p of this.#_plugins) { p.onDocumentKeyUp(event); }
    }

    #updateRaycaster(event) {
        const x = event.layerX;
        const y = event.layerY;
        const width = event.target.offsetWidth;
        const height = event.target.offsetHeight;
        this.#raycasterPointer.set((x / width) * 2 - 1, 1 - (y / height) * 2);
        this.#raycaster.setFromCamera(this.#raycasterPointer, shared_view_manager.camera);
        return true;
    }

    #onContainerResize() {

        const container = this.container;
        const w = container.offsetWidth;
        const h = container.offsetHeight;
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(w, h);

        this.render();
    }

    render() {
        for (const p of this.#_plugins) { p.onRender(this); }

        this.renderer.render(this.scene, this.camera);
    }

    addPlugin(plugin) {
        this.#_plugins.push(plugin);
    }
}

export const shared_view_manager = new app_view_manager_class();