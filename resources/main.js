var Game = {
	canvas: document.getElementById('c'),
	lastUpdate: +new Date(),
	fps: 40,
	world: 0,
	level: 0,
	levels: [
		[
			{
				name: "The Adventure Begins",
				lims: {
					x: [0, 10000],
					y: [-500, 500]
				},
				badpath: function (entity) {
					
				},
				normalpath: function (entity) {
					this.context.fillStyle = 'darkgreen';
					this.context.beginPath();
					this.context.moveTo(0, this.canvas.height * 7 / 8);
					this.context.arcTo(0, this.canvas.height * 7 / 8, this.canvas.width / 8, this.canvas.height, true);
					this.context.lineTo(0, this.canvas.height);
					this.context.fill();
				}
			}
		]
	],
	transX: 0,
	transY: 0,
	paused: false,
	pausekeydown: false,
	pause: function () {
		if (!this.pausekeydown) {
			if (!this.paused) {
				cancelAnimationFrame(this.loop);
				this.paused = true;
			} else {
				this.loop = requestAnimationFrame(this.update.bind(this));
			}
			this.pausekeydown = true;
		}
		return this;
	},
	drawBackground: function () {
	},
	loop: null,
	update: function () {
		if (this.paused) {
			this.lastUpdate = +new Date();
			this.paused = false;
		}
		var date = +new Date();
		this.context.save();
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.context.translate(this.transX, this.transY);
		this.drawBackground();
		player.update(this);
		player.draw(this);
		this.fps = Math.round(1 / (date - this.lastUpdate)/1000);
		this.lastUpdate = date;
		this.context.restore();
		if (key.ESCAPE) this.pause();
		else {
			this.pausekeydown = false;
			this.loop = requestAnimationFrame(this.update.bind(this));
		}
	},
	resize: function () {
		this.canvas.height = window.innerHeight;
		this.canvas.width = window.innerWidth;
	},
	setup: function () {
		this.canvas.height = window.innerHeight;
		this.canvas.width = window.innerWidth;
		window.addEventListener('resize', this.resize.bind(this), false);
		this.context = this.canvas.getContext('2d');
		this.loop = requestAnimationFrame(this.update.bind(this));
	}
},
	player = {
		x: 0,
		y: 0,
		w: Game.canvas.width/50,
		h: Game.canvas.width/25,
		xV: 0,
		yV: 0,
		speed: 5000,
		grounded: true,
		jumps: 0,
		gravity: {
			dir: 'd',
			acceleration: 10
		},
		jumped: false,
		jumpVel: 200,
		friction: 0.9,
		airfriction: 0.95,
		update: function (gameengine) {
			if (key.LEFT && this.xV > -this.speed) {
				this.xV-=30;
			} else if (key.RIGHT && this.xV < this.speed) {
				this.xV+=30;
			}
			if ((key.UP || key.SPACE) && this.jumps < 3 && !this.jumped) {
				this.jumps++;
				this.yV-=this.jumpVel;
				this.jumped = true;
			} else if (!key.UP && !key.SPACE) {
				this.jumped = false;
			}
			this.lastPos = [this.x, this.y];
            if (this.xV > 1 && this.x + gameengine.transX > canvas.width*9/10 && gameengine.transX < gameengine.levels[gameengine.world][gameengine.level].lims.x[1]-gameengine.canvas.width) {
                gameengine.transX -= this.xV*2/gameengine.fps;
                if (gameengine.transX > gameengine.levels[gameengine.world][gameengine.level].lims.x[1]-gameengine.canvas.width) gameengine.transX = gameengine.levels[gameengine.world][gameengine.level].lims.x[1]-gameengine.canvas.width;
            } else if (this.xV < -1 && this.x + gameengine.transX < canvas.width/10 && gameengine.transX > gameengine.levels[gameengine.world][gameengine.level].lims.x[0]) {
                gameengine.transX -= this.xV*2/gameengine.fps;
                if (gameengine.transX < gameengine.levels[gameengine.world][gameengine.level].lims.x[0]) gameengine.transX = gameengine.levels[gameengine.world][gameengine.level].lims.x[0];
            }
			this.x+=this.xV*2/gameengine.fps;
			gameengine.levels[gameengine.world][gameengine.level].badpath.bind(gameengine)(this);
			gameengine.levels[gameengine.world][gameengine.level].normalpath.bind(gameengine)(this);
			if (this.x < gameengine.levels[gameengine.world][gameengine.level].lims.x[0]) {
				this.x = gameengine.levels[gameengine.world][gameengine.level].lims.x[0];
				this.xV = 0;
			}
			if (this.x > gameengine.levels[gameengine.world][gameengine.level].lims.x[1]-this.w) {
				this.x = gameengine.levels[gameengine.world][gameengine.level].lims.x[1]-this.w;
				this.xV = 0;
			}
			this.y+=this.yV*2/gameengine.fps;
			if (this.y < gameengine.canvas.height-this.h) this.yV+=this.gravity.acceleration;
			else {
				this.yV = 0;
				this.y = gameengine.canvas.height-this.h;
				this.jumps = 0;
			}
			if (this.grounded) this.xV*=this.friction;
			else this.xV*= this.airfriction;
		},
		draw: function (gameengine) {
			gameengine.context.fillRect(this.x,this.y,this.w,this.h);
		}
	},
	key = {
		BREAK: false,
		BACKSPACE: false,
		TAB: false,
		ENTER: false,
		SHIFT: false,
		CTRL: false,
		ALT: false,
		PAUSE: false,
		CAPS: false,
		ESCAPE: false,
		SPACE: false,
		PAGEUP: false,
		PAGEDOWN: false,
		END: false,
		HOME: false,
		LEFT: false,
		UP: false,
		RIGHT: false,
		DOWN: false,
		INSERT: false,
		DELETE: false,
		ZERO: false,
		ONE: false,
		TWO: false,
		THREE: false,
		FOUR: false,
		FIVE: false,
		SIX: false,
		SEVEN: false,
		EIGHT: false,
		NINE: false,
		A: false,
		B: false,
		C: false,
		D: false,
		E: false,
		F: false,
		G: false,
		H: false,
		I: false,
		J: false,
		K: false,
		L: false,
		M: false,
		N: false,
		O: false,
		P: false,
		Q: false,
		R: false,
		S: false,
		T: false,
		U: false,
		V: false,
		W: false,
		X: false,
		Y: false,
		Z: false,
		LEFTWIN: false,
		RIGHTWIN: false,
		SELECT: false,
		NUM0: false,
		NUM1: false,
		NUM2: false,
		NUM3: false,
		NUM4: false,
		NUM5: false,
		NUM6: false,
		NUM7: false,
		NUM8: false,
		NUM9: false,
		MULT: false,
		ADD: false,
		SUB: false,
		DECIMAL: false,
		DIVIDE: false,
		F1: false,
		F2: false,
		F3: false,
		F4: false,
		F5: false,
		F6: false,
		F7: false,
		F8: false,
		F9: false,
		F10: false,
		F11: false,
		F12: false,
		NUMLOCK: false,
		SCRLOCK: false,
		COLON: false,
		EQUALS: false,
		COMMA: false,
		DASH: false,
		PERIOD: false,
		FORSLASH: false,
		GRAVE: false,
		OPENBRAC: false,
		BACKSLASH: false,
		CLOSEBRAC: false,
		QUOTE: false
	};
