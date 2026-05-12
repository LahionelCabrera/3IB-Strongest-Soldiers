function StampaValoreRange(Range, Valore) {
  let R_value = Range.value;
  document.getElementById(Valore).value = R_value;
  console.log(R_value);
}


function GeneraTabella() 
{
    const rig = document.getElementById(customRange1).value;
    const col = document.getElementById(customRange2).value;
    const dest = document.getElementById(destination);

    const row = document.createElement("div");
    row.className = "row";

    const cell = document.createElement("div");
    cell.className = "col";

    for(let i = 0; i < rig; i++){
        for(let j = 0; j < col; j++){
            dest.appendChild(cell);
        }
    }


}