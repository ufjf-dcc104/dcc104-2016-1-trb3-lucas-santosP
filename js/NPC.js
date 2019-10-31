function NPC(params = {}) {
    var exemplo = {
        x: 0, y: 0,
        h: 32, w: 32,
        vx: 3, vy: 3,
        mc: 0, my: 0,
        assets: null,
        mapa: undefined,
        frame: 0,
        cond: true,
        rotacao: 50,
        direcao: 'direita',
    }
    Object.assign(this, exemplo, params);
}
NPC.prototype = new NPC();
NPC.prototype.constructor = NPC;

NPC.prototype.render = function (ctx, dt) {

    this.frame += this.rotacao * dt;
    var F = Math.floor(this.frame);
    ctx.drawImage(
        this.assets.img("serra"),
        (F % 3) * 124,
        0,
        124,
        122,
        this.x,
        this.y,
        this.w,
        this.h,
    );
};

NPC.prototype.render2 = function (ctx, dt) {
    this.frame += 50 * dt;
    var F = Math.floor(this.frame);
    ctx.drawImage(
        this.assets.img("heart"),
        0,
        0,
        32,
        32,
        this.x,
        this.y,
        this.w,
        this.h,
    );
}

NPC.prototype.mover = function () {
    //Posição do NPC no map
    this.mc = Math.floor((this.x + (this.w / 2)) / this.mapa.SIZE);
    this.ml = Math.floor((this.y + (this.h / 2)) / this.mapa.SIZE);

    var debaixo = Math.floor(this.y / this.mapa.SIZE);
    var decima = Math.floor((this.y + (this.h)) / this.mapa.SIZE);

    var direita = Math.floor((this.x) / this.mapa.SIZE);
    var esquerda = Math.floor((this.x + (this.w)) / this.mapa.SIZE);

    if (this.direcao == 'y') {
        //CIMA
        if (this.cond && this.mapa.cells[this.mc][decima - 1].tipo != 1) {
            this.y -= this.vy;
        }
        else {
            this.cond = false;
        }
        //BAIXO
        if (!this.cond && this.mapa.cells[this.mc][debaixo + 1].tipo != 1) {
            this.y += this.vy;
        }
        else {
            this.cond = true;
        }
    }
    else if (this.direcao == 'x') {
        //DIREITA
        if (this.cond && this.mapa.cells[direita + 1][this.ml].tipo != 1) {
            this.x += this.vx;
        }
        else {
            this.cond = false;
        }
        //ESQUERDA
        if (!this.cond && this.mapa.cells[esquerda - 1][this.ml].tipo != 1) {
            this.x -= this.vx;
        }
        else {
            this.cond = true;
        }
    }

}

NPC.prototype.colidiuCom = function (alvo) {
    // + e - numeros para dar uma margem a mais para colisão
    if (alvo.x + alvo.w - 5 < this.x) return false;
    if (alvo.x + 5 > this.x + this.w) return false;
    if (alvo.y + alvo.h - 2 < this.y) return false;
    if (alvo.y + 8 > this.y + this.h) return false;

    return true;
}

NPC.prototype.moverCircular = function () {
    //Posição do NPC no map
    this.mc = Math.floor((this.x + (this.w / 2)) / this.mapa.SIZE);
    this.ml = Math.floor((this.y + (this.h / 2)) / this.mapa.SIZE);

    var debaixo = Math.floor(this.y / this.mapa.SIZE);
    var decima = Math.floor((this.y + (this.h)) / this.mapa.SIZE);

    var direita = Math.floor((this.x + 1) / this.mapa.SIZE);
    var esquerda = Math.floor((this.x + this.w - 1) / this.mapa.SIZE);

    switch (this.direcao) {
        case 'direita':
            if (this.mapa.cells[direita + 1][this.ml].tipo != 1) {
                this.x += this.vx;
                this.direcao = 'direita';
            }
            else {
                this.direcao = 'baixo';
            }
            break;
        case 'baixo':
            if (this.mapa.cells[this.mc][debaixo + 1].tipo != 1) {
                this.y += this.vy;
                this.direcao = 'baixo';
            }
            else {
                this.direcao = 'esquerda';
            }
            break;
        case 'esquerda':
            if (this.mapa.cells[esquerda - 1][this.ml].tipo != 1) {
                this.x -= this.vx;
                this.direcao = 'esquerda';
            }
            else {
                this.direcao = 'cima';
            }
            break;
        case 'cima':
            if (this.mapa.cells[this.mc][decima - 1].tipo != 1) {
                this.y -= this.vy;
            }
            else {
                this.direcao = 'direita';
            }
            break;
        default:
            break;
    }
}

