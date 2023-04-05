import { getServerSideSitemapLegacy, type ISitemapField } from "next-sitemap";
import { type GetServerSideProps } from "next";
import { prisma } from "~/server/db";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const baseUrl = process.env.SITE_URL || "http://localhost:3000";
  const pageNames = await prisma.blog.findMany({
    select: {
      pageName: true,
    },
  });

  const fields: ISitemapField[] = [];

  pageNames.forEach((pageName) => {
    fields.push({
      loc: `${baseUrl}/blog/${pageName.pageName}`,
      lastmod: new Date().toISOString(),
      changefreq: "daily",
      priority: 0.7,
    });
  });

  return getServerSideSitemapLegacy(ctx, fields);
};

// Default export to prevent next.js errors
export default function Sitemap() {
  return null;
}
