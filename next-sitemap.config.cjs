const baseUrl = process.env.SITE_URL || "http://localhost:3000";

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: baseUrl,
  exclude: ["/api/*", "/admin/*", "/server-sitemap.xml"],
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api", "/admin"],
      },
    ],
    additionalSitemaps: [`${baseUrl}/server-sitemap.xml`],
  },
};
