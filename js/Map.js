function Map(modelo) {
    exemplo = {
        cells: [],
        LINES: 32,
        COLUMNS: 32,
        SIZE: 32,
        assets: undefined,
        scene: undefined,
        ctx: null,
        walls: [],
        serrasEstaticas: [],
        
        frame: 0,
        totalPts:0,
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
                if (modelo.m[l][c] == 1) {
                    var parede = {
                        x: c * this.SIZE, y: l * this.SIZE,
                        w: this.SIZE, h: this.SIZE,
                    };
                    this.walls.push(parede);
                }
                else if(modelo.m[l][c]==0){
                    this.totalPts++;
                }
                else if(modelo.m[l][c]==3){
                    this.serrasEstaticas.push(new NPC({ x: c*this.SIZE, y: l*this.SIZE, rotacao:20, assets: this.assets, mapa: this, ctx: this.ctx}));
                }
            }
        }
        console.log(this.totalPts);
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
                    this.ctx.drawImage(this.assets.img('parede'), c * this.SIZE, l * this.SIZE, this.SIZE, this.SIZE)
                    break;
                case 2:
                    //Chao final
                    this.ctx.drawImage(this.assets.img('chao_final'), c * this.SIZE, l * this.SIZE, this.SIZE, this.SIZE);
                    break;
                case 3:
                    //Chao atras de serras estaticas
                    this.ctx.drawImage(this.assets.img('chao_inicial'), c * this.SIZE, l * this.SIZE, this.SIZE, this.SIZE);
                    this.ctx.globalAlpha = 0.4; 
                    this.ctx.drawImage(this.assets.img('parede'), c * this.SIZE, l * this.SIZE, this.SIZE, this.SIZE);
                    this.ctx.globalAlpha = 1; 
                    break;
                default:
                    break;
            }
            
        }
    }
}

Map.prototype.clearMap = function () {
    for (var c = 0; c < this.COLUMNS; c++) {
        for (var l = 0; l < this.LINES; l++) {
            //Obstaculos   
            if (this.cells[c][l].tipo == 1) {
                this.ctx.drawImage(this.assets.img('parede'), c * this.SIZE, l * this.SIZE, this.SIZE, this.SIZE)
            }
            //chao_inicial
            else if (this.cells[c][l].tipo == 0 || this.cells[c][l].tipo == 2) {
                this.cells[c][l].tipo = 0;
                this.ctx.drawImage(this.assets.img('chao_inicial'), c * this.SIZE, l * this.SIZE, this.SIZE, this.SIZE);
            }
        }
    }
}