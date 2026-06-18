import { useState } from 'react'

function RegisterForm({ onRegisterSuccess, onSwitchToLogin }) {
    const [fullName, setFullName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setIsLoading(true)
        setMessage('')

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    fullName,
                    phoneNumber,
                    email,
                    password
                })
            })

            const result = await response.json()

            if (result.err !== 200) {
                setMessage(result.message || 'Register failed')
                return
            }

            setMessage(result.message || 'Register successfully')
            onRegisterSuccess()
        } catch (error) {
            setMessage('Cannot connect to server')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-header">
                <h2>Register</h2>
                <p>Create an account with your phone number and password.</p>
            </div>

            <label className="form-field">
                <span>Full name</span>
                <input
                    type="text"
                    placeholder="Nguyen Van A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />
            </label>

            <label className="form-field">
                <span>Phone number</span>
                <input
                    type="text"
                    placeholder="0901234567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
            </label>

            <label className="form-field">
                <span>Email</span>
                <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </label>

            <label className="form-field">
                <span>Password</span>
                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </label>

            <button className="primary-button" type="submit" disabled={isLoading}>
                {isLoading ? 'Registering...' : 'Register'}
            </button>

            <button className="text-button" type="button" onClick={onSwitchToLogin}>
                Already have an account? Login
            </button>

            {message && <p className="form-message">{message}</p>}
        </form>
    )
}

export default RegisterForm
