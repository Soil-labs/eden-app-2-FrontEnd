import { gql, useMutation, useQuery } from "@apollo/client";
import {
  FIND_MEMBER,
  FIND_POSITION_LIGHT,
  MATCH_NODES_MEMBERS_AI4,
  UPDATE_TALENT_LIST_WITH_TALENT,
} from "@eden/package-graphql";
import { CandidateType, TalentListType } from "@eden/package-graphql/generated";
import {
  ApprovedCandidatesList,
  AppUserLayoutNew,
  Avatar,
  Button,
  CandidatesList,
  CutTextTooltip,
  EdenAiLetter,
  ListModeEnum,
  ModalNew,
} from "@eden/package-ui";
import {
  CultureFitSVG,
  EdenFavesSVG,
  HiddenGemsSVG,
  IndustryVeteranSVG,
  SkillFitSVG,
} from "@eden/package-ui/src/svgs";
import { useRouter } from "next/router";
import React, { useContext, useMemo, useRef, useState } from "react";
import { HiOutlineDocumentPlus } from "react-icons/hi2";
import { toast } from "react-toastify";

import useOutside from "./useOutSide";

const CandidateInfoNew = dynamic(
  () =>
    import(`@eden/package-ui/src/info/CandidateInfoNew/CandidateInfoNew`).then(
      (module) => module.CandidateInfoNew
    ),
  {
    ssr: false,
  }
);

import { NextPageWithLayout } from "../../../_app";

const UPDATE_POSITION = gql`
  mutation ($fields: updatePositionInput!) {
    updatePosition(fields: $fields) {
      _id
    }
  }
`;

type Question = {
  _id: string;
  content: string;
  bestAnswer: string;
};

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
  status?: "ACCEPTED" | "REJECTED" | undefined;
}

type NodeDisplay = {
  nameRelevantNode: string;
  nameOriginalNode: string;
  score: number;
  color: string;
};

type relevantNodeObj = {
  [key: string]: {
    nodes: NodeDisplay[];
  };
};

