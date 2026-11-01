import { apiRequest } from './api'

export function authRequest(path, options) {
    return apiRequest(`/auth${path}`, options)
}
