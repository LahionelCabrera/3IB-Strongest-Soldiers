const headers = new Headers();
headers.append("Authorization", "Basic NElCOkNSSVBQQQ==");

const requestOptionsPost = {
  method: "POST",
  headers: headers
};

const requestOptionsGet = {
  method: "GET",
  headers: headers
};

const usernameInput = document.getElementById("username");
const gameIdInput = document.getElementById("id");
const message = document.getElementById("messaggio");
const playButton = document.getElementById("gioca");
const joinButton = document.getElementById("join");

function setBusy(isBusy) {
  playButton.disabled = isBusy;
  joinButton.disabled = isBusy;

  if (isBusy) {
    message.textContent = "Connessione...";
  } else if (message.textContent === "Connessione...") {
    message.textContent = "";
  }
}

function getUsername() {
  const name = usernameInput.value.trim();

  if (name === "") {
    message.textContent = "Inserisci il tuo nome.";
    return "";
  }

  return "domino" + name;
}

function readResponse(response) {
  return response.json().then(function(result) {
    if (!response.ok) {
      if (result.message) {
        console.log(result.message);
      } else {
        console.log("Errore del server: " + response.status);
      }
    }

    return result;
  });
}

function openGame(gameId, username, role) { //questo apre la pagina con le robe
  const paginaPartita = "partita.html?id=" + gameId + "&nome=" + username + "&role=" + role;
  window.location.href = paginaPartita;
}

function playerCount(game) {
  let count = 0;

  if (game.PLAYER1) count++;
  if (game.PLAYER2) count++;
  if (game.PLAYER3) count++;
  if (game.PLAYER4) count++;

  return count;
}

function createGame(username) { // questo crea effettivamente la partita e returna id
  const indirizzo = "https://classe5ID.altervista.org/games/partita/" + username;

  return fetch(indirizzo, requestOptionsPost)
    .then(readResponse)
    .then(function(result) {
      let gameId = "";

      if (result.data) {
        if (result.data.id) {
          gameId = result.data.id;
        } else if (result.data.ID) {
          gameId = result.data.ID;
        }
      }

      if (gameId === "") {
        console.log("Il server non ha restituito l'ID della partita.");
        return null;
      }

      return gameId;
    });
}

function iniziaGioco() { // questo crea partita e apre page
  const username = getUsername();

  if (username === "") {
    return;
  }

  setBusy(true);

  createGame(username)
    .then(function(gameId) {
      if (gameId !== null) {
        openGame(gameId, username, "player");
      }
      setBusy(false);
    })
    .catch(function(error) {
      setBusy(false);
      console.log(error);
      message.textContent = "Impossibile creare la partita.";
    });
}

function findGame() {
  const indirizzo = "https://classe5ID.altervista.org/games/partita";

  return fetch(indirizzo, requestOptionsGet)
    .then(readResponse)
    .then(function(result) {
      if (!result.data || !Array.isArray(result.data)) {
        return null;
      }

      let stanzaTrovata = null;

      result.data.forEach(function(room) {
        const roomId = room.ID;
        const firstPlayer = room.PLAYER1 || "";

        if (stanzaTrovata === null && roomId && typeof firstPlayer === "string" && firstPlayer.indexOf("domino") === 0 && playerCount(room) < 4) {
          stanzaTrovata = room;
        }
      });

      return stanzaTrovata;
    })
    .catch(function(error) {
      console.log(error);
      return false;
    });
}

function joinGioco() {
  const username = getUsername();

  if (username === "") {
    return;
  }

  setBusy(true);

  let gameId = gameIdInput.value.trim();

  if (gameId !== "") {
    openGame(gameId, username, "join");
    setBusy(false);
    return;
  }

  findGame()
    .then(function(room) {
      if (room === false) {
        setBusy(false);
        return;
      }

      if (room === null) {
        return createGame(username).then(function(newGameId) {
          if (newGameId !== null) {
            openGame(newGameId, username, "player");
          }
          setBusy(false);
        });
      }

      gameId = room.ID;
      openGame(gameId, username, "join");
      setBusy(false);
    })
    .catch(function(error) {
      setBusy(false);
      message.textContent = error.message || error || "Impossibile raggiungere il server.";
    });
}
