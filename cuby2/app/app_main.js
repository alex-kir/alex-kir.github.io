
import { shared_view_manager } from './app_view_manager.js';

import p1 from './plugins/DrawPlaneViewPlugin.js';
import p2 from './plugins/camera_control_view_plugin.js';
import p3 from './plugins/HouseModelEditorViewPlugin.js';
import p4 from './plugins/fps_view_plugin_class.js';
import p5 from './plugins/SyncHouseModelPlugin.js';
import './plugins/HotkeyScenePlugin.js'

import { HomePage } from './pages/HomePage.js';
import { SinglePageWindow } from 'widgets/widgets-core.js';

export function app_main(container) {

    const page = new HomePage(shared_view_manager.rootViewModel);
    new SinglePageWindow(container).Show(page);

    shared_view_manager.addPlugin(new p1());
    shared_view_manager.addPlugin(new p2());
    shared_view_manager.addPlugin(new p3());
    shared_view_manager.addPlugin(new p4());
    shared_view_manager.addPlugin(new p5());

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
