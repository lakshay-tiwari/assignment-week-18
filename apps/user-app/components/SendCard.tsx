"use client"
import { Card } from "@repo/ui/card"
import { TextInput } from "@repo/ui/textinput"
import { Button } from "@repo/ui/button";
import { useState } from "react";
import { Center } from "@repo/ui/center";
import { p2pTransfer } from "../app/lib/p2pTransfer";
import { useRouter } from "next/navigation";

export const SendCard = () =>{
    const [number, setNumber] = useState("")
    const [amount, setAmount] = useState(0) 
    const [loading, setLoading] = useState(false)
    const router = useRouter();

    if (loading){
        return <div className="h-[90vh]">
            <Center>
                <div>
                    <div className="animate-spin inline-block size-6 border-4 border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            </Center>
        </div>
    }

    return <div className="h-[90vh]">
        <Center >
            <Card title={"Send Money"}> 
                <div className="min-w-72 pt-2">
                    <TextInput label={"Number"} placeholder={"Number"} value={number} onChange={(value) => setNumber(value)}/>
                    <TextInput label={"Amount"} placeholder={"Amount"} value={amount === 0 ? "": String(amount)} onChange={(value) => setAmount(Number(value))}/>
                    <div className="flex justify-center pt-4">
                        <Button onClick={async ()=>{
                            setLoading(true)
                            await p2pTransfer(number,amount);
                            setLoading(false)
                            setNumber("")
                            setAmount(0)
                            router.refresh()
                        }}>
                            Send
                        </Button>
                    </div>
                </div>
            </Card>
        </Center>
    </div>
}