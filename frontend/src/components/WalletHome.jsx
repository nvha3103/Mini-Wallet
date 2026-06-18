import { useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
function WalletHome({ account }) {
    const navigate = useNavigate()
    const [pocket, setPocket] = useState(null);

    useEffect(() => {
        async function loadPocket() {
            const response = await fetch("/api/wallet/overview", {
                method: 'POST',
                credentials: 'include'
            })
            const result = await response.json()

            setPocket(result.pocket);
        }

        loadPocket();

    }, [])

    if (!account) {
        return (
            <section className="empty-state">
                <h2>Please login first</h2>
                <p>Your wallet dashboard is available after login.</p>
                <button className="primary-button" onClick={() => navigate('/')}>
                    Back to login
                </button>
            </section>
        )
    }

    return (
        <section className="wallet-page">
            <header className="wallet-header">
                <div>
                    <p className="eyebrow">Mini Mini Wallet</p>
                    <h1>Hello, {account.fullName}</h1>
                </div>

                <button className="profile-button" onClick={() => navigate('/account-info')}>
                    <span>{account.fullName?.charAt(0) || 'A'}</span>
                    Account
                </button>
            </header>

            <section className="balance-card">
                <div>
                    <p>Available balance</p>
                    <strong>{pocket ? pocket.balance : 'Loading...'} VND</strong>
                </div>
                <span className="wallet-number">0012002</span>
            </section>

            <nav className="wallet-actions" aria-label="Wallet actions">
                <button onClick={() => navigate('/transfer')}>Transfer money</button>
                {/* <button onClick={() => navigate('/history')}>Transaction history</button> */}
                <button onClick={() => navigate('/account-info')}>Account info</button>
            </nav>

            <div className="wallet-summary">
                <section>
                    <h2>Quick account</h2>
                    <p>{account.phoneNumber}</p>
                    <p>{account.email}</p>
                </section>
                <section>
                    <h2>Recent activity</h2>
                    <p>No transactions yet.</p>
                </section>
            </div>
        </section>
    )
}

export default WalletHome
