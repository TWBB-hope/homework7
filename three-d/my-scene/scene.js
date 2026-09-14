// 自主实践：星球宇宙（Three.js版）
// 第一步：环境层——场景、相机、渲染器、星空背景与光照系统

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050514);          // 深空底色

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 300);
camera.position.set(0, 9, 17);                         // 俯视整个星系
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;                         // 阻尼：拖拽有惯性，手感更顺

// ---- 星空背景：500个随机点组成的点云 ----
const starGeo = new THREE.BufferGeometry();
const starPos = new Float32Array(500 * 3);
for (let i = 0; i < 500; i++) {
  // 随机方向单位向量 × 随机半径(60~100)，撒成球壳星幕
  const r = 60 + Math.random() * 40;
  const theta = Math.random() * Math.PI * 2;           // 经度
  const phi = Math.acos(2 * Math.random() - 1);        // 纬度
  starPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
  starPos[i * 3 + 1] = r * Math.cos(phi);
  starPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
}
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
const stars = new THREE.Points(
  starGeo,
  new THREE.PointsMaterial({ color: 0xbfd4ff, size: 0.6, sizeAttenuation: true })
);
scene.add(stars);

// ---- 光照系统：恒星是唯一"真实"光源，环境光给暗面兜底 ----
scene.add(new THREE.AmbientLight(0x334066, 0.5));      // 微弱蓝环境光：行星夜面不死黑
const sunLight = new THREE.PointLight(0xffe8b0, 1.6, 120);
sunLight.position.set(0, 0, 0);                        // 点光源放在恒星中心
scene.add(sunLight);

// ================= 第二步：主体层 =================

// ---- 恒星：双层球壳（内层实心自发光 + 外层半透明光晕） ----
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(1.6, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xffca62 })     // Basic材质自发光，不受光照
);
sun.userData.name = '恒星·烛心';
scene.add(sun);

const sunGlow = new THREE.Mesh(
  new THREE.SphereGeometry(1.9, 32, 32),
  new THREE.MeshBasicMaterial({
    color: 0xffb74d, transparent: true, opacity: 0.15, side: THREE.BackSide
  })
);
scene.add(sunGlow);

// ---- 行星数据表：改这里就能加/改行星 ----
const planetData = [
  { name: '蓝星',   radius: 0.55, dist: 4.4, color: 0x4fc3f7, orbitSpeed: 0.55, spinSpeed: 0.9,  moon: true  },
  { name: '环巨星', radius: 0.95, dist: 7.4, color: 0xd7a86e, orbitSpeed: 0.30, spinSpeed: 0.6,  ring: true  },
  { name: '红土星', radius: 0.40, dist: 10.2, color: 0xef5350, orbitSpeed: 0.18, spinSpeed: 0.45 }
];

const planets = [];        // 供动画与点击拾取使用

// ---- 轨道线：用LineLoop画一圈淡色圆 ----
function makeOrbitLine(radius) {
  const pts = [];
  for (let i = 0; i <= 96; i++) {
    const a = (i / 96) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
  }
  return new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(pts),
    new THREE.LineBasicMaterial({ color: 0x2a3550, transparent: true, opacity: 0.9 })
  );
}

planetData.forEach((data, i) => {
  const startAngle = (i / planetData.length) * Math.PI * 2;   // 三颗行星错开出发

  // 轨道组：旋转组即可带动行星公转（与展示台的Group同一思路）
  const orbitGroup = new THREE.Group();
  orbitGroup.rotation.y = startAngle;
  scene.add(orbitGroup);
  scene.add(makeOrbitLine(data.dist));

  // 行星本体：Standard材质受光，背光面暗、向光面亮
  const planet = new THREE.Mesh(
    new THREE.SphereGeometry(data.radius, 32, 32),
    new THREE.MeshStandardMaterial({ color: data.color, emissive: 0x0a1020, emissiveIntensity: 0.6 })
  );
  planet.position.set(data.dist, 0, 0);
  planet.userData.name = data.name;
  orbitGroup.add(planet);
  planets.push({ data, orbitGroup, planet, startAngle });

  // 行星环：压扁的圆环(Torus)，倾斜着套在环巨星上
  if (data.ring) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(data.radius + 0.75, 0.07, 8, 64),
      new THREE.MeshStandardMaterial({ color: 0xb08968 })
    );
    ring.position.set(data.dist, 0, 0);
    ring.rotation.x = 1.25;                             // 弧度！倾斜约72度
    orbitGroup.add(ring);
  }

  // 卫星：小轨道组挂在蓝星的轨道组里，跟着行星一起公转
  if (data.moon) {
    const moonOrbit = new THREE.Group();
    moonOrbit.position.set(data.dist, 0, 0);
    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xcfd8dc })
    );
    moon.position.set(1.2, 0.25, 0);
    moonOrbit.add(moon);
    orbitGroup.add(moonOrbit);
    planets.push({ data: { name: '蓝星的卫星', orbitSpeed: 2.2 }, orbitGroup: moonOrbit, planet: moon, startAngle: 0 });
  }
});

// ================= 第三步：动画与交互 =================

const clock = new THREE.Clock();
const label = document.getElementById('label');

const animate = () => {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();                     // 秒，做平滑动画用

  // 公转：轨道角 = 初始角 + 时间 × 角速度（换算出稳定的匀速公转）
  planets.forEach(p => {
    p.orbitGroup.rotation.y = p.startAngle + t * p.data.orbitSpeed;
    if (p.data.spinSpeed) p.planet.rotation.y = t * p.data.spinSpeed;   // 自转
  });

  // 恒星呼吸：半径与光强随sin微幅脉动
  const pulse = 1 + 0.04 * Math.sin(t * 2);
  sun.scale.setScalar(pulse);
  sunGlow.scale.setScalar(pulse);
  sunLight.intensity = 1.6 + 0.25 * Math.sin(t * 2);

  stars.rotation.y += 0.0003;                           // 星幕极缓慢旋转

  controls.update();                                    // 阻尼生效必须每帧update
  renderer.render(scene, camera);
};
animate();

// ---- Raycaster点击拾取：屏幕坐标 → NDC → 射线 → 求交 → 高亮+标签 ----
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let selected = null;

function clearSelection() {
  if (selected) selected.planet.material.emissive.setHex(0x0a1020);
  selected = null;
  label.style.display = 'none';
}

renderer.domElement.addEventListener('pointerdown', (e) => {
  // 1) 鼠标像素坐标 → 归一化设备坐标NDC，x/y ∈ [-1,1]，y轴要取反
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  // 2) 从相机发射一条穿过该点的射线，与行星数组求交
  raycaster.setFromCamera(pointer, camera);
  const picks = planets.filter(p => p.data.spinSpeed);  // 只拾取行星本体（卫星除外）
  const hits = raycaster.intersectObjects(picks.map(p => p.planet), false);
  clearSelection();
  if (hits.length) {
    const hit = hits[0].object;                         // 最近的命中即被点中的物体
    selected = picks.find(p => p.planet === hit);
    selected.planet.material.emissive.setHex(0x1b3a66); // 提高自发光=高亮
    label.textContent = '已选中：' + hit.userData.name;
    label.style.left = (e.clientX + 14) + 'px';
    label.style.top = (e.clientY - 10) + 'px';
    label.style.display = 'block';
  }
});

// ---- 窗口适配：相机宽高比、投影矩阵、画布尺寸三者同步更新 ----
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
