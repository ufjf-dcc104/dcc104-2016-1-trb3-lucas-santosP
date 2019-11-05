function Map(modelo) {
    exemplo = {
        cells: [],
        LINES: 32,
        COLUMNS: 32,
        SIZE: 32,
        assets: undefined,
        scene: undefined,
        ctx: null,
        //Vetor de paredes dividos em 4 partes
        walls00: [],
        walls10: [],
        walls01: [],
        walls11: [],
        spikes: [],

        frame: 0,
        totalPts: 0,
    }
    Object.assign(this, exemplo, modelo);

    for (var c = 0; c < this.COLUMNS; c++) {
        this.cells[c] = [];
        for (var l = 0; l < this.LINES; l++) {
            exemplo.cells[c][l] = { tipo: 0 };
        }
    }
    if (modelo.m) {
        for (var c = 0; c < this.COLUMNS; c++) {
            for (var l = 0; l < this.LINES; l++) {
                this.cells[c][l] = { tipo: modelo.m[l][c] };

                switch (modelo.m[l][c]) {
                    case 0:
                        this.totalPts++;
                        break;
                    case 1:
                        var parede = {
                            x: c * this.SIZE, y: l * this.SIZE,
                            w: this.SIZE, h: this.SIZE,
                        };
                        if (c < 15 && l < 11) {
                            this.walls00.push(parede);
                        }
                        else if (c >= 15 && l < 11) {
                            this.walls10.push(parede);
                        }
                        else if (c < 15 && l >= 11) {
                            this.walls01.push(parede);
                        }
                        else {
                            this.walls11.push(parede);
                        }
                        break;
                    case 3:
                        this.spikes.push(new NPC({ x: c * this.SIZE, y: l * this.SIZE, rotacao: 20, assets: this.assets, mapa: this, ctx: this.ctx }));
                        break;
                    default:
                        break;
                }
            }
        }
    }
}

Map.prototype.render = function () {
    for (var c = 0; c < this.COLUMNS; c++) {
        for (var l = 0; l < this.LINES; l++) {

            switch (this.cells[c][l].tipo) {
                case 0:
                    //chao inicial
                    this.ctx.drawImage(this.assets.img('chao_inicial'), c * this.SIZE, l * this.SIZE, this.SIZE, this.SIZE);
                    break;
                case 1:
                    //Paredes
                    this.ctx.drawImage(this.assets.img("pack"),
                        0, 82,
                        48, 47,
                        c * this.SIZE,
                        l * this.SIZE,
                        this.SIZE, this.SIZE,
                    );
                    break;
                case 2:
                    //Chao final
                    this.ctx.drawImage(this.assets.img('chao_final'), c * this.SIZE, l * this.SIZE, this.SIZE, this.SIZE);
                    break;
                case 3:
                    //Espinhos
                    this.ctx.drawImage(this.assets.img('chao_final'), c * this.SIZE, l * this.SIZE, this.SIZE, this.SIZE);
                    this.ctx.drawImage(this.assets.img("pack"),
                        48, 82,
                        50, 50,
                        c * this.SIZE, l * this.SIZE,
                        this.SIZE, this.SIZE,
                    );
                    break;
                default:
                    break;
            }
        }
    }
}
Map.prototype.clearMap = function (caminho) {
    this.cells[caminho.c][caminho.l].tipo = 0;
}