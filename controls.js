function steer() {
    window.onkeypress = null
    //^usuwa sterowanie z menu
    window.addEventListener("keydown", function (e) {
        // console.log(e)
        var key = e.key
        var vect = {
            h: 0,
            v: 0
        }
        if (!player.lock)
            switch (key) {
                case "w":
                    player.controls.v = -1
                    vect.v = -1
                    break;
                case "a":
                    player.controls.h = -1
                    vect.h = -1
                    break;
                case "s":
                    player.controls.v = 1
                    vect.v = 1
                    break;
                case "d":
                    player.controls.h = 1
                    vect.h = 1
                    break;
            }

        if (!player2.lock)
            switch (key) {
                case "ArrowUp":
                    player2.controls.v = -1
                    vect.v = -1
                    break;
                case "ArrowLeft":
                    player2.controls.h = -1
                    vect.h = -1
                    break;
                case "ArrowDown":
                    player2.controls.v = 1
                    vect.v = 1
                    break;
                case "ArrowRight":
                    player2.controls.h = 1
                    vect.h = 1
                    break;

            }
        //game.freFall()

    })

    window.addEventListener("keyup", function (e) {
        //  console.log(e)
        var key = e.key
        switch (key) {
            case "w":
                player.controls.v = 0
                break;
            case "a":
                player.controls.h = 0
                break;
            case "s":
                player.controls.v = 0
                break;
            case "d":
                player.controls.h = 0
                break;
            case "ArrowUp":
                player2.controls.v = 0
                break;
            case "ArrowLeft":
                player2.controls.h = 0
                break;
            case "ArrowDown":
                player2.controls.v = 0
                break;
            case "ArrowRight":
                player2.controls.h = 0

                break;

        }
    })

    document.getElementById("canvas").addEventListener("click", function (e) {
         console.log(e)
        var key = e.key

    })
}