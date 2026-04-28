function Cesare(char, key) {
    function Cesare(char, key) {
    let codice = char.charCodeAt(0);
    if (codice >= 65 && codice <= 90) {
        return String.fromCharCode(((codice - 65 + parseInt(key)) % 26) + 65);
    }
    return char; 
}

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
    
    var cripted = (codiceOriginale + shift)%26;
    return String.fromCharCode(cripted+65);
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

function mappa(){
    let map={};
    let alf="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for(let i=0; i<13; i++){
            let c=Math.floor(Math.random()*alf.length);
            let t=alf.slice(0, c) + alf.slice(c+1);
            map[alf[c]]=t[Math.floor(Math.random()*t.length)];
            map[map[alf[c]]]=alf[c];
            alf=t;
        }

    return map;
}

function monoalfabetica(testo,map){

    for(let i=0; i<testo.length; i++)
        testo[i]=map[testo[i]];
    return testo;
}


function changeSlotChar(car1,car2){
    if(car1.value===car2)
        return;
    let car3=fromCharCode((car1.charCodeAt(0)+1)%26+65)
    car1.value=car3;

    setTimeout(changeSlotChar(), 500,car3,car2 );




}



function Cripto(btn, mittente, destinatario) {
    const Mittente = btn.dataset.mittente;
    const Testo = document.getElementById(Mittente).value;
    const BoxMittente = document.getElementById(mittente);
    const BoxCripto = document.getElementById("BoxCripto");
    const BoxDestinatario = document.getElementById(destinatario);

    var TextCripto = Testo.toUpperCase();

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