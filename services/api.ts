// import axios from "axios"

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//     "x-admin-key": process.env.NEXT_PUBLIC_API_KEY
//   },
// })


// export default api

import axios from "axios"

// Configuración base de la API
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "x-admin-key": process.env.NEXT_PUBLIC_API_KEY
  },
})

// Interceptor para requests - agregar token si existe
api.interceptors.request.use(
  (config) => {
    // Aquí puedes agregar el token de autenticación si lo tienes
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
