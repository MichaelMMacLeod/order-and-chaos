startGame = function() {
	x = 1;
	y = 1;
	xDelay = 0;
	yDelay = 0;
	gameArea.start();
	highlightVert = new highlight(100, 500, "vertical", "highlightVert.png");
	highlightHori = new highlight(500, 100, "horizontal", "highlightHori.png");

}

config = {
	delay : 10
}

gameArea = {
	canvas : document.createElement('canvas'),
	start : function() {
		this.canvas.width = 500;
		this.canvas.height = 500;
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.interval = setInterval(updateGameArea, 20);
		window.addEventListener('keydown', function (e) {
			gameArea.keys = (gameArea.keys || []);
			gameArea.keys[e.keyCode] = true;
		})
		window.addEventListener('keyup', function (e){
			gameArea.keys[e.keyCode] = false;
		})
	},
	clear : function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	getInput : function() {
		if (gameArea.keys && gameArea.keys[65] && x > 1 && xDelay == 0) {
			x--;
			xDelay = config.delay;
		} 
		if (gameArea.keys && gameArea.keys[68] && x < 5 && xDelay == 0) {
			x++;
			xDelay = config.delay;
		}
		if (gameArea.keys && gameArea.keys[87] && y > 1 && yDelay == 0) {
			y--;
			yDelay = config.delay;
		}
		if (gameArea.keys && gameArea.keys[83] && y < 5 && yDelay == 0) {
			y++;
			yDelay = config.delay;
		}
	}
}

function highlight(width, height, orientation, source) {
	this.orientation = orientation;
	this.source = source;
	this.width = width;
	this.height = height;
	this.image = new Image();
	this.image.src = source;
	this.update = function() {
		if (this.orientation == "vertical") {
			this.xCoord = x * 100 - 100;
			ctx = gameArea.context;
			ctx.save();
			ctx.globalAlpha = 0.5;
			ctx.drawImage(this.image, this.xCoord, 0, this.width, this.height);
			ctx.restore();
		} 
		if (this.orientation == "horizontal") {
			this.yCoord = y * 100 - 100;
			ctx = gameArea.context;
			ctx.save();
			ctx.globalAlpha = 0.5;
			ctx.drawImage(this.image, 0, this.yCoord, this.width, this.height);
			ctx.restore();
		}
	}

}

updateGameArea = function() {
	if (xDelay > 0) {xDelay--;}
	if (yDelay > 0) {yDelay--;}
	gameArea.clear();
	gameArea.getInput();
	highlightVert.update();
	highlightHori.update();
	console.log(x + " " + y);
}