"use strict";

function printBoard(board) {
	let str = "";
	for (let y = 0; y < 4; y++) {
		if (y > 0) str += "\n";
		for (let x = 0; x < 4; x++) {
			str += board.state[y * 4 + x] + " ";
		}
	}
	console.log("%c" + str, "font-size: 14px;");
}
function dupeBoard(board) {
	return {
		score: board.score,
		chance: board.chance,
		state: [ ...board.state ]
	};
}
function shiftX(boards, dir) { // 1 = right, 0 = left
	if (boards.length === 0 || !boards) return [];

	let newBoards = [];
	let moved = false;

	for (let board of boards) {
		board = dupeBoard(board);
		let merged = [];

		for (let y = 0; y < 4; y++) {
			for (let x = 3 * dir; dir ? x >= 0 : x < 4; x += dir ? -1 : 1) {
				let curVal = board.state[y*4 + x];
				if (!curVal) continue;

				for (let i = x + Math.sign(dir - 0.5); dir ? i < 4 : i >= 0; i += dir ? 1 : -1) {
					let nextVal = board.state[y*4 + i];

					if (nextVal) {
						if (nextVal === curVal && !merged.includes(y*4 + i)) { // merge
							board.state[y*4 + x] = 0;
							board.state[y*4 + i] *= 2;
							board.score += curVal * 2;
							merged.push(y*4 + i);
							moved = true;
						}
						else if (x !== i - Math.sign(dir - 0.5)) {
							board.state[y*4 + x] = 0;
							board.state[y*4 + i - Math.sign(dir - 0.5)] = curVal;
							moved = true;
						}
						break;
					}
					else if ((dir && i === 3 || !dir && i === 0) && x !== i) {
						board.state[y*4 + x] = 0;
						board.state[y*4 + i] = curVal;
						moved = true;
					}
				}
			}
		}
		newBoards.push(board);
	}

	if (!moved) {
		return [];
	}
	newBoards = addBlocks(newBoards);
	return newBoards;
}
function shiftY(boards, dir) { // 1 = down, 0 = up
	if (boards.length === 0 || !boards) return [];

	let newBoards = [];
	let movedAtAll = false;

	for (let board of boards) {
		board = dupeBoard(board);
		let merged = [];
		let moved = false;

		for (let x = 0; x < 4; x++) {
			for (let y = 3 * dir; dir ? y >= 0 : y < 4; y += dir ? -1 : 1) {
				let curVal = board.state[y*4 + x];
				if (!curVal) continue;

				for (let i = y + Math.sign(dir - 0.5); dir ? i < 4 : i >= 0; i += dir ? 1 : -1) {
					let nextVal = board.state[i*4 + x];

					if (nextVal) {
						if (nextVal === curVal && !merged.includes(i*4 + x)) { // merge
							board.state[y*4 + x] = 0;
							board.state[i*4 + x] *= 2;
							board.score += curVal * 2;
							merged.push(i*4 + x);
							moved = true;
						}
						else if (y !== i - Math.sign(dir - 0.5)) {
							board.state[y*4 + x] = 0;
							board.state[(i - Math.sign(dir - 0.5))*4 + x] = curVal;
							moved = true;
						}
						break;
					}
					else if ((dir && i === 3 || !dir && i === 0) && y !== i) {
						board.state[y*4 + x] = 0;
						board.state[i*4 + x] = curVal;
						moved = true;
					}
				}
			}
		}
		if (moved) movedAtAll = true;
		else board.score = -Infinity;
		newBoards.push(board);
	}

	if (!movedAtAll) {
		return [];
	}
	newBoards = addBlocks(newBoards);
	return newBoards;
}
function addBlocks(boards) {
	let newBoards = [];
	for (let board of boards) {
		if (board.score > 0) {
			for (let y = 0; y < 4; y++) {
				for (let x = 0; x < 4; x++) {
					let val = board.state[y * 4 + x];
					if (val === 0) {
						let a = dupeBoard(board);
						a.state[y * 4 + x] = 2;
						a.chance *= 0.9;
		
						// let b = dupeBoard(board);
						// b.state[y * 4 + x] = 4;
						// b.chance *= 0.1;
		
						newBoards.push(a);
					}
				}
			}
		}
	}
	return newBoards;
}

