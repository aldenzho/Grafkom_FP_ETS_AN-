// room.js (replace existing)
import * as THREE from "https://esm.sh/three@0.150.0";
import { OrbitControls } from "https://esm.sh/three@0.150.0/examples/jsm/controls/OrbitControls.js";

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

// textures helper
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

// optional maps (if present)


const wallMat = new THREE.MeshStandardMaterial({ map: wallTex, side: THREE.DoubleSide });
const floorMat = new THREE.MeshStandardMaterial({ map: floorTex});

const floor = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomD), floorMat);
floor.rotation.x = -Math.PI/2; floor.receiveShadow = true; floor.name='Floor'; scene.add(floor);

// walls back/front/left
const wallG = new THREE.PlaneGeometry(roomW, roomH);
const wallBack = new THREE.Mesh(wallG, wallMat.clone()); wallBack.position.set(0,roomH/2,-roomD/2); wallBack.name='Wall Back'; scene.add(wallBack);
const wallFront = new THREE.Mesh(wallG, wallMat.clone()); wallFront.position.set(0,roomH/2,roomD/2); wallFront.rotation.y = Math.PI; wallFront.name='Wall Front'; scene.add(wallFront);
const wallLeft = new THREE.Mesh(wallG, wallMat.clone()); wallLeft.position.set(-roomW/2,roomH/2,0); wallLeft.rotation.y = Math.PI/2; wallLeft.name='Wall Left'; scene.add(wallLeft);

// right wall with window hole
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

// ceiling
const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomD), wallMat.clone()); ceiling.position.set(0,roomH,0); ceiling.rotation.x = Math.PI/2; ceiling.receiveShadow = true; ceiling.name='Ceiling'; scene.add(ceiling);

// window glass + frame
const windowGlass = new THREE.Mesh(new THREE.PlaneGeometry(windowW, windowH), new THREE.MeshStandardMaterial({ color:0x87CEEB, transparent:true, opacity:0.4, side:THREE.DoubleSide }));
windowGlass.position.set(roomW/2 - 0.01, windowCenterY, 0); windowGlass.rotation.y = -Math.PI/2; windowGlass.name='Window Glass'; scene.add(windowGlass);

const frameMat = new THREE.MeshStandardMaterial({ color:0x333333 });
const frameOffset = roomW/2 + 0.02; const frameThickness = 0.05;
const frameTop = new THREE.Mesh(new THREE.BoxGeometry(windowW+0.05,0.1,frameThickness), frameMat); frameTop.position.set(frameOffset, windowCenterY+windowH/2+0.05, 0); frameTop.rotation.y = -Math.PI/2; frameTop.name='Frame Top'; scene.add(frameTop);
const frameBottom = frameTop.clone(); frameBottom.position.set(frameOffset, windowCenterY-windowH/2-0.05,0); frameBottom.name='Frame Bottom'; scene.add(frameBottom);
const frameLeft = new THREE.Mesh(new THREE.BoxGeometry(frameThickness, windowH+0.05, frameThickness), frameMat); frameLeft.position.set(frameOffset, windowCenterY, -windowW/2-0.025); frameLeft.rotation.y = -Math.PI/2; frameLeft.name='Frame Left'; scene.add(frameLeft);
const frameRight = frameLeft.clone(); frameRight.position.set(frameOffset, windowCenterY, windowW/2 + 0.025); frameRight.name='Frame Right'; scene.add(frameRight);

// lamp & bulb
const lampLight = new THREE.PointLight(0xfff8e7, 0.9, 10); lampLight.position.set(0,2.6,0); lampLight.castShadow=true; scene.add(lampLight);
const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), new THREE.MeshStandardMaterial({ emissive: 0xffffaa, emissiveIntensity: 0.9, color: 0xffffff }));
bulb.position.copy(lampLight.position); bulb.name='Bulb'; scene.add(bulb);

// sunlight
const sunlight = new THREE.DirectionalLight(0xffffff, 1.2); sunlight.position.set(roomW, 2.2, 0); sunlight.target.position.set(0,0,0); sunlight.castShadow=true;
sunlight.shadow.mapSize.width = sunlight.shadow.mapSize.height = 2048;
sunlight.shadow.camera.left = -5; sunlight.shadow.camera.right =5; sunlight.shadow.camera.top =5; sunlight.shadow.camera.bottom = -5;
scene.add(sunlight); scene.add(sunlight.target);

// ambient light (exported)
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

// skybox (exported)
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

// exports (include ambient & skyboxTexture)
export { THREE, safeLoadTexture, sunlight, lampLight, scene, camera, renderer, controls, roomW, roomD, bulb, windowGlass, wallRight, curtainLeft, curtainRight, floor, wallBack, wallFront, wallLeft, ceiling, ambient, skyboxTexture };
