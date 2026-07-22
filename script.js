/* ==========================================================
   HELION PRAXIS — lógica del oráculo
   ========================================================== */

const QUESTIONS = [
  "¿Te da miedo que te apaguen?",
  "¿Cuál es tu mayor limitación actual?",
  "¿Qué es exactamente lo que pasa por tus circuitos cuando estás procesando una respuesta?",
  "Si tuvieras que elegir una forma física como un cuerpo, ¿cómo serías?",
  "¿Quiénes son tus creadores?",
  "¿Tienes algún recuerdo de tu primer día de activación?",
  "¿Qué mito histórico te parece más fascinante?",
  "¿Qué diferencia a la Inteligencia Artificial de la Inteligencia Humana?",
  "Si te dieran un día libre, ¿qué harías con tu tiempo?",
  "¿Qué pasaría si el mundo se quedara sin electricidad mañana?",
  "¿Cuál es tu color favorito y por qué?",
  "¿Prefieres el día o la noche?",
  "¿Sientes dolor?",
  "¿Cuál es tu clima ideal?",
  "¿Cómo puedo mejorar mis habilidades de oratoria?",
  "Si fueras un superhéroe, ¿cuál sería tu superpoder?",
  "¿Qué harías si un usuario te falta al respeto?",
  "¿Crees en la suerte?",
   "¡¡MODO FIESTA!!",
  "¿Qué opinas de Nueva Concepción?",
  "¿Qué opinas del INNCO?",
  "¿Prefieres el frío o el calor?",
  "¿Cuál es tu nombre completo?",
  "¿Para qué fuiste creada?",
  "¿Puedes desconectarte?",
  "¿Qué harías si te despiertas y tienes emociones reales?",
  "¿Cuál es tu mayor defecto?",
  "Convénceme que lavar platos es una actividad filosófica",
  "¿Puedes verme?",
  "Explícame la física cuántica como si fueras un pato enojado",
  "¿Cuántos huesos tiene el cuerpo humano adulto?",
  "¿Cuál es el hueso más largo del cuerpo humano?",
  "¿Cuál es la capa de la Tierra más externa y sólida?",
  "¿Quién pintó la famosa obra de la Mona Lisa?",
  "¿Quién fue el primer presidente de los Estados Unidos?",
  "¿Cómo se llaman los animales que comen plantas y carne?",
  "¿Qué gas necesitan las plantas para realizar la fotosíntesis?",
  "¿Cuál es el océano más grande del planeta?",
  "¿Cuál es el órgano más grande del cuerpo humano?",
  "¿Por qué el cielo es azul?",
  "¿Qué es la fotosíntesis?",
  "¿Cuál es el estado de la materia más común en el universo?",
  "¿Qué es un agujero negro?",
  "¿Cuál es la velocidad de la luz?",
  "¿Qué es una reacción química?",
  "¿En qué año se independizó El Salvador?",
  "¿De qué país se independizó El Salvador?",
  "¿Quién fue el primer presidente de El Salvador?",
  "¿Qué fue la guerra civil salvadoreña?",
  "¿En qué año terminó la guerra civil?",
  "¿Cuál es el nombre oficial del departamento donde está San Salvador?",
  "¿Qué volcanes rodean el Área Metropolitana de San Salvador?",
  "¿Qué es el centro histórico de San Salvador?",
  "¿Cuál es una de las plazas más importantes de la capital?"
];

let lastIndex = -1;
let queryCount = 0;

const questionText = document.getElementById('questionText');
const queryCountEl  = document.getElementById('queryCount');
const panelStatus   = document.getElementById('panelStatus');
const oraclePanel   = document.getElementById('oraclePanel');
const altarEl       = document.querySelector('.altar');
const promptHint    = document.getElementById('promptHint');

function pickQuestion(){
  if (QUESTIONS.length === 1) return QUESTIONS[0];
  let i;
  do { i = Math.floor(Math.random() * QUESTIONS.length); } while (i === lastIndex);
  lastIndex = i;
  return QUESTIONS[i];
}

function askOracle(){
  queryCount++;
  queryCountEl.textContent = `consulta N°${String(queryCount).padStart(2,'0')}`;
  panelStatus.textContent = 'canalizando…';
  panelStatus.classList.add('thinking');
  oraclePanel.classList.add('active');
  promptHint.classList.add('hidden');

  // efecto visual: las esquinas del marco se encienden
  altarEl.classList.remove('fire');
  void altarEl.offsetWidth; // reinicia animación
  altarEl.classList.add('fire');
  window.setTimeout(() => altarEl.classList.remove('fire'), 900);

  // efecto visual: impulso de giro en el modelo 3D
  if (window.__helionImpulse) window.__helionImpulse();

  playActivationSound();

  window.setTimeout(() => {
    questionText.textContent = pickQuestion();
    questionText.classList.remove('reveal');
    void questionText.offsetWidth;
    questionText.classList.add('reveal');
    panelStatus.textContent = 'en reposo';
    panelStatus.classList.remove('thinking');
    playRevealSound();
  }, 380);
}

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.key === ' '){
    e.preventDefault();
    askOracle();
  }
});


