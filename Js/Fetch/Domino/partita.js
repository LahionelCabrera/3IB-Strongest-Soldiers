const API_BASE = "https://classe5ID.altervista.org/games";
const headers = new Headers();
headers.append("Authorization", "Basic NElCOkNSSVBQQQ==");

const params = new URLSearchParams(window.location.search);
const gameId = params.get("id");
let username = params.get("nome");
if (username === null) username = "";
let role = params.get("role");
if (role === null) role = "spectator";
let isSpectator = (role === "spectator");
let isSending = false;
let isSyncing = false;
let roomSnapshot = null;
let gameState = null;
let selectedTileKey = null;

const statusElement = document.getElementById("game-status");
const messageElement = document.getElementById("game-message");
const chainElement = document.getElementById("chain");
const handElement = document.getElementById("hand");
const spectatorElement = document.getElementById("spectator-status");
const leftButton = document.getElementById("play-left");
const rightButton = document.getElementById("play-right");
const drawButton = document.getElementById("draw-tile");
const passButton = document.getElementById("pass-turn");

if (gameId) {
	document.getElementById("valore-id").textContent = gameId;
} else {
	document.getElementById("valore-id").textContent = "Non disponibile";
}
leftButton.addEventListener("click", function() {
	playSelected("left");
});
rightButton.addEventListener("click", function() {
	playSelected("right");
});
drawButton.addEventListener("click", drawTile);
passButton.addEventListener("click", passTurn);

function request(path, method) {
	if (!method) method = "GET";

	return fetch(API_BASE + path, {
		method: method,
		headers: headers,
		redirect: "follow"
	}).then(function(response) {
		return response.json().then(function(result) {
			if (!response.ok) {
				if (result.message) {
					console.log(result.message);
				}
				return null;
			}
			return result;
		});
	});
}

function optionalRequest(path) {
	return request(path).catch(function(error) {
		console.log(error);
		return null;
	});
}

function roomPlayers(room) {
	if (!room) return [];
	const players = [];
	if (typeof room.PLAYER1 === "string" && room.PLAYER1.length > 0) players.push(room.PLAYER1);
	if (typeof room.PLAYER2 === "string" && room.PLAYER2.length > 0) players.push(room.PLAYER2);
	if (typeof room.PLAYER3 === "string" && room.PLAYER3.length > 0) players.push(room.PLAYER3);
	if (typeof room.PLAYER4 === "string" && room.PLAYER4.length > 0) players.push(room.PLAYER4);
	return players;
}

function extractMoves(result) {
	if (!result) return [];
	const data = result.data;
	if (Array.isArray(data)) return data;
	if (data && Array.isArray(data.moves)) return data.moves;
	if (Array.isArray(result.moves)) return result.moves;
	return [];
}

function mergeMoves(moveResult, lastResult) {
	const moves = extractMoves(moveResult).slice();
	let lastMove = null;
	if (lastResult && lastResult.data) {
		if (lastResult.data.play) {
			lastMove = lastResult.data.play;
		} else {
			lastMove = lastResult.data;
		}
	}
	let hasMoveText = false;
	if (lastMove && lastMove.MOSSA) hasMoveText = true;
	if (lastMove && lastMove.mossa) hasMoveText = true;
	if (hasMoveText) {
		let lastId = lastMove.ID;
		if (!lastId) lastId = lastMove.id;
		let alreadyIncluded = false;
		moves.forEach(function(move) {
			let moveId = move.ID;
			if (!moveId) moveId = move.id;
			if (String(moveId) === String(lastId)) alreadyIncluded = true;
		});
		if (!alreadyIncluded) moves.push(lastMove);
	}
	for (let i = 0; i < moves.length; i++) {
		for (let j = 0; j < moves.length - 1; j++) {
			let firstValue = moves[j].ID;
			if (!firstValue) firstValue = moves[j].id;
			let secondValue = moves[j + 1].ID;
			if (!secondValue) secondValue = moves[j + 1].id;
			const firstId = Number(firstValue);
			const secondId = Number(secondValue);

			if (firstId > secondId) {
				const temporaryMove = moves[j];
				moves[j] = moves[j + 1];
				moves[j + 1] = temporaryMove;
			}
		}
	}

	return moves;
}

