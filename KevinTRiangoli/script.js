let righa = 0;

function prova() {
    righa++;

    const ciao = document.createElement("div");
    ciao.className = "row flex-nowrap justify-content-center";

    for (let i = 0; i < righa; i++) {
        const palla = document.createElement("div");
        palla.className = "palla";
        ciao.appendChild(palla);
    }

    document.getElementById("main").appendChild(ciao);
}