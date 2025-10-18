   import { THREE, scene } from './room.js'; 
    import { leftX, bedCenterZ, bedD, bedH} from './bed.js'; 
    const pillowMat = new THREE.MeshStandardMaterial({ color:0xffffff, roughness:0.8 });

    function makePillow(x,z, name){ const g=new THREE.SphereGeometry(0.32,32,32); const m=pillowMat.clone(); const p=new THREE.Mesh(g,m); p.scale.set(1.5,0.45,1.85); p.position.set(x, bedH + 0.32*0.45, z); p.castShadow=true; p.receiveShadow=true; p.name = name; scene.add(p); return p; }
    const pillow1 = makePillow(leftX + 0.625, bedCenterZ + bedD/2 - 0.95, "Pillow L");
    const pillow2 = makePillow(leftX + 0.625, bedCenterZ + bedD/2 - 2.15, "Pillow R");

    function createRoundedBox(width, height, depth, radius, smoothness) {
      const shape = new THREE.Shape();
      const eps = 0.00001;
      const radius0 = radius - eps;
      shape.absarc(eps, eps, eps, -Math.PI / 2, -Math.PI, true);
      shape.absarc(eps, height - radius * 2, radius0, Math.PI, Math.PI / 2, true);
      shape.absarc(width - radius * 2, height - radius * 2, radius0, Math.PI / 2, 0, true);
      shape.absarc(width - radius * 2, eps, radius0, 0, -Math.PI / 2, true);
      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: depth - radius * 2,
        bevelEnabled: true,
        bevelSegments: smoothness * 2,
        steps: 1,
        bevelSize: radius,
        bevelThickness: radius,
        curveSegments: smoothness
      });
      geometry.center();
      return geometry;
    }

    export{pillow1, pillow2}