// js/lemari.js
import { THREE, scene } from './room.js';

// === Load texture kayu ===
const textureLoader = new THREE.TextureLoader();
const woodTexture = textureLoader.load('./texture/lemari.jpg');
woodTexture.wrapS = woodTexture.wrapT = THREE.RepeatWrapping;
woodTexture.repeat.set(2, 2);

// === Group utama ===
const lemari = new THREE.Group();
lemari.name = "Lemari Kayu";

// === BODY ===
const bodyGeo = new THREE.BoxGeometry(3.7, 3, 0.8);
const bodyMat = new THREE.MeshStandardMaterial({
  map: woodTexture,
  roughness: 0.6,
  metalness: 0.3,
});
const body = new THREE.Mesh(bodyGeo, bodyMat);
body.position.set(0, 1.5, 0);
body.castShadow = true;
body.receiveShadow = true;
body.name = "Body Lemari";
body.userData = {
  type: "body",
  isEditable: true,
};
lemari.add(body);

// === PINTU KIRI (bisa diubah, bisa dihover) ===
const doorGeo = new THREE.BoxGeometry(1.83, 3, 0.05);
const doorMatLeft = new THREE.MeshStandardMaterial({
  map: woodTexture,
  roughness: 0.7,
  metalness: 0.3,
});
const doorLeft = new THREE.Mesh(doorGeo, doorMatLeft);
doorLeft.position.set(-0.93, 1.5, 0.5);
doorLeft.castShadow = true;
doorLeft.receiveShadow = true;
doorLeft.name = "Pintu Kiri Lemari";
doorLeft.userData = {
  type: "doorLeft",
  isEditable: true,
};
lemari.add(doorLeft);

// === PINTU KANAN (sendiri, bisa dihover tapi tidak bisa diubah) ===
const doorMatRight = new THREE.MeshStandardMaterial({
  map: woodTexture,
  roughness: 0.6,
  metalness: 0.3,
});
const doorRight = new THREE.Mesh(doorGeo, doorMatRight);
doorRight.position.set(0.93, 1.5, 0.42);
doorRight.castShadow = true;
doorRight.receiveShadow = true;
doorRight.name = "Pintu Kanan Lemari";
doorRight.userData = {
  type: "doorRight",
  isEditable: false,
};
lemari.add(doorRight);

// === PEGANGAN ===
const handleGeo = new THREE.BoxGeometry(0.05, 1, 0.05);
const handleMat = new THREE.MeshStandardMaterial({
  color: 0x333333,
  metalness: 0.8,
  roughness: 0.2,
});

// Kiri
const handleLeft = new THREE.Mesh(handleGeo, handleMat);
handleLeft.position.set(-1.75, 1.5, 0.57);
handleLeft.castShadow = true;
handleLeft.name = "Pegangan Kiri Lemari";
handleLeft.userData = {
  type: "handleLeft",
  isEditable: false,
};
lemari.add(handleLeft);

// Kanan
const handleRight = new THREE.Mesh(handleGeo, handleMat);
handleRight.position.set(1.75, 1.5, 0.47);
handleRight.castShadow = true;
handleRight.name = "Pegangan Kanan Lemari";
handleRight.userData = {
  type: "handleRight",
  isEditable: false,
};
lemari.add(handleRight);

// === POSISI DALAM RUANG ===
lemari.position.set(1.5, 0, -3);
scene.add(lemari);

// === EXPORT ===
export { lemari, doorLeft, doorRight, body };
