const rig = document.getElementById("customRange1").value
const col = document.getElementById("customRange2").value
const dest = document.getElementById("destination")
const table = document.createElement("table")
console.log(rig)
console.log(col)

    for(let i = 0; i < rig; i++){
        const riga = document.createElement("tr")
        for(let j = 0; j < col; j++){
            const colonna = document.createElement("td")
            riga.appendChild(colonna)
            }
        table.appendChild(riga)
        }
dest.appendChild(table)
