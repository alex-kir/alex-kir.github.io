
// Content management system
export class CMS {

    static #data;

    static {
        const data = CMS.#data = new Map();
        data.set('block|house_6x3', { id: 'house_6x3', width: 1, height: 2, fbxName: 'a/home_6x3' });
        data.set('block|house_3x3_hi', { id: 'house_3x3_hi', width: 1, height: 1, fbxName: 'a/home_3x3_hi' });
        data.set('block|house_3x3_lo', { id: 'house_3x3_lo', width: 1, height: 1, fbxName: 'a/home_3x3_lo' });
        data.set('block|garage_6x3', { id: 'garage_6x3', width: 1, height: 2, fbxName: 'a/garage_6x3' });
        data.set('block|veranda_3x3_hi', { id: 'veranda_3x3_hi', width: 1, height: 1, fbxName: 'a/veranda_3x3_hi' });
        data.set('block|veranda_3x3_lo', { id: 'veranda_3x3_lo', width: 1, height: 1, fbxName: 'a/veranda_3x3_lo' });


        data.set('block_shift|house_6x3', { canShift: false, order: 0 });
        data.set('block_shift|house_3x3_hi', { canShift: false, order: 0 });
        data.set('block_shift|house_3x3_lo', { canShift: false, order: 0 });
        data.set('block_shift|garage_6x3', { canShift: true, order: 1 });
        data.set('block_shift|veranda_3x3_hi', { canShift: true, order: 2 });
        data.set('block_shift|veranda_3x3_lo', { canShift: true, order: 2 });


        data.set('key|1', { id: 'house_6x3', title: '1.House\n6x3' });
        data.set('key|2', { id: 'house_3x3_hi', title: '2.House\n3x3 Hi' });
        data.set('key|3', { id: 'house_3x3_lo', title: '3.House\n3x3 Lo' });
        data.set('key|4', { id: 'garage_6x3', title: '4.Gararage\n6x3' });
        data.set('key|5', { id: 'veranda_3x3_hi', title: '5.Veranda\n3x3 Hi' });
        data.set('key|6', { id: 'veranda_3x3_lo', title: '6.Veranda\n3x3 Lo' });


        const allowed = { allowed: true };
        const denied = { allowed: false };

        data.set('rules|hor|202|202', allowed);
        data.set('rules|hor|203|203', allowed);
        data.set('rules|hor|204|204', allowed);
        data.set('rules|hor|205|205', allowed);
        data.set('rules|hor|207|206', allowed);
        data.set('rules|hor|208|209', allowed);
        data.set('rules|hor|209|302', allowed);
        data.set('rules|hor|209|303', allowed);
        data.set('rules|hor|209|304', allowed);
        data.set('rules|hor|209|305', allowed);
        data.set('rules|hor|302|207', allowed);
        data.set('rules|hor|302|302', allowed);
        data.set('rules|hor|302|526', allowed);
        data.set('rules|hor|302|527', allowed);
        data.set('rules|hor|303|207', allowed);
        data.set('rules|hor|303|303', allowed);
        data.set('rules|hor|303|526', allowed);
        data.set('rules|hor|303|527', allowed);
        data.set('rules|hor|304|204', allowed);
        data.set('rules|hor|304|207', allowed);
        data.set('rules|hor|304|304', allowed);
        data.set('rules|hor|304|525', allowed);
        data.set('rules|hor|304|526', allowed);
        data.set('rules|hor|304|527', allowed);
        data.set('rules|hor|305|205', allowed);
        data.set('rules|hor|305|207', allowed);
        data.set('rules|hor|305|305', allowed);
        data.set('rules|hor|305|525', allowed);
        data.set('rules|hor|305|526', allowed);
        data.set('rules|hor|305|527', allowed);
        data.set('rules|hor|522|522', allowed);
        data.set('rules|hor|523|523', allowed);
        data.set('rules|hor|524|524', allowed);
        data.set('rules|hor|525|525', allowed);
        data.set('rules|hor|528|302', allowed);
        data.set('rules|hor|528|303', allowed);
        data.set('rules|hor|528|304', allowed);
        data.set('rules|hor|528|305', allowed);
        data.set('rules|hor|529|302', allowed);
        data.set('rules|hor|529|303', allowed);
        data.set('rules|hor|529|304', allowed);
        data.set('rules|hor|529|305', allowed);
        data.set('rules|ver|203|202', allowed);
        data.set('rules|ver|204|205', allowed);
        data.set('rules|ver|205|304', allowed);
        data.set('rules|ver|206|206', allowed);
        data.set('rules|ver|207|207', allowed);
        data.set('rules|ver|208|208', allowed);
        data.set('rules|ver|209|209', allowed);
        data.set('rules|ver|302|203', allowed);
        data.set('rules|ver|302|522', allowed);
        data.set('rules|ver|302|523', allowed);
        data.set('rules|ver|303|302', allowed);
        data.set('rules|ver|304|305', allowed);
        data.set('rules|ver|305|303', allowed);
        data.set('rules|ver|305|526', allowed);
        data.set('rules|ver|524|303', allowed);
        data.set('rules|ver|524|304', allowed);
        data.set('rules|ver|524|525', allowed);
        data.set('rules|ver|525|303', allowed);
        data.set('rules|ver|525|304', allowed);
        data.set('rules|ver|526|303', allowed);
        data.set('rules|ver|526|526', allowed);
        data.set('rules|ver|527|526', allowed);
        data.set('rules|ver|527|527', allowed);
        data.set('rules|ver|528|528', allowed);
        data.set('rules|ver|529|528', allowed);
        data.set('rules|ver|529|529', allowed);


        // data.set('rules|hor|303|302', denied);
    }

    static findEntity(...keys) {
        if (keys.length == 0)
            return null;
        const key = keys.join('|');
        const result = CMS.#data.get(key);
        if (result)
            return result;
        return null;
    }

    static getEntity(...keys) {
        if (keys.length == 0)
            return null;
        const key = keys.join('|');
        const result = CMS.#data.get(key);
        if (result)
            return result;
        console.log("CMS | entity not found | ", keys);
        return null;
    }

    static getEntities(...keys) {
        const key = keys.join('|') + '|';
        const result = [];
        for (const [k, v] of CMS.#data) {
            if (k.startsWith(key)) {
                result.push(v);
            }
        }
        return result;
    }
}
