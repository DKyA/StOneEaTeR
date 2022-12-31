

export class Tile {

    constructor(color, interactive) {
        this.interactive = interactive;
        this.color = color;
        this.value = 0;
        this.lastChecked = 0;
    }
    init(coords) {
        this.coords = coords
    }
    place() {
        this.element = document.createElement("div");
        this.element.classList.add("stone");
        this.element.style.backgroundColor = this.color;
        this.element.setAttribute("coords", this.coords);
        return this.element;
    }
    setValue(l) {
        if (l === 1) {
            this.value = 0;
        }
        else {
            this.value = Math.pow(l, 2);
        }
        if (this.interactive) {
            this.element.title = this.value;
        }
    }
    get pass_backup() {
        return {
            coords: this.coords,
            element: this.element,
            color: this.color
        }
    }
    adjust_coords(x) {
        this.coords[0] += x[0];
        this.coords[1] += x[1];
        if (this.interactive) {
            this.element.setAttribute("coords", this.coords);
        }
    }
}
