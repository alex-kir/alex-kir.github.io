import { BlockModel } from './BlockModel.js';
import HouseModel from './HouseModel.js';
import HouseViewModel from './HouseViewModel.js';
import RootViewModel from './RootViewModel.js';

export class SaveHouseToJson {

    static findBlocks(obj) {
        if (obj instanceof HouseModel)
            return obj.blocks;
        if (obj instanceof HouseViewModel)
            return SaveHouseToJson.findBlocks(obj.houseModel);
        if (obj instanceof RootViewModel)
            return SaveHouseToJson.findBlocks(obj.houseViewModel);
        return null;
    }

    static toJsonString(obj) {
        const blocks = SaveHouseToJson.findBlocks(obj);

        let minX = 10000000; // TODO
        let minY = 10000000;

        for (const block of blocks) {
            if (block instanceof BlockModel) {
                block.forEachCell(function (b, x, y) {
                    minX = Math.min(minX, x);
                    minY = Math.min(minY, y);
                });
            }
        }

        const data = [];

        for (const block of blocks) {
            if (block instanceof BlockModel) {
                block.forEachCell((b, x, y) => {
                    data.push({
                        code: b.getCode(x, y),
                        x: x - minX,
                        z: y - minY,
                    });
                });
            }
        }

        const json = JSON.stringify(data, null, 2);

        return json;
    }
}
