// tambahkan import di paling atas file ui.js (bersama import lainnya)
import { DragControls } from "https://esm.sh/three@0.150.0/examples/jsm/controls/DragControls.js";
import { roomW, roomD } from './room.js'; // sudah diexport di room.js

// ui.js (replace existing)
import { bedMesh, blanketMesh } from './bed.js';
import { deskTop } from './desk.js';
import { pillow1, pillow2 } from './pillow.js';
import { chairSeat } from './chair.js';
import { THREE, lampLight, scene, sunlight, controls, camera, renderer, bulb, curtainLeft, curtainRight, floor, windowGlass, wallRight, wallBack, wallFront, wallLeft, ceiling, ambient, skyboxTexture } from './room.js';
import { rug } from './rug.js';

// selectable list
const selectables = [bedMesh, blanketMesh, pillow1, pillow2, deskTop, chairSeat, bulb, windowGlass, wallRight, rug, curtainLeft, curtainRight, floor, wallBack, wallFront, wallLeft, ceiling];


const ray = new THREE.Raycaster(); const pointer = new THREE.Vector2();
let hoverObj = null, selected = null;

document.getElementById('ui').style.display = 'none';

function setHover(obj){
  if(hoverObj && hoverObj !== obj && hoverObj.userData._origEmissive){
    if(hoverObj.material && hoverObj.material.emissive) hoverObj.material.emissive.copy(hoverObj.userData._origEmissive);
  }
  hoverObj = obj;
  document.getElementById('hoverName').textContent = hoverObj ? (hoverObj.name || 'Unnamed') : '—';
  if(hoverObj){
    if(!hoverObj.userData._origEmissive && hoverObj.material && hoverObj.material.emissive) hoverObj.userData._origEmissive = hoverObj.material.emissive.clone();
    if(hoverObj.material && hoverObj.material.emissive) hoverObj.material.emissive.setHex(0x222222);
  }
}

function onMove(e){
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  ray.setFromCamera(pointer, camera);
  const ints = ray.intersectObjects(selectables, true);
  setHover(ints.length ? ints[0].object : null);
}

function onDown(e){
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  ray.setFromCamera(pointer, camera);
  const ints = ray.intersectObjects(selectables, true);
  if(ints.length){
    const obj = ints[0].object;
    if(obj===curtainLeft || obj===curtainRight){ ui.animCurt.click(); deselect(); return; }
    if(obj===bulb){ ui.toggleLamp.click(); deselect(); return; }
    select(obj);
  } else deselect();
}

renderer.domElement.addEventListener('pointermove', onMove);
renderer.domElement.addEventListener('pointerdown', onDown);

// UI elements
const ui = {
  title: document.getElementById('selectedTitle'),
  color: document.getElementById('color'),
  opacity: document.getElementById('opacity'),
  opval: document.getElementById('opval'),
  wire: document.getElementById('wire'),
  phongUI: document.getElementById('phongUI'),
  shin: document.getElementById('shin'),
  shinVal: document.getElementById('shinVal'),
  stdUI: document.getElementById('stdUI'),
  metal: document.getElementById('metal'),
  metVal: document.getElementById('metVal'),
  rough: document.getElementById('rough'),
  rghVal: document.getElementById('rghVal'),
  focusBtn: document.getElementById('focusBtn'),
  closeBtn: document.getElementById('closeBtn'),
  resetBtn: document.getElementById('resetBtn'),
  sunS: document.getElementById('sun'), sunV: document.getElementById('sunV'),
  lampS: document.getElementById('lamp'), lampV: document.getElementById('lampV'),
  toggleCurt: document.getElementById('toggleCurt'), animCurt: document.getElementById('animCurt'),
  toggleLamp: document.getElementById('toggleLamp'), blinkLamp: document.getElementById('blinkLamp'),
  screenshotBtn: document.getElementById('screenshot'),
  presetName: document.getElementById('presetName'), savePreset: document.getElementById('savePreset'), presetList: document.getElementById('presetList'),
  loadPreset: document.getElementById('loadPreset'), delPreset: document.getElementById('delPreset'), perfBtn: document.getElementById('perfBtn'),
  // dynamically create lampColor & day/night if not present in HTML
  lampColor: (() => { let el = document.getElementById('lampColor'); if(!el){ el = document.createElement('input'); el.type='color'; el.id='lampColor'; el.value='#fff2b2'; el.style.width='46px'; el.style.height='30px'; el.style.border='0'; const row = document.createElement('div'); row.className='row'; const label = document.createElement('label'); label.textContent='Lamp Color'; row.appendChild(label); row.appendChild(el); document.getElementById('ui').insertBefore(row, document.getElementById('perfBtn').parentNode); } return document.getElementById('lampColor'); })(),
  dayBtn: (() => { let b = document.getElementById('dayBtn'); if(!b){ b = document.createElement('button'); b.className='small'; b.id='dayBtn'; b.textContent='Day'; const row = document.createElement('div'); row.className='row'; const label = document.createElement('label'); label.textContent='Time'; row.appendChild(label); row.appendChild(b); document.getElementById('ui').insertBefore(row, document.getElementById('perfBtn').parentNode); } return document.getElementById('dayBtn'); })(),
  nightBtn: (() => { let b = document.getElementById('nightBtn'); if(!b){ b = document.createElement('button'); b.className='small'; b.id='nightBtn'; b.textContent='Night'; const containerRow = document.createElement('div'); containerRow.style.display='flex'; containerRow.style.gap='8px'; containerRow.appendChild(b); document.getElementById('dayBtn').parentNode.appendChild(containerRow); } return document.getElementById('nightBtn'); })()
};

