# 大魚山野人 · 書法個人網站

> 香港書法家「大魚山野人」的個人 IP 展示 + 服務接單落地頁。
> 純靜態,零構建,繁/簡/EN 三語,墨暈染滾動動效。
> 需求來源:`shufa-site-requirements.md`(PRD)。

## 本地預覽

無需安裝,直接開 `index.html`,或起個靜態服務器:

```bash
python -m http.server 8080
# 或
npx serve .
```

## 目錄結構

```
├── index.html            # 頁面結構(所有 data-i18n 文案入口)
├── css/style.css         # 樣式(改 :root 變量可換配色)
├── js/i18n.js            # 三語字典(繁/簡/EN)+ 偵測/切換
├── js/main.js            # 交互:lightbox/類目切換/墨暈染 canvas/視差/主題切換
└── favicon.svg           # 印章風站點圖標
```

## 功能

- 繁/簡/EN 三語切換(自動偵測 + localStorage 記憶)
- 主題三態切換:**淺色 ☀️ / 深色 🌙 / 跟隨系統 🖥️**(點按循環,記憶選擇)
- 作品 lightbox 彈大圖、四類服務單頁切換、滾動墨暈染 canvas、背景字視差

## 素材現狀(2026-09)

- 已接入真實作品:`assets/works-kaishu.webp`(楷書臨習)、`assets/design-lantern.webp`(食燈籠玩月餅,已裁掉手機UI)、`assets/design-mansion.webp`(裕雅苑)
- `assets/ig-qr.png` 為自動生成的 IG 二維碼,指向 https://www.instagram.com/vivalavida_2330

## 待補素材(朋友提供後)

- **作品圖**:剩餘 `.work-tile`(字卡:龍/靜/雲/福/緣/和/野)是佔位,收到實拍後替換為 `<img src="assets/xxx.webp">`,並同步 `data-img/data-title/data-desc`
- 若朋友提供官方 IG 二維碼截圖,替換 `assets/ig-qr.png`
- 所有圖片統一壓成 WebP 放 `assets/` 目錄

## 部署(GitHub Pages)

1. 建新倉庫(如 `shufa-homepage`),推 `main`
2. 開啟 Pages 並選 **GitHub Actions** 源
3. `.github/workflows/deploy.yml` 會自動把根目錄發布到 Pages
4. 訪問 `https://<username>.github.io/<repo>/`

## 版權

網站內書法作品照片均為「大魚山野人」原創。© 2025 大魚山野人。
