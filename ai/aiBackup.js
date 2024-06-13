"use strict";

async function aiOld(depth) {
	function dupeBoard(board) {
		let b = [ [...board[0]], [...board[1]], [...board[2]], [...board[3]] ];
		b.score = board.score;
		b.chance = board.chance;
		return b;
	}
	let board = (() => { // convert game board to one the ai can use
		let b = [[],[],[],[]];
		for (let x = 0; x < 4; x++) {
			for (let y = 0; y < 4; y++) {
				b[x][y] = engine.blocks[x][y] === undefined ? 0 : engine.blocks[x][y].value;
			}
		}
		b.score = engine.score;
		b.chance = 1;
		return b;
	})();
	async function right(boards) {
		let final = [];
		for (board of boards) {
			board = dupeBoard(board);
			let merged = [];
			let mvt = 0;
			for (let y = 0; y < 4; y++) {
				for (let x = 3; x-- > 0;) {
					let block = board[x][y];
					if (!block) continue;
	
					// scan for merge
					for (let i = x + 1; i < 4; i++) {
						let nextBlock = board[i][y];
						if (nextBlock !== 0) {
							if (block === nextBlock && !merged.includes(i + "" + y)) {
								merged.push(i + "" + y);
								board[i][y] *= 2;
								board[x][y] = 0;
								board[x][y] = 0;
								board.score += block * 2;
								mvt++;
							}
							else {
								board[x][y] = 0;
								board[i - 1][y] = block;
								board[x][y] = 0;
								board[i - 1][y] = block;
								mvt += Math.abs(x - (i - 1));
							}
							break;
						}
						else if (i === 3) {
							board[x][y] = 0;
							board[i][y] = block;
							board[x][y] = 0;
							board[i][y] = block;
							mvt += Math.abs(x - i);
						}
					}
				}
			}
			if (mvt === 0) {
				board.score = 0;
				continue;
			}

			let nOpen = 0;
			for (let x = 0; x < 4; x++) {
				for (let y = 0; y < 4; y++) {
					if (board[x][y] === 0) {
						nOpen++;
					}
				}
			}
			for (let x = 0; x < 4; x++) {
				for (let y = 0; y < 4; y++) {
					if (board[x][y] === 0) {
						let a = dupeBoard(board);
						a[x][y] = 2;
						a.chance = 0.9;
						if (nOpen > 0) {
							let b = dupeBoard(board);
							b[x][y] = 4;
							b.chance = 0.1;
							final.push(a, b);
						}
						else {
							final.push(a);
						}
					}
				}
			}
		}
		return final;
	}
	async function left(boards) {
		let final = [];
		for (board of boards) {
			board = dupeBoard(board);
			let merged = [];
			let mvt = 0;
			for (let y = 0; y < 4; y++) {
				for (let x = 0; x++ < 3;) {
					let block = board[x][y];
					if (!block) continue;

					// scan for merge
					for (let i = x - 1; i >= 0; i--) {
						let nextBlock = board[i][y];
						if (nextBlock !== 0) {
							if (block === nextBlock && !merged.includes(i + "" + y)) {
								merged.push(i + "" + y);
								board[i][y] *= 2;
								board[x][y] = 0;
								board[x][y] = 0;
								board.score += block * 2;
								mvt++;
							}
							else {
								board[x][y] = 0;
								board[i + 1][y] = block;
								board[x][y] = 0;
								board[i + 1][y] = block;
								mvt += Math.abs(x - (i + 1));
							}
							break;
						}
						else if (i === 0) {
							board[x][y] = 0;
							board[i][y] = block;
							board[x][y] = 0;
							board[i][y] = block;
							mvt += Math.abs(x - i);
						}
					}
				}
			}

			if (mvt === 0) board.score = 0;

			let nOpen = 0;
			for (let x = 0; x < 4; x++) {
				for (let y = 0; y < 4; y++) {
					if (board[x][y] === 0) {
						nOpen++;
					}
				}
			}
			for (let x = 0; x < 4; x++) {
				for (let y = 0; y < 4; y++) {
					if (board[x][y] === 0) {
						let a = dupeBoard(board);
						a[x][y] = 2;
						a.chance = 0.9;
						if (nOpen > 0) {
							let b = dupeBoard(board);
							b[x][y] = 4;
							b.chance = 0.1;
							final.push(a, b);
						}
						else {
							final.push(a);
						}
					}
				}
			}
		}
		return final;
	}
	async function down(boards) {
		let final = [];
		for (board of boards) {
			board = dupeBoard(board);
			let merged = [];
			let mvt = 0;
			for (let x = 0; x < 4; x++) {
				for (let y = 3; y-- > 0;) {
					let block = board[x][y];
					if (!block) continue;

					// scan for merge
					for (let i = y + 1; i < 4; i++) {
						let nextBlock = board[x][i];
						if (nextBlock !== 0) {
							if (block === nextBlock && !merged.includes(x + "" + i)) {
								merged.push(x + "" + i);
								board[x][i] *= 2;
								board[x][y] = 0;
								board[x][y] = 0;
								board.score += block * 2;
								mvt++;
							}
							else {
								board[x][y] = 0;
								board[x][i - 1] = block;
								board[x][y] = 0;
								board[x][i - 1] = block;
								mvt += Math.abs(y - (i - 1));
							}
							break;
						}
						else if (i === 3) {
							board[x][y] = 0;
							board[x][i] = block;
							board[x][y] = 0;
							board[x][i] = block;
							mvt += Math.abs(y - i);
						}
					}
				}
			}
			if (mvt === 0) board.score = 0;

			let nOpen = 0;
			for (let x = 0; x < 4; x++) {
				for (let y = 0; y < 4; y++) {
					if (board[x][y] === 0) {
						nOpen++;
					}
				}
			}
			for (let x = 0; x < 4; x++) {
				for (let y = 0; y < 4; y++) {
					if (board[x][y] === 0) {
						let a = dupeBoard(board);
						a[x][y] = 2;
						a.chance = 0.9;
						if (nOpen > 0) {
							let b = dupeBoard(board);
							b[x][y] = 4;
							b.chance = 0.1;
							final.push(a, b);
						}
						else {
							final.push(a);
						}
					}
				}
			}
		}
		return final;
	}
	async function up(boards) {
		let final = [];
		for (board of boards) {
			board = dupeBoard(board);
			let merged = [];
			let mvt = 0;
			for (let x = 0; x < 4; x++) {
				for (let y = 0; y++ < 3;) {
					let block = board[x][y];
					if (!block) continue;

					// scan for merge
					for (let i = y - 1; i >= 0; i--) {
						let nextBlock = board[x][i];
						if (nextBlock !== 0) {
							if (block === nextBlock && !merged.includes(x + "" + i)) {
								merged.push(x + "" + i);
								board[x][i] *= 2;
								board[x][y] = 0;
								board[x][y] = 0;
								board.score += block * 2;
								mvt++;
							}
							else {
								board[x][y] = 0;
								board[x][i + 1] = block;
								board[x][y] = 0;
								board[x][i + 1] = block;
								mvt += Math.abs(y - (i + 1));
							}
							break;
						}
						else if (i === 0) {
							board[x][y] = 0;
							board[x][i] = block;
							board[x][y] = 0;
							board[x][i] = block;
							mvt += Math.abs(y - i);
						}
					}
				}
			}
			if (mvt === 0) board.score = 0;

			let nOpen = 0;
			for (let x = 0; x < 4; x++) {
				for (let y = 0; y < 4; y++) {
					if (board[x][y] === 0) {
						nOpen++;
					}
				}
			}
			for (let x = 0; x < 4; x++) {
				for (let y = 0; y < 4; y++) {
					if (board[x][y] === 0) {
						let a = dupeBoard(board);
						a[x][y] = 2;
						a.chance = 0.9;
						if (nOpen > 0) {
							let b = dupeBoard(board);
							b[x][y] = 4;
							b.chance = 0.1;
							final.push(a, b);
						}
						else {
							final.push(a);
						}
					}
				}
			}
		}
		return final;
	}
	
	// Get all possible games up to depth
	let options = { boards: [ board ] };
	function getMonotonicity(board) {
		let diff = 0;
		for (let x = 0; x < 4; x++) {
			for (let y = 0; y < 4; y++) {
				let cur = board[x][y];
				let adj = [];
				if (x < 3 && y < 3) adj.push(board[x + 1][y + 1]);

				for (let i = 0; i < adj.length; i++) {
					diff += Math.abs(adj[i] - cur);
				}
			}
		}
		return diff * 2;
	}
	function getSmoothness(board) {
		let diff = 0;
		for (let x = 0; x < 4; x++) {
			for (let y = 0; y < 4; y++) {
				let cur = board[x][y];
				let adj = [];
				if (x > 0) adj.push(board[x - 1][y]);
				if (y > 0) adj.push(board[x][y - 1]);

				for (let i = 0; i < adj.length; i++) {
					diff += Math.abs(adj[i] - cur);
				}
			}
		}
		return diff * 0.5;
	}
	function nextTree(options) {
		if (!options) return 0;
		if (!options.boards) {
			return Math.max(nextTree(options.left) || 0, nextTree(options.right) || 0, nextTree(options.down) || 0, nextTree(options.up) || 0);
		}
		else {
			let t = 0;
			for (let i = options.boards.length; i--;) {
				if (options.boards[i].score === 0) continue;
				t += (options.boards[i].score + getSmoothness(options.boards[i]) + getMonotonicity(options.boards[i])) * options.boards[i].chance;
			}
			return t;
		}
	}
	async function next(options, curDepth) {
		if (curDepth < depth && options) {
			options.right = { boards: await right(options.boards) };
			options.left = { boards: await left(options.boards) };
			options.up = { boards: await up(options.boards) };
			options.down = { boards: await down(options.boards) };

			// prune
			let rightScore = nextTree(options.right, 1);
			let leftScore = nextTree(options.left, 1);
			let downScore = nextTree(options.down, 1);
			let upScore = nextTree(options.up, 1);
			let min = Math.min(rightScore, leftScore, downScore, upScore);
			let max = Math.max(rightScore, leftScore, downScore, upScore);

			if (max - min > 100) {
				if (min === rightScore) delete options.right;
				else if (min === leftScore) delete options.left;
				else if (min === downScore) delete options.down;
				else if (min === upScore) delete options.up;
			}


			delete options.boards;

			await next(options.right, curDepth + 1);
			await next(options.left, curDepth + 1);
			await next(options.up, curDepth + 1);
			await next(options.down, curDepth + 1);
		}
	}

	console.time();
	await next(options, 0);

	// Find move that gives best chance of good game
	let rightScore = nextTree(options.right, 1);
	let leftScore = nextTree(options.left, 1);
	let downScore = nextTree(options.down, 1);
	let upScore = nextTree(options.up, 1);
	let max = Math.max(rightScore, leftScore, downScore, upScore);

	if (max === rightScore) pressKey("arrowright");
	else if (max === leftScore) pressKey("arrowleft");
	else if (max === downScore) pressKey("arrowdown");
	else if (max === upScore) pressKey("arrowup");

	let nOpen = 0;
	for (let x = 0; x < 4; x++) {
		for (let y = 0; y < 4; y++) {
			if (board[x][y] === 0) {
				nOpen++;
			}
		}
	}

	return;
	setTimeout(() => {
		if (nOpen > 0) {
			if (nOpen > 10) aiOld(2);
			else aiOld(4);
		}
	}, 100);
	console.timeEnd();
}

window.addEventListener("keypress", event => {
	if (event.key === "g") {
		aiOld(4);
	}
});

function pressKey(key) {
	window.dispatchEvent(new KeyboardEvent("keydown", { key: key }));
}