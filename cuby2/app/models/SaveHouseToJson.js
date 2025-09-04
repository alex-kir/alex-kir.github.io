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
                for (let dx = 0; dx < block.realWidth; dx++) {
                    for (let dy = 0; dy < block.realHeight; dy++) {
                        minX = Math.min(minX, block.realX + dx);
                        minY = Math.min(minY, block.realY + dy);
                    }
                }
            }
        }

        const data = [];

        for (const block of blocks) {
            if (block instanceof BlockModel) {
                for (let dx = 0; dx < block.realWidth; dx++) {
                    for (let dy = 0; dy < block.realHeight; dy++) {
                        const item = {
                            id: block.name,
                            dir: block.direction,
                            x: block.realX + dx - minX,
                            y: block.realY + dy - minY,
                        };
                        data.push(item);
                    }
                }
            }
        }

        const json = JSON.stringify(data, null, 2);// "Hello, world!";

        return json;
    }
}
