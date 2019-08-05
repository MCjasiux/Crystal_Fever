var Camera = function () {
    /*
    Po kilku zmianach, wysokość i szerokość kamery są w kostkach (unitach - 15x10)
    a pozycja w pikselach, ze względu na konieczność płtnnych przejść
    pozycja kamery w unitach będzie teraz dostępna przez .getCordsInUnits()
    */
    this.height = 12,
        this.speed = 3, //pixele/sekundę
        this.width = 19,
        this.x = 0,
        this.y = 0,
        this.to = {
            x: 0,
            y: 0,
            getCordsInUnits: function () {
                return {
                    x: this.x / game.size,
                    y: this.y / game.size
                }
            },
        },
        this.getCordsInUnits = function () {
            return {
                x: this.x / game.size,
                y: this.y / game.size
            }
        },
        this.update = function () {


            var abs = player.state.to.getRelativePosition() //y względem ram canvasa
            var dir = player.controls //pobranie obecnej pozycji klawiszy -> nie będzie zmieniać kierunku w czasie update'u
            var borders = camera.getBorders() //w przypadku prostokątnej planszy, pozycja kamery nie może przekroczyć granic
            if (abs.y >= Math.floor(camera.height / 2) && dir.v == 1 || abs.y <= Math.floor(camera.height / 2) && dir.v == -1) {
                //I tak ma być: 2 kierunki -> eliminuje uciekanie z narożników
                if (Math.floor(camera.to.getCordsInUnits().y) + dir.v <= borders.y && Math.floor(camera.to.getCordsInUnits().y) + dir.v >= 0) { //warunek kamery na mapie
                    camera.to.y += dir.v * game.size
                }
            } else {

            }
            if (abs.x >= Math.floor(camera.width / 2) && dir.h == 1 || abs.x <= Math.floor(camera.width / 2) && dir.h == -1) { //gracz na środku...
                if (Math.floor(camera.to.getCordsInUnits().x) + dir.h <= borders.x && Math.floor(camera.to.getCordsInUnits().x) + dir.h >= 0) { //warunek kamery na mapie
                    camera.to.x += dir.h * game.size
                }
            }

        },
        this.compromise = function () {

            /*
                ^Osobny algorytm do podążania za obojgiem graczy - muszą być w kadrze
                Kamera będzie centrować się na punkcie między graczami, nie wyjeżdżając za mapę
            */
            var abs = game.getMid()
            var dir = player.controls
            var borders = camera.getBorders()
            var offy = 0,
                offx = 0

            offy = Math.floor(abs.y - camera.height / 2) * game.size
            offx = Math.floor(abs.x - camera.width / 2) * game.size

            if (offy < 0) {
                camera.to.y = 0
            } else if (offy > camera.getBorders().y * game.size) {

            } else {
                camera.to.y = offy
            }

            if (offx < 0) {
                camera.to.x = 0
            } else if (offx > camera.getBorders().x * game.size) {

            } else {
                camera.to.x = offx
            }

        },
        this.animate = function () {
            /*
            kamera podąża do celu z określoną prędkością (sign() różnicy * .speed)
            jeśli cel jest bliżej niż prędkość (pixele), to kamera wchodzi na miejsce docelowe, aby uniknąć "trzepania"
            */
            if (camera.to.x != camera.x) {
                if (Math.abs(camera.to.x - camera.x) > camera.speed)
                    camera.x += Math.sign(camera.to.x - camera.x) * camera.speed
                else
                    camera.x = camera.to.x
            }

            if (camera.to.y != camera.y) {
                if (Math.abs(camera.to.y - camera.y) > camera.speed)
                    camera.y += Math.sign(camera.to.y - camera.y) * camera.speed 
                else
                    camera.y = camera.to.y
            }
        },
        this.getBorders = function () {
            return ({
                x: game.map[0].length - camera.width,
                y: game.map.length - camera.height
            })
        }
}