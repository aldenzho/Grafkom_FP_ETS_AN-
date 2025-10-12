import { THREE, scene , roomW } from './room.js';
import {bedCenterZ} from './bed.js';

// === Desk ===
const deskW = 3, deskD = 1.35, deskH = 0.75;
const deskX = -roomW / 2 + deskW / 2 + 0.1;
const deskZ = bedCenterZ - 4.5;

// Muat tekstur dari bed.jpg
const deskTexture = new THREE.TextureLoader().load('./texture/bed.jpg');
deskTexture.wrapS = THREE.RepeatWrapping;
deskTexture.wrapT = THREE.RepeatWrapping;
deskTexture.repeat.set(2, 2); // supaya teksturnya tidak terlalu besar

// Material dengan tekstur bed.jpg
const deskMat = new THREE.MeshStandardMaterial({
  map: deskTexture,
  metalness: 0.3,
  roughness: 0.7,
});

// Create desk group
const desk = new THREE.Group();
desk.name = 'Desk';
desk.position.set(deskX, 0, deskZ); // group transform: top will be placed relative to this

// Bagian atas meja (relative to group)
const deskTop = new THREE.Mesh(
  new THREE.BoxGeometry(deskW, 0.05, deskD),
  deskMat
);
deskTop.position.set(0, deskH, 0); // relative to group
deskTop.castShadow = true;
deskTop.receiveShadow = true;
deskTop.name = 'Desk Top';
desk.add(deskTop);

// Kaki meja (relative positions)
const legG = new THREE.BoxGeometry(0.2, deskH, 0.2);
const legM = new THREE.MeshStandardMaterial({ map: deskTexture });

function makeLeg(oX, oZ) {
  const leg = new THREE.Mesh(legG, legM);
  leg.position.set(oX * (deskW / 2.1 - 0.025), deskH / 2, oZ * (deskD / 2.25 - 0.025));
  leg.castShadow = true;
  leg.receiveShadow = true;
  leg.name = `Desk Leg`;
  desk.add(leg);
}

makeLeg(1, 1);
makeLeg(1, -1);
makeLeg(-1, 1);
makeLeg(-1, -1);

// Mark group selectable/editable
desk.userData.selectableRoot = true;
desk.userData.locked = false;
desk.traverse((c) => {
  if (c.isMesh) {
    c.userData.locked = false;
    c.userData.selectableRoot = false;
  }
});

// Add group to scene
scene.add(desk);

// export for compatibility (deskTop still exported as reference)
export { deskX, deskW, deskZ, deskTop, desk };
