"use client"

import { lazy, useEffect, useState } from "react";

interface TransactionType {
    id: number;
    amount: number;
    senderId: number;
    receiverId: number;
    timestamp: Date;
}
export default function() {
    const [transactions,setTransactions] = useState<TransactionType[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState('')


    if (loading) return <div>
        Loading... 
    </div>

    return <div>
        <div>
            From Lakshya
        </div>
    </div>
}


/*
    Server actions not call in useEffect (bad practice)
    Server actions is used in client event

*/