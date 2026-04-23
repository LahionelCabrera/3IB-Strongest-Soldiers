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

function Cripto(btn,mittente,destinatario)
{
    const Mittente = btn.dataset.mittente;
    const Testo = document.getElementById(Mittente).value;
    const BoxMittente = document.getElementById(mittente);
    const BoxCripto = document.getElementById("BoxCripto");
    const BoxDestinatario = document.getElementById(destinatario);

    var TextCripto = Testo;
    if(document.getElementById("CheckCesare").checked)
    {
        TextCripto = CriptoCesare(TextCripto, document.getElementById("KeyCesare").value);
    }
    // if(document.getElementById("CheckVigenere").checked)
    // {

    // }
    BoxMittente.innerHTML += Testo + "</br>";
    BoxCripto.innerHTML += TextCripto;
    BoxDestinatario.innerHTML += Testo;
    
    document.getElementById(Mittente).value = "";
}