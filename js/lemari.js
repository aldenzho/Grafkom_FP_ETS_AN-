// js/lemari.js
import { THREE, scene , safeLoadTexture, roomW, roomD } from './room.js';

// load texture
const textureLoader = new THREE.TextureLoader();
const woodTexture = textureLoader.load('./texture/lemari.jpg');
woodTexture.wrapS = woodTexture.wrapT = THREE.RepeatWrapping;
woodTexture.repeat.set(2, 2);

// group
const lemari = new THREE.Group();

// materials (unlit)
const bodyMat = new THREE.MeshBasicMaterial({ map: woodTexture });
const doorMat = new THREE.MeshBasicMaterial({ map: woodTexture });

// body
const bodyGeo = new THREE.BoxGeometry(3.7, 3, 0.8);
const body = new THREE.Mesh(bodyGeo, bodyMat);
body.castShadow = false;
body.receiveShadow = false;
body.position.set(0, 1.5, 0);
body.name = 'Lemari Body';
lemari.add(body);

// left door
const doorGeo = new THREE.BoxGeometry(2.9, 3, 0.05); // half-width door
const doorLeft = new THREE.Mesh(doorGeo, doorMat);
doorLeft.position.set(-0.46, 1.5, 0.42); // left side
doorLeft.castShadow = false;
doorLeft.receiveShadow = false;
doorLeft.name = 'Lemari Door';
lemari.add(doorLeft);

// right door
const doorRight = new THREE.Mesh(doorGeo, doorMat);
doorRight.position.set(0.46, 1.5, 0.42); // right side
doorRight.castShadow = false;
doorRight.receiveShadow = false;
doorRight.name = 'Lemari Door';
lemari.add(doorRight);

// handles (optional small boxes)
const handleGeo = new THREE.BoxGeometry(0.04, 0.6, 0.04);
const handleMat = new THREE.MeshBasicMaterial({ color: 0x333333 });
const handleL = new THREE.Mesh(handleGeo, handleMat);
handleL.position.set(-0.3, 1.5, 0.47);
handleL.name = 'Handle';
handleL.castShadow = false;
lemari.add(handleL);
const handleR = handleL.clone();
handleR.position.set(0.3, 1.5, 0.47);
handleR.name = 'Handle';
lemari.add(handleR);

// position group in room
lemari.position.set(1.5, 0, -3);

// mark as locked (non-movable) and selectable root (so UI groups children under it)
lemari.userData.locked = true;
lemari.userData.selectableRoot = true;

// also mark children as not root (and locked) to help logic if desired
lemari.traverse((c) => {
  if (c.isMesh) {
    c.userData.locked = true;
    // children should not be considered selectable roots
    c.userData.selectableRoot = false;
  }
});

// add to scene and export
scene.add(lemari);
export { lemari };
