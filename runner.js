"use strict";

engine.init();
function main() {
	engine.Performance.update();
	animate.run();
	engine.Render();
	requestAnimationFrame(main);
}
main();

function addBlock() {
	setTimeout(() => {
		let i = 0;
		let foundSecond = false;
		while (!foundSecond && i < 1000) {
			i++;
			foundSecond = engine.block(Math.floor(Math.random() * 4), Math.floor(Math.random() * 4));
		}

		if (hasLost()) {
			engine.lost = true;
			document.getElementById("lose").classList.add("active");
		}
	}, 100);
}

function reset() {
	document.getElementById("lose").classList.remove("active");
	engine.allBlocks.length = 0;
	engine.blocks = [ [],[],[],[] ];
	engine.lost = false;
	engine.score = 0;

	// add 2 blocks
	for (let i = 0; i < 2; i++) {
		addBlock();
	}
}
reset();
// engine.block(2, 1, 2);
// engine.block(2, 2, 2);
// engine.block(2, 3, 4);

window.addEventListener("keydown", event => {
	let key = event.key.toLowerCase();

	if (!engine.lost) {
		if (key === "d" || key === "arrowright") {
			if (right()) addBlock();
		}
		else if (key === "a" || key === "arrowleft") {
			if (left()) addBlock();
		}
		else if (key === "w" || key === "arrowup") {
			if (up()) addBlock();
		}
		else if (key === "s" || key === "arrowdown") {
			if (down()) addBlock();
		}
	}
});

var touchX = 0;
var touchY = 0;
let touchMoved = false;
window.addEventListener("touchstart", event => {
	touchX = event.touches[0].clientX;
	touchY = event.touches[0].clientY;
});
window.addEventListener("touchmove", event => {
	if (!touchMoved && !engine.lost) {
		let x = event.touches[0].clientX;
		let y = event.touches[0].clientY;
		x -= touchX;
		y -= touchY;
		
		if (Math.sqrt(x * x + y * y) > 100) {
			touchMoved = true;
			if (Math.abs(x) > Math.abs(y)) {
				if (x > 0) { // right
					if (right()) addBlock();
				}
				else { // left
					if (left()) addBlock();
				}
			}
			else {
				if (y > 0) { // down
					if (down()) addBlock();
				}
				else { // up
					if (up()) addBlock();
				}
			}
		}
	}
});
window.addEventListener("touchend", () => {
	touchMoved = false;
});

