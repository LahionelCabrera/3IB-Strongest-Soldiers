//creazione delle opzioni

const righe=document.getElementById("righe");
const colonne=document.getElementById("colonne");

for(let i=3;i<=10;i++){
    const optionRighe=document.createElement("option");
    optionRighe.value=i;
    optionRighe.textContent=i;
    righe.appendChild(optionRighe);
    colonne.appendChild(optionRighe.appendChild(optionRighe.cloneNode(true)));
}