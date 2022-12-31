export const buttons = document.querySelectorAll(".btn");
export const wrapper = document.querySelector(".wrapper");
export const scoreboard = document.querySelector(".score");
export const game_over = document.querySelector(".end");
export const final = document.querySelector(".final");


const createDiv = (css) => {
    let x = document.createElement("div");
    x.classList.add(css);
    return x
}

export class UI {

    constructor(interactive, B) {

        this.B = B;
        this.interactive = interactive;

        this.body = document.querySelector("body");

        this.frame = createDiv("frame");

        this.wrapper = createDiv("wrapper");

        this.buttons = (() => {
            const res = [];
            for (let i = 0; i < 2; i++) {
                let btn = document.createElement("button");
                btn.classList.add("btn");
                btn.innerHTML = i === 0 ? "Shuffle" : "Restart";
                res.push(btn)
            }
            return res;
        })();

        this.score = createDiv("score");
        this.final = document.createElement("span");
        this.end = createDiv("end");

        if (!this.interactive) return;
        this.populate();

    }

    populate() {

        this.score.innerHTML = "0 pts";
        const headline = document.createElement("h3");

        this.final.classList.add("final");
        const text_content = document.createElement("span");
        text_content.innerHTML = 'Game over. <br> Your score: '
        headline.appendChild(text_content);
        headline.appendChild(this.final);
        this.end.appendChild(headline);
        this.end.appendChild(this.buttons[1]);

    }

    place() {

        if (!this.interactive) return;

        this.body.appendChild(this.frame);
        this.frame.appendChild(this.wrapper);
        this.frame.appendChild(this.buttons[0])
        this.frame.appendChild(this.score);
        this.frame.appendChild(this.end);

    }

    destroy() {

        if (!this.interactive) return;

        this.body.removeChild(this.frame);

    }

    //////////// Shadowing UI functions

    ui_start() {
        this.buttons.forEach(b => b.addEventListener("click", () => this.B.createBoard(true, Math.random())));
    }

    ui_reset() {

        this.end.style.visibility = "hidden";
    
        this.wrapper.style.visibility = "visible";
        
        // Killing all children
        while (this.wrapper.firstChild) {
            this.wrapper.removeChild(this.wrapper.firstChild);
        }

    }

    ui_r_cols(col) {

        this.wrapper.removeChild(col);

    }

}