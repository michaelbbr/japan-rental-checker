# 日本租房 3 層評分工具 (Japan Rental Property Evaluator)

貼上 SUUMO 房源網址，自動抓取規格並在 1 秒內輸出三層評分報告：
1. **① 一眼看懂**：立地、家賃、日当たり、建物、防犯、静かさ（6 大維度評級）
2. **② 優點 / 缺點 / 注意點**：每條一句話（👍 メリット / ⚠️ 注意点 / 👎 デメリット）
3. **③ 內見時確認清單**：現場看屋實用確認項目（附一鍵複製功能）

---

## 🚀 60 秒部署至 Vercel（完全免費）

本專案採用 **Next.js 14 App Router + Tailwind CSS**，已完整配置 Vercel Serverless Function，部署完全零設定。

### 步驟：

1. **上傳至 GitHub**：
   將解壓縮後的專案資料夾推送至你的 GitHub Repository：
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Japan Rental Evaluator"
   git branch -M main
   git remote add origin https://github.com/<你的用戶名>/<專案名稱>.git
   git push -u origin main
   ```

2. **登入 Vercel 部署**：
   - 打開 [Vercel 官網](https://vercel.com/)，點擊 **「Add New...」 -> 「Project」**。
   - 選擇你剛才建立的 GitHub Repository。
   - Framework Preset 選擇 **Next.js**（預設即是），直接點擊 **「Deploy」**！

3. **完成上線**：
   - 部署完成後，Vercel 會提供專屬網址（例如 `https://your-project.vercel.app`）。
   - 在該網址上貼上任何 SUUMO 網址（如 `https://suumo.jp/chintai/bc_100524309699/`），後端 API 就會自動抓取並顯示三層評分！

---

## 💻 本地開發與測試

若本機有 Node.js 環境：
```bash
npm install
npm run dev
```
打開瀏覽器至 `http://localhost:3000` 即可進行本地開發與測試。
