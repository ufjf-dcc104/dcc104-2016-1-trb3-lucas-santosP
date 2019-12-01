
const cnv = document.querySelector("canvas");
cnv.width = 960;
cnv.height = 704;
const ctx = cnv.getContext("2d");
var teclas = {
	esquerda: false, cima: false,
	direita: false, baixo: false,
};
var espaco = false;
var enter = false;
var assetsMng = new AssetsManager();
assetsMng.loadImage("chao_inicial", "assets/imgs/chao1.png");
assetsMng.loadImage("chao_final", "assets/imgs/chao2.png");
assetsMng.loadImage("background", "assets/imgs/background-2.png");
assetsMng.loadImage("pack", "assets/imgs/all_imgs.png");
assetsMng.loadImage("menu-select", "assets/imgs/menu-select.png");
assetsMng.loadImage("menu-noSelect", "assets/imgs/menu-noSelect2.png");
//audios
assetsMng.loadAudio("pickSound", "assets/sounds/pick.mp3");
assetsMng.loadAudio("hitSound", "assets/sounds/death-sound-effect.mp3");
assetsMng.loadAudio("checkSound", "assets/sounds/checkpointSound.mp3");
assetsMng.loadAudio("soundTrack", "assets/sounds/OST-menor.mp3");
assetsMng.loadAudio("soundGameOver", "assets/sounds/Game-Over.mp3");
assetsMng.loadAudio("soundWin", "assets/sounds/win.mp3");

