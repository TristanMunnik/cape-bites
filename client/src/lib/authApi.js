import { apiBaseUrl } from './api'

export async function authRequest(path, options = {}) {
    const response = await fetch(`${apiBaseUrl}/auth${path}`, {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    })
    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || 'Authentication request failed.')
    }

    return data
}
