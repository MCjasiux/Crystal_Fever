var ui = {
    types: [],
    curtain: {
        show: function () {
            document.getElementById("curtain").style.height = "100%"
        },
        hide: function () {
            document.getElementById("curtain").style.height = "0%"
        }

    },
    menu: {
        steer: function () {
            console.log("steering")
            window.onkeydown = function (e) {
                console.log(e.key)
                ui.types.push(e.key)
                switch (e.key) {
                    //^sterowanie na menu
                    case "ArrowUp":
                        if (ui.menu.choice > 0)
                            ui.menu.choice--
                            break;
                    case "ArrowDown":
                        if (ui.menu.choice < 6)
                            ui.menu.choice++
                            break;
                    case "Enter":
                        //^akcja na enterze -> start gry, poziom, trybplayer2_animated_full
                        switch (ui.menu.choice) {
                            case 1:
                                if (ui.menu.config.mode == "SINGLE") {
                                    ui.menu.config.mode = "TEAM"
                                    player2 = new Player(2, 1, "player2_animated_full")
                                } else {
                                    ui.menu.config.mode = "SINGLE"
                                    player2 = undefined
                                }

                                ui.menu.display()
                                break;
                            case 4:
                                //^wyświetlenie twórców
                                ctx4.clearRect(0, 0, canvas4.width, canvas4.height)
                                ui.stripes.ampl = 200;
                                ui.stripes.loading()
                                ui.write("           Port:", 20, 20)
                                ui.write("Michał Jasiński", 20, 60)
                                ui.write("         Thanks to:", 20, 100)
                                ui.write("Dan Warren for longplay", 20, 140)
                                ui.write("Wanderer for crack", 20, 180)
                                ui.write("Family for support", 20, 220)
                                //  ui.write("For publishing that", 20, 180)
                                window.onkeypress = function () {
                                    location.reload()
                                }
                                break;
                            case 6:
                                setTimeout(function () {
                                    game.pause = false
                                    start()
                                }, 3000)
                                //^czas ładowania poziomu (oczywiście dla picu)
                                ui.stripes.loading()
                                ctx4.clearRect(0, 0, canvas4.width, canvas4.height)
                                var tempstr = ("WARPING TO LEVEL " + ui.menu.config.level)
                                ui.write(tempstr, 110, 170)
                                ui.write("INCOGNITO", 190, 200)
                                break;
                        }
                        break;
                }
                ui.stripes.pointer.point()
            }
        },
        choice: 0,
        config: {
            mode: "SINGLE",
            level: 1,
            playerName: "DOPPELGANGER"

        },
        list: ["PLAYER : ", "MODUS : ", "ENTER NEW PLAYER", "SHOW HI-SCORES", "SHOW CREDITS", "CHOOSE LEVEL : ", "START GAME"],
        display: function () {
            if (game.pause) {
                ctx4.clearRect(0, 0, canvas4.width, canvas4.height)
                for (var i = 0; i < ui.menu.list.length; i++) {
                    var element = ui.menu.list[i];
                    if (i == 0) {
                        element += ui.menu.config.playerName
                    } else if (i == 1) {
                        element += ui.menu.config.mode
                    } else if (i == 5) {
                        element += ui.menu.config.level
                    }

                    ui.write(element, 100, 40 + i * 50)
                }
            }
        },

    },
    stripes: {
        /*
        jeden pasek na ctx3 będzie działał jako wskażnik wyboru w menu
        */
        pointer: {
            point: function () {
                this.toy = 50 + ui.menu.choice * 50
            },
            moving: function () {
                if (ui.stripes.pointer.on) {
                    function ad() {
                        ctx3.clearRect(0, 0, canvas3.width, canvas3.height)
                        if (game.pause) {
                            ui.stripes.pointer.y += Math.sign(ui.stripes.pointer.toy - ui.stripes.pointer.y) * 2
                            //^wartość wektora przemieszczenia musi być dzielnikiem wysokości czcionki + odstępu
                            //  console.log(this)
                            var gradient = ctx3.createLinearGradient(0, ui.stripes.pointer.y, 0, ui.stripes.pointer.y + 10);
                            gradient.addColorStop("0", "yellow");
                            gradient.addColorStop("0.5", "white");
                            gradient.addColorStop("1.0", "yellow");
                            // Fill with gradient

                            ctx3.fillStyle = gradient;
                            ctx3.fillRect(0, ui.stripes.pointer.y, 608, 10)

                            requestAnimationFrame(ad)
                        }

                    }

                    ad()
                }


            },
            on: true,
            y: 50,
            toy: 50
            //^animacja
        },

        pos: 0,
        ampl: 30,
        speed: 0.08,
        thickness: 10,
        tab: [{
            state: 2,
            colors: ["blue", "white", "blue"]
        }, {
            state: 0,
            colors: ["red", "white", "darkorange"]
        }, {
            state: 1,
            colors: ["yellow", "white", "yellow"]
        }],
        loading: function () {
            /*
            Trzy różnokolorowe paski gradialne o szerokości canvasa
            Poruszają się jeden za drugim w górę i w dół (sin)
            Rysowane są na ctx3, pod tekstem menu itd


            */
            ctx3.clearRect(0, 0, canvas3.width, canvas3.height)
            if (game.pause) {
                for (var i = 0; i < ui.stripes.tab.length; i++) {
                    var element = ui.stripes.tab[i];

                    var start = canvas3.height / 2 + ui.stripes.ampl * Math.sin(element.state)
                    console.log(ui.stripes.thickness)
                    var end = start + ui.stripes.thickness
                    var gradient = ctx3.createLinearGradient(0, start, 0, end);

                    gradient.addColorStop("0", element.colors[0]);
                    gradient.addColorStop("0.5", element.colors[1]);
                    gradient.addColorStop("1.0", element.colors[2]);
                    // Fill with gradient
                    ctx3.fillStyle = gradient;
                    ctx3.fillRect(0, start, 608, ui.stripes.thickness)
                    ui.stripes.tab[i].state += ui.stripes.speed
                }

                requestAnimationFrame(ui.stripes.loading)
            }

        }
    },
    write: function (str, offsetX, offsetY, ) {
        /*
        Uproszczona wersja służąca do pisania na czarnym tle czcionką z menu
        np. menu, ładowanie poziomów

        Prawdopodobnie do zmiany na rzecz pisania z obrazka
        */
        ctx4.font = "bold 20px C64";
        // Create gradient
        var gradient = ctx4.createLinearGradient(0, offsetY, 0, offsetY + 20);
        gradient.addColorStop("0", "#40C6EB");
        gradient.addColorStop("0.1", "#40C6EB");
        gradient.addColorStop("0.3", "darkblue");
        gradient.addColorStop("0.4", "white");
        gradient.addColorStop("0.5", "white");
        gradient.addColorStop("0.55", "blue");
        gradient.addColorStop("0.7", "#40C6EB");
        gradient.addColorStop("0.9", "blue");
        gradient.addColorStop("1.0", "cyan");
        ctx4.shadowColor = "cyan" // string

        ctx4.shadowOffsetX = 2; // integer

        ctx4.shadowOffsetY = 2; // integer

        ctx4.shadowBlur = 1; // integer

        // Fill with gradient
        ctx4.fillStyle = gradient;

        ctx4.fillText(str, offsetX, offsetY + 20);

    },

}