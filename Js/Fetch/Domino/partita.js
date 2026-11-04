const API_BASE = "https://classe5ID.altervista.org/games";
const headers = new Headers();
headers.append("Authorization", "Basic NElCOkNSSVBQQQ==");

const params = new URLSearchParams(window.location.search);
const gameId = params.get("id");
const username = params.get("nome") || "";
let role = params.get("role") || "spectator";
let isSpectator = role === "spectator";
let isSending = false;
let isSyncing = false;
let roomSnapshot = null;
let gameState = null;
let selectedTileKey = null;

const statusElement = document.getElementById("game-status");
const messageElement = document.getElementById("game-message");
const playersList = document.getElementById("players-list");
const chainElement = document.getElementById("chain");
const handElement = document.getElementById("hand");
const spectatorElement = document.getElementById("spectator-status");
const leftButton = document.getElementById("play-left");
const rightButton = document.getElementById("play-right");
const drawButton = document.getElementById("draw-tile");
const passButton = document.getElementById("pass-turn");

document.getElementById("valore-id").textContent = gameId || "Non disponibile";
leftButton.addEventListener("click", () => playSelected("left"));
rightButton.addEventListener("click", () => playSelected("right"));
drawButton.addEventListener("click", drawTile);
passButton.addEventListener("click", passTurn);

async function request(path, method = "GET") {
	const response = await fetch(`${API_BASE}${path}`, {
		method,
		headers,
		redirect: "follow"
	});
	let result;
	try {
		result = await response.json();
	} catch {
		throw new Error("Risposta non valida dal server.");
	}
	if (!response.ok) {
		throw new Error(result.message || `Errore HTTP ${response.status}`);
	}
	return result;
}

async function optionalRequest(path) {
	try {
		return await request(path);
	} catch {
		return null;
	}
}

function roomPlayers(room) {
	if (!room) return [];
	return [room.PLAYER1, room.PLAYER2, room.PLAYER3, room.PLAYER4]
		.filter((name) => typeof name === "string" && name.length > 0);
}

function extractMoves(result) {
	const data = result?.data;
	if (Array.isArray(data)) return data;
	if (Array.isArray(data?.moves)) return data.moves;
	if (Array.isArray(result?.moves)) return result.moves;
	return [];
}

function mergeMoves(moveResult, lastResult) {
	const moves = [...extractMoves(moveResult)];
	const lastMove = lastResult?.data?.play ?? lastResult?.data;
	if (lastMove && (lastMove.MOSSA || lastMove.mossa)) {
		const lastId = lastMove.ID ?? lastMove.id;
		const alreadyIncluded = moves.some((move) =>
			String(move.ID ?? move.id) === String(lastId)
		);
		if (!alreadyIncluded) moves.push(lastMove);
	}
	return moves.sort((first, second) => {
		const firstId = Number(first.ID ?? first.id);
		const secondId = Number(second.ID ?? second.id);
		if (Number.isFinite(firstId) && Number.isFinite(secondId)) return firstId - secondId;
		return 0;
	});
}

function parseMove(record) {
	const raw = record.MOSSA ?? record.mossa ?? record.move;
	if (raw && typeof raw === "object") return raw;
	if (typeof raw !== "string") return null;

	const candidates = [raw];
	try {
		candidates.push(decodeURIComponent(raw));
	} catch {
		// Keep the original value when it is not URI-encoded.
	}
	for (const candidate of candidates) {
		try {
			return JSON.parse(candidate);
		} catch {
			continue;
		}
	}
	return null;
}

function uniquePlayers(names) {
	return [...new Set(names.filter((name) => typeof name === "string" && name.length > 0))]
		.slice(0, 4);
}

function displayName(name) {
	return name.replace(/^domino/i, "") || name;
}

function getRoster(moves, room) {
	const decoded = moves.map((move) => ({ move, payload: parseMove(move) }));
	const initialRoster = decoded.find(({ payload }) => Array.isArray(payload?.players))?.payload.players;
	if (initialRoster) return uniquePlayers(initialRoster);

	const fromRoom = roomPlayers(room);
	if (fromRoom.length) return uniquePlayers(fromRoom);

	const fromMoves = moves.map((move) => move.PLAYER ?? move.player).filter(Boolean);
	if (username && role === "player") fromMoves.unshift(username);
	return uniquePlayers(fromMoves);
}

