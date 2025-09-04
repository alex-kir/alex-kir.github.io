import { ObservableUnit } from "../utils.js";

export const BlockDirection =
{
    North: 0,
    East: 90,
    South: 180,
    West: 270,
};

/*

    ^
    | (1,5)      +--------(x+w,y+h)
    | (1,4)      |        |
    | (1,3)     (x,y)-----+
    | (1,2) 
    | (1,1)(2,1)(3,1)(4,1)(5,1)       
----+---------------------->
    | (0,0)

*/


export class BlockModel {
    #name;
    #x;
    #y;
    #width;
    #height;
    #direction;

    #realX;
    #realY;
    #realWidth;
    #realHeight;

    constructor(name, x, y, width, height, direction) {
        this.#x = x;
        this.#y = y;
        this.#width = width;
        this.#height = height;
        this.#name = name;
        this.#direction = direction;


        switch (direction) {
            case BlockDirection.North:
                this.#realX = x;
                this.#realY = y;
                this.#realWidth = width;
                this.#realHeight = height;
                break;
            case BlockDirection.South:
                this.#realX = x - width + 1;
                this.#realY = y - height + 1;
                this.#realWidth = width;
                this.#realHeight = height;
                break;
            case BlockDirection.East:
                this.#realX = x;
                this.#realY = y - width + 1;
                this.#realWidth = height;
                this.#realHeight = width;
                break;
            case BlockDirection.West:
                this.#realX = x - height + 1;
                this.#realY = y;
                this.#realWidth = height;
                this.#realHeight = width;
                break;
            default:
                throw `unexpected direction: '${direction}'`;
        }

        //console.log("real:", this.#realX, this.#realY, this.#realWidth, this.#realHeight);

        Object.freeze(this);
    }

    get name() { return this.#name; }
    get x() { return this.#x; }
    get y() { return this.#y; }
    get width() { return this.#width; }
    get height() { return this.#height; }
    get direction() { return this.#direction; }

    get realX() { return this.#realX; }
    get realY() { return this.#realY; }
    get realWidth() { return this.#realWidth; }
    get realHeight() { return this.#realHeight; }

    #worldPosition = new ObservableUnit([0, 0]);
    get worldPosition() { return this.#worldPosition; }

    isIntersected(other) {
        if (other instanceof BlockModel) {
            if (this.#realX + this.#realWidth - 1 < other.#realX)
                return false;
            if (other.#realX + other.#realWidth - 1 < this.#realX)
                return false;
            if (this.#realY + this.#realHeight - 1 < other.#realY)
                return false;
            if (other.#realY + other.#realHeight - 1 < this.#realY)
                return false;
            return true;
        }
        return false;
    }

    // contains(x, y) {
    //     if (x < this.#realX)
    //         return false;
    //     if (y < this.#realY)
    //         return false;
    //     if (this.#realX + this.#realWidth - 1 < x)
    //         return false;
    //     if (this.#realY + this.#realHeight - 1 < y)
    //         return false;
    //     return true;
    // }
}