// helper: save original material properties
function saveOriginalMat(obj){
  if(!obj.userData._origMat && obj.material){
    obj.userData._origMat = {
      originalMaterial: obj.material.clone(),
      color: obj.material.color ? obj.material.color.clone() : null,
      emissive: obj.material.emissive ? obj.material.emissive.clone() : null,
      opacity: obj.material.opacity,
      wireframe: !!obj.material.wireframe,
      shininess: obj.material.shininess !== undefined ? obj.material.shininess : null,
      metalness: obj.material.metalness !== undefined ? obj.material.metalness : null,
      roughness: obj.material.roughness !== undefined ? obj.material.roughness : null
    };
  }
}

function select(obj){
  if(selected && selected.userData && selected.userData._origEmissive && selected.material.emissive) selected.material.emissive.copy(selected.userData._origEmissive);
  selected = obj;
  saveOriginalMat(selected);
  document.getElementById('ui').style.display = 'block';
  ui.title.textContent = selected.name || 'Selected';
  if(selected.material && selected.material.color) ui.color.value = '#' + selected.material.color.getHexString();
  ui.opacity.value = selected.material.opacity !== undefined ? selected.material.opacity : 1; ui.opval.textContent = parseFloat(ui.opacity.value).toFixed(2);
  ui.wire.checked = !!selected.material.wireframe;
  if(selected.material instanceof THREE.MeshPhongMaterial){
    ui.phongUI.style.display = 'block'; ui.stdUI.style.display = 'none';
    ui.shin.value = selected.material.shininess !== undefined ? selected.material.shininess : 30; ui.shinVal.textContent = ui.shin.value;
  } else if(selected.material instanceof THREE.MeshStandardMaterial){
    ui.phongUI.style.display = 'none'; ui.stdUI.style.display = 'block';
    ui.metal.value = selected.material.metalness !== undefined ? selected.material.metalness : 0;
    ui.rough.value = selected.material.roughness !== undefined ? selected.material.roughness : 1;
    ui.metVal.textContent = parseFloat(ui.metal.value).toFixed(2);
    ui.rghVal.textContent = parseFloat(ui.rough.value).toFixed(2);
  } else { ui.phongUI.style.display = ui.stdUI.style.display = 'none'; }
}

function deselect(){
  if(selected){ if(selected.userData && selected.userData._origEmissive && selected.material.emissive) selected.material.emissive.copy(selected.userData._origEmissive); }
  selected = null; document.getElementById('ui').style.display = 'none';
}

// UI listeners
ui.color.addEventListener('input', e => { if(selected && selected.material && selected.material.color) selected.material.color.set(e.target.value); });
ui.opacity.addEventListener('input', e => { ui.opval.textContent = parseFloat(e.target.value).toFixed(2); if(selected && selected.material){ selected.material.opacity = parseFloat(e.target.value); selected.material.transparent = selected.material.opacity < 1; selected.material.needsUpdate = true; } });
ui.wire.addEventListener('change', e => { if(selected && selected.material) selected.material.wireframe = e.target.checked; });
ui.shin.addEventListener('input', e => { ui.shinVal.textContent = e.target.value; if(selected && selected.material instanceof THREE.MeshPhongMaterial) selected.material.shininess = parseFloat(e.target.value); });
ui.metal.addEventListener('input', e => { ui.metVal.textContent = parseFloat(e.target.value).toFixed(2); if(selected && selected.material instanceof THREE.MeshStandardMaterial) selected.material.metalness = parseFloat(e.target.value); });
ui.rough.addEventListener('input', e => { ui.rghVal.textContent = parseFloat(e.target.value).toFixed(2); if(selected && selected.material instanceof THREE.MeshStandardMaterial) selected.material.roughness = parseFloat(e.target.value); });

