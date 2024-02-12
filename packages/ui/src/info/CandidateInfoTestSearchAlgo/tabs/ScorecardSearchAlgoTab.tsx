import { gql, useQuery } from "@apollo/client";
import {
  Maybe,
  ScoreCardCategoryMemoryType,
  ScoreCardsPositionType,
} from "@eden/package-graphql/generated";
import {
  CandidateTypeSkillMatch,
  EdenIconExclamation,
  EdenTooltip,
  Loading,
} from "@eden/package-ui";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import { BsFillStarFill } from "react-icons/bs";
import { FaThumbsUp } from "react-icons/fa";
import ReactTooltip from "react-tooltip";

import { classNames } from "../../../../utils";

const FIND_POSITION_CANDIDATE = gql`
  query FindPositionCandidate($fields: findPositionCandidateInput) {
    findPositionCandidate(fields: $fields) {
      user {
        _id
        discordName
      }
      scoreCardTotal {
        score
        scoreCardCalculated
      }
      scoreCardCategoryMemories {
        category
        score
        reason
        scoreCardsPosition {
          score
          reason
          card {
            _id
            content
            futurePotential
            keyPriority
          }
          scoreCardsCandidate {
            card {
              score {
                overall
              }
              _id
              content
            }
            scoreAlignment
          }
        }
      }
    }
  }
`;

type Props = {
  candidate?: CandidateTypeSkillMatch;
  scoreCardSearch?: any;
};

