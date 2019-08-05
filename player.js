Player = function (inx, iny, str) {
    /*
        str to id obrazku ze spritem gracza
        inx, iny to pozycje startowe graczy

    */
    this.statify = function () {
            /*
            Gdy gracz dojdzie do celu, jego pozycja aktualna zrównuje się z docelową
            */
            this.x = this.state.to.x
            this.y = this.state.to.y
        },
        this.getRelativePosition = function () {
            /*
            Zwraca pozycję gracza względem ram canvasa w jednostkach gry
            */
            return ({
                x: this.x - camera.getCordsInUnits().x,
                y: this.y - camera.getCordsInUnits().y
            })
        },
        this.move = function (vect) {
            /*
            przemieszcza gracza o dany wektor
            vect ma postać obiektu {x:0,y:0}
            */
            var tempx = this.state.to.x + vect.h
            var tempy = this.state.to.y + vect.v
            /*
            ^sprawdza koordynaty gracza z wyprzedzeniem

            .to jest logiczną pozycją gracza na mapie
            sprite gracza podąża od pozycji nominalnej do .to

            update kamery tutaj, ze względu na zasadę działania kamery
            */
            if (vect.h != 0) {
                tempy = this.state.to.y
            }

            if (!game.isSolidBlock(tempx, tempy)) {

                if (game.map[tempy][tempx] == 5) {
                    //^wejście na portal

                    if (player2 == undefined) { //jeden gracz -> koniec gry
                        this.lock = true
                        setTimeout(function () {
                            game.end(0)
                        }, 1000)

                    } else { //wielu graczy
                        this.lock = true
                        if (game.players[0].lock && game.players[1].lock) { //obaj w portalu
                            setTimeout(function () {
                                game.end(0)
                            }, 1000)
                        } else {

                        }

                    }


                }

                camera.update()
                if (game.map[tempy][tempx] == 3) {
                    game.score--
                } else if (game.map[tempy][tempx] == 4) {
                    game.score -= 3
                }
                //^zbieranie klejnotów - zielone za 1, niebieskie za 3
                var el = game.map[tempy][tempx]
                if (el == 3) {
                    game.map[tempy][tempx] = -210
                } else if (el == 4) {
                    game.map[tempy][tempx] = -110
                } else if (el == 2) {
                    game.map[tempy][tempx] = -10
                } else {
                    game.map[tempy][tempx] = 0
                }
                //^kopanie różnych bloków
                if (player2 == this)
                    game.map[tempy][tempx] -= 300
                /*
                    Gracz 2 musi generować kostki indexowane inaczej (przedział -600,-300)
                */
                if (tempx >= 0 && this.x < game.map[0].length) {
                    this.state.to.x = tempx
                }

                if (tempy >= 0 && this.y < game.map.length) {

                    this.state.to.y = tempy
                }
                /*
                ^jeśli gracz nie wychodzi za mapę, to robi krok,
                w zasadzie niepotrzebne ze względu na mur wokół mapy
                */
            }

            this.state.prog = 0
        },
        this.update = function () {
            /*
            Rysuje stojącego gracza (vector ==0), + animacja tupania
            */
            if (this.clock % 30 <= 15)
                stepx = 0
            else stepx = 16
            ctx2.drawImage(document.getElementById(str), stepx, 0, 16, 16, (this.x - camera.getCordsInUnits().x) * game.size, (this.y - camera.getCordsInUnits().y) * game.size, game.size, game.size)
        },
        this.animate = function () {
            /*
            .state.prog to postęp animacji ruchu
            powinna to być 1-różnica obecnej pozycji i docelowej 
            będzie rysować gracza w obliczonej wcześniej pozzycji, a gdy dotrze do celu, będzie animować go statycznie

            Tutaj dodatkowo będzie animowany sprite postaci (4 klatki dla każdego kierunku + stojący)

            sprite jest kombinowany, rzędy:
            0 - stojący,
            1 - prawo
            2 - dół
            3 - lewo
            4 - góra
            */

            if (this.state.prog < this.speed) {
                var x = game.size * (this.x - camera.getCordsInUnits().x) + (this.state.to.x - this.x) * (game.size / this.speed) * this.state.prog
                var y = game.size * (this.y - camera.getCordsInUnits().y) + (this.state.to.y - this.y) * (game.size / this.speed) * this.state.prog
                var img = document.getElementById(str)
                var direction = this.getWorldDirection()
                var step = Math.floor(4 * this.state.prog / this.speed) * 16
                ctx2.drawImage(img, step, direction * 16, 16, 16, x, y, game.size, game.size);
                this.state.prog++
            } else {
                if (!this.lock) {
                    this.state.to.x = this.x
                    this.state.to.y = this.y
                    this.update()
                }

            }



        },
        this.getWorldDirection = function () {
            /*
                Zwraca kierunek ruchu gracza od 1 do 4, 0 dla bezruchu
            */
            var direction
            if (this.state.to.x == this.x && this.state.to.y == this.y) {
                direction = 0
            } else if (this.state.to.x > this.x) {
                direction = 1
            } else if (this.state.to.y > this.y) {
                direction = 2
            } else if (this.state.to.x < this.x) {
                direction = 3
            } else if (this.state.to.y < this.y) {
                direction = 4
            } else {

            }
            return direction
        },
        this.x = inx,
        this.y = iny,
        this.speed = 10, //im mniejsza, tym szybciej
        this.controls = {
            h: 0,
            v: 0,

        },
        this.lock = false, //blokada - po zablokowaniu, gracz nie będzie się poruszał, ani nie będzie renderowany
        this.clock = 0, //zegar służy do animowania "tupania" w miejscu  (w zasadzie sekundnik)
        this.state = {
            prog: 0, //postęp przejścia między całymi kostkami (od 0 do this,speed)
            to: {
                x: inx,
                y: iny,
                getRelativePosition: function () {
                    return ({
                        x: this.x - camera.getCordsInUnits().x,
                        y: this.y - camera.getCordsInUnits().y
                    })
                },
            }
        }
}