# Basic Template For Brochure Style Website with self-hosted CMS

Heavily inspired by [Starter-Kit-V4-Eleventy](https://github.com/Oak-Harbor-Kits/Starter-Kit-V4-Eleventy)

This is a basic template for a brochure style website. It includes a self hosted blog, and all written content is client editable from the admin panel. All public facing pages are statically generated, and the admin panel is a Next.js app.

🚀 [Live Demo](https://shorecel-basic-template.netlify.app/)

## Getting Started

### Prerequisites

To get up and running you will need the following:

- a [Cloudinary](https://cloudinary.com) account(free), for media hosting, and image optimization.
- a PostgreSQL/MySQL database. (MongoDB could work, but you would need to re-write the Prisma schema) [Railway](https://railway.app/) is a great(free) option for this.
- optionally, a [Netlify](https://netlify.com) account, for hosting(free). Other providers(like [Vercel](https://vercel.com/)) could work, but the serverless functions may need to be re-written. Additionally, Vercel does not allow commercial use of their free tier.

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

5. Seed the database with some data. This script will ask you for your email adress. Make sure it is valid, as you will need it to log in to the admin dashboard.

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

3. Add your environment variables to your Netlify site. The easiest way to do this is to use the [Netlify CLI](https://docs.netlify.com/cli/get-started/#installation)

```
netlify env:clone
```

4. Deploy the site

```
netlify deploy
```

## Usage

### Admin Dashboard

The admin dashboard is in the `/admin` route. There you can edit all the content on the site. You can also add new blog posts, and upload images to your Cloudinary folder.

### Contact Form

The contact form is a serverless function, that sends an email to the email address you specify in the `.env` file. It takes advantage of Netlify's built in spam protection. You can read more about it [here](https://docs.netlify.com/forms/setup/#html-forms).

## Built With

- [Create T3 App](https://create.t3.gg/) - The boilerplate used
- [Next.js](https://nextjs.org/) - The web framework used
- [Prisma](https://www.prisma.io/) - The ORM used
- [TRPC](https://trpc.io/) - The API framework used
- [Railway](https://railway.app/)
- [Cloudinary](https://cloudinary.com/)
- [Netlify](https://netlify.com/)
- [TypeScript](https://www.typescriptlang.org/)

## Contributing

🚧

## Author

[Jon Naske](https://github.com/j-nas)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Shoutouts

- [Starter-Kit-V4-Eleventy](https://github.com/Oak-Harbor-Kits/Starter-Kit-V4-Eleventy) - The inspiration for this project
- [Theo](https://t3.gg/) - For creating the Create T3 App boilerplate and putting out rad videos
