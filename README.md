# SSO 單一登入系統

使用 **Vue 3 + Quasar + TypeScript + Pinia + Axios + Vite** 打造的 SSO 前端範本。

## 功能

- 電子郵件 / 密碼 登入、註冊
- 忘記密碼 / 重設密碼流程
- OAuth 第三方登入（Google、GitHub、Facebook）
- Access Token + Refresh Token 自動續發
- 路由守衛（requiresAuth / guestOnly）
- 個人資訊 / 帳號設定頁
- 全域錯誤通知（Quasar Notify）
- Pinia 持久化（使用者資訊保存於 localStorage）

## 專案結構

```
src/
├── api/            Axios 實例 + API 封裝
├── components/     共用元件（OAuthButtons…）
├── layouts/        主要佈局
├── router/         路由 + 守衛
├── stores/         Pinia auth store
├── styles/         SCSS / Sass
├── types/          TypeScript 型別
├── utils/          validators 等工具
├── views/          各頁面（Login、Register、Profile…）
├── App.vue
└── main.ts
```

## 開始使用

```bash
# 1. 安裝相依套件
yarn install

# 2. 複製環境變數並填入實際值
cp .env .env.local

# 3. 啟動開發伺服器
yarn dev

# 4. 型別檢查 + 建置
yarn build
```

其他指令：

| 指令 | 用途 |
| ---- | ---- |
| `yarn dev` | 啟動開發伺服器（http://localhost:5173） |
| `yarn build` | 型別檢查 + 建置正式版 |
| `yarn preview` | 預覽建置結果 |
| `yarn type-check` | 僅執行 TypeScript 型別檢查 |

## 環境變數

| 變數 | 說明 |
| ---- | ---- |
| `VITE_API_BASE_URL` | 後端 API 位址（預設透過 vite proxy 轉發 `/api`） |
| `VITE_APP_NAME` | 應用名稱 |
| `VITE_OAUTH_GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `VITE_OAUTH_GITHUB_CLIENT_ID` | GitHub OAuth Client ID |

## 後端 API 合約

預期後端提供以下端點（皆以 JSON 傳輸）：

| Method | Path | 說明 |
| ------ | ---- | ---- |
| POST | `/auth/login` | 帳密登入 |
| POST | `/auth/register` | 註冊 |
| POST | `/auth/logout` | 登出 |
| POST | `/auth/refresh` | 以 refreshToken 換新 accessToken |
| GET  | `/auth/me` | 取得目前使用者資訊 |
| POST | `/auth/forgot-password` | 寄送重設密碼信 |
| POST | `/auth/reset-password` | 重設密碼 |
| POST | `/auth/verify-email` | 驗證電子郵件 |
| GET  | `/auth/oauth/:provider/authorize` | 取得第三方授權 URL |
| POST | `/auth/oauth/:provider/callback` | 處理第三方回呼 |

登入 / 註冊 / OAuth callback 皆回傳：

```jsonc
{
  "user": { "id": "...", "username": "...", "email": "...", "roles": [] },
  "tokens": {
    "accessToken": "...",
    "refreshToken": "...",
    "expiresIn": 3600,
    "tokenType": "Bearer"
  }
}
```
