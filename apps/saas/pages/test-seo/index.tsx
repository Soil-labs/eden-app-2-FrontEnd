// components/OgImageTemplate.tsx

import Image from "next/image";
import React from "react";
import { SlLocationPin } from "react-icons/sl";
import { TbMoneybag } from "react-icons/tb";
interface OgImageTemplateProps {
  title: string;
  company: string;
  salary: string | number;
}

const OgImageTemplate: React.FC<OgImageTemplateProps> = ({
  //   title,
  //   company,
  //   companyImage
  salary,
}) => {
  return (
    <div className=" w-[76rem] h-[40rem]  bg-emerald-900 rounded-lg relative">
      <div className="absolute right-12 top-8">
        <Image src={"/eden_logo_seo.png"} alt="" width={63} height={63} />
      </div>
      <div className="  flex pt-8 pl-24">
        <div className="flex flex-col justify-center ">
          <span className="text-edenPink-500 text-8xl font-bold font-Moret leading-2">
            know a great
          </span>
          <span className="text-edenPink-500 text-9xl font-bold font-Moret leading-2 w-full ">
            full-stack developer?
          </span>
        </div>
      </div>

      <div className="flex pt-9 pl-24">
        <div className=" w-80 h-64 border first-line:border-red-900"></div>
        <div>
          <div className=" pr-14 py-1   justify-start items-start gap-5 inline-flex">
            {/* Icon 2 */}
            <div className="Icon w-16 h-16 border border-red-400" />
            <div className="flex flex-col space-y-10 ">
              <div className="flex items-center">
                <TbMoneybag
                  size={30}
                  className="text-edenPink-500 mr-3 inline-block"
                />
                <div className="  w-80 px-5 bg-edenPink-500 rounded-2xl justify-center items-center gap-5 inline-flex ">
                  <div className=" text-center text-emerald-900 text-3xl font-bold font-Moret leading-10 ">
                    {salary}
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center">
                  <SlLocationPin
                    size={30}
                    className="text-edenPink-500 mr-3 inline-block"
                  />
                  <div className=" px-5   bg-edenPink-500 rounded-2xl justify-center items-center gap-5 inline-flex mr-6">
                    <div className=" text-center text-emerald-900 text-3xl font-bold font-Moret leading-10">
                      Remote
                    </div>
                  </div>
                  <div className=" px-5 bg-edenPink-500 rounded-2xl justify-center items-center gap-5 inline-flex">
                    <div className=" text-center text-edenGreen-600 text-3xl font-bold font-Moret leading-10">
                      SF, CA
                    </div>
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
                  <div className=" w-28 h-28 ml-4 ">
                    <Image
                      src={"/D_D-logo.png"}
                      alt=""
                      width={124}
                      height={124}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OgImageTemplate;
