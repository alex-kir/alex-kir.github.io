import InspectorSectionWidget from '../pages/InspectorSectionWidget.js';
import ScenePluginBase from './ScenePluginBase.js';
import { ButtonWidget } from '../../widgets-lib/Widgets.Web/widgets-ext.js';
import { TextWidget } from '../../widgets-lib/Widgets.Web/widgets-core.js';
import { SaveHouseToJson } from '../models/SaveHouseToJson.js';
import { BlockModel } from '../models/BlockModel.js';
import { saveFileInDownloads } from '../utils.js'

class SaveHouseModelPlugin extends ScenePluginBase {

    #widget;

    constructor() {
        super();

        const jsonText = new TextWidget();
        jsonText.Text = 'JSON';
        jsonText.TextAlignment = [-1, 0];
        jsonText.Constraints.With('height', 32);

        const jsonDownload = new ButtonWidget();
        jsonDownload.Radius = 6;
        jsonDownload.StrokeColor = '#ccc';
        jsonDownload.StrokeThickness = 1;
        jsonDownload.Text = 'Download';
        jsonDownload.Constraints.With('height', 32);
        jsonDownload.Command.Subscribe(() => {
            const json = SaveHouseToJson.toJsonString(this.houseViewModel);
            saveFileInDownloads(json, 'house.json');
        });

        const csvText = new TextWidget();
        csvText.Text = 'CSV';
        csvText.TextAlignment = [-1, 0];
        csvText.Constraints.With('height', 32);

        const csvDownload = new ButtonWidget();
        csvDownload.Radius = 6;
        csvDownload.StrokeColor = '#ccc';
        csvDownload.StrokeThickness = 1;
        csvDownload.Text = 'Download';
        csvDownload.Constraints.With('height', 32);
        csvDownload.Command.Subscribe(() => {
            const csv = this.#toCsvString();
            saveFileInDownloads(csv, 'house.csv');
        });

        const csvCopy = new ButtonWidget();
        csvCopy.Radius = 6;
        csvCopy.StrokeColor = '#ccc';
        csvCopy.StrokeThickness = 1;
        csvCopy.Text = 'Copy';
        csvCopy.Constraints.With('height', 32);
        csvCopy.Command.Subscribe(() => {
            const csv = this.#toCsvString();
            navigator.clipboard.writeText(csv);
        });

        const section = this.#widget = new InspectorSectionWidget();
        section.HeaderTitle = "JSON / CSV";
        section.BodyWidgets = [jsonText, jsonDownload, csvText, csvCopy, csvDownload];
    }

    getWidget() { return [this.#widget, 200]; }

    #toCsvString() {
        const blocks = this.houseModel.blocks;
        if (blocks.size == 0)
            return;

        let minX = 10000000; // TODO
        let minZ = 10000000;
        let maxX = -1;
        let maxZ = -1;

        for (const block of blocks) {
            if (block instanceof BlockModel) {
                block.forEachCell_xz((b, x, z) => {
                    minX = Math.min(minX, x);
                    minZ = Math.min(minZ, z);
                    maxX = Math.max(maxX, x);
                    maxZ = Math.max(maxZ, z);
                });
            }
        }

        const columns = maxX - minX + 1;
        const rows = maxZ - minZ + 1;
        const data = Array.from({ length: rows }, () => Array(columns).fill(''));

        for (const block of blocks) {
            if (block instanceof BlockModel) {
                block.forEachCell_xz((b, x, z) => {
                    data[z - minZ][x - minX] = b.getCode_xz(x, z);
                });
            }
        }

        const csv = data.map(it => it.join(',')).join('\n');
        
        return csv;
    }
}

ScenePluginBase.registerPlugin(SaveHouseModelPlugin);