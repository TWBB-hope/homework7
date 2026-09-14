# homework7 · Three.js与A-Frame浏览器三维开发

《软件开发综合实践》课堂作业七仓库。全部作品在 `three-d/` 文件夹下，本地库文件在 `three-d/libs/`（three.js r128、OrbitControls r128、A-Frame 1.5.0，均取自官方发布渠道），**可离线直接打开运行**。

## 文件结构

| 文件 | 内容 | 对应任务 |
| --- | --- | --- |
| `three-d/showcase.html` + `showcase.js` | Three.js 旋转展示台：圆柱底座＋3个几何体展品＋双光源＋缓转动画＋OrbitControls | 案例复现（上午场） |
| `three-d/campus.html` | A-Frame 校园角标：天空、草地、教学楼、飘动旗帜、脉动路灯光、两棵树（自行添加） | 案例复现（下午场） |
| `three-d/my-scene/index.html` + `scene.js` | 自主实践「星球宇宙」：恒星（双层球壳＋呼吸动画）、3颗行星＋行星环＋卫星、轨道线、500点星幕、Raycaster点击高亮＋名称标签 | 自主实践基本要求 |
| `three-d/perf-test.html` | 性能对比实验台：antialias开关 × 物体数量（20/200/600），内置实时与近3秒平均帧率统计 | 独立研究任务3 |

## 运行方式

- 直接双击各 html 文件用浏览器（Chrome/Edge）打开即可；
- 或在该目录起本地服务：`python3 -m http.server 8000`，访问 `http://localhost:8000/three-d/...`。

## 操作说明

- **showcase / my-scene**：左键拖拽旋转、滚轮缩放、右键平移；my-scene 中点击行星会高亮并显示名称标签。
- **campus**：WASD走动、鼠标环顾（A-Frame默认）。
- **perf-test**：切换抗锯齿与物体数量，等待3秒读"近3秒平均"帧率作为记录数据。

## 提交记录

代码按"展示台 → A-Frame场景 → 星球场景（环境→主体→动画）→ 性能实验 → README"分步提交，`git log --oneline` 共9次提交（8次代码＋1次进度报告），已推送至 GitHub。

## 提交物清单（雨课堂）

1. 仓库地址：本仓库；
2. 源代码文件（three-d 文件夹打包）；
3. 运行截图（至少两张不同视角）；
4. 课堂实践进度报告七（Word）。
