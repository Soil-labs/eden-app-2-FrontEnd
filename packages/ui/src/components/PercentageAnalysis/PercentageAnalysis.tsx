// import { UserContext } from "@eden/package-context";
import { useQuery } from "@apollo/client";
import { FIND_POSITION_LIGHT } from "@eden/package-graphql";
import {} from "@eden/package-graphql/generated";
import { Card } from "@eden/package-ui";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// import { useContext, useEffect, useState } from "react";

export interface IPercentageAnalysisProps {
  tabCategory: string;
  matchingMax: number;
}

export const PercentageAnalysis = ({
  matchingMax,
  tabCategory,
}: IPercentageAnalysisProps) => {
  const router = useRouter();

  const { params } = router.query;
  const [positionID, setPositionID] = useState<string>("");
  const [candidates, setCandidates] = useState("");

  useEffect(() => {
    if (params) {
      console.log("params", params);
      setPositionID(params[0] as string);
    }
  }, [params]);

  console.log("params", positionID as string);

  useQuery(FIND_POSITION_LIGHT, {
    variables: {
      fields: {
        _id: positionID,
      },
    },
    onCompleted: (data: any) => {
      setCandidates(data.findPosition.candidates);
    },
  });

  // const randomNumber = (max: number, min: number) => {
  //   const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

  //   console.log("randomNumber ", randomNumber);

  //   console.log("randomNumber > 50", randomNumber > 50);

  //   return randomNumber;
  // };
  console.log();
  // const percentage = candidates.overallScore;
  // const matchingCurrent = randomNumber(1, matchingMax);

  return (
    <Card shadow border className="flex flex-col items-center text-lg">
      <p className=" font-bold">Candidate&apos;s Match</p>
      <p className="text-soilPurple ">Score: {"Test"}%</p>
      <div className="flex">
        <span>Matching on </span>&nbsp;
        <span className="text-soilPurple ">{"Test"}</span>&nbsp;
        <span>{tabCategory} out of </span>&nbsp;
        <span className="text-soilPurple ">{matchingMax}</span>
      </div>
    </Card>
  );
};
