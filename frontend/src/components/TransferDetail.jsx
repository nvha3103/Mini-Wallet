import { useEffect } from 'react'
import { useParams } from "react-router"
import { useState } from "react"

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
            console.log('res.transaction', res.transaction)
            setTransaction(res.transaction);
        }

        getTransaction();
    }, [transactionId])

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        console.log("bat dau submit");

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
        console.log("Neu chua co transaction")
        return <p> 'Loading transaction...'</p>;
    }

    return (
        <>
            <h2>Transaction Detail</h2>
            <div>Sender: {transaction.sender}</div>
            <div>Receive: {transaction.receiver}</div>
            <div>Amount: {transaction.amount}</div>
            <div>Status: {transaction.status}</div>
            <div>Exprires At: {transaction.expiresAt}</div>

            <form onSubmit={handleOnSubmit}>
                <input
                    type="password"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="Please enter your personal code"
                    onChange={(e) => setPersonalCode(e.target.value)} />

                <button type="submit">{isLoading ? "Loading..." : "Confirm"}</button>
            </form>
        </>

    )
}

export default TransactionDetail