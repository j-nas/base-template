import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";
import fs from "fs";
import { type Handler, type HandlerEvent, type HandlerContext, type HandlerResponse } from '@netlify/functions'

export const handler: Handler = async (_event: HandlerEvent, _context: HandlerContext): Promise<HandlerResponse> => {
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

    const content = fs.readFileSync(__dirname + "/assets/image.html").toString();



    await page.setContent(content, { waitUntil: "domcontentloaded" });

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

