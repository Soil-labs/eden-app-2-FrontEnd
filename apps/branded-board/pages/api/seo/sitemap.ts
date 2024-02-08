import { Position } from "@eden/package-graphql/generated";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { SitemapStream, streamToPromise } from "sitemap";

type Url = {
  url: string;
  changefreq: string;
  priority: number;
};

const getSubdomainUrls = async (subdomain: string) => {
  // Fetch subdomain URLs from the database
  const companyRes = await axios.post(
    process.env.NEXT_PUBLIC_GRAPHQL_URL as string,
    {
      headers: {
        "Access-Control-Allow-Origin": `*`,
      },
      variables: { fields: { slug: subdomain } },
      query: `
        query ($fields: findCompanyFromSlugInput) {
          findCompanyFromSlug(fields: $fields) {
            positions {
              _id
              status
            }
          }
        }
      `,
    }
  );

  const _positionIds =
    companyRes?.data?.data?.findCompanyFromSlug?.positions
      ?.filter((_pos: Position) => _pos.status === "ACTIVE")
      .map((position: { _id: string }) => position._id) || [];

  const positionRoutes: Url[] = _positionIds.map((id: string) => ({
    url: `/jobs/${id}`,
    changefreq: "daily",
    priority: 0.7,
  }));

  return [
    { url: "/jobs", changefreq: "daily", priority: 1 },
    ...positionRoutes,
  ];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const subdomain =
      process.env.NEXT_PUBLIC_FORCE_SLUG_LOCALHOST ||
      (req.query.subdomain as string);

    if (!subdomain) {
      return res.status(400).json({ error: "Subdomain is required" });
    }

    // Get subdomain URLs
    const subdomainUrls = await getSubdomainUrls(subdomain);

    // Create sitemap stream
    const stream = new SitemapStream({
      hostname: `https://${subdomain}.joineden.ai`,
    });

    // Add URLs to the sitemap stream
    subdomainUrls.forEach((_url) => {
      stream.write({
        url: _url.url,
        changefreq: _url.changefreq,
        priority: _url.priority,
      });
    });

    // End sitemap stream
    stream.end();

    // Generate XML
    const xml = await streamToPromise(stream).then((data) => data.toString());

    // Set headers
    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Content-Length", Buffer.byteLength(xml));

    // Send sitemap XML
    res.status(200).send(xml);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    res.status(500).end();
  }
}
