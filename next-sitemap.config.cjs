/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://localhost:3000",
  generateRobotsTxt: true,
  exclude: ["/server-sitemap.xml", "/api/*", "/admin/*"],
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/*", "/api/*"],
      },
    ],
  },
};
