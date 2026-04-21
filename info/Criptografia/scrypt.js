function codifica(btn,mittente,destinatario){

    const i = btn.getAttribute("for");
    const testo=document.getElementById(i).value;
    const mit = document.getElementById(mittente);
    const codifica=document.getElementById("codifica");
    const dest = document.getElementById(destinatario);
   
    mit.innerHTML+="INVIATO: "+testo+" <br>";





    if(document.getElementById("CheckCesare")==1)
        codificaCesare(testo,document.getElementById("cesare").value);

    if(document.getElementById("vigenere")==1)
        codificaVigenere(testo,document.getElementById("cesare").value);

    if(document.getElementById("monoalfabetica")==1)
        codificaMonoAlf(testo,document.getElementById("cesare").value);


    
    /*
    leggo il messaggio
    visualizzo il messaggio in chiaro inviato
    
    controllo gli algoritmi di codifica selezionati
    codifico il testo 
    visualizzo il messaggio codificato nella colonna centrale

    decodifico il messaggio
    mostro il messaggio decifrato a destra

    */

}

function cesare(c, k) {
    c = c.charCodeAt(0);
    k %= 26;

    // Maiuscole (A-Z)
    if (c >= 65 && c <= 90) {
        return String.fromCharCode(((c - 65 + k) % 26) + 65);
    }

    // Minuscole (a-z)
    if (c >= 97 && c <= 122) {
        return String.fromCharCode(((c - 97 + k) % 26) + 97);
    }

    // Altri caratteri (spazi, numeri, simboli)
    return String.fromCharCode(c);
}

function codificaCesare(s,k){
    var bitcoin = "";
    for(let i=0; i<s.length; i++)
    {
        bitcoin+=cesare(s[i],k);
    }

    
    return bitcoin;
}

function codificaVigenere(testo, chiave) {
    let code = c.charCodeAt(0);
    let risultato = "";
    let j = 0;

    for (let i=0; i<testo.length(); i++){
        let c = testo[i];
        if (code >= 65 && code <= 90 || code >= 97 && code <= 122){
            let k = chiave[j % chiave.length];
            let shift = k.toLowerCase();
            risultato += cesare(c,shift);
        }
        else {
        risultato += c;
        }
    }
    return risultato;
}
