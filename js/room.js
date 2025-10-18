// room.js (with bloom effect on lamp)
import * as THREE from "https://esm.sh/three@0.150.0";
import { OrbitControls } from "https://esm.sh/three@0.150.0/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "https://esm.sh/three@0.150.0/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://esm.sh/three@0.150.0/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "https://esm.sh/three@0.150.0/examples/jsm/postprocessing/UnrealBloomPass.js";

const container = document.getElementById('container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfd1e5);

const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
camera.position.set(0,1.6,3);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0,1,0);
controls.enableDamping = true;
controls.dampingFactor = 0.06;

// room params
const roomW = 7, roomD = 7, roomH = 3;
const loader = new THREE.TextureLoader();

function safeLoadTexture(url, repeat = null) {
    const tex = loader.load(url,
        t => {
            t.needsUpdate = true;
            if(repeat) {
                t.wrapS = t.wrapT = THREE.RepeatWrapping;
                t.repeat.set(repeat[0], repeat[1]);
            }
        },
        undefined,
        e => { console.warn(`Texture ${url} failed to load. Using fallback.`, e); }
    );
    if(!tex.image) tex.image = document.createElement('canvas');
    return tex;
}

const wallTex = safeLoadTexture('./texture/wall.jpg', [2, 1]);
const floorTex = safeLoadTexture('./texture/floor.jpg', [4, 4]);

const wallMat = new THREE.MeshStandardMaterial({ map: wallTex, side: THREE.DoubleSide });
const floorMat = new THREE.MeshStandardMaterial({ map: floorTex });

const floor = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomD), floorMat);
floor.rotation.x = -Math.PI/2; floor.receiveShadow = true; floor.name='Floor'; scene.add(floor);

const wallG = new THREE.PlaneGeometry(roomW, roomH);
const wallBack = new THREE.Mesh(wallG, wallMat.clone()); wallBack.position.set(0,roomH/2,-roomD/2); wallBack.name='Wall Back'; scene.add(wallBack);
const wallFront = new THREE.Mesh(wallG, wallMat.clone()); wallFront.position.set(0,roomH/2,roomD/2); wallFront.rotation.y = Math.PI; wallFront.name='Wall Front'; scene.add(wallFront);
const wallLeft = new THREE.Mesh(wallG, wallMat.clone()); wallLeft.position.set(-roomW/2,roomH/2,0); wallLeft.rotation.y = Math.PI/2; wallLeft.name='Wall Left'; scene.add(wallLeft);

// wall with window
const shape = new THREE.Shape();
shape.moveTo(-roomW/2,0); shape.lineTo(roomW/2,0); shape.lineTo(roomW/2,roomH); shape.lineTo(-roomW/2,roomH); shape.lineTo(-roomW/2,0);
const windowW = 2.0, windowH = 1.5, windowCenterY = 1.5;
const hx = windowW/2, hyL = windowCenterY-windowH/2, hyH = windowCenterY+windowH/2;
const hole = new THREE.Path(); hole.moveTo(-hx,hyL); hole.lineTo(hx,hyL); hole.lineTo(hx,hyH); hole.lineTo(-hx,hyH); hole.lineTo(-hx,hyL);
shape.holes.push(hole);
const wallRightGeo = new THREE.ShapeGeometry(shape);
wallRightGeo.computeBoundingBox();
const max = wallRightGeo.boundingBox.max, min = wallRightGeo.boundingBox.min;
const offset = new THREE.Vector2(0-min.x, 0-min.y); const range = new THREE.Vector2(max.x-min.x, max.y-min.y);
const pos = wallRightGeo.attributes.position, uvs = [];
for(let i=0;i<pos.count;i++){ const x=pos.getX(i), y=pos.getY(i); uvs.push((x+offset.x)/range.x,(y+offset.y)/range.y); }
wallRightGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs,2));
const wallRight = new THREE.Mesh(wallRightGeo, wallMat); wallRight.rotation.y = -Math.PI/2; wallRight.position.set(roomW/2,0,0); wallRight.name='Wall Window'; scene.add(wallRight);

