//Game of life fatto per imparare Three.js, aiutato dalla ia con alcune cose di three.js, i commenti del tipo '//**....' sono fatti da ia
//'Preparazione'
//Finestra, cam, rendering
const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 200); //FOV, Aspect Ratio, Despawn_Near, Despawn_Far
const canvas = document.getElementById("game");     //dividere UI da renderer
const render = new THREE.WebGLRenderer({canvas});   //
cam.position.z = 10; //**
cam.lookAt(0, 0, 0); //**
render.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(render.domElement);
//mouse e raycast
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

//luce
const ambient = new THREE.AmbientLight(0xffffff, 0.4); //ambient è una luce che illumina tutto uniformenente
const dirLight = new THREE.DirectionalLight(0xffffff, 1); //directional invece illumina da un punto tipo bulb
scene.add(ambient);
dirLight.position.set(5, 10, 5);
scene.add(dirLight);
    ambient.intensity = 0.4;
    dirLight.intensity = 0.4;


const spacing = 0.6;


var selectedCube = null;
var ispremuto = false;
var stato;
var generazione = 0;
var timer = null;
var righe = document.getElementById("righe").value;
var colonne = document.getElementById("colonne").value;
document.getElementById("velocita").addEventListener("input", () => {

    if (timer !== null) {

        clearInterval(timer);

        timer = setInterval(
            passo,
            document.getElementById("velocita").value
        );
        document.getElementById("velocitaTesto").innerHTML = document.getElementById("velocita").value + "ms";
    }

});



var cubi = [];

function resetGrid() {

    cubi.forEach(riga => {

        riga.forEach(cubo => {

            scene.remove(cubo);

            cubo.geometry.dispose();
            cubo.material.dispose();
        });

    });

    cubi = [];
}


function creaGriglia(){
    righe = document.getElementById("righe").value;
    colonne = document.getElementById("colonne").value;

    for(let i = 0; i < righe; i++){
        cubi[i] = [];
        for(let j = 0; j < colonne; j++){

            const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);    //Imposti la forma(box, sfera, cono, etc)
            const material = new THREE.MeshStandardMaterial({      //Imposti l'aspetto, ci sono diversi tipi(Standard, Lambert, Phong)
                color: 0x101010,
                roughness: 0.4,
                metalness: 0.1
                });

            const cube = new THREE.Mesh(geometry, material);    //Cube == Mesh. Mesh = Forma Geometrica + Material 
                                                                //si puo fare ancheconst cube = THREE.Mesh(THREE.BoxGeometry(1, 1, 1), THREE.MeshNormalMaterial());
            cube.position.x = (j - (colonne - 1) / 2) * spacing;
            cube.position.y = (i - (righe - 1) / 2) * spacing;      
            cubi[i][j] = cube;
            scene.add(cube);

                        // ** Correzione centratura camera
            const maxDim = Math.max((colonne - 1) * spacing, (righe - 1) * spacing, 1);
            const distanza = (maxDim / 2) / Math.tan((75 * Math.PI / 180) / 2);
            cam.position.set(0, 0, distanza + 1);
            cam.lookAt(0, 0, 0);
        }
    }
}

function contavicini(i, j) {
    var contatore = 0;
    

    for (var di = -1; di <= 1; di++) {
        for (var dj = -1; dj <= 1; dj++) {
            if (di == 0 && dj == 0) continue;
            
            var ni = i + di;
            var nj = j + dj;

            if (ni < 0) {
                ni = righe - 1;
            } else if (ni >= righe) {
                ni = ni % righe;
            }

            if (nj < 0) {
                nj = colonne - 1;
            } else if (nj >= colonne) {
                nj = nj % colonne;
            }

            if (ni >= 0 && ni < righe && nj >= 0 && nj < colonne) {
                if (cubi[ni][nj].material.color.getHex() === 0x00ff00) {
                    contatore++;
                }
            }
        }
    }
    
    return contatore;
}

function aggiornaConteggio() {
    var conteggio = 0;
    for (var i = 0; i < righe; i++) {
        for (var j = 0; j < colonne; j++) {
            if (cubi[i][j].material.color.getHex() === 0x00ff00) {
                conteggio++;
            }
        }
    }
    document.getElementById("conteggio").innerHTML = conteggio;
}

