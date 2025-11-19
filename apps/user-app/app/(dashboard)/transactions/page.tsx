"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import { ShowTransfer } from "../../../components/ShowTransfers";

interface TransactionType {
    id: number;
    amount: number;
    senderId: number;
    receiverId: number;
    timestamp: string;
}


export default function() {
    const [transactions,setTransactions] = useState<TransactionType[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState(false)

    useEffect(()=>{
        setLoading(true)
        axios.get("http://localhost:3001/api/transaction")
            .then((res)=>{
                setTransactions(res.data.transactions)
                setLoading(false)
            })
            .catch(error => {
                setLoading(false)
                setError(true)
                console.log(error.message)
            })
    },[])

    if (loading) return <div>
        Loading... 
    </div>

    if (error) return <div>
        Error...
    </div>

    return <div>
        <ShowTransfer transaction={transactions} />
    </div>
}


/*
    Server actions not call in useEffect (bad practice)
    Server actions is used in client event

*/