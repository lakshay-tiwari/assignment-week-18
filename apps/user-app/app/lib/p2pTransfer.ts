'use server'
import { getServerSession } from "next-auth"
import { authOptions } from "./auth"
import prisma from "@repo/db/client";
import { revalidatePath } from "next/cache";

export const p2pTransfer = async (number: string, amount: number)=> {
    const session =  await getServerSession(authOptions);
    if (!session || !session?.user || !session.user?.id){
        return {
            message: 'Session not found',
            status: 403
        }
    }
    const userIdofSender = session?.user?.id 
    const userToSend = await prisma.user.findFirst({
        where: {
            number
        }
    })
    if (!userToSend || !userToSend?.id){
        return {
            message: "Receiver account doesn't exist",
            status: 401
        };
    }

    try {
        /*
            this is done so that no two concurrent transaction happen to avoid errorness in the program
        */
        await prisma.$transaction(async (tx)=>{
            await tx.$queryRaw`
                SELECT *
                FROM "Balance"
                WHERE "userId"= ${Number(userIdofSender)}
                FOR UPDATE;
            `
            const balance = await tx.balance.findUnique({
                where: {
                    userId: Number(session.user.id)
                },
                select: {
                    amount: true
                }
            })
            if (!balance || balance.amount < amount*100){
                throw new Error('Insufficient balance')
            }

            const receiver = await tx.balance.findUnique({
                where: { userId: userToSend.id}
            })

            if (!receiver){
                throw new Error('Receiver does not have balance account')
            }
    
            await tx.balance.update({
                where: {
                    userId: Number(session.user.id)
                },
                data: {
                    amount: {
                        decrement: amount*100
                    }
                }
            })
    
            await tx.balance.update({
                where: {
                    userId: userToSend.id
                },
                data: {
                    amount: {
                        increment: amount*100
                    }
                }
            })
        })

        // this is for refresh the page each time
        // revalidatePath('/transfer')
        return {
            message: "Done",
            status: 200
        }
    } catch (error:unknown) {
        return {
            status: 404,
            message: error instanceof Error ? error.message : "Something went wrong"
        }
    }
    
}