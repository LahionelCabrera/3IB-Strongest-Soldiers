const myHeaders = new Headers();
let USERname = "domino";
let Inpartita = false;


myHeaders.append("Authorization", "Basic NElCOkNSSVBQQQ==");

const requestOptionsPost = {
  method: "POST",
  headers: myHeaders,
  redirect: "follow"
};

const requestOptionsGet = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

  iniziaGioco = () => {
    USERname = USERname + document.getElementById("username").value;
    document.getElementById("username").value = "";
    console.log(USERname);
    if (USERname != "domino") {
      fetch("https://classe5id.altervista.org/games/partita/", requestOptionsPost)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          const partitaId = result.data.id;
          console.log(partitaId);
          Inpartita = true;
        })
        .catch((error) => console.error(error));
    } else {
      alert("Inserisci il tuo nome per giocare!");
    }
  };

  joinGioco = () => {
    USERname = USERname + document.getElementById("username").value;
    document.getElementById("username").value = "";
    console.log(USERname);
    const partitaId = document.getElementById("id").value;
    console.log(partitaId);
    
    //USERNAME E ID
    if (USERname != "domino" && partitaId.length > 0) {
      fetch("https://classe5ID.altervista.org/games/join/" + partitaId + "/" + USERname, requestOptionsPost)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          const partitaId = result.data.id;
          console.log(partitaId);
          Inpartita = true;
        })
        .catch((error) => console.error(error));
      }

  //SOLO USERNAME
    else if (USERname != "domino" && partitaId.length === 0) {

      let partitaId = null;
      //prende lista
      fetch("https://classe5ID.altervista.org/games/partita", requestOptionsGet)
        .then((response) => response.json())
        .then((result) => {
          //cerca su ogni partita, se il nome del PLAYER1 comincia con domino allora l'utente viene inserito in quella partita 
          result.data.forEach(element => {
            if(element.PLAYER1.startsWith("domino")) {
              console.log("Trovata partita con PLAYER1: " + element.PLAYER1);
              
               partitaId = element.ID;
              console.log(partitaId);
              
              fetch("https://classe5ID.altervista.org/games/join/" + partitaId + "/" + USERname, requestOptionsPost)
                .then((response) => response.json())
                .then((result) => {
                  console.log(result);
                  Inpartita = true;
                })
                .catch((error) => console.error(error));
               //se trova partita finisce il ciclo forEach
              return;
            }
          });
          console.log(result);
          console.log(partitaId);
        })
        .catch((error) => console.error(error));
    }
  }