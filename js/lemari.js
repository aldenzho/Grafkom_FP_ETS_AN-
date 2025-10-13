// js/lemari.js
import { THREE, scene , safeLoadTexture, roomW, roomD } from './room.js';

// load texture
const textureLoader = new THREE.TextureLoader();
const woodTexture = textureLoader.load('./texture/lemari.jpg');
woodTexture.wrapS = woodTexture.wrapT = THREE.RepeatWrapping;
woodTexture.repeat.set(2, 2);

// group
const lemari = new THREE.Group();

// materials (unlit)```

    const bodyLemari = textureLoader.load('./texture/lemari.jpg');

    // body
    const bodyGeo = new THREE.BoxGeometry(3.7, 3, 0.8);
    const bodyMat = new THREE.MeshStandardMaterial({
      map: woodTexture,
      roughness: 0.6,
      metalness: 0.3
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.castShadow = true;
    body.receiveShadow = true;
    body.position.set(0, 1.5, 0);
    lemari.add(body);

    // left door
    // Pintu kiri (pakai tekstur hitam)
      const doorGeo = new THREE.BoxGeometry(1.83, 3, 0.05);
    const doorMat = new THREE.MeshStandardMaterial({
      map: bodyLemari,
      roughness: 0.7,
      metalness: 0.3,
    });
    const doorLeft = new THREE.Mesh(doorGeo, doorMat);
    doorLeft.position.set(-0.93, 1.5, 0.42);
    doorLeft.castShadow = true;
    doorLeft.receiveShadow = true;
    lemari.add(doorLeft);

    // Pintu kanan (pakai tekstur hitam juga)
    const doorRight = new THREE.Mesh(doorGeo, doorMat);
    doorRight.position.set(0.93, 1.5, 0.3);
    doorRight.castShadow = true;
    doorRight.receiveShadow = true;
    lemari.add(doorRight);
// handles (optional small boxes)
    // Pegangan pintu (warna abu logam)
    const handleGeo = new THREE.BoxGeometry(0.05, 1, 0.05);
    const handleMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.2 });

    const handleLeft = new THREE.Mesh(handleGeo, handleMat);
    handleLeft.position.set(-1.75, 1.5, 0.47);
    handleLeft.castShadow = true;
    lemari.add(handleLeft);

    const handleRight = new THREE.Mesh(handleGeo, handleMat);
    handleRight.position.set(1.75, 1.5, 0.43);
    handleRight.castShadow = true;
    lemari.add(handleRight);

    // Posisi lemari di dalam kamar
    lemari.position.set(1.5, 0, -3);
    scene.add(lemari);
// position group in room
lemari.position.set(1.5, 0, -3);



// add to scene and export
scene.add(lemari);
export { lemari };
