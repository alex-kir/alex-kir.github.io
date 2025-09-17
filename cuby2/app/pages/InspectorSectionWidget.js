import { BindableValue, TextWidget } from '../../widgets-lib/Widgets.Web/widgets-core.js';
import { VerticalStackWidget as VerticalStackWidget, BorderWidget, ButtonWidget, VerticalGridWidget, OverflowWidget } from '../../widgets-lib/Widgets.Web/widgets-ext.js';


export default class InspectorSectionWidget extends VerticalStackWidget {

    static #openIcon = '⏷';
    static #colosedIcon = '⏵';

    #headerHost;
    #bodyHost;

    HeaderTitleValue = new BindableValue();
    get HeaderTitle() { return this.HeaderTitleValue.Value };
    set HeaderTitle(value) { this.HeaderTitleValue.Value = value; }

    get BodyWidgets() { return this.#bodyHost.Widgets };
    set BodyWidgets(value) { this.#bodyHost.Widgets = value; }

    constructor() {
        super();

        const headerButton = new ButtonWidget();
        headerButton.Command.Subscribe(() => {
            this.#toggleCollapsed();
        });

        const headerText = new TextWidget();
        headerText.TextAlignment = [-1, 0];
        headerText.FontSize = 20;

        const headerLine = new BorderWidget();
        headerLine.Constraints.With('height', 1).With('bottom', 0);
        headerLine.FillColor = '#ccc';

        const headerHost = this.#headerHost = new OverflowWidget()
        headerHost.Constraints.With('height', 48);
        headerHost.Widgets = [headerText, headerLine, headerButton];

        const bodyHost = this.#bodyHost = new VerticalStackWidget();
        bodyHost.Padding = [8, 4, 0, 16];
        bodyHost.Spacing = 4;

        this.Widgets = [headerHost, bodyHost];

        this.HeaderTitleValue.Subscribe(() => {
            headerText.Text = InspectorSectionWidget.#openIcon + ' ' + this.HeaderTitle;
        });
    }

    #toggleCollapsed() {
        // if (this.Widgets.length == 1) {
        //     this.Widgets = [this.#headerHost, this.#bodyHost];
        // }
        // else {
        //     this.Widgets = [this.#headerHost];
        // }
    }
}
