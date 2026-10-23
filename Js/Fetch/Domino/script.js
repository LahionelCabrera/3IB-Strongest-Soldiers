const myHeaders = new Headers();
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