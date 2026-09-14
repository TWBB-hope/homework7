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

// （第二步将加入：恒星、行星、卫星与轨道）
// （第三步将加入：动画循环与点击交互）
