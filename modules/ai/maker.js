export const pickTile = (B, args) => {

    // Assigns all positions a rating
    // Chooses the move with the best rating

    let grades = [-Infinity, -Infinity];
    B.q_tiles().forEach((tile, i) => {

        let res = 0;

        // Value-based things
        res += (() => {
            // Don't make dumb moves...
            if (tile.value === 0) return -Infinity;

            for (let i = 0; i < Math.ceil(args[0]); i++) {

                while ((10 + 2 * i + 2) > args.length) {
                    args.push(addNewArg());
                    console.log("whiling...");
                }

                if (B.q_tiles.length < Math.abs(Math.round(i * args[10 + 2 * i]))) {
                    return tile.value * args[10 + 2 * i + 1]
                }

                if (i > 20) {
                    console.log("Crazyyy");
                }

            }

            return tile.value * args[2];
        })();

        // How high / low am I?
        res += (() => {
            return tile.coords[0] * args[3] + 1/(tile.coords[0] * args[4] + 1);
        })();
        res += (() => {
            return tile.coords[1] * args[5] + 1/(tile.coords[0] * args[6] + 1);
        })();

        // Is my tile of same color as the dominant cluster?
        res += (() => {
            if (B.clusters.length && tile.color === B.clusters[0][0].color) return args[7];
            if (B.clusters.length > 1 && tile.color === B.clusters[1][0].color) return args[8];
            return args[9];
        })();

        // Additional ideas:
        // How many elements of same colors are around me?
        // What will be my coords if I decide to fall - should be probably done with clusters in mind. More complex?


        if (res !== undefined && grades[1] < res) {
            grades = [i, res];
        }

    });

    if (grades[0] === -Infinity) {
        console.log(grades, args);
        stop();
    }

    return grades[0]

}

function addNewArg() {

    let new_arg = Math.random() * 10 * ((Math.ceil(Math.random() * 2) > 1 ? -1 : 1));
    new_arg = Math.round(new_arg);
    return (new_arg === -0) ? 0 : new_arg;

}