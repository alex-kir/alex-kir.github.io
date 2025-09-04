import { RootWidget, ContainerWidget } from 'widgets/widgets-core.js';
import { ButtonWidget, HorizontalGridWidget, VerticalGridWidget } from 'widgets/widgets-ext.js';
import { BlockDirection } from '../models/BlockModel.js';
import { OverflowWidget } from '../../widgets-lib/Widgets.Web/widgets-ext.js';
import { CMS } from '../models/CMS.js';
import { SaveHouseToJson } from '../models/SaveHouseToJson.js';

export class HomePage extends RootWidget {
    #rootViewModel;
    view3dHost;
    imageHost;

    constructor(rootViewModel) {
        super();
        this.#rootViewModel = rootViewModel;

        const buttons = [];
        for (let i = 1; i <= 6; i = i + 1) {
            const { id, title } = CMS.getEntity(`key|${i}`);
            buttons.push(this.#createButton(title, this.#commandForTool(id)));
        }

        const header = new HorizontalGridWidget();
        header.Spacing = 8;
        header.Constraints.With('height', 60);
        header.Widgets = buttons;

        // ← → ↔ ↑ ↓ , ↕
        //'🡅' '🡆' '🡇' '🡄'
        const footer1 = this.#createButton('↑', this.#commandForDirection(BlockDirection.North));
        const footer2 = this.#createButton('→', this.#commandForDirection(BlockDirection.East));
        const footer3 = this.#createButton('↓', this.#commandForDirection(BlockDirection.South));
        const footer4 = this.#createButton('←', this.#commandForDirection(BlockDirection.West));

        const download = this.#createButton('Download\nJSON', this.#onDownloading.bind(this));

        const footer = new HorizontalGridWidget();
        footer.Spacing = 10;
        footer.Constraints.With('height', 60);
        footer.Widgets = [footer1, footer2, footer3, footer4, download];

        const view3dHost = new ContainerWidget();

        const imageHost = new ContainerWidget();
        imageHost.Constraints.With('top', 0);
        imageHost.Constraints.With('right', 0);
        imageHost.Constraints.With('width', 100);
        imageHost.Constraints.With('height', 100);

        const host2 = new OverflowWidget();
        host2.Widgets = [view3dHost, imageHost];

        const content = new VerticalGridWidget();
        content.Widgets = [header, host2, footer];

        this.view3dHost = view3dHost;
        this.imageHost = imageHost;
        this.Content = content;
    }

    #onDownloading() {

        const json = SaveHouseToJson.toJsonString(this.#rootViewModel);

        /*
        Create a Blob:
        Convert the data into a Blob object. A Blob represents file-like immutable raw data.
         The Blob constructor takes an array of data parts and an options object, where type 
         can specify the MIME type of the file (e.g., 'text/plain', 'text/csv', 'application/json').
        */

        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');

        a.href = url;
        a.download = 'house.json';

        //    document.body.appendChild(a); // Optional, for compatibility
        a.click();
        // document.body.removeChild(a); // Optional, for cleanup

        URL.revokeObjectURL(url);
    }

    #createButton(title, command) {
        const button = new ButtonWidget();
        button.Radius = 6;
        button.StrokeColor = '#ccc';
        button.StrokeThickness = 1;
        button.Text = title;
        button.Command = command;
        return button;
    }

    #commandForTool(name) {
        const vm = this.#rootViewModel.houseViewModel;
        return function () { vm.setBlockName(name); };
    }

    #commandForDirection(name) {
        const vm = this.#rootViewModel.houseViewModel;
        return function () { vm.setDirection(name); };
    }
}
