import * as THREE from 'three';

// 1. Creazione della Scena
const scene = new THREE.Scene();

// 2. Configurazione della Telecamera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// 3. Creazione del Renderer e inserimento nel DOM
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 4. Creazione del Cubo (Geometria + Materiale = Mesh)
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 5. Funzione di Animazione (Loop continuo)
function animate() {
    requestAnimationFrame(animate);
    
    // Rotazione del cubo ad ogni frame
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    
    renderer.render(scene, camera);
}
animate();
