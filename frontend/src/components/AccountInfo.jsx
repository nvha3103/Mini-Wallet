import { useState } from 'react'

function AccountInfo({ account, onLogout }) {
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState('')

    async function handleLogout() {
        setIsLoading(true)
        setMessage('')

        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            })

            const result = await response.json()

            if (result.err !== 200) {
                setMessage(result.message || 'Logout failed')
                return
            }

            onLogout()
        } catch (error) {
            setMessage('Cannot connect to server')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section className="account-panel">
            <div className="form-header">
                <h2>Account details</h2>
                <p>You are currently signed in.</p>
            </div>

            <dl className="account-list">
                <div>
                    <dt>Full name</dt>
                    <dd>{account.fullName}</dd>
                </div>
                <div>
                    <dt>Phone number</dt>
                    <dd>{account.phoneNumber}</dd>
                </div>
                <div>
                    <dt>Email</dt>
                    <dd>{account.email}</dd>
                </div>
            </dl>

            <button className="secondary-button" onClick={handleLogout} disabled={isLoading}>
                {isLoading ? 'Logging out...' : 'Logout'}
            </button>

            {message && <p className="form-message">{message}</p>}
        </section>
    )
}

export default AccountInfo
