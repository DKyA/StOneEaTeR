import { start } from "./modules/init.js";

let btns = document.querySelector(".ui").children;

[...btns].forEach((btn, i) => {
    btn.addEventListener("click", () => start(i ? "human" : "computer"));
});
