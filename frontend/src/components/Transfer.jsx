import { Link } from 'react-router'

function Transfer() {
    function handleSubmit(e) {
        e.preventDefault()
        console.log('Transfer submitted')
    }

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
                <strong>1,000,000 VND</strong>
            </section>

            <label className="form-field">
                <span>Receiver phone number</span>
                <input
                    type="text"
                    placeholder="0901234567"
                />
            </label>

            <label className="form-field">
                <span>Amount</span>
                <input
                    type="number"
                    placeholder="100000"
                    min="1"
                />
            </label>

            <button className="primary-button" type="submit">
                Transfer money
            </button>
        </form>
    )
}

export default Transfer
