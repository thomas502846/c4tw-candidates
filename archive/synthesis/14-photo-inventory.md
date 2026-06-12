# 14 — c4twweb 照片資產 inventory

> 設計成敗的硬約束：**照片無法重拍**，所有 design 變體必須從既有照片庫反推。
> 採集日期：2026-05-10。從 創照官網 + 伯拉罕官網 + 4 個 FB 專頁 + c4tw 本機。
> 全部素材在 `/home/thomas/c4twweb/assets/photos/`。

---

## 0. 總量

| 來源 | 已下載 | 主要 tier 分布 | 備註 |
|---|---|---|---|
| `logo/` | 5 | masters | 從 c4tw 本機 |
| `carefortaiwan/` | 15 | 3 hero / 16 main / 7 thumb / 7 tiny | 27 MB；WP/Elementor 原圖；最高品質 |
| `plahan/` | 13 | 1 hero / 6 main / 3 thumb / 10 tiny | 3.6 MB；伯拉罕官網 |
| `fb-cft/` | 85 | 1 hero / 86 thumb / 11 tiny | 3.2 MB；CFT 課程現場 |
| `fb-plahan/` | 54 | 1 hero / 5 main / 49 thumb / 11 tiny | 2.9 MB；伯拉罕日常 |
| `fb-together/` | 82 | 3 main / 79 thumb / 12 tiny | 3.9 MB；鄰里123／共生之家 |
| `fb-wenshan/` | 13 | 3 main / 10 thumb / 11 tiny | 0.8 MB；文山義工日常 |
| **總計** | **267** | | ~45 MB |

