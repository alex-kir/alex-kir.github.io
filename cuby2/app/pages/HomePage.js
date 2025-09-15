import { RootWidget, ContainerWidget, ScrollWidget, TextWidget } from 'widgets/widgets-core.js';
import { OverflowWidget, VericalStackWidget, ButtonWidget, HorizontalGridWidget, VerticalGridWidget } from 'widgets/widgets-ext.js';
import { BlockDirection } from '../models/BlockModel.js';
import { CMS } from '../models/CMS.js';
import { SaveHouseToJson } from '../models/SaveHouseToJson.js';
import { BorderWidget } from '../../widgets-lib/Widgets.Web/widgets-ext.js';
import HouseModel from '../models/HouseModel.js';
import { Linq } from '../utils.js'

export class HomePage extends RootWidget {
    #rootViewModel;
    view3dHost;
    imageHost;

    constructor(rootViewModel) {
        super();
        this.#rootViewModel = rootViewModel;
        const vm = this.#rootViewModel.houseViewModel;

        const buttons = [];
        for (let i = 1; i <= 6; i = i + 1) {
            const { id, title } = CMS.getEntity(`key|${i}`);
            const titleOn = '\u25c9 ' + title.replace('\n', ' ');
            const titleOff = '\u2b58 ' + title.replace('\n', ' ');
            const button = this.#createButtonNoBorder(titleOff, function () {
                vm.setBlockName(id);
            });
            vm.activeToolChanged.subscribeAndNotify(function () {
                button.Text = vm.activeBlockName == id ? titleOn : titleOff;
            });
            button.TextAlignment = [-1, 0];
            button.Constraints.With('height', 32);
            buttons.push(button);
        }

        // const header = new HorizontalGridWidget();
        // header.Spacing = 8;
        // header.Constraints.With('height', 60);
        // header.Widgets = buttons;

        // ← → ↔ ↑ ↓ , ↕
        //'🡅' '🡆' '🡇' '🡄'
        // const footer1 = this.#createButton('↑', this.#commandForDirection(BlockDirection.North));
        // const footer2 = this.#createButton('→', this.#commandForDirection(BlockDirection.East));
        // const footer3 = this.#createButton('↓', this.#commandForDirection(BlockDirection.South));
        // const footer4 = this.#createButton('←', this.#commandForDirection(BlockDirection.West));

        const download = this.#createButton('Download JSON', this.#onDownloading.bind(this));
        download.Constraints.With('height', 32);

        // const footer = new HorizontalGridWidget();
        // footer.Spacing = 10;
        // footer.Constraints.With('height', 60);
        // footer.Widgets = [footer1, footer2, footer3, footer4];

        const view3dHost = new ContainerWidget();

        const imageHost = new ContainerWidget();
        imageHost.Constraints.With('top', 0);
        imageHost.Constraints.With('right', 0);
        imageHost.Constraints.With('width', 100);
        imageHost.Constraints.With('height', 100);

        const host2 = new OverflowWidget();
        host2.Widgets = [view3dHost, imageHost];

        // const content = new VerticalGridWidget();
        // content.Widgets = [host2, footer];

        const step1 = new TextWidget();
        step1.Text = '⏷ Step 1. Place modules';
        step1.Constraints.With('height', 64);
        step1.TextAlignment = [-1, 0];
        step1.FontSize = 20;

        const space = new TextWidget();
        space.Constraints.With('height', 32);
        space.Text = "Rotate";
        space.TextAlignment = [-1, 0];

        // ⟲ U+27F2 ⟳ U+27F3  ← → 
        // ↶	ANTICLOCKWISE TOP SEMICIRCLE ARROW
        // ↷	CLOCKWISE TOP SEMICIRCLE ARROW
        const rotateLeft = this.#createButton('↶ Left', function () { vm.rotateLeft(); });
        const rotateRight = this.#createButton('↷ Right', function () { vm.rotateRight(); });

        const rotate = new HorizontalGridWidget();
        rotate.Spacing = 4;
        rotate.Constraints.With('height', 32);
        rotate.Widgets = [rotateLeft, rotateRight];

        const stepRules = new TextWidget();
        stepRules.Text = '⏷ Rules';
        stepRules.Constraints.With('height', 64);
        stepRules.TextAlignment = [-1, 0];
        stepRules.FontSize = 20;

        const validationMode = this.#createValidataionMode();

        const printUndefined = this.#createButton('Copy undefined rules', this.#printUndefined.bind(this));
        printUndefined.Constraints.With('height', 32);


        const step2 = new TextWidget();
        step2.Text = '⏷ Step 2. Save to JSON';
        step2.Constraints.With('height', 64);
        step2.TextAlignment = [-1, 0];
        step2.FontSize = 20;



        const step3 = new TextWidget();
        step3.Text = '⏵ Step 3. - - -';
        step3.Constraints.With('height', 64);
        step3.TextAlignment = [-1, 0];
        step3.FontSize = 20;

        const pluginWidgetInfos = [];
        rootViewModel.forEachPlugin(p => {
            const info = p.getWidget();
            if (info)
                pluginWidgetInfos.push(info);
        });

        const pluginWidgets = new Linq(pluginWidgetInfos)
            .OrderBy(it => it.at(1))
            .Select(it => it.at(0))
            .ToList();

        const stack = new VericalStackWidget();
        stack.Padding = [8, 8, 8, 8];
        stack.Spacing = 4;
        stack.Widgets = [step1, ...buttons, space, rotate, stepRules, validationMode, printUndefined, step2, download, step3, ...pluginWidgets];

        const scroll = new ScrollWidget();
        scroll.Constraints.With('width', 300);
        scroll.Content = stack;

        const line = new BorderWidget();
        line.Constraints.With('width', 5);
        line.FillColor = '#ccc';

        const grid = new HorizontalGridWidget();
        grid.Widgets = [host2, line, scroll];

        this.view3dHost = view3dHost;
        this.imageHost = imageHost;
        this.Content = grid;
    }

    #createValidataionMode() {
        // ☐ U+2610 — пустой чекбокс
        // ☑ U+2611 — отмеченный чекбокс
        // ☒ U+2612 — чекбокс с крестиком

        const title = 'Allow if not defined';
        const titleOn = '\u2611 ' + title;
        const titleOff = '\u2610 ' + title;
        const button = this.#createButtonNoBorder(titleOff, function () {
            HouseModel.validatePlacementDefaults = !HouseModel.validatePlacementDefaults;
            button.Text = HouseModel.validatePlacementDefaults ? titleOn : titleOff;
        });
        button.Text = HouseModel.validatePlacementDefaults ? titleOn : titleOff;
        // vm.activeToolChanged.subscribeAndNotify(function () {
        //     button.Text = vm.activeBlockName == id ? titleOn : titleOff;
        // });
        button.TextAlignment = [-1, 0];
        button.Constraints.With('height', 32);
        return button;
    }

    #printUndefined() {
        const rules = this.#rootViewModel.houseViewModel.houseModel.printUndefinedRules();
        if (rules.length)
            navigator.clipboard.writeText('new rules:\n' + rules);
        else
            navigator.clipboard.writeText('no new rules found');
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

    #createButtonNoBorder(title, command) {
        const button = new ButtonWidget();
        // button.Radius = 6;
        // button.StrokeColor = '#ccc';
        // button.StrokeThickness = 1;
        button.Text = title;
        button.Command = command;
        return button;
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

    // #commandForTool(name) {
    //     const vm = this.#rootViewModel.houseViewModel;
    //     return function () { vm.setBlockName(name); };
    // }

    // #commandForDirection(name) {
    //     const vm = this.#rootViewModel.houseViewModel;
    //     return function () { vm.setDirection(name); };
    // }
}
