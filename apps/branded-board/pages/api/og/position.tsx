import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

// const DEFAULT_IMAGE = `https://pbs.twimg.com/profile_images/1595723986524045312/fqOO4ZI__400x400.jpg`;

export default async function handler(req: NextRequest) {
  try {
    const clashDisplay = await fetch(
      new URL(
        "../../../public/fonts/clash-display/ClashDisplay-Medium.woff",
        import.meta.url
      )
    ).then((res) => res.arrayBuffer());

    const params = getParamsFromUrl(req.url.replaceAll("+", "%20"));

    const formattedSalary = (salary: number) => {
      if (salary >= 1000) return `${salary / 1000}k`;

      return salary;
    };

    return new ImageResponse(
      (
        // Modified based on https://tailwindui.com/components/marketing/sections/cta-sections
        <div
          tw="bg-[#000000]"
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            padding: "8.3rem 4rem 1rem",
            alignItems: "center",
            backgroundImage:
              "url(https://developer-dao.joineden.ai/d_d-og-bg.png)",
            // "url(http://localhost:3000/d_d-og-bg.png)",
          }}
        >
          <div tw="w-[85%] flex flex-col">
            <h2 tw="text-[4rem] text-white leading-[3.5rem]">
              {params?.position}
            </h2>
            <h3 tw="flex flex-wrap text-[2.5rem] text-white leading-[2rem] mb-8">
              {params?.company}
            </h3>
          </div>

          <div tw="w-[85%] flex">
            {params?.salaryMin ||
            params?.salaryMin === 0 ||
            params?.salaryMax ||
            params?.salaryMax === 0 ? (
              <div tw="flex items-center mr-6">
                <span tw="w-8 mr-2">
                  <BagSVG />
                </span>
                <div tw="text-[1.7rem] leading-[1.7rem] text-[#BDBDC0] flex items-center">
                  <span tw="pb-1">
                    {params?.salaryMin || params?.salaryMin === 0 ? (
                      <>
                        {"$"}
                        <span>{`${formattedSalary(
                          Number(params?.salaryMin)
                        )}`}</span>
                      </>
                    ) : (
                      <span></span>
                    )}
                    {(params?.salaryMin || params?.salaryMin === 0) &&
                    (params?.salaryMax || params?.salaryMax === 0) ? (
                      <span tw="mx-3"> - </span>
                    ) : null}
                    {params?.salaryMax || params?.salaryMax === 0 ? (
                      <>
                        {"$"}
                        <span>{`${formattedSalary(
                          Number(params?.salaryMax)
                        )}`}</span>
                      </>
                    ) : (
                      <span></span>
                    )}
                  </span>
                </div>
              </div>
            ) : null}
            {!(
              params?.salaryMin ||
              params?.salaryMin === 0 ||
              params?.salaryMax ||
              params?.salaryMax === 0
            ) && params?.contractType ? (
              <div tw="flex items-center mr-6">
                <div tw="text-[1.7rem] leading-[1.7rem] text-[#BDBDC0] flex items-center">
                  <span tw="pb-1">{params?.contractType}</span>
                </div>
              </div>
            ) : null}
            {params?.officePolicy || params?.location ? (
              <div
                tw="flex items-center"
                style={
                  params?.salaryMin ||
                  params?.salaryMin === 0 ||
                  params?.salaryMax ||
                  params?.salaryMax === 0 ||
                  params?.contractType
                    ? {
                        borderLeft: "1px solid #BDBDC0",
                        paddingLeft: "1.5rem",
                      }
                    : {}
                }
              >
                <span tw="mr-2">
                  <PinSVG />
                </span>
                {params?.officePolicy || params?.location ? (
                  <div tw="text-[1.7rem] leading-[1.7rem] text-[#BDBDC0] flex items-center mr-4">
                    <span tw="pb-1">{params?.officePolicy}</span>
                  </div>
                ) : null}
                {params?.location || params?.location ? (
                  <div tw="text-[1.7rem] leading-[1.7rem] text-[#BDBDC0] flex items-center mr-4">
                    <span tw="pb-1">
                      {decodeURIComponent(params?.location)}
                    </span>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Clash Display",
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
  salaryMin?: number | string;
  salaryMax?: number | string;
  position?: string;
  company?: string;
  route?: string;
  officePolicy?: string;
  contractType?: string;
  location?: string;
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

const BagSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="29"
      viewBox="0 0 38 48"
      fill="none"
    >
      <path
        d="M21.9489 25.0983H17.2165C15.8088 25.0983 14.6688 26.2384 14.6688 27.6459C14.6688 29.0537 15.8088 30.196 17.2165 30.196H20.1294C21.5371 30.196 22.6771 31.336 22.6771 32.7437C22.6771 34.1513 21.5371 35.2914 20.1294 35.2914H15.397M18.6714 35.2945V37.435M18.6714 22.9499V25.109M11.1285 14.6831C16.1586 15.8394 21.1866 15.8394 26.2169 14.6831M5.97334 22.8131C7.62293 20.0677 9.4028 17.3665 11.1292 14.663L6.41073 5.83333C6.41073 5.83333 6.77137 5.52387 7.67179 4.82587C10.3637 2.7412 13.3093 2.20141 16.4944 3.4392C19.5284 4.61881 22.6065 5.51225 25.901 5.32611C26.8597 5.27027 30.538 4.78168 30.538 4.78168L26.2174 14.6467C27.9439 17.3479 29.719 20.0677 31.3688 22.8131C34.0814 27.3269 36.6758 32.3618 34.5748 37.6014C32.1294 43.7019 24.9959 45.7261 18.6697 45.8261C12.346 45.7261 5.21252 43.7019 2.76722 37.6014C0.666246 32.3618 3.26045 27.3269 5.97334 22.8131Z"
        stroke="#BDBDC0"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
const PinSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="29"
      viewBox="0 0 33 38"
      fill="none"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M21.3846 16.1749C21.3846 13.5325 19.215 11.3913 16.5394 11.3913C13.8619 11.3913 11.6923 13.5325 11.6923 16.1749C11.6923 18.8154 13.8619 20.9565 16.5394 20.9565C19.215 20.9565 21.3846 18.8154 21.3846 16.1749Z"
        stroke="#BDBDC0"
        stroke-width="2.3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M16.5375 36.2609C14.2143 36.2609 2 26.5013 2 16.295C2 8.30489 8.50761 1.82611 16.5375 1.82611C24.5674 1.82611 31.0769 8.30489 31.0769 16.295C31.0769 26.5013 18.8607 36.2609 16.5375 36.2609Z"
        stroke="#BDBDC0"
        stroke-width="2.3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
