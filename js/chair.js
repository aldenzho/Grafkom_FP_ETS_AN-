     import { THREE, scene  } from './room.js';
     import { deskX, deskZ  } from './desk.js';
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

      // Kursi kecil di depan meja (pakai Rounded Box)
    const chairSeatGeom = createRoundedBox(0.6, 0.05, 0.6, 0.08, 4);
    const chairSeatMat = new THREE.MeshStandardMaterial({
      color: 0x444444,
      roughness: 0.4,
      metalness: 0.2
    });

    const chairSeat = new THREE.Mesh(chairSeatGeom, chairSeatMat);
    chairSeat.position.set(deskX + 0.1, 0.45, deskZ + 0.65);
    chairSeat.castShadow = true;
    chairSeat.receiveShadow = true;
    scene.add(chairSeat);


    const chairLegGeom = new THREE.BoxGeometry(0.05, 0.45, 0.05);
    const chairLegMat = new THREE.MeshStandardMaterial({ color: 0x222222 });

    function makeChairLeg(offsetX, offsetZ) {
      const leg = new THREE.Mesh(chairLegGeom, chairLegMat);
      leg.position.set(
        chairSeat.position.x + offsetX * 0.25,
        0.225,
        chairSeat.position.z + offsetZ * 0.25
      );
      leg.castShadow = true;
      leg.receiveShadow = true;
      scene.add(leg);
    }

    makeChairLeg(1, 1);
    makeChairLeg(1, -1);
    makeChairLeg(-1, 1);
    makeChairLeg(-1, -1);

// Sandaran kursi (pakai Rounded Box)
    const backrestGeom = createRoundedBox(0.6, 0.6, 0.05, 0.08, 4);
    const backrestMat = new THREE.MeshStandardMaterial({
      color: 0x444444,
      roughness: 0.5,
      metalness: 0.1
    });

    const backrest = new THREE.Mesh(backrestGeom, backrestMat);
    backrest.position.set(
      chairSeat.position.x,
      chairSeat.position.y + 0.35, // naik sedikit dari dudukan
      chairSeat.position.z + 0.275 // di belakang kursi
    );
    backrest.castShadow = true;
    backrest.receiveShadow = true;
    scene.add(backrest);

    export{chairSeat}
