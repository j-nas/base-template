import { type DefaultSeoProps } from 'next-seo';
import { env } from "~/env/client.mjs";

const siteUrl = env.NEXT_PUBLIC_SITE_URL;

const SEO: DefaultSeoProps = {
  defaultTitle: 'Base Template',
  description: 'A starter template for for a brochure style website, with a self hosted CMS and blog.',
  canonical: siteUrl,

  openGraph: {
    type: 'website',
    url: siteUrl,
    title: 'Base Template',
    description: 'A starter template for for a brochure style website, with a self hosted CMS and blog.',
    images: [
      {
        url: `${siteUrl}/.netlify/functions/generator?default=true&title=Base%20Template`,
        width: 1200,
        height: 630,
        alt: 'Base Template',
      },
    ],
    site_name: 'Base Template',
  },
  dangerouslySetAllPagesToNoIndex: true,
  dangerouslySetAllPagesToNoFollow: true,

  robotsProps: {
    noarchive: true,
    maxSnippet: -1,
  },
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico',
    },
  ],
  additionalMetaTags: [
    {
      name: "viewport",
      content: "width=device-width",
    },
    {
      name: "charset",
      content: "utf-8",
    },
    {
      httpEquiv: "x-ua-compatible",
      content: "IE=edge",
    }
  ],


};

export default SEO;