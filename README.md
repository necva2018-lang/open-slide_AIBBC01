# AI 職場全效生產力應用班｜課程簡報網站

| 入口 | 網址 | 給誰 |
|---|---|---|
| 學員站 | <https://necva2018-lang.github.io/open-slide_AIBBC01/student/> | 學員：只有開放中的章節，點了直接全螢幕播放，可下載 PDF；沒有講者備註 |
| 講師站 | <https://necva2018-lang.github.io/open-slide_AIBBC01/> | 講師：全部章節＋講者備註，需輸入密碼 |

## 資料夾

| 路徑 | 內容 |
|---|---|
| `slides/<簡報id>/` | 各章簡報（由 Vault 的「簡報系統」組建後發布過來，不要在這裡手改） |
| `pdf/` | 各章 PDF，檔名 `<章節代碼>_<章名>.pdf`（學員站下載用） |
| `student/` | 學員站程式；`student/public.json` 是開放清單 |
| `tools/add-gate.mjs` | 講師站密碼畫面與開放清單面板 |
| `.github/workflows/pages.yml` | 推上 `main` 自動部署到 GitHub Pages |

## 上傳新章節

在 Vault 的 `簡報系統` 資料夾執行：

```bash
node scripts/publish.mjs CH04
```

加 `--open` 會同時開放給學員。約 2 分鐘後網站更新（進度看 GitHub 的 Actions 分頁）。

## 開放／關閉章節給學員

1. 講師站首頁右下角「學員站開放清單」→「編輯開放清單 ↗」（或直接在 GitHub 編輯 `student/public.json`）。
2. 修改 `"public"` 裡的章節代碼，例如 `["00-1", "01", "02", "03", "04"]`（不用寫 CH）。
3. 按 **Commit changes**，約 1～2 分鐘後學員重新整理就看得到。

## 注意

- 這個 repo 是公開的：原始碼與講者備註在 GitHub 上看得到。學員站打包時不含講者備註，也不含未開放的章節。
- 講師站密碼只在瀏覽器端檢查，能擋一般人，擋不住懂技術的人。改密碼：把新密碼的 SHA-256 填到 `tools/add-gate.mjs` 的 `HASH`。
