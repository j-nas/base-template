# Basic Template For Brochure Style Website with self-hosted CMS

Heavily inspired by [Starter-Kit-V4-Eleventy](https://github.com/Oak-Harbor-Kits/Starter-Kit-V4-Eleventy)

This is a basic template for a brochure style website. It includes a self hosted blog, and all written content is client managable from the admin panel. All public facing pages are statically generated, and the admin panel is a Next.js app.

## Getting Started

### Prerequisites

To get up and running you will need the following:

- a [Cloudinary](https://cloudinary.com) account(free), for media hosting, and image optimization.
- a PostgreSQL/MySQL database. (MongoDB could work, but you would need to re-write the Prisma schema) [Railway](https://railway.app/) is a great(free) option for this.
- a [Netlify](https://netlify.com) account, for hosting(free). Other providers(like [Vercel](https://vercel.com/)) could work, but the serverless functions may need to be re-written.

### Installing

1. Clone the repo

2. Install dependencies

```
pnpm i
```

3. copy the `.env.example` file to `.env` and fill in the values.

4. Push the schema to your database

```
pnpm prisma db push
```

5. Seed the database with some data

```
pnpm db-seed
```

6. Start the dev server

```
pnpm dev
```

## Deployment

### Netlify

1. Push the repo to GitHub

2. Create a new site in Netlify, and connect it to your GitHub repo.

3. Add your environment variables to the Netlify site. The easiest way to do this is to use the [Netlify CLI](https://docs.netlify.com/cli/get-started/#installation)

```
netlify env:clone
```

4. Deploy the site

```
netlify deploy
```
