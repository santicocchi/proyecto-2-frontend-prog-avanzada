import axios from "axios"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "x-admin-key": process.env.NEXT_PUBLIC_API_KEY
  },
})


export default api