const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomD), wallMat.clone());
ceiling.position.set(0,roomH,0); ceiling.rotation.x = Math.PI/2; ceiling.receiveShadow = true; ceiling.name='Ceiling'; scene.add(ceiling);

// window glass
const windowGlass = new THREE.Mesh(new THREE.PlaneGeometry(windowW, windowH), new THREE.MeshStandardMaterial({ color:0x87CEEB, transparent:true, opacity:0.4, side:THREE.DoubleSide }));
windowGlass.position.set(roomW/2 - 0.01, windowCenterY, 0); windowGlass.rotation.y = -Math.PI/2; windowGlass.name='Window Glass'; scene.add(windowGlass);

// lamp + light + bloom
const lampLight = new THREE.PointLight(0xfff8e7, 0.9, 10);
lampLight.position.set(0,2.6,0);
lampLight.castShadow = true;
scene.add(lampLight);

const bulbMat = new THREE.MeshStandardMaterial({
  emissive: 0xffffaa,
  emissiveIntensity: 1.2,
  color: 0xffffff
});
const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), bulbMat);
bulb.position.copy(lampLight.position);
bulb.name = 'Bulb';
scene.add(bulb);

// sunlight
const sunlight = new THREE.DirectionalLight(0xffffff, 1.2);
sunlight.position.set(roomW, 2.2, 0);
sunlight.target.position.set(0,0,0);
sunlight.castShadow = true;
sunlight.shadow.mapSize.width = sunlight.shadow.mapSize.height = 2048;
sunlight.shadow.camera.left = -5; sunlight.shadow.camera.right =5;
sunlight.shadow.camera.top =5; sunlight.shadow.camera.bottom = -5;
scene.add(sunlight); scene.add(sunlight.target);

const ambient = new THREE.AmbientLight(0xffffff, 0.18);
scene.add(ambient);

// curtains
const curtainMat = new THREE.MeshStandardMaterial({ color:0x882233, side:THREE.DoubleSide });
const curtainLeft = new THREE.Mesh(new THREE.PlaneGeometry(windowW/2, windowH+0.2, 4, 4), curtainMat.clone());
const curtainRight = new THREE.Mesh(new THREE.PlaneGeometry(windowW/2, windowH+0.2, 4, 4), curtainMat.clone());
curtainLeft.position.set(roomW/2 - 0.02, windowCenterY, -windowW/4); curtainLeft.rotation.y = -Math.PI/2; curtainLeft.name='Curtain Left';
curtainRight.position.set(roomW/2 - 0.02, windowCenterY, windowW/4); curtainRight.rotation.y = -Math.PI/2; curtainRight.name='Curtain Right';
curtainLeft.userData.closedPosZ = -windowW/4; curtainLeft.userData.openPosZ = -windowW/4 - 0.9;
curtainRight.userData.closedPosZ = windowW/4; curtainRight.userData.openPosZ = windowW/4 + 0.9;
scene.add(curtainLeft); scene.add(curtainRight);

// skybox
const skyboxLoader = new THREE.CubeTextureLoader();
const skyboxTexture = skyboxLoader.load([
  'https://threejs.org/examples/textures/cube/Bridge2/posx.jpg',
  'https://threejs.org/examples/textures/cube/Bridge2/negx.jpg',
  'https://threejs.org/examples/textures/cube/Bridge2/posy.jpg',
  'https://threejs.org/examples/textures/cube/Bridge2/negy.jpg',
  'https://threejs.org/examples/textures/cube/Bridge2/posz.jpg',
  'https://threejs.org/examples/textures/cube/Bridge2/negz.jpg'
]);
scene.background = skyboxTexture;
scene.environment = skyboxTexture;

// --- BLOOM EFFECT ---
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,   // strength
  0.4,   // radius
  0.85   // threshold
);
composer.addPass(bloomPass);

// --- Render loop ---
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  composer.render(); // render with bloom
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  composer.setSize(innerWidth, innerHeight);
});

// exports
export { THREE, safeLoadTexture, sunlight, lampLight, scene, camera, renderer, controls, roomW, roomD, bulb, windowGlass, wallRight, curtainLeft, curtainRight, floor, wallBack, wallFront, wallLeft, ceiling, ambient, skyboxTexture };
