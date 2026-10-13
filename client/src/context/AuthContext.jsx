import { useEffect, useState } from 'react'
import { authRequest } from '../lib/authApi'
import { AuthContext } from './authContext'

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [authError, setAuthError] = useState('')

    useEffect(() => {
        let active = true

        authRequest('/me')
            .then((data) => {
                if (active) setUser(data.user)
            })
            .catch((error) => {
                if (active) setAuthError(error.message)
            })
            .finally(() => {
                if (active) setLoading(false)
            })

        return () => {
            active = false
        }
    }, [])

    async function login(credentials) {
        const data = await authRequest('/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        })
        setUser(data.user)
        setAuthError('')
    }

    async function register(details) {
        const data = await authRequest('/register', {
            method: 'POST',
            body: JSON.stringify(details),
        })
        setUser(data.user)
        setAuthError('')
    }

    async function logout() {
        await authRequest('/logout', { method: 'POST' })
        setUser(null)
        setAuthError('')
    }

    return (
        <AuthContext.Provider value={{ user, loading, authError, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