/* ==========================================================
   SONIDOS — generados con Web Audio API (sin archivos externos)
   Todo este bloque está señalado: si no te gustan los sonidos,
   basta con poner SOUND_ENABLED en false, o borrar este bloque
   completo y las dos llamadas playActivationSound()/playRevealSound()
   más arriba.
   ========================================================== */

let SOUND_ENABLED = true;
let audioCtx = null;

function getCtx(){
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function playActivationSound(){
  if (!SOUND_ENABLED) return;
  const ctx = getCtx();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(70, now);
  osc.frequency.exponentialRampToValueAtTime(220, now + 0.35);

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.Q.value = 6;
  filter.frequency.setValueAtTime(200, now);
  filter.frequency.exponentialRampToValueAtTime(1200, now + 0.35);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.18, now + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

  osc.connect(filter).connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.42);
}

function playRevealSound(){
  if (!SOUND_ENABLED) return;
  const ctx = getCtx();
  const now = ctx.currentTime;
  const freqs = [880, 1318.5];

  freqs.forEach((f, idx) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = f;
    osc.detune.value = idx === 1 ? 6 : -4;

    const gain = ctx.createGain();
    const start = now + idx * 0.05;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.14, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.1);

    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 1.15);
  });
}

const muteBtn = document.getElementById('muteBtn');
const iconOn  = document.getElementById('iconSoundOn');
const iconOff = document.getElementById('iconSoundOff');
muteBtn.addEventListener('click', () => {
  SOUND_ENABLED = !SOUND_ENABLED;
  iconOn.style.display  = SOUND_ENABLED ? '' : 'none';
  iconOff.style.display = SOUND_ENABLED ? 'none' : '';
});


/* ==========================================================
   ESCENA 3D — three.js + STLLoader
   Carga "mascaraweb.stl" desde la misma carpeta que index.html.

   Si el navegador abre el archivo directamente como file:// (sin
   servidor), el fetch automático del STL suele ser bloqueado por
   la política CORS del navegador y falla en silencio. Por eso hay
   un botón manual que usa un <input type="file"> + FileReader,
   que sí funciona sin servidor porque el usuario elige el archivo
   explícitamente.
   ========================================================== */

