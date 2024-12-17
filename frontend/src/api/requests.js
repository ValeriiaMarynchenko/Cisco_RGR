import { default as http } from './interceptor'

export const API_URL = process.env.REACT_APP_API_URL

const REQUEST_METHODS = {
  GET: 'GET',
  POST: 'POST',
  HEAD: 'HEAD',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
}

const request = async ({
  url,
  data = null,
  method = REQUEST_METHODS.GET,
  baseURL = API_URL,
  responseType = 'json',
  headers,
}) => {
  const response = await http({
    method,
    data,
    url,
    responseType,
    baseURL: baseURL,
    crossOriginIsolated: true,
    headers
  })
  return response
}

const getRequest = async ({ url, baseURL, headers }) => {
  return await request({ url, method: REQUEST_METHODS.GET, baseURL, headers })
}

const postRequest = async ({ url, data, baseURL }) => {
  return await request({ url, method: REQUEST_METHODS.POST, data, baseURL })
}

const headRequest = async ({ url, baseURL }) => {
  return await request({ url, method: REQUEST_METHODS.HEAD, baseURL })
}

const patchRequest = async ({ url, data, baseURL }) => {
  return await request({ url, method: REQUEST_METHODS.PATCH, data, baseURL })
}

const putRequest = async ({ url, data, baseURL }) => {
  return await request({ url, method: REQUEST_METHODS.PUT, data, baseURL })
}

export {
  getRequest,
  postRequest,
  headRequest,
  patchRequest,
  putRequest,
}