var cellSize = 32;
var mapa = new Map({
	COLUMNS: 30,
	LINES: 22,
	SIZE: cellSize,
	assets: assetsMng,
	ctx: ctx,
	m: [
		[
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			[1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, { tipo: -4, vx: 3.8, vy: 3.8 }, 0, 0, 0, 1],
			[1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1],
			[1, 0, 1, 0, 1, { tipo: 4, vx: 2, direcao: 'x' }, 0, 0, { tipo: 4, vy: 1, direcao: 'y' }, 0, 0, 0, 1, { tipo: 4, vx: 2, direcao: 'x' }, 0, 0, 0, 0, 0, 1, 1, 1, 1, { tipo: 4, vy: 1.2, direcao: 'y' }, 1, 0, 1, 1, 0, 1],
			[1, { tipo: 4, vx: 1.3, direcao: 'x' }, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 5, 0, 1, 0, 0, 0, 0, 1],
			[1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, { tipo: 4, vy: 2, direcao: 'y' }, 1, { tipo: 4, vy: 2, direcao: 'y' }, 0, 0, 0, 0, 0, { tipo: 4, vx: 2, direcao: 'x' }, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1],
			[1, { tipo: 4, vx: 3, direcao: 'x' }, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, { tipo: 4, vx: 2, direcao: 'x' }, 0, 0, 0, 0, { tipo: 4, vy: 2.8, direcao: 'y' }, 1],
			[1, 0, 1, 0, 1, 0, 0, 0, 0, { tipo: -4, vx: 0.6, vy: 3.8 }, 0, 0, 1, { tipo: 4, vx: 3.5, direcao: 'x' }, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1],
			[1, 0, 1, 0, 1, 0, 1, 0, 1, 3, 3, 3, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1],
			[1, { tipo: 4, vx: 2, direcao: 'x' }, 0, 0, 0, 0, 1, 0, 1, 0, 3, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
			[1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 3, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
			[1, 0, 6, 1, 0, { tipo: -4, vx: 3.4, vy: 3.4 }, 3, 0, 1, 0, 3, 0, 3, 0, 0, 0, 0, { tipo: 4, vy: 2, direcao: 'y' }, 1, 0, 6, { tipo: -4, vx: 3.3, vy: 3.3 }, 1, 0, 5, { tipo: 4, vy: 3.5, direcao: 'y' }, 1, 1, 0, 1],
			[1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 3, 0, 3, 0, 0, 0, 0, 0, 1, 0, 3, 0, 3, 0, 1, 0, 0, 3, 0, 1],
			[1, 0, 1, 1, 0, 0, 3, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1],
			[1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 3, 0, 1],
			[1, 0, 1, 1, 0, 0, 3, 0, 1, { tipo: -4, vx: 3.3, vy: 3.3 }, 0, 0, 0, 0, 0, 0, 1, 0, 1, 3, 3, 3, 3, 0, 3, 0, 1, 1, 0, 1],
			[1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 3, 0, 1],
			[1, 0, 3, 0, 1, 0, 3, 0, 1, 0, 1, 0, 6, 0, 1, 0, 1, 0, 3, 0, 3, 3, 3, 3, 1, 0, 1, 1, 0, 1],
			[1, { tipo: 4, vy: 2.5, direcao: 'y' }, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 3, 0, 1],
			[1, 3, 1, 1, 1, 0, 3, 0, 5, 0, 1, 0, 0, 0, 1, 0, 1, 0, 3, 3, 3, 3, 3, 0, 3, 0, 0, 1, 0, 1],
			[1, 3, 1, 1, 1, 0, 0, 0, 1, 0, 3, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 3, 1, 0, 0, 0, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		],
		[
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			[1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, { tipo: 4, vx: 2, vy: 2, direcao: 'x' }, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, { tipo: 4, vx: 2, vy: 2, direcao: 'y' }, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		]
	]
});


var pc = new Sprite({ x: 32 + 8, y: 32, assets: assetsMng, mapa: mapa, ctx: ctx });
var explosao = new NPC_estatico({ assets: assetsMng, mapa: mapa, ctx: ctx });

var dt = 0; var anterior = 0;
var alive;
var hit = false;
var vidas;
var pontos;
var totalPontos;
var jogando = false;
var pause = false;
var cooldown;
//Posição do respawn do pc
var posicao_x = 1 * cellSize;
var posicao_y = 1 * cellSize;
var game_state;
//MAIN ================================================================================================
//restart();  //Inicializa variaveis
inicializacao();
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
		//Se esta vivo
		else if (alive) {
			//Roda o jogo
			if (!pause) {
				update(dt);
			}
			render(dt);

			pontos = pc.caminhos.length;//Atualiza os pontos
			if (pontos == totalPontos) {//Se coletou todos os pontos
				venceu();
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
	for (const i in mapa.serrasLineares) { //Movimento e colisão da serra
		mapa.serrasLineares[i].mover();
		if (mapa.serrasLineares[i].colidiuCom(pc)) {
			alive = false;
		}
	}
	for (const i in mapa.serrasCirculares) {  //Movimento e colisão da serra circular
		mapa.serrasCirculares[i].moverCircular();
		if (mapa.serrasCirculares[i].colidiuCom(pc)) {
			alive = false;
		}
	}

	for (const i in mapa.coracoes) { //Colisão com corações
		if (mapa.coracoes[i].ativo) {
			if (mapa.coracoes[i].colidiuCom(pc)) {
				//mapa.coracoes.splice(i, 1);
				assetsMng.playSoundEffect("pickSound", 1, false);
				mapa.coracoes[i].ativo = false;
				if (vidas < 3)
					vidas++;
				break;
			}
		}
	}
	for (const i in mapa.checkPoints) {  //Colisão com checkpoint
		if (mapa.checkPoints[i].colidiuCom(pc)) {
			if (!mapa.checkPoints[i].ativo) {
				assetsMng.playSoundEffect("checkSound", 0.3, false);
			}
			mapa.checkPoints[i].ativo = true;
			posicao_y = mapa.checkPoints[i].y;
			posicao_x = mapa.checkPoints[i].x;
		}
	}
}

function render() {
	ctx.clearRect(0, 0, cnv.width, cnv.height);
	mapa.render();

	for (const i in mapa.checkPoints) {  //Desenha mapa.checkPoints
		mapa.checkPoints[i].renderCheck(dt);
	}
	for (const i in mapa.coracoes) { //Desenha corações
		if (mapa.coracoes[i].ativo) {
			mapa.coracoes[i].renderHeart(dt);
		}
	}
	for (const i in mapa.serrasLineares) { //Desenha serras
		mapa.serrasLineares[i].render(dt);
	}
	for (const i in mapa.serrasCirculares) { //Desenha serras circulares
		mapa.serrasCirculares[i].render(dt);
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
var selectY = 500;
var cor_play = "white", cor_tutorial = "black";
var retorno_Menu = "";

function desenha_menu_inicial() {
	restart();  //Inicializa variaveis
	ctx.drawImage(assetsMng.img("background"), 0, 0, cnv.width, cnv.height);

	var estado_menu = desenhaMenu();
	switch (estado_menu) {
		case 'play':
			console.log("play!");
			jogando = true;
			assetsMng.PlayOST("soundTrack", 0.1, true);
			break;
		case 'tutorial':
			console.log("tutorial!");
			break;
		default:
			console.log("nada!");
			break;
	}
}
function desenhaMenu() {
	ctx.font = "30px arial";
	ctx.drawImage(assetsMng.img("menu-noSelect"), (cnv.width / 2) - 155, 500, 300, 60);
	ctx.drawImage(assetsMng.img("menu-noSelect"), (cnv.width / 2) - 155, 600, 300, 60);

	if (teclas.baixo) {
		selectY = 600;
		cor_play = "black";
		cor_tutorial = "white"
		ctx.drawImage(assetsMng.img("menu-select"), (cnv.width / 2) - 155, selectY, 300, 60);
		retorno_Menu = "tutorial";
	}
	else if (teclas.cima) {
		selectY = 500;
		cor_play = "white";
		cor_tutorial = "black"
		ctx.drawImage(assetsMng.img("menu-select"), (cnv.width / 2) - 155, selectY, 300, 60);
		retorno_Menu = "play";
	}
	else {
		ctx.drawImage(assetsMng.img("menu-select"), (cnv.width / 2) - 155, selectY, 300, 60);
	}

	ctx.fillStyle = cor_play;
	ctx.fillText("PLAY", (cnv.width / 2) - 45, 540);
	ctx.fillStyle = cor_tutorial;
	ctx.fillText("TUTORIAL", (cnv.width / 2) - 85, 640);

	if (enter) {
		console.log("returning: " + retorno_Menu);
		return retorno_Menu;
	}
}

function respawn() {
	alive = true;
	pc.x = posicao_x + 6;
	pc.y = posicao_y;
}

function restart() { //Volta todas variaveis (necessarias) para o estado inicial do jogo.
	cooldown = 0.5;
	pause = false;
	vidas = 1;
	totalPontos = mapa.totalPts;
	pontos = 0;

	mapa.clearMap(pc.caminhos);//Apaga o caminho colorido pelo jogador
	pc.caminhos.length = 0;
	mapa.respawnNPCs(); //Volta as condições "ativo" do checkpoint e corações
	//Volta a posição do respawn pro inicio do mapa, e chama o respawn
	posicao_x = 1 * cellSize;
	posicao_y = 1 * cellSize;
	respawn();
}

function gameOver() {
	assetsMng.PlayOST("soundGameOver", 0.1, false);
	assetsMng.PauseOST("soundTrack");

	ctx.globalAlpha = 0.2;
	ctx.fillStyle = "black";
	ctx.fillRect(32, 32, cnv.width - 64, cnv.height - 64);

	ctx.globalAlpha = 1.0;
	ctx.fillStyle = "darkred";
	ctx.font = "100px bold sans-serif";
	ctx.fillText("GAME OVER", cnv.width / 2 - 300, cnv.height / 2 - 30);

	ctx.font = "30px bold roboto";
	ctx.lineWidth = 2;
	ctx.strokeStyle = "white"; ctx.fillStyle = 'red';
	ctx.fillRect((cnv.width / 2) - 110, (cnv.height / 2) + 60, 200, 40);
	ctx.strokeRect((cnv.width / 2) - 110, (cnv.height / 2) + 60, 200, 40);
	ctx.fillStyle = "white";
	ctx.fillText("RESTART", (cnv.width / 2) - 70, (cnv.height / 2) + 90);

	document.querySelector('canvas').addEventListener("click", function _listener() {
		document.querySelector('canvas').removeEventListener("click", _listener, true);
		assetsMng.PauseOST("soundGameOver");
		jogando = false;
	}, true);
}

//Se juntou todos os pontos
function venceu() {
	if (!pause) {
		cooldown = cooldown - 1 * dt;
		console.log(cooldown);
	}
	if (cooldown <= 0) {
		pause = true;
		assetsMng.PlayOST("soundWin", 0.1, false);
		assetsMng.PauseOST("soundTrack");

		ctx.globalAlpha = 0.6;
		ctx.fillStyle = "black";
		ctx.fillRect(32, 32, cnv.width - 64, cnv.height - 64);
		ctx.globalAlpha = 1.0;
		ctx.fillStyle = "white";
		ctx.font = "100px bold sans-serif";
		ctx.fillText("VOCÊ VENCEU!", cnv.width / 2 - 360, cnv.height / 2 - 30);
		ctx.font = "30px Verdana";
		ctx.fillStyle = "white";

		ctx.font = "30px bold roboto";
		ctx.lineWidth = 2;
		ctx.strokeStyle = "white";
		ctx.fillStyle = 'blue';
		ctx.fillRect((cnv.width / 2) - 110, (cnv.height / 2) + 60, 200, 40);
		ctx.strokeRect((cnv.width / 2) - 110, (cnv.height / 2) + 60, 200, 40);
		ctx.fillStyle = "white";
		ctx.fillText("NEXT STAGE", (cnv.width / 2) - 100, (cnv.height / 2) + 90);

		if (pontos != 0) {
			document.querySelector('canvas').addEventListener("click", function _listener() {
				document.querySelector('canvas').removeEventListener("click", _listener, true);
				assetsMng.PauseOST("soundWin");
				assetsMng.PlayOST("soundTrack", 0.1, true);
				mapa2.setFase(1);
				restart();
			}, true);
		}
	}
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
		110, heart_Y,
		54, 17,
		5, 4,
		54, 17,
	);
}
function inicializacao() {
	game_state = "menu";
	ctx.globalAlpha = 1;
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, cnv.width, cnv.height);
	ctx.font = "30px ARIAL";
	ctx.fillStyle = "white";
	ctx.lineWidth = 2;
	ctx.fillText("Click on canvas to start the game!", (cnv.width / 2) - 200, (cnv.height / 2) + 90);

	//style.backgroundColor = "black";
	document.querySelector('canvas').addEventListener("click", function _listener() {
		document.querySelector('canvas').removeEventListener("click", _listener, true);
		document.querySelector("#div_cnv").classList.add("bg-custom");
		requestAnimationFrame(loop);

	}, true);
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
		case 37:
			espaco = true;
			break;
		case 13:
			enter = true;
			break;
		default:
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
		case 37:
			espaco = false;
			break;
		case 13:
			enter = false;
			break;
		default:
			break;
	}
});
