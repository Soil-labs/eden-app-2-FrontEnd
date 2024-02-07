/* eslint-disable import/no-anonymous-default-export */
import { Position } from "@eden/package-graphql/generated";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const currentJobId = (req.query["job"] as string) || "";
      const community = (req.query["community"] as string) || "";

      if (!community) {
        return res.status(400).send("Missing community");
      }

      const communityPositions = await axios.post(
        process.env.NEXT_PUBLIC_GRAPHQL_URL as string,
        {
          headers: {
            "Access-Control-Allow-Origin": `*`,
          },
          variables: {
            fields: { slug: community },
          },
          query: `
            query Query($fields: findPositionsOfCommunityInput) {
              findPositionsOfCommunity(fields: $fields) {
                _id
                name
                status
                icon
                generalDetails {
                  officePolicy
                  contractType
                  yearlySalary {
                    min
                    max
                  }
                }
                company {
                  _id
                  name
                  slug
                  imageUrl
                  whatsToLove
                }
              }
            }
          `,
        }
      );

      const baseUrl =
        process.env.NEXT_PUBLIC_ENV_BRANCH === "develop"
          ? `https://${community}.preview.joineden.ai`
          : `https://${community}.joineden.ai`;

      const _positions =
        communityPositions.data.data.findPositionsOfCommunity.filter(
          (_position: Position) =>
            _position?.status !== "ARCHIVED" &&
            _position?.status !== "UNPUBLISHED" &&
            _position?.status !== "DELETED"
        ) as Position[];

      const positionIndex = _positions.findIndex(
        (_pos: Position) => _pos._id === currentJobId
      );

      const newPosition =
        _positions[positionIndex - 1] || _positions[_positions.length - 1];

      const imageUrl = getImageUrl(newPosition);

      // Return an HTML response
      res.setHeader("Content-Type", "text/html");
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Eden Jobs</title>
            <meta property="og:title" content="Eden Jobs">
            <meta property="og:image" content="${imageUrl}">
            <meta name="fc:frame" content="vNext">
            <meta name="fc:frame:image" content="${imageUrl}">
            <meta name="fc:frame:post_url" content="${baseUrl}/api/fc/next-job?job=${newPosition._id}&community=${community}">
            <meta name="fc:frame:button:1" content="See next job">
          </head>
          <body>
          </body>
        </html>
      `);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error generating image");
    }
  } else {
    // Handle any non-POST requests
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

function getImageUrl(position: Position) {
  const DEFAULT_IMAGE = `https://pbs.twimg.com/profile_images/1595723986524045312/fqOO4ZI__400x400.jpg`;

  const imageSrc = position.company?.imageUrl
    ? position.company?.imageUrl
    : DEFAULT_IMAGE;

  const baseUrl =
    process.env.NEXT_PUBLIC_ENV_BRANCH === "develop"
      ? `https://${position.company?.slug}.preview.joineden.ai`
      : `https://${position.company?.slug}.joineden.ai`;

  let imageUrl = `${baseUrl}/api/og/position?image=${imageSrc}`;

  if (position.name) {
    imageUrl = imageUrl + `&position=${position.name}`;
  }
  if (position.generalDetails?.yearlySalary?.min) {
    imageUrl =
      imageUrl + `&salaryMin=${position.generalDetails?.yearlySalary?.min}`;
  }
  if (position.generalDetails?.yearlySalary?.max) {
    imageUrl =
      imageUrl + `&salaryMax=${position.generalDetails?.yearlySalary?.max}`;
  }
  if (position.generalDetails?.officePolicy) {
    imageUrl =
      imageUrl + `&officePolicy=${position.generalDetails?.officePolicy}`;
  }
  if (position.generalDetails?.officeLocation) {
    imageUrl = imageUrl + `&location=${position.generalDetails.officeLocation}`;
  }

  return imageUrl;
}
