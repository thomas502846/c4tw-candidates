# Figma 缺塊資產 MANIFEST

> 抽取日期：2026-06-13 · 來源 Figma file `FiWUdIyKTLzGL3fOExUeKn` · REST `/v1/images`
> SVG = 純向量（已確認全部 0 embedded raster，可無損縮放／改色）
> PNG = scale=2 點陣（含嵌入照片或 baked 圖形，無法改色，需照原樣或重切）

## ⭐ 關鍵發現（與既有 gate/supplement 假設不同）
1. **care Venn / training radial 不是空灰佔位** — Figma 內已是「完整設計好的 baked image fill」，含全部數據文字與 icon。可直接落地當圖片用（見 care-venn.png / training-radial.png），不必重畫。
2. **school 環形圖 = 綠 donut + 4 個圓形照片槽**（非文字節點，supplement 已修正，本次以圖確認）。donut 純向量已抽（school-ring-donut.svg），4 槽是放真圓照片。
3. **school 四大地圖列已完整設計**（school-fourmap-row.svg 純向量，含 icon/配色/pill/連接路徑）。
4. **home 品牌簡介雙照片構圖 + 認識創照按鈕已完整 baked**（home-brand-intro.png）。
5. **台灣輪廓地圖不存在**於 School 定稿；只有羅布森「臺中溪尾」在地地形插畫（baked 在 school-robson-terrain.png 整個 section 內，無獨立 map node 可單獨抽）。
6. **about Vision 三圓 / training「與我們一起行動」三圓** 本次因 Starter 方案 image-render 連續 rate-limit（~5 分鐘未解）未抽；兩者皆是 `<circle>+白字` 簡單組合，supplement 本就要求 code 重建，影響低。

---

## HOME（gate 85%）
| 檔案 | 區/區塊 | gate 缺塊項 | node ID | 內容描述 | 含照片 |
|---|---|---|---|---|---|
| home-brand-intro.png | about `230:803` | 品牌簡介雙照片構圖＋「認識創照」按鈕 | 230:803 | 完整 section：左側三張真照片（香蕉推車輪椅／團體合照／步道）疊放構圖，右側深底「創新照顧，開啟照顧無限可能」標題＋綠 pill「認識創照」按鈕 | 是（3 張真照片 baked） |
| home-ta-icon-1-cft.svg | cta-1 `29:66` | TA 三卡線稿插圖 ①我想成為照顧專業人才 | 236:378 | 140×140 白色線稿插圖（53 paths，純向量） | 否 |
| home-ta-icon-2-service.svg | cta-2 `239:380` | TA 三卡線稿插圖 ②我正在尋找照顧服務 | 239:510 | 140×140 白色線稿插圖（58 paths，純向量） | 否 |
| home-ta-icon-3-org.svg | cta-3 `29:68` | TA 三卡線稿插圖 ③提升組織能力（三人圍桌拼圖） | 239:719 | 311.8×311.8 白色線稿插圖（72 paths，純向量；CTA-04 大型裝飾插圖） | 否 |

## CARE（gate 75%）
| 檔案 | 區/區塊 | gate 缺塊項 | node ID | 內容描述 | 含照片 |
|---|---|---|---|---|---|
| care-venn.png | 痛點 Venn `306:606` | AIO 三圓 Venn 圖（痛點數據） | 306:606 | ⭐已完整設計：個人生活/職場角色兩大圓交疊＋6 顆衛星數據圓（8+年／6成／前6個月／13.3萬／45歲／5倍）＋房屋與手提包 icon。可直接當圖片用 | 否（向量風 baked PNG，無真人照片） |
| care-step-icons-row（=care-icon.svg） | care-icon `258:640` | 四步驟 icon 卡（需求評估/設計規劃/串連資源/持續陪伴） | 258:640 | 1138×120，4 個 aio 線稿 icon（純向量，已於前次抽樣，sha 一致） | 否 |
| eap-step-icons-row（=eap-icon.svg） | eap-icon `263:421` | EAP 三步驟 icon | 263:421 | 1140×219，3 步驟圓 icon＋箭頭（純向量） | 否 |
| personal-icons-row（=personal-icon.svg） | personal-icon `269:648` | 個人 AIO 五直卡 icon | 269:648 | 1141×290，5 個 aio-personal 線稿 icon（純向量） | 否 |

> 註：care-icon.svg / eap-icon.svg / personal-icon.svg 為前次抽樣，本次驗證 sha 一致、已是正確 node，故不重複落地（去重）。

