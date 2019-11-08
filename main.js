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
    assetsMng.loadImage("chao_inicial", "assets/imgs/chao1.png");
    assetsMng.loadImage("chao_final", "assets/imgs/chao2.png");
    assetsMng.loadImage("background", "assets/imgs/background.png");
    assetsMng.loadImage("pack", "assets/imgs/all_imgs.png");
    //audios
    assetsMng.loadAudio("pickSound", "assets/sounds/pick.mp3");
    assetsMng.loadAudio("hitSound", "assets/sounds/death-sound-effect.mp3");
    assetsMng.loadAudio("checkSound", "assets/sounds/checkpointSound.mp3");
    var mainOST = new Audio('assets/sounds/OST-small.mp3');
    var playPromise;

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
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 3, 3, 3, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 3, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 3, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 1, 0, 0, 3, 0, 1, 0, 3, 0, 3, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1],
            [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 3, 0, 3, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 3, 0, 1],
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
    serras.push(new NPC({ x: cellSize * 18, y: 5 * cellSize, direcao: 'x', assets: assetsMng, mapa: mapa, ctx: ctx }));
    serras.push(new NPC({ x: cellSize * 18, y: 3 * cellSize, direcao: 'x', assets: assetsMng, mapa: mapa, ctx: ctx }));
    serras.push(new NPC({ x: cellSize * 18, y: 7 * cellSize, direcao: 'x', vx: 3.5, assets: assetsMng, mapa: mapa, ctx: ctx }));
    serras.push(new NPC({ x: cellSize * 13, y: 1 * cellSize, direcao: 'y', vy: 2, assets: assetsMng, mapa: mapa, ctx: ctx }));
    serras.push(new NPC({ x: cellSize * 23, y: 3 * cellSize, direcao: 'y', vy: 1.2, assets: assetsMng, mapa: mapa, ctx: ctx }));
    serras.push(new NPC({ x: cellSize * 23, y: 6 * cellSize, direcao: 'x', vx: 2, assets: assetsMng, mapa: mapa, ctx: ctx }));
    serras.push(new NPC({ x: cellSize * 28, y: 6 * cellSize, direcao: 'y', vy: 2.8, assets: assetsMng, mapa: mapa, ctx: ctx }));
    serras.push(new NPC({ x: cellSize * 25, y: 10 * cellSize, direcao: 'y', vy: 3.5, assets: assetsMng, mapa: mapa, ctx: ctx }));
    
    serras.push(new NPC({ x: cellSize * 1, y: 19 * cellSize, direcao: 'y', vy: 2.5, assets: assetsMng, mapa: mapa, ctx: ctx }));
    serras.push(new NPC({ x: cellSize * 2, y: 6 * cellSize, direcao: 'x', assets: assetsMng, mapa: mapa, ctx: ctx }));
    serras.push(new NPC({ x: cellSize * 1, y: 4 * cellSize, direcao: 'x', vx: 1.2, assets: assetsMng, mapa: mapa, ctx: ctx }));
    serras.push(new NPC({ x: cellSize * 8, y: 5 * cellSize, direcao: 'y', vy: 1, assets: assetsMng, mapa: mapa, ctx: ctx }));
    serras.push(new NPC({ x: cellSize * 1, y: 9 * cellSize, direcao: 'x', vx: 2, assets: assetsMng, mapa: mapa, ctx: ctx }));
    serras.push(new NPC({ x: cellSize * 11, y: 5 * cellSize, direcao: 'y', vy: 2, assets: assetsMng, mapa: mapa, ctx: ctx }));
    serras.push(new NPC({ x: cellSize * 11, y: 3 * cellSize, direcao: 'x', vx: 2, assets: assetsMng, mapa: mapa, ctx: ctx }));

    var serrasCirulares = [];
    serrasCirulares.push(new NPC({ x: cellSize * 25, y: 1 * cellSize, vx: 3.8, vy: 3.8, assets: assetsMng, mapa: mapa, ctx: ctx }));
    serrasCirulares.push(new NPC({ x: cellSize * 9, y: 15 * cellSize, vx: 3.3, vy: 3.3, assets: assetsMng, mapa: mapa, ctx: ctx }));
    serrasCirulares.push(new NPC({ x: cellSize * 9, y: 7 * cellSize, vx: 0.6, vy: 3.8, assets: assetsMng, mapa: mapa, ctx: ctx }));
    serrasCirulares.push(new NPC({ x: cellSize * 5, y: 11 * cellSize, vx: 3.4, vy: 3.4, assets: assetsMng, mapa: mapa, ctx: ctx }));

    var checkPoints = [];
    checkPoints.push(new NPC_estatico({ x: cellSize * 20, y: 11 * cellSize, w: 28, h: 32, assets: assetsMng, mapa: mapa, ctx: ctx }));
    checkPoints.push(new NPC_estatico({ x: cellSize * 8, y: 19 * cellSize, w: 28, h: 32, assets: assetsMng, mapa: mapa, ctx: ctx }));
    checkPoints.push(new NPC_estatico({ x: cellSize * 21, y: 5 * cellSize, w: 28, h: 32, assets: assetsMng, mapa: mapa, ctx: ctx }));
    var coracoes = [];

    var explosao = new NPC_estatico({ x: cellSize * 21, y: 5 * cellSize, assets: assetsMng, mapa: mapa, ctx: ctx });

    var dt = 0;     var anterior = 0;
    var alive;      var hit = false;
    var vidas;      var pontos;
    var recorde = 0;
    var jogando = false;
    const totalPontos = mapa.totalPts;
    //Posição do respawn do pc
    var posicao_x = 1 * cellSize;
    var posicao_y = 1 * cellSize;

    //MAIN ================================================================================================
    restart();  //Inicializa variaveis
    requestAnimationFrame(loop);
    document.querySelector('canvas').addEventListener("click", function _listener() {
        document.querySelector('canvas').removeEventListener("click", _listener, true);
        jogando = true;
        playOST(mainOST);
    }, true);

    //FUNÇÕES PRINCIPAIS ==================================================================================
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
                pontos = pc.caminhos.length;
                //Se chegou ao fim do jogo
                if (pontos == totalPontos) {
                    window.setTimeout(function () { venceu(); }, 400);
                }
                else {
                    update(dt);
                    render(dt);
                }
            }
            else { //Se for acertado chama respawn
                assetsMng.playSoundEffect("hitSound", 0.1, false);
                hit = true;
                explosao.x = pc.x;
                explosao.y = pc.y;
                window.setTimeout(function () {
                    hit = false;
                    vidas--;
                }, 1300);//Tempo para animação da morte.
                respawn();
            }
            desenhaHUD();
        }
        //desenha FPS
        ctx.fillStyle = "white";
        ctx.font = "18px verdana";
        ctx.fillText(Math.floor(1 / dt), cnv.width - 28, 20);
        requestAnimationFrame(loop);
    }

    function update() {
        if (!hit) { //Somente mover quando terminar a animação de morte.
            pc.mover(teclas);//move Sprite
        }

        //Chama função para decidir qual quarto do mapa vai verificar a colisão com base na posição atual do pc
        colisãoComParedes();

        for (const i in mapa.spikes) { //colisão da spikes estatica
            if (mapa.spikes[i].SpikeColidiuCom(pc)) {
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
                assetsMng.playSoundEffect("pickSound", 1, false);
                coracoes.splice(i, 1);
                if (vidas < 3)
                    vidas++;
                break;
            }
        }
        for (const i in checkPoints) {  //Colisão com checkpoint
            if (checkPoints[i].colidiuCom(pc)) {
                if (!checkPoints[i].ativo) { assetsMng.playSoundEffect("checkSound", 0.3, false); }
                checkPoints[i].ativo = true;
                posicao_y = checkPoints[i].y;
                posicao_x = checkPoints[i].x;
            }
        }
    }

    function render() {
        ctx.clearRect(0, 0, cnv.width, cnv.height);
        mapa.render();
        //Checkpoint inicial
        ctx.drawImage(
            assetsMng.img("pack"),
            0,
            0,
            55,
            51,
            cellSize - 9,//-9 para centralizar
            cellSize,
            48,
            32,
        );

        for (const i in checkPoints) {  //Desenha checkPoints
            checkPoints[i].renderCheck(dt);
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
    }
    
    function colisãoComParedes() {
        if (pc.ml < 11) {//Se pc esta na parte decima
            if (pc.mc < 15) {
                //console.log("Em: walls00");
                for (const i in mapa.walls00) {
                    pc.colisaoMap(mapa.walls00[i]);
                }
            }
            else if (pc.mc > 15) {
                //console.log("Em: walls10");
                for (const i in mapa.walls10) {
                    pc.colisaoMap(mapa.walls10[i]);
                }
            }
            else {
                //console.log("Em: ambos decima");
                for (const i in mapa.walls10) {
                    pc.colisaoMap(mapa.walls10[i]);
                }
                for (const i in mapa.walls00) {
                    pc.colisaoMap(mapa.walls00[i]);
                }
            }
        }
        else if (pc.ml > 11) {//Se pc esta na parte debaixo
            if (pc.mc < 15) {
                //console.log("Em: walls01");
                for (const i in mapa.walls01) {
                    pc.colisaoMap(mapa.walls01[i]);
                }
            }
            else if (pc.mc > 15) {
                //console.log("Em: walls11");
                for (const i in mapa.walls11) {
                    pc.colisaoMap(mapa.walls11[i]);
                }
            }
            else {
                //console.log("Em: ambos debaixo");
                for (const i in mapa.walls01) {
                    pc.colisaoMap(mapa.walls01[i]);
                }
                for (const i in mapa.walls11) {
                    pc.colisaoMap(mapa.walls11[i]);
                }
            }
        }
        else {//Se pc esta no meio
            if (pc.mc < 15) {
                //console.log("Em: ambos esquerda");
                for (const i in mapa.walls00) {
                    pc.colisaoMap(mapa.walls00[i]);
                }
                for (const i in mapa.walls01) {
                    pc.colisaoMap(mapa.walls01[i]);
                }
            }
            else if (pc.mc > 15) {
                //console.log("Em: ambos direita");
                for (const i in mapa.walls11) {
                    pc.colisaoMap(mapa.walls11[i]);
                }
                for (const i in mapa.walls10) {
                    pc.colisaoMap(mapa.walls10[i]);
                }
            }
            else {
                //console.log("Em: TODOS!");
                for (const i in mapa.walls11) {
                    pc.colisaoMap(mapa.walls11[i]);
                }
                for (const i in mapa.walls10) {
                    pc.colisaoMap(mapa.walls10[i]);
                }
                for (const i in mapa.walls00) {
                    pc.colisaoMap(mapa.walls00[i]);
                }
                for (const i in mapa.walls01) {
                    pc.colisaoMap(mapa.walls01[i]);
                }
            }
        }
    }

    //OUTRAS FUNÇÕES ================================================
    function desenha_menu_inicial() {
        ctx.drawImage(assetsMng.img("background"), 0, 0, cnv.width, cnv.height);
        ctx.font = "30px arial"; ctx.fillStyle = "white";
        ctx.fillText("CLIQUE PARA COMEÇAR", cnv.width / 2 - 170, 680);

        ctx.lineWidth = 2;
        ctx.strokeStyle = "white"; ctx.fillStyle = 'blue';
        ctx.fillRect((cnv.width / 2) - 90, (cnv.height / 2) + 230, 180, 40);
        ctx.strokeRect((cnv.width / 2) - 90, (cnv.height / 2) + 230, 180, 40);
        ctx.fillStyle = "white";
        ctx.font = "40px arial  ";
        ctx.fillText("PLAY", (cnv.width / 2) - 50, (cnv.height / 2) + 265);
    }

    function respawn() {
        alive = true;
        pc.x = posicao_x + 6;
        pc.y = posicao_y;
    }

    function restart() { //Volta todas variaveis (necessarias) para o estado inicial do jogo.
        vidas = 3;
        pontos = 0;
        for (const i in pc.caminhos) {//Apaga partes pintadas do mapa
            mapa.clearMap(pc.caminhos[i]);
        }
        pc.caminhos.length = 0;

        for (const i in checkPoints) {
            checkPoints[i].ativo = false;
        }
        coracoes.length = 0;
        coracoes.push(new NPC_estatico({ x: cellSize * 11, y: 20 * cellSize, assets: assetsMng, mapa: mapa, ctx: ctx }));
        coracoes.push(new NPC_estatico({ x: cellSize * 13, y: 6 * cellSize, assets: assetsMng, mapa: mapa, ctx: ctx }));
        coracoes.push(new NPC_estatico({ x: cellSize * 2, y: 11 * cellSize, assets: assetsMng, mapa: mapa, ctx: ctx }));
        //Volta a posição do respawn pro inicio do mapa, e chama o respawn
        posicao_x = 1 * cellSize;
        posicao_y = 1 * cellSize;
        respawn();
    }

    function gameOver() {
        pauseOST(mainOST);
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = "black";
        ctx.fillRect(32, 32, cnv.width - 64, cnv.height - 64);

        ctx.globalAlpha = 1.0;
        ctx.fillStyle = "darkred";
        ctx.font = "100px bold sans-serif";
        ctx.fillText("GAME OVER", cnv.width / 2 - 300, cnv.height / 2 - 30);

        ctx.font = "30px Verdana";
        ctx.fillStyle = "white";
        if (pontos > recorde) { recorde = pontos; }
        ctx.fillText("RECORDE: " + recorde + " pontos", (cnv.width / 2) - 140, (cnv.height / 2) + 250);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white"; ctx.fillStyle = 'red';
        ctx.fillRect((cnv.width / 2) - 90, (cnv.height / 2) + 80, 180, 40);
        ctx.strokeRect((cnv.width / 2) - 90, (cnv.height / 2) + 80, 180, 40);
        ctx.fillStyle = "white";
        ctx.font = "40px arial  ";
        ctx.fillText("PLAY", (cnv.width / 2) - 50, (cnv.height / 2) + 115);
        document.querySelector('canvas').addEventListener("click", function _listener() {
            document.querySelector('canvas').removeEventListener("click", _listener, true);
            playOST(mainOST);
            restart();
        }, true);
    }
    //Se juntou todos os pontos
    function venceu() {
        pauseOST(mainOST);
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = "black";
        ctx.fillRect(32, 32, cnv.width - 64, cnv.height - 64);
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = "white";
        ctx.font = "100px bold sans-serif";
        ctx.fillText("VOCÊ VENCEU!", cnv.width / 2 - 360, cnv.height / 2 - 30);

        ctx.font = "30px Verdana";
        ctx.fillStyle = "white";
        if (pontos > recorde) { recorde = pontos; }
        ctx.fillText("RECORDE: " + recorde + " pontos", (cnv.width / 2) - 160, (cnv.height / 2) + 250);

        ctx.font = "50px bold roboto"; ctx.lineWidth = 2;
        ctx.strokeStyle = "white"; ctx.fillStyle = 'blue';
        ctx.fillRect((cnv.width / 2) - 110, (cnv.height / 2) + 50, 200, 50);
        ctx.strokeRect((cnv.width / 2) - 110, (cnv.height / 2) + 50, 200, 50);
        ctx.fillStyle = "white";
        ctx.fillText("PLAY", (cnv.width / 2) - 70, (cnv.height / 2) + 90);

        document.querySelector('canvas').addEventListener("click", function _listener() {
            document.querySelector('canvas').removeEventListener("click", _listener, true);
            playOST(mainOST);
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
        ctx.fillText("PONTOS: " + pontos, 75, 17);

        var heart_Y;
        switch (vidas) {
            case 0:
                heart_Y = 0;
                break;
            case 1:
                heart_Y = 17;
                break;
            case 2:
                heart_Y = 34;
                break;
            default:
                heart_Y = 51;
                break;
        }
        ctx.drawImage(assetsMng.img("pack"),
            110,    heart_Y,
            54,     17,
            5,      4,
            54,     17,
        );
    }
    function playOST(ost) {
        playPromise = ost.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                ost.play();
                ost.volume = 0.1;
                ost.loop = true;
            });
        }
    }

    function pauseOST(ost) {
        ost.pause();
        ost.load();
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