function right() {
	let curFrame = engine.Performance.lastTime;
	let tmpGrid = [ [...engine.blocks[0]], [...engine.blocks[1]], [...engine.blocks[2]], [...engine.blocks[3]] ];
	let moved = false;

	for (let y = 0; y < 4; y++) {
		for (let x = 4; x-- > 0;) {
			let block = tmpGrid[x][y];
			if (!block) continue;

			for (let i = x; i++ < 3;) {
				let nextBlock = tmpGrid[i][y];
				
				if (nextBlock) {
					if (nextBlock.value === block.value && nextBlock.lastMove !== curFrame) {
						nextBlock.lastMove = curFrame;
						block.setPosition(new vec(i, y), true);
						delete tmpGrid[x][y];
						nextBlock.value *= 2;
						engine.score += nextBlock.value;
						merge(nextBlock);
						moved = true;

						let curIndex = engine.allBlocks.indexOf(block);
						let nextIndex = engine.allBlocks.indexOf(nextBlock);
						if (curIndex > nextIndex) {
							engine.allBlocks[nextIndex] = block;
							engine.allBlocks[curIndex] = nextBlock;
						}
					}
					else if (i - 1 !== block.position.x) {
						moved = true;
						delete tmpGrid[block.lastPosition.x][block.lastPosition.y];
						block.setPosition(new vec(i - 1, y));
						tmpGrid[block.lastPosition.x][block.lastPosition.y] = block;
					}
					break;
				}
				else if (i === 3 && block.position.x !== 3) {
					delete tmpGrid[block.lastPosition.x][block.lastPosition.y];
					block.setPosition(new vec(i, y));
					tmpGrid[block.lastPosition.x][block.lastPosition.y] = block;
					moved = true;
				}
			}
		}
	}
	return moved;
}
function left() {
	let curFrame = engine.Performance.lastTime;
	let tmpGrid = [ [...engine.blocks[0]], [...engine.blocks[1]], [...engine.blocks[2]], [...engine.blocks[3]] ];
	let moved = false;

	for (let y = 0; y < 4; y++) {
		for (let x = 0; x++ < 3;) {
			let block = tmpGrid[x][y];
			if (!block) continue;

			for (let i = x; i-- > 0;) {
				let nextBlock = tmpGrid[i][y];
				
				if (nextBlock) {
					if (nextBlock.value === block.value && nextBlock.lastMove !== curFrame) {
						nextBlock.lastMove = curFrame;
						block.setPosition(new vec(i, y), true);
						delete tmpGrid[x][y];
						nextBlock.value *= 2;
						engine.score += nextBlock.value;
						merge(nextBlock);
						moved = true;

						let curIndex = engine.allBlocks.indexOf(block);
						let nextIndex = engine.allBlocks.indexOf(nextBlock);
						if (curIndex > nextIndex) {
							engine.allBlocks[nextIndex] = block;
							engine.allBlocks[curIndex] = nextBlock;
						}
					}
					else if (i + 1 !== block.position.x) {
						moved = true;
						delete tmpGrid[block.lastPosition.x][block.lastPosition.y];
						block.setPosition(new vec(i + 1, y));
						tmpGrid[block.lastPosition.x][block.lastPosition.y] = block;
					}
					break;
				}
				else if (i === 0 && block.position.x !== 0) {
					delete tmpGrid[block.lastPosition.x][block.lastPosition.y];
					block.setPosition(new vec(i, y));
					tmpGrid[block.lastPosition.x][block.lastPosition.y] = block;
					moved = true;
				}
			}
		}
	}
	return moved;
}
function down() {
	let curFrame = engine.Performance.lastTime;
	let tmpGrid = [ [...engine.blocks[0]], [...engine.blocks[1]], [...engine.blocks[2]], [...engine.blocks[3]] ];
	let moved = false;

	for (let x = 0; x < 4; x++) {
		for (let y = 4; y-- > 0;) {
			let block = tmpGrid[x][y];
			if (!block) continue;

			for (let i = y; i++ < 3;) {
				let nextBlock = tmpGrid[x][i];
				
				if (nextBlock) {
					if (nextBlock.value === block.value && nextBlock.lastMove !== curFrame) {
						nextBlock.lastMove = curFrame;
						block.setPosition(new vec(x, i), true);
						delete tmpGrid[x][y];
						nextBlock.value *= 2;
						engine.score += nextBlock.value;
						merge(nextBlock);
						moved = true;

						let curIndex = engine.allBlocks.indexOf(block);
						let nextIndex = engine.allBlocks.indexOf(nextBlock);
						if (curIndex > nextIndex) {
							engine.allBlocks[nextIndex] = block;
							engine.allBlocks[curIndex] = nextBlock;
						}
					}
					else if (i - 1 !== block.position.y) {
						moved = true;
						delete tmpGrid[block.lastPosition.x][block.lastPosition.y];
						block.setPosition(new vec(x, i - 1));
						tmpGrid[block.lastPosition.x][block.lastPosition.y] = block;
					}
					break;
				}
				else if (i === 3 && block.position.y !== 3) {
					delete tmpGrid[block.lastPosition.x][block.lastPosition.y];
					block.setPosition(new vec(x, i));
					tmpGrid[block.lastPosition.x][block.lastPosition.y] = block;
					moved = true;
				}
			}
		}
	}
	return moved;
}
function up() {
	let curFrame = engine.Performance.lastTime;
	let tmpGrid = [ [...engine.blocks[0]], [...engine.blocks[1]], [...engine.blocks[2]], [...engine.blocks[3]] ];
	let moved = false;

	for (let x = 0; x < 4; x++) {
		for (let y = 0; y++ < 3;) {
			let block = tmpGrid[x][y];
			if (!block) continue;

			for (let i = y; i-- > 0;) {
				let nextBlock = tmpGrid[x][i];
				
				if (nextBlock) {
					if (nextBlock.value === block.value && nextBlock.lastMove !== curFrame) {
						nextBlock.lastMove = curFrame;
						block.setPosition(new vec(x, i), true);
						delete tmpGrid[x][y];
						nextBlock.value *= 2;
						engine.score += nextBlock.value;
						merge(nextBlock);
						moved = true;

						let curIndex = engine.allBlocks.indexOf(block);
						let nextIndex = engine.allBlocks.indexOf(nextBlock);
						if (curIndex > nextIndex) {
							engine.allBlocks[nextIndex] = block;
							engine.allBlocks[curIndex] = nextBlock;
						}
					}
					else if (i + 1 !== block.position.y) {
						moved = true;
						delete tmpGrid[block.lastPosition.x][block.lastPosition.y];
						block.setPosition(new vec(x, i + 1));
						tmpGrid[block.lastPosition.x][block.lastPosition.y] = block;
					}
					break;
				}
				else if (i === 0 && block.position.y !== 0) {
					delete tmpGrid[block.lastPosition.x][block.lastPosition.y];
					block.setPosition(new vec(x, i));
					tmpGrid[block.lastPosition.x][block.lastPosition.y] = block;
					moved = true;
				}
			}
		}
	}
	return moved;
}

function hasLost() {
	for (let x = 0; x < 4; x++) {
		for (let y = 0; y < 4; y++) {
			let block = engine.blocks[x][y];
			if (!block) return false;
			
			if (x > 0 && engine.blocks[x - 1][y].value === block.value) return false;
			if (y > 0 && engine.blocks[x][y - 1].value === block.value) return false;
		}
	}
	return true;
}