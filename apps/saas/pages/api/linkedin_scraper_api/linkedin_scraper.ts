import { NextApiRequest, NextApiResponse } from "next";
import puppeteer, { Browser, Page } from "puppeteer";

async function extractLinkedInProfile(url: string): Promise<string> {
  let browser: Browser;

  try {
    browser = await puppeteer.launch();
  } catch (error) {
    throw new Error(`Failed to launch browser: ${(error as Error).message}`);
  }

  let page: Page;

  try {
    page = await browser.newPage();
  } catch (error) {
    throw new Error(`Failed to open a new page: ${(error as Error).message}`);
  }

  try {
    await page.goto(url, { waitUntil: "networkidle2" });
  } catch (error) {
    throw new Error(`Failed to navigate to URL: ${(error as Error).message}`);
  }

  let content: string;

  try {
    content = await page.content();
  } catch (error) {
    throw new Error(`Failed to get page content: ${(error as Error).message}`);
  }

  try {
    await browser.close();
  } catch (error) {
    throw new Error(`Failed to close browser: ${(error as Error).message}`);
  }

  return content;
}

function extractTextFromHTML(html: string): string {
  const cheerio = require("cheerio");

  let $;

  try {
    $ = cheerio.load(html);
  } catch (error) {
    throw new Error(
      `Failed to load HTML into Cheerio: ${(error as Error).message}`
    );
  }

  return $("body").text().replace(/\n/g, "");
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { url } = req.query;

    if (!url || typeof url !== "string") {
      res.status(400).json({ error: "Invalid or missing URL parameter" });
      return;
    }

    let profileHTML;

    try {
      profileHTML = await extractLinkedInProfile(url);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
      return;
    }

    let profileText;

    try {
      profileText = extractTextFromHTML(profileHTML);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
      return;
    }

    res.status(200).json({ profileText });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

export default handler;
