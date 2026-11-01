export const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export async function apiRequest(path, options = {}) {
    const response = await fetch(`${apiBaseUrl}${path}`, {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    })
    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || 'Request failed.')
    }

    return data
}
