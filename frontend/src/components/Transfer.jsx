import { Link } from 'react-router'
import { useState, useEffect } from "react"
import { useNavigate } from 'react-router'
function Transfer() {
    const [phoneNumber, setPhoneNumber] = useState(null)
    const [amount, setAmount] = useState(0)
    const [message, setMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [pocket, setPocket] = useState(null)
    const navigate = useNavigate();

    useEffect(() => {
        const getPocket = async () => {
            const response = await fetch("/api/wallet/overview", {
                method: "POST",
                credentials: "include"
            })

            const result = await response.json();
            if (result.err !== 200) {
                setMessage(result.message);
                return;
            }
            setPocket(result.pocket)
        }
        getPocket();
    }, [])

    async function handleSubmit(e) {
        e.preventDefault()
        setMessage("")
        setIsLoading(true)
        console.log('Transfer submitted')
        const response = await fetch("/api/wallet/transfer/request", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                phoneNumber,
                amount: Number(amount)
            })
        })

        const result = await response.json();
        console.log("result", result)
        if (result.err !== 200) {
            setMessage(result.message || 'Transfer failed');
            return;
        }
        // setPocket(result.pocketSend);
        setIsLoading(false);
        navigate(`/transfer/confirm/${result.transaction.id}`)
    }

    // if (!pocket) {
    //     return <p>Loading...</p>
    // }

    return (
        <form className="transfer-panel" onSubmit={handleSubmit}>
            <div className="form-header">
                <Link className="back-link" to="/wallet">Back to wallet</Link>
                <p className="eyebrow">Transfer</p>
                <h2>Send money</h2>
                <p>Enter the receiver phone number and amount.</p>
            </div>

            <section className="transfer-balance">
                <span>Current balance</span>
                <strong> {pocket
                    ? `${Number(pocket.balance).toLocaleString()} VND`
                    : "Loading..."}</strong>
            </section>

            <label className="form-field">
                <span>Receiver phone number</span>
                <input
                    type="text"
                    placeholder="0901234567"
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
            </label>

            <label className="form-field">
                <span>Amount</span>
                <input
                    type="number"
                    placeholder="100000"
                    min="1"
                    onChange={(e) => setAmount(e.target.value)}
                />
            </label>

            <button className="primary-button" type="submit">
                {isLoading ? "Loading..." : "Continue"}
            </button>
        </form>
    )
}

export default Transfer
