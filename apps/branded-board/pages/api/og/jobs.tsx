import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

// const DEFAULT_IMAGE = `https://pbs.twimg.com/profile_images/1595723986524045312/fqOO4ZI__400x400.jpg`;

// #F5C7DE
// #FFF

export default async function handler(req: NextRequest) {
  try {
    const clashDisplay = await fetch(
      new URL(
        "../../../public/fonts/clash-display/ClashDisplay-Medium.woff",
        import.meta.url
      )
    ).then((res) => res.arrayBuffer());

    // const { searchParams } = new URL(req.url);

    const params = getParamsFromUrl(req.url.replaceAll("+", "%20"));

    // const imageSrc = searchParams.get("image") ?? DEFAULT_IMAGE;

    // const imageIsWebp = imageSrc.endsWith(".webp");
    console.log(decodeURIComponent(params?.image!));

    return new ImageResponse(
      (
        // Modified based on https://tailwindui.com/components/marketing/sections/cta-sections
        <div
          tw="bg-black items-center justify-center"
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            padding: "2.5rem 4rem",
          }}
        >
          {params?.image && (
            <img
              src={decodeURIComponent(params?.image)}
              tw="w-32 rounded-2xl"
            />
          )}

          <h2 tw="text-[7rem] text-white leading-[4rem] mb-16 text-center">
            Love your work!
          </h2>
          <h2 tw="flex flex-wrap text-[5rem] text-white mb-8 leading-[3rem] text-center">
            Check out these opportunities
          </h2>
          <h2 tw="flex text-center flex-wrap text-[6rem] text-white mb-8 leading-[5rem]">
            @ {params?.title}
          </h2>
        </div>
      ),
      {
        width: 1200,
        height: 628,
        fonts: [
          {
            name: "ClashDisplay-Regular",
            data: clashDisplay,
            style: "normal",
            weight: 700,
          },
        ],
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}

type ParamsType = {
  title?: string;
  image?: string;
};

function getParamsFromUrl(url: string): ParamsType | undefined {
  url = decodeURI(url);
  if (typeof url === "string") {
    const params = url.split("?");
    const eachParamsArr = params[1].split("&");
    const obj: ParamsType = {};

    if (eachParamsArr && eachParamsArr.length) {
      eachParamsArr.map((param) => {
        const keyValuePair = param.split("=");
        const key = keyValuePair[0];
        const value = keyValuePair[1];

        obj[key as keyof ParamsType] = value;
      });
    }
    return obj;
  }
}
