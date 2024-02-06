import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Extract any necessary information from the request
  const subdomain =
    process.env.NEXT_PUBLIC_FORCE_SLUG_LOCALHOST || req.query.subdomain;

  // Define rules based on the subdomain or any other logic you require
  const allow = "/";
  const disallow = "/dashboard/";

  // Construct the robots.txt content
  const robotsTxt = `
    User-agent: *
    Allow: ${allow}
    Disallow: ${disallow}
    Sitemap: https://${subdomain}.joineden.ai/sitemap.xml
  `;

  // Set response headers
  res.setHeader("Content-Type", "text/plain");
  res.status(200).send(robotsTxt);
}
