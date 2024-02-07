import { Company, Position } from "@eden/package-graphql/generated";
import Head from "next/head";
import React, { FC } from "react";

const DEFAULT_TITLE = process.env.NEXT_PUBLIC_ENV_BRANCH
  ? `Eden protocol - ${process.env.NEXT_PUBLIC_ENV_BRANCH}`
  : `Eden protocol`;
const DEFAULT_DESCRIPTION = `Together, let's build the perfect breeding ground for everyone to do work they love. Eden's talent coordination protocol is how.`;

const DEFAULT_IMAGE = `https://pbs.twimg.com/profile_images/1595723986524045312/fqOO4ZI__400x400.jpg`;

export interface SEOJobBoardProps {
  title: string;
  description: string;
  company: Company;
}

export const SEOJobBoard: FC<SEOJobBoardProps> = ({
  title,
  description,
  company,
}) => {
  const appTitle = title + ` | ` + DEFAULT_TITLE;
  const appDescription = description ? description : DEFAULT_DESCRIPTION;

  const imageSrc = company?.imageUrl ? company?.imageUrl : DEFAULT_IMAGE;

  // console.log("image", image);

  // const apiUrl = `/api/og/position?image=${imageSrc}&position=${position}`;
  let apiUrl = `/api/og/jobs?image=${imageSrc}`;

  if (title) {
    apiUrl = apiUrl + `&title=${title}`;
  }

  let ogImage = "https://app.joineden.ai" + apiUrl;

  if (process.env.NEXT_PUBLIC_ENV_BRANCH === "develop") {
    ogImage = "https://eden-saas-staging.vercel.app" + apiUrl;
  } else if (process.env.NEXT_PUBLIC_ENV_BRANCH === "localhost") {
    ogImage = apiUrl;
  }

  const _positions = company?.positions?.filter(
    (_position) =>
      _position?.status !== "ARCHIVED" &&
      _position?.status !== "UNPUBLISHED" &&
      _position?.status !== "DELETED"
  ) as Position[];

  const firstPosition =
    _positions && _positions.length > 0
      ? _positions[_positions.length - 1]?._id
      : "";

  return (
    <Head>
      <meta property="og:site_name" content={`Eden protocol`} />
      <meta property="og:title" content={appTitle} />
      <meta property="og:description" content={appDescription} />
      <meta
        property="og:image"
        content={encodeURI(ogImage).replace(/&amp;/g, "&")}
      />
      <meta property="og:image:width" content="800" />
      <meta property="og:image:height" content="400" />

      <meta property="fc:frame" content="vNext" />
      <meta
        property="fc:frame:image"
        content={encodeURI(ogImage).replace(/&amp;/g, "&")}
      />
      <meta property="fc:frame:button:1" content="See opportunities" />
      <meta
        property="fc:frame:post_url"
        content={
          process.env.NEXT_PUBLIC_ENV_BRANCH === "develop"
            ? `https://eden-saas-staging.vercel.app/api/fc/next-job?job=${firstPosition}&community=${company?.slug}`
            : `https://app.joineden.ai/api/fc/next-job?job=${firstPosition}&community=${company?.slug}`
        }
      />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:site" content={`Eden protocol`} />
      <meta property="twitter:title" content={appTitle} />
      <meta property="twitter:description" content={appDescription} />
      <meta
        property="twitter:image:src"
        content={encodeURI(ogImage).replace(/&amp;/g, "&")}
      />
      <meta property="twitter:image:width" content="800" />
      <meta property="twitter:image:height" content="400" />
      <meta property="twitter:creator" content={`Eden protocol`} />
    </Head>
  );
};

export default SEOJobBoard;
