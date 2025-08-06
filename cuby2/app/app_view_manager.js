import * as THREE from 'three';

class app_view_manager_class {


    get canvas() { return this.renderer.domElement; }
    get container() { return this.renderer.domElement.parentNode; }

    camera;
    scene;
    renderer;

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

        window.addEventListener('resize', this.onWindowResize.bind(this)); // TODO refactor: stop using 'window'
        this.onWindowResize();
    }

    onWindowResize() {

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