**重要觀察**：
- **carefortaiwan/** 是品質最高的源頭（WP 原圖 768-1024px+），是 hero 主力
- **FB 圖** 多在 590x443 等 web-optimized 尺寸，可作 內頁／thumbnail，**不能放大到 hero**
- **plahan/** 圖少但少數很到位（部落老奶奶澆花 等）

---

## 1. Logo 主檔（已備齊）

| 檔名 | 用途 |
|---|---|
| `logo/care4tw_logo.png` (20 KB) | 標準 PNG 含 wordmark |
| `logo/care4tw_logo_wo_smallchars2.png` (300 KB) | 高解析、無小字版本 — **redesign 主檔** |
| `logo/照顧學校LOGO.ai` (105 KB) | Adobe Illustrator vector — **可重做 lockup** |
| `logo/c4twapps-care4tw-logo.png` (88 KB) | c4twapps 上線用版本 |
| `logo/c4twapps-logo.webp` (3.5 KB) | 小尺寸 web logo |

**logo 視覺特徵**：手托台灣（葉形）+ 「照顧學校 / Care for Taiwan (CFT)」wordmark；色 sage/teal `~#7a9b8a`。

⚠️ **logo 還欠**：
- 創照（不只 CFT）的母品牌 lockup vector — 客戶 brief 中 Jodi 應上傳的 Drive `00_素材來源` 還是空的

---

## 2. 已驗看的 KEY PHOTOS（按 c4twweb section 對映）

### Hero 級（適合首頁 / section banner / 大版面）

| 檔案 | 內容 | 對映 c4twweb section | 故事 → 願景 |
|---|---|---|---|
| `carefortaiwan/1024x768_aab7dc6813.jpg` (4 MB) | **CFT 廚房中島**：bamboo 吊燈、白色中島、木樑、植物盆栽 | 首頁 hero candidate / `/cultivate/` 主視覺 / 「像家不像機構」段落 | 「**這就是我們的『家不是機構』**」一張照能講完 V1+V11 |
| `carefortaiwan/768x576_74a03307f6.jpg` (2.3 MB) | **CFT 講堂** + 投影顯示「CFT 照顧學校 Care For Taiwan」 + 灰色椅／木樑／綠葉藝術裝置 | `/cultivate/` 主視覺 / CFT 介紹 hero | 「**人才培育從一個有溫度的空間開始**」 |
| `carefortaiwan/1024x768_b2f492e895.jpg` (3.2 MB) | **CFT 外觀** + 粉紅花樹 + 傍晚天色 | `/cultivate/` opener / 學校簡介 | 「在烏日溪尾里，一處不像學校的學校」 |
| `carefortaiwan/1024x768_5ae3641017.jpg` (3 MB) | **CFT 課堂圍坐**：~14 人圍圈坐地、白板＋廚房 | `/cultivate/` 「共學圈」段落 / 「真功夫」品牌 | 「**走出教室，練就真功夫**」直接對應 |
| `carefortaiwan/1024x768_3938620327.jpg` (2.9 MB) | **CFT 大廳** + 木地板＋窗光＋投影螢幕 | 空間故事 / 「羅布森書蟲房」轉化故事 | 「一處原為十年不關的書店，轉成照顧人才基地」 |
| `carefortaiwan/768x576_34736cda95.jpg` (6.5 MB) | **林口社宅 / 杜格納合作社開幕**：~12 人團體照 + 「林口世大運選手村社會住」石碑 | `/about/family` AIO 生態系 / 杜格納 sub-page hero | 「我們在林口社宅成立的杜格納合作社」 |
| `plahan/960x1280_f4ac024aa4.jpg` (560 KB) | **部落老奶奶澆花瓶牆**：毛貝紅花上衣＋花褲＋黑屋＋花籃 | 伯拉罕 sub-page hero / `/co-living/dongshi` 部落故事 | 「**就地取材，欄杆毛巾化為復能工具**」一張照講完 |
| `fb-together/810x540_8560bbbe6e.jpg` (94 KB) | **2025 共生之家國際論壇全場合影**：~80 人 + 林依瑩坐前中＋ 7 個 AIO 品牌牌 | `/about/family` AIO 生態系 hero / `/co-living/` 國際論壇紀念照 | 「**這是一個共創家族**」單張定義性照片 |
| `fb-cft/590x443_d517c23c67.jpg` (65 KB) | **AIO 生態系成員手持品牌牌**：「個案安心」「家屬放心」「重症返家」「重症安寧」「重症共生」「伯拉罕」「PLAHAN」「照顧學校」「人人為我我為人人」「照顧勞動合作社」 | `/about/family` 牆 / 三大支柱章節插圖 | **「重症共生」三大支柱可視化** |
| `fb-plahan/720x540_e1171d524a.jpg` (108 KB) | **伯拉罕共生基地 9 人團體照** + 木造 pavilion + 山林背景 | 伯拉罕 sub-page hero / 部落團隊敘事 | 「**烤火、互助、興旺**」泰雅 Plahan 的具現化 |
| `fb-plahan/720x540_c7d0d1fbbd.jpg` (109 KB) | **新春紅色「馬上平安」春聯** + 伯拉罕吉祥物 + 山林背景 | 伯拉罕 sub-page 文化片段 / 過年期間社群 | 「**部落的禮**」brand identity 標誌 |
| `fb-wenshan/1200x540_16e68f8d04.jpg` (105 KB) | **文山共生之家客廳 5 人**：阿耀（中坐）+ 4 義工/住民 + 沙發＋零食 | `/co-living/wenshan` hero / V11 開頭 | 「**不談患者只談生活**」字句的視覺對應 |

### 內頁 main 級（800-1200px，可作為段落配圖）

| 檔案 | 內容 | 對映 |
|---|---|---|
| `fb-cft/960x1707_a82f441752.jpg` (140 KB) | CFT 老師上課 + 「3D 認知」白板 + 模組一足部清潔簡報 | `/cultivate/` 課程現場 |
| `plahan/1024x768_5ce55d5ed3.jpg` (348 KB) | 部落孩童拿手作 + 跨代手 close-up | 伯拉罕 部落兒少／傳承段落 |
| `fb-plahan/578x577_511bcc2d07.jpg` (256 KB) | （需驗看） | 伯拉罕日常候選 |
| `fb-plahan/526x762_6af81982e0.jpg` (96 KB) | 伯拉罕「互助喘息」服務 poster — 含據點地址、價格、適合對象 | 伯拉罕服務介紹（poster ref，**非主視覺**） |
| `fb-together/498963` (498 KB, "This All In Together" banner) | 鄰里123 banner: 林依瑩 抱小孩 + 大字 wordplay | `/about/family` 鄰里123 識別 |

### Thumbnail 級（300-600px，可作 list / card / 補圖）

- `fb-cft/` 80+ 張 590x443 課程現場縮圖 — 可作 CFT 課程列表卡片
- `fb-plahan/` 50+ 張 部落日常 — 可作伯拉罕活動卡片
- `fb-together/` 80+ 張 共生之家／募款／論壇 — 可作鄰里123 動態時間軸
- `fb-wenshan/` 13 張 文山日常 — 義工日誌時間流

---

## 3. Story bucket × c4twweb section 對映表

| c4twweb section | 主圖（hero） | 配圖（main） | thumbnail flow | 缺什麼 |
|---|---|---|---|---|
| `/` 首頁 hero | CFT 廚房 OR 國際論壇大合照 OR 部落老奶奶 | （見下分柱） | — | 三選一視覺基調決定 |
| `/about/founder` 林依瑩 | ⚠️ **沒有純林依瑩 portrait 高解析照** | 國際論壇前排照（中坐）／FB 分散照 | — | **缺一張單人 portrait** — 從 plahan 1289x540 螢幕截圖局部裁切？品質有限 |
| `/about/family` AIO 生態系 | 國際論壇 7 牌合影 + AIO brand 牌團體 | 杜格納林口開幕 + 伯拉罕 9 人 | FB 各 venture 縮圖列 | ✅ 充足 |
| `/cultivate/` CFT 人才培育 | CFT 講堂 + 廚房 + 圓圈課堂 | CFT 老師上課（FB） | FB CFT 80+ 課程縮圖 | ✅ **最豐**；可選 hero 多 |
| `/cultivate/` 「真功夫」段 | CFT 圓圈課堂 | FB「3D 認知課」 | — | ✅ 對應 |
| `/co-living/` 共生之家總覽 | 國際論壇 7 牌合影 + 文山共生之家 5 人 | — | 各據點縮圖 | ⚠️ 東勢／清流／南港／知本各據點代表照不齊 |
| `/co-living/wenshan` 文山 | 文山客廳 5 人 (1200x540) | 文山日常縮圖 | FB wenshan 13 張 | ✅ |
| `/co-living/dongshi` 東勢 | 部落 9 人團體（伯拉罕） | 部落老奶奶澆花 / 「馬上平安」春聯 | FB plahan 部落片段 | ✅ |
| `/co-living/qingliu` 清流 | ⚠️ **無清流部落本身照片** | — | — | **GAP** — 需向 思德磊岸合作社／鄰里123 索取 |
| `/co-living/songshan` 南港（露德） | ⚠️ **無南港共生之家／露德協會照片** | — | — | **GAP** — 需向露德協會索取 |
| `/co-living/zhiben` 知本（孩子的書屋） | ⚠️ **無知本共生之家照片** | — | — | **GAP** — 需向孩子的書屋索取 |
| `/co-living/lukou` 林口杜格納 | 林口開幕團體（carefortaiwan） + FB 杜格納（不在我抓的 4 個 FB 內） | — | — | ⚠️ 杜格納 FB 第一輪沒抓，可補 |
| `/integrated-service/` 整合服務 | CFT 廚房 OR 部落老奶奶澆花 | 杜格納合作社（carefortaiwan）| 各服務案例縮圖 | ✅ |
| `/connect10` Connect 10 | ⚠️ **無 Connect 10 系統 / 使用 / launch event 高品質照** | gic/connect10-v2-intro.pdf 中可能有插圖 | FB together 4/7 launch 縮圖 | **GAP** — 需 Jodi 提供素材 |
| `/news` 媒體報導 | — | — | 縮圖 + 連外原媒體 | ✅ 可吃既有縮圖 |
| `/donate` 支持我們 | 文山客廳 5 人 OR 紅春聯 | 紀錄片《交換禮物》海報（外連） | FB together 募款縮圖 | ✅ |

---

## 4. 對外 FB 公開照片 vs c4twweb 直接拿來用的版權考量

⚠️ 所有 FB 照片是這些 venture 各自貼出來的，但**版權仍屬於原拍攝者／當事人** — c4twweb 直接拿用前要：
- **個案臉部清楚的照片**（哲彰／文山阿耀／東勢爺爺）需家屬／本人同意（千億法務）
- **團體公開活動照**（國際論壇／林口開幕／部落團隊照）使用風險較低，但仍建議把使用範圍告知對應 venture
- **伯拉罕官網／carefortaiwan.com.tw 自家圖** — 同集團使用 OK
- **AIO 7 成員的 logo / brand 牌** — 各 venture 自家 brand asset，需獲得授權 reuse

---

## 5. 立即可填補的 GAP（優先級給設計階段參考）

### P1（直接卡某 section 的）
1. ✅ **林依瑩單人 portrait 已補**（2026-05-10）：
   - `portraits/lin-yiying/lin-yiying-warm.jpg`（媒體照風格，暖光+植物，適合 founder page hero）
   - `portraits/lin-yiying/lin-yiying-event.png`（場合 portrait，戴綠名牌，適合演講／活動段落）
2. **清流 / 南港 / 知本 共生之家 各 1 張代表照** — 4 處共生之家各 1 張就夠
3. **Connect 10 系統 / 4/7 launch event 高品質照** — Connect 10 product page 沒法做

### P2（豐富但不卡）
4. **黃子華 portrait + 雲林好所宅工作場景** — 鄰里123 / 醫養合一段落用
5. **杜格納合作社 FB** 補抓（第一輪沒做） — 杜格納烘焙課程／互助喘息 高品質照
6. **紀錄片《交換禮物》劇照／海報** — 需協商授權

### P3（nice-to-have）
7. **林依瑩 30 年弧線各階段照**（弘道時期 / 副市長時期 / 部落初期）— 從她 FB 個人或外部報導取
8. **東勢爺爺、哲彰、林伯山等個案照** — 故事段落用，需家屬同意

---

## 6. 對設計變體的具體 implication

我之前提的 3 條變體（A 手作家／B 編輯式家族／C 地圖時間軸）— 用本 inventory 重新評估：

### 變體 A「手作的家」 — 部落木質 / 土色 / 手寫
- ✅ 充足支撐：部落老奶奶澆花、紅春聯、9 人團體、跨代孩童
- ⚠️ 但 hero 級主要在 plahan/ 與 fb-plahan/ — **如果整個官網走這調，CFT 學校的乾淨白色＋木樑風格會跟它違和**
- 結論：A 適合做**伯拉罕 sub-page**，**不適合做整體 c4twweb 主基調**

### 變體 B「編輯式家族」 — 白底 / 攝影主導 / 思源宋體
- ✅ 充足支撐：CFT 廚房／講堂／課堂／白色中島是現成的「編輯式」素材
- ✅ 國際論壇大合照是編輯式 hero 完美素材
- ✅ 與 logo 的 sage/teal 色協調
- 結論：B 是**整體 c4twweb 主基調的最佳候選**（與 One-Forty 客戶北極星也最接近）

### 變體 C「地圖與時間軸」 — 多元在地視覺化
- ⚠️ 共生之家清流／南港／知本沒照片 — 地圖要有節點代表照才有意義
- ⚠️ 30 年弧線時間軸需各時期林依瑩照片 — 無
- 結論：C 在**現有素材下無法獨立成立**，但可以**作為 B 內的一個 section** 嵌入（家族 / 共生之家 / 大事紀）

### 重新推薦（基於 inventory）
- **整體 c4twweb 主基調 = B**（編輯式家族）
- **`/plahan` sub-page 嵌 A**（手作部落）
- **`/about/family` 嵌 C**（家族圖譜 + 多點共生之家）

這個組合**完全用既有照片庫即可成立**，不假設拍新照片。

---

## 7. 技術 notes

- 所有圖在 `/home/thomas/c4twweb/assets/photos/{logo,carefortaiwan,plahan,fb-cft,fb-plahan,fb-together,fb-wenshan}/`
- `image_manifest.json` 含每張圖的 source URL / page_url / alt / 原 dimensions
- 命名格式：`{w}x{h}_{md5}.{ext}`，方便直接看出尺寸
- carefortaiwan/ 多為 WP/Elementor 處理過 — 原圖可能更大，必要時可從 `wp-content/uploads/` 改路徑撈無壓縮版本
- FB 圖大多為 webp 但 ext 標 jpg — 解碼仍正常

---

## 8. 給設計階段的硬約束 reminder

> **照片無法重拍** — 任何「假設未來補拍」的方向 = 設計失敗的徵兆。
> 設計成敗 binary 判準：logo 用得對 + 既有照片用得對 + 故事 → 願景 → balanced 語氣。
> 詳見 memory `feedback_design_success_criteria.md`。
