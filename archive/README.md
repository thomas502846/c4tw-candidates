# 創照服務設計 · CI 候選方案 (c4twweb)

公開預覽：**[5 個 landing-page 候選方案](./candidates/)**

## 內容

- `candidates/p3/` — **P3 苔銅**（moss + copper）首選，醫療專業氣質
- `candidates/p1/` — **P1 藍染**（indigo + ochre）台灣文化深度
- `candidates/p2/` — **P2 鋼朱**（steel + vermilion）NGO 行動感對照
- `candidates/cd1/` — Claude Design 自由發揮 v1
- `candidates/cd2/` — Claude Design 自由發揮 v2

每個候選都套同一份內容、同一支客戶 navbar（使命願景／實踐方式／認識團隊／New! 急重症長者整合照顧計劃），差別在配色與視覺氣質。

## 設計系統文件

完整 token / 字體 / 元件規格：`synthesis/16-design-system-v2.md`

## Local preview

```bash
cd /home/thomas/c4twweb
python3 -m http.server 8088
# 開 http://127.0.0.1:8088/candidates/
```
