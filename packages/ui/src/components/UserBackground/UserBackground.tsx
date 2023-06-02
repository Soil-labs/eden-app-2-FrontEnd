import {
  // Endorsements,
  Maybe,
  PreviousProjectsType,
} from "@eden/package-graphql/generated";
import React from "react";

export interface IUserBackgroundProps {
  background: Array<Maybe<PreviousProjectsType>>;
  // initialEndorsements: Array<Maybe<Endorsements>>;
  experienceOpen: number | null;
  setExperienceOpen: React.Dispatch<React.SetStateAction<number | null>>;
}

export const UserBackground = ({
  background,
  // initialEndorsements,
  experienceOpen,
  setExperienceOpen,
}: IUserBackgroundProps) => {
  return (
    <div>
      <div className="">
        {/* <TextLabel1>🎡 Background</TextLabel1> */}
        {background?.map((item, index) => {
          const empty =
            !item?.description && !item?.startDate && !item?.endDate;

          if (!item?.title) return null;
          return (
            <div key={index} className="my-4" id="user-background">
              <div className="mb-2 flex items-center">
                <span
                  className={`mr-3 ${
                    empty ? "cursor-default text-slate-400" : "cursor-pointer"
                  }`}
                  onClick={() => {
                    if (!empty)
                      setExperienceOpen(
                        index === experienceOpen ? null : index
                      );
                  }}
                >
                  {!empty && index === experienceOpen ? "▼" : "▶"}
                </span>
                <div className=" flex h-fit justify-center break-words  !rounded-full border-0 bg-[#DEFEFF] px-4 text-center outline-0">
                  {item?.title}
                </div>
                {/* {index < 2 && <span className="ml-3 text-xl">⭐️</span>} */}
              </div>
              {index === experienceOpen && (
                <div className="pl-8">
                  <div className="text-gray-500">
                    {/* <TextLabel1>Timeline</TextLabel1> */}
                    {item?.startDate && (
                      <p>
                        {`${new Date(Number(item?.startDate)).toLocaleString(
                          "default",
                          {
                            month: "short",
                          }
                        )} ${new Date(
                          Number(item?.startDate)
                        ).getFullYear()} - ${
                          item?.endDate
                            ? `${new Date(Number(item?.endDate)).toLocaleString(
                                "default",
                                { month: "short" }
                              )} ${new Date(
                                Number(item?.endDate)
                              ).getFullYear()}`
                            : "present"
                        }`}
                      </p>
                    )}
                  </div>
                  <div className="">
                    {/* <TextLabel1>Description</TextLabel1> */}
                    <p className="whitespace-pre-wrap">{item?.description}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* MEMEBER.ENDORSEMENT NO LONGER EXISTS */}

      {/* {initialEndorsements && initialEndorsements.length > 0 && (
        <div className="mt-3">
          <EndorsementList endorsements={initialEndorsements} />
        </div>
      )} */}
    </div>
  );
};
