import Chromium, { executablePath } from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";
import * as fs from "fs";

export default async function handler(event, context) {
  const browser = await puppeteer.launch({
    args: Chromium.args,
    executablePath: await executablePath,
    headless: true,
    defaultViewport: {height: 630, width: 1200}
  });

  const page = await browser.newPage();

  const content = fs.readFileSync(__dirname + '/assets/image.html').toString();
  
  await page.setContent(content)

  await page.goto("https://www.google.com");
  const screenshot = await page.screenshot();
  await browser.close();
  fs.writeFileSync("screenshot.png", screenshot);
  return {
    statusCode: 200,
    body: "Hello, World",
  };
}