// lighting UI
ui.sunS.addEventListener('input', e => { sunlight.intensity = parseFloat(e.target.value); ui.sunV.textContent = parseFloat(e.target.value).toFixed(1); });
ui.lampS.addEventListener('input', e => { lampLight.intensity = parseFloat(e.target.value); ui.lampV.textContent = parseFloat(e.target.value).toFixed(1); bulb.material.emissiveIntensity = lampLight.intensity; });

// lamp color control
ui.lampColor.addEventListener('input', e => {
  const hex = e.target.value;
  bulb.material.color.set(hex);
  const c = new THREE.Color(hex);
  lampLight.color.copy(c);
});

// Time of day helpers (uses ambient & skyboxTexture imported from room.js)
function setTimeOfDay(mode){
  if(mode === 'night'){
    sunlight.intensity = 0.15; ui.sunS.value = sunlight.intensity; ui.sunV.textContent = sunlight.intensity.toFixed(2);
    lampLight.intensity = Math.max(0.9, parseFloat(ui.lampS.value)); ui.lampS.value = lampLight.intensity; ui.lampV.textContent = lampLight.intensity.toFixed(2);
    scene.background = new THREE.Color(0x041428);
    ambient.intensity = 0.12;
  } else {
    sunlight.intensity = 1.2; ui.sunS.value = sunlight.intensity; ui.sunV.textContent = sunlight.intensity.toFixed(2);
    lampLight.intensity = 0.9; ui.lampS.value = lampLight.intensity; ui.lampV.textContent = lampLight.intensity.toFixed(2);
    scene.background = skyboxTexture;
    ambient.intensity = 0.18;
  }
}
ui.dayBtn.addEventListener('click', ()=> setTimeOfDay('day'));
ui.nightBtn.addEventListener('click', ()=> setTimeOfDay('night'));

// curtains toggle/animation (unchanged)
let curtainsOpen = false; let curtAnimating = false;
ui.toggleCurt.addEventListener('click', () => {
  curtainsOpen = !curtainsOpen;
  curtainLeft.position.z = curtainsOpen ? curtainLeft.userData.openPosZ : curtainLeft.userData.closedPosZ;
  curtainRight.position.z = curtainsOpen ? curtainRight.userData.openPosZ : curtainRight.userData.closedPosZ;
});
ui.animCurt.addEventListener('click', () => {
  if(curtAnimating) return; curtAnimating = true; curtainsOpen = !curtAnimating ? !curtainsOpen : curtainsOpen; // safety
  curtainsOpen = !curtainsOpen;
  const frames = 40; let t=0;
  const startL = curtainLeft.position.z, startR = curtainRight.position.z;
  const targetL = curtainsOpen ? curtainLeft.userData.openPosZ : curtainLeft.userData.closedPosZ;
  const targetR = curtainsOpen ? curtainRight.userData.openPosZ : curtainRight.userData.closedPosZ;
  const anim = () => { t++; const alpha = t/frames; const ease = (--alpha)*alpha*alpha + 1; curtainLeft.position.z = THREE.MathUtils.lerp(startL, targetL, ease); curtainRight.position.z = THREE.MathUtils.lerp(startR, targetR, ease); if(t < frames) requestAnimationFrame(anim); else curtAnimating = false; };
  anim();
});

// screenshot
ui.screenshotBtn.addEventListener('click', ()=> { try { renderer.render(scene, camera); const dataURL = renderer.domElement.toDataURL('image/png'); const a = document.createElement('a'); a.href = dataURL; a.download = 'room_screenshot.png'; a.click(); } catch(err) { alert('Screenshot failed: ' + err.message); } });

// focus
ui.focusBtn.addEventListener('click', ()=> {
  if(!selected) return;
  const box = new THREE.Box3().setFromObject(selected);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3()).length();
  const distance = Math.max(size * 1.5, 2.5);
  const dir = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
  const newPos = center.clone().add(dir.multiplyScalar(distance));
  const startPos = camera.position.clone(), startTarget = controls.target.clone(); const frames = 36; let t=0;
  const anim = () => { t++; const alpha = t/frames; const ease = 0.5 - Math.cos(alpha * Math.PI) / 2; camera.position.lerpVectors(startPos, newPos, ease); controls.target.lerpVectors(startTarget, center, ease); controls.update(); if(t<frames) requestAnimationFrame(anim); };
  anim();
});

ui.closeBtn.addEventListener('click', ()=> deselect());

// Reset material
ui.resetBtn.addEventListener('click', ()=> { if(!selected || !selected.userData || !selected.userData._origMat) return; const oldEmissive = selected.material.emissive ? selected.material.emissive.clone() : null; selected.material = selected.userData._origMat.originalMaterial.clone(); selected.material.needsUpdate = true; if(oldEmissive) selected.material.emissive.copy(oldEmissive); select(selected); });