function parseMove(record) {
	if (!record) return null;
	let raw = record.MOSSA;
	if (!raw) raw = record.mossa;
	if (!raw) raw = record.move;
	if (raw && typeof raw === "object") return raw;
	if (typeof raw !== "string") return null;

	const candidates = [raw];
	try {
		candidates.push(decodeURIComponent(raw));
	} catch (error) {
		console.log(error);
	}
	for (let i = 0; i < candidates.length; i++) {
		try {
			return JSON.parse(candidates[i]);
		} catch (error) {
			continue;
		}
	}
	return null;
}

function uniquePlayers(names) {
	const players = [];
	names.forEach(function(name) {
		if (typeof name !== "string") return;
		if (name.length === 0) return;
		if (players.indexOf(name) !== -1) return;
		if (players.length < 4) players.push(name);
	});
	return players;
}

function displayName(name) {
	const shortName = name.replace(/^domino/i, "");
	if (shortName) return shortName;
	return name;
}

function getRoster(moves, room) {
	let initialRoster = null;
	moves.forEach(function(move) {
		const payload = parseMove(move);
		if (!initialRoster && payload && Array.isArray(payload.players)) {
			initialRoster = payload.players;
		}
	});
	if (initialRoster) return uniquePlayers(initialRoster);

	const fromRoom = roomPlayers(room);
	if (fromRoom.length) return uniquePlayers(fromRoom);

	const fromMoves = [];
	moves.forEach(function(move) {
		let player = move.PLAYER;
		if (!player) player = move.player;
		if (player) fromMoves.push(player);
	});
	if (username && role === "player") fromMoves.unshift(username);
	return uniquePlayers(fromMoves);
}

function makeDeck(players) {
	const deck = [];
	for (let first = 0; first <= 6; first += 1) {
		for (let second = first; second <= 6; second += 1) {
			deck.push([first, second]);
		}
	}

	const seedText = gameId + "|" + players.join("|");
	let seed = 0;
	for (let index = 0; index < seedText.length; index += 1) {
		seed = (seed * 31 + seedText.charCodeAt(index)) >>> 0;
	}
	if (seed === 0) seed = 1;

	const random = function() {
		seed ^= seed << 13;
		seed ^= seed >>> 17;
		seed ^= seed << 5;
		return (seed >>> 0) / 4294967296;
	};

	for (let index = deck.length - 1; index > 0; index -= 1) {
		const target = Math.floor(random() * (index + 1));
		const temporaryTile = deck[index];
		deck[index] = deck[target];
		deck[target] = temporaryTile;
	}
	return deck;
}

function sameTile(first, second) {
	return first && second && first[0] === second[0] && first[1] === second[1];
}

function tileKey(tile) {
	return tile[0] + "-" + tile[1];
}

function canPlace(tile, side, chain) {
	if (!chain.length) return true;
	let end;
	if (side === "left") {
		end = chain[0][0];
	} else {
		end = chain[chain.length - 1][1];
	}
	if (tile[0] === end) return true;
	if (tile[1] === end) return true;
	return false;
}

function legalSides(tile, chain) {
	if (!chain.length) return ["right"];
	const sides = [];
	if (canPlace(tile, "left", chain)) sides.push("left");
	if (canPlace(tile, "right", chain)) sides.push("right");
	return sides;
}

function orientedTile(tile, side, chain) {
	if (!chain.length) return tile.slice();
	let end;
	if (side === "left") {
		end = chain[0][0];
	} else {
		end = chain[chain.length - 1][1];
	}

	if (side === "left") {
		if (tile[1] === end) return tile.slice();
		return [tile[1], tile[0]];
	}

	if (tile[0] === end) return tile.slice();
	return [tile[1], tile[0]];
}

