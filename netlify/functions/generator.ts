import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";
import fs from "fs";
import { type Handler, type HandlerEvent, type HandlerContext, type HandlerResponse } from '@netlify/functions'
import { env } from "~/env/client.mjs";

type Data = {
  title?: string;
  subtitle?: string;
  image?: string;
  default?: "true"
};

const cloudinaryUrl = `https://res.cloudinary.com/dkascnwj7/image/upload/c_fill,h_630,w_700/${env.NEXT_PUBLIC_CLOUDINARY_FOLDER}/`

export const handler: Handler = async (event: HandlerEvent, _context: HandlerContext): Promise<HandlerResponse> => {
  try {
    const localChrome =
      "/usr/bin/google-chrome";
    const executable = fs.existsSync(localChrome)
      ? localChrome
      : await chromium.executablePath;
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: executable,
      headless: true,

      defaultViewport: { height: 630, width: 1200 },
    });

    const page = await browser.newPage();



    let content = fs.readFileSync("netlify/functions/assets/image.html").toString();

    content = populateTemplate(content, {
      title: event.queryStringParameters?.title,
      subtitle: event.queryStringParameters?.subtitle || "",
      image: event.queryStringParameters?.default === "true"
        ? "https://source.unsplash.com/random/700x630/?tech"
        : cloudinaryUrl + (event.queryStringParameters?.image as string)
    })


    await page.setContent(content, { waitUntil: "networkidle0" });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "s-maxage=31536000",
      },
      body: await page.screenshot({ type: "png", encoding: "base64" }) as string,
      isBase64Encoded: true,

    };
  } catch (e) {
    console.log(e)
    const error = e as Error;
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/json",
        "Cache-Control": "s-maxage=31536000",
      },
      body: error.message,


    };
  }

};



function populateTemplate(content: string, data: Data) {
  // Replace all instances of e.g. `{{ title }}` with the title.
  for (const [key, value] of Object.entries(data)) {
    content = content.replace(new RegExp(`{{ ${key} }}`, 'g'), value)
  }

  return content;
}