async function ai(depth) {
	let board = (() => { // convert game board to one ai can use\
		let b = {
			score: engine.score,
			chance: 1,
			state: [],
		};
		for (let y = 0; y < 4; y++) {
			for (let x = 0; x < 4; x++) {
				if (engine.blocks[x][y]) {
					b.state.push(engine.blocks[x][y].value);
				}
				else {
					b.state.push(0);
				}
			}
		}
		return b;
	})();

	// get all options up to depth
	function next(options, curDepth) {
		if (curDepth < depth) {
			let keys = [ "right", "left", "up", "down" ];

			for (let i = keys.length; i--;) {
				let key = keys[i];
				if (options[key].length === 0) continue;

				options[key] = {
					right: shiftX(options[key], 1),
					left: shiftX(options[key], 0),
					down: shiftY(options[key], 1),
					up: shiftY(options[key], 0),
				};
				next(options[key], curDepth + 1);
			}
		}
	}

	let options = {
		right: shiftX([ board ], 1),
		left:  shiftX([ board ], 0),
		down:  shiftY([ board ], 1),
		up:    shiftY([ board ], 0),
	};
	next(options, 1);
	
	function getMonotonicity(board) {
		let diff = 0;
		for (let y = 0; y < 4; y++) {
			for (let x = 0; x < 4; x++) {
				let cur = board.state[y*4 + x];
				let adj = [];
				if (x < 3 && y < 3) adj.push(board.state[(y + 1) * 4 + (x + 1)]);
				if (x > 0 && y < 3) adj.push(board.state[(y + 1) * 4 + (x - 1)]);

				for (let i = 0; i < adj.length; i++) {
					diff -= Math.abs(adj[i] - cur);
				}
			}
		}
		return diff * 0;
	}
	function getSmoothness(board) {
		let diff = 0;
		for (let y = 0; y < 4; y++) {
			for (let x = 0; x < 4; x++) {
				let cur = board.state[y * 4 + x];
				let adj = [];
				if (x > 0) adj.push(board.state[y * 4 + (x - 1)]);
				if (y > 0) adj.push(board.state[(y - 1) * 4 + x]);

				for (let i = 0; i < adj.length; i++) {
					diff -= Math.abs(adj[i] - cur);
				}
			}
		}
		return diff / 2;
	}
	function sidePenalty(board) {
		let diff = 0;
		let max = Math.max(...board.state);
		for (let y = 0; y < 4; y++) {
			for (let x = 0; x < 4; x++) {
				let cur = board.state[y * 4 + x];

				if (cur / max >= 1/4) {
					if (x > 0 && x < 3 && y > 0 && y < 3) { // large not on edge penalty
						diff -= cur;
					}
					if (cur == max && !((x == 3 || x == 0) && (y == 3 || y == 0))) { // max not on corner penalty
						diff -= cur * 3;
					}
				}
			}
		}
		return diff;
	}
	function nextTree(options) {
		if (!options) return -Infinity;
		if (options.left) {
			return (nextTree(options.left) + nextTree(options.right) + nextTree(options.down) + nextTree(options.up));
		}
		else {
			let t = 0;
			for (let i = options.length; i--;) {
				let cur = options[i];
				if (cur.score === 0) continue;
				t += (cur.score + getSmoothness(cur) + getMonotonicity(cur) + sidePenalty(cur)) * cur.chance;
			}
			return t ? t : -Infinity;
		}
	}

	
	// get score for each
	let rightScore = nextTree(options.right);
	let leftScore = nextTree(options.left);
	let downScore = nextTree(options.down);
	let upScore = nextTree(options.up);
	let max = Math.max(rightScore, leftScore, downScore, upScore);

	if (max === rightScore) pressKey("arrowright");
	else if (max === leftScore) pressKey("arrowleft");
	else if (max === downScore) pressKey("arrowdown");
	else if (max === upScore) pressKey("arrowup");/**/

	let nOpen = 0;
	for (let y = 0; y < 4; y++) {
		for (let x = 0; x < 4; x++) {
			if (board.state[y*4 + x] === 0) nOpen++;
		}
	}
	
	setTimeout(() => {
		if (nOpen > 0) {
			if (nOpen > 7) ai(3);
			else ai(4);
		}
	}, 300);
}

window.addEventListener("keypress", event => {
	if (event.key === "f") {
		ai(1);
	}
});

function pressKey(key) {
	window.dispatchEvent(new KeyboardEvent("keydown", { key: key }));
}