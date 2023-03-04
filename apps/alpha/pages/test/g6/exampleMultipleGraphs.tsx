import { MemberGraph, MemberGraph2, ProjectGraph } from "@eden/package-ui";
import React, { useState } from "react";

import type { NextPageWithLayout } from "../../_app";

const GraphVisualPage: NextPageWithLayout = () => {
  const [step, setStep] = useState(1);

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  let content;

  switch (step) {
    case 1:
      content = (
        <div className={`flex h-[500px] w-full gap-4`}>
          <div className="w-full">
            <MemberGraph memberId={"961730944170090516"} />

            {/* <ProjectGraph projectId={"63ebca723f7197ebd2adbd21"} /> */}
          </div>
        </div>
      );
      break;
    case 2:
      content = (
        <div className={`flex h-[500px] w-full gap-4`}>
          <div className="w-full">
            {/* <ProjectGraph projectId={"63ebca723f7197ebd2adbd21"} /> */}
            <MemberGraph memberId={"908392557258604544"} />
          </div>
        </div>
      );
      break;
    case 3:
      content = (
        <div className={`flex h-[500px] w-full gap-4`}>
          <div className="w-full">
            <ProjectGraph projectId={"63ebca723f7197ebd2adbd21"} />

            {/* <MemberGraph memberId={"908392557258604544"} /> */}
          </div>
        </div>
      );
      break;
    default:
      content = null;
  }

  return (
    <>
      <div className="flex h-screen">
        <div className="w-1/2 bg-gray-200">
          <div className={`flex h-[500px] w-full gap-4`}>
            <div className="w-full">
              <MemberGraph memberId={"908392557258604544"} />
            </div>
          </div>
        </div>
        <div className="w-1/2 bg-gray-400">
          <div className={`flex h-[500px] w-full gap-4`}>
            <div className="w-full">
              <MemberGraph2 memberId={"961730944170090516"} />
            </div>
          </div>
        </div>
      </div>

      {/* <div> */}
      {/* {content} */}
      {/* <div className="mt-8 flex justify-center">
          <div className="flex items-center">
            <div
              className={`h-12 w-12 rounded-full ${
                step >= 1 ? "bg-blue-500" : "bg-gray-400"
              } flex items-center justify-center text-white`}
            >
              1
            </div>
            <div
              className={`h-1 w-16 ${
                step >= 2 ? "bg-blue-500" : "bg-gray-400"
              }`}
            ></div>
            <div
              className={`h-12 w-12 rounded-full ${
                step >= 2 ? "bg-blue-500" : "bg-gray-400"
              } flex items-center justify-center text-white`}
            >
              2
            </div>
            <div
              className={`h-1 w-16 ${
                step >= 3 ? "bg-blue-500" : "bg-gray-400"
              }`}
            ></div>
            <div
              className={`h-12 w-12 rounded-full ${
                step >= 3 ? "bg-blue-500" : "bg-gray-400"
              } flex items-center justify-center text-white`}
            >
              3
            </div>
          </div>
          <div className="ml-8">
            <button
              className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
              onClick={nextStep}
            >
              {step === 3 ? "Finish" : "Next"}
            </button>
          </div>
        </div>
        {content}
      </div> */}
      {/* <div
        style={{
          flexDirection: "column",
          alignItems: "center",
          padding: "10",
          width: "100%",
        }}
      >
        <div className={`flex h-screen w-full gap-4`}>
          <div className="w-full">
            <MemberGraph memberId={"908392557258604544"} />
          </div>
        </div>
      </div> */}
    </>
  );
};

export default GraphVisualPage;
