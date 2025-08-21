
// WIDGETS_DEBUG = false;

class DriftHeaderWidget extends OverflowWidget {
    #_bg = new BorderWidget();
    #_text = new TextWidget();

    constructor() {
        super();
        const self = this;

        this.#_bg.FillColor = DarkDimmedTheme.BackgroundColor1;

        this.#_text.TextColor = DarkDimmedTheme.TextColor1;
        this.#_text.Text = 'Drift Metrika';

        this.Widgets = [this.#_bg, this.#_text];
        this.Constraints.With('height', 80);
    }
}

class DriftFooterWidget extends OverflowWidget {
    #_bg = new BorderWidget();
    #_text = new TextWidget();

    constructor() {
        super();
        const self = this;

        // this.#_bg.FillColor = DarkDimmedTheme.BackgroundColor2;

        this.#_text.TextColor = DarkDimmedTheme.TextColor2;
        this.#_text.Text = 'Contacts';

        this.Widgets = [this.#_bg, this.#_text];
        this.Constraints.With('height', 50);
    }
}

function CreateTestButton1(text) {
    const item1 = new ButtonWidget();
    item1.Size = [100, 100];
    item1.Text = text;
    item1.TextColor = 'white';
    item1.Radius = 10;
    item1.FillColor = 'rgb(0,161,231)';
    item1.StrokeColor = 'white';
    item1.StrokeThickness = 2;
    return item1;
}

class HomePage extends RootWidget {
    constructor() {
        super();

        const header = new DriftHeaderWidget();
        const footer = new DriftFooterWidget();

        const item1 = new ButtonWidget();
        item1.Size = [100, 100];
        item1.Text = "ITEM 1";
        item1.TextColor = 'white';
        item1.Radius = 10;
        item1.FillColor = 'rgb(0,161,231)';
        item1.StrokeColor = 'white';
        item1.StrokeThickness = 2;

        const item2 = new ButtonWidget();
        // item2.Position = [0, 150];
        // item2.Size = [200 - ScrollWidget.ScrollBarSize, 100];
        item2.Size = [100, 100];
        item2.Text = "ITEM 2";
        item2.TextColor = 'white';
        item2.Radius = 10;
        item2.FillColor = 'rgb(0,161,231)';
        item2.StrokeColor = 'white';
        item2.StrokeThickness = 2;
        item2.ClickAction = function () {
            list.Widgets = [...list.Widgets, CreateTestButton1(`test button - ${list.Widgets.length}`)];
        };

        // const hor = new HorizontalGridWidget();
        // hor.Widgets = [item1, item2];

        const list = new VericalStackWidget();
        list.Size = [200, 400];
        list.Widgets = [item1, item2];

        const scroll = new ScrollWidget();
        scroll.Content = list;


        const grid = new VerticalGridWidget();
        grid.Widgets = [header, scroll, footer];

        const bg = new BorderWidget();
        bg.FillColor = DarkDimmedTheme.BackgroundColor2;

        const content = new OverflowWidget()
        content.Widgets = [bg, grid];

        this.Content = content;
    }
}

(async function () {
    // debug_ln("test message");
    /*
        const text = new TextWidget();
        //text.Position = [50, 20];
        text.Size = [200, 100];
        text.Text = "the text widget";
        // debug_ln(tw);
    
        const text1 = new TextWidget();
        text1.Position = [10, 10];
        text1.Size = [150, 50];
        text1.TextAlignment = [-1, -1]
        text1.Text = "left, top";
    
        const text2 = new TextWidget();
        text2.Position = [10, 70];
        text2.Size = [150, 50];
        text2.TextAlignment = [1, 1]
        text2.Text = "right, bottom";
    
        const grid = new ContainerWidget();
        grid.Position = [150, 25];
        grid.Size = [300, 500];
        grid.Widgets = [text];
        grid.Gestures = [new DefaultButtonGesture(function () { debug_ln('CLICK BUTTON') }, {
            AnimateDown: function () { text.TextColor = 'red' },
            AnimateUp: function () { text.TextColor = 'black' },
            AnimateHover: function () { text.TextColor = 'brown' },
        })];
    
        const border = new BorderWidget();
        border.Size = [200, 200];
        border.Position = [400, 20];
        border.Radius = 10;
        //canv1.StrokeThickness = 4;
        border.FillColor = 'rgb(0,161,231)';
        //canv1.StrokeColor = '#ffffff55';
    
        const item1 = new BorderWidget();
        item1.Size = [100, 100];
        item1.Radius = 10;
        item1.FillColor = 'red';
    
        const item2 = new BorderWidget();
        item2.Position = [0, 150];
        item2.Size = [200 - ScrollWidget.ScrollBarSize, 100];
        item2.Radius = 10;
        item2.FillColor = 'green';
    
        const list = new ContainerWidget();
        list.Size = [200, 400];
        list.Widgets = [item1, item2];
    
        const scroll = new ScrollWidget();
        scroll.Position = [300, 100];
        scroll.Size = [200, 200];
        scroll.Content = list;
    
        const top = new ContainerWidget();
        top.Widgets = [grid, text1, text2, border, scroll];
    
        const page = new RootWidget();
        page.Content = top;
        // debug_ln('page.Content');
        // debug_ln(page.Content);
    
    
    
        // SinglePageWindow.Show(page);
    */

    new SinglePageWindow(document.body).Show(new HomePage());

    //https://learn.javascript.ru/fetch
    //const response = await fetch('data.json');
    //debug_ln(response);
    // if (response.ok) { // если HTTP-статус в диапазоне 200-299
    //     // получаем тело ответа (см. про этот метод ниже)
    //     let json = await response.json();
    //   } else {
    //     alert("Ошибка HTTP: " + response.status);
    //   }

    // while (true) {
    //     for (let i = 10; i <= 90; i = i + 1) {
    //         await delay(33);
    //         text.Position = [i, 50];
    //         border.Size = [200, 20 + i * 2];
    //     }
    //     for (let i = 90; i >= 10; i = i - 1) {
    //         await delay(33);
    //         text.Position = [i, 50];
    //         border.Size = [200, 20 + i * 2];
    //     }
    // }
})();
