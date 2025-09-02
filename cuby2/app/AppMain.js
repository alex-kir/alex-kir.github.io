
import { shared_view_manager } from './app_view_manager.js';

import './plugins/DrawPlaneScenePlugin.js';
import './plugins/CameraControlScenePlugin.js';
import './plugins/HouseModelEditorScenePlugin.js';
import './plugins/FpsScenePlugin.js';
import './plugins/HotkeysScenePlugin.js'
import './plugins/SyncHouseBlocksScenePlugin.js';
import './plugins/SyncHouseColumnsScenePlugin.js'

import { HomePage } from './pages/HomePage.js';
import { SinglePageWindow } from 'widgets/widgets-core.js';

export function AppMain(container) {

    const page = new HomePage(shared_view_manager.rootViewModel);
    new SinglePageWindow(container).Show(page);

    shared_view_manager.init(page.view3dHost.PlatformView);

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
