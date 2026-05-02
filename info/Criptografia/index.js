function Cesare(char, key) {
  let codice = char.charCodeAt(0);

  if (codice >= 65 && codice <= 90) {
    return String.fromCharCode(((codice - 65 + key) % 26) + 65);
  }

  if (codice >= 97 && codice <= 122) {
    return String.fromCharCode(((codice - 97 + key) % 26) + 97);
  }

  return char;
}

function CriptoCesare(testo, key) {
  let risultato = "";
  key = parseInt(key);

  for (let i = 0; i < testo.length; i++) {
    risultato += Cesare(testo[i], key);
  }

  return risultato;
}

function Vigenere(car, key) {
  var codiceOriginale = car.charCodeAt(0);

  var shift = key.toUpperCase().charCodeAt(0) - 65;

  shift %= 26;

  var cripted = (codiceOriginale + shift) % 26;
  return String.fromCharCode(cripted + 65);
}

function CriptoVigenere(testo, key) {
  var testoRisultato = "";

  if (!key || key.length === 0) return testo;

  for (let i = 0; i < testo.length; i++) {
    var keyChar = key[i % key.length];
    testoRisultato += Vigenere(testo[i], keyChar);
  }
  return testoRisultato;
}

function mappa() {
  let map = {};
  let alf = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = 0; i < 13; i++) {
    let c = Math.floor(Math.random() * alf.length);
    let t = alf.slice(0, c) + alf.slice(c + 1);
    map[alf[c]] = t[Math.floor(Math.random() * t.length)];
    map[map[alf[c]]] = alf[c];
    alf = t;
  }

  return map;
}

function monoalfabetica(testo, map) {
  for (let i = 0; i < testo.length; i++) testo[i] = map[testo[i]];
  return testo;
}

// function changeSlotChar(car1, car2) {
//   if (car1.value === car2) return;
//   let car3 = fromCharCode(((car1.charCodeAt(0) + 1) % 26) + 65);
//   car1.value = car3;

//   setTimeout(changeSlotChar(), 500, car3, car2);
// }

function Cripto(btn, mittente, destinatario) {
  const Mittente = btn.dataset.mittente;
  const Testo = document.getElementById(Mittente).value;
  const BoxMittente = document.getElementById(mittente);
  const BoxCripto = document.getElementById("BoxCripto");
  const BoxDestinatario = document.getElementById(destinatario);

  var TextCripto = Testo.toUpperCase();

  if (document.getElementById("CheckCesare").checked == 1) {
    TextCripto = CriptoCesare(
      TextCripto,
      document.getElementById("KeyCesare").value,
    );
    StampaSlot(TextCripto);
  }

  if (document.getElementById("CheckVigenere").checked == 1) {
    TextCripto = CriptoVigenere(
      TextCripto,
      document.getElementById("KeyVigenere").value,
    );
  }

  BoxMittente.innerHTML += Testo + "</br>";
  BoxCripto.innerHTML += TextCripto + "</br>";
  BoxDestinatario.innerHTML += Testo + "</br>";

  document.getElementById(Mittente).value = "";
}

function StampaSlot(testo) {
  const dest = document.getElementById("Slots");
  const templete = document.querySelector("Template").content;
  dest.innerHTML = "";
  const clone = templete.cloneNode(true);
  for (let i = 0; i < char.length; i++) {
    dest.appendChil(clone);
  }
}

function AnimazioneSlot(id, txtStart, txtEnd) {
  const dest = document.getElementById(id);
  const char = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  dest.innerHTML = "";

  for (let i = 0; i < txtStart.length; i++) {
    const newRullo = document.createElement("div");
    newRullo.className = "rullo";
    dest.appendChild(newRullo);

    let startIdx = char.indexOf(txtStart[i].toUpperCase());
    let endIdx = char.indexOf(txtEnd[i].toUpperCase());
    
    if (startIdx === -1) startIdx = 0;
    if (endIdx === -1) endIdx = 0;

    let ok = endIdx - startIdx;
    let passi = Math.abs(ok);

    // 1. CREAZIONE BLOCCHI (Sempre in ordine alfabetico tra i due punti)
    // Usiamo il valore più basso come inizio e il più alto come fine
    let min = Math.min(startIdx, endIdx);
    let max = Math.max(startIdx, endIdx);

    for (let j = min; j <= max; j++) {
      const blocco = document.createElement("div");
      blocco.className = "blocco";
      blocco.textContent = char[j];
      newRullo.appendChild(blocco);
    }

    // 2. LOGICA DEL MOVIMENTO
    if (ok >= 0) {
      // CASO A -> C (Sale)
      // Parte dall'inizio del rullo e va verso il basso
      newRullo.style.transition = "none";
      newRullo.style.transform = "translateY(0px)";

      setTimeout(() => {
        newRullo.style.transition = "transform 4s cubic-bezier(0.15, 0, 0.15, 1)";
        newRullo.style.transform = `translateY(-${passi * 50}px)`;
      }, 50);

    } else {
      // CASO C -> A (Scende)
      // Parte già spostato verso l'alto e torna a zero
      newRullo.style.transition = "none";
      newRullo.style.transform = `translateY(-${passi * 50}px)`;

      setTimeout(() => {
        newRullo.style.transition = "transform 4s cubic-bezier(0.15, 0, 0.15, 1)";
        newRullo.style.transform = "translateY(0px)";
      }, 50);
    }
  }
}