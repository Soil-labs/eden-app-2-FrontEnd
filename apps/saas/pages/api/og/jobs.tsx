import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "experimental-edge",
};

// const DEFAULT_IMAGE = `https://pbs.twimg.com/profile_images/1595723986524045312/fqOO4ZI__400x400.jpg`;

// #F5C7DE
// #00462C

export default async function handler(req: NextRequest) {
  try {
    const moretBold = await fetch(
      new URL("../../../public/fonts/moret/Moret-Bold.woff", import.meta.url)
    ).then((res) => res.arrayBuffer());

    // const { searchParams } = new URL(req.url);

    const params = getParamsFromUrl(req.url.replaceAll("+", "%20"));

    // const imageSrc = searchParams.get("image") ?? DEFAULT_IMAGE;

    // const imageIsWebp = imageSrc.endsWith(".webp");

    return new ImageResponse(
      (
        // Modified based on https://tailwindui.com/components/marketing/sections/cta-sections
        <div
          tw="bg-[#F5C7DE] items-center justify-center"
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            padding: "2.5rem 4rem",
          }}
        >
          <EdenIconExclamationAndQuestion />

          <h2 tw="text-[7rem] text-[#00462C] leading-[4rem] mb-16 text-center">
            Love your work!
          </h2>
          <h2 tw="flex flex-wrap text-[5rem] text-[#00462C] mb-8 leading-[5rem]">
            Check out these opportunities
          </h2>
          <h2 tw="flex text-center flex-wrap text-[6rem] text-[#00462C] mb-8 leading-[5rem]">
            @ {params?.title}
          </h2>
        </div>
      ),
      {
        width: 1200,
        height: 628,
        fonts: [
          {
            name: "Moret",
            data: moretBold,
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

const EdenIconExclamationAndQuestion = () => {
  return (
    <svg
      width="6rem"
      height="6rem"
      viewBox="0 0 81 81"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", right: "3rem", top: "2rem" }}
    >
      <path
        d="M34.1573 33.9543C30.9996 26.5483 28.8247 21.6093 23.9379 16.1306C20.7276 12.5241 18.3101 9.80922 15.8408 6.84681L7.05273 15.6349C10.0647 18.055 12.7793 20.4751 16.3831 23.685C21.8644 28.5718 26.7512 30.7936 34.1573 33.9543Z"
        fill="#00462C"
      />
      <path
        d="M16.3336 55.9244C12.7297 59.1347 10.0152 61.5518 7.05273 64.0215L15.8408 72.8096C18.2609 69.7976 20.678 67.083 23.8883 63.4792C28.7751 57.9975 30.9996 53.1107 34.1573 45.7047C26.7512 48.8627 21.8152 51.0376 16.3336 55.9244Z"
        fill="#00462C"
      />
      <path
        d="M45.9082 45.7048C49.0689 53.1108 51.2412 58.0472 56.1279 63.5285C59.3379 67.1324 61.758 69.8469 64.2276 72.8093L73.0154 64.0212C70.0038 61.6015 67.2862 59.184 63.6823 55.9741C58.2037 51.0843 53.3142 48.8625 45.9082 45.7048Z"
        fill="#00462C"
      />
      <path
        d="M63.7319 23.7347C67.3384 20.5244 70.053 18.1047 73.0154 15.635L64.2273 6.84693C61.8075 9.85892 59.3874 12.5761 56.1771 16.18C51.2904 21.659 49.0685 26.5484 45.9082 33.9545C53.3139 30.7938 58.2529 28.6215 63.7319 23.7347Z"
        fill="#00462C"
      />
      <path
        d="M40.0346 33.8937C36.7567 33.8937 34.0996 36.5508 34.0996 39.8287C34.0996 43.1066 36.7567 45.7637 40.0346 45.7637C43.3121 45.7637 45.9696 43.1066 45.9696 39.8287C45.9696 36.5508 43.3121 33.8937 40.0346 33.8937Z"
        fill="#00462C"
      />
      <path
        d="M42.5051 3.85983C42.8851 3.81852 43.284 3.90377 43.367 4.66916C43.6697 7.40586 39.9832 12.5845 37.7753 15.9239C36.0601 18.501 34.8403 20.8933 35.1212 23.44C35.3661 25.6701 36.7372 28.1646 39.0995 30.8708C38.7829 27.424 41.9628 24.6873 44.9334 21.78C49.0079 17.7826 52.2952 14.2583 51.6263 8.20994C50.9323 1.8994 46.5852 -0.652527 39.3196 0.148542C34.1631 0.718267 30.6336 2.65128 29.125 3.59543L33.6456 16.5106C36.3628 8.40786 40.2119 4.11296 42.5051 3.85983Z"
        fill="#00462C"
      />
      <path
        d="M3.88997 37.5361C3.84603 37.1534 3.93128 36.7568 4.69667 36.6746C7.43338 36.3715 12.6146 40.0554 15.9545 42.2659C18.5282 43.9811 20.9209 45.1979 23.4675 44.9174C25.6976 44.6721 28.1917 43.3013 30.8984 40.9391C27.4511 41.2557 24.7148 38.0758 21.8072 35.1051C17.8097 31.0333 14.2885 27.7434 8.23708 28.4123C1.92692 29.1059 -0.625011 33.4534 0.176058 40.7186C0.745783 45.8781 2.68142 49.4049 3.62295 50.9136L16.5377 46.393C8.43537 43.6758 4.14047 39.8267 3.88997 37.5361Z"
        fill="#00462C"
      />
      <path
        d="M37.5635 76.1488C37.1808 76.1928 36.7872 76.1102 36.702 75.3421C36.3989 72.6054 40.0828 67.4268 42.2933 64.0874C44.0085 61.5103 45.2257 59.1206 44.9448 56.5713C44.6995 54.3412 43.3287 51.8471 40.9691 49.1404C41.2857 52.5877 38.1032 55.324 35.1325 58.2343C31.0607 62.2291 27.7734 65.7503 28.4423 71.8044C29.1363 78.1119 33.4834 80.6638 40.746 79.8628C45.9055 79.293 49.4323 77.3604 50.944 76.4185L46.423 63.5011C43.7032 71.6034 39.8571 75.8983 37.5635 76.1488Z"
        fill="#00462C"
      />
      <path
        d="M79.8903 39.2926C79.3202 34.1332 77.3875 30.6063 76.446 29.0977L63.5283 33.6183C71.631 36.3359 75.9259 40.1846 76.1764 42.4751C76.2203 42.8578 76.1377 43.2544 75.3697 43.3397C72.6329 43.6428 67.4544 39.9563 64.1149 37.748C61.5378 36.0328 59.1481 34.8133 56.5988 35.0943C54.3717 35.3391 51.8743 36.7103 49.168 39.0722C52.6179 38.7556 55.3516 41.9355 58.2618 44.9061C62.2566 48.981 65.7805 52.2682 71.8319 51.599C78.142 50.9027 80.6913 46.5582 79.8903 39.2926Z"
        fill="#00462C"
      />
    </svg>
  );
};
