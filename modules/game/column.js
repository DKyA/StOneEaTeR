import {Tile} from "./tile.js";

export class Column {

    constructor(i, Rules, B) {

        this.B = B;
        this.index = i;
        this.tiles = [];
        this.rules = Rules;

    }

    init() {
        for (let j = 0; j < 12; j++) {
            let tile = new Tile(this.rules.random_color(), this.B.interactive);
            tile.init([this.index, j]);
            this.tiles.push(tile);
        }
    }

    place() {

        let column = document.createElement("div");
        column.classList.add("column");
        column.setAttribute("index", this.index);
        this.element = column;

        for (let j = 0; j < 12; j++) {
            column.appendChild(this.tiles[j].place())
        }

        return column;

    }

    adjustColIndexes(m) {
        this.tiles.forEach(t => {
            t.adjust_coords([m, 0])
        })
    }

}