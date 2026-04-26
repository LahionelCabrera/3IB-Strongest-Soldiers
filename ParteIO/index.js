function Cesare(char, key) {
    var codiceOriginale = char.charCodeAt(0);
    var cripted = codiceOriginale + parseInt(key); 
    return String.fromCharCode(cripted);
}

function CriptoCesare(testo, key) {
    var testoRisultato = ""; 
    for (let i = 0; i < testo.length; i++) {
        testoRisultato += Cesare(testo[i], key);
    }
    return testoRisultato;
}

function Vigenere(car, key) {
    var codiceOriginale = car.charCodeAt(0);
    
    var shift = key.toUpperCase().charCodeAt(0) - 65;
    
    shift %= 26; 
    
    var cripted = codiceOriginale + shift;
    return String.fromCharCode(cripted);
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


function Cripto(btn, mittente, destinatario) {
    const Mittente = btn.dataset.mittente;
    const Testo = document.getElementById(Mittente).value;
    const BoxMittente = document.getElementById(mittente);
    const BoxCripto = document.getElementById("BoxCripto");
    const BoxDestinatario = document.getElementById(destinatario);

    var TextCripto = Testo;

    if (document.getElementById("CheckCesare").checked) {
        TextCripto = CriptoCesare(TextCripto, document.getElementById("KeyCesare").value);
    }
    
    if (document.getElementById("CheckVigenere").checked) {
        TextCripto = CriptoVigenere(TextCripto, document.getElementById("KeyVigenere").value);
    }

    BoxMittente.innerHTML += Testo + "</br>";
    BoxCripto.innerHTML += TextCripto + "</br>"; 
    BoxDestinatario.innerHTML += Testo + "</br>"; 
    
    document.getElementById(Mittente).value = "";
}