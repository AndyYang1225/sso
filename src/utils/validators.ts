export const required = (v: unknown) =>
  (v !== null && v !== undefined && v !== '') || '此欄位為必填'

export const email = (v: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || '電子郵件格式不正確'

export const minLength = (len: number) => (v: string) =>
  (v?.length ?? 0) >= len || `至少需 ${len} 個字元`

export const maxLength = (len: number) => (v: string) =>
  (v?.length ?? 0) <= len || `最多 ${len} 個字元`

export const strongPassword = (v: string) =>
  /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(v) || '密碼需含英文與數字，至少 8 碼'

export const sameAs = (other: () => string, label = '密碼') => (v: string) =>
  v === other() || `${label}不一致`
