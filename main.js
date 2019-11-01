(function () {
    const cnv = document.querySelector("canvas");
    cnv.width = 960;
    cnv.height = 704;
    const ctx = cnv.getContext("2d");
    var teclas = {
        esquerda: false, cima: false,
        direita: false, baixo: false,
    };

    var assetsMng = new AssetsManager();
    assetsMng.loadImage("player", "assets/imgs/full.png");
    assetsMng.loadImage("chao_inicial", "assets/imgs/chao_inicial.png");
    assetsMng.loadImage("chao_final", "assets/imgs/chao_final.png");
    assetsMng.loadImage("parede", "assets/imgs/stone_walls.png");
    assetsMng.loadImage("serra", "assets/imgs/serra.png");
    assetsMng.loadImage("heart", "assets/imgs/Heart.png");
    assetsMng.loadImage("cp_ativo", "assets/imgs/check-ativo.png");
    assetsMng.loadImage("cp_desligado", "assets/imgs/check-desligado.png");
    assetsMng.loadImage("death", "assets/imgs/fullexp.png");
    assetsMng.loadImage("back", "assets/imgs/background.png");
    assetsMng.loadImage("titulo", "assets/imgs/titulo.png");
    //HUD
    assetsMng.loadImage("vida3", "assets/imgs/HUD/3.png");
    assetsMng.loadImage("vida2", "assets/imgs/HUD/2.png");
    assetsMng.loadImage("vida1", "assets/imgs/HUD/1.png");
    assetsMng.loadImage("vida0", "assets/imgs/HUD/0.png");
    //audios
    //assetsMng.loadAudio("OST", "assets/sounds/OST.mp3");
    assetsMng.loadAudio("pickSound", "assets/sounds/pick.mp3");
    assetsMng.loadAudio("hitSound", "assets/sounds/death-sound-effect.mp3");

    var ost = new Audio('assets/sounds/OST.mp3');
    


    var cellSize = 32;
    var mapa = new Map({
        COLUMNS: 30,
        LINES: 22,
        SIZE: cellSize,
        assets: assetsMng,
        ctx: ctx,
        m: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 3, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 1, 0, 0, 3, 0, 1, 0, 3, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1],
            [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 3, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 3, 0, 1],
            [1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1],
            [1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 3, 0, 1],
            [1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 3, 3, 3, 3, 0, 1, 0, 1, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 3, 0, 0, 0, 0, 0, 1, 0, 0, 3, 0, 1],
            [1, 0, 3, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 3, 0, 3, 3, 3, 3, 1, 0, 1, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 3, 0, 0, 0, 0, 0, 1, 0, 0, 3, 0, 1],
            [1, 3, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 3, 3, 3, 3, 3, 0, 1, 0, 0, 1, 0, 1],
            [1, 3, 1, 1, 1, 0, 0, 0, 1, 0, 3, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 3, 1, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ]
    });

    var pc = new Sprite({ x: 32 + 8, y: 32, assets: assetsMng, mapa: mapa, ctx: ctx });

    var serras = [];
    serras.push(new NPC({ x: cellSize * 1, y: 19 * cellSize, direcao: 'y', vy: 2, assets: assetsMng, mapa: mapa, ctx: ctx }));
    serras.push(new NPC({ x: cellSize * 18, y: 5 * cellSize, direcao: 'x', assets: assetsMng, mapa: mapa, ctx: ctx }));
    serras.push(new NPC({ x: cellSize * 18, y: 3 * cellSize, direcao: 'x', assets: assetsMng, mapa: mapa, ctx: ctx }));
    serras.push(new NPC({ x: cellSize * 18, y: 7 * cellSize, direcao: 'x', vx: 3.5, assets: assetsMng, mapa: mapa, ctx: ctx }));
    serras.push(new NPC({ x: cellSize * 13, y: 1 * cellSize, direcao: 'y', vy: 2, assets: assetsMng, mapa: mapa, ctx: ctx }));
    serras.push(new NPC({ x: cellSize * 2, y: 6 * cellSize, direcao: 'x', assets: assetsMng, mapa: mapa, ctx: ctx }));
    serras.push(new NPC({ x: cellSize * 1, y: 4 * cellSize, direcao: 'x', vx: 1.2, assets: assetsMng, mapa: mapa, ctx: ctx }));
    serras.push(new NPC({ x: cellSize * 8, y: 5 * cellSize, direcao: 'y', vy: 1, assets: assetsMng, mapa: mapa, ctx: ctx }));
    serras.push(new NPC({ x: cellSize * 1, y: 9 * cellSize, direcao: 'x', vx: 2, assets: assetsMng, mapa: mapa, ctx: ctx }));
    serras.push(new NPC({ x: cellSize * 11, y: 5 * cellSize, direcao: 'y', vy: 2, assets: assetsMng, mapa: mapa, ctx: ctx }));
    serras.push(new NPC({ x: cellSize * 11, y: 3 * cellSize, direcao: 'x', vx: 2, assets: assetsMng, mapa: mapa, ctx: ctx }));
    serras.push(new NPC({ x: cellSize * 23, y: 3 * cellSize, direcao: 'y', vy: 1.2, assets: assetsMng, mapa: mapa, ctx: ctx }));
    serras.push(new NPC({ x: cellSize * 23, y: 6 * cellSize, direcao: 'x', vx: 2, assets: assetsMng, mapa: mapa, ctx: ctx }));
    serras.push(new NPC({ x: cellSize * 28, y: 6 * cellSize, direcao: 'y', vy: 2.3, assets: assetsMng, mapa: mapa, ctx: ctx }));
    serras.push(new NPC({ x: cellSize * 25, y: 10 * cellSize, direcao: 'y', vy: 3.5, assets: assetsMng, mapa: mapa, ctx: ctx }));

    var serrasCirulares = [];
    serrasCirulares.push(new NPC({ x: cellSize * 25, y: 1 * cellSize, vx: 3.8, vy: 3.8, assets: assetsMng, mapa: mapa, ctx: ctx }));
    serrasCirulares.push(new NPC({ x: cellSize * 9, y: 15 * cellSize, vx: 3.3, vy: 3.3, assets: assetsMng, mapa: mapa, ctx: ctx }));
    serrasCirulares.push(new NPC({ x: cellSize * 9, y: 9 * cellSize, vx: 3, vy: 3, assets: assetsMng, mapa: mapa, ctx: ctx }));
    serrasCirulares.push(new NPC({ x: cellSize * 5, y: 11 * cellSize, vx: 3.4, vy: 3.4, assets: assetsMng, mapa: mapa, ctx: ctx }));

    var checkPoints = [];

    checkPoints.push(new NPC_estatico({ x: cellSize * 20, y: 11 * cellSize, w: 28, h: 32, assets: assetsMng, mapa: mapa, ctx: ctx }));
    checkPoints.push(new NPC_estatico({ x: cellSize * 8, y: 19 * cellSize, w: 28, h: 32, assets: assetsMng, mapa: mapa, ctx: ctx }));
    checkPoints.push(new NPC_estatico({ x: cellSize * 21, y: 5 * cellSize, w: 28, h: 32, assets: assetsMng, mapa: mapa, ctx: ctx }));
    var coracoes = [];

    var explosao = new NPC_estatico({ x: cellSize * 21, y: 5 * cellSize, assets: assetsMng, mapa: mapa, ctx: ctx });

    var checkMenu1 = new NPC_estatico({ x: 50, y: 460, w: 70, h: 90, ativo: true, assets: assetsMng, mapa: mapa, ctx: ctx });
    var checkMenu2 = new NPC_estatico({ x: 840, y: 460, w: 70, h: 90, ativo: true, assets: assetsMng, mapa: mapa, ctx: ctx });
    
    var dt = 0; var anterior = 0;
    var alive; var hit = false;
    var vidas; var recorde = 0;
    var jogando = false;
    var tocandoOST=false;
    var playPromise;
    const totalPontos = mapa.totalPts;
    //Posição do respawn do pc
    var posicao_x = 1 * cellSize;
    var posicao_y = 1 * cellSize;

    //MAIN ================================================================================================
    requestAnimationFrame(loop);

    //FUNÇÕES PRINCIPAIS
    function loop(t) {
        dt = (t - anterior) / 1000;
        anterior = t;

        if (!jogando) {
            desenha_menu_inicial();
        }
        else {
            if (vidas == 0) { //Se acabou as vidas
                gameOver();
            }
            else if (alive) { //Se esta vivo, roda o jogo
                //Se chegou ao fim do jogo
                if (pc.pontos == totalPontos) {
                    venceu();
                }
                else {
                    update(dt);
                    render(dt);
                }
            }
            else { //Se for acertado chama respawn
                assetsMng.startSound("hitSound", 0.2, false);
                hit = true;
                explosao.x = pc.x;
                explosao.y = pc.y;
                window.setTimeout(function () { hit = false; vidas--; }, 1300);    //Tempo para animação da morte.
                respawn();
            }
        }
        requestAnimationFrame(loop);
    }

    function update() {
        if (!hit) { //Para somente mover quando terminar a animação de morte.
            pc.mover(teclas);//move Sprite
        }
        for (const i in mapa.walls) { //Colisão do pc com mapa
            var parede = mapa.walls[i];
            pc.colisaoMap(parede);
            parede = null;
        }

        for (const i in mapa.serrasEstaticas) { //colisão da serra estatica
            if (mapa.serrasEstaticas[i].colidiuCom(pc)) {
                alive = false;
            }
        }
        for (const i in serras) { //Movimento e colisão da serra
            serras[i].mover();
            if (serras[i].colidiuCom(pc)) {
                alive = false;
            }
        }
        for (const i in serrasCirulares) {  //Movimento e colisão da serra circular
            serrasCirulares[i].moverCircular();
            if (serrasCirulares[i].colidiuCom(pc)) {
                alive = false;
            }
        }
        for (const i in coracoes) { //Colisão com corações
            if (coracoes[i].colidiuCom(pc)) {
                assetsMng.startSound("pickSound", 1, false);
                coracoes.splice(i, 1);
                if (vidas < 3)
                    vidas++;
            }
        }
        for (const i in checkPoints) {  //Colisão com checkpoint
            if (checkPoints[i].colidiuCom(pc)) {
                checkPoints[i].ativo = true;
                posicao_y = checkPoints[i].y;
                posicao_x = checkPoints[i].x;
            }
        }
    }

    function render() {
        ctx.clearRect(0, 0, cnv.width, cnv.height);
        mapa.render();

        for (const i in checkPoints) {  //Desenha checkPoints
            checkPoints[i].renderCheck(dt);
        }
        for (const i in mapa.serrasEstaticas) { //Desenha serras estaticas
            mapa.serrasEstaticas[i].render(dt);
        }
        for (const i in coracoes) { //Desenha corações
            coracoes[i].renderHeart(dt);
        }
        for (const i in serras) { //Desenha serras
            serras[i].render(dt);
        }
        for (const i in serrasCirulares) { //Desenha serras circulares
            serrasCirulares[i].render(dt);
        }
        if (hit) { //Se for acertado desenha explosao
            explosao.renderDeath(dt);
        }
        else { //Se não desenha o sprite normalmente
            pc.render(dt);
        }
        desenhaHUD();
    }

    //OUTRAS FUNÇÕES
    function respawn() {
        alive = true;
        pc.x = posicao_x + 6;
        pc.y = posicao_y;
    }

    function restart() { //Volta todas variaveis (necessarias) para o estado inicial do jogo.
        //assetsMng.inicia("OST");
        alive = true;
        vidas = 3;
        //Se andou no mapa
        if (pc.pontos > 1)
            mapa.clearMap();  //Apaga partes pintadas de verde

        pc.x = cellSize + 6;
        pc.y = cellSize;
        //posição do respawn
        posicao_x = 1 * cellSize;
        posicao_y = 1 * cellSize;
        pc.pontos = 0;
        for (const i in checkPoints) {
            checkPoints[i].ativo = false;
        }
        coracoes.push(new NPC_estatico({ x: cellSize * 11, y: 20 * cellSize, assets: assetsMng, mapa: mapa, ctx: ctx }));
        coracoes.push(new NPC_estatico({ x: cellSize * 13, y: 6 * cellSize, assets: assetsMng, mapa: mapa, ctx: ctx }));
        coracoes.push(new NPC_estatico({ x: cellSize * 2, y: 11 * cellSize, assets: assetsMng, mapa: mapa, ctx: ctx }));
    }


    function gameOver() {
        //assetsMng.para("OST");
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = "black";
        ctx.fillRect(32, 32, cnv.width - 64, cnv.height - 64);

        ctx.globalAlpha = 1.0;
        ctx.fillStyle = "darkred";
        ctx.font = "100px bold sans-serif";
        ctx.fillText("GAME OVER", cnv.width / 2 - 300, cnv.height / 2 - 30);

        ctx.font = "30px Verdana";
        ctx.fillStyle = "white";
        if (pc.pontos > recorde) {
            recorde = pc.pontos;
            ctx.fillText("NOVO RECORDE: " + recorde + " pontos", (cnv.width / 2) - 210, (cnv.height / 2) + 250);
        }
        else {
            ctx.fillText("RECORDE: " + recorde + " pontos", (cnv.width / 2) - 140, (cnv.height / 2) + 250);
        }

        ctx.lineWidth = 2;
        ctx.strokeStyle = "white"; ctx.fillStyle = 'red';
        ctx.fillRect((cnv.width / 2) - 90, (cnv.height / 2) + 80, 180, 40);
        ctx.strokeRect((cnv.width / 2) - 90, (cnv.height / 2) + 80, 180, 40);
        ctx.fillStyle = "white";
        ctx.font = "40px arial  ";
        ctx.fillText("PLAY", (cnv.width / 2) - 50, (cnv.height / 2) + 115);
        desenhaHUD();
        document.querySelector('canvas').addEventListener("click", function _listener() {
            document.querySelector('canvas').removeEventListener("click", _listener, true);
            restart();
        }, true);
    }
    //DESENHA MENU INICIAL

    function desenha_menu_inicial() {
        if(tocandoOST){
            playPromise = ost.play();
        
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                ost.play();
                tocandoOST=true;
            });
        }
        }
        restart();
        ctx.drawImage(assetsMng.img("back"), 0, 0, cnv.width, cnv.height);
        ctx.drawImage(assetsMng.img('titulo'), (cnv.width / 2) - 175, 50, 350, 100);
        ctx.font = "30px arial"; ctx.fillStyle = "white";
        ctx.fillText("CLIQUE PARA COMEÇAR", cnv.width / 2 - 170, 680);

        ctx.lineWidth = 2;
        ctx.strokeStyle = "white"; ctx.fillStyle = 'blue';
        ctx.fillRect((cnv.width / 2) - 90, (cnv.height / 2) + 230, 180, 40);
        ctx.strokeRect((cnv.width / 2) - 90, (cnv.height / 2) + 230, 180, 40);
        ctx.fillStyle = "white";
        ctx.font = "40px arial  ";
        ctx.fillText("PLAY", (cnv.width / 2) - 50, (cnv.height / 2) + 265);
        checkMenu1.renderCheck(dt);
        checkMenu2.renderCheck(dt);
        document.querySelector('canvas').addEventListener("click", function _listener() {
            document.querySelector('canvas').removeEventListener("click", _listener, true);
            jogando = true;
        }, true);
    }
    //Se juntou todos os pontos
    function venceu() {
        //assetsMng.para("OST");
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, cnv.width, cnv.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, cnv.height / 2 - 140, cnv.width, 150);
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = "white";
        ctx.font = "100px bold sans-serif";
        ctx.fillText("VOCÊ VENCEU!", cnv.width / 2 - 360, cnv.height / 2 - 30);

        ctx.font = "30px Verdana";
        ctx.fillStyle = "white";
        if (pc.pontos > recorde) {
            recorde = pc.pontos;
            ctx.fillText("NOVO RECORDE: " + recorde + " pontos", (cnv.width / 2) - 210, (cnv.height / 2) + 250);
        }
        else {
            ctx.fillText("RECORDE: " + recorde + " pontos", (cnv.width / 2) - 160, (cnv.height / 2) + 250);
        }

        ctx.font = "50px bold roboto"; ctx.lineWidth = 2;
        ctx.strokeStyle = "white"; ctx.fillStyle = 'blue';
        ctx.fillRect((cnv.width / 2) - 110, (cnv.height / 2) + 50, 200, 50);
        ctx.strokeRect((cnv.width / 2) - 110, (cnv.height / 2) + 50, 200, 50);
        ctx.fillStyle = "white";
        ctx.fillText("PLAY", (cnv.width / 2) - 70, (cnv.height / 2) + 90);
        desenhaHUD();

        document.querySelector('canvas').addEventListener("click", function _listener() {
            document.querySelector('canvas').removeEventListener("click", _listener, true);
            restart();
        }, true);

    }
    //Desenha HUD
    function desenhaHUD() {
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = "black";
        ctx.fillRect(-5, -5, 175, 30);

        ctx.globalAlpha = 0.7;
        ctx.fillStyle = 'rgb(195, 195, 195)';
        ctx.strokeRect(-5, -5, 70, 30);
        ctx.strokeRect(65, -5, 105, 30);

        ctx.globalAlpha = 1;
        ctx.fillStyle = "white";
        ctx.font = "15px bold monospaced";
        ctx.fillText("PONTOS: " + pc.pontos, 75, 17);

        var heart = "vida" + vidas; //Soma string "vida" com o valor da variavel para ter o nome de cada imagem
        ctx.drawImage(assetsMng.img(heart), 5, 4, 54, 17);
    }

    //CONTROLES
    window.addEventListener("keydown", function (e) {
        switch (e.keyCode) {
            case 37:
                teclas.esquerda = true;
                break;
            case 38:
                teclas.cima = true;
                break;
            case 39:
                teclas.direita = true;
                break;
            case 40:
                teclas.baixo = true;
                break;
        }
    });
    window.addEventListener("keyup", function (e) {
        switch (e.keyCode) {
            case 37:
                teclas.esquerda = false;
                break;
            case 38:
                teclas.cima = false;
                break;
            case 39:
                teclas.direita = false;
                break;
            case 40:
                teclas.baixo = false;
                break;
        }
    });
}());