export const ScorecardSearchAlgoTab: FC<Props> = ({
  candidate,
  scoreCardSearch,
}) => {
  const router = useRouter();
  const { positionID } = router.query;

  const {
    data: findPositionCandidateData,
    loading: findPositionCandidateDataLoading,
  } = useQuery(FIND_POSITION_CANDIDATE, {
    variables: {
      fields: {
        positionID: positionID || candidate?.positionID,
        userID: candidate?.user?._id,
      },
    },
    skip: !positionID && !candidate?.positionID,
  });

  console.log("scoreCardSearch = ", scoreCardSearch);
  // console.log("candidate?.user?._id= ", candidate?.user?._id)
  // console.log("positionID= ", positionID || candidate?.positionID)
  // console.log("findPositionCandidateData= ", findPositionCandidateData)

  const [expandID, setExpandID] = useState<null | string>(null);

  console.log("expandID= ", expandID);

  return (
    <>
      {findPositionCandidateDataLoading && <Loading title="Loading scores" />}
      {findPositionCandidateData?.findPositionCandidate &&
      !!findPositionCandidateData?.findPositionCandidate
        .scoreCardCategoryMemories.length
        ? scoreCardSearch.map((card: any, index: number) => (
            <div className="mb-10" key={index}>
              <div className="border-edenGreen-300 flex justify-between border-b px-4">
                <h3 className="text-edenGreen-500 mb-3">
                  {card?.nodeInput?.name}
                </h3>
                <div className="text-edenGray-700 flex items-center text-sm">
                  Score || Normalized - Real:
                  <div className="bg-edenPink-300 -mr-2 ml-2 flex  items-center justify-center rounded-md pb-px">
                    <span
                      className={classNames(
                        getGrade(card?.score * 100).color,
                        "text-md"
                      )}
                    >
                      {/* {getGrade(card?.score! * 100).letter} */}
                      {card?.score} - {card?.scoreReal.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              <ul className="list-none space-y-1">
                {card?.cardMemoryOutput?.map((item: any, index: number) => {
                  const scoreTotal =
                    item?.scoreCardTotal || item?.scoreCardTotal === 0
                      ? item?.scoreCardTotal * 100
                      : null;

                  const { letter, color } = getGrade(scoreTotal);

                  return (
                    <li
                      key={index}
                      className="border-edenGray-100 w-full border-b px-4"
                    >
                      <div className="relative flex w-full columns-2 items-center justify-between py-4">
                        <div className="absolute -left-6 top-5 cursor-pointer">
                          {expandID ===
                          card?.nodeInput?.name.replace("_", " ")! + index ? (
                            <ChevronUpIcon
                              width={16}
                              className=""
                              onClick={() => {
                                setExpandID(null);
                              }}
                            />
                          ) : (
                            <ChevronDownIcon
                              width={16}
                              className=""
                              onClick={() => {
                                setExpandID(
                                  card?.nodeInput?.name.replace("_", " ")! +
                                    index
                                );
                              }}
                            />
                          )}
                        </div>
                        <div className="flex">
                          <p className="w-full pr-4 text-sm">
                            {item?.cardMemory?.content?.trim()}
                          </p>
                          {item &&
                            item?.card &&
                            item?.card.futurePotential == true && (
                              <>
                                <div
                                  data-tip={"Show Future Potential"}
                                  data-for={`badgeTip-potential-${item.card._id}`}
                                  className={`mr-4 mt-0.5 inline-block cursor-default rounded-sm text-sm last:mb-0 last:mr-0`}
                                >
                                  <FaThumbsUp color="#FF9843" />
                                </div>
                                <ReactTooltip
                                  id={`badgeTip-potential-${item.card._id}`}
                                  place="top"
                                  effect="solid"
                                >
                                  {
                                    "The candidate has future potential in the company"
                                  }
                                </ReactTooltip>
                              </>
                            )}
                        </div>
                        <div className="border-edenGray-100 relative -my-4 flex h-8 w-12 items-center justify-center rounded-[0.25rem] border">
                          {/* <span className={color}>{letter}</span> */}
                          <span className={color}>
                            {item?.scoreCardTotal.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      {expandID ==
                        card?.nodeInput?.name.replace("_", " ")! + index && (
                        <div>
                          {item?.nodeOutput?.map(
                            (output: any, outputIndex: number) => {
                              const scoreAlignment: number | undefined =
                                output?.scoreTotal;
                              const percentage: number | null =
                                scoreAlignment != null
                                  ? scoreAlignment * 100
                                  : null;
                              const { color }: { color: string } =
                                getGrade(percentage);

                              return (
                                <div
                                  key={outputIndex}
                                  className="border-edenGray-100 relative mb-4 flex w-[95%] w-full items-center justify-between rounded-md border p-2"
                                >
                                  <p className="text-edenGray-700 text-xs">
                                    {output?.node?.name} -- hop:{" "}
                                    {output?.scoreHop} -- ScoreNode:{" "}
                                    {output?.scoreNode.toFixed(1)}
                                  </p>
                                  <div className="border-edenGray-100 relative ml-4 flex h-6 w-8 items-center justify-center rounded-[0.25rem] border">
                                    <span className={color}>
                                      {percentage != null
                                        ? (percentage * 0.01).toFixed(1)
                                        : ""}
                                    </span>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        : null}
    </>
  );
};

type Grade = {
  letter: string;
  color: string;
};

const getGrade = (percentage: number | null | undefined): Grade => {
  let grade: Grade = { letter: "", color: "" };

  if (!percentage && percentage !== 0) {
    grade = { letter: "?", color: "text-edenGray-500" };
    return grade;
  }

  if (percentage >= 90) {
    grade = { letter: "A+", color: "text-utilityGreen" };
  } else if (percentage >= 80) {
    grade = { letter: "A", color: "text-utilityGreen" };
  } else if (percentage >= 70) {
    grade = { letter: "B+", color: "text-utilityYellow" };
  } else if (percentage >= 60) {
    grade = { letter: "B", color: "text-utilityYellow" };
  } else if (percentage >= 50) {
    grade = { letter: "C+", color: "text-utilityOrange" };
  } else if (percentage >= 40) {
    grade = { letter: "C", color: "text-utilityOrange" };
  } else {
    grade = { letter: "D", color: "text-utilityRed" };
  }

  return grade;
};
