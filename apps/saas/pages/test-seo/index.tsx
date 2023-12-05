// components/OgImageTemplate.tsx

import React from "react";

interface OgImageTemplateProps {
  title: string;
  company: string;
}

const OgImageTemplate: React.FC<OgImageTemplateProps> = (
  {
    //   title,
    //   company,
  }
) => {
  return (
    <div className=" w-[76rem] h-[40rem]  bg-emerald-900 rounded-lg">
      <div className=" left-[95px] top-[30px] flex">
        <div className="flex flex-col justify-center ">
          <span className="text-edenPink-500 text-8xl font-bold font-Moret leading-2">
            know a great
          </span>
          <span className="text-edenPink-500 text-9xl font-bold font-Moret leading-2 w-full ">
            full-stack developer?
          </span>
        </div>
      </div>

      {/* Company Picture */}
      <div className="flex">
        <div className=" w-80 h-64 border first-line:border-red-900"></div>
        <div>
          <div className=" pr-14 py-1   justify-start items-start gap-5 inline-flex">
            {/* Icon 2 */}
            <div className="Icon w-16 h-16 border border-red-400  " />
            <div className=" self-stretch px-5 bg-edenPink-500 rounded-2xl justify-center items-center gap-5 inline-flex ">
              <div className=" text-center text-emerald-900 text-3xl font-bold font-Moret leading-10 ">
                $120K - $190K + equity
              </div>
            </div>
          </div>
          <div className=" px-5 left-[535.15px] top-[402px]  bg-edenPink-500 rounded-2xl justify-center items-center gap-5 inline-flex">
            <div className=" text-center text-emerald-900 text-3xl font-bold font-Moret leading-10">
              Remote
            </div>
          </div>
          <div className=" px-5 left-[686px] top-[402px]  bg-edenPink-500 rounded-2xl justify-center items-center gap-5 inline-flex">
            <div className=" text-center text-edenGreen-600 text-3xl font-bold font-Moret leading-10">
              SF, CA
            </div>
          </div>
          <div className="flex justify-center items-center">
            <span className="text-edenPink-500 text-8xl font-bold font-Moret underline leading-10">
              refer/apply
            </span>
            <span className="text-edenPink-500 text-8xl font-bold font-Moret leading-10">
              with
            </span>
            {/* Icon 1 */}
            <div className=" w-28 h-28  border " />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OgImageTemplate;
