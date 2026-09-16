// URL do dashboard (apps/web) — a landing e o dashboard são deploys separados.
const APP_URL = import.meta.env.VITE_APP_URL ?? 'http://localhost:5173'

export const registerUrl = `${APP_URL}/register`
export const loginUrl = `${APP_URL}/login`
