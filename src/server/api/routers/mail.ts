import Account from "@/lib/account";
import { emailAddressSchema } from "@/lib/types";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const mailRouter = createTRPCRouter({
    getAccounts: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db.accounts.findMany({
            where: {
                userId: ctx.auth.userId,
            }, select: {
                id: true, email: true, name: true
            }
        })
    }),
});