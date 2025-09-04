
let WIDGETS_DEBUG = false;

export function debug_ln(msg) {
    console.log(msg);
}

class DisposableAction {
    #_action;
    constructor(action) {
        this.#_action = action;
    }

    Dispose() {
        this.#_action();
    }
}

class CompositeDisposable {
    #_list = [];
    constructor() {
    }
    Add(disposable) {
        this.#_list.push(disposable);
    }
    Clear() {
        const list = [...this.#_list]
        this.#_list.length = 0;
        for (const item in list) {
            item.Dispose();
        }
    }
}

export class BindableValue {
    #_value;
    #_listener = [];
    constructor(value) { this.#_value = value; }
    get Value() { return this.#_value; }
    set Value(value) { this.#_value = value; this.#RaiseChanged(); }
    Subscribe(listener, disposables = null) {
        const listeners = this.#_listener;
        listeners.push(listener);
        if (disposables) {
            disposables.Add(new DisposableAction(function () { BindableValue.#Remove(listeners, listener) }));
        }
        listener(this.#_value);
    }
    #RaiseChanged() {
        for (const listener of this.#_listener) {
            listener(this.#_value);
        }
    }
    static #Remove(array, item) {
        var index = array.indexOf(item);
        if (index > -1) {
            array.splice(index, 1);
        }
    }
}

export class RootWidget {
    PlatformViewValue = new BindableValue(null);
    get PlatformView() { return this.PlatformViewValue.Value };
    set PlatformView(value) { this.PlatformViewValue.Value = value; }

    ContentValue = new BindableValue(null);
    get Content() { return this.ContentValue.Value };
    set Content(value) { this.ContentValue.Value = value; }

    SizeValue = new BindableValue([0, 0]);
    get Size() { return this.SizeValue.Value };
    set Size(value) { this.SizeValue.Value = value; }

    constructor() {
        // const self = this;
        // self.ContentValue.Subscribe(function () { self.#UpdateContentSize() });
        // self.SizeValue.Subscribe(function () { self.#UpdateContentSize() });
        // super();
        this.SizeValue.Subscribe(this.Layout.bind(this));
        this.ContentValue.Subscribe(this.Layout.bind(this));
    }

    Layout() {
        const content = this.Content;
        if (!content) {
            // debug_ln("UpdateContentSize | content: NULL");
            return;
        }
        const size = this.Size;
        // debug_ln(`UpdateContentSize | size: ${size}`);
        content.Size = size;
        content.Position = [0, 0];
    }
}

class LayoutConstraints {
    #_map = new Map();
    Add(name, value) {
        this.#_map.set(name, value);
        return this;
    }
    With(name, value) {
        this.#_map.set(name, value);
        return this;
    }
    Has(name) {
        return this.#_map.has(name);
    }
    GetOrDefault(name, defolt) {
        if (this.#_map.has(name))
            return this.#_map.get(name);
        return defolt;
    }
    Get(name) {
        return this.#_map.get(name);
    }
    TryGet(name) {
        return [this.#_map.has(name), this.#_map.get(name)];
    }
}

export class AGesture {
    OnEvent(ev) {

    }
}

export class ATheme {
    constructor() {
    }
}

class AWidget {
    PlatformViewValue = new BindableValue(null);
    get PlatformView() { return this.PlatformViewValue.Value };
    set PlatformView(value) { this.PlatformViewValue.Value = value; }

    PositionValue = new BindableValue([0, 0]);
    get Position() { return this.PositionValue.Value };
    set Position(value) { this.PositionValue.Value = value; }

    SizeValue = new BindableValue([0, 0]);
    get Size() { return this.SizeValue.Value };
    set Size(value) { this.SizeValue.Value = value; }

    VisibleValue = new BindableValue(true);
    get Visible() { return this.VisibleValue.Value };
    set Visible(value) { this.VisibleValue.Value = value; }

    ConstraintsValue = new BindableValue(new LayoutConstraints());
    get Constraints() { return this.ConstraintsValue.Value };
    set Constraints(value) { this.ConstraintsValue.Value = value; }

    ThemeValue = new BindableValue(null);
    get Theme() { return this.ThemeValue.Value };
    set Theme(value) { this.ThemeValue.Value = value; }
}

export class ContainerWidget extends AWidget {
    WidgetsValue = new BindableValue(null);
    get Widgets() { return this.WidgetsValue.Value };
    set Widgets(value) { this.WidgetsValue.Value = value; }

    GesturesValue = new BindableValue(null);
    get Gestures() { return this.GesturesValue.Value };
    set Gestures(value) { this.GesturesValue.Value = value; }
}

export class ScrollWidget extends AWidget {
    static ScrollBarSize = 10;

    ContentValue = new BindableValue(null);
    get Content() { return this.ContentValue.Value };
    set Content(value) { this.ContentValue.Value = value; }

    constructor() {
        super();
        this.SizeValue.Subscribe(this.Layout.bind(this));
        this.ContentValue.Subscribe(this.Layout.bind(this));
    }

    Layout() {
        const content = this.Content;
        if (content) {
            const [_, height] = content.Size;
            const width = this.Size[0] - ScrollWidget.ScrollBarSize;
            content.Size = [width, height];
        }
    }
}

export class TextWidget extends AWidget {
    TextValue = new BindableValue("");
    get Text() { return this.TextValue.Value };
    set Text(value) { this.TextValue.Value = value; }

    TextColorValue = new BindableValue("black");
    get TextColor() { return this.TextColorValue.Value };
    set TextColor(value) { this.TextColorValue.Value = value; }

    // [0,0] - center, center; [-1, -1] - left, top; [1, -1] - right, top; [1, 1] - right, bottom
    TextAlignmentValue = new BindableValue([0, 0]);
    get TextAlignment() { return this.TextAlignmentValue.Value };
    set TextAlignment(value) { this.TextAlignmentValue.Value = value; }

    TextSizeValue = new BindableValue(16);
    get TextSize() { return this.TextSizeValue.Value };
    set TextSize(value) { this.TextSizeValue.Value = value; }
}

export class CanvasWidget extends AWidget {
    DrawFuncValue = new BindableValue(null);
    get DrawFunc() { return this.DrawFuncValue.Value };
    set DrawFunc(value) { this.DrawFuncValue.Value = value; }

    InvalidateVisual() {
        this.DrawFuncValue.Value = this.DrawFuncValue.Value;
    }
}

const ViewFactory_DpiScale = 2;

class DrawHelper {
    #_ctx;

    constructor(ctx) {
        this.#_ctx = ctx;
    }

    #ParseColor(color) {
        if (Array.isArray(color)) {
            if (color.length == 3) {
                return "#" + (color[0]).toString(16).padStart(2, '0') + (color[1]).toString(16).padStart(2, '0') + (color[2]).toString(16).padStart(2, '0');
            }
            console.log("#ParseColor | this array not supported yet");
        }
        return color;
    }

    DrawLine(x1, y1, x2, y2, thickness, strokeColor) {
        const ctx = this.#_ctx;
        if (!(ctx instanceof CanvasRenderingContext2D)) return;

        ctx.lineWidth = thickness;
        ctx.strokeStyle = this.#ParseColor(strokeColor);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    DrawPath(fillColor, isClosed, thickness, strokeColor, segments) {
        const ctx = this.#_ctx;
        if (!(ctx instanceof CanvasRenderingContext2D)) return;

        const path = new Path2D();

        let i = 0;
        const n = segments.length;
        const popSeg = function () {
            const ret = segments[i];
            i = i + 1;
            return ret;
        }

        while (i < n) {
            switch (popSeg()) {
                case 'm':
                case 'move':
                    {
                        const x = popSeg();
                        const y = popSeg();
                        path.moveTo(x, y);
                        break;
                    }
                case 'l':
                case 'line':
                    {
                        const x = popSeg();
                        const y = popSeg();
                        path.lineTo(x, y);
                        break;
                    }
                case 'a':
                case 'arc':
                    {
                        const x1 = popSeg();
                        const y1 = popSeg();
                        const x2 = popSeg();
                        const y2 = popSeg();
                        const radius = popSeg();
                        // const isRightSide = popSeg();
                        // const isLargeArc = popSeg();
                        path.arcTo(x1, y1, x2, y2, radius);
                        break;
                    }
                default:
                    break;
            }
        }

        if (fillColor) {
            ctx.fillStyle = this.#ParseColor(fillColor);
            ctx.fill(path);
        }

        if (strokeColor) {
            if (isClosed) {
                path.closePath();
            }

            ctx.lineWidth = thickness;
            ctx.strokeStyle = this.#ParseColor(strokeColor);
            ctx.stroke(path);
        }
    }
}

export class ViewFactory {

    static CreateElement({ tagName = null, widget = null, debugColor = null } = {}) {
        if (tagName == null)
            tagName = "div"
        const div = document.createElement(tagName);
        div._disposables = new CompositeDisposable();
        if (WIDGETS_DEBUG) {
            if (debugColor) {
                div.style.backgroundColor = debugColor;
            }
            div["id"] = `${widget.constructor.name}`;
        }
        return div;
    }

    static SetChildren(div, children) {
        while (div.fisrtChild) {
            const innerDiv = div.lastChild;
            innerDiv._disposables.Clear();
            div.removeChild(innerDiv);
        }
        for (const child of children) {
            if (child)
                div.appendChild(child);
        }
    }

    static GetView(widget) {

        if (widget == null)
            return null;

        if (widget instanceof RootWidget) {
            const div = ViewFactory.CreateElement({ widget: widget, debugColor: '#00000010' });
            div.style.width = '100%';
            div.style.height = '100%';
            div.style.overflow = 'hidden'; // clip children

            widget.ContentValue.Subscribe(function () {
                ViewFactory.SetChildren(div, [ViewFactory.GetView(widget.Content)]);
            }, div._disposables);

            new ResizeObserver(function () { widget.Size = [div.offsetWidth, div.offsetHeight]; }).observe(div);

            widget.PlatformView = div;
            return div;
        }

        if (widget instanceof ScrollWidget) {
            const div = ViewFactory.CreateElement({ widget: widget, debugColor: '#00000015' });
            div.style.position = 'absolute';
            div.style['overflow-x'] = 'hidden';
            div.style['overflow-y'] = 'scroll';
            div.style['scrollbar-width'] = 'thin';
            // div.style['scrollbar-width'] = 'none';
            div.style['scrollbar-color'] = '#00000010 #ffffff10';
            //div["data-simplebar"] = ".";
            // https://jsfiddle.net/w0a5Ls6h/
            // https://cdn.jsdelivr.net/npm/simplebar@latest/dist/simplebar.min.js
            // https://cdn.jsdelivr.net/npm/simplebar@latest/dist/simplebar.css

            this.#DefaultSubscriptions(div, widget);

            widget.ContentValue.Subscribe(function () {
                ViewFactory.SetChildren(div, [ViewFactory.GetView(widget.Content)]);
            }, div._disposables);

            widget.PlatformView = div;
            return div;
        }

        if (widget instanceof ContainerWidget) {
            const div = ViewFactory.CreateElement({ widget: widget, debugColor: '#ff000005' });
            div.style.position = 'absolute';
            div.style.overflow = 'hidden'; // clip children

            this.#DefaultSubscriptions(div, widget);

            widget.WidgetsValue.Subscribe(function () {

                const children = widget.Widgets ? [...widget.Widgets.map(function (it) { return ViewFactory.GetView(it); })] : [];
                ViewFactory.SetChildren(div, children);
            }, div._disposables);

            widget.GesturesValue.Subscribe(function () {
                ViewFactory.#SubscribeToEvents(div, widget);
            }, div._disposables);

            widget.PlatformView = div;
            return div;
        }

        if (widget instanceof TextWidget) {
            const div = ViewFactory.CreateElement({ widget: widget, debugColor: '#00ff0005' });
            div.style.position = 'absolute';
            div.style.display = 'flex';
            //div.style['user-select'] = 'none';
            div.style['font-family'] = 'sans-serif';

            this.#DefaultSubscriptions(div, widget);

            widget.TextValue.Subscribe(function () {
                div.innerText = widget.Text;
            }, div._disposables);

            widget.TextSizeValue.Subscribe(function () {
                div.style['font-size'] = `${widget.TextSize}px`;
            }, div._disposables);

            widget.TextColorValue.Subscribe(function () {
                div.style.color = widget.TextColor;
            }, div._disposables);

            widget.TextAlignmentValue.Subscribe(function () {
                const [ax, ay] = widget.TextAlignment;
                switch (ax) {
                    case -1:
                    case 'start':
                    case 'left':
                        div.style['justify-content'] = 'left';
                        div.style['text-align'] = 'left';
                        break;
                    case 0:
                    case 'center':
                        div.style['justify-content'] = 'center';
                        div.style['text-align'] = 'center';
                        break;
                    case 1:
                    case 'end':
                    case 'right':
                        div.style['justify-content'] = 'right';
                        div.style['text-align'] = 'right';
                        break;
                }
                switch (ay) {
                    case -1:
                    case 'start':
                    case 'top':
                        div.style['align-items'] = 'flex-start';
                        break;
                    case 0:
                    case 'center':
                        div.style['align-items'] = 'center';
                        break;
                    case 1:
                    case 'end':
                    case 'bottom':
                        div.style['align-items'] = 'flex-end';
                        break;
                }
            }, div._disposables);

            widget.PlatformView = div;
            return div;
        }

        if (widget instanceof CanvasWidget) {
            const div = ViewFactory.CreateElement({ tagName: "canvas", widget: widget });
            div.style.position = 'absolute';

            this.#DefaultSubscriptions(div, widget);

            widget.SizeValue.Subscribe(function () {
                div.width = `${widget.Size[0] * ViewFactory_DpiScale}`;
                div.height = `${widget.Size[1] * ViewFactory_DpiScale}`;
                ViewFactory.#UpdateCanvas(div, widget);
            }, div._disposables);

            widget.DrawFuncValue.Subscribe(function () {
                ViewFactory.#UpdateCanvas(div, widget);
            }, div._disposables);

            widget.PlatformView = div;
            return div;
        }

        const bad = ViewFactory.CreateElement({ widget: widget });
        if (WIDGETS_DEBUG) {
            bad.style.backgroundColor = '#ff00ff';
            bad.style.position = 'absolute';
            bad.style.width = '75px';
            bad.style.height = '25px';
            bad.innerHTML += `${widget}`;
        }
        return bad;
    }

    static #SubscribeToEvents(div, widget) {
        if (!(div instanceof Element)) {
            debug_ln('#SubscribeToEvents() | widget is not instance of Element');
            return;
        }

        const gestures = widget.Gestures;
        if (gestures && gestures.length > 0) {
            const sendEvent = function (ev) {
                // debug_ln(ev);
                for (const gesture of gestures) {
                    gesture.OnEvent(ev, widget);
                }
            }

            const handleDown = function (ev) {
                div.setPointerCapture(ev.pointerId);
                sendEvent(ev);
            }

            const handleUp = function (ev) {
                div.releasePointerCapture(ev.pointerId);
                sendEvent(ev);
            }

            div.onpointerdown = handleDown; // sendEvent;
            div.onpointerup = handleUp; // sendEvent;
            div.onpointercancel = sendEvent;

            div.onpointermove = sendEvent;
            div.onpointerenter = sendEvent;
            div.onpointerleave = sendEvent;
            div.onpointerout = sendEvent;
            div.onpointerover = sendEvent;
        }
        else {
            div.onpointerdown = null;
            div.onpointerup = null;
            div.onpointercancel = null;

            div.onpointermove = null;
            div.onpointerenter = null;
            div.onpointerleave = null;
            div.onpointerout = null;
            div.onpointerover = null;
        }
    }

    static #UpdateCanvas(canvas, widget) {
        if (canvas.getContext) {
            const ctx = canvas.getContext("2d");

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(ViewFactory_DpiScale, ViewFactory_DpiScale)
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const dh = new DrawHelper(ctx);
            const func = widget.DrawFunc;
            if (func) {
                func(dh, widget.Size[0], widget.Size[1]);
            }
        }
    }

    static #DefaultSubscriptions(div, /*AWidget*/ widget) {
        widget.SizeValue.Subscribe(function () {
            const size = widget.Size;
            div.style.width = `${size[0]}px`;
            div.style.height = `${size[1]}px`;
        }, div._disposables);

        widget.PositionValue.Subscribe(function () {
            const pos = widget.Position;
            div.style.left = `${pos[0]}px`;
            div.style.top = `${pos[1]}px`;
        }, div._disposables);
    }
}

export class SinglePageWindow {
    #_host;
    constructor(host) {
        this.#_host = host;
    }

    Show(widget) {
        const host = this.#_host;

        // The loop continues to check for firstChild just in case it's faster to check for firstChild than lastChild
        while (host.fisrtChild) {
            host.removeChild(host.lastChild);
        }
        host.appendChild(ViewFactory.GetView(widget));
    }
}


