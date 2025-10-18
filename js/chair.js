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

// Create a group for the chair
const chair = new THREE.Group();
chair.name = 'Chair';

// Place the group so children positions are relative to this point.
// This matches the previous world position of the seat center.
const seatWorldX = deskX + 0.1;
const seatWorldZ = deskZ + 0.65;
chair.position.set(seatWorldX, 0, seatWorldZ);

// Seat (relative to group)
const chairSeatGeom = createRoundedBox(0.6, 0.05, 0.6, 0.08, 4);
const chairSeatMat = new THREE.MeshStandardMaterial({
  color: 0x444444,
  roughness: 0.4,
  metalness: 0.2
});
const chairSeat = new THREE.Mesh(chairSeatGeom, chairSeatMat);
chairSeat.position.set(0, 0.45, 0); // relative to group
chairSeat.castShadow = true;
chairSeat.receiveShadow = true;
chairSeat.name = 'Chair Seat';
chair.add(chairSeat);

// Legs (relative positions from seat center)
const chairLegGeom = new THREE.BoxGeometry(0.05, 0.45, 0.05);
const chairLegMat = new THREE.MeshStandardMaterial({ color: 0x222222 });

function makeChairLeg(offsetX, offsetZ) {
  const leg = new THREE.Mesh(chairLegGeom, chairLegMat);
  leg.position.set(offsetX * 0.25, 0.225, offsetZ * 0.25); // relative to group
  leg.castShadow = true;
  leg.receiveShadow = true;
  leg.name = 'Chair Leg';
  chair.add(leg);
}

makeChairLeg(1, 1);
makeChairLeg(1, -1);
makeChairLeg(-1, 1);
makeChairLeg(-1, -1);

// Backrest
const backrestGeom = createRoundedBox(0.6, 0.6, 0.05, 0.08, 4);
const backrestMat = new THREE.MeshStandardMaterial({
  color: 0x444444,
  roughness: 0.5,
  metalness: 0.1
});
const backrest = new THREE.Mesh(backrestGeom, backrestMat);
backrest.position.set(0, 0.8, 0.275); // relative to group: seat.y(0.45) + 0.35 => 0.8
backrest.castShadow = true;
backrest.receiveShadow = true;
backrest.name = 'Chair Backrest';
chair.add(backrest);

// Mark group as selectable root, allow editing of child meshes
chair.userData.selectableRoot = true;
chair.userData.locked = false;
chair.traverse((c) => {
  if (c.isMesh) {
    c.userData.locked = false;
    c.userData.selectableRoot = false;
  }
});

// Add to scene as a single object
scene.add(chair);

// Keep backward-compatible export of chairSeat (in case other modules import it)
export { chair, chairSeat };
