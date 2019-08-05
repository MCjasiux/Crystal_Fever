var canvas, ctx, canvas2, ctx2, canvas3, ctx3, camera, player, player2
//19x12


function relativeToCanvas(obj) {
    return {
        x: obj.x - camera.getCordsInUnits().x,
        y: obj.y - camera.getCordsInUnits().y
    }
}
var game = {
    countGems: function () {
        for (var i = 0; i < game.map.length; i++) {
            for (var j = 0; j < game.map[i].length; j++) {
                var el = game.map[i][j];
                if (el == 3) {
                    game.score++
                } else if (el == 4) {
                    game.score += 3
                }
            }
        }
    },
    drawAbsolute: function (what, x, y) {
        var offsetX = (-camera.getCordsInUnits().x) * this.size;
        var offsetY = (-camera.getCordsInUnits().y) * this.size;

    },
    falling: {
        toFall: function () {
            //sprawdza, czy gracz nie wywołał właśnie reakcji łańcuchowej "spadających klejnotów"

            for (var i = 0; i < game.map.length; i++) {
                for (var j = 0; j < game.map[i].length; j++) {
                    var playerUnderGem = (player.state.to.y == i + 1 && player.state.to.x == j)
                    var player2UnderGem = false
                    if (player2)
                        player2UnderGem = (player2.state.to.y == i + 1 && player2.state.to.x == j)
                    //  jeśli brak drugiego gracza, nie będzie on inicjował spadania
                    if ((game.map[i][j] == 3 || game.map[i][j] == 4 || game.map[i][j] == 7) && (game.map[i + 1][j] == 0) && (!playerUnderGem && !player2UnderGem)) {
                        game.falling.tab.push({
                            prog: 0,
                            x: j,
                            y: i,
                            what: game.map[i][j]
                        })
                        game.map[i + 1][j] = 9 //placeholder - solidny blok, za który będzie później klejnot
                        game.map[i][j] = 9
                        //Na temat synchronicznego spadania:
                        //zgodnie z fizyką, gemy w kolumnie powinny spadać jednocześnie
                        //, w oryginalnej grze spadają jednak w odstępie jednego tile'a
                        //i tak też będzie tutaj
                        //Oczywiście wymaga to wywoływania toFall() w każdej klatce
                        //kostka 9 to pomocniczy blok kolizji
                        //spadający gem zajmuje dzięki temu 2 tile
                    }
                }
            }


        },
        freeFall: function () {
            //działa na zasadzie tablicy renderingu
            //rusza po trochu wszystkimi spadającymi klockami

            for (var i = 0; i < game.falling.tab.length; i++) {
                var element = game.falling.tab[i];
                //   console.log(element.x)
                var offsetX = (-camera.getCordsInUnits().x) * game.size; //rysowanie bezwzględne
                var offsetY = (-camera.getCordsInUnits().y) * game.size;

                element.prog++;
                if (element.prog > 20) {
                    game.falling.tab.splice(i, 1) // i koniec spadania
                    console.warn(game.map[element.y][element.x])
                    if (game.map[element.y][element.x] != 3 && game.map[element.y][element.x] != 4)
                        game.map[element.y][element.x] = 0 //miejsce z ktorego spadł, zwalnia się
                }
                if (element.prog == 20) { //gem przeleciał 1 długość, co teraz?

                    console.log("placeholder na: " + (element.y + 1))
                    var playerUnderGem = (element.y + 2 == player.y && element.x == player.x)
                    var playerToUnderGem = (element.y + 2 == player.state.to.y && element.x == player.state.to.x)
                    var player2UnderGem = false
                    var player2ToUnderGem = false
                    if (player2) {
                        player2UnderGem = (element.y + 2 == player2.y && element.x == player2.x)
                        player2ToUnderGem = (element.y + 2 == player2.state.to.y && element.x == player2.state.to.x)
                    }


                    if (game.map[element.y + 2][element.x] != undefined && game.map[element.y + 2][element.x] == 0 && (!playerToUnderGem && !player2ToUnderGem)) {
                        //^     Gem spada na wolne miejsce, gdzie nie ma gracza - leci dalej
                        console.log("lecę dalej")
                        game.map[element.y][element.x] = 0
                        element.prog = 0
                        element.y++;
                        game.map[element.y + 1][element.x] = 9
                    } else {
                        //zatrzumanie - spadł na przeszkodę
                        console.log("stop")
                        game.map[element.y + 1][element.x] = element.what //opadnięcie klejnotu

                        if (game.map[element.y][element.x] != 3) {


                        }

                        //^zwolnienie następuje 
                    }

                }
                game.draw(element.what, offsetX + element.x * game.size, offsetY + element.y * game.size + element.prog * game.size / 20) //rysowanie spadającego gemu

                //   console.log(element)
            }
        },
        toSlip: function () {
            //funkcja działająca podobnie do .freFalling()
            //gemy będące na krawędzi będą przesuwać się w bok (+ obrót) z takim samym tempem, jak spadające
            //          --      
            //          Przykład:
            //            3
            //           333    --OK
            //          33333
            //          -------
            //
            //          v-stacza się w lewo i w dół
            //          323 -> stacza się w prawo i w dół
            //          222
            //          222
            //      ------------------
            for (var i = 0; i < game.map.length; i++) {
                for (var j = 0; j < game.map[i].length; j++) {
                    var playerRightToGem = ((player.state.to.y == i || player.state.to.y - 1 == i) && player.state.to.x - 1 == j)

                    var playerLeftToGem = ((player.state.to.y == i || player.state.to.y - 1 == i) && player.state.to.x + 1 == j)




                    var player2LeftToGem = false
                    var player2RightToGem = false

                    if (player2) {
                        player2LeftToGem = ((player2.state.to.y == i || player2.state.to.y - 1 == i) && player2.state.to.x - 1 == j)
                        player2RightToGem = ((player2.state.to.y == i || player2.state.to.y - 1 == i) && player2.state.to.x + 1 == j)
                    } //^warunki gdy gracz blokuje gem przed spadnięciem - 6 możliwości:
                    //
                    //       3       3X      3      X3      
                    //      22X     22      X22      22     
                    if ((game.map[i][j] == 3 || game.map[i][j] == 4) && (game.map[i + 1][j] == 3 || game.map[i + 1][j] == 4)) {

                        //^wspólny warunek toczenia -> klejnot 3/4 i kryształ pod spodem
                        if ((game.map[i + 1][j + 1] == 0) && (game.map[i][j + 1] == 0) && !playerRightToGem && !player2RightToGem) {
                            //^wolne miejsce po prawej

                            game.falling.toslip.push({
                                prog: 0,
                                x: j,
                                y: i,
                                dir: 1,
                                what: game.map[i][j]
                            })
                            game.map[i][j + 1] = 9
                            game.map[i][j] = 9
                        } else if ((game.map[i + 1][j - 1] == 0 && (game.map[i][j - 1] == 0)) && !playerLeftToGem && !player2LeftToGem) {
                            console.log(game.map[i][j])
                            //^wolne miejsce po lewej

                            game.falling.toslip.push({
                                prog: 0,
                                x: j,
                                y: i,
                                dir: -1,
                                what: game.map[i][j]
                            })
                            game.map[i][j - 1] = 9
                            game.map[i][j] = 9
                        }
                    }

                }
            }


        },
        freeSlipping: function () {
            for (var i = 0; i < game.falling.toslip.length; i++) {
                var element = game.falling.toslip[i];
                //   console.log(element.x)
                var offsetX = (-camera.getCordsInUnits().x) * game.size; //rysowanie bezwzględne
                var offsetY = (-camera.getCordsInUnits().y) * game.size;
                element.prog++;
                if (element.prog > 20) {
                    console.log("???")

                    if (game.map[element.y][element.x] != 3 && game.map[element.y][element.x] != 4)
                        game.map[element.y][element.x] = 0 //miejsce z ktorego spadł, zwalnia się
                    game.falling.toslip.splice(i, 1) // i koniec spadania
                }
                if (element.prog == 20) { //gem przeleciał 1 długość, co teraz?
                    if (game.map[element.y][element.x + element.dir] != undefined && game.map[element.y][element.x + element.dir] == 0) {
                        //^     Gem spada na wolne miejsce, gdzie nie ma gracza - leci dalej
                        console.log("lecę dalej")
                        game.map[element.y][element.x] = 0
                        element.prog = 0
                        element.x += element.dir;
                        game.map[element.y][element.x + element.dir] = 9
                    } else {

                        console.log("stop")
                        game.map[element.y][element.x + element.dir] = element.what
                        if (game.map[element.y][element.x] != 3) { }

                    }

                }
                //      ctx.save();

                function drawImageCenter(image, x, y, cx, cy, scale, rotation) {
                    ctx.setTransform(scale, 0, 0, scale, x, y); // sets scale and origin
                    ctx.rotate(rotation);
                    ctx.drawImage(image, -cx, -cy);
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                }
                var stringToDraw
                console.log(element.what)
                if (element.what == 3) {
                    stringToDraw = "gem"
                    drawImageCenter(document.getElementById(stringToDraw), offsetX + element.x * game.size + element.dir * element.prog * game.size / 20 + game.size / 2, offsetY + element.y * game.size + game.size / 2, 7, 7, 2, element.dir * element.prog * Math.PI / 40)
                }

                if (element.what == 4) {
                    stringToDraw = "gem_blue"
                    drawImageCenter(document.getElementById(stringToDraw), offsetX + element.x * game.size + element.dir * element.prog * game.size / 20 + game.size / 2, offsetY + element.y * game.size + game.size / 2, 7, 7, 2, element.dir * element.prog * Math.PI / 40)

                }

                if (element.what == 7) {
                    stringToDraw = "boulder"
                    drawImageCenter(document.getElementById(stringToDraw), offsetX + element.x * game.size + element.dir * element.prog * game.size / 20 + game.size / 2, offsetY + element.y * game.size + game.size / 2, 7, 7, 2, element.dir * element.prog * Math.PI / 40)

                }

                // ctx.translate(canvas.width / 2, canvas.height / 2);
                //   ctx.rotate();
                //   ctx.drawImage(image, -image.width / 2, -image.width / 2);

                //  game.draw(3, offsetX + element.x * game.size + element.dir * element.prog * game.size / 20, offsetY + element.y * game.size)
                //    ctx.restore();
                //^rysuje gem ruszajacy sie w  prawo lub lewo (dir)
            }
        },
        tab: [

        ],
        toslip: []

    },

    displayScore: function () {
        var offx = 415
        var offy = 340
        ctx2.fillStyle = "black"
        ctx2.fillRect(offx, offy, 60, 40)
        ctx2.font = "40px Digital";
        ctx2.fillStyle = "white"
        ctx2.fillText(game.score, offx, offy + 35);
    },
    displayTime: function () {

        var offx = 135
        var offy = 340
        ctx2.fillStyle = "black"
        ctx2.fillRect(offx, offy, 60, 40)
        ctx2.font = "40px Digital";
        ctx2.fillStyle = "white"
        ctx2.fillText(game.time, offx, offy + 35);
    },
    isSolidBlock: function (x, y) {
        var pl = (x == player.x && y == player.y) || (x == player.state.to.x && y == player.state.to.y) && !player.lock
        if (player2 && !player2.lock)
            var pl2 = (x == player2.x && y == player2.y) || (x == player2.state.to.x && y == player2.state.to.y)
        /*
        Dla uproszczenia, kolizja z graczami jest tutaj
        I kolizja z elementami (ściana, blokada, głaz, i nieaktywny portal)        
        */
        var el = game.map[y][x]
        if (el == 1 || el == 9 || el == 7 || pl || pl2 || (el == 5 && game.score > 0))
            return true
        else return false
    },
    draw: function (what, offset_x, offset_y) {
        /*
        Funkcja rysująca sprity
        */
        var stringToDraw
        var sx = 0
        var sy = 0
        if (what < 0 || what == undefined) {
            stringToDraw = "dirt"
            todraw = document.getElementById(stringToDraw)
            ctx.drawImage(todraw, offset_x, offset_y, game.size, game.size)
        } else if (what == 9) {

        } else {
            switch (what) { //decyduje o tym co ma rysować
                case 0:
                    return
                    break;
                case 1:
                    stringToDraw = "wall"
                    break;
                case 2:
                    stringToDraw = "dirt"
                    break;
                case 3:
                    stringToDraw = "gem"
                    break;
                case 4:
                    stringToDraw = "gem_blue"
                    break;
                case 5:
                    stringToDraw = "portal"
                    sx = (Math.floor(player.clock / 6) % 5) * 16
                    if (game.score == 0)
                        sy = 16
                    break;
                case 7:
                    stringToDraw = "boulder"
                    break;
                case 9:
                    stringToDraw = "red"
                    break;
                default:
                    return
            }
            todraw = document.getElementById(stringToDraw)
            ctx.drawImage(todraw, sx, sy, 16, 16, offset_x, offset_y, game.size, game.size)
        }

    },
    dig: function (ix, iy, offset_x, offset_y) {
        /*
        animacja "kopania":
        będzie się rysować czarny rozszerzający się sprite, w stronę zależną od kierunku gracza
        dane o postępie animacji będą na danej kostki 
        animacja rozpocznie się na -k*100-10, a skończy na -k*100 -> 10 klatek na wykopanie
        
        gracz 2 będzie generował kostki (-300,-600)
        W mapie znajdują się tylko liczby całkowite -> przedziały  będą oznaczać, co jest "kopane"
        */

        var elem = game.map[ix][iy]
        var bckg
        var direction = 0
        /*
        Na dole dekoder kostek -> zwróci informacje o typie kostki na podstawie id
        */
        if (elem > -300) {
            if (elem > -100) {
                bckg = 2
                //^ziemia  -20,0
            } else if (elem > -200) {
                //^klejnot niebieski -120,-100
                bckg = 4
            } else if (elem > -300) {
                //^klejnot zielony -220, -200
                bckg = 3
            }
            direction = player.getWorldDirection()
        } else if (elem > -600) {
            if (elem > -400) {
                bckg = 2
                //^ziemia  -20,0
            } else if (elem > -500) {
                //^klejnot niebieski -120,-100
                bckg = 4
            } else if (elem > -600) {
                //^klejnot zielony -220, -200
                bckg = 3
            }
            if (player2)
                direction = player2.getWorldDirection()
        }
        /*
        reszta z dzielenia przez 100 będzie oznaczać postęp animacji (sprita kopania)
        */
        var prog = Math.floor((elem % 100) * 6 / 10)
        if (prog >= 0)
            game.map[ix][iy] = 0
        else {
            game.draw(bckg, offset_x, offset_y)
            var step = 0
            if (direction == 3)
                step = 16
            else if (direction == 1)
                step = 48
            else if (direction == 4)
                step = 32
            ctx.drawImage(document.getElementById("digging_full"), Math.abs(prog) * 16, step, 16, 16, offset_x, offset_y, game.size, game.size)
            game.map[ix][iy] += 1
        }



    },
    create: function () {
        /*
        Generowanie kostek w zasięgu kamery +- 1
        Bierze pod uwagę pozycję kamery
        
        Jeśli id kostki bęzie poniżęj 0, to zamiast rysowania, będzie kopanie
        Np.:
            2 -> draw() = rysuj sprite "ziemia"

            -5 -> dig() = rysuj sprite "ziemia" + rysuj sprite "digging" w pozycji 5/10
        */
        var startCol = Math.floor(camera.getCordsInUnits().x)
        var endCol = Math.floor(startCol + (camera.width))
        var startRow = Math.floor(camera.getCordsInUnits().y)
        var endRow = Math.floor(startRow + (camera.height))
        var offsetX = (-camera.getCordsInUnits().x + startCol) * this.size;
        var offsetY = (-camera.getCordsInUnits().y + startRow) * this.size;

        ctx.fillStyle = "black"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        for (var c = startCol; c <= endCol; c++) {
            for (var r = startRow; r <= endRow; r++) {
                if (game.map[r]) { //renderuje mapkę do końca - lepiej ograniczać kamerę, niż renderer
                    var tile = game.map[r][c];
                    var x = (c - startCol) * this.size + offsetX;
                    var y = (r - startRow) * this.size + offsetY;
                    if (tile >= 0) { // 0 => pusta kostka
                        this.draw(tile, x, y)
                    } else {
                        if (game.map[r] && game.map[r][c] != undefined)
                            this.dig(r, c, x, y)
                    }
                }
            }
        }

    },
    end: function (mode) {
        /*
        Koniec gry, wyzwalany przez timer, lub aktywny teleport
        */
        console.log("koniec gry")
        ui.curtain.show()
        if (mode) { //przegrana
            ui.write("TRY AGAIN", 190, 130)
        } else if (!mode) { //wygrana
            ui.write("       YOUR TIME: " + (110 - game.time), 20, 130)
            if (player2 == undefined) {
                ui.write("        (SINGLEMODE)", 20, 170)
            }
        }
        game.pause = true
        window.onkeypress = function () {
            location.reload()
        }
        /*
        Poniższy kod zastąpiony reloadem()
        window.onkeydown = function () {
            ui.menu.display()
            ui.menu.steer()
            ui.stripes.pointer.moving()
            cancelAnimationFrame(renderer)
            
        }
        */
    },
    getMid: function () {
        /*
        Zwraca średnią pozycji obu grazcy -> potrzebne do wspólnej kamery
        */
        var out = {
            x: (player.x + player2.x) / 2,
            y: (player.y + player2.y) / 2
        }
        return out
    },
    map: [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 3, 3, 2, 2, 2, 2, 2, 2, 3, 3, 1],
        [1, 3, 2, 2, 2, 2, 2, 2, 3, 3, 1, 1, 1, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 3, 2, 3, 2, 2, 2, 2, 3, 2, 2, 1],
        [1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 1],
        [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 5, 5, 2, 2, 2, 2, 2, 2, 2, 3, 1],
        [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 3, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 1],
        [1, 2, 2, 3, 2, 3, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 3, 0, 0, 0, 0, 3, 3, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1],
        [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 3, 0, 0, 3, 3, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 3, 1],
        [1, 2, 2, 2, 3, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 3, 3, 3, 1, 2, 2, 2, 2, 2, 2, 1, 2, 3, 2, 2, 2, 2, 1],
        [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 3, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1],
        [1, 3, 2, 2, 2, 2, 2, 3, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1],
        [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 1],
        [1, 2, 2, 2, 2, 2, 1, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 3, 1],
        [1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1],
        [1, 2, 2, 3, 1, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 1, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 2, 2, 1, 2, 2, 1, 2, 1, 1, 2, 2, 1, 2, 2, 2, 2, 1, 4, 4, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 2, 1, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 1, 4, 4, 4, 4, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 2, 1, 2, 1, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 1, 4, 4, 4, 4, 4, 4, 4, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 4, 4, 4, 4, 4, 4, 4, 4, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 1],
        [1, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 1],
        [1, 3, 2, 2, 3, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],

    size: 32,
    score: 0,
    time: 110,
    pause: true
}
var renderer

