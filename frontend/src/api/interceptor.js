import axios from 'axios'
export const HTTP_STATUS = {
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 422,
  SERVER_ERROR: 500,
}

const http = axios.create({
  'Content-Type': 'application/json',
})
http.interceptors.request.use(
  async (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
http.interceptors.response.use(
  async (response) => {
    return response.data
  },
  async (error) => {
    return Promise.resolve(error.response.data)
  }
)
export default http
