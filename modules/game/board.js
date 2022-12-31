

import { Column } from "./column.js";
import { Rules } from "./rules.js";
import { UI } from "./ui.js";
import "../pkg/jsrand.js";

// Stable generation seed... Something chaotically repeatable...

export class Board {

    constructor(interactive = true, preset = false) {

        this.interactive = interactive;
        this.active = false;
        this.columns = [];
        this.round = 0;
        this.preset = preset;
        this.flipped = false;
        this.seedrandom = new Math.seedrandom("Population_seed");

        if (interactive) {
            this.UI = new UI(interactive, this);
            this.UI.place();
        }

    }

    start(mode="human") {
        this.active = true;

        if (this.interactive) {
            this.UI.ui_start();
        }

        this.createBoard();

    }

    endGame() {

        this.active = false;

        if (!this.interactive) return;
        this.UI.end.style.visibility = "hidden";
        this.UI.final.innerHTML = this.score;

    }

    createBoard(boot = true, preset = false) {

        this.active = true;

        if (boot) {
            this.round = 0;
            this.score = 0;
            if (this.interactive) {
                this.update_score();
            }
        }

        if (preset) {
            this.preset = preset;
        }

        this.columns = [];

        if (this.interactive) {
            this.UI.ui_reset();
        }

        const R = new Rules(this.preset);

        for (let i = 0; i < 20; i++){

            let new_col = new Column(i, R, this);

            this.columns.push(new_col)
            new_col.init();

            if (this.interactive) {
                this.UI.wrapper.appendChild(new_col.place());
                this.columns[i].tiles.forEach(t => t.element.addEventListener("click", () => this.eat(t)))
            }
        }
        return this._endInit()
    }

    eat(clicked) {

        const to_eliminate = this.clusters.filter(cluster => {
            for (const member of cluster) {
                if (member.coords === clicked.coords) return true;
            }
            return false;
        });

        // filter returns array with a single member = array.
        const t_e_unwrap = to_eliminate[0];
        if (t_e_unwrap) {
            this.eliminate(t_e_unwrap);
        }

        return this._endInit()
    }

    _endInit() {
        this.round ++;
        this.createClusters();

        // Assigning values + checking emptiness
        this.clusters.forEach(cluster => {
            cluster.forEach(e => {
                e.setValue(cluster.length);
            })
        });

        if (!this.columns.length || this.columns.reduce((t, a) => t + a.tiles.length, 0) === 0) {

            this.createBoard(false, this.seedrandom());
            return true;

        }

        if (this.clusters.length === 0) {
            this.endGame();
            return false;
        }

        return true;

    }

    eliminate(a) {
        this.score += a[0].value;
        if (this.interactive) {
            this.update_score()
        }

        a.forEach(t => {

            let col = this.columns[t.coords[0]];
            let row_no = t.coords[1];

            col.tiles.splice(t.coords[1], 1);

            if (this.interactive) {
                col.element.removeChild(t.element);
            }

            col.tiles.forEach(m => {
                if (m.coords[1] < row_no) return;
                m.adjust_coords([0, -1]);
            });

        });

        // Finding and removing empty cols
        let empty_cols = this.columns.filter(c => c.tiles.length === 0);
        if (!empty_cols.length) return;

        empty_cols.forEach(empty_col => {

            let col_index = this.columns.indexOf(empty_col);

            this.columns.splice(col_index, 1);

            if (this.interactive) {
                this.UI.ui_r_cols(empty_col.element);
            }

            for (let i = col_index; i < this.columns.length; i++) {
                this.columns[i].adjustColIndexes(-1);
            }

        });

    }

    update_score() {
        this.UI.score.innerHTML = this.score + " pts"
    }

    _parser(e) {
        let i_col = e.coords[0];
        let col = this.columns[i_col];
        return [
            e,
            col.tiles.indexOf(e),
            col,
            i_col
        ]
    }

    _findNeighbors(e) {

        const res = [];

        const checkout = x => {
            // if (i_col > 1) return;
            if (!x) return;
            if (x.color !== e.color || x.lastChecked === this.round) return;
            x.lastChecked = this.round;
            res.push(this._parser(x));
        }

        const onboard = (e, i_el, c, i_col) => {

            // Vertically looking for relatives
            if (i_el - 1 >= 0) {
                checkout(c.tiles[i_el - 1]);
            }
            if (i_el + 1 < c.tiles.length) {
                checkout(c.tiles[i_el + 1]);
            }

            // Looking horizontally
            const horizontal = m => {
                let n_col = i_col + m
                // Looking around myself...
                if (n_col < 0 || n_col >= this.columns.length) return false;
                return this.columns[n_col].tiles.filter(t => t.coords[1] === e.coords[1])[0];
            }

            [horizontal(-1), horizontal(1)].forEach(candidate => checkout(candidate));

        }

        checkout(e);

        for(let i = 0; i < res.length; i++) {
            onboard(...res[i]);
        }

        if (res.length === 1) return false
        return res.map(r => {
            return r[0]
        })

    }

    createClusters() {
        // Make cluster value initial

        this.clusters = [];
        this.columns.forEach(c => {
            c.tiles.forEach(e => {
                e.setValue(0);
                let nbrs = this._findNeighbors(e);
                if (!nbrs.length) return;
                this.clusters.push(nbrs);
            })
        });
        this.clusters.sort((a, b) => a.length - b.length);
    }

    selfDestroy() {

        this.UI.destroy();
        this.UI = null;

    }

    /////////////////////////////
        // Status querying//
    ////////////////////////////

    q_col() {

        return this.columns;

    }

    /**
     * A function that returns an array of all Tile objects
     * @returns List of all tiles
     */
    q_tiles() {

        return [].concat(...this.columns.map(c => c.tiles));

    }

    q_score() {
        return this.score;
    }

}
