startGame = function() {
	mouseX = 0;
	mouseY = 0;
	on = true;
	endScreen = [];
	matrix = [];
	for (var i = 0; i < 6; i++) {
		matrix[i] = [];
		for (var j = 0; j < 6; j++) {
			matrix[i][j] = undefined;
		}
	}
	x = 1;
	y = 1;
	xDelay = 0;
	yDelay = 0;
	gameArea.start();
	highlightVert = new highlight(100, 600, "vertical", "highlightVert.png");
	highlightHori = new highlight(600, 100, "horizontal", "highlightHori.png");
	grid = new grid(600, 600, "grid.png");

}

config = {
	delay : 10,
	blueKey : 69,
	redKey : 81
}

reload = function() {
	on = true;
	for (var i = 0; i < endScreen.length; i++) {
		endScreen.splice(i, 1);
	}
	for (var i = 0; i < matrix.length; i++) {
		for (var j = 0; j < matrix.length; j++) {
			matrix[i][j] = undefined;
		}
	}
}

gameArea = {
	canvas : document.createElement('canvas'),
	start : function() {
		this.canvas.width = 600;
		this.canvas.height = 600;
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
		window.addEventListener('mousemove', function (e) {
			mouseX = e.pageX
			mouseY = e.pageY
		})
	},
	clear : function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	getInput : function() {
		if (mouseX > 5 && mouseX < 605 && mouseY > 5 && mouseY < 605) {
			for (var i = 100; i <= 600; i = i + 100) {
				if (mouseX > i - 95 && mouseX < i + 5) { x = i / 100; }
			}
			for (var i = 100; i <= 600; i = i + 100) {
				if (mouseY > i - 95 && mouseY < i + 5) { y = i / 100; }
			}
		} else { mouseX = undefined; mouseY = undefined; }
		// You might be wondering: why the 95 and why i + 5? 
		// It's because the canvas is about 5 pixels from the edge of the
		// page. When we use 100 instead of 95, the cursor is detected in
		// the incorrect position.
		if (gameArea.keys && gameArea.keys[65] && x > 1 && xDelay == 0) {
			x--;
			xDelay = config.delay;
		} 
		if (gameArea.keys && gameArea.keys[68] && x < 6 && xDelay == 0) {
			x++;
			xDelay = config.delay;
		}
		if (gameArea.keys && gameArea.keys[87] && y > 1 && yDelay == 0) {
			y--;
			yDelay = config.delay;
		}
		if (gameArea.keys && gameArea.keys[83] && y < 6 && yDelay == 0) {
			y++;
			yDelay = config.delay;
		}
		if (gameArea.keys && gameArea.keys[config.redKey]) {
			red = new piece("red.png", "red");
		}
		if (gameArea.keys && gameArea.keys[config.blueKey]) {
			blue = new piece("blue.png", "blue");
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

function grid(width, height, source) {
	this.width = width;
	this.height = height;
	this.image = new Image();
	this.image.src = source;
	this.update = function() {
		ctx = gameArea.context;
		ctx.save();
		ctx.drawImage(this.image, 0, 0, this.width, this.height);
		ctx.restore();
	}
}

function winGrid(width, height, source) {
	on = false;
	this.width = width;
	this.height = height;
	this.image = new Image();
	this.image.src = source;
	endScreen.push(this);
	this.update = function() {
		ctx = gameArea.context;
		ctx.save();
		ctx.drawImage(this.image, 0, 0, this.width, this.height);
		ctx.restore();
	}
}

function piece(source, color) {
	this.color = color;
	this.width = 100;
	this.height = 100;
	this.image = new Image();
	this.image.src = source;
	this.xCoord = x * 100 - 100;
	this.yCoord = y * 100 - 100;
	if (matrix[x - 1][y - 1] == undefined) {
		matrix[x - 1][y - 1] = this;
	}
	this.update = function() {
		ctx = gameArea.context;
		ctx.save();
		ctx.drawImage(this.image, this.xCoord, this.yCoord , this.width, this.height);
	}
}

function checkOrderWin() {
	var chaosWin = true;
	for (var i = 0; i < matrix.length; i++) {
		for (var j = 0; j < matrix.length; j++) {
			try {
				if (matrix[i][j].color == "blue" && // Diagonal right down
					matrix[i + 1][j + 1].color == "blue" &&
					matrix[i + 2][j + 2].color == "blue" &&
					matrix[i + 3][j + 3].color == "blue" &&
					matrix[i + 4][j + 4].color == "blue") {
					if (on) {
						gridBlueOrderWin = new winGrid(600, 600, "gridBlueOrderWin.png");
					}
				} 
			} catch (err) { }
			try {
				if (matrix[i][j].color == "blue" && // Diagonal left down
					matrix[i - 1][j + 1].color == "blue" &&
					matrix[i - 2][j + 2].color == "blue" &&
					matrix[i - 3][j + 3].color == "blue" &&
					matrix[i - 4][j + 4].color == "blue") {
					if (on) {
						gridBlueOrderWin = new winGrid(600, 600, "gridBlueOrderWin.png");
					}				}
			} catch (err) { }
			try {
				if (matrix[i][j].color == "blue" && // Down
					matrix[i][j + 1].color == "blue" &&
					matrix[i][j + 2].color == "blue" &&
					matrix[i][j + 3].color == "blue" &&
					matrix[i][j + 4].color == "blue") {
					if (on) {
						gridBlueOrderWin = new winGrid(600, 600, "gridBlueOrderWin.png");
					}				}
			} catch (err) { }
			try {
				if (matrix[i][j].color == "blue" && // Right
					matrix[i + 1][j].color == "blue" &&
					matrix[i + 2][j].color == "blue" &&
					matrix[i + 3][j].color == "blue" &&
					matrix[i + 4][j].color == "blue") {
					if (on) {
						gridBlueOrderWin = new winGrid(600, 600, "gridBlueOrderWin.png");
					}				}
			} catch (err) { }
			try {
				if (matrix[i][j].color == "red" && // Diagonal right down
					matrix[i + 1][j + 1].color == "red" &&
					matrix[i + 2][j + 2].color == "red" &&
					matrix[i + 3][j + 3].color == "red" &&
					matrix[i + 4][j + 4].color == "red") {
					if (on) {
						gridRedOrderWin = new winGrid(600, 600, "gridRedOrderWin.png");
					}				} 
			} catch (err) { }
			try {
				if (matrix[i][j].color == "red" && // Diagonal left down
					matrix[i - 1][j + 1].color == "red" &&
					matrix[i - 2][j + 2].color == "red" &&
					matrix[i - 3][j + 3].color == "red" &&
					matrix[i - 4][j + 4].color == "red") {
					if (on) {
						gridRedOrderWin = new winGrid(600, 600, "gridRedOrderWin.png");
					}					}
			} catch (err) { }
			try {
				if (matrix[i][j].color == "red" && // Down
					matrix[i][j + 1].color == "red" &&
					matrix[i][j + 2].color == "red" &&
					matrix[i][j + 3].color == "red" &&
					matrix[i][j + 4].color == "red") {
					if (on) {
						gridRedOrderWin = new winGrid(600, 600, "gridRedOrderWin.png");
					}					}
			} catch (err) { }
			try {
				if (matrix[i][j].color == "red" && // Right
					matrix[i + 1][j].color == "red" &&
					matrix[i + 2][j].color == "red" &&
					matrix[i + 3][j].color == "red" &&
					matrix[i + 4][j].color == "red") {
					if (on) {
						gridRedOrderWin = new winGrid(600, 600, "gridRedOrderWin.png");
					}					}
			} catch (err) { }
			if (matrix[i][j] == undefined) {
				chaosWin = false;
			}
		}
	}
	if (endScreen.length == 0 && chaosWin) {
		gridChaosWin = new winGrid(600, 600, "gridChaosWin.png");
	}
}

updateGameArea = function() {
	if (xDelay > 0) { xDelay--; }
	if (yDelay > 0) { yDelay--; }
	gameArea.clear();
	gameArea.getInput();
	highlightVert.update();
	highlightHori.update();
	grid.update();
	for (var i = 0; i < matrix.length; i++) {
		for (var j = 0; j < matrix.length; j++) {
			if (matrix[i][j] != undefined) {
				matrix[i][j].update();
			}
		}
	}
	for (var i = 0; i < endScreen.length; i ++) {
		endScreen[i].update();
	}
	checkOrderWin();
}