// presets (unchanged)
function refreshPresetList(){ const sel = ui.presetList; sel.innerHTML = '<option value="">-- choose preset --</option>'; const keys = Object.keys(localStorage).filter(k=>k.startsWith('roomPreset:')); keys.forEach(k=>{ const name = k.replace('roomPreset:',''); const opt = document.createElement('option'); opt.value = k; opt.textContent = name; sel.appendChild(opt); }); }
refreshPresetList();

ui.savePreset.addEventListener('click', ()=> { if(!selected) { alert('Select an object first'); return; } const name = (ui.presetName.value || selected.name || 'preset').trim(); if(!name) { alert('Enter preset name'); return; } const data = { material: { color: selected.material.color ? selected.material.color.getHexString() : null, opacity: selected.material.opacity, wireframe: !!selected.material.wireframe, shininess: selected.material.shininess !== undefined ? selected.material.shininess : null, metalness: selected.material.metalness !== undefined ? selected.material.metalness : null, roughness: selected.material.roughness !== undefined ? selected.material.roughness : null } }; localStorage.setItem('roomPreset:' + name, JSON.stringify(data)); refreshPresetList(); alert('Preset saved: ' + name); });

ui.loadPreset.addEventListener('click', ()=> { const key = ui.presetList.value; if(!key) return alert('Choose preset'); const json = localStorage.getItem(key); if(!json) return alert('Preset not found'); const data = JSON.parse(json); if(!selected) return alert('Select object first to apply preset'); const m = selected.material; const oldEmissive = m.emissive ? m.emissive.clone() : null; if(data.material.color && m.color) m.color.set('#' + data.material.color); if(data.material.opacity !== undefined) { m.opacity = data.material.opacity; m.transparent = m.opacity < 1; } if(data.material.wireframe !== undefined) m.wireframe = data.material.wireframe; if(data.material.shininess !== null && m.shininess !== undefined) m.shininess = data.material.shininess; if(data.material.metalness !== null && m.metalness !== undefined) m.metalness = data.material.metalness; if(data.material.roughness !== null && m.roughness !== undefined) m.roughness = data.material.roughness; m.needsUpdate = true; if(oldEmissive) m.emissive.copy(oldEmissive); alert('Preset applied'); select(selected); });

ui.delPreset.addEventListener('click', ()=> { const key = ui.presetList.value; if(!key) return alert('Choose preset to delete'); localStorage.removeItem(key); refreshPresetList(); alert('Preset deleted'); });

// performance toggle
let lowQuality = false;
ui.perfBtn.addEventListener('click', ()=> {
  lowQuality = !lowQuality;
  if(lowQuality){
    renderer.setPixelRatio(1);
    renderer.shadowMap.enabled = false;
    sunlight.shadow.mapSize.width = sunlight.shadow.mapSize.height = 512;
    ui.perfBtn.textContent = 'High Quality';
  } else {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    sunlight.shadow.mapSize.width = sunlight.shadow.mapSize.height = 2048;
    ui.perfBtn.textContent = 'Low Quality';
  }
});

// lamp toggle & blink
let lampOn = true, blinkInterval = null;
ui.toggleLamp.addEventListener('click', ()=> {
  lampOn = !lampOn;
  lampLight.intensity = lampOn ? parseFloat(ui.lampS.value) : 0;
  bulb.material.emissiveIntensity = lampOn ? lampLight.intensity : 0;
  if (blinkInterval) { clearInterval(blinkInterval); blinkInterval = null; }
});
ui.blinkLamp.addEventListener('click', ()=>{
  if(blinkInterval){
    clearInterval(blinkInterval);
    blinkInterval=null;
    lampLight.intensity = lampOn ? parseFloat(ui.lampS.value) : 0;
    bulb.material.emissiveIntensity = lampOn ? lampLight.intensity : 0;
    return;
  }
  let on = true;
  if (!lampOn) { lampOn = true; }
  blinkInterval = setInterval(()=>{ on=!on; lampLight.intensity = on ? parseFloat(ui.lampS.value) : 0; bulb.material.emissiveIntensity = lampLight.intensity; }, 350);
});

// dblclick bulb -> toggle
renderer.domElement.addEventListener('dblclick', (e)=> {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  ray.setFromCamera(pointer, camera);
  const ints = ray.intersectObjects([bulb], true);
  if(ints.length) { ui.toggleLamp.click(); }
});

// animation loop
function animate(){
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', ()=> { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });

// fill preset dropdown on load
refreshPresetList();
