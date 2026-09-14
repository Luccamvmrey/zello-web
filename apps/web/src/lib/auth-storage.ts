const TOKEN_KEY = 'zello-token'

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    // Modo privado / storage bloqueado: trata como não autenticado.
    return null
  }
}

export function setToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch {
    // Sem persistência: a sessão vale só enquanto a aba estiver aberta.
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch {
    // nada a fazer
  }
}
