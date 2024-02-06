import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

const DEFAULT_IMAGE = `https://pbs.twimg.com/profile_images/1595723986524045312/fqOO4ZI__400x400.jpg`;

export default async function handler(req: NextRequest) {
  try {
    const clashDisplay = await fetch(
      new URL(
        "../../../public/fonts/clash-display/ClashDisplay-Medium.woff",
        import.meta.url
      )
    ).then((res) => res.arrayBuffer());

    const { searchParams } = new URL(req.url);

    const params = getParamsFromUrl(req.url.replaceAll("+", "%20"));

    const imageSrc = searchParams.get("image") ?? DEFAULT_IMAGE;

    const formattedSalary = (salary: number) => {
      if (salary >= 1000) return `${salary / 1000}k`;

      return salary;
    };

    const imageIsWebp = imageSrc.endsWith(".webp");

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
            padding: "2.5rem 4rem",
          }}
        >
          <EdenIconExclamationAndQuestion />

          <h2 tw="text-[5rem] text-[#F7F8F7] leading-[4rem]">know a great</h2>
          <h2 tw="flex flex-wrap text-[6rem] text-[#F7F8F7] mb-8 leading-[5rem]">
            {params?.position?.split(" ").map((word, index) => (
              <span tw="mr-3" key={index}>
                {word}
              </span>
            ))}
            <QuestionSVG />
          </h2>

          <div tw="relative flex h-[16rem]">
            <div tw="overflow-hidden w-[22rem] h-[16rem] bg-[#F7F8F7] mr-8 flex justify-center items-center rounded-md">
              <div tw="overflow-hidden w-[20rem] h-[14rem] flex justify-center items-center">
                <img
                  src={imageIsWebp ? DEFAULT_IMAGE : imageSrc}
                  style={{
                    margin: "0 0px",
                    width: "80%",
                  }}
                />
              </div>
            </div>
            <div tw="flex flex-col h-full">
              <div></div>
              {params?.salaryMin ||
              params?.salaryMin === 0 ||
              params?.salaryMax ||
              params?.salaryMax === 0 ? (
                <div tw="flex items-center mb-8">
                  <span tw="w-8">
                    <BagSVG />
                  </span>
                  <div tw="ml-8 h-[2.6rem] text-[2rem] leading-[2rem] rounded-xl bg-[#F7F8F7] text-[#000000] px-4 py-2 flex items-center">
                    <span tw="pb-1">
                      {params?.salaryMin || params?.salaryMin === 0 ? (
                        <>
                          <UsdSVG />
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
                          <UsdSVG />
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
              {params?.officePolicy || params?.location ? (
                <div tw="flex items-center mb-8">
                  <span tw="w-8">
                    <PinSVG />
                  </span>
                  {params?.officePolicy || params?.location ? (
                    <div tw="ml-8 h-[2.6rem] text-[2rem] leading-[2rem] rounded-xl bg-[#F7F8F7] text-[#000000] px-4 py-2 flex items-center">
                      <span tw="pb-1">{params?.officePolicy}</span>
                    </div>
                  ) : null}
                  {params?.location || params?.location ? (
                    <div tw="ml-8 h-[2.6rem] text-[2rem] leading-[2rem] rounded-xl bg-[#F7F8F7] text-[#000000] px-4 py-2 flex items-center">
                      <span tw="pb-1">{params?.location}</span>
                    </div>
                  ) : null}
                </div>
              ) : null}
              <h3 tw="text-[4rem] text-[#F7F8F7] h-4 flex items-center justify-between mt-auto w-[107.2%]">
                <span>refer/apply with</span>
                <DDIcon />
              </h3>
            </div>
          </div>
          {/* <div tw="bg-white flex">
            <div tw="flex flex-col md:flex-row w-full md:items-center justify-between">
              <div tw={`flex flex-col w-1/2 pl-8`}>
                <span tw={`text-lg`} style={{ color: "#071B08" }}>
                  check out my position on
                </span>
                <span tw="text-zinc-600 text-2xl" style={{ color: "#071B08" }}>
                  {title}
                </span>
                <h2 tw="flex flex-col font-bold text-left py-6">
                  <span tw={`text-4xl font-extrabold text-zinc-800`}>
                    {position}
                  </span>
                  <span tw={`text-zinc-600 text-3xl`}>{role}</span>
                </h2>
              </div>

              <div tw="flex">
                <img
                  alt={`${position} profile image`}
                  height={400}
                  src={imageSrc}
                  style={{ margin: "0 0px" }}
                  width={400}
                />
              </div>
            </div>
          </div> */}
        </div>
      ),
      {
        width: 1200,
        height: 628,
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
  route?: string;
  officePolicy?: string;
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

const QuestionSVG = () => {
  return (
    <svg
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 4.02 8.06"
      height={"5rem"}
      style={{ marginTop: "0.5rem" }}
    >
      <path
        d="m.73,4.37c0-.52.29-.92.67-1.38.49-.58,1.24-1.42,1.24-1.98,0-.23-.11-.31-.28-.31-.48,0-1.25.72-1.83,2.11L0,.46c.3-.17,1-.46,1.93-.46,1.32,0,2.09.55,2.09,1.73s-.71,1.75-1.51,2.4c-.61.5-1.19.94-1.22,1.64-.36-.53-.55-1-.55-1.4Zm-.4,2.72c0-.52.41-.97,1.01-.97s1.03.46,1.03.97-.42.97-1.03.97-1.01-.46-1.01-.97Z"
        fill="#F7F8F7"
      />
    </svg>
  );
};
const UsdSVG = () => {
  return (
    <svg
      id="Layer_2"
      data-name="Layer 2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 5.06 9.75"
      height={"1.75rem"}
      style={{ marginTop: "0.2rem", marginRight: "0.25rem" }}
    >
      <g id="Layer_1-2" data-name="Layer 1">
        <path
          d="m2.94,8.83v.92h-.48v-.89c-.98-.02-2.04-.64-2.46-1.94l1.4-.91c.35.89.71,1.44,1.08,1.71l.04-1.93-.96-.58c-.82-.5-1.38-.91-1.38-1.99C.18,2.07,1.1,1.04,2.59.8v-.8h.47v.76s.18,0,.18,0c.5,0,1.1.11,1.59.22l-.35,2.71c-.3-.61-.84-1.33-1.45-1.73l-.02,1.92.78.49c.66.42,1.27.98,1.27,1.97,0,1.31-.94,2.31-2.12,2.49Zm-.38-5.25l.02-1.83c-.13-.05-.28-.07-.41-.07-.37,0-.65.24-.65.59,0,.46.24.79,1.03,1.32Zm1.28,3.75c0-.48-.18-.83-.86-1.25l-.02,1.87c.07.01.16.02.23.02.4,0,.66-.3.66-.65Z"
          fill="#000000"
        />
      </g>
    </svg>
  );
};
const BagSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="38"
      height="48"
      viewBox="0 0 38 48"
      fill="none"
    >
      <path
        d="M21.9489 25.0983H17.2165C15.8088 25.0983 14.6688 26.2384 14.6688 27.6459C14.6688 29.0537 15.8088 30.196 17.2165 30.196H20.1294C21.5371 30.196 22.6771 31.336 22.6771 32.7437C22.6771 34.1513 21.5371 35.2914 20.1294 35.2914H15.397M18.6714 35.2945V37.435M18.6714 22.9499V25.109M11.1285 14.6831C16.1586 15.8394 21.1866 15.8394 26.2169 14.6831M5.97334 22.8131C7.62293 20.0677 9.4028 17.3665 11.1292 14.663L6.41073 5.83333C6.41073 5.83333 6.77137 5.52387 7.67179 4.82587C10.3637 2.7412 13.3093 2.20141 16.4944 3.4392C19.5284 4.61881 22.6065 5.51225 25.901 5.32611C26.8597 5.27027 30.538 4.78168 30.538 4.78168L26.2174 14.6467C27.9439 17.3479 29.719 20.0677 31.3688 22.8131C34.0814 27.3269 36.6758 32.3618 34.5748 37.6014C32.1294 43.7019 24.9959 45.7261 18.6697 45.8261C12.346 45.7261 5.21252 43.7019 2.76722 37.6014C0.666246 32.3618 3.26045 27.3269 5.97334 22.8131Z"
        stroke="#F7F8F7"
        stroke-width="3.58696"
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
      width="35"
      height="41"
      viewBox="0 0 33 38"
      fill="none"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M21.3846 16.1749C21.3846 13.5325 19.215 11.3913 16.5394 11.3913C13.8619 11.3913 11.6923 13.5325 11.6923 16.1749C11.6923 18.8154 13.8619 20.9565 16.5394 20.9565C19.215 20.9565 21.3846 18.8154 21.3846 16.1749Z"
        stroke="#F7F8F7"
        stroke-width="2.86957"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M16.5375 36.2609C14.2143 36.2609 2 26.5013 2 16.295C2 8.30489 8.50761 1.82611 16.5375 1.82611C24.5674 1.82611 31.0769 8.30489 31.0769 16.295C31.0769 26.5013 18.8607 36.2609 16.5375 36.2609Z"
        stroke="#F7F8F7"
        stroke-width="2.86957"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

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
        fill="#F7F8F7"
      />
      <path
        d="M16.3336 55.9244C12.7297 59.1347 10.0152 61.5518 7.05273 64.0215L15.8408 72.8096C18.2609 69.7976 20.678 67.083 23.8883 63.4792C28.7751 57.9975 30.9996 53.1107 34.1573 45.7047C26.7512 48.8627 21.8152 51.0376 16.3336 55.9244Z"
        fill="#F7F8F7"
      />
      <path
        d="M45.9082 45.7048C49.0689 53.1108 51.2412 58.0472 56.1279 63.5285C59.3379 67.1324 61.758 69.8469 64.2276 72.8093L73.0154 64.0212C70.0038 61.6015 67.2862 59.184 63.6823 55.9741C58.2037 51.0843 53.3142 48.8625 45.9082 45.7048Z"
        fill="#F7F8F7"
      />
      <path
        d="M63.7319 23.7347C67.3384 20.5244 70.053 18.1047 73.0154 15.635L64.2273 6.84693C61.8075 9.85892 59.3874 12.5761 56.1771 16.18C51.2904 21.659 49.0685 26.5484 45.9082 33.9545C53.3139 30.7938 58.2529 28.6215 63.7319 23.7347Z"
        fill="#F7F8F7"
      />
      <path
        d="M40.0346 33.8937C36.7567 33.8937 34.0996 36.5508 34.0996 39.8287C34.0996 43.1066 36.7567 45.7637 40.0346 45.7637C43.3121 45.7637 45.9696 43.1066 45.9696 39.8287C45.9696 36.5508 43.3121 33.8937 40.0346 33.8937Z"
        fill="#F7F8F7"
      />
      <path
        d="M42.5051 3.85983C42.8851 3.81852 43.284 3.90377 43.367 4.66916C43.6697 7.40586 39.9832 12.5845 37.7753 15.9239C36.0601 18.501 34.8403 20.8933 35.1212 23.44C35.3661 25.6701 36.7372 28.1646 39.0995 30.8708C38.7829 27.424 41.9628 24.6873 44.9334 21.78C49.0079 17.7826 52.2952 14.2583 51.6263 8.20994C50.9323 1.8994 46.5852 -0.652527 39.3196 0.148542C34.1631 0.718267 30.6336 2.65128 29.125 3.59543L33.6456 16.5106C36.3628 8.40786 40.2119 4.11296 42.5051 3.85983Z"
        fill="#F7F8F7"
      />
      <path
        d="M3.88997 37.5361C3.84603 37.1534 3.93128 36.7568 4.69667 36.6746C7.43338 36.3715 12.6146 40.0554 15.9545 42.2659C18.5282 43.9811 20.9209 45.1979 23.4675 44.9174C25.6976 44.6721 28.1917 43.3013 30.8984 40.9391C27.4511 41.2557 24.7148 38.0758 21.8072 35.1051C17.8097 31.0333 14.2885 27.7434 8.23708 28.4123C1.92692 29.1059 -0.625011 33.4534 0.176058 40.7186C0.745783 45.8781 2.68142 49.4049 3.62295 50.9136L16.5377 46.393C8.43537 43.6758 4.14047 39.8267 3.88997 37.5361Z"
        fill="#F7F8F7"
      />
      <path
        d="M37.5635 76.1488C37.1808 76.1928 36.7872 76.1102 36.702 75.3421C36.3989 72.6054 40.0828 67.4268 42.2933 64.0874C44.0085 61.5103 45.2257 59.1206 44.9448 56.5713C44.6995 54.3412 43.3287 51.8471 40.9691 49.1404C41.2857 52.5877 38.1032 55.324 35.1325 58.2343C31.0607 62.2291 27.7734 65.7503 28.4423 71.8044C29.1363 78.1119 33.4834 80.6638 40.746 79.8628C45.9055 79.293 49.4323 77.3604 50.944 76.4185L46.423 63.5011C43.7032 71.6034 39.8571 75.8983 37.5635 76.1488Z"
        fill="#F7F8F7"
      />
      <path
        d="M79.8903 39.2926C79.3202 34.1332 77.3875 30.6063 76.446 29.0977L63.5283 33.6183C71.631 36.3359 75.9259 40.1846 76.1764 42.4751C76.2203 42.8578 76.1377 43.2544 75.3697 43.3397C72.6329 43.6428 67.4544 39.9563 64.1149 37.748C61.5378 36.0328 59.1481 34.8133 56.5988 35.0943C54.3717 35.3391 51.8743 36.7103 49.168 39.0722C52.6179 38.7556 55.3516 41.9355 58.2618 44.9061C62.2566 48.981 65.7805 52.2682 71.8319 51.599C78.142 50.9027 80.6913 46.5582 79.8903 39.2926Z"
        fill="#F7F8F7"
      />
    </svg>
  );
};

const DDIcon = () => {
  return (
    <svg
      width="114"
      height="114"
      viewBox="0 0 114 114"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "7rem", height: "7rem", marginLeft: "2rem" }}
    >
      <g clip-path="url(#clip0_1934_20192)">
        <path
          d="M114 57C114 25.5198 88.4802 0 57 0C25.5198 0 0 25.5198 0 57C0 88.4802 25.5198 114 57 114C88.4802 114 114 88.4802 114 57Z"
          fill="#F7F8F7"
        />
        <path
          d="M67.6875 80.1562V73.0312H44.5312V80.1562H67.6875Z"
          fill="#000000"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M10.6875 35.625V73.0312H23.8898C34.306 73.0312 42.75 64.6576 42.75 54.3281C42.75 43.9987 34.306 35.625 23.8898 35.625H10.6875ZM18.7705 43.6406V65.0156H23.8898C29.8418 65.0156 34.667 60.2307 34.667 54.3281C34.667 48.4256 29.8418 43.6406 23.8898 43.6406H18.7705Z"
          fill="#000000"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M73.0312 35.625V73.0312H86.2335C96.6497 73.0312 105.094 64.6576 105.094 54.3281C105.094 43.9987 96.6497 35.625 86.2335 35.625H73.0312ZM81.1142 43.6406V65.0156H86.2335C92.1856 65.0156 97.0108 60.2307 97.0108 54.3281C97.0108 48.4256 92.1856 43.6406 86.2335 43.6406H81.1142Z"
          fill="#000000"
        />
      </g>
    </svg>
  );
};
