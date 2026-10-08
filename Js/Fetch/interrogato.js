const urlTasso = "./tasso-gerusalemme-liberata.txt"
const urlFind = "https://classe5id.altervista.org/parole/search.php?word="
let parole;
let parole_non=[];
async function accedi(urlTasso){

    const gerusalemme= await fetch(urlTasso)


    if(gerusalemme.ok){
        const testo = await gerusalemme.text()
        const testo2=testo.replace(/\n/g, " ")
         parole = testo2.split(" ")
        console.log(parole[1])
        cerca_tutte();


    }

    

    
}


async function cerca_tutte(){
    for(const p of parole){
        const find=await fetch(urlFind+p);
        if(find.ok){
            const result=await find.text();
            if (result=="false") 
            parole_non.push(p);
        }
        else    
            console.warn("ritardo mentale non funziona un cazzo");
        
    }

}

accedi(urlTasso);