function hashSeed(value) {
	let seed = 2166136261;
	for (let index = 0; index < value.length; index += 1) {
		seed ^= value.charCodeAt(index);
		seed = Math.imul(seed, 16777619);
	}
	return seed >>> 0 || 1;
}

function makeDeck(players) {
	const deck = [];
	for (let first = 0; first <= 6; first += 1) {
		for (let second = first; second <= 6; second += 1) {
			deck.push([first, second]);
		}
	}

	let seed = hashSeed(`${gameId}|${players.join("|")}`);
	const random = () => {
		seed ^= seed << 13;
		seed ^= seed >>> 17;
		seed ^= seed << 5;
		return (seed >>> 0) / 4294967296;
	};

	for (let index = deck.length - 1; index > 0; index -= 1) {
		const target = Math.floor(random() * (index + 1));
		[deck[index], deck[target]] = [deck[target], deck[index]];
	}
	return deck;
}

function sameTile(first, second) {
	return first && second && first[0] === second[0] && first[1] === second[1];
}

function tileKey(tile) {
	return `${tile[0]}-${tile[1]}`;
}

function canPlace(tile, side, chain) {
	if (!chain.length) return true;
	const end = side === "left" ? chain[0][0] : chain[chain.length - 1][1];
	return tile[0] === end || tile[1] === end;
}

function legalSides(tile, chain) {
	if (!chain.length) return ["right"];
	return ["left", "right"].filter((side) => canPlace(tile, side, chain));
}

function orientedTile(tile, side, chain) {
	if (!chain.length) return [...tile];
	const end = side === "left" ? chain[0][0] : chain[chain.length - 1][1];
	if (side === "left") return tile[1] === end ? [...tile] : [tile[1], tile[0]];
	return tile[0] === end ? [...tile] : [tile[1], tile[0]];
}

