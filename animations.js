"use strict";

// https://easings.net/
const animate = {
	running: [],
	run: function() {
		let i = this.running.length;

		if (i > 0) {
			for (i; i--;) {
				this.running[i]();
			}
		}
	},
	create: function({ duration = 600, curve = ease.inOut.sine, start = 0, delay = 0, oncancel, onend, callback }) {
		let t = start * duration;
		let p = t !== 0 && t !== 1 ? curve(t) : t === 0 ? 0 : 1;
		let run = true;

		function loop() {
			if (run === true) {
				t += engine.Performance.delta;

				p = curve(t / duration);
				callback(p);

				if (t >= duration) {
					run = false;
					animate.running.splice(animate.running.indexOf(loop), 1);
				}
				if (t >= duration) {
					if (typeof onend === "function") {
						onend();
					}
				}
			}
		}

		if (delay > 0) {
			setTimeout(() => {
				this.running.push(loop);
			}, delay);
		}
		else {
			this.running.push(loop);
		}

		return {
			duration: duration,
			get percent() {
				return p;
			},
			set percent(value) {
				p = Math.max(0, Math.min(value, 1));
			},
			stop: () => {
				if (run === true) {
					run = false;
					if (typeof oncancel === "function") {
						oncancel(p);
					}
					return p;
				}
			},
			start: () => {
				if (run === false) {
					run = true;
					setTimeout(loop, delay);
				}
			},
		};
	},
	linear: x => x,
	in: {
		sine: x => 1 - Math.cos((x * Math.PI) / 2),
		quadratic: x => x ** 2,
		cubic: x => x ** 3,
		quartic: x => x ** 4,
		quintic: x => x ** 5,
		exponential: x => x === 0 ? 0 : pow(2, 10 * x - 10),
		circular: x => 1 - Math.sqrt(1 - Math.pow(x, 2)),
		back: x => { const c1 = 1.70158; const c3 = c1 + 1; return c3 * x ** 3 - c1 * x ** 2; }
	},
	out: {
		sine: x => Math.sin((x * Math.PI) / 2),
		quadratic: x => 1 - (1 - x) ** 2,
		cubic: x => 1 - Math.pow(1 - x, 3),
		quartic: x => 1 - Math.pow(1 - x, 4),
		quintic: x => 1 - Math.pow(1 - x, 5),
		exponential: x => x === 1 ? 1 : 1 - Math.pow(2, -10 * x),
		circular: x => Math.sqrt(1 - Math.pow(x - 1, 2)),
		back: x => { const c1 = 2; const c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); }
	},
	inOut: {
		sine: x => -(Math.cos(Math.PI * x) - 1) / 2,
		quadratic: x => x < 0.5 ? 2 * x ** 2 : 1 - Math.pow(-2 * x + 2, 2) / 2,
		cubic: x => x < 0.5 ? 4 * x ** 3 : 1 - Math.pow(-2 * x + 2, 3) / 2,
		quartic: x => x < 0.5 ? 8 * x ** 4 : 1 - Math.pow(-2 * x + 2, 4) / 2,
		quintic: x => x < 0.5 ? 16 * x ** 5 : 1 - Math.pow(-2 * x + 2, 5) / 2,
		exponential: x => x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2,
		circular: x => x < 0.5 ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2,
		back: x => { const c1 = 1.70158; const c2 = c1 * 1.525; return x < 0.5 ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2 : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2; },
	}
}
const ease = animate;

function easeBlock(block, from, to, remove) {
	let diff = { x: to.x - from.x, y: to.y - from.y };

	if (block.animation) block.animation.stop();
	
	block.animation = animate.create({
		duration: 160,
		curve: ease.out.cubic,
		oncancel: function() {
			block.position.x = to.x;
			block.position.y = to.y;
			delete block.animation;
		},
		onend: function() {
			delete block.animation;
			block.position.x = to.x;
			block.position.y = to.y;

			if (remove) {
				block.delete();
			}
		},
		callback: (p) => {
			p = Math.min(1, p);
			block.position.x = from.x + diff.x * p;
			block.position.y = from.y + diff.y * p;
		},
	});
}
function popIn(block) {
	block.easeIn = animate.create({
		duration: 150,
		curve: ease.out.cubic,
		oncancel: function() {
			block.scale = 1;
			delete block.easeIn;
		},
		onend: function() {
			block.scale = 1;
			delete block.easeIn;
		},
		callback: (p) => {
			p = Math.min(1, p);
			block.scale = p;
		},
	});
}
function merge(block) {
	block.merge = animate.create({
		duration: 80,
		delay: 100,
		curve: ease.inOut.sine,
		onend: function() {
			block.merge = animate.create({
				duration: 100,
				curve: ease.inOut.cubic,
				onend: function() {
					block.scale = 1;
					delete block.merge;
				},
				callback: (p) => {
					p = Math.min(1, p);
					block.scale = 1 + (1 - p) * 0.2;
				},
			});
		},
		callback: (p) => {
			p = Math.min(1, p);
			block.scale = 1 + p * 0.2;
		},
	});
}