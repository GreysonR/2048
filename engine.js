"use strict"

const canv = document.getElementById("canv");
const ctx = canv.getContext("2d");

const engine = {
	allBlocks: [],
	blocks: [ [], [], [], [] ],
	blockRadius: 3,
	blockMargin: 10,
	lost: false,
	score: 0,
	renderScale: window.devicePixelRatio * 1.25 || 1,
	blockColors: [ "#EEE4DA", "#EDE0C8", "#F2B179", "#F59563", "#F67C5F", "#F65E3B", "#EDCF72", "#EDCC61", "#EDC850", "#EDC53F" ],
	init: function() {
		let loseScreen = document.getElementById("lose");
		let { renderScale } = engine;

		canv.width = Math.min(window.innerWidth, window.innerHeight, 400) * renderScale; //Math.min(window.innerWidth, window.innerHeight);
		canv.height = canv.width;
		canv.background = "#FAF8EF";
		loseScreen.style.width = canv.width / renderScale + "px";
		loseScreen.style.height = canv.width / renderScale + "px";
		ctx.scale(renderScale, renderScale);

		canv.style.transform = `translate(-50%, -50%) scale(${ 1 / renderScale })`;
	},
	Performance: {
		delta: 16.67,
		fps: 60,
		lastTime: performance.now(),
		update: function() {
			let Performance = engine.Performance;
			let curTime = performance.now();
			Performance.delta = curTime - Performance.lastTime;
			Performance.lastTime = curTime;
			Performance.fps = 1000 / Performance.delta;
		}
	},
	Render: function() {
		let Render = engine.Render;
		// Clear
		let width = canv.width / engine.renderScale;
		ctx.clearRect(0, 0, width, width);

		// Background
		ctx.fillStyle = "#BBADA0";
		Render.roundedRect(0, 0, width, width, 7);

		// Background grid
		let margin = engine.blockMargin * width / 350;
		let radius = engine.blockRadius * width / 350;
		let blockSize = (width - margin * 5) / 4;
		ctx.fillStyle = "#CDC1B4";
		for (let i = 0; i < 16; i++) {
			let x = i % 4;
			let y = Math.floor(i / 4);

			Render.roundedRect(x*(blockSize + margin) + margin, y*(blockSize + margin) + margin, blockSize, blockSize, radius);
		}

		// Render blocks
		for (let i = 0; i < engine.allBlocks.length; i++) {
			let block = engine.allBlocks[i];
			if (block) {
				let bx = block.position.x;
				let by = block.position.y;
				let px = bx*(blockSize + margin) + margin;
				let py = by*(blockSize + margin) + margin;
				ctx.fillStyle = engine.blockColors[Math.min(engine.blockColors.length - 1, Math.log(block.value) / Math.log(2) - 1)];

				let scale = block.scale;
				if (scale !== 1) {
					Render.roundedRect(px + blockSize/2 - blockSize*scale/2, py + blockSize/2 - blockSize*scale/2, blockSize*scale, blockSize*scale, radius * scale);
				}
				else {
					Render.roundedRect(px, py, blockSize, blockSize, radius);
				}

				// text
				let textLength = ("" + block.value).length;
				let fontSize = Math.round(40 * block.scale * width/350 * Math.min(1, 2 / textLength ** 0.8));
				ctx.font = fontSize + "px Ubuntu";
				ctx.textAlign = "center";
				ctx.fillStyle = block.value < 8 ? "#646464" : "white";
				ctx.fillText(block.value, px + blockSize / 2, py + blockSize / 2 + fontSize*0.4);
			}
		}

	},
	block: function(x, y, value = 0) {
		if (engine.blocks[x][y] !== undefined) {
			return false;
		}

		let block = {
			scale: 1, // rendered block scale
			position: new vec(x, y), // rendered position
			lastPosition: new vec(x, y), // real position
			value: value ? value : Math.random() < 0.9 ? 2 : 4,
			lastMove: 0,
			setPosition: function(pos, remove = false) {
				// Animation
				easeBlock(block, new vec(block.position), new vec(pos), remove);

				// Move block in grid
				delete engine.blocks[block.lastPosition.x][block.lastPosition.y];
				if (!remove) engine.blocks[pos.x][pos.y] = block;
				
				block.lastPosition.set(pos);
			},
			delete: function() {
				let deletedBlock = engine.blocks[block.lastPosition.x][block.lastPosition.y];
				if (deletedBlock && deletedBlock == block)
					delete engine.blocks[block.lastPosition.x][block.lastPosition.y];
				engine.allBlocks.splice(engine.allBlocks.indexOf(block), 1);
			}
		};
		engine.blocks[x][y] = block;
		engine.allBlocks.push(block);

		popIn(block);
		
		return block;
	},
}
engine.Render.roundedRect = function(x, y, width, height, radius, fill=true) {
	if (fill) ctx.beginPath();

	let ra, rb, rc, rd;
	if (typeof radius === "object") {
		ra = radius[1];
		rb = radius[2];
		rc = radius[3];
		rd = radius[0];
	}
	else {
		ra = rb = rc = rd = radius;
	}

	ctx.moveTo(x + rd, y);
	ctx.lineTo(x + width - ra, y);
	ctx.arcTo(x + width, y, x + width, y + ra, ra);
	ctx.lineTo(x + width, y + height - rb);
	ctx.arcTo(x + width, y + height, x + width - rb, y + height, rb);
	ctx.lineTo(x + rc, y + height);
	ctx.arcTo(x, y + height, x, y + height - rc, rc);
	ctx.lineTo(x, y + rd);
	ctx.arcTo(x, y, x + rd, y, rd);

	if (fill) {
		ctx.closePath();
		ctx.fill();
	}
}
