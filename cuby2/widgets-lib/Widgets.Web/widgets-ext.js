
import { ContainerWidget, CanvasWidget, TextWidget, AGesture, ATheme, BindableValue, ObservableSignal } from './widgets-core.js'

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export class BorderWidget extends CanvasWidget {
    RadiusValue = new BindableValue(0);
    get Radius() { return this.RadiusValue.Value };
    set Radius(value) { this.RadiusValue.Value = value; }

    FillColorValue = new BindableValue(null);
    get FillColor() { return this.FillColorValue.Value };
    set FillColor(value) { this.FillColorValue.Value = value; }

    StrokeColorValue = new BindableValue(null);
    get StrokeColor() { return this.StrokeColorValue.Value };
    set StrokeColor(value) { this.StrokeColorValue.Value = value; }

    StrokeThicknessValue = new BindableValue(0);
    get StrokeThickness() { return this.StrokeThicknessValue.Value };
    set StrokeThickness(value) { this.StrokeThicknessValue.Value = value; }


    constructor() {
        super();
        this.DrawFunc = this.#DrawBorderWidget.bind(this);
        const invalidate = this.InvalidateVisual.bind(this);
        this.RadiusValue.Subscribe(invalidate);
        this.FillColorValue.Subscribe(invalidate);
        this.StrokeColorValue.Subscribe(invalidate);
        this.StrokeThicknessValue.Subscribe(invalidate);
    }

    #DrawBorderWidget(dh, width, height) {
        const t = (this.StrokeColor) ? this.StrokeThickness / 2 : 0;
        const r = this.Radius;

        const x1 = t;
        const x2 = width / 2;
        const x3 = width - t;
        const y1 = t;
        const y2 = height / 2;
        const y3 = height - t;

        dh.DrawPath(this.FillColor, true, this.StrokeThickness, this.StrokeColor, [
            'm', t, height / 2,
            'arc', x1, y1, x2, y1, r,
            'arc', x3, y1, x3, y2, r,
            'arc', x3, y3, x2, y3, r,
            'arc', x1, y3, x1, y2, r,
        ]);

    }
}

class DefaultButtonGesture extends AGesture {
    #_down = false;
    #_clickFunc;
    #_animateUp;
    #_animateDown;
    #_animateHover;

    constructor(clickFunc, { AnimateUp, AnimateDown, AnimateHover }) {
        super();
        this.#_clickFunc = clickFunc;
        this.#_animateDown = AnimateDown;
        this.#_animateUp = AnimateUp;
        this.#_animateHover = AnimateHover;
    }

    OnEvent(ev, widget) {
        if (!(ev instanceof PointerEvent))
            return;

        // TODO refactor events processing

        if (ev.type == 'pointerleave') {
            if (this.#_animateUp) {
                this.#_animateUp();
            }
        }

        if (ev.type == 'pointermove') {
            const [sx, sy] = widget.Size;
            if (0 <= ev.offsetX && ev.offsetX < sx && 0 <= ev.offsetY && ev.offsetY < sy) {
                if (this.#_down) {
                    if (this.#_animateDown) {
                        this.#_animateDown();
                    }
                }
                else {

                    if (this.#_animateHover) {
                        this.#_animateHover();
                    }
                }
            }
            else {
                if (this.#_animateUp) {
                    this.#_animateUp();
                }
            }
        }

        if (ev.type == 'pointerdown') {
            this.#_down = true;
            if (this.#_animateDown) {
                this.#_animateDown();
            }
            return;
        }

        if (this.#_down === false) {
            return;
        }

        if (ev.type == 'pointerup') {
            this.#_down = false;
            if (this.#_animateUp) {
                this.#_animateUp();
            }
            const [sx, sy] = widget.Size;
            if (0 <= ev.offsetX && ev.offsetX < sx && 0 <= ev.offsetY && ev.offsetY < sy) {
                this.#_clickFunc();
            }
        }
    }
}

export class OverflowWidget extends ContainerWidget {
    constructor() {
        super();
        this.SizeValue.Subscribe(this.Layout.bind(this));
        this.WidgetsValue.Subscribe(this.Layout.bind(this));
    }

    Layout() {
        const widgets = this.Widgets;
        if (!widgets || widgets.length == 0)
            return;

        const [width, height] = this.Size;
        if (width < 1 || height < 1)
            return;

        for (const widget of widgets) {

            const lp = widget.Constraints;
            const [x, w] = OverflowWidget.CalculateSize(width, lp, 'width', 'left', 'right');
            const [y, h] = OverflowWidget.CalculateSize(height, lp, 'height', 'top', 'bottom');

            widget.Position = [x, y];
            widget.Size = [w, h];
            // const left = widget.Constraints.GetOrDefault('left', 0);
            // const right = widget.Constraints.GetOrDefault('right', 0);
            // const top = widget.Constraints.GetOrDefault('top', 0);
            // const bottom = widget.Constraints.GetOrDefault('bottom', 0);

            // widget.Position = [left, top];
            // widget.Size = [width - left - right, height - top - bottom];
        }
    }

