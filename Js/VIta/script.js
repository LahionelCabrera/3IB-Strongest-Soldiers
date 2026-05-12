const rig = document.getElementById("customRange1").value
const col = document.getElementById("customRange2").value
const dest = document.getElementById("destination")
const cell = document.getElementsByTagName("Template").content
    for(let i = 0; i < rig; i++){
        for(let j = 0; j < rig; j++){
                dest.appendChild(cell)
            }
        }