function render() {
    game.create()
    if (!player.lock && player.state.prog == player.speed) {
        player.statify()
        if (player.controls.h != 0 || player.controls.v != 0) {
            player.move(player.controls)
        }

    }

    if (player2 != undefined && player2.state.prog == player2.speed) {
        player2.statify()
        if (player2.controls.h != 0 || player2.controls.v != 0) {
            player2.move(player2.controls)
        }

    }
    game.falling.toFall()
    game.falling.freeFall()
    game.falling.toSlip()
    game.falling.freeSlipping()
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height)
    if (!player.lock)
        player.animate()
    if (player2) {
        if (!player2.lock) {
            player2.animate()
            camera.compromise()
        }

        if (player2.clock >= 60)
            player2.clock = 0

        else
            player2.clock++
    }
    camera.animate()

    game.displayScore()
    game.displayTime()
    if (player.clock >= 60)
        player.clock = 0

    else
        player.clock++
    renderer = requestAnimationFrame(render)
}

function init() {
    ui.menu.display()
    ui.menu.steer()
    ui.stripes.pointer.moving()
}

function start() {
    console.log("start")
    camera = new Camera()
    if (ui.types.join("").indexOf("ppebtwxd") != -1) {
        player = new Player(1, 1, "1RXSL")
    } else
        player = new Player(1, 1, "player_animated_full")
    //^Easter egg ;)
    game.players = [player, player2]
    game.countGems()
    steer()
    ctx3.clearRect(0, 0, canvas3.width, canvas3.height)
    ctx4.clearRect(0, 0, canvas4.width, canvas4.height)
    ui.curtain.hide()
    var timer = setInterval(function () {
        //limit czasowy
        if (game.time == 0) {
            clearInterval(timer)
            game.end(1) //koniec gry - negatywny
        } else
            game.time--
    }, 1000)
    renderer = requestAnimationFrame(render)
}
document.addEventListener("DOMContentLoaded", function () {
    canvas = document.getElementById("canvas")
    ctx = canvas.getContext("2d");
    canvas2 = document.getElementById("canvas2")
    ctx2 = canvas2.getContext("2d");
    canvas3 = document.getElementById("canvas3")
    ctx3 = canvas3.getContext("2d");
    canvas4 = document.getElementById("canvas4")
    ctx4 = canvas4.getContext("2d");

    var myImage = new Image(608, 384);
    myImage.src = 'images/Crystal_Fever_1.png';

    myImage.style.zIndex = 100
    document.getElementById("container").appendChild(myImage)
    setTimeout(function () {
        document.getElementById("container").removeChild(myImage)
    }, 2500)
    init()
})