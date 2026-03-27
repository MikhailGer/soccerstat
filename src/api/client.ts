import axios from 'axios'

const token = import.meta.env.VITE_API_TOKEN?.trim()

export const apiClient = axios.create({
  baseURL: 'https://api.football-data.org/v4',
  headers: token
    ? {
        'X-Auth-Token': token,
      }
    : undefined,
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 429) {
      console.error('Превышен лимит запросов к API (429 Too Many Requests)')
    }

    return Promise.reject(error)
  },
)
