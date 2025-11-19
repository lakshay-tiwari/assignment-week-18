import prisma from "@repo/db/client"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "../../lib/auth"

export const GET = async () => {
    const session = await getServerSession(authOptions)
    if (!session || !session?.user || !session.user?.id){
        return NextResponse.json({
            message: "User not found",
            transactions: []
        },{
            status: 403
        })
    }

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

    return NextResponse.json({
        message: 'Done',
        transactions: txns
    },{
        status: 200
    })
}