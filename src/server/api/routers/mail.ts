import { Prisma } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { db } from "@/server/db";

export const authoriseAccountAccess = async (
  accountId: string,
  userId: string,
) => {
  const account = await db.accounts.findFirst({
    where: {
      id: accountId,
      userId: userId,
    },
    select: {
      id: true,
      email: true,
      name: true,
      token: true,
    },
  });
  if (!account) throw new Error("Invalid token");
  return account;
};

const inboxFilter = (accountId: string): Prisma.ThreadWhereInput => ({
  accountId,
  inboxStatus: true,
});

const sentFilter = (accountId: string): Prisma.ThreadWhereInput => ({
  accountId,
  sentStatus: true,
});

const draftFilter = (accountId: string): Prisma.ThreadWhereInput => ({
  accountId,
  draftStatus: true,
});

export const mailRouter = createTRPCRouter({
  getAccounts: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.accounts.findMany({
      where: {
        userId: ctx.auth.userId,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
  }),
  getNumThreads: protectedProcedure
    .input(
      z.object({
        accountId: z.string(),
        tab: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const account = await authoriseAccountAccess(
        input.accountId,
        ctx.auth.userId,
      );
      let filter: Prisma.ThreadWhereInput = {};
      switch (input.tab) {
        case "inbox":
          filter = inboxFilter(account.id);
          break;
        case "sent":
          filter = sentFilter(account.id);
          break;
        case "drafts":
          filter = draftFilter(account.id);
          break;
      }

      /*if (input.tab === "inbox") {
        filter = inboxFilter(account.id);
      } else if (input.tab === "sent") {
        filter = sentFilter(account.id);
      } else if (input.tab === "drafts") {
        filter = draftFilter(account.id);
      }*/
      return await ctx.db.thread.count({
        where: filter,
      });
    }),
  getThreads: protectedProcedure
    .input(
      z.object({
        accountId: z.string(),
        tab: z.string(),
        done: z.boolean(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const account = await authoriseAccountAccess(
        input.accountId,
        ctx.auth.userId,
      );

      /*let filter: Prisma.ThreadWhereInput = {};
      if (input.tab === "inbox") {
        filter = inboxFilter(account.id);
      } else if (input.tab === "sent") {
        filter = sentFilter(account.id);
      } else if (input.tab === "drafts") {
        filter = draftFilter(account.id);
      }*/
      let filter: Prisma.ThreadWhereInput = {};
      switch (input.tab) {
        case "inbox":
          filter = inboxFilter(account.id);
          break;
        case "sent":
          filter = sentFilter(account.id);
          break;
        case "drafts":
          filter = draftFilter(account.id);
          break;
      }

      filter.done = {
        equals: input.done,
      };

      const threads = await ctx.db.thread.findMany({
        where: filter,
        include: {
          emails: {
            orderBy: {
              sentAt: "asc",
            },
            select: {
              from: true,
              body: true,
              bodySnippet: true,
              emailLabel: true,
              subject: true,
              sysLabels: true,
              id: true,
              sentAt: true,
            },
          },
        },
        take: 15,
        orderBy: {
          lastMessageDate: "desc",
        },
      });
      return threads;
    }),
});
