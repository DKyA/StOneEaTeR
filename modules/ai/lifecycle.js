import { pickTile } from "./maker.js";
import { Board } from "../game/board.js";
import { Stats } from "./stats.js";
import "../pkg/jsrand.js";

export class Lifecycle {
    
    constructor(active_args) {

        this.S = new Stats();
        this.active_args = active_args;

        this.GEN_SIZE = 30;
        this.MAX_GEN = 100;
        this.VARIANCE = .25;

        this.leading_gene = [this.init_args(), this.init_args(), this.init_args()];
        this.mutants = [];

        this.init();

    }

    init() {

        let preset = Math.random();

        for(; this.MAX_GEN > 0; this.MAX_GEN--) {

            if (!this.MAX_GEN % 20) {
                preset = Math.random();
            }

            console.log(this.MAX_GEN + " generations left to calculate");

            this.mutants = [];
            this.S.next_gen();

            // Prepare competing genes:
            this.mutants.push(this.leading_gene[0]);
            this.mutants.push(this.mutate(this.GEN_SIZE - 1 - Math.floor(this.GEN_SIZE / 5)));
            for (let i = 0; i <= this.GEN_SIZE - this.mutants.length; i++) {
                this.mutants.push(this.init_args())
            }

            this.live(preset);
            this.leading_gene = this.S.fitness();
            this.S.writer();

        }

        console.log(this.S.history());

        this.S.computer_control.addEventListener("click", e => this.demo())

    }

    live(preset) {

        this.mutants.forEach(m => {

            if (m === undefined) return; // Ostrich. Where the hell do I take in undefined

            const B = new Board(false, preset);
            B.start("computer");

            let i = 0;

            while(B.active) {

                // Solve the game!
                const all_tiles = B.q_tiles();
                // let to_be_eaten = all_tiles[Math.floor(Math.random() * (all_tiles.length - 1))]
                let tile_to_pick = pickTile(B, m);
                let to_be_eaten = all_tiles[tile_to_pick];

                B.eat(to_be_eaten);

                i++;
                if (i > 10000) {
                    console.log("Infinite loop detected. Stopping. Score: " + B.score);
                    break;
                }

            }

            this.S.save_data(B.score, m)

        });

    }

    demo() {
        const B = new Board(true, 7);
        B.start("demo");

        const _solve = (B) => {

            // Solve the game!
            const all_tiles = B.q_tiles();
            // let to_be_eaten = all_tiles[Math.floor(Math.random() * (all_tiles.length - 1))]
            let tile_to_pick = pickTile(B, this.S.current_best_args);
            let to_be_eaten = all_tiles[tile_to_pick];

            B.eat(to_be_eaten);

            if (B.active) {
                setTimeout(() => {
                    _solve(B);
                }, 500);
            }

        }

        _solve(B)
    }

    mutate(max) {

        let mutations_done = 0;

        for (let i = 0; i < this.leading_gene.length; i++) {

            const chance = (i === 0) ? Math.floor(max / 2) : (i === 1) ? Math.floor(max * 3 / 10) : max - mutations_done - 1;
            // -How many times should we push it?
            mutations_done += chance;

            for (let _ = 0; _ < chance + 1; _++) {
                if (!this.leading_gene[i]) {
                    console.log(this);
                    console.log(this.leading_gene, i, chance);
                    console.log("Found error, adding extra gene...");
                    continue;
                }
                this.mutants.push(this.leading_gene[i].map(g => {
                    let change = g * Math.random() * ((Math.random*2 > 1) ? 1 : -1);
                    return g + Math.round(change * this.VARIANCE * 10) / 10;
                }));
            }
        }

    }

    init_args() {
        const res = [];
        let max_args = this.active_args
        while (max_args) {
            let new_arg = Math.random() * 10 * ((Math.ceil(Math.random() * 2) > 1 ? -1 : 1));
            new_arg = Math.round(new_arg);
            new_arg = (new_arg === -0) ? 0 : new_arg;
            res.push(new_arg)
            max_args--;
        }
        return res;
    }

}
