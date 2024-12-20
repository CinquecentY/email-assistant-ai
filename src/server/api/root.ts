import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { mailRouter } from "./routers/mail";
import { searchRouter } from "./routers/search";
import { templateRouter } from "./routers/template";
import { dataRouter } from "./routers/data";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  mail: mailRouter,
  search: searchRouter,
  template: templateRouter,
  data: dataRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
