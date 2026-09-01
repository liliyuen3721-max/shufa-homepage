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
├── js/main.js            # 交互:lightbox/類目切換/墨暈染 canvas/視差
└── favicon.svg           # 印章風站點圖標
```

## 替換佔位素材(朋友提供後)

- **作品圖**:`index.html` 中所有 `.work-tile`(書法字卡)目前是佔位,收到實拍後替換為 `<img src="assets/xxx.jpg">`,並把 `data-char/data-title/data-desc` 對應改為圖片資訊
- **IG 二維碼**:`#contact` 的 `.qr-placeholder` 替換為 `<img src="assets/ig-qr.png">`
- 所有圖片建議壓成 WebP 後放入 `assets/` 目錄

## 部署(GitHub Pages)

1. 建新倉庫(如 `shufa-homepage`),推 `main`
2. 開啟 Pages 並選 **GitHub Actions** 源
3. `.github/workflows/deploy.yml` 會自動把根目錄發布到 Pages
4. 訪問 `https://<username>.github.io/<repo>/`

## 版權

網站內書法作品照片均為「大魚山野人」原創。© 2025 大魚山野人。
