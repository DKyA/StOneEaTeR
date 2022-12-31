

export class Stats {

    constructor () {

        this.gen_counter = 0;
        this.scores = [];
        this.all_scores = [];
        this.current_data = {};

        this.H_mean = [];
        this.H_med = [];
        this.H_max = [];

        this.construct_action();

    }

    construct_action() {
        this.computer_control = document.createElement("button");
        this.computer_control.classList.add("c-res");
        this.computer_control.innerHTML = "Sample game";
        document.querySelector("body").appendChild(this.computer_control);
    }

    _q(id) {
        return document.querySelector("#"+id);
    }

    next_gen() {

        this.gen_counter ++;
        this.current_data = {};
        this.scores = [];

    }

    save_data(data, args) {

        this.current_data[data] = args;
        this.scores.push(data);

    }

    fitness() {

        let scores = new Set(Object.keys(this.current_data));
        scores = [...scores].map(s => {
            return +s;
        });
        scores = [...scores].sort((a, b) => (+b) - (+a));

        this.current_best_args = this.current_data[scores[0]];

        return [
            this.current_data[scores[0]],
            this.current_data[scores[1]],
            this.current_data[scores[2]],
        ];

    }

    writer() {

        this.all_scores = this.all_scores.concat(this.scores);
        this.scores = this.scores.sort((a, b) => a - b);

        this.H_max.push(this.scores[this.scores.length - 1]);
        this.H_mean.push(Math.round(this.scores.reduce((s, a) => s + a) / this.scores.length * 100) / 100);
        this.H_med.push(this.scores[Math.ceil(this.scores.length / 2)]);

    }

    history() {
        return {
            Maxes: this.H_max,
            Means: this.H_mean,
            Meds: this.H_med,
            All: this.all_scores
        }
    }

}