function buildState(moves, players) {
	if (!players.length) {
		return { players: [], hands: {}, stock: [], chain: [], originTile: null, currentIndex: 0, started: false, finished: false, passes: 0 };
	}

	const deck = makeDeck(players);
	const hands = {};
	players.forEach((player, index) => {
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

	for (const record of moves) {
		const move = parseMove(record);
		if (!move || !["play", "draw", "pass"].includes(move.action)) continue;
		const player = record.PLAYER ?? record.player;
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
			if (stock.length || hands[player].some((tile) => legalSides(tile, chain).length > 0)) continue;
			passes += 1;
			currentIndex = (currentIndex + 1) % players.length;
			if (passes >= players.length) {
				finished = true;
				winner = players.reduce((best, candidate) => {
					const points = (hands[candidate] || []).reduce((sum, tile) => sum + tile[0] + tile[1], 0);
					const bestPoints = (hands[best] || []).reduce((sum, tile) => sum + tile[0] + tile[1], 0);
					return points < bestPoints ? candidate : best;
				}, players[0]);
			}
			continue;
		}

		const tile = Array.isArray(move.tile) ? move.tile.map(Number) : null;
		const side = move.side === "left" ? "left" : "right";
		if (!tile || tile.length !== 2 || !canPlace(tile, side, chain)) continue;
		const handIndex = (hands[player] || []).findIndex((handTile) => sameTile(handTile, tile));
		if (handIndex < 0) continue;

		const [played] = hands[player].splice(handIndex, 1);
		const oriented = orientedTile(played, side, chain);
		if (!chain.length) originTile = [...oriented];
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

function createDomino(tile, className = "") {
	const domino = document.createElement("div");
	domino.className = `Domino ${className}`.trim();
	tile.forEach((value, index) => {
		if (index === 1) {
			const divider = document.createElement("hr");
			divider.className = "linea";
			domino.append(divider);
		}
		const template = document.getElementById(`d${value}`);
		if (template) domino.append(template.content.cloneNode(true));
	});
	return domino;
}

function showPlayers(state) {
	playersList.replaceChildren();
	for (let index = 0; index < 4; index += 1) {
		const player = state.players[index];
		const item = document.createElement("li");
		item.className = "player-slot";
		if (player && player === state.players[state.currentIndex] && state.started && !state.finished) {
			item.classList.add("is-turn");
		}
		if (player === username) item.classList.add("is-you");
		const name = document.createElement("strong");
		name.textContent = player ? displayName(player) : `Posto ${index + 1} libero`;
		item.append(name);
		if (player) {
			const count = document.createElement("span");
			count.textContent = `${state.hands[player]?.length ?? 7} tessere`;
			item.append(count);
		}
		playersList.append(item);
	}
}

function renderChain(state) {
	const followTail = chainElement.scrollHeight - chainElement.scrollTop - chainElement.clientHeight < 20;
	const previousScrollTop = chainElement.scrollTop;
	chainElement.replaceChildren();
	if (!state.chain.length) {
		const empty = document.createElement("p");
		empty.className = "empty-chain";
		empty.textContent = "La prima tessera apre il tavolo";
		chainElement.append(empty);
		return;
	}
	const availableWidth = Math.max(100, chainElement.clientWidth);
	const rows = [{ tiles: [], width: 0 }];
	state.chain.forEach((tile, index) => {
		let vertical = sameTile(tile, state.originTile) || tile[0] === tile[1];
		let tileWidth = vertical ? 50 : 100;
		let row = rows[rows.length - 1];

		if (row.tiles.length && row.width + 3 + tileWidth > availableWidth) {
			rows.push({ tiles: [], width: 0 });
			row = rows[rows.length - 1];
			vertical = true;
			tileWidth = 50;
		}

		row.tiles.push({ tile, vertical });
		row.width += (row.tiles.length > 1 ? 3 : 0) + tileWidth;
	});

	rows.forEach((row, rowIndex) => {
		const rowElement = document.createElement("div");
		rowElement.className = `chain-row${rowIndex % 2 ? " is-reversed" : ""}`;
		row.tiles.forEach(({ tile, vertical }) => {
			const displayTile = rowIndex % 2 ? [...tile].reverse() : tile;
			const orientation = vertical ? " vertical-domino" : "";
			rowElement.append(createDomino(displayTile, `board-domino${orientation}`));
		});
		chainElement.append(rowElement);
	});
	chainElement.scrollTop = followTail ? chainElement.scrollHeight : previousScrollTop;
}

function renderHand(state, myTurn) {
	handElement.replaceChildren();
	const hand = state.hands[username] || [];
	hand.forEach((tile) => {
		const key = tileKey(tile);
		const button = document.createElement("button");
		button.type = "button";
		button.className = "hand-tile";
		button.disabled = !myTurn || legalSides(tile, state.chain).length === 0;
		button.setAttribute("aria-label", `Tessera ${tile[0]} e ${tile[1]}`);
		if (key === selectedTileKey) button.classList.add("is-selected");
		button.append(createDomino(tile));
		button.addEventListener("click", () => {
			selectedTileKey = key;
			render(state);
		});
		handElement.append(button);
	});
}

function render(state) {
	gameState = state;
	showPlayers(state);
	renderChain(state);

	const myTurn = !isSpectator && !state.finished && (state.started || state.players.length >= 2) &&
		state.players[state.currentIndex] === username;
	const waitingForPlayers = !state.started && state.players.length < 2;
	const hand = state.hands[username] || [];
	const selectedTile = hand.find((tile) => tileKey(tile) === selectedTileKey);
	const selectedSides = selectedTile ? legalSides(selectedTile, state.chain) : [];
	const hasLegalTile = hand.some((tile) => legalSides(tile, state.chain).length > 0);

	renderHand(state, myTurn);
	leftButton.disabled = isSending || !myTurn || !selectedSides.includes("left");
	rightButton.disabled = isSending || !myTurn || !selectedSides.includes("right");
	leftButton.hidden = isSpectator || !state.chain.length;
	rightButton.textContent = state.chain.length ? "Piazza a destra" : "Apri il tavolo";
	rightButton.hidden = isSpectator;
	drawButton.hidden = isSpectator || !myTurn || hasLegalTile || state.stock.length === 0;
	drawButton.disabled = isSending || !myTurn;
	passButton.hidden = isSpectator || !myTurn || hasLegalTile || state.stock.length > 0;
	passButton.disabled = isSending || !myTurn;

	spectatorElement.hidden = !isSpectator;
	if (isSpectator) {
		spectatorElement.textContent = state.finished
			? "Partita terminata. Stavi guardando come spettatore."
			: "Sei spettatore: la partita è in corso. Puoi seguirla, ma non fare mosse.";
	}

	if (state.finished) {
		statusElement.textContent = state.winner ? `Partita terminata. Vince ${displayName(state.winner)}.` : "Partita terminata.";
	} else if (waitingForPlayers) {
		statusElement.textContent = "In attesa di almeno un altro giocatore.";
	} else if (myTurn) {
		statusElement.textContent = hasLegalTile ? "È il tuo turno: seleziona una tessera." :
			state.stock.length ? "È il tuo turno: pesca una tessera." : "È il tuo turno: passa.";
	} else if (state.players.length) {
		statusElement.textContent = `Turno di ${displayName(state.players[state.currentIndex])}.`;
	} else {
		statusElement.textContent = "In attesa dei giocatori...";
	}
}

function updateRole(nextRole) {
	role = nextRole;
	isSpectator = nextRole === "spectator";
	params.set("role", nextRole);
	const query = params.toString();
	window.history.replaceState(null, "", `${window.location.pathname}?${query}`);
}

async function resolveJoin(moves, room) {
	if (role !== "join") return;

	const players = getRoster(moves, room);
	if (moves.length > 0) {
		updateRole(players.includes(username) ? "player" : "spectator");
		return;
	}

	if (players.includes(username)) {
		updateRole("player");
		return;
	}

	if (!room || roomPlayers(room).length >= 4) {
		updateRole("spectator");
		return;
	}

	const latestResult = await optionalRequest(`/mosse/${encodeURIComponent(gameId)}`);
	if (extractMoves(latestResult).length > 0) {
		updateRole("spectator");
		return;
	}

	const joinResult = await request(
		`/join/${encodeURIComponent(gameId)}/${encodeURIComponent(username)}`,
		"POST"
	);
	if (joinResult.data?.id && String(joinResult.data.id) !== String(gameId)) {
		throw new Error("Il server ha restituito un ID partita diverso.");
	}
	roomSnapshot = { ...room };
	const openSlot = ["PLAYER1", "PLAYER2", "PLAYER3", "PLAYER4"]
		.find((slot) => !roomSnapshot[slot]);
	if (openSlot) roomSnapshot[openSlot] = username;
	updateRole("player");
}

async function syncGame() {
	if (isSyncing || !gameId) return;
	isSyncing = true;
	try {
		const previousPlayers = gameState?.players ?? [];
		const shouldFetchRooms = !gameState?.started && role !== "spectator";
		const roomPaths = shouldFetchRooms
			? ["/partita", "/partitaN/2", "/partitaN/3", "/partitaN/4"]
			: [];
		const [moveResult, lastResult, ...roomResults] = await Promise.all([
			optionalRequest(`/mosse/${encodeURIComponent(gameId)}`),
			optionalRequest(`/mossa/${encodeURIComponent(gameId)}`),
			...roomPaths.map((path) => optionalRequest(path))
		]);
		const roomResultsAvailable = roomResults.filter(Boolean);
		if (!moveResult && !lastResult && !roomResultsAvailable.length) {
			throw new Error("Impossibile leggere lo stato della partita.");
		}
		const moves = mergeMoves(moveResult, lastResult);
		const rooms = roomResultsAvailable.flatMap(extractMoves);
		const matchingRooms = rooms.filter((room) =>
			String(room.ID ?? room.id) === String(gameId)
		);
		const matchingRoom = matchingRooms.reduce((best, room) =>
			!best || roomPlayers(room).length >= roomPlayers(best).length ? room : best, null
		);
		if (matchingRoom) roomSnapshot = matchingRoom;

		await resolveJoin(moves, roomSnapshot);
		const players = getRoster(moves, roomSnapshot);
		if (!isSpectator && username && !players.includes(username) && players.length < 4) {
			players.push(username);
		}
		const joinedPlayers = players.filter((player) => !previousPlayers.includes(player));
		if (previousPlayers.length && joinedPlayers.length) {
			messageElement.textContent = `${joinedPlayers.map(displayName).join(", ")} è entrato nella partita.`;
		}
		render(buildState(moves, players));
	} catch (error) {
		messageElement.textContent = error.message || "Connessione alla partita interrotta.";
		if (!gameState) statusElement.textContent = "Impossibile caricare la partita.";
	} finally {
		isSyncing = false;
	}
}

async function sendMove(move) {
	if (!gameState || isSpectator || isSending || gameState.finished) return;
	if (gameState.players[gameState.currentIndex] !== username) return;

	isSending = true;
	render(gameState);
	try {
		const [moveResult, lastResult] = await Promise.all([
			optionalRequest(`/mosse/${encodeURIComponent(gameId)}`),
			optionalRequest(`/mossa/${encodeURIComponent(gameId)}`)
		]);
		const latestMoves = mergeMoves(moveResult, lastResult);
		const latestPlayers = getRoster(latestMoves, roomSnapshot);
		if (!isSpectator && username && !latestPlayers.includes(username) && latestPlayers.length < 4) {
			latestPlayers.push(username);
		}
		const latestState = buildState(latestMoves, latestPlayers);
		if (latestState.players[latestState.currentIndex] !== username || latestState.finished) {
			gameState = latestState;
			throw new Error("Il turno è cambiato: attendi il tuo turno.");
		}

		if (move.action === "play") {
			const tile = (latestState.hands[username] || []).find((item) => sameTile(item, move.tile));
			if (!tile || !canPlace(tile, move.side, latestState.chain)) {
				gameState = latestState;
				throw new Error("La tessera non è più giocabile su questo lato.");
			}
		} else if (move.action === "draw") {
			if (!latestState.stock.length || (latestState.hands[username] || []).some((tile) => legalSides(tile, latestState.chain).length)) {
				gameState = latestState;
				throw new Error("Non puoi pescare adesso.");
			}
		} else if (move.action === "pass") {
			if (latestState.stock.length || (latestState.hands[username] || []).some((tile) => legalSides(tile, latestState.chain).length)) {
				gameState = latestState;
				throw new Error("Non puoi passare: hai ancora una mossa disponibile.");
			}
		}

		gameState = latestState;
		const payload = {
			version: 1,
			...move,
			players: latestState.players
		};
		const encodedMove = encodeURIComponent(JSON.stringify(payload));
		await request(
			`/mossa/${encodeURIComponent(gameId)}/${encodeURIComponent(username)}/${encodedMove}`,
			"POST"
		);
		messageElement.textContent = "";
		selectedTileKey = null;
		await syncGame();
	} catch (error) {
		messageElement.textContent = error.message || "Mossa rifiutata dal server.";
	} finally {
		isSending = false;
		if (gameState) render(gameState);
	}
}

function playSelected(side) {
	if (!gameState || !selectedTileKey) return;
	const tile = (gameState.hands[username] || []).find((item) => tileKey(item) === selectedTileKey);
	if (!tile || !canPlace(tile, side, gameState.chain)) return;
	sendMove({ action: "play", tile, side });
}

function drawTile() {
	if (gameState?.stock.length && !(gameState.hands[username] || []).some((tile) => legalSides(tile, gameState.chain).length)) {
		sendMove({ action: "draw" });
	}
}

function passTurn() {
	if (gameState && gameState.stock.length === 0 && !(gameState.hands[username] || []).some((tile) => legalSides(tile, gameState.chain).length)) {
		sendMove({ action: "pass" });
	}
}

if (!gameId || !username) {
	statusElement.textContent = "ID partita o nome giocatore mancante. Rientra dal menu.";
} else {
	syncGame();
	window.setInterval(syncGame, 1800);
}

window.addEventListener("resize", () => {
	if (gameState) renderChain(gameState);
});