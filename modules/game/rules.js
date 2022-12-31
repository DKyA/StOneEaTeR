import "../pkg/jsrand.js";


export class Rules {

    constructor(preset = false) {

        this.preset = preset;

        this.colors = [
            "#D70040", // red
            "#0047AB",
            "#2ab030",
            "#FFC300"
        ];
        
        this.rand_gen = new Math.seedrandom(this.preset.toString());

        if (!preset) {
            this.random_color = () => this.colors[Math.floor(Math.random() * this.colors.length)];
            return;
        }

        this.random_color = () => this.colors[Math.floor(this.rand_gen() * this.colors.length)];

    }

}