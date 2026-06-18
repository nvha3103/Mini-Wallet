import { useState } from 'react'
import { useNavigate } from 'react-router'

function Login({ onLogin, onSwitchToRegister }) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        setMessage('')

        try {
            const response = await fetch("/api/auth/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    phoneNumber,
                    password
                })
            })

            const result = await response.json()

            if (result.err !== 200) {
                setMessage(result.message || 'Login failed');
                return;
            }
            onLogin(result.account)
            navigate('/wallet')
        } catch (error) {
            setMessage('Cannot connect to server')
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <form className="auth-form" onSubmit={handleLogin}>
            <div className="form-header">
                <h2>Login</h2>
                <p>Sign in with your phone number and password.</p>
            </div>

            <label className="form-field">
                <span>Phone number</span>
                <input
                    type="text"
                    placeholder="0901234567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)} />
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
                {isLoading ? 'Logging in...' : 'Login'}
            </button>

            <button className="text-button" type="button" onClick={onSwitchToRegister}>
                Create a new account
            </button>

            {message && <p className="form-message">{message}</p>}
        </form>
    )
}

export default Login;