function passo() {
    var nuovaGriglia = [];
    for (var i = 0; i < righe; i++) {
        nuovaGriglia[i] = [];
        for (var j = 0; j < colonne; j++) {
            const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);    //Imposti la forma(box, sfera, cono, etc)
            const material = new THREE.MeshStandardMaterial({      //Imposti l'aspetto, ci sono diversi tipi(Standard, Lambert, Phong)
                color: 0x101010,
                roughness: 0.4,
                metalness: 0.1
                });

            const cube = new THREE.Mesh(geometry, material);    //Cube == Mesh. Mesh = Forma Geometrica + Material 
                                                                //si puo fare ancheconst cube = THREE.Mesh(THREE.BoxGeometry(1, 1, 1), THREE.MeshNormalMaterial());
            cube.position.x = (j - (colonne - 1) / 2) * spacing;
            cube.position.y = (i - (righe - 1) / 2) * spacing;      
            nuovaGriglia[i][j] = cube;
        }
    }
    
    for (var i = 0; i < righe; i++) {
        for (var j = 0; j < colonne; j++) {
            var vicini = contavicini(i, j);
            
            if (cubi[i][j].material.color.getHex() === 0x00ff00) {
                // cella viva
                if (vicini == 2 || vicini == 3) {
                    nuovaGriglia[i][j].material.color.set(0x00ff00); // sopravvive
                } else {
                    nuovaGriglia[i][j].material.color.set(0x101010); // muore
                }
            } else {
                // cella morta
                if (vicini == 3) {
                    nuovaGriglia[i][j].material.color.set(0x00ff00); // nasce
                } else {
                    nuovaGriglia[i][j].material.color.set(0x101010); // resta morta
                }
            }
        }
    }

    for(let i = 0; i < righe; i++) {
    for(let j = 0; j < colonne; j++) {

        scene.remove(cubi[i][j]);

        cubi[i][j].geometry.dispose();
        cubi[i][j].material.dispose();

        scene.add(nuovaGriglia[i][j]);
    }
}

    
    // aggiorno griglia
    cubi = nuovaGriglia;
    generazione++;
    document.getElementById("generazione").innerHTML = generazione;
    aggiornaConteggio();

}

function start() {
    if (timer == null) {
        var velocita = document.getElementById("velocita").value;
        timer = setInterval(passo, velocita);
        ambient.intensity = 1;
        dirLight.intensity = 1;

    }

}

function stop() {
    if (timer != null) {
        clearInterval(timer);
        timer = null;
        ambient.intensity = 0.4;
        dirLight.intensity = 0.4;
    }
}

function reset() {
    stop();
    generazione = 0;
    document.getElementById("generazione").innerHTML = "0";
    
    for (var i = 0; i < righe; i++) {
        for (var j = 0; j < colonne; j++) {
            cubi[i][j].material.color.set(0x101010);
        }
    }
    aggiornaConteggio();
}

function aggiornaConteggio() {
    var conteggio = 0;
    for (var i = 0; i < righe; i++) {
        for (var j = 0; j < colonne; j++) {
            if (cubi[i][j].material.color.getHex() === 0x00ff00) {
                conteggio++;
            }
        }
    }
    document.getElementById("conteggio").innerHTML = conteggio;
}

window.addEventListener("mousemove", (event) =>{
    mouse.x = (event.clientX /window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY /window.innerHeight) * 2 + 1
})



window.addEventListener("mouseup", (event) => {
    ispremuto = false;
})

window.addEventListener("mousedown", (event) => {
    ispremuto = true;
    if (event.button !== 0) return; // Solo click sinistro
    if (!selectedCube) return;

    
    stato = selectedCube.material.color.getHex();
    selectedCube.material.color.getHex() === 0x00ff00 ? selectedCube.material.color.set(0x101010) : selectedCube.material.color.set(0x00ff00);
});

window.addEventListener("mousemove", (event) => {
    if (!ispremuto) return;
    if (!selectedCube) return;
    
    if(selectedCube.material.color.getHex() === stato) {
        selectedCube.material.color.set(stato === 0x00ff00 ? 0x101010 : 0x00ff00)
    }
});



function animate() {
    requestAnimationFrame(animate);
    render.render(scene, cam);
    raycaster.setFromCamera(mouse, cam);

    const intersects = raycaster.intersectObjects(cubi.flat());

    if (intersects.length > 0) {

    selectedCube = intersects[0].object;
    
  //  selectedCube.material.color.getHex() === 0x00ff00 ? selectedCube.material.color.set(0x0000ff) : selectedCube.material.color.set(0x00ff00);

}
else
    selectedCube = null;
}
animate();

//sistemare alternazione colore per ogni frame con la gestione della pressione del click con var ispremuto