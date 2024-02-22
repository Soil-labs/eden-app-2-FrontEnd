"use client";

import { Position } from "@eden/package-graphql/generated";
import { Badge } from "@eden/package-ui";
import { classNames } from "@eden/package-ui/utils";
import { useState } from "react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import {
  BsFillFileEarmarkBarGraphFill,
  BsFillFileEarmarkMinusFill,
  BsFillFileEarmarkPlusFill,
} from "react-icons/bs";
import { TiStarHalfOutline } from "react-icons/ti";

interface ApplicationStepContainerProps {
  titleRole: string;
  topSkills: any[];
  position: Position;
  content: {
    matchPercentage: number | null;
    improvementPoints: string | null;
    strongFit: string | null;
    growthAreas: string | null;
    experienceAreas: string | null;
  };
}

const ApplicationStepContainer = ({
  // eslint-disable-next-line no-unused-vars
  titleRole,
  // eslint-disable-next-line no-unused-vars
  topSkills,
  // eslint-disable-next-line no-unused-vars
  position,
  content,
}: ApplicationStepContainerProps) => {
  const getMatchText = () => {
    if (content.matchPercentage! >= 80) {
      return "Very High";
    } else if (content.matchPercentage! >= 60) {
      return "High";
    } else if (content.matchPercentage! >= 40) {
      return "Average";
    } else if (content.matchPercentage! >= 20) {
      return "Low";
    } else if (content.matchPercentage! < 20) {
      return "Very Low";
    } else {
      return "";
    }
  };
  const matchText = getMatchText(); //

  const [openSections, setOpenSections] = useState<{
    areasToImprove: boolean;
    growth: boolean;
    strongSuit: boolean;
  }>({
    areasToImprove: true,
    growth: false,
    strongSuit: false,
  });

  return (
    <div className="mx-auto max-w-2xl pb-12 pt-8">
      <section className="mb-6">
        <div className="bg-edenGray-100 text-edenGray-900 mb-2 flex h-12 w-12 items-center justify-center rounded-2xl pb-px pl-px">
          <TiStarHalfOutline size={"1.2rem"} />
        </div>
        <p className="">CV Insights</p>
        <p className="text-edenGray-700 text-xs">
          Before starting the interview, a few quick feedback on your resume
          from Eden!
        </p>
      </section>

      <section className="border-edenGray-100 mb-2 rounded-lg border p-4">
        <h3 className="text-edenGray-900 mb-2 text-xs font-normal">
          Probability of Passing
        </h3>
        <p className="font-clash-display text-lg">{matchText}</p>
      </section>

      <section className="border-edenGray-100 mb-2 rounded-lg border p-4">
        <h3 className="text-edenGray-900 mb-2 text-xs font-normal">
          Your Top Skills
        </h3>
        <div className="-mx-1 w-[100%-2rem]">
          {topSkills !== null &&
            topSkills.map((skill: any, index: number) => (
              <Badge
                className="border-edenGray-100 text-edenGray-700 !rounded-lg border !bg-white"
                key={index}
                text={skill}
                cutText={30}
              />
            ))}
        </div>
      </section>

      <section
        className="border-edenGray-100 relative mb-2 cursor-pointer rounded-lg border bg-white p-4"
        onClick={() =>
          setOpenSections({
            ...openSections,
            areasToImprove: !openSections.areasToImprove,
          })
        }
      >
        <div className="absolute right-2 top-3 cursor-pointer p-1">
          {openSections.areasToImprove ? (
            <BiChevronUp color="#626262" size={"1.2rem"} />
          ) : (
            <BiChevronDown color="#626262" size={"1.2rem"} />
          )}
        </div>
        <div className="flex w-[100%-3rem] items-center">
          <div className="bg-edenGray-100 text-edenGray-900 -ml-1 mr-2 flex h-8 w-8 items-center justify-center rounded-lg">
            <BsFillFileEarmarkMinusFill color="#000000" size="1.2rem" />
          </div>
          <div>
            <h3 className="text-edenGray-900 text-xs font-normal">
              Missing from your resume
            </h3>
            <p className="text-edenGray-700 text-xs">
              Make sure to address this in your interview
            </p>
          </div>
        </div>
        <p
          className={classNames(
            "text-edenGray-700 overflow-hidden whitespace-pre-wrap pt-4 text-xs transition-all ease-in-out",
            openSections.areasToImprove ? "max-h-[80vh]" : "max-h-0 !pt-0"
          )}
        >
          {content.improvementPoints}
        </p>
      </section>

      <section
        className="border-edenGray-100 relative mb-2 cursor-pointer rounded-lg border bg-white p-4"
        onClick={() =>
          setOpenSections({
            ...openSections,
            growth: !openSections.growth,
          })
        }
      >
        <div className="absolute right-2 top-3 cursor-pointer p-1">
          {openSections.growth ? (
            <BiChevronUp color="#626262" size={"1.2rem"} />
          ) : (
            <BiChevronDown color="#626262" size={"1.2rem"} />
          )}
        </div>
        <div className="flex w-[100%-3rem] items-center">
          <div className="bg-edenGray-100 text-edenGray-900 -ml-1 mr-2 flex h-8 w-8 items-center justify-center rounded-lg">
            <BsFillFileEarmarkBarGraphFill color="#000000" size="1.2rem" />
          </div>
          <div>
            <h3 className="text-edenGray-900 text-xs font-normal">
              Your opportunity to grow
            </h3>
            <p className="text-edenGray-700 text-xs">
              Find out about the areas you can grow in
            </p>
          </div>
        </div>
        <p
          className={classNames(
            "text-edenGray-700 overflow-hidden whitespace-pre-wrap pt-4 text-xs transition-all ease-in-out",
            openSections.growth ? "max-h-[80vh]" : "max-h-0 !pt-0"
          )}
        >
          {content.growthAreas}
        </p>
      </section>

      <section
        className="border-edenGray-100 relative mb-2 cursor-pointer rounded-lg border bg-white p-4"
        onClick={() =>
          setOpenSections({
            ...openSections,
            strongSuit: !openSections.strongSuit,
          })
        }
      >
        <div className="absolute right-2 top-3 cursor-pointer p-1">
          {openSections.strongSuit ? (
            <BiChevronUp color="#626262" size={"1.2rem"} />
          ) : (
            <BiChevronDown color="#626262" size={"1.2rem"} />
          )}
        </div>
        <div className="flex w-[100%-3rem] items-center">
          <div className="bg-edenGray-100 text-edenGray-900 -ml-1 mr-2 flex h-8 w-8 items-center justify-center rounded-lg">
            <BsFillFileEarmarkPlusFill color="#000000" size="1.2rem" />
          </div>
          <div>
            <h3 className="text-edenGray-900 text-xs font-normal">
              What already stands out about you
            </h3>
            <p className="text-edenGray-700 text-xs">
              Find out about the areas you are strong at
            </p>
          </div>
        </div>
        <p
          className={classNames(
            "text-edenGray-700 overflow-hidden whitespace-pre-wrap pt-4 text-xs transition-all ease-in-out",
            openSections.strongSuit ? "max-h-[80vh]" : "max-h-0 !pt-0"
          )}
        >
          {content.strongFit}
        </p>
      </section>
    </div>
  );
};

export default ApplicationStepContainer;
