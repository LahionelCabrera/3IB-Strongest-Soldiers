var statoattuale = 0;

const img_arr = [
    {
        nome: "image1",
        coloreBG: "white",
        tempo: 1000, //milliseconds
    },

    {
        nome: "image2",
        coloreBG: "lightgray",
        tempo: 1500, //milliseconds
    },
    {
        nome: "image3",
        coloreBG: "darkgray",
        tempo: 2000, //milliseconds
    },
    {
        nome: "image4",
        coloreBG: "gray",
        tempo: 2500, //milliseconds
    },
    {
        nome: "image5",
        coloreBG: "black",
        tempo: 3000, //milliseconds
    }
];

// document.addEventListener('DOMContentLoaded', () => {
//     const currentImage = img_arr[statoattuale];
//         setTimeout(cambio, currentImage.tempo);
// });

var bool = true;

document.getElementById("trulli").addEventListener('click', () => {
    bool = !bool;
    statoattuale--;
    cambio();
})

// array di immagini





// function cambio() {
//     statoattuale++;
//     if (statoattuale == 6) {
//         statoattuale = 1;
//     } 
        
//     document.getElementById("trulli").src = "./img/image" + statoattuale + ".png";
// }


function cambio() {
    statoattuale++;
    if (statoattuale >= img_arr.length) {
        statoattuale = 0;
    }

    const currentImage = img_arr[statoattuale];
    document.getElementById("trulli").src = "./img/" + currentImage.nome + ".png";
    document.body.style.backgroundColor = currentImage.coloreBG;

    if (bool) 
        setTimeout(cambio, currentImage.tempo);
}
