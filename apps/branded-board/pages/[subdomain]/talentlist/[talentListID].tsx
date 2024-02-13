import { useQuery } from "@apollo/client";
import { FIND_POSITION_LIGHT, FIND_TALENT_LIST } from "@eden/package-graphql";
import { CandidateType, TalentListType } from "@eden/package-graphql/generated";
import { CandidateInfo, ListModeEnum, Question } from "@eden/package-ui";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useState } from "react";

import { NextPageWithLayout } from "../../_app";

const CandidatesTableList = dynamic(
  () => import(`@eden/package-ui`).then((module) => module.CandidatesTableList),
  {
    ssr: false,
  }
);

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
type Grade = {
  letter: string;
  color: string;
};

interface CandidateTypeSkillMatch extends CandidateType {
  skillMatch: number;
  skillScore: number;
  letterAndColor?: {
    totalMatchPerc?: Grade;
    culture?: Grade;
    skill?: Grade;
    requirements?: Grade;
  };
}

// type NodeDisplay = {
//   nameRelevantNode: string;
//   nameOriginalNode: string;
//   score: number;
//   color: string;
// };

// type relevantNodeObj = {
//   [key: string]: {
//     nodes: NodeDisplay[];
//   };
// };

const TalentListPublicPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { talentListID } = router.query;

  const [positionID, setPositionID] = useState<string | null>(null);

  const [candidates, setCandidates] = useState<CandidateTypeSkillMatch[]>([]);

  // const [nodeIDsPosition, setNodeIDsPosition] = useState<string[]>([]);

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserScore, setSelectedUserScore] = useState<number | null>(
    null
  );
  const [selectedUserSummaryQuestions, setSelectedUserSummaryQuestions] =
    useState<any[]>([]);

  const [candidatesFromTalentList, setCandidatesFromTalentList] = useState<
    CandidateTypeSkillMatch[]
  >([]);

  const [currentTalentList, setCurrentTalentList] = useState<TalentListType>();

  const {
    // data: findPositionData,
    loading: findPositionIsLoading,
    // error: findPositionError,
  } = useQuery(FIND_POSITION_LIGHT, {
    variables: {
      fields: {
        _id: positionID,
      },
    },
    skip: !Boolean(positionID),
    ssr: false,
    onCompleted: (data: any) => {
      const candidatesListWithSkillMatch = data.findPosition.candidates
        .filter((candidate: CandidateType) =>
          candidates.some(
            (_candidate) => _candidate.user?._id === candidate.user?._id
          )
        )
        .map((candidate: any) => {
          let totalMatchPerc = 0;
          let totalMatchPercCount = 0;

          let letterAndColor = {};

          let flagSkill = false;

          if (candidate?.skillMatch != undefined && candidate?.skillMatch > 0) {
            totalMatchPerc += candidate.skillMatch;
            totalMatchPercCount++;
            flagSkill = true;

            letterAndColor = {
              ...letterAndColor,
              skill: getGrade(candidate.skillMatch, false),
            };
          }

          if (candidate?.overallScore) {
            totalMatchPerc += candidate.overallScore;
            totalMatchPercCount++;

            letterAndColor = {
              ...letterAndColor,
              culture: getGrade(candidate.overallScore, false),
            };
          }

          if (candidate?.skillScore) {
            totalMatchPerc += candidate.skillScore;
            totalMatchPercCount++;

            letterAndColor = {
              ...letterAndColor,
              skill: getGrade(candidate.skillScore, false),
            };

            // candidate.skillMatch = candidate.skillScore;
          }

          if (
            candidate?.compareCandidatePosition?.CV_ConvoToPositionAverageScore
          ) {
            totalMatchPerc +=
              candidate?.compareCandidatePosition
                ?.CV_ConvoToPositionAverageScore;
            totalMatchPercCount++;

            letterAndColor = {
              ...letterAndColor,
              requirements: getGrade(
                candidate?.compareCandidatePosition
                  ?.CV_ConvoToPositionAverageScore,
                false
              ),
            };
          }

          // console.log(
          //   "candidate?.compareCandidatePosition?.CV_ConvoToPositionAverageScore = ",
          //   candidate?.compareCandidatePosition?.CV_ConvoToPositionAverageScore
          // );
          // console.log("letterAndColor = ", letterAndColor);

          totalMatchPerc = totalMatchPerc / totalMatchPercCount;

          totalMatchPerc = parseInt(totalMatchPerc.toFixed(1));

          letterAndColor = {
            ...letterAndColor,
            totalMatchPerc: getGrade(totalMatchPerc, true),
          };

          return {
            ...candidate,
            totalMatchPerc,
            flagSkill: flagSkill,
            letterAndColor,
          };
        });

      // console.log(
      //   "candidatesListWithSkillMatch = ",
      //   candidatesListWithSkillMatch
      // );

      // sort the candidatesList by the totalMatchPerc
      const sortedCandidatesList = candidatesListWithSkillMatch.sort(
        (a: any, b: any) => {
          if (a.totalMatchPerc > b.totalMatchPerc) {
            return -1;
          }
          if (a.totalMatchPerc < b.totalMatchPerc) {
            return 1;
          }
          return 0;
        }
      );

      // setCandidatesList(sortedCandidatesList);

      // console.log("sortedCandidatesList = ", sortedCandidatesList);
      console.log("==>", sortedCandidatesList);

      setCandidatesFromTalentList(sortedCandidatesList);

      // setCandidatesFromTalentList(candidatesNew);
      setCandidates(sortedCandidatesList);

      /*setCandidates(
        data.findPosition.candidates.filter((candidate: CandidateType) =>
          candidates.some(
            (_candidate) => _candidate.user?._id === candidate.user?._id
          )
        )
      );
      setCandidatesFromTalentList(
        data.findPosition.candidates.filter((candidate: CandidateType) =>
          candidates.some(
            (_candidate) => _candidate.user?._id === candidate.user?._id
          )
        )
      );*/
      const questionPrep: Question[] = [];

      data.findPosition.questionsToAsk.map((question: any) => {
        if (question.question == null) {
        } else {
          questionPrep.push({
            _id: question.question._id,
            content: question.question.content,
            bestAnswer: question.bestAnswer,
          });
        }
      });
      // const nodesID = data.findPosition?.nodes?.map((node: any) => {
      //   return node?.nodeData?._id;
      // });

      // setNodeIDsPosition(nodesID);
    },
  });

  const {} = useQuery(FIND_TALENT_LIST, {
    variables: {
      fields: {
        _id: talentListID,
      },
    },
    skip: !Boolean(talentListID),
    ssr: false,
    onCompleted: (data: any) => {
      setPositionID(data.findUserTalentListPosition.positionID);
      setCandidates(data.findUserTalentListPosition.talent);
      setCurrentTalentList(data.findUserTalentListPosition);

      setCandidatesFromTalentList(data.findUserTalentListPosition.talent);
    },
  });

  const handleRowClick = (user: CandidateType) => {
    if (user.user?._id) setSelectedUserId(user.user?._id);
    if (user.overallScore) setSelectedUserScore(user.overallScore);
    if (user.summaryQuestions)
      setSelectedUserSummaryQuestions(user.summaryQuestions);
  };

  // const [mostRelevantMemberNode, setMostRelevantMemberNode] =
  //   useState<relevantNodeObj>({});

  // eslint-disable-next-line no-unused-vars
  const getGrade = (percentage: number, mainColumn: boolean): Grade => {
    let grade: Grade = { letter: "", color: "" };

    if (percentage >= 70) {
      grade = { letter: "A", color: "text-utilityGreen" };
    } else if (percentage >= 50) {
      grade = { letter: "B", color: "text-utilityYellow" };
    } else if (percentage >= 30) {
      grade = { letter: "C", color: "text-utilityOrange" };
      // if (mainColumn) grade = { letter: "C", color: "text-orange-300" };
      // else grade = { letter: "C", color: "text-black" };
    } else {
      grade = { letter: "D", color: "text-utilityRed" };
      // if (mainColumn) grade = { letter: "D", color: "text-red-300" };
      // else grade = { letter: "D", color: "text-black" };
    }

    return grade;
  };

  // const {} = useQuery(MATCH_NODES_MEMBERS_AI4, {
  //   variables: {
  //     fields: {
  //       nodesID: nodeIDsPosition,
  //       membersIDallow: candidatesFromTalentList?.map((userData: any) => {
  //         return userData?.user?._id;
  //       }),
  //       weightModules: [
  //         { type: "node_Skill", weight: 70 },
  //         { type: "node_Category", weight: 20 },
  //         { type: "node_Group", weight: 5 },
  //         { type: "node_total", weight: 50 },
  //         { type: "budget_total", weight: 80 },
  //         { type: "availability_total", weight: 85 },
  //         { type: "experience_total", weight: 85 },
  //         { type: "everythingElse_total", weight: 50 },
  //       ],
  //     },
  //   },
  //   skip: candidatesFromTalentList.length === 0 || nodeIDsPosition.length === 0,
  //   ssr: false,
  //   onCompleted: (data) => {
  //     // from data.matchNodesToMembers_AI4 change it to an object with member._id as the key

  //     // -------------- Get the Candidates of the page ------------
  //     const memberScoreObj: { [key: string]: number } = {};

  //     data.matchNodesToMembers_AI4.forEach((memberT: any) => {
  //       const keyN = memberT?.member?._id;

  //       if (memberScoreObj[keyN] == undefined) {
  //         console.log(keyN + " was undefined");
  //         memberScoreObj[keyN] = memberT?.matchPercentage?.totalPercentage;
  //       }
  //     });

  //     const candidatesNew: CandidateTypeSkillMatch[] = [];

  //     for (let i = 0; i < candidatesFromTalentList.length; i++) {
  //       const userID = candidatesFromTalentList[i]?.user?._id;

  //       if (userID && memberScoreObj[userID]) {
  //         console.log({ userID, mem: memberScoreObj[userID] });
  //         candidatesNew.push({
  //           ...candidatesFromTalentList[i],
  //           skillMatch: memberScoreObj[userID],
  //         });
  //       } else {
  //         candidatesNew.push({
  //           ...candidatesFromTalentList[i],
  //         });
  //       }
  //     }
  //     // -------------- Get the Candidates of the page ------------

  //     // --------------- Find the related nodes Score and color -----------

  //     const mostRelevantMemberNodeT: relevantNodeObj = {};

  //     for (let i = 0; i < data?.matchNodesToMembers_AI4?.length; i++) {
  //       const infoN = data.matchNodesToMembers_AI4[i];

  //       const userID: string = infoN?.member?._id;

  //       if (userID && !mostRelevantMemberNodeT[userID]) {
  //         mostRelevantMemberNodeT[userID] = {
  //           nodes: [],
  //         };
  //       }

  //       const nodesPercentageT = infoN?.nodesPercentage;

  //       const nodesNew: NodeDisplay[] = [];

  //       interface RelevantMemberObj {
  //         [key: string]: boolean;
  //       }
  //       const mostRelevantMemberObj: RelevantMemberObj = {};

  //       const mostRelevantMemberNodes = [];

  //       for (let j = 0; j < nodesPercentageT?.length; j++) {
  //         const node = nodesPercentageT[j];

  //         // Take only the first mostRelevantMemberNodes, which has the heighers probability, later I can be more creative
  //         let mostRelevantMemberNode = null;

  //         if (
  //           node?.mostRelevantMemberNodes !== undefined &&
  //           node?.mostRelevantMemberNodes?.length > 0
  //         ) {
  //           let i = 0;
  //           let relNode;

  //           while (
  //             mostRelevantMemberNode == null &&
  //             i < node?.mostRelevantMemberNodes.length
  //           ) {
  //             relNode = node?.mostRelevantMemberNodes[i];

  //             if (
  //               relNode?.node?._id != undefined &&
  //               !mostRelevantMemberObj[relNode?.node?._id]
  //             ) {
  //               mostRelevantMemberNode = relNode;
  //               mostRelevantMemberObj[relNode?.node?._id] = true;
  //             } else {
  //               i++;
  //             }
  //           }

  //           if (mostRelevantMemberNode == null) continue;
  //         }

  //         let colorT = "bg-purple-100";

  //         if (
  //           mostRelevantMemberNode?.score != null &&
  //           mostRelevantMemberNode?.score != undefined
  //         ) {
  //           if (mostRelevantMemberNode?.score > 60) {
  //             colorT = "bg-purple-500";
  //           } else if (mostRelevantMemberNode?.score > 30) {
  //             colorT = "bg-purple-400";
  //           } else if (mostRelevantMemberNode?.score > 13) {
  //             colorT = "bg-purple-300";
  //           } else if (mostRelevantMemberNode?.score > 5) {
  //             colorT = "bg-purple-200";
  //           }
  //         }

  //         mostRelevantMemberNodes.push({
  //           searchNode: node?.node,
  //           MemberRelevantnode: mostRelevantMemberNode?.node,
  //           score: mostRelevantMemberNode?.score,
  //           color: colorT,
  //         });

  //         nodesNew.push({
  //           nameOriginalNode: nodesPercentageT[j]?.node?.name,
  //           nameRelevantNode: mostRelevantMemberNode?.node?.name,
  //           score: mostRelevantMemberNode?.score,
  //           color: colorT,
  //         });
  //       }

  //       nodesNew.sort((a, b) => b.score - a.score); // sort based on score

  //       mostRelevantMemberNodeT[userID].nodes = nodesNew;
  //     }

  //     setMostRelevantMemberNode(mostRelevantMemberNodeT);

  //     // --------------- Find the related nodes Score and color -----------
  //   },
  // });

  return (
    <div className="bg-background container mx-auto min-h-screen max-w-screen-2xl flex-grow px-2 py-4 sm:px-5">
      <div>
        <div className="mb-4 flex h-10 items-center">
          <h1 className="mr-6 text-2xl font-medium">
            {currentTalentList?.name
              ? `Talent List: ${currentTalentList?.name}`
              : "Talent List"}
          </h1>
        </div>
        <div className="grid grid-flow-row">
          <CandidatesTableList
            candidateIDRowSelected={selectedUserId || null}
            candidatesList={candidatesFromTalentList}
            fetchIsLoading={findPositionIsLoading}
            setRowObjectData={handleRowClick}
            listMode={ListModeEnum.list}
            // selectedIds={newTalentListCandidatesIds}
            // handleChkSelection={handleCandidateCheckboxSelection}
          />
        </div>
      </div>
      <div
        className={classNames(
          "transition-width scrollbar-hide fixed right-0 top-0 z-30 h-screen overflow-y-scroll bg-white shadow-md duration-200 ease-in-out",
          selectedUserId ? "w-[48rem]" : "w-0"
        )}
      >
        <div className="scrollbar-hide scrollbar-hide h-[100vh] overflow-y-scroll bg-white shadow-md">
          {/* {selectedUserId ? ( */}
          <CandidateInfo
            listMode={ListModeEnum.list}
            key={selectedUserId || ""}
            memberID={selectedUserId || ""}
            percentage={selectedUserScore}
            summaryQuestions={selectedUserSummaryQuestions}
            // mostRelevantMemberNode={mostRelevantMemberNode}
            candidate={candidates?.find(
              (candidate) =>
                candidate?.user?._id?.toString() == selectedUserId?.toString()
            )}
            onClose={() => {
              setSelectedUserId(null);
            }}
          />
          {/* ) : (
            <div className="w-full pt-20 text-center">
              <p className="text-gray-400">Select a candidate</p>
            </div>
          )} */}
        </div>
      </div>
      <div
        className={classNames(
          "scrollbar-hide absolute right-0 top-0 z-20 transform overflow-y-scroll transition-all duration-200 ease-in-out",
          router.query.candidate1 && router.query.candidate2
            ? "w-[100vw]"
            : "w-0"
        )}
      >
        {router.query.candidate1 && router.query.candidate2 && (
          <>
            <div className="scrollbar-hide scrollbar-hide relative inline-block h-[calc(100vh-4rem)] w-1/2 overflow-y-scroll border-r border-gray-300 bg-white">
              {/* {router.query.candidate1 ? ( */}
              <CandidateInfo
                listMode={ListModeEnum.list}
                key={(router.query.candidate1 as string) || ""}
                memberID={(router.query.candidate1 as string) || ""}
                percentage={selectedUserScore}
                summaryQuestions={selectedUserSummaryQuestions}
                // mostRelevantMemberNode={mostRelevantMemberNode}
                candidate={candidates?.find(
                  (candidate) =>
                    candidate?.user?._id?.toString() ==
                    router.query.candidate1?.toString()
                )}
                onClose={() => {
                  router.push(
                    {
                      pathname: "/dashboard/" + positionID,
                    },
                    undefined,
                    { shallow: true }
                  );
                }}
              />
            </div>
            <div className="scrollbar-hide relative inline-block h-[calc(100vh-4rem)] w-1/2 overflow-y-scroll bg-white">
              <CandidateInfo
                listMode={ListModeEnum.list}
                key={(router.query.candidate2 as string) || ""}
                memberID={(router.query.candidate2 as string) || ""}
                percentage={selectedUserScore}
                summaryQuestions={selectedUserSummaryQuestions}
                // mostRelevantMemberNode={mostRelevantMemberNode}
                candidate={candidates?.find(
                  (candidate) =>
                    candidate?.user?._id?.toString() ==
                    router.query.candidate2?.toString()
                )}
                onClose={() => {
                  router.push(
                    {
                      pathname: "/dashboard/" + positionID,
                    },
                    undefined,
                    { shallow: true }
                  );
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TalentListPublicPage;
