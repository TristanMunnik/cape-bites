import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

function AccountNavigation() {
    const { user, loading, authError, logout } = useAuth()
    const [error, setError] = useState('')

    async function handleLogout() {
        setError('')
        try {
            await logout()
        } catch (logoutError) {
            setError(logoutError.message)
        }
    }

    return (
        <div className="account-navigation">
            {loading ? (
                <span>Checking sign-in...</span>
            ) : user ? (
                <>
                    <span>Signed in as {user.username}</span>
                    <button type="button" onClick={handleLogout}>Sign out</button>
                </>
            ) : (
                <>
                    <Link to="/login">Sign in</Link>
                    <Link to="/register">Create account</Link>
                </>
            )}
            {(authError || error) && (
                <span className="account-error" role="status">
                    {error || 'Sign-in status could not be checked. Please refresh the page.'}
                </span>
            )}
        </div>
    )
}

export default AccountNavigation
