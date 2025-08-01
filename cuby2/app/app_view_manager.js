import * as THREE from 'three';

export class app_view_plugin_class {
    onSceneCreated(viewManager) {
        console.log('=== app_view_plugin_class | on scene created ===');
    }
}

class app_view_manager_class {
    camera;
    scene;
    renderer;
    #_canvas;

    #_plugins = [];

    init(canvas) {
        //this.#_activeViewController = new app_view_controller_class();

        // NOTE: using window as singleton is not good but OK for web-development

        const camera = new THREE.PerspectiveCamera(45, 320 / 240, 1, 10000);
        this.camera = camera;
        this.camera.position.set(850, 400, 800);
        this.camera.lookAt(0, 0, 0);

        const scene = new THREE.Scene();
        this.scene = scene;
        this.scene.background = new THREE.Color(0xf0f0f0);

        // const canvas = document.querySelector('#canvas');
        this.#_canvas = canvas;
        this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setAnimationLoop(this.render.bind(this));

        // lights

        const ambientLight = new THREE.AmbientLight(0x606060, 3);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
        directionalLight.position.set(1, 0.75, 0.5).normalize();
        scene.add(directionalLight);

        // notify plugins

        const self = this; // closure for lambda
        this.#_plugins.forEach(p => p.onSceneCreated(self));

        window.addEventListener('resize', function () { self.onWindowResize() });
        this.onWindowResize();
    }

    onWindowResize() {
        //const container = document.querySelector('#container');
        //console.log(this.#_canvas);
        const container = this.#_canvas.parentNode;
        const w = container.offsetWidth;
        const h = container.offsetHeight;
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(w, h);

        this.render();
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    addPlugin(plugin) {
        this.#_plugins.push(plugin);
    }
}

export const shared_view_manager = new app_view_manager_class();