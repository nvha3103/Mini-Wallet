import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'

function TransactionDetail() {

    const { transactionId } = useParams();
    console.log("transactionId", transactionId);

    const [transaction, setTransaction] = useState(null)
    const [personalCode, setPersonalCode] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const getTransaction = async () => {
            const response = await fetch("/api/wallet/transfer/detail", {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    transactionId
                })
            })

            const res = await response.json();
            // console.log('res.transaction', res.transaction)
            setTransaction(res.transaction);
        }

        getTransaction();
    }, [transactionId])

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        // console.log("bat dau submit");

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
        console.log("result.transaction", result.transaction);
        setTransaction(result.transaction);

        setIsLoading(false)
    }

    if (!transaction) {
        return (
            <section className="transaction-loading">
                <p>Loading transaction...</p>
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

            <form className="confirm-form" onSubmit={handleOnSubmit}>
                <label className="form-field">
                    <span>Personal code</span>
                    <input
                        type="password"
                        inputMode="numeric"
                        maxLength={6}
                        value={personalCode}
                        placeholder="Enter your 6-digit code"
                        onChange={(e) => setPersonalCode(e.target.value)}
                    />
                </label>

                <button className="primary-button" type="submit" disabled={isLoading}>
                    {isLoading ? 'Confirming...' : 'Confirm transfer'}
                </button>
            </form>
        </section>

    )
}

export default TransactionDetail
