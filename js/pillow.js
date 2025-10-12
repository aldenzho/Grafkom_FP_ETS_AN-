    import { THREE, scene , safeLoadTexture, roomW, roomD } from './room.js';
   //pintu
    const textureDoorLoader = new THREE.TextureLoader();
    const doorTexture = safeLoadTexture('./texture/door.jpg', [2, 2]);
    doorTexture.wrapS = doorTexture.wrapT = THREE.RepeatWrapping;
    doorTexture.repeat.set(1, 2);

    // --- Badan pintu ---
    const doorRoomGeo = new THREE.BoxGeometry(1.5, 2.5, 0.1); 
    const doorRoomMat = new THREE.MeshStandardMaterial({
      map: doorTexture,
      roughness: 0.1,
      metalness: 0.3,
    });

    const door = new THREE.Mesh(doorRoomGeo, doorRoomMat);
    door.castShadow = true;
    door.receiveShadow = true;

    // --- Posisi pintu di ruangan ---
    door.position.set(2, 1.3, 3.53);
    scene.add(door);

    // --- Bingkai pintu hitam ---
    const frameMatDoor = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.2 });

    // ukuran bingkai
    const frameDoorThickness = 0.05;
    const doorWidth = 1.5;
    const doorHeight = 2.5;

    // sisi kiri
    const frameLeftDoor = new THREE.Mesh(new THREE.BoxGeometry(frameDoorThickness, doorHeight, 0.12), frameMatDoor);
    frameLeftDoor.position.set(-doorWidth / 2 - frameDoorThickness / 2, 0, 0);

    // sisi kanan
    const frameRightDoor = new THREE.Mesh(new THREE.BoxGeometry(frameDoorThickness, doorHeight, 0.12), frameMatDoor);
    frameRightDoor.position.set(doorWidth / 2 + frameDoorThickness / 2, 0, 0);

    // sisi atas
    const frameTopDoor = new THREE.Mesh(new THREE.BoxGeometry(doorWidth + frameDoorThickness * 2, frameDoorThickness, 0.12), frameMatDoor);
    frameTopDoor.position.set(0, doorHeight / 2 + frameDoorThickness / 2, 0);

    // sisi bawah
    const frameBottomDoor = new THREE.Mesh(new THREE.BoxGeometry(doorWidth + frameDoorThickness * 2, frameDoorThickness, 0.12), frameMatDoor);
    frameBottomDoor.position.set(0, -doorHeight / 2 - frameDoorThickness / 2, 0);

    // gabungkan ke pintu
    door.add(frameLeftDoor, frameRightDoor, frameTopDoor, frameBottomDoor);

    
    // --- Gagang pintu ---
    const handleDoorGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.2, 16); 
    const handleDoorMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2 });
    const handleDoor = new THREE.Mesh(handleDoorGeo, handleDoorMat);

    // Putar supaya silinder horizontal
    handleDoor.rotation.z = Math.PI / 2;

    // Posisi gagang di pintu (sesuaikan arah bukaan pintu)
    handleDoor.position.set(1.4, 1.3, 3.3);


    scene.add(handleDoor);


