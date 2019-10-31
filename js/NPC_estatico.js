function NPC_estatico(params = {}) {
    var exemplo = {
        x: 0, y: 0,
        h: 32, w: 32,
        vx: 3, vy: 3,
        mc: 0, my: 0,
        assets: null,
        mapa: undefined,
        frame: 0,
        ativo: false,
    }
    Object.assign(this, exemplo, params);
}
NPC_estatico.prototype = new NPC_estatico();
NPC_estatico.prototype.constructor = NPC_estatico;

NPC_estatico.prototype.render = function (ctx, dt) {
    this.mc = Math.floor((this.x + (this.w / 2)) / this.mapa.SIZE);
    this.ml = Math.floor((this.y + (this.h / 2)) / this.mapa.SIZE);
    this.frame += 12 * dt;
    ctx.save();

    if(this.ativo){
        ctx.drawImage(
            this.assets.img("cp_ativo"),
            0,
            0,
            34,
            51,
            this.x+1.5,
            this.y,
            28,
            32,
        );
    }
    else{
        ctx.drawImage(
            this.assets.img("cp_desligado"),
            0,
            0,
            34,
            51,
            this.x+1.5,//para centralizar
            this.y,
            28,
            32,
        );
    }
}

NPC_estatico.prototype.render2 = function (ctx, dt) {
    this.frame += 10 * dt;
    var F = Math.floor(this.frame);
    ctx.save();
    ctx.drawImage(
        this.assets.img("death"),
        (F%5)*20,
        0,
        20,
        23,
        this.x,
        this.y,
        20,
        23,
    );
}

NPC_estatico.prototype.colidiuCom = function (alvo) {
    // + e - numeros para dar uma margem a mais para colisão
    if (alvo.x + alvo.w - 5 < this.x) return false;
    if (alvo.x + 5 > this.x + this.w) return false;
    if (alvo.y + alvo.h-2 < this.y) return false;
    if (alvo.y + 8 > this.y + this.h) return false;

    return true;
}

