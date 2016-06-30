$(document).ready(function(){
	//Canvas
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();

	//Salvando o largura do quadrado
	var cw = 10;
	var d;
	var food;
	var score;
  var mySound;
	var mySound2;
	var mySound3;
	var mySound4;

	//Criando a cobra
	var snake_array; //Vetor de quadrados para criação da cobra

	function init()
	{
		d = "right"; //Direção padrão
		create_snake();
		create_food(); //Criação da comida
		//Mostra a pontuação
		score = 0;

		//Sound creation
		mySound = new sound("sound1d.mp3");
		mySound2 = new sound("sound2d.mp3");
		mySound3 = new sound("sound3.mp3");
		mySound4 = new sound("sound4d.mp3");

		//Movendo a cobra usando um timer e pintando que vai ativando a função para pintar enquanto anda
		//A cada 60ms
		if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 60);
	}
	init();

	function create_snake()
	{
		var length = 5; //Tamanho da cabra
		snake_array = []; //Vetor vazio da cobra
		for(var i = length-1; i>=0; i--)
		{
			//Criando uma cobra no topo se movendo para a direita
			snake_array.push({x: i, y:0});
		}
	}

	//Criando a comida
	function create_food()
	{
		food = {
			x: Math.round(Math.random()*(w-cw)/cw),
			y: Math.round(Math.random()*(h-cw)/cw),
		};
	
	}

	//Pintando a cobra
	function paint()
	{
		//Para evitar uma cobra contínua, pintamos o background para cobrir o seu rastro
		//Pintando o canvas
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, w, h);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, w, h);

		//Movemento da cobra
		//Tira o último quadrado e coloca na frente da cobra
		var nx = snake_array[0].x;
		var ny = snake_array[0].y;
		//Movemento baseado na direção
		if(d == "right") nx++;
		else if(d == "left") nx--;
		else if(d == "up") ny--;
		else if(d == "down") ny++;

		//Game over
		if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny, snake_array))
		{
			init();
			return;
		}

		//Comida da cobra
		//Se a posição da cabeça for igual a posição da comida, adiciona uma nova cabeça
		if(nx == food.x && ny == food.y)
		{
			var tail = {x: nx, y: ny};
			score++;

			if (score===1)
			{
				mySound4.play();
			}

			if (score===15)
			{
				mySound.play();
			}

			if (score===30)
			{
				mySound2.play();
			}

			if (score>=50)
			{
				mySound3.play();
			}
			//Cria outra comida
			create_food();
		}
		else
		{
			var tail = snake_array.pop();
			tail.x = nx; tail.y = ny;
		}

		snake_array.unshift(tail);

		for(var i = 0; i < snake_array.length; i++)
		{
			var c = snake_array[i];
			paint_cell(c.x, c.y);
		}

		//Pintando a comida no canvas
		paint_cell(food.x, food.y);
		//Pintando a pontuação no canvas
		var score_text = "Score: " + score;
		ctx.fillText(score_text, 5, h-5);
	}

	//Pintando os quadrados
	function paint_cell(x, y)
	{
		ctx.fillStyle = "black";
		ctx.fillRect(x*cw, y*cw, cw, cw);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*cw, y*cw, cw, cw);
	}

	//Checa se tem colisão
	function check_collision(x, y, array)
	{
		for(var i = 0; i < array.length; i++)
		{
			if(array[i].x == x && array[i].y == y)
			 return true;
		}
		return false;
	}

	//Função dos sons
	function sound(src)
	{
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function()
		{
        this.sound.play();
    }
    this.stop = function()
		{
        this.sound.pause();
    }
	}

	//Controle pelo teclado
	$(document).keydown(function(e){
		var key = e.which;
		//Prevenção para a cobra não "andar para trás"
		if(key == "37" && d != "right") d = "left";
		else if(key == "38" && d != "down") d = "up";
		else if(key == "39" && d != "left") d = "right";
		else if(key == "40" && d != "up") d = "down";
	})

})
