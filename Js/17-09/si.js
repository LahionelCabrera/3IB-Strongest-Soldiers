
var statoattuale = 1;

function cambio() {
    statoattuale++;
    if (statoattuale == 6) {
        statoattuale = 1;
    } 
        
    document.getElementById("trulli").src = "./img/image" + statoattuale + ".png";
}