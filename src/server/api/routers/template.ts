import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const templateRouter = createTRPCRouter({
  getTemplates: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.template.findMany({
      where: {
        createdBy: ctx.auth.userId,
      },
      select: {
        id: true,
        name: true,
        text: true,
        updatedDate: true,
      },
    });
  }),
  addTemplate: protectedProcedure
    .input(z.object({ name: z.string(), text: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = await auth();
      if (!userId)
        return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
      return await ctx.db.template.create({
        data: {
          name: input.name,
          text: input.text,
          createdBy: userId,
        },
      });
    }),
  deleteTemplate: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = await auth();
      if (!userId)
        return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
      return await ctx.db.template.delete({
        where: {
          id: input.id,
          createdBy: userId,
        },
      });
    }),
  updateTemplate: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string(), text: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = await auth();
      if (!userId)
        return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
      return await ctx.db.template.upsert({
        where: {
          id: input.id,
          createdBy: userId,
        },
        create: {
          name: input.name,
          text: input.text,
          createdBy: userId,
        },
        update: {
          name: input.name,
          text: input.text,
        },
      });
    }),
});