var keylist = [undefined, undefined, undefined, 'BREAK', undefined, undefined, undefined, undefined, 'BACKSPACE', 'TAB', undefined, undefined, undefined, 'ENTER', undefined, undefined, 'SHIFT', 'CTRL', 'ALT', 'PAUSE', 'CAPS', undefined, undefined, undefined, undefined, undefined, undefined, 'ESCAPE', undefined, undefined, undefined, undefined, 'SPACE', 'PAGEUP', 'PAGEDOWN', 'END', 'HOME', 'LEFT', 'UP', 'RIGHT', 'DOWN', undefined, undefined, undefined, undefined, 'INSERT', 'DELETE', undefined, 'ZERO', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', undefined, undefined, undefined, undefined, undefined, undefined, undefined, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'LEFTWIN', 'RIGHTWIN', 'SELECT', undefined, undefined, 'NUM0', 'NUM1', 'NUM2', 'NUM3', 'NUM4', 'NUM5', 'NUM6', 'NUM7', 'NUM8', 'NUM9', 'MULT', 'ADD', undefined, 'SUB', 'DECIMAL', 'DIVIDE', '1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 'NUMLOCK', 'SCRLOCK', undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 'COLON', 'EQUALS', 'COMMA', 'DASH', 'PERIOD', 'FORSLASH', 'GRAVE', undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 'OPENBRAC', 'BACKSLASH', 'CLOSEBRAC', 'QUOTE'];
document.body.onload = Game.setup.bind(Game);
document.addEventListener('keydown',function (e) {
	if (keylist[e.keyCode]) key[keylist[e.keyCode]] = true;
	if (Game.paused && key.ESCAPE) {
		key.ESCAPE = false;
		Game.pause();
	}
}, false);
document.addEventListener('keyup',function (e) {
	key[keylist[e.keyCode]] = false;
}, false);