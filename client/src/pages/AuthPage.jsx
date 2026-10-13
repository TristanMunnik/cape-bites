import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

function AuthPage({ mode }) {
    const isRegister = mode === 'register'
    const { login, register } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [form, setForm] = useState({ username: '', email: '', password: '' })
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    function updateField(event) {
        setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
    }

    async function handleSubmit(event) {
        event.preventDefault()
        setError('')
        setSubmitting(true)

        try {
            if (isRegister) {
                await register(form)
            } else {
                await login({ email: form.email, password: form.password })
            }
            navigate(location.state?.from || '/', { replace: true })
        } catch (requestError) {
            setError(requestError.message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <main className="auth-page">
            <p className="eyebrow">Cape Bites account</p>
            <h1>{isRegister ? 'Create your account' : 'Welcome back'}</h1>
            <p className="auth-description">
                {isRegister
                    ? 'Join the community and share your Cape Town food finds.'
                    : 'Sign in to your Cape Bites account.'}
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>
                {isRegister && (
                    <label>
                        Username
                        <input
                            autoComplete="username"
                            maxLength={24}
                            minLength={3}
                            name="username"
                            onChange={updateField}
                            pattern="[A-Za-z0-9_-]+"
                            required
                            value={form.username}
                        />
                    </label>
                )}
                <label>
                    Email
                    <input
                        autoComplete="email"
                        maxLength={254}
                        name="email"
                        onChange={updateField}
                        required
                        type="email"
                        value={form.email}
                    />
                </label>
                <label>
                    Password
                    <input
                        autoComplete={isRegister ? 'new-password' : 'current-password'}
                        maxLength={72}
                        minLength={8}
                        name="password"
                        onChange={updateField}
                        required
                        type="password"
                        value={form.password}
                    />
                </label>
                {error && <p className="form-error" role="alert">{error}</p>}
                <button className="auth-submit" disabled={submitting} type="submit">
                    {submitting
                        ? 'Please wait...'
                        : isRegister
                            ? 'Create account'
                            : 'Sign in'}
                </button>
            </form>

            <p className="auth-switch">
                {isRegister ? 'Already have an account?' : 'New to Cape Bites?'}{' '}
                <Link to={isRegister ? '/login' : '/register'}>
                    {isRegister ? 'Sign in' : 'Create an account'}
                </Link>
            </p>
            <Link className="auth-home-link" to="/">Back to restaurant directory</Link>
        </main>
    )
}

export default AuthPage
