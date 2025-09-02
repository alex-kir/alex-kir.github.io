import ScenePluginBase from './ScenePluginBase.js';
import { BlockDirection } from '../models/BlockModel.js';
import { CMS } from '../models/CMS.js';

class HotkeysScenePlugin extends ScenePluginBase {

    onDocumentKeyDown(event) {
        // console.log(event);
        switch (event.key) {
            case 'ArrowUp':
                this.houseViewModel.setDirection(BlockDirection.North);
                break;
            case 'ArrowLeft':
                this.houseViewModel.setDirection(BlockDirection.West);
                break;
            case 'ArrowDown':
                this.houseViewModel.setDirection(BlockDirection.South);
                break;
            case 'ArrowRight':
                this.houseViewModel.setDirection(BlockDirection.East);
                break;

            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
                const { id } = CMS.getEntity(`key|${event.key}`);
                this.houseViewModel.setBlockName(id);
                break;
        }
    }
}

ScenePluginBase.registerPlugin(HotkeysScenePlugin);