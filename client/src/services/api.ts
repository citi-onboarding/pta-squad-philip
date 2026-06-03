import axios from "axios"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
})

const categoryMap: Record<string, string> = {
  Historia: "História",
  Ciencias: "Ciências",
}

api.interceptors.response.use((response) => {
  const fixCategories = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(fixCategories)
    }
    if (obj && typeof obj === "object") {
      return Object.entries(obj).reduce((acc, [key, value]) => {
        acc[key] = key === "categoria" && typeof value === "string" ? categoryMap[value] || value : fixCategories(value)
        return acc
      }, {} as any)
    }
    return obj
  }
  return { ...response, data: fixCategories(response.data) }
})

export default api