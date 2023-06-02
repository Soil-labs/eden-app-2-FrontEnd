// import { UserContext } from "@eden/package-context";
import {} from "@eden/package-graphql/generated";
import { Card } from "@eden/package-ui";
// import { useContext, useEffect, useState } from "react";

export interface IPercentageAnalysisProps {
  tabCategory: string;
  matchingMax: number;
}

export const PercentageAnalysis = ({
  matchingMax,
  tabCategory,
}: IPercentageAnalysisProps) => {
  const randomNumber = (max: number, min: number) => {
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    console.log("randomNumber ", randomNumber);

    console.log("randomNumber > 50", randomNumber > 50);

    return randomNumber;
  };

  const percentage = randomNumber(5, 100);
  const matchingCurrent = randomNumber(1, matchingMax);

  return (
    <Card border className="flex flex-col items-center text-lg">
      <p className=" font-bold">Candidate&apos;s Match</p>
      <p className="text-soilPurple ">Score: {percentage}%</p>
      <div className="flex">
        <span>Matching on </span>&nbsp;
        <span className="text-soilPurple ">{matchingCurrent}</span>&nbsp;
        <span>{tabCategory} out of </span>&nbsp;
        <span className="text-soilPurple ">{matchingMax}</span>
      </div>
    </Card>
  );
};
