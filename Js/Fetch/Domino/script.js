const headers = new Headers();
headers.append("Authorization", "Basic NElCOkNSSVBQQQ==");

const requestOptionsPost = {
  method: "POST",
  headers,
  redirect: "follow"
};

const requestOptionsGet = {
  method: "GET",
  headers,
  redirect: "follow"
};

const usernameInput = document.getElementById("username");
const gameIdInput = document.getElementById("id");
const message = document.getElementById("messaggio");
const buttons = [document.getElementById("gioca"), document.getElementById("join")];

function setBusy(isBusy) {
  buttons.forEach((button) => {
    button.disabled = isBusy;
  });
  message.textContent = isBusy ? "Connessione..." : "";
}

function getUsername() {
  const name = usernameInput.value.trim();
  if (!name) {
    message.textContent = "Inserisci il tuo nome.";
    usernameInput.focus();
    return null;
  }
  return `domino${name}`;
}

async function readResponse(response) {
  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error("Il server ha restituito una risposta non valida.");
  }
  if (!response.ok) {
    throw new Error(result.message || `Errore HTTP ${response.status}`);
  }
  return result;
}

function openGame(gameId, username, role) {
  const params = new URLSearchParams({ id: gameId, nome: username, role });
  window.location.href = `partita.html?${params}`;
}

function playerCount(game) {
  return [game.PLAYER1, game.PLAYER2, game.PLAYER3, game.PLAYER4]
    .filter((player) => typeof player === "string" && player.length > 0).length;
}

async function iniziaGioco() {
  const username = getUsername();
  if (!username) return;

  setBusy(true);
  try {
    const url = `https://classe5ID.altervista.org/games/partita/${encodeURIComponent(username)}`;
    const result = await readResponse(await fetch(url, requestOptionsPost));
    const gameId = result.data?.id ?? result.data?.ID;
    if (gameId === undefined || gameId === null) {
      throw new Error("Il server non ha restituito l'ID della partita.");
    }
    openGame(gameId, username, "player");
  } catch (error) {
    message.textContent = error.message || "Impossibile creare la partita.";
  } finally {
    setBusy(false);
  }
}

async function joinGioco() {
  const username = getUsername();
  if (!username) return;

  setBusy(true);
  try {
    let gameId = gameIdInput.value.trim();
    if (!gameId) {
      const endpoints = ["partita", "partitaN/2", "partitaN/3", "partitaN/4"];
      const responses = await Promise.all(endpoints.map(async (endpoint) => {
        try {
          return await readResponse(
            await fetch(`https://classe5ID.altervista.org/games/${endpoint}`, requestOptionsGet)
          );
        } catch {
          return null;
        }
      }));

      if (responses.every((response) => response === null)) {
        throw new Error("Impossibile cercare partite disponibili.");
      }

      const roomsById = new Map();
      responses.flatMap((response) => Array.isArray(response?.data) ? response.data : [])
        .forEach((room) => {
          const roomId = room.ID ?? room.id;
          if (!roomId || !room.PLAYER1?.startsWith("domino") || playerCount(room) >= 4) return;
          const current = roomsById.get(String(roomId));
          if (!current || playerCount(room) > playerCount(current)) {
            roomsById.set(String(roomId), room);
          }
        });

      const room = [...roomsById.values()]
        .sort((first, second) => playerCount(second) - playerCount(first))[0];

      if (room) {
        gameId = room.ID ?? room.id;
      } else {
        const url = `https://classe5ID.altervista.org/games/partita/${encodeURIComponent(username)}`;
        const created = await readResponse(await fetch(url, requestOptionsPost));
        gameId = created.data?.id ?? created.data?.ID;
        if (gameId === undefined || gameId === null) {
          throw new Error("Il server non ha restituito l'ID della partita.");
        }
        openGame(gameId, username, "player");
        return;
      }
    }

    if (gameId === undefined || gameId === null || gameId === "") {
      throw new Error("Inserisci un ID valido.");
    }
    openGame(gameId, username, "join");
  } catch (error) {
    message.textContent = error.message || "Impossibile raggiungere il server.";
  } finally {
    setBusy(false);
  }
}