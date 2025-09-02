
// Content management system
export class CMS {

    static #data;

    static {
        const data = CMS.#data = new Map();
        data.set('block|house_6x3', { id: 'house_6x3', width: 1, height: 2, fbxName: 'a/home_6x3' });
        data.set('block|house_3x3_lo', { id: 'house_3x3_lo', width: 1, height: 1, fbxName: 'a/home_3x3_lo' });
        data.set('block|house_3x3_hi', { id: 'house_3x3_hi', width: 1, height: 1, fbxName: 'a/home_3x3_hi' });
        data.set('block|garage_6x3', { id: 'garage_6x3', width: 1, height: 2, fbxName: 'a/garage_6x3' });
        data.set('block|veranda_3x3_lo', { id: 'veranda_3x3_lo', width: 1, height: 1, fbxName: 'a/veranda_3x3_lo' });
        data.set('block|veranda_3x3_hi', { id: 'veranda_3x3_hi', width: 1, height: 1, fbxName: 'a/veranda_3x3_hi' });

        data.set('block_shift|house_6x3', { canShift: false, order: 0 });
        data.set('block_shift|house_3x3_lo', { canShift: false, order: 0 });
        data.set('block_shift|house_3x3_hi', { canShift: false, order: 0 });
        data.set('block_shift|garage_6x3', { canShift: true, order: 1 });
        data.set('block_shift|veranda_3x3_lo', { canShift: true, order: 2 });
        data.set('block_shift|veranda_3x3_hi', { canShift: true, order: 2 });


        data.set('key|1', { id: 'house_6x3', title: '1.House\n6x3' });
        data.set('key|2', { id: 'house_3x3_lo', title: '2.House\n3x3 Lo' });
        data.set('key|3', { id: 'house_3x3_hi', title: '3.House\n3x3 Hi' });
        data.set('key|4', { id: 'garage_6x3', title: '4.Gararage\n6x3' });
        data.set('key|5', { id: 'veranda_3x3_lo', title: '5.Veranda\n3x3 Lo' });
        data.set('key|6', { id: 'veranda_3x3_hi', title: '6.Veranda\n3x3 Hi' });
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
