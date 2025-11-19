import { Card } from "@repo/ui/card";
import { useSession } from "next-auth/react";



interface TransactionType {
    id: number;
    amount: number;
    senderId: number;
    receiverId: number;
    timestamp: string;
}

interface Transaction {
    transaction: TransactionType[]
}


export const ShowTransfer = ({ transaction }: Transaction)=>{
    const session = useSession()
    const userId = session.data?.user.id
    
    return <div>
            <Card title="Recent Transactions">
                <div className="pt-2">
                    {transaction.map(t => <div className="flex justify-between">
                        <div>
                            <div className="text-sm">
                                {userId === t.receiverId.toString() ? "Received INR" : "Send INR"}
                            </div>
                            <div className="text-slate-600 text-xs">
                                {new Date(t.timestamp).toDateString()}
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            {userId === t.receiverId.toString() ? "+" : "-"}
                            Rs {t.amount / 100}
                        </div>

                    </div>)}
                </div>
            </Card>
    </div>
}