import { createTRPCRouter, protectedProcedure } from "../trpc";

export const dataRouter = createTRPCRouter({
  getClients: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.clients.findMany({
      where: {
        ownerId: ctx.auth.userId,
      },
    });
  }),
  getDocuments: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.documents.findMany({
      where: {
        createdBy: ctx.auth.userId,
      },
    });
  }),
  getEvents: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.events.findMany({
      where: {
        createdBy: ctx.auth.userId,
      },
    });
  }),
  getHistory: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.history.findMany({
      where: {
        createdBy: ctx.auth.userId,
      },
    });
  }),
  getNotes: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.notes.findMany({
      where: {
        createdBy: ctx.auth.userId,
      },
    });
  }),
});
