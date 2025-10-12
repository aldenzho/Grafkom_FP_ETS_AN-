 import { THREE, scene , safeLoadTexture, roomW, roomD } from './room.js';
 const bedTex = safeLoadTexture('./texture/bed.jpg'); bedTex.wrapS = bedTex.wrapT = THREE.RepeatWrapping; // Bed has no specific repeat
 const blanketTex = safeLoadTexture('./texture/blanket.jpg', [2, 2]);

  const bedMat = new THREE.MeshStandardMaterial({ map: bedTex, roughness:0.7, metalness:0 });
  const blanketMat = new THREE.MeshStandardMaterial({ map: blanketTex, roughness:1, metalness:0, normalScale: new THREE.Vector2(0.5, 0.5)});

   // bed, blanket, pillows
    const bedW = roomW*0.6, bedD = roomD/2 - 0.2, bedH = 0.5;
    const leftX = -roomW/2; const bedCenterX = leftX + bedW/2; const bedCenterZ = roomD/2 - bedD/2 - 0.05;
    const bedMesh = new THREE.Mesh(new THREE.BoxGeometry(bedW, bedH, bedD), bedMat); bedMesh.position.set(bedCenterX, bedH/2, bedCenterZ); bedMesh.castShadow=true; bedMesh.receiveShadow=true; bedMesh.name='Bed'; scene.add(bedMesh);
    const blanketMesh = new THREE.Mesh(new THREE.BoxGeometry(bedW-0.05, 0.05, bedD-0.05), blanketMat); blanketMesh.position.set(bedCenterX, bedH+0.025, bedCenterZ); blanketMesh.castShadow=true; blanketMesh.receiveShadow=true; blanketMesh.name='Blanket'; scene.add(blanketMesh);

    export {bedCenterZ, leftX, bedD, bedH, bedCenterX, bedMesh, blanketMesh}
