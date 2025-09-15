
import HouseViewModel from './HouseViewModel.js'
import HouseModel from './HouseModel.js'
import ScenePluginBase from '../plugins/ScenePluginBase.js';

export default class RootViewModel {

    #plugins = [];
    get plugins() { return this.#plugins; }

    resourceManager;

    #houseViewModel = new HouseViewModel();
    get houseViewModel() { return this.#houseViewModel; }

    houseModel = new HouseModel();

    constructor(resourceManager) {
        this.resourceManager = resourceManager;
    }

    loadPlugins() {
        // TODO do not load twice
        for (const pluginClass of ScenePluginBase.registeredPluginClasses) {
            this.#plugins.push(new pluginClass());
        }
    }

    forEachPlugin(callback)
    {
        for (const plugin of this.#plugins)
        {
            callback(plugin);
        }
    }
}
