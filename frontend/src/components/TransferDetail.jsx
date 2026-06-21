import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router'

function TransactionDetail() {

    const { transactionId } = useParams();

    const [transaction, setTransaction] = useState(null)
    const [personalCode, setPersonalCode] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();
    const [showSuccess, setShowSuccess] = useState(false)
    const [message, setMessage] = useState("")

    useEffect(() => {
        const getTransaction = async () => {
            try {
                const response = await fetch("/api/wallet/transfer/detail", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({ transactionId })
                });

                const result = await response.json();

                if (result.err !== 200) {
                    setMessage(result.message || "Cannot load transaction");
                    return;
                }

                setTransaction(result.transaction);
            } catch (error) {
                setMessage("Cannot connect to server");
            }
        };

        getTransaction();
    }, [transactionId]);
    const handleOnSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        setMessage("")

        try {
            const request = await fetch("/api/wallet/transfer/confirm", {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    personalCode,
                    transactionId
                })
            })

            const result = await request.json();

            if (result.err !== 200) {
                setMessage(result.message || "Transfer failed")
                return
            }

            setTransaction(result.transaction)
            setShowSuccess(true)
        } catch (error) {
            setMessage("Cannot connect to server")
        } finally {
            setIsLoading(false)
        }
    }

    if (!transaction) {
        return (
            <section className="transaction-loading">
                <p>{message || "Loading transaction..."}</p>
            </section>
        )
    }

    return (
        <section className="transaction-detail-panel">
            <header className="transaction-detail-header">
                <Link className="back-link" to="/transfer">Back to transfer</Link>
                <p className="eyebrow">Review transfer</p>
                <h2>Transaction details</h2>
                <p>Check the information carefully before confirming.</p>
            </header>

            <div className="transaction-summary">
                <div className="transaction-row">
                    <span>Sender</span>
                    <strong>{transaction.sender}</strong>
                </div>
                <div className="transaction-row">
                    <span>Receiver</span>
                    <strong>{transaction.receiver}</strong>
                </div>
                <div className="transaction-row transaction-amount">
                    <span>Amount</span>
                    <strong>{Number(transaction.amount).toLocaleString()} VND</strong>
                </div>
                <div className="transaction-row">
                    <span>Status</span>
                    <strong className={`transaction-status status-${transaction.status}`}>
                        {transaction.status}
                    </strong>
                </div>
                <div className="transaction-row">
                    <span>Expires at</span>
                    <strong>
                        {transaction.expiresAt
                            ? new Date(transaction.expiresAt).toLocaleString()
                            : 'Not available'}
                    </strong>
                </div>
            </div>

            {transaction.status === "pending" && (
                <form className="confirm-form" onSubmit={handleOnSubmit}>
                    <label className="form-field">
                        <span>Personal code</span>
                        <input
                            type="password"
                            inputMode="numeric"
                            minLength={6}
                            maxLength={6}
                            pattern="[0-9]{6}"
                            required
                            value={personalCode}
                            placeholder="Enter your 6-digit code"
                            onChange={(e) => setPersonalCode(e.target.value.replace(/\D/g, ""))}
                        />
                    </label>

                    <button className="primary-button" type="submit" disabled={isLoading}>
                        {isLoading ? 'Confirming...' : 'Confirm transfer'}
                    </button>
                </form>
            )}
            {showSuccess && (
                <div className="modal-backdrop">
                    <div
                        className="success-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="success-title"
                    >
                        <h3 id="success-title">Transfer successful</h3>
                        <p>Your transaction has been completed successfully.</p>

                        <button
                            type="button"
                            className="primary-button"
                            onClick={() => navigate("/wallet")}
                        >
                            Back to wallet
                        </button>
                    </div>
                </div>
            )}
            {message && <p className="form-message">{message}</p>}
        </section>

    )
}

export default TransactionDetail