function buildState(moves, players) {
	if (!players.length) {
		return { players: [], hands: {}, stock: [], chain: [], originTile: null, currentIndex: 0, started: false, finished: false, passes: 0 };
	}

	const deck = makeDeck(players);
	const hands = {};
	players.forEach(function(player, index) {
		hands[player] = deck.slice(index * 7, (index + 1) * 7);
	});
	const stock = deck.slice(players.length * 7);
	const chain = [];
	let originTile = null;
	let currentIndex = 0;
	let started = false;
	let finished = false;
	let winner = null;
	let passes = 0;

	for (let moveIndex = 0; moveIndex < moves.length; moveIndex++) {
		const record = moves[moveIndex];
		const move = parseMove(record);
		if (!move) continue;
		if (move.action !== "play" && move.action !== "draw" && move.action !== "pass") continue;
		let player = record.PLAYER;
		if (!player) player = record.player;
		if (player !== players[currentIndex]) continue;

		if (move.action === "draw") {
			const tile = stock.shift();
			if (!tile) continue;
			hands[player].push(tile);
			passes = 0;
			started = true;
			continue;
		}

		if (move.action === "pass") {
			let canPlay = false;
			hands[player].forEach(function(tile) {
				if (legalSides(tile, chain).length > 0) canPlay = true;
			});
			if (stock.length) continue;
			if (canPlay) continue;
			passes += 1;
			currentIndex = (currentIndex + 1) % players.length;
			if (passes >= players.length) {
				finished = true;
				winner = players[0];
				let winnerPoints = 1000;
				players.forEach(function(candidate) {
					let points = 0;
					let candidateHand = hands[candidate];
					if (!candidateHand) candidateHand = [];
					candidateHand.forEach(function(tile) {
						points += tile[0] + tile[1];
					});
					if (points < winnerPoints) {
						winner = candidate;
						winnerPoints = points;
					}
				});
			}
			continue;
		}

		let tile = null;
		if (Array.isArray(move.tile)) {
			tile = [];
			move.tile.forEach(function(value) {
				tile.push(Number(value));
			});
		}
		let side = "right";
		if (move.side === "left") side = "left";
		if (!tile) continue;
		if (tile.length !== 2) continue;
		if (!canPlace(tile, side, chain)) continue;
		let handIndex = -1;
		let playerHand = hands[player];
		if (!playerHand) playerHand = [];
		playerHand.forEach(function(handTile, index) {
			if (sameTile(handTile, tile)) handIndex = index;
		});
		if (handIndex < 0) continue;

		const played = hands[player].splice(handIndex, 1)[0];
		const oriented = orientedTile(played, side, chain);
		if (!chain.length) originTile = oriented.slice();
		if (side === "left" && chain.length) chain.unshift(oriented);
		else chain.push(oriented);
		started = true;
		passes = 0;

		if (hands[player].length === 0) {
			finished = true;
			winner = player;
			continue;
		}
		currentIndex = (currentIndex + 1) % players.length;
	}

	return { players, hands, stock, chain, originTile, currentIndex, started, finished, winner, passes };
}

function createDomino(tile, className) {
	const domino = document.createElement("div");
	domino.className = "Domino";
	if (className) domino.className += " " + className;
	tile.forEach(function(value, index) {
		if (index === 1) {
			const divider = document.createElement("hr");
			divider.className = "linea";
			domino.appendChild(divider);
		}
		const template = document.getElementById("d" + value);
		if (template) domino.appendChild(template.content.cloneNode(true));
	});
	return domino;
}

function showPlayers(state) {
	for (let index = 0; index < 4; index += 1) {
		const player = state.players[index];
		const slotNumber = index + 1;
		const slot = document.getElementById("player-slot-" + slotNumber);
		const playerName = document.getElementById("player-name-" + slotNumber);
		const playerCount = document.getElementById("player-count-" + slotNumber);
		let slotClass = "player-slot";

		if (player && player === state.players[state.currentIndex] && state.started && !state.finished) {
			slotClass += " is-turn";
		}
		if (player === username) slotClass += " is-you";
		slot.className = slotClass;

		if (player) {
			playerName.textContent = displayName(player);
			let tileCount = 7;
			if (state.hands[player]) tileCount = state.hands[player].length;
			playerCount.textContent = tileCount + " tessere";
		} else {
			playerName.textContent = "Posto " + slotNumber + " libero";
			playerCount.textContent = "";
		}
	}
}

