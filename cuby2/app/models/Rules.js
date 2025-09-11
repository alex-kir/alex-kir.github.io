
export class Rules {

    static remapBlockCode(code) {

        // switch (code) {
        //     case 'house_6x3:0:b':
        //     case 'house_3x3_lo:0:a':
        //         return '302';
        //     case 'house_6x3:0:a':
        //     case 'house_3x3_hi:0:a':
        //         return '303';
        // }

        return code;
    }


    static allRules = [
        ['303', 'house_6x3:180:a', 'hor', false],
        ['303', '302', 'hor', false],

        ['302', '302', 'hor', true],
        ['303', '302', 'ver', true],
        ['303', '303', 'hor', true],
        ['garage_6x3:0:a', 'garage_6x3:0:b', 'ver', true],
        ['garage_6x3:180:b', 'garage_6x3:180:a', 'ver', true],
        ['garage_6x3:270:b', 'garage_6x3:270:a', 'hor', true],
        ['garage_6x3:90:a', 'garage_6x3:90:b', 'hor', true],
        ['house_3x3_hi:0:a', 'house_3x3_hi:0:a', 'hor', true],
        ['house_3x3_hi:0:a', 'house_3x3_lo:0:a', 'ver', true],
        ['house_3x3_hi:180:a', 'house_3x3_hi:0:a', 'ver', true],
        ['house_3x3_hi:180:a', 'house_3x3_hi:180:a', 'hor', true],
        ['house_3x3_lo:0:a', 'house_3x3_lo:0:a', 'hor', true],
        ['house_3x3_lo:180:a', 'house_3x3_hi:180:a', 'ver', true],
        ['house_3x3_lo:180:a', 'house_3x3_lo:180:a', 'hor', true],
        ['house_3x3_lo:270:a', 'house_3x3_lo:270:a', 'ver', true],
        ['house_3x3_lo:90:a', 'house_3x3_lo:90:a', 'ver', true],
        ['house_6x3:0:a', 'house_6x3:0:a', 'hor', true],
        ['house_6x3:0:a', 'house_6x3:0:b', 'hor', false],
        ['house_6x3:0:a', 'house_6x3:0:b', 'ver', true],
        ['house_6x3:0:a', 'house_6x3:180:a', 'hor', false],
        ['house_6x3:0:a', 'house_6x3:180:b', 'hor', false],
        ['house_6x3:0:b', 'house_6x3:0:a', 'hor', false],
        ['house_6x3:0:b', 'house_6x3:0:a', 'ver', false],
        ['house_6x3:0:b', 'house_6x3:0:b', 'hor', true],
        ['house_6x3:0:b', 'house_6x3:180:a', 'hor', false],
        ['house_6x3:0:b', 'house_6x3:180:b', 'hor', false],
        ['house_6x3:0:b', 'house_6x3:180:b', 'ver', false],
        ['house_6x3:180:a', '303', 'ver', true],
        ['house_6x3:180:a', 'house_6x3:0:a', 'hor', false],
        ['house_6x3:180:a', 'house_6x3:0:a', 'ver', true],
        ['house_6x3:180:a', 'house_6x3:0:b', 'hor', false],
        ['house_6x3:180:a', 'house_6x3:180:a', 'hor', true],
        ['house_6x3:180:b', 'house_6x3:0:a', 'hor', false],
        ['house_6x3:180:b', 'house_6x3:0:b', 'hor', false],
        ['house_6x3:180:b', 'house_6x3:180:a', 'ver', true],
        ['house_6x3:180:b', 'house_6x3:180:b', 'hor', true],
        ['house_6x3:270:b', 'house_6x3:270:a', 'hor', true],
        ['house_6x3:90:a', 'house_6x3:90:a', 'ver', true],
        ['house_6x3:90:a', 'house_6x3:90:b', 'hor', true],
        ['house_6x3:90:b', 'house_6x3:90:b', 'ver', true],

    ];

}