    static CalculateSize(
        parentAvailableWidth,
        pp,
        widthName,
        leftName,
        rightName) {
        // TODO use left and right proportional
        const tryGetWidth = pp.TryGet(widthName);
        const tryGetLeft = pp.TryGet(leftName);
        const tryGetRight = pp.TryGet(rightName);

        let pos = 0;
        let size = 0;

        if (tryGetWidth[0]) {
            size = tryGetWidth[1];
            if (tryGetLeft[0]) {
                pos = tryGetLeft[1];
            }
            else {
                if (tryGetRight[0]) {
                    pos = parentAvailableWidth - tryGetRight[1] - tryGetWidth[1];
                }
                else {
                    pos = (parentAvailableWidth - tryGetWidth[1]) / 2;
                }
            }
        }
        else {
            const left = tryGetLeft[0] ? tryGetLeft[1] : 0;
            const right = tryGetRight[0] ? tryGetRight[1] : 0;
            pos = left;
            size = parentAvailableWidth - left - right;
        }

        return [pos, size];
    }
}

export class HorizontalGridWidget extends ContainerWidget {

    SpacingValue = new BindableValue(0);
    get Spacing() { return this.SpacingValue.Value };
    set Spacing(value) { this.SpacingValue.Value = value; }

    constructor() {
        super();
        this.SizeValue.Subscribe(this.Layout.bind(this));
        this.WidgetsValue.Subscribe(this.Layout.bind(this));
    }

    Layout() {
        const widgets = this.Widgets;
        if (!widgets || widgets.length == 0)
            return;

        let x = 0;//Padding.Left;
        let pixelPerPercent = HorizontalGridWidget.CalculatePixelsPerPercent(
            widgets, this.Spacing, this.Size[0] - 0/*Padding.Horizontal*/,
            'width', 'width_proportional', 'left', 'right');

        for (const child of widgets) {
            x += this.#LayoutChild(child, x, pixelPerPercent);
            x += this.Spacing;
        }
    }

    #LayoutChild(child, shiftX, pixelPerPercent) {
        var lp = child.Constraints;
        const [x, width] = HorizontalGridWidget.CalculateSize(lp, 'width', 'width_proportional', 'left', pixelPerPercent);
        var [y, height] = OverflowWidget.CalculateSize(this.Size[1] - 0/*Padding.Vertical*/, lp, 'height', 'top', 'bottom');

        child.Position = [shiftX + x, y];
        child.Size = [width, height];

        return x + width + lp.GetOrDefault('right', 0);
    }

    static CalculateSize(lp, widthName, widthProportionalName, leftName, pixelPerPercent) {
        let [has, width] = lp.TryGet(widthName);
        if (!has) {
            const width2 = lp.GetOrDefault(widthProportionalName, 1);
            width = width2 * pixelPerPercent;
        }
        const left = lp.GetOrDefault(leftName, 0);
        return [left, width];
    }

    static CalculatePixelsPerPercent(widgets, spacing, parentAvailablePixels,
        widthName, widthProportionalName, leftName, rightName) {
        let percents = 0;
        let pixels = widgets.length > 1 ? (widgets.length - 1) * spacing : 0;

        for (const child of widgets) {
            const pp = child.Constraints;
            const left = pp.GetOrDefault(leftName, 0);
            const right = pp.GetOrDefault(rightName, 0);

            pixels += left + right;

            if (pp.Has(widthName)) {
                pixels += pp.Get(widthName);
            }
            else {
                const width2 = pp.GetOrDefault(widthProportionalName, 1)
                percents += width2;
            }
        }
        var availablePixels = parentAvailablePixels - pixels;
        var pixelPerPercent = availablePixels > 0 ? availablePixels / percents : 0;
        return pixelPerPercent;
    }
}

export class VerticalGridWidget extends ContainerWidget {

    SpacingValue = new BindableValue(0);
    get Spacing() { return this.SpacingValue.Value };
    set Spacing(value) { this.SpacingValue.Value = value; }

    constructor() {
        super();
        this.SizeValue.Subscribe(this.Layout.bind(this));
        this.WidgetsValue.Subscribe(this.Layout.bind(this));
    }

    Layout() {
        const widgets = this.Widgets;
        if (!widgets)
            return;

        const [width, height] = this.Size;
        if (width < 1 || height < 1)
            return;

        let y = 0;//Padding.Top;
        let pixelPerPercent = HorizontalGridWidget.CalculatePixelsPerPercent(
            widgets, this.Spacing, this.Size[1] - 0/*Padding.Vertical*/,
            'height', 'height_proportional', 'top', 'bottom');

        for (const child of widgets) {
            y += this.#LayoutChild(child, y, pixelPerPercent);
            y += this.Spacing;
        }
    }

    #LayoutChild(child, shiftY, pixelPerPercent) {
        var lp = child.Constraints;
        var [x, width] = OverflowWidget.CalculateSize(this.Size[0] - 0/*Padding.Horizontal*/, lp, 'width', 'left', 'right');
        const [y, height] = HorizontalGridWidget.CalculateSize(lp, 'height', 'height_proportional', 'top', pixelPerPercent);

