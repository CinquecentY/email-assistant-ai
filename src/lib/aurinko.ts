'use server'
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";

export const getAurinkoAuthorizationUrl = async (serviceType: 'Google') => {
    const { userId } = await auth()
    if (!userId) throw new Error('User not found')

    const user = await db.users.findUnique({
        where: {
            id: userId
        }
    })

    if (!user) throw new Error('User not found')

    /*const accounts = await db.account.count({
        where: { userId }
    })*/


    const params = new URLSearchParams({
        clientId: process.env.AURINKO_CLIENT_ID as string,
        serviceType,
        scopes: 'Mail.Read Mail.ReadWrite Mail.Send Mail.Drafts Mail.All',
        responseType: 'code',
        returnUrl: `${process.env.NEXT_PUBLIC_URL}/api/aurinko/callback`,
    });

    return `https://api.aurinko.io/v1/auth/authorize?${params.toString()}`;
};