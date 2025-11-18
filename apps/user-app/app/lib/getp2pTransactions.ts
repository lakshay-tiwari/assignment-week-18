'use server'
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import prisma from "@repo/db/client"


interface TransactionType {
    id: number;
    amount: number;
    senderId: number;
    receiverId: number;
    timestamp: Date;
}

export async function getp2pTransactions(): Promise<TransactionType[]>{
    const session = await getServerSession(authOptions)
    const txns = await prisma.p2pTransfer.findMany({
        where: {
            OR: [
                { senderId: Number(session.user.id)},
                { receiverId: Number(session.user.id)}
            ]
        },
        orderBy: {
            timestamp: 'desc'
        }
    })

    return txns;

}