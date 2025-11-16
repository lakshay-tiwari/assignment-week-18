"use server"
import prisma from "@repo/db/client"
import { getServerSession } from "next-auth"
import { authOptions } from "./auth"

export async function createOnrampTransaction(amount:number, provider:string){
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.user.id){
        return null;
    }
    const token = (Math.random()*1000).toString();
    try {
        await prisma.onRampTransaction.create({
            data: {
                status: 'Processing',
                token,
                provider,
                amount: amount*100,
                startTime: new Date(),
                userId: Number(session.user.id)
            }
        })
        return {
            message: 'Done'
        }
    } catch (error) {
        console.log(error);
        return {
            message: JSON.stringify(error)
        }
    }
}