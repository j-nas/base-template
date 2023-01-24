import { createTRPCRouter } from "./trpc";

import { aboutUsRouter } from "./routers/aboutUs";
import { blogRouter } from "./routers/blog";
import { businessInfoRouter } from "./routers/businessInfo";
import { heroRouter } from "./routers/hero";
import { middleHeroRouter } from "./routers/middleHero";
import { serviceRouter } from "./routers/service";
import { testimonialRouter } from "./routers/testimonial";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  aboutUs: aboutUsRouter,
  blog: blogRouter,
  businessInfo: businessInfoRouter,
  hero: heroRouter,
  middleHero: middleHeroRouter,
  service: serviceRouter,
  testimonial: testimonialRouter
  // add more routers here
});

// export type definition of API
export type AppRouter = typeof appRouter;
