startGame = function() {
	gameArea.start();
	highlightVert = new highlight(100, 500, "vertical", "highlightVert.png")
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
		ctx = gameArea.context;
		ctx.save();
		ctx.globalAlpha = 0.5;
		ctx.drawImage(this.image, 0, 0, this.width, this.height);
		ctx.restore();
	}

}

updateGameArea = function() {
	gameArea.clear();
	highlightVert.update();
}