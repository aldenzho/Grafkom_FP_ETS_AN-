    import { THREE, scene , roomW } from './room.js';
     import {bedCenterZ} from './bed.js'; 
 // === Desk ===
    const deskW = 3, deskD = 1.35, deskH = 0.75;
    const deskX = -roomW / 2 + deskW / 2 + 0.1;
    const deskZ = bedCenterZ - 4.5;

    // Muat tekstur dari bed.jpg
    const deskTexture = new THREE.TextureLoader().load('/texture/bed.jpg');
    deskTexture.wrapS = THREE.RepeatWrapping;
    deskTexture.wrapT = THREE.RepeatWrapping;
    deskTexture.repeat.set(2, 2); // supaya teksturnya tidak terlalu besar

    // Material dengan tekstur bed.jpg
    const deskMat = new THREE.MeshStandardMaterial({
      map: deskTexture,
      metalness: 0.3,
      roughness: 0.7,
    });

    // Bagian atas meja
    const deskTop = new THREE.Mesh(
      new THREE.BoxGeometry(deskW, 0.05, deskD),
      deskMat
    );
    deskTop.position.set(deskX, deskH, deskZ);
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    deskTop.name = 'Desk';
    scene.add(deskTop);

    // Kaki meja 
    const legG = new THREE.BoxGeometry(0.2, deskH, 0.2);
    const legM = new THREE.MeshStandardMaterial({ map: deskTexture });

    function makeLeg(oX, oZ) {
      const leg = new THREE.Mesh(legG, legM);
      leg.position.set(
        deskTop.position.x + oX * (deskW / 2.1 - 0.025),
        deskH / 2,
        deskTop.position.z + oZ * (deskD / 2.25 - 0.025)
      );
      leg.castShadow = true;
      leg.receiveShadow = true;
      scene.add(leg);
    }

    makeLeg(1, 1);
    makeLeg(1, -1);
    makeLeg(-1, 1);
    makeLeg(-1, -1);

    export{deskX, deskW, deskZ, deskTop}