function showChain(state) {
	const followTail = (chainElement.scrollHeight - chainElement.scrollTop - chainElement.clientHeight < 20);
	const previousScrollTop = chainElement.scrollTop;
	chainElement.innerHTML = "";
	if (!state.chain.length) {
		const empty = document.createElement("p");
		empty.className = "empty-chain";
		empty.textContent = "La prima tessera apre il tavolo";
		chainElement.appendChild(empty);
		return;
	}
	const availableWidth = Math.max(100, chainElement.clientWidth);
	const rows = [{ tiles: [], width: 0 }];
	state.chain.forEach(function(tile) {
		let vertical = sameTile(tile, state.originTile);
		if (tile[0] === tile[1]) vertical = true;
		let tileWidth = 100;
		if (vertical) tileWidth = 50;
		let row = rows[rows.length - 1];

		if (row.tiles.length && row.width + 3 + tileWidth > availableWidth) {
			rows.push({ tiles: [], width: 0 });
			row = rows[rows.length - 1];
			vertical = true;
			tileWidth = 50;
		}

		row.tiles.push({ tile: tile, vertical: vertical });
		if (row.tiles.length > 1) row.width += 3;
		row.width += tileWidth;
	});

	rows.forEach(function(row, rowIndex) {
		const rowElement = document.createElement("div");
		rowElement.className = "chain-row";
		if (rowIndex % 2) rowElement.className += " is-reversed";
		row.tiles.forEach(function(rowTile) {
			let displayTile = rowTile.tile;
			if (rowIndex % 2) displayTile = rowTile.tile.slice().reverse();
			let orientation = "";
			if (rowTile.vertical) orientation = " vertical-domino";
			rowElement.appendChild(createDomino(displayTile, "board-domino" + orientation));
		});
		chainElement.appendChild(rowElement);
	});
	if (followTail) {
		chainElement.scrollTop = chainElement.scrollHeight;
	} else {
		chainElement.scrollTop = previousScrollTop;
	}
}

function showHand(state, myTurn) {
	handElement.innerHTML = "";
	let hand = state.hands[username];
	if (!hand) hand = [];
	hand.forEach(function(tile) {
		const key = tileKey(tile);
		const button = document.createElement("button");
		button.type = "button";
		button.className = "hand-tile";
		button.disabled = !myTurn;
		if (legalSides(tile, state.chain).length === 0) button.disabled = true;
		button.setAttribute("aria-label", "Tessera " + tile[0] + " e " + tile[1]);
		if (key === selectedTileKey) button.classList.add("is-selected");
		button.appendChild(createDomino(tile));
		button.addEventListener("click", function() {
			selectedTileKey = key;
			showGame(state);
		});
		handElement.appendChild(button);
	});
}

function showGame(state) {
	gameState = state;
	showPlayers(state);
	showChain(state);

	let enoughPlayers = false;
	if (state.started) enoughPlayers = true;
	if (state.players.length >= 2) enoughPlayers = true;
	const myTurn = (!isSpectator && !state.finished && enoughPlayers &&
		state.players[state.currentIndex] === username);
	const waitingForPlayers = (!state.started && state.players.length < 2);
	let hand = state.hands[username];
	if (!hand) hand = [];
	let selectedTile = null;
	hand.forEach(function(tile) {
		if (tileKey(tile) === selectedTileKey) selectedTile = tile;
	});
	let selectedSides = [];
	if (selectedTile) selectedSides = legalSides(selectedTile, state.chain);
	let hasLegalTile = false;
	hand.forEach(function(tile) {
		if (legalSides(tile, state.chain).length > 0) hasLegalTile = true;
	});

	showHand(state, myTurn);
	leftButton.disabled = isSending;
	if (!myTurn) leftButton.disabled = true;
	if (selectedSides.indexOf("left") === -1) leftButton.disabled = true;
	rightButton.disabled = isSending;
	if (!myTurn) rightButton.disabled = true;
	if (selectedSides.indexOf("right") === -1) rightButton.disabled = true;
	leftButton.hidden = isSpectator;
	if (!state.chain.length) leftButton.hidden = true;
	if (state.chain.length) {
		rightButton.textContent = "Piazza a destra";
	} else {
		rightButton.textContent = "Apri il tavolo";
	}
	rightButton.hidden = isSpectator;
	drawButton.hidden = isSpectator;
	if (!myTurn) drawButton.hidden = true;
	if (hasLegalTile) drawButton.hidden = true;
	if (state.stock.length === 0) drawButton.hidden = true;
	drawButton.disabled = isSending;
	if (!myTurn) drawButton.disabled = true;
	passButton.hidden = isSpectator;
	if (!myTurn) passButton.hidden = true;
	if (hasLegalTile) passButton.hidden = true;
	if (state.stock.length > 0) passButton.hidden = true;
	passButton.disabled = isSending;
	if (!myTurn) passButton.disabled = true;

	spectatorElement.hidden = !isSpectator;
	if (isSpectator) {
		if (state.finished) {
			spectatorElement.textContent = "Partita terminata. Stavi guardando come spettatore.";
		} else {
			spectatorElement.textContent = "Sei spettatore: la partita è in corso. Puoi seguirla, ma non fare mosse.";
		}
	}

	if (state.finished) {
		if (state.winner) {
			statusElement.textContent = "Partita terminata. Vince " + displayName(state.winner) + ".";
		} else {
			statusElement.textContent = "Partita terminata.";
		}
	} else if (waitingForPlayers) {
		statusElement.textContent = "In attesa di almeno un altro giocatore.";
	} else if (myTurn) {
		if (hasLegalTile) {
			statusElement.textContent = "È il tuo turno: seleziona una tessera.";
		} else if (state.stock.length > 0) {
			statusElement.textContent = "È il tuo turno: pesca una tessera.";
		} else {
			statusElement.textContent = "È il tuo turno: passa.";
		}
	} else if (state.players.length) {
		statusElement.textContent = "Turno di " + displayName(state.players[state.currentIndex]) + ".";
	} else {
		statusElement.textContent = "In attesa dei giocatori...";
	}
}

