
/*
Metodi di Disegno Principali
Esistono due modi principali per interagire con le forme:

Fill (Riempimento): Colora l'interno di una forma.

ctx.fillStyle = "green"; (Scegli il colore).

ctx.fillRect(x, y, width, height); (Disegna un rettangolo pieno).

Stroke (Tratto): Disegna solo il contorno.

ctx.strokeStyle = "black"; (Scegli il colore del bordo).

ctx.strokeRect(x, y, width, height); (Disegna il perimetro).*/




const canvas=document.getElementById("canvas");
const ctx=canvas.getContext("2d");//pennello

const righe=document.getElementById("righe");//numero righe
const colonne=document.getElementById("colonne");//numero colonne
const gioca=document.getElementById("gioco");
const nascono=document.getElementById("nascono");
const sopravvivono=document.getElementById("sopravvivono");

let col;
let rig;
let dimensione_cella;
let giocando=false;
let tab;
let nasce;
let sopravvive;
let anima;


//scelta righe e colonne
for(let i=3; i<=20; i++){
    const riga=document.createElement("option");
    riga.value=i;
    riga.textContent=i;
    
    const colonna=document.createElement("option");
    colonna.value=i;
    colonna.textContent=i;

    if(i<8){
        const nascita=document.createElement("option");
        nascita.value=i;
        nascita.textContent=i;       

        const sopravvivenza=document.createElement("option");
        sopravvivenza.value=i;
        sopravvivenza.textContent=i;


        if(i===3)
            nascita.selected=true;//selected=selezionata di norma


        nascono.appendChild(nascita);
        sopravvivono.appendChild(sopravvivenza);
    }
    
    //tab 20x02 di norma
    if(i===20){
        riga.selected=true;//selected=selezionata di norma
        colonna.selected=true;
    }
    
    righe.appendChild(riga);
    colonne.appendChild(colonna);
}


//svuota la tabella
function svuota(){
    if(giocando)
        gioco();
    
    for(let i=0; i<rig; i++){
        for(let j=0; j<col; j++){
            tab[i][j]=0;
        }
    }
    disegna();
}

//pulsante avvio e pausa
function gioco() {
    giocando=!giocando;
    if(giocando){
        gioca.textContent="Metti in Pausa";
        gioca.style.backgroundColor="#8b0714"; //pausa
        animazione();
    } 
    else{
        gioca.textContent="Avvia Gioco";
        gioca.style.backgroundColor="#0051a8"; //avvio
        clearTimeout(anima);
    }
}

//animazione
function animazione(){
    prox();
    anima = setTimeout(() => {
        if(giocando)
            requestAnimationFrame(animazione);
        
    }, 300);
}

//conta i vicini
function vicini(y, x){
    let somma=0;
    for(let i= -1; i<2; i++){
        for(let j= -1; j<2; j++) {
            let coll=(x+j+col)%col;
            let row=(y+i+rig)%rig;
            somma+=tab[row][coll];
        }
    }
    somma-=tab[y][x];//tolgo la cella stessa
    return somma;
}


//crea array
function array(righ, coll) {
    let arr=new Array(righ);
    for (let i=0; i<arr.length; i++){
        arr[i]=new Array(coll).fill(0);//riempie l'array celle 0
    }
    return arr;
}

//crea la tabella
function tabella(){

    //femra
    if(giocando)
        gioco();

    rig=parseInt(righe.value);
    col=parseInt(colonne.value);
    
    let massimo_canvas=800;

    dimensione_cella=massimo_canvas/Math.max(rig, col);

    canvas.width=col*dimensione_cella;
    canvas.height=rig*dimensione_cella;
    
    tab=array(rig, col);
    nasce=parseInt(nascono.value);
    sopravvive=parseInt(sopravvivono.value);

   //celle vive random
    for(let i=0; i<rig; i++){
        for(let j=0; j<col; j++){
            tab[i][j]=Math.random()<0.2 ? 1 : 0;
        }
    }
    
    disegna();
}


function disegna(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for(let i=0; i<rig; i++){
        for(let j=0; j<col; j++){
            let x=j*dimensione_cella;
            let y=i*dimensione_cella;
            
            //bordi celle
            ctx.strokeStyle="#3f3936";
            ctx.strokeRect(x, y, dimensione_cella, dimensione_cella);

            if(tab[i][j]===1){
                ctx.fillStyle="green"; //celle vive
                ctx.fillRect(x, y, dimensione_cella, dimensione_cella);
            }
        }
    }
}

function prox(){
    let tab2=array(rig, col);
    
    for (let i=0; i<rig; i++) {
        for (let j=0; j<col; j++) {
            let stato=tab[i][j];
            let vicin=vicini(i, j);
            
            if(stato===0 && vicin===nasce)
                tab2[i][j]=1;//nascita
            
            else if(stato===1 && (vicin===sopravvive || vicin===nasce) )
                tab2[i][j]=stato;//sopravvive
            
            else 
                tab2[i][j]=0;//muore
            
        }
    }
    tab=tab2;
    disegna();
}

// Permette all'utente di cliccare sul canvas per aggiungere/rimuovere celle vive manualmente
canvas.addEventListener('click', function(event){
    if(!tab) return; 

    //posizione del canvas rispetto
    const rect=canvas.getBoundingClientRect();//getBoundingClientRect() da la posizione del canvas rispetto alla finestra

    //scala di conversione da coordinate del mouse a coordinate del canvas
    const scaleX=canvas.width / rect.width;
    const scaleY=canvas.height / rect.height;

    //calcolo posizione mouse
    const x=(event.clientX - rect.left) * scaleX; //asse x
    const y=(event.clientY - rect.top) * scaleY;  //asse y

    //da pixel a indice per la tab  / math.floor toglie i decimali
    const colonna = Math.floor(x / dimensione_cella); //x determina la colonna
    const riga = Math.floor(y / dimensione_cella);    //y determina la riga

    //controllo di validità dell'indice
    if (riga < rig && colonna < col) {
        tab[riga][colonna] = tab[riga][colonna] === 1 ? 0 : 1;
        disegna();
    }
});
