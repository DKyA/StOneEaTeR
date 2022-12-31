
import { Board } from "./game/board.js";
import { Lifecycle } from "./ai/lifecycle.js";


export const start = (player = "human") => {

    const body = document.querySelector("body");
    [...body.children].forEach(e => {
        if (e.classList.contains("ui")) return;
        body.removeChild(e);
    });

    setTimeout(() => {
        if (player === "human") {
            const B = new Board(true, Math.random());
            B.start();
            return;
        }

        new Lifecycle(20);
    }, 1000);

}