function updateRole(nextRole) {
	role = nextRole;
	isSpectator = (nextRole === "spectator");
	params.set("role", nextRole);
	const query = params.toString();
	window.history.replaceState(null, "", window.location.pathname + "?" + query);
}

function resolveJoin(moves, room, finishedJoin) {
	if (role !== "join") {
		finishedJoin();
		return;
	}

	const players = getRoster(moves, room);
	if (moves.length > 0) {
		if (players.indexOf(username) !== -1) updateRole("player");
		else updateRole("spectator");
		finishedJoin();
		return;
	}

	if (players.indexOf(username) !== -1) {
		updateRole("player");
		finishedJoin();
		return;
	}

	if (!room) {
		updateRole("spectator");
		finishedJoin();
		return;
	}
	if (roomPlayers(room).length >= 4) {
		updateRole("spectator");
		finishedJoin();
		return;
	}

	optionalRequest("/mosse/" + gameId)
		.then(function(latestResult) {
			if (extractMoves(latestResult).length > 0) {
				updateRole("spectator");
				finishedJoin();
				return;
			}

			request("/join/" + gameId + "/" + username, "POST")
				.then(function(joinResult) {
					if (!joinResult) {
						updateRole("spectator");
						finishedJoin();
						return;
					}

					if (joinResult && joinResult.data && joinResult.data.id &&
						String(joinResult.data.id) !== String(gameId)) {
						console.log("Il server ha restituito un ID partita diverso.");
						updateRole("spectator");
						finishedJoin();
						return;
					}

					roomSnapshot = {};
					roomSnapshot.ID = room.ID;
					roomSnapshot.PLAYER1 = room.PLAYER1;
					roomSnapshot.PLAYER2 = room.PLAYER2;
					roomSnapshot.PLAYER3 = room.PLAYER3;
					roomSnapshot.PLAYER4 = room.PLAYER4;

					const openSlots = ["PLAYER1", "PLAYER2", "PLAYER3", "PLAYER4"];
					for (let i = 0; i < openSlots.length; i++) {
						if (!roomSnapshot[openSlots[i]]) {
							roomSnapshot[openSlots[i]] = username;
							break;
						}
					}
					updateRole("player");
					finishedJoin();
				})
				.catch(function(error) {
					console.log(error);
					updateRole("spectator");
					finishedJoin();
				});
		})
		.catch(function(error) {
			console.log(error);
			finishedJoin();
		});
}

function loadRooms(paths, index, rooms, done) {
	if (index >= paths.length) {
		done(rooms);
		return;
	}

	optionalRequest(paths[index]).then(function(result) {
		const foundRooms = extractMoves(result);
		foundRooms.forEach(function(room) {
			rooms.push(room);
		});
		loadRooms(paths, index + 1, rooms, done);
	});
}

function finishSync(moves, rooms) {
	let matchingRoom = null;
	rooms.forEach(function(room) {
		let roomId = room.ID;
		if (!roomId) roomId = room.id;
		if (String(roomId) !== String(gameId)) return;
		if (!matchingRoom) {
			matchingRoom = room;
		} else if (roomPlayers(room).length >= roomPlayers(matchingRoom).length) {
			matchingRoom = room;
		}
	});
	if (matchingRoom) roomSnapshot = matchingRoom;

	resolveJoin(moves, roomSnapshot, function() {
		const players = getRoster(moves, roomSnapshot);
		if (!isSpectator && username && players.indexOf(username) === -1 && players.length < 4) {
			players.push(username);
		}
		showGame(buildState(moves, players));
		isSyncing = false;
	});
}