        child.Position = [x, shiftY + y];
        child.Size = [width, height];

        return y + height + lp.GetOrDefault('bottom', 0);
    }
}


export class VerticalStackWidget extends ContainerWidget {

    static #zeroPadding = [0, 0, 0, 0];

    SpacingValue = new BindableValue(0);
    get Spacing() { return this.SpacingValue.Value };
    set Spacing(value) { this.SpacingValue.Value = value; }

    PaddingValue = new BindableValue(VerticalStackWidget.#zeroPadding);
    get Padding() { return this.PaddingValue.Value };
    set Padding(value) { this.PaddingValue.Value = value; } // TODO validate value

    constructor() {
        super();
        this.SizeValue.Subscribe(this.Layout.bind(this));
        this.WidgetsValue.Subscribe(this.Layout.bind(this));
        // TODO subscribe to children
    }

    Layout() {
        const widgets = this.Widgets;
        if (!widgets)
            return;
        const n = widgets.length;
        const [paddingLeft, paddingTop, paddingRight, paddingBottom] = this.Padding;
        let y = paddingTop;
        const width = this.Size[0];
        for (let i = 0; i < n; i++) {
            if (i > 0)
                y = y + this.Spacing;
            const wid = widgets[i];
            const cc = wid.Constraints;
            const childHeight = cc.Has('height') ? cc.Get('height') : wid.Size[1];
            const childLeft = cc.Has('left') ? cc.Get('left') : 0;
            const childRight = cc.Has('right') ? cc.Get('right') : 0;
            wid.Position = [childLeft + paddingLeft, y];
            wid.Size = [width - childLeft - childRight - paddingLeft - paddingRight, childHeight];
            y = y + wid.Size[1];
        }

        y += paddingBottom;
        const [x, y0] = this.Size;
        if (y0 != y) {
            this.Size = [x, y];
        }
    }
}

export class ButtonWidget extends OverflowWidget {
    #_bg = new BorderWidget();
    #_text = new TextWidget();
    #_anim = new BorderWidget();

    RadiusValue = new BindableValue(0);
    get Radius() { return this.RadiusValue.Value };
    set Radius(value) { this.RadiusValue.Value = value; }

    FillColorValue = new BindableValue(null);
    get FillColor() { return this.FillColorValue.Value };
    set FillColor(value) { this.FillColorValue.Value = value; }

    StrokeColorValue = new BindableValue(null);
    get StrokeColor() { return this.StrokeColorValue.Value };
    set StrokeColor(value) { this.StrokeColorValue.Value = value; }

    StrokeThicknessValue = new BindableValue(0);
    get StrokeThickness() { return this.StrokeThicknessValue.Value };
    set StrokeThickness(value) { this.StrokeThicknessValue.Value = value; }

    TextValue = new BindableValue(null);
    get Text() { return this.TextValue.Value };
    set Text(value) { this.TextValue.Value = value; }

    TextColorValue = new BindableValue(null);
    get TextColor() { return this.TextColorValue.Value };
    set TextColor(value) { this.TextColorValue.Value = value; }

    get TextAlignment() { return this.#_text.TextAlignment };
    set TextAlignment(value) { this.#_text.TextAlignment = value; }

    ClickAction = null;
    Command = new ObservableSignal();

    constructor() {
        super();
        const self = this;

        this.Widgets = [this.#_bg, this.#_text, this.#_anim];
        this.Gestures = [new DefaultButtonGesture(function () { self.OnClick() }, {
            AnimateDown: function () { self.#_anim.FillColor = '#00000010'; },
            AnimateUp: function () { self.#_anim.FillColor = '#00000000'; },
            AnimateHover: function () { self.#_anim.FillColor = '#ffffff10'; },
        })];

        this.RadiusValue.Subscribe(function () { self.#_bg.Radius = self.Radius; self.#_anim.Radius = self.Radius; });
        this.FillColorValue.Subscribe(function () { self.#_bg.FillColor = self.FillColor; });
        this.StrokeColorValue.Subscribe(function () { self.#_bg.StrokeColor = self.StrokeColor; });
        this.StrokeThicknessValue.Subscribe(function () { self.#_bg.StrokeThickness = self.StrokeThickness; });
        this.TextValue.Subscribe(function () { self.#_text.Text = self.Text; });
        this.TextColorValue.Subscribe(function () { self.#_text.TextColor = self.TextColor; });
    }

    OnClick() {
        if (this.ClickAction)
            this.ClickAction();
        this.Command.Notify();
    }
}

export class DarkDimmedTheme extends ATheme {
    static BackgroundColor1 = 'rgb(21,27,35)';
    static BackgroundColor2 = 'rgb(33,40,48)';

    static LineColor = 'rgb(57,64,73)';

    static TextColor1 = 'rgb(209,215,224)';
    static TextColor2 = 'rgb(145,152,161)';

    static AccentBackColor1 = 'rgb(36,49,66)';
    static AccentTextColor1 = 'rgb(71,139,230)';
    static AccentLineColor1 = 'rgb(55,103,170)';
    static AccentLineColor2 = 'rgb(48,82,131)';
}