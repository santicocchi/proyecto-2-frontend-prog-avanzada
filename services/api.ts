import axios from "axios"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  withCredentials: true, // Importante para manejar cookies de sesión
  // headers: {
  //   "Content-Type": "application/json",
  // },
})

// Interceptor para requests - agregar token si existe
api.interceptors.request.use(
  (config) => {
    // Aquí puedes agregar el token de autenticación cuando implementes login
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Interceptor para responses - manejo de errores global
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Manejo de errores global
    if (error.response) {
      // El servidor respondió con un código de error
      console.error("Error de respuesta:", error.response.status, error.response.data)
    } else if (error.request) {
      // La petición fue hecha pero no hubo respuesta
      console.error("Error de red: No se recibió respuesta del servidor")
    } else {
      // Algo pasó al configurar la petición
      console.error("Error:", error.message)
    }
    return Promise.reject(error)
  },
)

export default api