function syncGame() {
	if (isSyncing) return;
	if (!gameId) return;
	isSyncing = true;

	optionalRequest("/mosse/" + gameId)
		.then(function(moveResult) {
			return optionalRequest("/mossa/" + gameId).then(function(lastResult) {
				return { moveResult: moveResult, lastResult: lastResult };
			});
		})
		.then(function(results) {
			const moves = mergeMoves(results.moveResult, results.lastResult);
			const paths = [];
			let gameHasNotStarted = true;
			if (gameState && gameState.started) gameHasNotStarted = false;
			if (gameHasNotStarted && role !== "spectator") {
				paths.push("/partita");
				paths.push("/partitaN/2");
				paths.push("/partitaN/3");
				paths.push("/partitaN/4");
			}

			loadRooms(paths, 0, [], function(rooms) {
				if (!results.moveResult && !results.lastResult && rooms.length === 0) {
					console.log("Impossibile leggere lo stato della partita.");
					messageElement.textContent = "Connessione alla partita interrotta.";
					if (!gameState) statusElement.textContent = "Impossibile caricare la partita.";
					isSyncing = false;
					return;
				}
				finishSync(moves, rooms);
			});
		})
		.catch(function(error) {
			console.log(error);
			messageElement.textContent = "Connessione alla partita interrotta.";
			if (!gameState) statusElement.textContent = "Impossibile caricare la partita.";
			isSyncing = false;
		});
}

function hasLegalTile(hand, chain) {
	let hasTile = false;
	hand.forEach(function(tile) {
		if (legalSides(tile, chain).length > 0) hasTile = true;
	});
	return hasTile;
}

function sendMove(move) {
	if (!gameState) return;
	if (isSpectator) return;
	if (isSending) return;
	if (gameState.finished) return;
	if (gameState.players[gameState.currentIndex] !== username) return;

	isSending = true;
	showGame(gameState);

	const payload = {
		action: move.action,
		tile: move.tile,
		side: move.side,
		players: gameState.players
	};
	const moveText = encodeURIComponent(JSON.stringify(payload));
	const path = "/mossa/" + encodeURIComponent(gameId) + "/" +
		encodeURIComponent(username) + "/" + moveText;

	request(path, "POST")
		.then(function(result) {
			if (!result) {
				messageElement.textContent = "Mossa rifiutata dal server.";
			} else {
				messageElement.textContent = "";
				selectedTileKey = null;
				syncGame();
			}
			isSending = false;
			if (gameState) showGame(gameState);
		})
		.catch(function(error) {
			console.log(error);
			messageElement.textContent = "Mossa rifiutata dal server.";
			isSending = false;
			if (gameState) showGame(gameState);
		});
}

function playSelected(side) {
	if (!gameState) return;
	if (!selectedTileKey) return;
	let tile = null;
	let hand = gameState.hands[username];
	if (!hand) hand = [];
	hand.forEach(function(item) {
		if (tileKey(item) === selectedTileKey) tile = item;
	});
	if (!tile) return;
	if (!canPlace(tile, side, gameState.chain)) return;
	sendMove({ action: "play", tile, side });
}

function drawTile() {
	if (!gameState) return;
	let hand = gameState.hands[username];
	if (!hand) hand = [];
	if (gameState.stock.length > 0 &&
		!hasLegalTile(hand, gameState.chain)) {
		sendMove({ action: "draw" });
	}
}

function passTurn() {
	if (!gameState) return;
	let hand = gameState.hands[username];
	if (!hand) hand = [];
	if (gameState.stock.length === 0 &&
		!hasLegalTile(hand, gameState.chain)) {
		sendMove({ action: "pass" });
	}
}

if (!gameId) {
	statusElement.textContent = "ID partita o nome giocatore mancante. Rientra dal menu.";
} else if (!username) {
	statusElement.textContent = "ID partita o nome giocatore mancante. Rientra dal menu.";
} else {
	syncGame();
	window.setInterval(syncGame, 1800);
}

window.addEventListener("resize", function() {
	if (gameState) showChain(gameState);
});