import api from "@/services/api"

let refreshInterval: NodeJS.Timeout | null = null

// Login: se comunica con el microservicio de usuarios
export async function loginUser(email: string, password: string): Promise<{ ok: boolean; message?: string }> {
  try {
    const res = await api.post("/users/login", { email, password })

    if (!res || !res.data) {
      return { ok: false, message: "Error al iniciar sesión" }
    }

    const expiration = res.data.accessTokenExpiresAt
    // console.log(expiration)
    if (expiration) {
      localStorage.setItem("accessTokenExpiresAt", expiration.toString())
      scheduleAutoRefresh(Number(expiration))
    }

    // startRefreshTokenCycle(); // opcional, como backup
    return { ok: true }
  } catch (err: any) {
    console.error("Error en loginUser:", err)

    // Si hay respuesta del servidor con mensaje de error
    if (err.response?.data?.message) {
      return { ok: false, message: err.response.data.message }
    }

    // Si hay mensaje de error genérico
    if (err.message) {
      return { ok: false, message: err.message }
    }

    // Mensaje por defecto
    return { ok: false, message: "Error de red o del servidor" }
  }
}


// Programa el refresco automático 1 minuto antes del vencimiento
export function scheduleAutoRefresh(expirationTimestamp: number) {
  const now = Date.now()
  const oneMinuteBefore = expirationTimestamp - 60000

  const timeoutMs = oneMinuteBefore - now
  console.log("Ahora:", now)
  console.log("Expiración:", expirationTimestamp)
  console.log("Se refresca en (ms):", timeoutMs)

  if (timeoutMs <= 0) {
    console.log("Expiró antes de lo esperado, refrescando ahora…")
    refreshAccessToken()
    return
  }

  setTimeout(() => {
    console.log("Ejecutando refresh…")
    refreshAccessToken()
  }, timeoutMs)
}

// Refresca el token y vuelve a programar el próximo refresh
export async function refreshAccessToken() {
  try {
    const res = await api.get("/users/refresh-token")

    if (res.status !== 200) {
      console.error("Error al refrescar token automático")
      throw new Error("Error al refrescar token automático")

    }

    const expiration = res.data.accessTokenExpiresAt
    if (expiration) {
      localStorage.setItem("accessTokenExpiresAt", res.data.accessTokenExpiresAt.toString())
      scheduleAutoRefresh(Number(expiration))
    }
  } catch (error) {
    console.error("Error al refrescar token automáticamente:", error)
    stopRefreshTokenCycle()
  }
}

// Auto refresh del token cada X tiempo como respaldo
// function startRefreshTokenCycle() {
//   stopRefreshTokenCycle(); // Limpiamos uno previo si existe

//   refreshInterval = setInterval(() => {
//     refreshAccessToken();
//   }, 600000); // cada 10 minutos como respaldo
// }

// Limpia el ciclo de refresco si se hace logout
export function stopRefreshTokenCycle() {
  localStorage.removeItem("accessTokenExpiresAt")
  if (refreshInterval) {
    clearInterval(refreshInterval)
    refreshInterval = null
  }
}

export async function logoutUser() {
  try {
    const res = await api.get("/users/logout")
    if (res.status !== 200) {
      console.error("Error al cerrar sesión")
      throw new Error("Error al cerrar sesión")
    }
    localStorage.removeItem("accessTokenExpiresAt")
    // cookieStore.delete("access_token")
    // cookieStore.delete("refresh_token")
    stopRefreshTokenCycle()

  } catch (e) {
    console.error("Error al cerrar sesión:", e)
  }
}

export const authService = {
  isAuthenticated(): boolean {
    // const token = localStorage.getItem("accessToken")
    // const expiration = localStorage.getItem("accessTokenExpiresAt")

    const token = cookieStore.get("access_token")
    const expiration = localStorage.getItem("accessTokenExpiresAt")

    if (!token) {
      localStorage.removeItem("accessTokenExpiresAt")
      return false
    }

    // Verificar si el token no ha expirado
    const now = Date.now()
    const expirationTime = Number(expiration)

    return now < expirationTime
    // return true
  },

  clearTokens(): void {
    logoutUser()
  },
}
