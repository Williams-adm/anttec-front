import { handleApiError } from "@/utils/handleApiError"
import axios from "axios"

const httpPublic = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

httpPublic.interceptors.response.use(
  (response) => response,
  (error) => {
    // ⛔️ NO redireccionar
    handleApiError(error)
    return Promise.reject(error)
  },
)

export default httpPublic