const PositionCRM: NextPageWithLayout = () => {
  const router = useRouter();
  const topicListMenuRef = useRef(null);
  // eslint-disable-next-line no-unused-vars
  const { positionID, slug, listID, panda } = router.query;
  const [secondMeetingLink, setSecondMeetingLink] = useState<string>("");

  const [topic, setTopic] = useState<string>("Eden's faves");

  const { company, getCompanyFunc } = useContext(CompanyContext);
  const [invitationPopup, setInvitationPopup] = useState<boolean>(false);

  const [approvedTalentListID, setApprovedTalentListID] = useState<string>("");
  const [rejectedTalentListID, setRejectedTalentListID] = useState<string>("");

  const [selectedInvitationCandidateID, setSelectedInvitationCandidateID] =
    useState<string>("");

  const [
    approvedTalentListCandidatesList,
    setApprovedTalentListCandidatesList,
  ] = useState<CandidateTypeSkillMatch[]>([]);

  const [
    rejectedTalentListCandidatesList,
    setRejectedTalentListCandidatesList,
  ] = useState<CandidateTypeSkillMatch[]>([]);

  const [quickActionButtonUsed, setQuickActionButtonUsed] =
    useState<boolean>(false);

  const [candidatesOriginalList, setCandidatesOriginalList] = useState<
    CandidateTypeSkillMatch[]
  >([]);

  const [candidatesUnqualifiedList, setCandidatesUnqualifiedList] = useState<
    CandidateTypeSkillMatch[]
  >([]);

  const [nodeIDsPosition, setNodeIDsPosition] = useState<string[]>([]);

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [selectedUserSummaryQuestions, setSelectedUserSummaryQuestions] =
    useState<any[]>([]);

  const [talentListsAvailables, setTalentListsAvailables] = useState<
    TalentListType[]
  >([]);

  // eslint-disable-next-line no-unused-vars
  const [talentListSelected, setTalentListSelected] =
    useState<TalentListType>();

  const [isOpen, setIsOpen] = useState(false);
  const [addToListOpen, setAddToListOpen] = useState(false);

  const [isTopicListMenuOpen, setIsTopicListMenuOpen] = useState(true);

  const [letterType, setLetterType] = useState<
    "rejection" | "nextInterviewInvite" | ""
  >("");

  const handleRejectionLetter = () => {
    setLetterType("rejection");
    setIsOpen(true);
  };

  useMemo(() => {
    let _listSelected;

    if (listID && !!talentListsAvailables.length) {
      _listSelected = talentListsAvailables.find((list) => list._id === listID);
    } else {
      _listSelected = talentListsAvailables.find((list) => list._id === "000");
    }

    setTalentListSelected(_listSelected);
  }, [listID, talentListsAvailables]);

  const [candidatesFromTalentList, setCandidatesFromTalentList] = useState<
    CandidateTypeSkillMatch[]
  >([]);

  const [newTalentListCandidatesIds, setNewTalentListCandidatesIds] = useState<
    string[]
  >([]);

  const { data: findPositionData, loading: findPositionIsLoading } = useQuery(
    FIND_POSITION_LIGHT,
    {
      variables: {
        fields: {
          _id: positionID,
        },
      },
      skip: !Boolean(positionID),
      ssr: false,
      onCompleted: (data: any) => {
        const talentListsNames: TalentListType[] =
          data.findPosition?.talentList;

        setTalentListsAvailables(talentListsNames);

        if (
          data.findPosition?.candidates.length > 0 &&
          (data.findPosition?.candidates[0]?.totalMatchPerc === undefined ||
            (data.findPosition?.candidates[0]?.flagSkill !== true &&
              data.findPosition?.candidates[0]?.skillMatch !== undefined))
        ) {
          // calculate the average score of the percentages for each candidatesList and save it on setCandidatesList
          const candidatesListWithSkillMatch =
            data.findPosition?.candidates.map((candidate: any) => {
              let totalMatchPerc = 0;
              let totalMatchPercCount = 0;

              let letterAndColor = {};

              let flagSkill = false;
              let status;

              if (
                data.findPosition.talentList
                  .find((list: any) => list.name === "Accepted")
                  .talent.some(
                    (_cand: any) => _cand.user?._id === candidate.user._id
                  )
              ) {
                status = "ACCEPTED";
              } else if (
                data.findPosition.talentList
                  .find((list: any) => list.name === "Rejected")
                  .talent.some(
                    (_cand: any) => _cand.user?._id === candidate.user._id
                  )
              ) {
                status = "REJECTED";
              }

              if (
                candidate?.skillMatch != undefined &&
                candidate?.skillMatch > 0
              ) {
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
              }

              if (
                candidate?.compareCandidatePosition
                  ?.CV_ConvoToPositionAverageScore
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
                status,
              };
            });

          console.log(
            "candidatesListWithSkillMatch = ",
            candidatesListWithSkillMatch
          );
          // sort the candidatesList by the totalMatchPerc
          const sortedCandidatesList = candidatesListWithSkillMatch.sort(
            (a: any, b: any) => {
              if (a.scoreCardTotal.score > b.scoreCardTotal.score) {
                return -1;
              }
              if (a.scoreCardTotal.score < b.scoreCardTotal.score) {
                return 1;
              }
              return 0;
            }
          );

          setCandidatesOriginalList(sortedCandidatesList);

          setCandidatesFromTalentList(sortedCandidatesList);

          setCandidatesUnqualifiedList(sortedCandidatesList);

          if (data?.findPosition?.talentList) {
            setApprovedTalentListID(
              data?.findPosition?.talentList.find(
                (list: TalentListType) => list.name === "Accepted"
              )?._id
            );

            setApprovedTalentListCandidatesList(
              data?.findPosition?.talentList.find(
                (list: TalentListType) => list.name === "Accepted"
              )?.talent
            );
            setRejectedTalentListID(
              data?.findPosition?.talentList.find(
                (list: TalentListType) => list.name === "Rejected"
              )?._id
            );

            setRejectedTalentListCandidatesList(
              data?.findPosition?.talentList.find(
                (list: TalentListType) => list.name === "Rejected"
              )?.talent
            );
          }
        }

        const questionPrep: Question[] = [];

        data.findPosition?.questionsToAsk.map((question: any) => {
          if (question.question == null) {
          } else {
            questionPrep.push({
              _id: question.question._id,
              content: question.question.content,
              bestAnswer: question.bestAnswer,
            });
          }
        });

        const nodesID = data.findPosition?.nodes?.map((node: any) => {
          return node?.nodeData?._id;
        });

        setNodeIDsPosition(nodesID);
      },
    }
  );

  const handleRowClick = (user: CandidateTypeSkillMatch) => {
    if (user.user?._id) setSelectedUserId(user.user?._id);
    if (user.summaryQuestions)
      setSelectedUserSummaryQuestions(user.summaryQuestions);
  };

  const { data: dataMember } = useQuery(FIND_MEMBER, {
    variables: {
      fields: {
        _id: selectedUserId,
      },
    },
    skip: !Boolean(selectedUserId),
    ssr: false,
    onCompleted: (data) => {
      console.log("data", data);
    },
  });

  const [updateSkillScore, setUpdateSkillScore] = useState<boolean>(false);

  // eslint-disable-next-line no-unused-vars
  const getGrade = (percentage: number, mainColumn: boolean): Grade => {
    let grade: Grade = { letter: "", color: "" };

    if (percentage >= 70) {
      grade = { letter: "A", color: "text-utilityGreen" };
    } else if (percentage >= 50) {
      grade = { letter: "B", color: "text-utilityYellow" };
    } else if (percentage >= 30) {
      grade = { letter: "C", color: "text-utilityOrange" };
    } else {
      grade = { letter: "D", color: "text-utilityRed" };
    }

    return grade;
  };

  const [mostRelevantMemberNode, setMostRelevantMemberNode] =
    useState<relevantNodeObj>({});

  const {} = useQuery(MATCH_NODES_MEMBERS_AI4, {
    variables: {
      fields: {
        nodesID: nodeIDsPosition,
        positionID: positionID,
        membersIDallow: candidatesFromTalentList?.map((userData: any) => {
          return userData?.user?._id;
        }),
        weightModules: [
          { type: "node_Skill", weight: 70 },
          { type: "node_Category", weight: 20 },
          { type: "node_Group", weight: 5 },
          { type: "node_total", weight: 50 },
          { type: "budget_total", weight: 80 },
          { type: "availability_total", weight: 85 },
          { type: "experience_total", weight: 85 },
          { type: "everythingElse_total", weight: 50 },
        ],
      },
    },
    skip: updateSkillScore == false,

    onCompleted: (data) => {
      // from data.matchNodesToMembers_AI4 change it to an object with member._id as the key

      setUpdateSkillScore(false);

      // -------------- Get the Candidates of the page ------------
      const memberScoreObj: { [key: string]: number } = {};

      data.matchNodesToMembers_AI4.forEach((memberT: any) => {
        const keyN = memberT?.member?._id;

        if (memberScoreObj[keyN] == undefined) {
          memberScoreObj[keyN] = memberT?.matchPercentage?.totalPercentage;
        }
      });

      const candidatesNew: CandidateTypeSkillMatch[] = [];

      for (let i = 0; i < candidatesFromTalentList.length; i++) {
        const userID = candidatesFromTalentList[i]?.user?._id;

        if (userID && memberScoreObj[userID]) {
          candidatesNew.push({
            ...candidatesFromTalentList[i],
            skillMatch: memberScoreObj[userID],
          });
        } else {
          candidatesNew.push({
            ...candidatesFromTalentList[i],
          });
        }
      }

      const _candidatesNew = candidatesNew.map((candidate: any) => {
        const _candidateWithSkillLetter = {
          ...candidate,
          letterAndColor: {
            ...candidate.letterAndColor,
            skill: getGrade(candidate.skillMatch, false),
          },
        };

        return _candidateWithSkillLetter;
      });

      const rejectedCandidatesIDs = rejectedTalentListCandidatesList.map(
        (candidate: any) => candidate?.user?._id
      );

      const approvedCandidatesIDs = approvedTalentListCandidatesList.map(
        (candidate: any) => candidate?.user?._id
      );

      setCandidatesUnqualifiedList(
        _candidatesNew
          .filter(
            (candidate: any) =>
              !rejectedCandidatesIDs.includes(candidate.user._id)
          )
          .filter(
            (candidate: any) =>
              !approvedCandidatesIDs.includes(candidate.user._id)
          )
      );

      setCandidatesFromTalentList(_candidatesNew);

      // -------------- Get the Candidates of the page ------------

      // --------------- Find the related nodes Score and color -----------

      const mostRelevantMemberNodeT: relevantNodeObj = {};

      for (let i = 0; i < data?.matchNodesToMembers_AI4?.length; i++) {
        const infoN = data.matchNodesToMembers_AI4[i];

        const userID: string = infoN?.member?._id;

        if (userID && !mostRelevantMemberNodeT[userID]) {
          mostRelevantMemberNodeT[userID] = {
            nodes: [],
          };
        }

        const nodesPercentageT = infoN?.nodesPercentage;

        const nodesNew: NodeDisplay[] = [];

        interface RelevantMemberObj {
          [key: string]: boolean;
        }
        const mostRelevantMemberObj: RelevantMemberObj = {};

        const mostRelevantMemberNodes = [];

        for (let j = 0; j < nodesPercentageT?.length; j++) {
          const node = nodesPercentageT[j];

          let mostRelevantMemberNode = null;

          if (
            node?.mostRelevantMemberNodes != undefined &&
            node?.mostRelevantMemberNodes?.length > 0
          ) {
            let i = 0;
            let relNode;

            while (
              mostRelevantMemberNode == null &&
              i < node?.mostRelevantMemberNodes.length
            ) {
              relNode = node?.mostRelevantMemberNodes[i];

              if (
                relNode?.node?._id != undefined &&
                !mostRelevantMemberObj[relNode?.node?._id]
              ) {
                mostRelevantMemberNode = relNode;
                mostRelevantMemberObj[relNode?.node?._id] = true;
              } else {
                i++;
              }
            }

            if (mostRelevantMemberNode == null) continue;
          }

          let colorT = "bg-purple-100";

          if (
            mostRelevantMemberNode?.score != null &&
            mostRelevantMemberNode?.score != undefined
          ) {
            if (mostRelevantMemberNode?.score > 60) {
              colorT = "bg-purple-500";
            } else if (mostRelevantMemberNode?.score > 30) {
              colorT = "bg-purple-400";
            } else if (mostRelevantMemberNode?.score > 13) {
              colorT = "bg-purple-300";
            } else if (mostRelevantMemberNode?.score > 5) {
              colorT = "bg-purple-200";
            }
          }

          mostRelevantMemberNodes.push({
            searchNode: node?.node,
            MemberRelevantnode: mostRelevantMemberNode?.node,
            score: mostRelevantMemberNode?.score,
            color: colorT,
          });

          nodesNew.push({
            nameOriginalNode: nodesPercentageT[j]?.node?.name,
            nameRelevantNode: mostRelevantMemberNode?.node?.name,
            score: mostRelevantMemberNode?.score,
            color: colorT,
          });
        }

        nodesNew.sort((a, b) => b.score - a.score); // sort based on score

        mostRelevantMemberNodeT[userID].nodes = nodesNew;
      }

      setMostRelevantMemberNode(mostRelevantMemberNodeT);

      // --------------- Find the related nodes Score and color -----------
    },
  });

  const [updateUsersTalentListPosition] = useMutation(
    UPDATE_TALENT_LIST_WITH_TALENT,
    {
      onCompleted: (data, clientOptions) => {
        if (!quickActionButtonUsed) {
          const workingTalentListID =
            clientOptions?.variables?.fields.talentListID ===
              approvedTalentListID ||
            clientOptions?.variables?.fields.talentListID ===
              rejectedTalentListID
              ? "000" // this is not the actual "working talent list" per se, but is the one to be redirected to
              : clientOptions?.variables?.fields.talentListID;

          if (workingTalentListID === "000") {
            if (
              clientOptions?.variables?.fields.talentListID ===
                approvedTalentListID ||
              clientOptions?.variables?.fields.talentListID ===
                rejectedTalentListID
            ) {
              const rejectedCandidatesIDs =
                data.updateUsersTalentListPosition.talentList
                  .find((list: TalentListType) => list.name === "Rejected")
                  ?.talent.map((candidate: any) => candidate?.user?._id);

              const approvedCandidatesIDs =
                data.updateUsersTalentListPosition.talentList
                  .find((list: TalentListType) => list.name === "Accepted")
                  ?.talent.map((candidate: any) => candidate?.user?._id);

              setCandidatesUnqualifiedList(
                candidatesOriginalList
                  .filter(
                    (candidate: any) =>
                      !rejectedCandidatesIDs.includes(candidate.user._id)
                  )
                  .filter(
                    (candidate: any) =>
                      !approvedCandidatesIDs.includes(candidate.user._id)
                  )
              );

              setCandidatesFromTalentList(
                candidatesOriginalList
                  .filter(
                    (candidate: any) =>
                      !rejectedCandidatesIDs.includes(candidate.user._id)
                  )
                  .filter(
                    (candidate: any) =>
                      !approvedCandidatesIDs.includes(candidate.user._id)
                  )
              );
              router.push(
                {
                  pathname: `/${company?.slug}/dashboard-new/${positionID}`,
                },
                undefined,
                { shallow: true }
              );
            } else {
              setCandidatesFromTalentList(candidatesUnqualifiedList);
            }
          } else {
            const editedTalentListIndex =
              data?.updateUsersTalentListPosition.talentList.findIndex(
                (talentList: TalentListType) =>
                  talentList._id === workingTalentListID
              );

            const editedTalentList: TalentListType =
              data?.updateUsersTalentListPosition.talentList[
                editedTalentListIndex
              ];

            const candidatesOnTalentListSelected: CandidateTypeSkillMatch[] =
              [];

            for (let i = 0; i < candidatesOriginalList.length; i++) {
              for (let j = 0; j < editedTalentList?.talent?.length!; j++) {
                if (
                  candidatesOriginalList[i].user?._id ===
                  editedTalentList?.talent![j]!.user!._id
                ) {
                  candidatesOnTalentListSelected.push(
                    candidatesOriginalList[i]
                  );
                }
              }
            }

            // setCandidatesFromTalentList(candidatesOnTalentListSelected);
            router.push(
              {
                pathname: `/${company?.slug}/dashboard-new/${positionID}`,
                query: {
                  listID: editedTalentList._id,
                },
              },
              undefined,
              { shallow: true }
            );
            setNewTalentListCandidatesIds([]);
          }
        } else {
          const rejectedCandidatesIDs =
            data.updateUsersTalentListPosition.talentList
              .find((list: TalentListType) => list.name === "Rejected")
              ?.talent.map((candidate: any) => candidate?.user?._id);

          const approvedCandidatesIDs =
            data.updateUsersTalentListPosition.talentList
              .find((list: TalentListType) => list.name === "Accepted")
              ?.talent.map((candidate: any) => candidate?.user?._id);

          setCandidatesUnqualifiedList(
            candidatesOriginalList
              .filter(
                (candidate: any) =>
                  !rejectedCandidatesIDs.includes(candidate.user._id)
              )
              .filter(
                (candidate: any) =>
                  !approvedCandidatesIDs.includes(candidate.user._id)
              )
          );

          setCandidatesFromTalentList(
            candidatesOriginalList
              .filter(
                (candidate: any) =>
                  !rejectedCandidatesIDs.includes(candidate.user._id)
              )
              .filter(
                (candidate: any) =>
                  !approvedCandidatesIDs.includes(candidate.user._id)
              )
          );

          setTalentListSelected({ _id: "000", name: "All candidates" });
        }
        setQuickActionButtonUsed(false);
      },
    }
  );

  const handleCreateNewList = () => {
    // setNewTalentListNameInputOpen(true);

    setAddToListOpen(false);
  };

  const handleAddCandidatesToList = async (listID: string) => {
    setAddToListOpen(false);

    const _prevTalent = findPositionData?.findPosition?.talentList
      .find((_list: any) => _list._id === listID)
      .talent.map((t: any) => t.user._id);

    try {
      if (selectedUserId) {
        await updateUsersTalentListPosition({
          variables: {
            fields: {
              positionID: positionID,
              talentListID: listID,
              usersTalentList: [..._prevTalent, selectedUserId],
            },
          },
        });
      } else {
        await updateUsersTalentListPosition({
          variables: {
            fields: {
              positionID: positionID,
              talentListID: listID,
              usersTalentList: [
                ..._prevTalent,
                ...newTalentListCandidatesIds.filter(
                  (t: any) => !_prevTalent.includes(t)
                ),
              ],
            },
          },
        });
      }
      toast.success("Candidate added to list!");
    } catch {
      toast.error("Server error");
    }
  };

  const [] = useMutation(UPDATE_POSITION, {
    onCompleted() {
      getCompanyFunc();
    },
  });

  const handleCandidateCheckboxSelection = (candidate: CandidateType) => {
    setNewTalentListCandidatesIds((prev) => {
      const newCandidatesIds = [...prev];

      if (newCandidatesIds.includes(candidate.user?._id!)) {
        const index = newCandidatesIds.indexOf(candidate.user?._id!);

        newCandidatesIds.splice(index, 1);
      } else {
        newCandidatesIds.push(candidate.user?._id!);
      }

      return newCandidatesIds.filter((id) => id !== undefined || id !== null);
    });
  };

  const topics = [
    {
      topic: "Eden's faves",
      svg: <EdenFavesSVG />,
      text: "Based on your overall preferences",
    },
    {
      topic: "Top Culture Fits",
      svg: <CultureFitSVG />,
      text: "A or above on culture fit",
    },
    {
      topic: "Top Skill Fits",
      svg: <SkillFitSVG />,
      text: "A or above on skill fit",
    },
    {
      topic: "Industry Veterans",
      svg: <IndustryVeteranSVG />,
      text: "More than >10y or equivalent experience",
    },
    {
      topic: "Hidden Gems",
      svg: <HiddenGemsSVG />,
      text: "Promising, somewhat unpolished gems",
    },
  ];

  const handleRejectCandidate = async (candidateID: string) => {
    setQuickActionButtonUsed(true);
    const _prevTalent = findPositionData?.findPosition?.talentList
      .find((_list: any) => _list._id === rejectedTalentListID)
      .talent.map((t: any) => t.user._id);

    const newTalentListCandidatesIds = _prevTalent.length
      ? [..._prevTalent, candidateID]
      : [candidateID];

    await updateUsersTalentListPosition({
      variables: {
        fields: {
          positionID: positionID,
          talentListID: rejectedTalentListID,
          usersTalentList: newTalentListCandidatesIds,
        },
      },
    });

    toast.success("Candidate added to Rejected Candidates list!");
  };

  const handleAIListMenuOpen = () => {
    setIsTopicListMenuOpen(!isTopicListMenuOpen);
  };

  const handleAddToList = () => {
    setLetterType("nextInterviewInvite");
    setIsOpen(true);
  };

  const handleCandidatesReorder = (topic: string) => {
    console.log(
      "candidateslist",
      candidatesOriginalList,
      candidatesFromTalentList
    );
    if (topic === "Eden's faves") {
      const sortedCandidatesList = candidatesOriginalList.sort(
        (a: any, b: any) => {
          if (a.scoreCardTotal.score > b.scoreCardTotal.score) {
            return -1;
          }
          if (a.scoreCardTotal.score < b.scoreCardTotal.score) {
            return 1;
          }
          return 0;
        }
      );

      setCandidatesFromTalentList(sortedCandidatesList);
    } else if (topic === "Top Culture Fits") {
      const sortedCandidatesList = candidatesOriginalList.sort(
        (a: any, b: any) => {
          if (
            a.scoreCardCategoryMemories[2].score >
            b.scoreCardCategoryMemories[2].score
          ) {
            return -1;
          }
          if (
            a.scoreCardCategoryMemories[2].score <
            b.scoreCardCategoryMemories[2].score
          ) {
            return 1;
          }
          return 0;
        }
      );

      setCandidatesFromTalentList(sortedCandidatesList);
    } else if (topic === "Top Skill Fits") {
      const sortedCandidatesList = candidatesOriginalList.sort(
        (a: any, b: any) => {
          if (
            a.scoreCardCategoryMemories[0].score >
            b.scoreCardCategoryMemories[0].score
          ) {
            return -1;
          }
          if (
            a.scoreCardCategoryMemories[0].score <
            b.scoreCardCategoryMemories[0].score
          ) {
            return 1;
          }
          return 0;
        }
      );

      setCandidatesFromTalentList(sortedCandidatesList);
    } else if (topic === "Industry Veterans") {
      const sortedCandidatesList = candidatesFromTalentList.sort(
        (a: any, b: any) => {
          if (
            a.scoreCardCategoryMemories[2].score >
            b.scoreCardCategoryMemories[2].score
          ) {
            return -1;
          }
          if (
            a.scoreCardCategoryMemories[2].score <
            b.scoreCardCategoryMemories[2].score
          ) {
            return 1;
          }
          return 0;
        }
      );

      setCandidatesFromTalentList(sortedCandidatesList);
    } else if (topic === "Hidden Gems") {
      const sortedCandidatesList = candidatesOriginalList.sort(
        (a: any, b: any) => {
          if (
            a.scoreCardCategoryMemories[3].score >
            b.scoreCardCategoryMemories[3].score
          ) {
            return -1;
          }
          if (
            a.scoreCardCategoryMemories[3].score <
            b.scoreCardCategoryMemories[3].score
          ) {
            return 1;
          }
          return 0;
        }
      );

      setCandidatesFromTalentList(sortedCandidatesList);
    }
  };

  const handleApproveCandidate = async (candidateID: string) => {
    setQuickActionButtonUsed(true);
    const _prevTalent = findPositionData?.findPosition?.talentList
      .find((_list: any) => _list._id === approvedTalentListID)
      .talent.map((t: any) => t.user._id);

    const newTalentListCandidatesIds = _prevTalent.length
      ? [..._prevTalent, candidateID]
      : [candidateID];

    await updateUsersTalentListPosition({
      variables: {
        fields: {
          positionID: positionID,
          talentListID: approvedTalentListID,
          usersTalentList: newTalentListCandidatesIds,
        },
      },
    });

    toast.success("Candidate added to Approved Candidates list!");
  };

  useOutside(topicListMenuRef, () => {
    setIsTopicListMenuOpen(false);
  });

  const handleSecondMeetingLinkChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSecondMeetingLink(e.target.value);
  };

  return (
    <div className="h-full">
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(h,o,t,j,a,r){
                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                  h._hjSettings={hjid:${process.env.NEXT_PUBLIC_HOTJAR_ID},hjsv:6};
                  a=o.getElementsByTagName('head')[0];
                  r=o.createElement('script');r.async=1;
                  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                  a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `,
          }}
        />
      </Head>

      <div className="mx-auto h-full w-full rounded px-8">
        <div className="z-40 flex h-full w-full flex-row gap-2">
          <div className="relative h-full min-w-[330px]">
            {isTopicListMenuOpen && (
              <div
                className={`${
                  isTopicListMenuOpen ? "w-full" : "w-0"
                } shadow-r-md transition-width duration-400 absolute left-0 top-0 z-20 h-full bg-white p-2 ease-in-out`}
                ref={topicListMenuRef}
              >
                <div className="flex h-full w-full flex-col gap-5">
                  <h1 className="text-edenGreen-600 border-edenGreen-400 relative w-full border-b pb-2 text-center">
                    Explore talent by topic
                  </h1>
                  {topics.map((aiTopic) => (
                    <div
                      className={`${
                        topic === aiTopic.topic
                          ? "border-edenGreen-600 border-2 shadow-md"
                          : ""
                      } bg-edenPink-300 hover:bg-edenPink-400 flex h-24 flex-row items-center rounded-lg px-4 py-2 hover:cursor-pointer hover:shadow-md`}
                      key={`${aiTopic.topic}`}
                      onClick={() => {
                        setTopic(aiTopic.topic);
                        handleCandidatesReorder(aiTopic.topic);
                        setIsTopicListMenuOpen(false);
                      }}
                    >
                      {aiTopic.svg}
                      <div className="ml-6 flex flex-col">
                        <h1>{aiTopic.topic}</h1>
                        <p className="font-Unica mt-3 text-xs font-medium leading-[140%] tracking-[-1.9%]">
                          {aiTopic.text}
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="bg-edenGreen-600 absolute bottom-0 flex w-[calc(100%-16px)] justify-around px-4 py-2">
                    <Button className="w-56 border-white text-center text-white">
                      {"Configure AI-curated lists"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="border-edenGreen-400 relative mb-2 border-b pb-2 text-center">
              <button
                className="absolute left-0 top-3"
                onClick={handleAIListMenuOpen}
              >
                <svg
                  width="19"
                  height="11"
                  viewBox="0 0 19 11"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.34682 10.9101C9.5816 10.7839 9.72797 10.5438 9.72797 10.2827V6.21729H17.7823C18.189 6.21729 18.519 5.89596 18.519 5.50003C18.519 5.1041 18.189 4.78276 17.7823 4.78276H9.72797V0.717314C9.72797 0.455274 9.5816 0.21523 9.34682 0.0899481C9.11203 -0.0372466 8.82519 -0.0286395 8.59826 0.110031L0.802319 4.89274C0.588167 5.02472 0.458496 5.25329 0.458496 5.50003C0.458496 5.74676 0.588167 5.97533 0.802319 6.10731L8.59826 10.89C8.71811 10.9627 8.85466 11 8.9912 11C9.11301 11 9.23581 10.9694 9.34682 10.9101Z"
                    className="fill-edenGreen-600 hover:fill-edenGreen-400 hover:shadow-md"
                  />
                </svg>
              </button>
              <h1 className="text-edenGreen-600">{topic}</h1>
            </div>

            <div className="scrollbar-hide h-[calc(100%-106px)] overflow-y-auto pt-4">
              <CandidatesList
                candidateIDRowSelected={selectedUserId || null}
                candidatesList={candidatesFromTalentList}
                fetchIsLoading={findPositionIsLoading}
                setRowObjectData={handleRowClick}
                listMode={ListModeEnum.selectable}
                selectedIds={newTalentListCandidatesIds}
                handleChkSelection={handleCandidateCheckboxSelection}
              />
            </div>
            <div className="bg-edenPink-500 absolute bottom-0 flex w-full justify-around px-6 py-2">
              <Button
                className="w-60 text-center"
                variant="primary"
                onClick={handleRejectionLetter}
              >
                Gracefully Reject Candidate
              </Button>
            </div>
          </div>
          <div className="min-w-1/2 bg-edenGreen-200 h-full flex-grow">
            <CandidateInfoNew
              key={selectedUserId || ""}
              memberID={selectedUserId || ""}
              summaryQuestions={selectedUserSummaryQuestions}
              mostRelevantMemberNode={mostRelevantMemberNode}
              candidate={candidatesOriginalList?.find(
                (candidate) =>
                  candidate?.user?._id?.toString() == selectedUserId?.toString()
              )}
              onClose={() => {
                setSelectedUserId(null);
              }}
              rejectCandidateFn={handleRejectCandidate}
              approveCandidateFn={handleApproveCandidate}
              handleCreateNewList={handleCreateNewList}
              talentListsAvailables={talentListsAvailables}
              handleAddCandidatesToList={handleAddCandidatesToList}
            />
          </div>
          <div className="relative h-full min-w-[330px]">
            {findPositionData && (
              <div className="flex w-full flex-col items-center">
                <div className="relative mb-2 w-full pb-2 text-center">
                  <button className="absolute left-0 top-3">
                    <svg
                      width="19"
                      height="11"
                      viewBox="0 0 19 11"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.34682 10.9101C9.5816 10.7839 9.72797 10.5438 9.72797 10.2827V6.21729H17.7823C18.189 6.21729 18.519 5.89596 18.519 5.50003C18.519 5.1041 18.189 4.78276 17.7823 4.78276H9.72797V0.717314C9.72797 0.455274 9.5816 0.21523 9.34682 0.0899481C9.11203 -0.0372466 8.82519 -0.0286395 8.59826 0.110031L0.802319 4.89274C0.588167 5.02472 0.458496 5.25329 0.458496 5.50003C0.458496 5.74676 0.588167 5.97533 0.802319 6.10731L8.59826 10.89C8.71811 10.9627 8.85466 11 8.9912 11C9.11301 11 9.23581 10.9694 9.34682 10.9101Z"
                        className="fill-edenGreen-600 hover:fill-edenGreen-400 hover:shadow-md"
                      />
                    </svg>
                  </button>

                  <h1 className="text-edenGreen-600 border-edenGreen-400 border-b pl-8 pr-4">
                    <CutTextTooltip
                      text={
                        findPositionData?.findPosition?.name
                          ? findPositionData?.findPosition?.name
                              .charAt(0)
                              .toUpperCase() +
                            findPositionData?.findPosition?.name
                              .slice(1)
                              .toLowerCase()
                          : ""
                      }
                    />
                  </h1>
                </div>
                <Button
                  variant="primary"
                  onClick={() => {
                    setInvitationPopup(true);
                    setSelectedInvitationCandidateID(
                      approvedTalentListCandidatesList[0].user?._id || ""
                    );
                  }}
                >
                  Invite all for 2nd interview
                </Button>
              </div>
            )}

            <div className="scrollbar-hide max-h-[calc(100%-160px)] overflow-y-auto pt-4">
              <ApprovedCandidatesList
                candidateIDRowSelected={selectedUserId || null}
                candidatesList={approvedTalentListCandidatesList}
                // candidatesData={findPositionData?.findPosition?.candidates}
                fetchIsLoading={findPositionIsLoading}
                setRowObjectData={handleRowClick}
                listMode={ListModeEnum.selectable}
                selectedIds={newTalentListCandidatesIds}
                handleChkSelection={handleCandidateCheckboxSelection}
              />
            </div>
            <div className="bg-edenGreen-600 absolute bottom-0 flex w-full justify-around px-6 py-2">
              <Button
                className="w-56 border-white text-center text-white"
                onClick={handleAddToList}
              >
                Add to list
              </Button>
            </div>
          </div>
        </div>
        <button
          className="text-edenGreen-600 fixed right-[300px] top-9 z-[200] flex flex-row hover:font-medium"
          onClick={() => router.push(`/${router.query.slug}/dashboard-new`)}
        >
          <svg
            width="30"
            height="29"
            viewBox="0 0 30 29"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M24.5859 15.0678C23.9327 19.8089 19.6431 23.4695 14.4486 23.4695C8.80175 23.4695 4.2251 19.1445 4.2251 13.8081C4.2251 8.87985 8.1304 4.81237 13.1765 4.22046"
              stroke="#00462C"
              stroke-width="1.77187"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M21.4062 18.5222L25.5658 22.4437"
              stroke="#00462C"
              stroke-width="1.77187"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M22.2306 3.71192L23.1646 5.48764C23.2121 5.57729 23.3021 5.63935 23.4067 5.6543L25.4974 5.93933C25.5814 5.94967 25.658 5.99219 25.7102 6.05541C25.8075 6.17609 25.793 6.34619 25.6761 6.44963L24.1607 7.83458C24.0841 7.90238 24.0489 8.00353 24.0695 8.10122L24.432 10.0551C24.4575 10.2171 24.3407 10.3689 24.1692 10.3953C24.0987 10.4056 24.0257 10.3941 23.9612 10.3642L22.0992 9.44248C22.0056 9.39422 21.8937 9.39422 21.8001 9.44248L19.9246 10.37C19.7665 10.4447 19.5756 10.3895 19.4892 10.2436C19.4576 10.185 19.4455 10.1183 19.4576 10.0539L19.8201 8.09892C19.8382 8.00123 19.8042 7.90238 19.7289 7.83227L18.2049 6.44849C18.0821 6.33125 18.0821 6.14161 18.2049 6.02438C18.256 5.9807 18.3192 5.95082 18.3874 5.93933L20.4792 5.65314C20.5839 5.63705 20.6739 5.57499 20.7212 5.48534L21.6541 3.71192C21.6919 3.63952 21.7575 3.5855 21.839 3.55906C21.9205 3.53377 22.008 3.54067 22.0846 3.5763C22.1479 3.60619 22.199 3.65331 22.2306 3.71192Z"
              stroke="#00462C"
              stroke-width="1.77187"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          All your opportunities
        </button>
      </div>
      {invitationPopup ? (
        <ModalNew
          open={invitationPopup}
          onClose={() => setInvitationPopup(false)}
        >
          <div className="h-[658px] w-[852px] px-8 py-2">
            <h1 className="text-edenGreen-600">
              Invite your fav candidates for a follow up call.
            </h1>
            <div className="mt-9 flex flex-row items-center justify-end gap-4">
              <div>
                <p className="text-edenGreen-600 font-Moret text-base">
                  Where should we setup the call?
                </p>
                <p className="text-edenGray-500 text-sm">
                  Add your calendly, cal, cron ..
                </p>
              </div>
              <div className="relative">
                <input
                  id="meetingink"
                  type="text"
                  value={secondMeetingLink}
                  onChange={handleSecondMeetingLinkChange}
                  className="border-edenGray-500 bg-edenPink-200 h-8 w-52 rounded-lg border p-2 pl-8"
                  placeholder=""
                />
                <div className="absolute left-1 top-1">
                  <svg
                    width="21"
                    height="21"
                    viewBox="0 0 21 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.16455 12.8371C10.5846 14.7355 13.2748 15.1238 15.1733 13.7037C15.3376 13.5803 15.4933 13.4458 15.6381 13.3011L17.6073 11.332C19.2545 9.62675 19.2068 6.9093 17.5016 5.26197C15.8382 3.65551 13.2008 3.65551 11.5364 5.26197"
                      stroke="#00462C"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M12.7102 9.50469C11.2902 7.60625 8.59999 7.21804 6.70152 8.63805C6.53721 8.76146 6.38143 8.89604 6.2367 9.04076L4.26758 11.0099C2.62025 12.7151 2.66793 15.4326 4.37314 17.0798C6.03664 18.6871 8.67405 18.6871 10.3384 17.0798"
                      stroke="#00462C"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="scrollbar-hide h-[calc(100%-100px)] overflow-y-auto">
              {approvedTalentListCandidatesList.map((candidate, index) =>
                candidate.user?._id === selectedInvitationCandidateID ? (
                  <div
                    className="flex flex-col items-center bg-white pb-4 pl-2 pr-4 pt-2"
                    key={`interviewmeeting${index}`}
                  >
                    <div className="mb-7 flex w-full flex-row items-center justify-between">
                      <div className="flex flex-row items-center content-none">
                        <Avatar
                          src={candidate.user?.discordAvatar || ""}
                          size="lg"
                        />
                        <p className="text-edenGreen-600 font-Moret ml-4 text-lg">
                          {candidate.user?.discordName || ""}
                        </p>
                      </div>
                      <Button
                        variant="primary"
                        className="h-11 w-[94px]"
                        disabled={secondMeetingLink === "" ? true : false}
                      >
                        Send
                      </Button>
                    </div>
                    <div className="px-1">
                      <p>
                        {
                          "Hi Tom - we're thoroughly impressed by your experience working with the European Union and it sounds like that experience will come in very handy while working on our brand new products that we'll be launching soon, I did have a couple of additional questions and wanted to invite you for a call here:"
                        }
                      </p>
                    </div>
                  </div>
                ) : (
                  <button
                    className="border-edenGreen-600 my-2 flex flex-row items-center justify-between border-b px-4 py-2"
                    key={`interviewmeeting${index}`}
                    onClick={() =>
                      setSelectedInvitationCandidateID(
                        candidate.user?._id || ""
                      )
                    }
                  >
                    <div className="flex flex-row items-center content-none">
                      <Avatar
                        src={candidate.user?.discordAvatar || ""}
                        size="lg"
                      />
                      <p className="text-edenGreen-600 font-Moret ml-4 text-lg">
                        {candidate.user?.discordName || ""}
                      </p>
                    </div>
                    <div
                      onClick={() =>
                        setSelectedInvitationCandidateID(
                          candidate.user?._id || ""
                        )
                      }
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.5 5L15.5 12L8.5 19"
                          stroke="black"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                  </button>
                )
              )}
            </div>
          </div>
        </ModalNew>
      ) : null}
      {isOpen && letterType && (
        <EdenAiLetter
          member={dataMember?.findMember}
          isModalOpen={isOpen}
          letterType={letterType}
          onClose={() => {
            setIsOpen(false);
          }}
          onSubmit={() => {
            handleAddCandidatesToList!(
              (letterType === "rejection"
                ? talentListsAvailables!.find(
                    (list) => list.name === "Rejected"
                  )!._id
                : talentListsAvailables!.find(
                    (list) => list.name === "Accepted"
                  )!._id)!
            );
          }}
        />
      )}

      {addToListOpen && (
        <div
          className={`scrollbar-hide absolute left-0 top-6 z-40 max-h-[120px] w-[140px] overflow-y-scroll rounded-md border border-gray-200 bg-white hover:text-gray-600
            ${addToListOpen ? "" : "h-0"}`}
        >
          <div
            className="cursor-pointer border-b border-gray-200 p-1 last:border-0 hover:bg-gray-100"
            onClick={handleCreateNewList}
          >
            <p className="">
              <HiOutlineDocumentPlus size={16} className="mb-1 mr-1 inline" />
              New list
            </p>
          </div>
          {talentListsAvailables.map((list, index) => (
            <div
              key={index}
              className="cursor-pointer border-b border-gray-200 p-1 last:border-0 hover:bg-gray-100"
              onClick={() => handleAddCandidatesToList(list._id!)}
            >
              <p className="">{list.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

PositionCRM.getLayout = (page: any) => (
  <AppUserLayoutNew>{page}</AppUserLayoutNew>
);

export default PositionCRM;

import { CompanyContext } from "@eden/package-context";
import { IncomingMessage, ServerResponse } from "http";
import dynamic from "next/dynamic";
import Head from "next/head";
import { getSession } from "next-auth/react";

export async function getServerSideProps(ctx: {
  req: IncomingMessage;
  res: ServerResponse;
  query: { slug: string };
}) {
  const session = await getSession(ctx);

  const url = ctx.req.url;

  if (!session) {
    return {
      redirect: {
        destination: `/?redirect=${url}`,
        permanent: false,
      },
    };
  }

  if (session.accessLevel === 5) {
    return {
      props: { key: url },
    };
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/company-auth`,
    {
      method: "POST",
      body: JSON.stringify({
        userID: session.user!.id,
        companySlug: ctx.query.slug,
      }),
      headers: { "Content-Type": "application/json" },
    }
  );

  console.log(res.status);

  if (res.status === 401) {
    return {
      redirect: {
        destination: `/request-access?company=${ctx.query.slug}`,
        permanent: false,
      },
    };
  }

  if (res.status === 404) {
    return {
      redirect: {
        destination: `/create-company`,
        permanent: false,
      },
    };
  }

  const _companyAuth = await res.json();

  if (
    res.status === 200 &&
    _companyAuth.company.type !== "COMMUNITY" &&
    (!_companyAuth.company.stripe ||
      !_companyAuth.company.stripe.product ||
      !_companyAuth.company.stripe.product.ID)
  ) {
    return {
      redirect: {
        destination: `/${_companyAuth.company.slug}/dashboard/subscription`,
        permanent: false,
      },
    };
  }

  return {
    props: { key: url },
  };
}
