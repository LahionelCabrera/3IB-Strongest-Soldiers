const myHeaders = new Headers();
let USERname
const gbton = document.getElementById("gioca");

addEventListener()

myHeaders.append("Authorization", "Basic NElCOkNSSVBQQQ==");

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://classe5id.altervista.org/games/partita/", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));