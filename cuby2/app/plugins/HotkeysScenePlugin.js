import ScenePluginBase from './ScenePluginBase.js';
import { BlockDirection } from '../models/BlockModel.js';
import { CMS } from '../models/CMS.js';

class HotkeysScenePlugin extends ScenePluginBase {

    onDocumentKeyDown(event) {
        // console.log(event);
        switch (event.key) {
            case 'ArrowLeft':
                this.houseViewModel.rotateLeft();
                break;
            case 'ArrowRight':
                this.houseViewModel.rotateRight();
                break;

            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
                const { id } = CMS.getEntity(`key|${event.key}`);
                if (this.houseViewModel.activeBlockName == id)
                    this.houseViewModel.rotateRight();
                else
                    this.houseViewModel.setBlockName(id);
                break;
        }
    }
}

ScenePluginBase.registerPlugin(HotkeysScenePlugin);