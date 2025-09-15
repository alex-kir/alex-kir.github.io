

import { SinglePageWindow } from 'widgets/widgets-core.js';
import { HomePage } from './pages/HomePage.js';
import AppSceneManager from './AppSceneManager.js';
import AppResourceManager from './AppResourceManager.js'
import RootViewModel from './models/RootViewModel.js';

import './plugins/DrawPlaneScenePlugin.js';
import './plugins/CameraControlScenePlugin.js';
import './plugins/HouseModelEditorScenePlugin.js';
import './plugins/FpsScenePlugin.js';
import './plugins/HotkeysScenePlugin.js'
import './plugins/SyncHouseBlocksScenePlugin.js';
import './plugins/SyncHouseColumnsScenePlugin.js'

export function AppMain(container) {

    const resourceManager = new AppResourceManager();

    const rootViewModel = new RootViewModel(resourceManager);
    rootViewModel.loadPlugins();

    const page = new HomePage(rootViewModel);
    const window = new SinglePageWindow(container);
    window.Show(page);

    const sceneManager = new AppSceneManager();
    sceneManager.init(page.view3dHost.PlatformView, rootViewModel);

    var img = document.createElement('img');
    img.style.position = 'absolute';
    img.style.right = '0px';
    img.style.top = '0px';
    img.style.width = '100px';
    img.style.height = '100px';
    img.style.opacity = 0.7;
    img.src = './textures/cuby-logo.jpg';
    page.imageHost.PlatformView.appendChild(img);
}
