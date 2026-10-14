# 敦煌视觉素材

## 飞天壁画

- 本地文件：`dunhuang-flying-apsaras.jpg`，608 × 606，下载原图，页面使用局部裁切；未重新着色。
- 作品：敦煌莫高窟第 285 窟飞天壁画，西魏，6 世纪中叶。
- 作者：古代佚名画工。
- 来源：[Wikimedia Commons — Dunhuang mural flying apsarasa.jpg](https://commons.wikimedia.org/wiki/File:Dunhuang_mural_flying_apsarasa.jpg)。
- 原图：<https://upload.wikimedia.org/wikipedia/commons/f/f8/Dunhuang_mural_flying_apsarasa.jpg>。
- 来源页许可标注：Public domain；API `AttributionRequired=false`。查询日期：2026-09-19。
- 来源页给出的出版信息：Fan Jinshi (2008), *The Caves of Dunhuang*, Scala, p. 75, ISBN 978-1857595406。
- 用途：首页「陇原人文」卡片与敦煌文化介绍页，均为文化展示，不充当活动照片或会员肖像。

## 西安城墙摄影（黑金版）

- 本地文件：`xian-city-wall.jpg`，524 × 285。
- 来源：[Wikimedia Commons — Xi'an city wall (cropped).jpg](https://commons.wikimedia.org/wiki/File:Xi%27an_city_wall_(cropped).jpg)。
- 作者信息：ismsOweak / Guucancat；来源页许可标注 CC0，查询日期 2026-09-19。
- 原图：<https://upload.wikimedia.org/wikipedia/commons/6/6d/Xi%27an_city_wall_%28cropped%29.jpg>。
- 用途：示例活动的城市氛围封面，非浐灞集合点照片、非活动实拍。
- 原文件未改动；显示时裁切、降低饱和度和亮度。图库署名与页面来源链接保留。

## 当前图形处理

黑金版移除上一版的卡通山水、花形纹样和彩色头像。正文保留统一 1.5 px 线性图标，分隔使用单条细线。壁画仍为独立图片，页面文字、按钮、组件可编辑；未使用 AI 图片生成服务。


## 第五版：莫高窟与砂金（2026-09-20）

当前六页已替换飞天主视觉。用户提供的三张参考仅用于讨论配色和构图，未作为页面素材，也未去除其中水印。

- `mogao-caves.jpg`：G41rn8，[Dunhuang 0507 329](https://commons.wikimedia.org/wiki/File:Dunhuang_0507_329.jpg)，[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。
- `mogao-sand-cutout.png`：上述摄影的裁切、砂金双色调与透明蒙版衍生作品，保留 CC BY-SA 4.0。处理代码：`prepare-mogao-texture.swift`。文化详情使用原照片，首页使用衍生素材；均非活动实拍。
- `mingsha-dunes.jpg`：David Stanley，[Mingsha Sand Dunes (40098545980)](https://commons.wikimedia.org/wiki/File:Mingsha_Sand_Dunes_(40098545980).jpg)，[CC BY 2.0](https://creativecommons.org/licenses/by/2.0/)。
- `sand-landscape.png`：鸣沙山摄影的裁切、砂金调色与透明蒙版衍生作品，保留 CC BY 2.0；处理代码：`prepare-sand-texture.swift`。
- `flowing-sand-button.png`：代码绘制的原创 UI 材质，模拟明暗沙脊与细微颗粒。按钮文字为独立可编辑图层。
- `refinement.html` 中的新流沙提案采用 CSS 多段金色渐变与弧形细线，并提供一次性流光演示；遵循系统减少动态效果设置。
- 西安城墙照片继续作为活动示例封面，保留前述 CC0 来源。历史飞天、青绿版素材仅用于版本对照。


## 当前版本：浅砂墨金与驼队底图（2026-09-20）

- `mingsha-caravan.jpg`：N509FZ，[Camel convoys at Singing Sand Dunes (20230918084444)](https://commons.wikimedia.org/wiki/File:Camel_convoys_at_Singing_Sand_Dunes_(20230918084444).jpg)，[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)，使用 960 px 缩略图。画面为敦煌鸣沙山的现代游客驼队，用于地域氛围，不表示历史驼队或本会活动实拍。
- `caravan-backdrop.png`：上述驼队照片与前述 David Stanley / CC BY 2.0 鸣沙山照片的衍生合成，保留 CC BY-SA 4.0；变更包括砂色调色、降低对比、透明淡化、组合与缩放。处理代码：`prepare-caravan-backdrop.swift`。所有前景文字、卡片和按钮仍为独立界面图层。
- 主按钮现采用 `tokens.js` 的六段线性渐变，浏览器与 Figma 生成器共用色阶。流纹为原创矢量弧线；旧的 `flowing-sand-button.png` 仅供历史样式对照。

- 最新微调提高了驼队与沙丘的显影强度；合成文件仍沿用相同署名与许可。`sand-grain.png` 为原创半透明细沙颗粒，用于覆盖流沙渐变并形成哑光质感；生成代码：`prepare-sand-grain.swift`。

- `mogao-color-cutout.png`：当前首页使用的莫高窟衍生素材，由 G41rn8 / CC BY-SA 4.0 原照片裁切、透明处理、暗部提亮与轻微暖色调整而成，保留原建筑色彩。沿用 CC BY-SA 4.0；处理代码 `prepare-mogao-color.swift`。`mogao-sand-cutout.png` 为历史砂金版本。

## 原生小程序包（2026-10-06）

- `mogao.png` 来自 `mogao-color-cutout.png`，仅等比缩小至最长边 320px；保留 G41rn8 / CC BY-SA 4.0 的作者、来源及衍生许可。
- `caravan.jpg` 来自 `caravan-backdrop.png`，许可沿用上述 CC BY-SA 4.0；2026-10-12确认源图所有像素均不透明后，使用sips以JPEG质量85编码，保持780×1688尺寸。原包内caravan.png已移除。
- `sand-grain.png` 来自参考包同名原创 UI 纹理，用于首页砂金按钮的颗粒层。
- `tabs/*.png` 为本应用通过 scripts/make-icons.py 绘制的线性导航图标，无第三方图像来源。

2026-10-12资源编码优化：`mogao.png`与`sand-grain.png`使用pngquant 3.0.3（speed 1；质量区间分别65–85、85–100）压缩为索引色PNG，保留原尺寸和透明通道；属于有损颜色量化，未重绘构图，作者及衍生许可不变。压缩前包内三张原文件备份于仓库`output/package-assets-originals/`，不进入`dist/`。未向项目添加压缩工具依赖。
