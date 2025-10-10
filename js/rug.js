    import { THREE, scene  } from './room.js';
    import { bedCenterZ, bedD, bedCenterX} from './bed.js'; 


    const rug = new THREE.Mesh(new THREE.PlaneGeometry(1.6,1.6), new THREE.MeshStandardMaterial({    color: 0x000000,  roughness:0.9 }));
    rug.rotation.x = -Math.PI/2; rug.position.set(bedCenterX - 0.4, 0.01, bedCenterZ + bedD/2 - 5.3); rug.receiveShadow = true; rug.name='Rug'; scene.add(rug);

    export {rug}