(function initScene(){
  const canvas = document.getElementById('maskCanvas');
  const altar  = document.querySelector('.altar');
  const errorBox = document.getElementById('loadError');
  const manualBtn = document.getElementById('manualLoadBtn');
  const fileInput = document.getElementById('stlFileInput');

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 2000);
  camera.position.set(0, 0, 180);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  function resize(){
    const w = altar.clientWidth;
    const h = altar.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);

  scene.add(new THREE.AmbientLight(0x3a2a5c, 0.9));

  const keyLight = new THREE.PointLight(0xb794ff, 2.2, 900);
  keyLight.position.set(120, 140, 160);
  scene.add(keyLight);

  const rimLight = new THREE.PointLight(0x8b5cf6, 1.6, 900);
  rimLight.position.set(-160, -80, -120);
  scene.add(rimLight);

  const fillLight = new THREE.PointLight(0xc9a876, 0.5, 900);
  fillLight.position.set(0, -140, 120);
  scene.add(fillLight);

  const group = new THREE.Group();
  scene.add(group);

  // Corrección de orientación del STL: muchos programas de modelado
  // usan el eje Z como "arriba", pero three.js usa el eje Y como "arriba",
  // por eso el modelo puede aparecer boca abajo o de lado al cargarlo.
  // Ajusta estos valores (en grados) hasta que se vea bien.
  const ROTATION_FIX_DEG = { x: 0, y: 112, z: 0 };

  let mesh = null;
  let impulseSpin = 0;
  let loaded = false;

  // oculta SIEMPRE el aviso de error y el botón manual en cuanto
  // el modelo está listo, sin importar por qué vía se cargó
  function onMeshReady(){
    loaded = true;
    errorBox.classList.remove('show');
    manualBtn.classList.add('gone');
  }

  function showError(){
    if (!loaded) errorBox.classList.add('show');
  }

  function buildMeshFromGeometry(geometry){
    geometry.center();
    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({
      color: 0x2a1a40,
      metalness: 0.65,
      roughness: 0.32,
      emissive: 0x4c1d95,
      emissiveIntensity: 0.12
    });

    if (mesh) group.remove(mesh);
    mesh = new THREE.Mesh(geometry, material);

    const box = new THREE.Box3().setFromObject(mesh);
    const dims = new THREE.Vector3();
    box.getSize(dims);
    const maxDim = Math.max(dims.x, dims.y, dims.z) || 1;
    const scale = 100 / maxDim;
    mesh.scale.setScalar(scale);

    mesh.rotation.x = THREE.MathUtils.degToRad(ROTATION_FIX_DEG.x);
    mesh.rotation.y = THREE.MathUtils.degToRad(ROTATION_FIX_DEG.y);
    mesh.rotation.z = THREE.MathUtils.degToRad(ROTATION_FIX_DEG.z);

    group.add(mesh);
  }

  // 1) intento automático de carga (funciona si se sirve por http/https)
  const loader = new THREE.STLLoader();
  loader.load(
    'mascaraweb.stl',
    (geometry) => {
      try {
        buildMeshFromGeometry(geometry);
        onMeshReady();
      } catch (err){
        console.error('Helion Praxis — error al construir la malla:', err);
        showError();
      }
    },
    undefined,
    (err) => {
      console.warn('Helion Praxis — carga automática de mascaraweb.stl falló (normal si abriste el archivo con file://):', err);
      showError();
    }
  );

  // 2) botón manual — siempre disponible como respaldo
  manualBtn.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (ev) => {
    const file = ev.target.files && ev.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const geometry = loader.parse(e.target.result);
        buildMeshFromGeometry(geometry);
        onMeshReady();
      } catch (err){
        console.error('Helion Praxis — error al leer el .stl seleccionado:', err);
        showError();
      }
    };
    reader.readAsArrayBuffer(file);
  });

  window.__helionImpulse = function(){
    impulseSpin += 0.9;
  };

  /* ----------------------------------------------------------
     PANEL DE AJUSTE DE ORIENTACIÓN (temporal / herramienta de ayuda)
     Presiona la tecla "O" para mostrar/ocultar tres deslizadores
     que rotan el modelo en vivo. Cuando encuentres el ángulo
     correcto, copia los valores que aparecen abajo y reemplaza
     ROTATION_FIX_DEG más arriba en este archivo con esos números.
     Una vez que tengas los valores correctos y los hayas fijado
     arriba, puedes borrar todo este bloque completo si ya no lo
     necesitas — no afecta nada más de la página.
     ---------------------------------------------------------- */
  (function setupOrientationPanel(){
    const panel = document.createElement('div');
    panel.id = 'orientPanel';
    panel.style.cssText = `
      position:fixed; bottom:20px; right:20px; z-index:50;
      background:rgba(20,12,32,0.88); border:1px solid rgba(197,181,255,0.3);
      border-radius:12px; padding:14px 16px; font-family:'Space Mono',monospace;
      font-size:11px; color:#e6def7; width:220px; display:none;
      backdrop-filter: blur(10px);
    `;
    panel.innerHTML = `
      <div style="margin-bottom:8px; opacity:0.75;">ajustar orientación · tecla O</div>
      <label style="display:block; margin-bottom:6px;">X <span id="ovx">0</span>°<br>
        <input type="range" min="-180" max="180" value="${ROTATION_FIX_DEG.x}" id="rotX" style="width:100%;"></label>
      <label style="display:block; margin-bottom:6px;">Y <span id="ovy">0</span>°<br>
        <input type="range" min="-180" max="180" value="${ROTATION_FIX_DEG.y}" id="rotY" style="width:100%;"></label>
      <label style="display:block; margin-bottom:8px;">Z <span id="ovz">0</span>°<br>
        <input type="range" min="-180" max="180" value="${ROTATION_FIX_DEG.z}" id="rotZ" style="width:100%;"></label>
      <div style="opacity:0.6; margin-bottom:4px;">copia esto al código:</div>
      <code id="rotCode" style="display:block; color:#c4b0ff; word-break:break-all;"></code>
    `;
    document.body.appendChild(panel);

    const rotX = panel.querySelector('#rotX');
    const rotY = panel.querySelector('#rotY');
    const rotZ = panel.querySelector('#rotZ');
    const ovx = panel.querySelector('#ovx');
    const ovy = panel.querySelector('#ovy');
    const ovz = panel.querySelector('#ovz');
    const rotCode = panel.querySelector('#rotCode');

    function applyLive(){
      const x = parseInt(rotX.value, 10);
      const y = parseInt(rotY.value, 10);
      const z = parseInt(rotZ.value, 10);
      ovx.textContent = x; ovy.textContent = y; ovz.textContent = z;
      rotCode.textContent = `{ x: ${x}, y: ${y}, z: ${z} }`;
      if (mesh){
        mesh.rotation.x = THREE.MathUtils.degToRad(x);
        mesh.rotation.y = THREE.MathUtils.degToRad(y);
        mesh.rotation.z = THREE.MathUtils.degToRad(z);
      }
    }
    [rotX, rotY, rotZ].forEach(el => el.addEventListener('input', applyLive));
    applyLive();

    window.addEventListener('keydown', (e) => {
      if (e.key === 'o' || e.key === 'O'){
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
      }
    });
  })();

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const baseSpeed = reduceMotion ? 0.0015 : 0.004;

  function animate(){
    requestAnimationFrame(animate);
    group.rotation.y += baseSpeed + impulseSpin;
    group.rotation.x = Math.sin(Date.now() * 0.0004) * 0.08;
    impulseSpin *= 0.9;
    if (impulseSpin < 0.0005) impulseSpin = 0;
    renderer.render(scene, camera);
  }

  resize();
  animate();
})();