## TRAINING（gate 75%）
| 檔案 | 區/區塊 | gate 缺塊項 | node ID | 內容描述 | 含照片 |
|---|---|---|---|---|---|
| training-radial.png | 放射圖 `306:609` | 放射圖（想投入社會影響力區） | 306:609 | ⭐已完整設計：4 顆米色大圓菱形排列（高齡化需求增加／照顧人才不足／偏鄉資源落差／在地培力不易），各含線稿 icon＋標題＋說明。可直接當圖片用 | 否 |
| training-flow-icons.svg | support icon `285:497` | 流程圖（組織需求→客製→影響力） | 285:497 | 590×104，3 個線稿 icon（組織需求/客製培力方案/社會影響力）＋ →箭頭＋label（純向量） | 否 |
| training-icon-26/27/28.svg | 同上分件 | 六大模組/流程 icon 系列 | 285:419/466/487 | 各 60×60 單顆線稿 icon（前次抽樣） | 否 |

> 六大培力模組（`288:393`）卡片＝灰佔位圖＋文字，Figma 內無線稿 icon（圖是真照片佔位），不需抽向量。
> 「與我們一起行動」三圓（`288:657`）：rate-limit 未抽，supplement 要求 code 重建（實心圓#DCD020/#8BA98B/#ADCB59＋白字＋雙 chevron）。

## SCHOOL（gate 80%）
| 檔案 | 區/區塊 | gate 缺塊項 | node ID | 內容描述 | 含照片 |
|---|---|---|---|---|---|
| school-problem-ring.png | 環形圖 donut `55:257` | 環形圖（我們看見的問題） | 55:257 | 純綠 donut（#8BA98B，外徑466/內洞）— 4 照片槽不含於此 node | 否 |
| school-problem-composition.png | problem-pic `67:166` | 環形圖完整構圖 | 67:166 | donut＋4 顆灰圓（45°對角＝真圓照片槽位置參考） | 否（4 槽是照片佔位） |
| school-ring-donut.svg | 同上 | 環形圖（可改色向量版） | 55:257 | donut 單一 even-odd path #8BA98B（純向量，建議用此＋4 個 `<image>` clipPath 圓拼出） | 否 |
| school-fourmap-row.svg | map `304:548` | 四柱地圖卡（課程/實作/證照/職涯） | 304:548 | ⭐完整設計純向量：4 高低錯落卡（#8BA98B/#ADCB59/#9C9F33/#DCD020）＋pill tag＋線稿 icon（書/房屋心/證書/披風人）＋背後連接路徑＋全文字 | 否 |
| school-fourmap-row.png | 同上 | 四柱地圖卡（點陣參考） | 304:548 | 同上 PNG@2x 版面參考 | 否 |
| map1.svg | map1 card `84:251` | 四柱地圖單卡（課程地圖）拆件 | 84:251 | 264×444 單卡純向量（前次抽樣） | 否 |
| map-info.svg | tab panel `317:551` | 課程地圖 tab 內容面板 | 317:551 | 928×1289 課程 tab 完整內容（pill/icon/學習特色清單，純向量；⚠️ 命名 map-info 易混淆，實為 tab body） | 否 |
| map-a.svg | contact map row `42:94` | ⚠️非地圖 | 42:94 | 345×29 = contact 頁地址列（臺中市烏日區…），前次誤抽樣，非 School 地圖 | 否 |
| school-robson-terrain.png | 羅布森 `341:639` | 台灣地圖據點（實際＝在地地形圖） | 341:639 | ⭐完整 section baked：左文「羅布森空間」＋右側臺中溪尾淡彩地形插畫＋pin「臺中溪尾」。⚠️ 地形圖與文字同一張 baked image，無法單獨抽地形 | 否（地形插畫，非照片） |

> 職涯卡 icon 色票：四卡 icon 已在 school-fourmap-row.svg 內（披風人物＝職涯），配色已正確（#DCD020 黃）。

## ABOUT（gate 80%）
| 檔案 | 區/區塊 | gate 缺塊項 | node ID | 內容描述 | 含照片 |
|---|---|---|---|---|---|
| —（未抽） | Vision 三圓 `34:110` | 三圓使命帶 | 34:110 | rate-limit 未抽；supplement 要求 code 重建（halo圓+實心圓 #DCD020/#8BA98B/#ADCB59＋白字「培育/支持/創造」） | — |

> 媒體報導版型（press `230:732`）＝左圖+右列表，純文字/照片排版，無向量資產可抽；版型已在 about-context-supplement.md 描述，照 home/care 套版即可。

---

## 未找到對應 node（誠實標）
- **台灣全島輪廓地圖**：School 定稿不存在此 node（pages-context 舊描述已被 school-context-supplement.md 修正）。只有羅布森臺中溪尾在地地形圖（baked 在 section frame，不可單獨抽）。
- **care 獨立痛點數據區**：不存在獨立區塊；數據已整合在 care-venn.png 衛星圓內（supplement 已述）。

## rate-limit 未抽（皆 supplement 指定 code 重建、影響低，可後補）
- about Vision 三圓 `34:110`（容器 `34:113`）
- training「與我們一起行動」三圓 `288:657`
> Starter 方案 image-render 連續 rate-limit ~5 分鐘未解；此兩件純 `<circle>+text`，建議直接 code 畫不必再抽。
